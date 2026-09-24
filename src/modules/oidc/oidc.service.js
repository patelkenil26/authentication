import crypto from "crypto";
import { db } from "../../common/config/db.js";
import { clientsTable, consentsTable } from "./oidc.schema.js";
import ApiError from "../../common/utils/api-error.js";
import { eq } from "drizzle-orm";
import * as authService from "../auth/auth.service.js";
import { generateOidcAccessToken, generateOidcIdToken, generateOidcRefreshToken } from "../../common/utils/jwt.utils.js";

import redis from "../../common/config/redis.js";


const registerClient = async ({ displayName, applicationUrl, redirectUri }) => {
  // 1 generate client id
  const clientId = crypto.randomBytes(16).toString("hex");

  // 2 generate client secret
  const clientSecret = crypto.randomBytes(16).toString("hex");

  // 3 save to db
  const [newClient] = await db
    .insert(clientsTable)
    .values({
      clientId,
      clientSecret,
      displayName,
      applicationUrl,
      redirectUri,
    })
    .returning();

  return newClient;
};

const verifyClientForAuthorization = async (clientId, redirectUri) => {
  const [client] = await db
    .select()
    .from(clientsTable)
    .where(eq(clientsTable.clientId, clientId))
    .limit(1);

  if (!client) {
    throw ApiError.notFound(`Client not found`);
  }

  if (client.redirectUri !== redirectUri) {
    throw ApiError.badRequest(`Invalid redirect uri`);
  }

  return client;
};

const generateAuthorizationCode = async ({
  email, password, client_id, redirect_uri, state, code_challenge, code_challenge_method, scope, consent_granted
}) => {
  const client = await verifyClientForAuthorization(client_id, redirect_uri)

  if (!consent_granted) {
    throw ApiError.unauthorized("User denied the consent request");
  }

  const { user } = await authService.login({ email, password })

  await db.insert(consentsTable).values({
    userId: user.id,
    clientId: client_id,
    scopes: scope,
  }).onConflictDoNothing();

  const code = crypto.randomBytes(16).toString("hex");
  const expiresAt = Date.now() + 1 * 60 * 1000;

  await redis.set(`auth_code:${code}`, JSON.stringify({
    userId: user.id,
    scope,
    expiresAt,
    code_challenge,
    code_challenge_method,
  }), "EX", 60); // 60 seconds TTL

  return { code, redirectUri: client.redirectUri, state };
}

const exchangeCodeForToken = async ({ code, client_id, client_secret, redirect_uri, code_verifier }) => {
  const client = await verifyClientForAuthorization(client_id, redirect_uri)

  if (client_secret && client.clientSecret !== client_secret) {
    throw ApiError.unauthorized("Invalid client_secret");
  }
  const codeDataStr = await redis.get(`auth_code:${code}`);

  if (!codeDataStr) {
    throw ApiError.unauthorized("Invalid or expired authorization code");
  }

  const codeData = JSON.parse(codeDataStr);

  if (Date.now() > codeData.expiresAt) {
    await redis.del(`auth_code:${code}`);
    throw ApiError.unauthorized("Authorization code has expired");
  }

  // TODO: Yahan hum aage chalkar PKCE (code_verifier) check karenge

  await redis.del(`auth_code:${code}`);

  const idToken = generateOidcIdToken(codeData.userId, client_id)

  const accessToken = generateOidcAccessToken(codeData.userId, client_id, codeData.scope)

  const refreshToken = generateOidcRefreshToken();

  await redis.set(`oidc_refresh_token:${refreshToken}`, JSON.stringify({ 
    userId: codeData.userId, 
    clientId: client_id 
  }), "EX", 7 * 24 * 60 * 60); // 7 days TTL

  return { idToken, accessToken, refreshToken }

}

const revokeToken = async (token) => {
  await redis.del(`oidc_refresh_token:${token}`);
  return true;
}
export { registerClient, verifyClientForAuthorization, generateAuthorizationCode, exchangeCodeForToken, revokeToken };
