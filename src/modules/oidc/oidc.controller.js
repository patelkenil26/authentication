import jose from "node-jose";
import { PUBLIC_KEY } from "../../common/utils/cert.js";
import {
  exchangeCodeForToken,
  generateAuthorizationCode,
  registerClient,
  verifyClientForAuthorization,
} from "./oidc.service.js";
import ApiResponse from "../../common/utils/api-response.js";
import ApiError from "../../common/utils/api-error.js";
import * as authService from "../auth/auth.service.js";

export const getOpenIdConfiguration = (req, res) => {
  const ISSUER = `${req.protocol}://${req.get("host")}`;

  return res.json({
    issuer: ISSUER,
    authorization_endpoint: `${ISSUER}/o/authenticate`,
    token_endpoint: `${ISSUER}/o/token`,
    userinfo_endpoint: `${ISSUER}/o/userinfo`,
    jwks_uri: `${ISSUER}/.well-known/jwks.json`,
  });
};

export const getJwks = async (req, res) => {
  try {
    const key = await jose.JWK.asKey(PUBLIC_KEY, "pem");
    return res.json({
      keys: [key.toJSON()],
    });
  } catch (error) {
    console.error("JWKS Error:", error);
    return res.status(500).json({ error: "Failed to fetch JWKS" });
  }
};

export const registerClientController = async (req, res, next) => {
  try {
    const clientData = await registerClient(req.body);

    ApiResponse.created(res, "Client Register Successfully", {
      clientId: clientData.clientId,
      clientSecret: clientData.clientSecret,
      displayName: clientData.displayName,
      redirectUri: clientData.redirectUri,
    });
  } catch (error) {
    next(ApiError.internal("Failed to register client"));
  }
};

export const authorizeController = async (req, res, next) => {
  try {
    const {
      client_id,
      redirect_uri,
      scope,
      state,
      code_challenge,
      code_challenge_method,
    } = req.query;

    const client = await verifyClientForAuthorization(client_id, redirect_uri);

    // TODO: Yahan se hum user ko apne React/Next.js ke Frontend Login page par bhejenge

    ApiResponse.ok(
      res,
      "Authorization Request Valid. Ready for login/consent.",
      {
        clientName: client.displayName,
        requestedScope: scope,

        authContext: {
          client_id,
          redirect_uri,
          scope,
          state,
          code_challenge,
          code_challenge_method,
        },
      },
    );
  } catch (error) {
    next(ApiError.badRequest(error.message));
  }
};

export const authorizeSubmitController = async (req, res, next) => {
  try {
    const result = await generateAuthorizationCode(req.body)

    ApiResponse.ok(res, "Login Successful. Redirecting to client...", {
      code: result.code,
      redirect_uri: result.redirectUri,
      state: result.state
    })
  } catch (error) {
    next(ApiError.badRequest(error.message));
  }
}

export const tokenController = async (req, res, next) => {
  try {
    const { idToken, accessToken, refreshToken } = await exchangeCodeForToken(req.body);

    res.status(200).json({
      id_token: idToken,
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: "Bearer",
      expires_in: 3600,
    });
  } catch (error) {
    next(ApiError.badRequest(error.message))
  }
}


export const userInfoController = async (req, res, next) => {
  try {
    const userId = req.oidcUser.sub;
    const user = await authService.getMe(userId);

    res.status(200).json({
      sub: user.id,
      name: user.name,
      email: user.email,
      email_verified: true,
    })
  } catch (error) {
    next(ApiError.badRequest(error.message));
  }
}

