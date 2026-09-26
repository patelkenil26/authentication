import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import config from "./common/config/env.config.js";
import authRoute from "./modules/auth/auth.routes.js";
import ApiError from "./common/utils/api-error.js";
import oidcRoute from "./modules/oidc/oidc.routes.js";
import { globalLimiter } from "./common/middleware/rate-limiter.middleware.js";

const app = express();

app.set("trust proxy", 1);

app.use(helmet());
app.use(cors({
  origin: config.app.frontendUrl,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(globalLimiter)
app.use("/api/auth", authRoute);
app.use("/", oidcRoute);

// Catch-all for undefined routes
app.all("{*path}", (req, res, next) => {
  next(ApiError.notFound(`Route ${req.originalUrl} not found`));
});

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

export default app;
