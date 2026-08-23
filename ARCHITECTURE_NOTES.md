# Future Architecture & Optimization Notes

This document tracks all the future implementation plans, security optimizations, and architectural decisions discussed during development.

## 1. Security & Optimizations
- **Rate Limiting (API Gateway Level)**: Implement a Rate Limiter middleware (e.g., `express-rate-limit`) at the Express route level to prevent bot spam, DDoS attacks, and brute-force attempts. This acts as a guard at the main gate of the server, protecting both the application and the database from being overwhelmed by useless requests.

## 2. Database & Schema Design
- **SSO & Nullable Passwords**: In preparation for OIDC (Google Sign-In, etc.), the `password` column in the `users` table MUST be nullable. Users authenticating via 3rd-party providers will not have a local password hash. The application layer (Zod) will enforce password presence only for 'local' authentication flows.
- **OAuth Accounts Table (Scalable SSO)**: Instead of adding `google_id`, `github_id`, etc., to the `users` table, a separate `oauth_accounts` table should be used. This table links a `user_id` to a `provider` (e.g., Google, GitHub) and a `provider_account_id`. This is the industry standard (used by Auth.js/NextAuth) and allows a single user to link multiple social accounts to their profile without bloating the main `users` table.
