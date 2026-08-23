import crypto from "crypto";
import jwt from "jsonwebtoken";
import { PRIVATE_KEY, PUBLIC_KEY } from "./cert.js";

const issuer = process.env.ISSUER_URL || "http://localhost:5000";

const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  });
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  });
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

const generateResetToken = () => {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  return { rawToken, hashedToken };
};

const generateOidcIdToken = (userId, clientId) => {
  return jwt.sign(
    {
      sub: userId,
      aud: clientId
    },
    PRIVATE_KEY,
    {
      algorithm: "RS256",
      expiresIn: "1h",
      issuer
    }
  )
}

const generateOidcAccessToken = (userId, clientId) => {
  return jwt.sign(
    { sub: userId, client_id: clientId },
    PRIVATE_KEY,
    { algorithm: "RS256", expiresIn: "1h", issuer }
  );
};

const generateOidcRefreshToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

const verifyOidcAccessToken = (token) => {
  return jwt.verify(token, PUBLIC_KEY, { algorithms: ["RS256"] });
};

export {
  generateResetToken,
  generateAccessToken,
  verifyAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  generateOidcIdToken,
  generateOidcAccessToken,
  generateOidcRefreshToken,
  verifyOidcAccessToken
};
