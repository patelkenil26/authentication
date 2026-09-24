import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redis from "../config/redis.js"; // Our Redis connection instance

// 1. Strict Limiter (For Login, Register & Auth flows: Max 5 attempts per minute)
export const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute time window
  max: 5, // Limit each IP to 5 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  store: new RedisStore({
    // Method to send commands directly to ioredis client
    sendCommand: (...args) => redis.call(...args),
  }),
  message: {
    success: false,
    message: "Too many authentication attempts, please try again after 1 minute",
  },
});

// 2. Global Limiter (For all other normal APIs: Max 100 requests per 15 minutes)
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes time window
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args) => redis.call(...args),
  }),
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes",
  },
});
