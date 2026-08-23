import crypto from "crypto";
import { db } from "../../common/config/db.js";
import { clientsTable } from "./oidc.schema.js";
import ApiError from "../../common/utils/api-error.js";
import { eq } from "drizzle-orm";
import * as authService from "../auth/auth.service.js";
import { generateOidcAccessToken, generateOidcIdToken, generateOidcRefreshToken } from "../../common/utils/jwt.utils.js";

// Memory Map jisme hum 1 minute ke liye Code save karenge (Future me ise Redis me dalenge)
export const authCodes = new Map();

export const refreshTokens = new Map(); // Refresh Tokens save karne ke liye


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
  email, password, client_id, redirect_uri, state, code_challenge, code_challenge_method
}) => {
  const client = await verifyClientForAuthorization(client_id, redirect_uri)

  const { user } = await authService.login({ email, password })

  const code = crypto.randomBytes(16).toString("hex");
  const expiresAt = Date.now() + 1 * 60 * 1000;

  authCodes.set(code, {
    userId: user.id,
    expiresAt,
    code_challenge,
    code_challenge_method,
  });

  return { code, redirectUri: client.redirectUri, state };
}

const exchangeCodeForToken = async ({ code, client_id, client_secret, redirect_uri, code_verifier }) => {
  const client = await verifyClientForAuthorization(client_id, redirect_uri)

  if (client_secret && client.clientSecret !== client_secret) {
    throw ApiError.unauthorized("Invalid client_secret");
  }
  const codeData = authCodes.get(code);

  if (!codeData) {
    throw ApiError.unauthorized("Invalid or expired authorization code");
  }

  if (Date.now() > codeData.expiresAt) {
    authCodes.delete(code); // Delete expired code
    throw ApiError.unauthorized("Authorization code has expired");
  }

  // TODO: Yahan hum aage chalkar PKCE (code_verifier) check karenge

  authCodes.delete(code);

  const idToken = generateOidcIdToken(codeData.userId, client_id)

  const accessToken = generateOidcAccessToken(codeData.userId, client_id)

  const refreshToken = generateOidcRefreshToken();

  refreshTokens.set(refreshToken, { userId: codeData.userId, clientId: client_id });

  return { idToken, accessToken, refreshToken }

}
export { registerClient, verifyClientForAuthorization, generateAuthorizationCode, exchangeCodeForToken };
