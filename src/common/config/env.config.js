import dotenv from "dotenv";
import Joi from "joi";

dotenv.config();

const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string().valid("production", "development", "test").default("development"),
  PORT: Joi.number().default(8000),
  
  API_URL: Joi.string().uri().default((parent) => `http://localhost:${parent.PORT}/api/v1`),
  FRONTEND_URL: Joi.string().uri().default("http://localhost:3000"),
  
  GOOGLE_CLIENT_ID: Joi.string().required().description("Google OAuth Client ID"),
  GOOGLE_CLIENT_SECRET: Joi.string().required().description("Google OAuth Client Secret"),
}).unknown();

const { value: envVars, error } = envVarsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  app: {
    port: envVars.PORT,
    env: envVars.NODE_ENV,
    apiUrl: envVars.API_URL,
    frontendUrl: envVars.FRONTEND_URL,
  },
  google: {
    clientId: envVars.GOOGLE_CLIENT_ID,
    clientSecret: envVars.GOOGLE_CLIENT_SECRET,
    callbackUrl: `${envVars.API_URL}/auth/providers/google/callback`
  }
};

export default config;
