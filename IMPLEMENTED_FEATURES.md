# Implemented Features

This document tracks all the modules, features, and endpoints that have been successfully implemented in this project so far.

## 1. Core Authentication System (Standard JWT)
- **User Registration** (`POST /register`): Secure email and password registration.
- **User Login** (`POST /login`): Generates JWT Access Token (HS256) and Refresh Token.
- **Refresh Token Management** (`POST /refresh-token`, `POST /logout`): Refresh tokens are stored securely in `httpOnly` cookies.
- **Account Verification** (`GET /verify-email/:token`): Email verification flow using token links.
- **Password Management** (`POST /forgot-password`, `PUT /reset-password/:token`): Forgot Password and Reset Password flows.
- **Protected Routes** (`GET /me`): Middleware (`auth.middleware.js`) to protect routes using Bearer tokens.

## 2. OpenID Connect (OIDC) Provider System
Built an "Enterprise-Grade" OAuth2/OIDC Provider to allow third-party apps (like Jingalala) to "Login with ChaiAuth".
- **Asymmetric Cryptography**: Implemented RSA 2048-bit Public/Private key pairs for signing and verifying tokens securely.
- **Discovery Endpoint** (`GET /.well-known/openid-configuration`): Publishes OIDC metadata.
- **JWKS Endpoint** (`GET /.well-known/jwks.json`): Serves the Public Key for clients to verify `id_token` signatures.
- **Client Registration** (`POST /admin/register-client`): Registers third-party apps and generates `client_id` and `client_secret`.
- **Authorize Endpoint** (`GET & POST /o/authorize`): Handles user login/consent, verifies PKCE (`code_challenge`), `state`, `redirect_uri`, and generates a short-lived Authorization Code.
- **Token Endpoint** (`POST /o/token`): Exchanges the Authorization Code for RS256-signed `id_token`, `access_token`, and `refresh_token`.
- **Revoke Endpoint** (`POST /o/revoke`): Invalidates an active token by removing it from Redis.
- **UserInfo Endpoint** (`GET /o/userinfo`): Protected by a dedicated OIDC Middleware, verifies RS256 `access_token`, and returns user profile claims (e.g., `sub`, `email`, `name`).

## 3. Database & Infrastructure
- **Dockerized PostgreSQL**: Easy local development setup using `docker-compose.yml`.
- **Drizzle ORM**: Type-safe database queries.
- **Modular Schemas**: Separate schemas for `auth` (`users` table) and `oidc` (`clients` table).
- **Migration Workflow**: Configured robust migration scripts (`db:generate` and `db:migrate`).

## 4. Architecture & Utilities
- **Domain-Driven Design (DDD)**: Code is modularized into `/auth` and `/oidc` domains.
- **Constants Extraction**: Eradicated "Magic Strings" (like roles) across the codebase by centralizing them in `src/common/constants/`, reducing typos and enabling global updates.
- **Standardized Responses**: Custom `ApiResponse` class for consistent successful JSON responses.
- **Centralized Error Handling**: Custom `ApiError` class and global error handling middleware for predictable API errors.
- **Validation Layer**: Reusable `validate.middleware.js` integrated with Joi DTOs (`BaseDto`) to strictly validate `req.body` and `req.query`.

## 5. Security & Performance (API Gateway Level)
- **Centralized Configuration**: All environment variables are strictly validated using Joi on startup (`env.config.js`), ensuring early crashes if secrets are missing.
- **Rate Limiting (Redis)**: Implemented strict rate limiting (`authLimiter`: 5 req/min) for login/register endpoints and global rate limiting (100 req/15min) using `express-rate-limit` backed by **Redis** to prevent brute-force and DDoS attacks.
- **HTTP Security Headers**: Integrated **Helmet.js** to prevent XSS, Clickjacking, and other injection vulnerabilities.
- **CORS Configuration**: Restricted cross-origin resource sharing to only the allowed frontend domain.

## 6. Social Login (OAuth 2.0 Integration)
- **Provider Architecture** (`GET /providers/:provider`, `GET /providers/:provider/callback`): Implemented a highly scalable Strategy Pattern for third-party logins. Adding a new provider (e.g., GitHub, Facebook) only requires creating a single provider file without modifying routes or controllers.
- **Google Sign-In**: Fully integrated Google OAuth 2.0. Handles `access_type=offline`, account selection, and cryptographically verifies the `id_token` using Google's JWKS.
- **Account Linking**: Automatically merges Social Logins with existing email/password accounts if the email matches, or creates a passwordless account for new users.
