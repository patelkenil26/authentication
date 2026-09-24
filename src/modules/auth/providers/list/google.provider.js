import { OAuth2Client } from "google-auth-library";

import config from "../../../../common/config/env.config.js";

// Google Client Setup
const googleClient = new OAuth2Client(
  config.google.clientId,
  config.google.clientSecret,
  config.google.callbackUrl
);

export const getGoogleAuthUrl = () => {
  return googleClient.generateAuthUrl({
    access_type: "offline",
    scope: ["profile", "email"],
    prompt: "consent select_account"
  });
};

export const getGoogleProfile = async (code) => {
  const { tokens } = await googleClient.getToken(code);
  
  const ticket = await googleClient.verifyIdToken({
    idToken: tokens.id_token,
    audience: config.google.clientId,
  });
  
  const payload = ticket.getPayload();

  return {
    providerId: payload.sub,
    email: payload.email,
    name: payload.name,
    isVerified: payload.email_verified,
  };
};
