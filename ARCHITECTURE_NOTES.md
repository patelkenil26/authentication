# Future Architecture & Optimization Notes

This document tracks all the future implementation plans, security optimizations, and architectural decisions discussed during development.

## 1. Security & Optimizations
- **Rate Limiting (API Gateway Level)**: Implement a Rate Limiter middleware (e.g., `express-rate-limit`) at the Express route level to prevent bot spam, DDoS attacks, and brute-force attempts. This acts as a guard at the main gate of the server, protecting both the application and the database from being overwhelmed by useless requests.

## 2. Database & Schema Design
- **SSO & Nullable Passwords**: In preparation for OIDC (Google Sign-In, etc.), the `password` column in the `users` table MUST be nullable. Users authenticating via 3rd-party providers will not have a local password hash. The application layer (Zod) will enforce password presence only for 'local' authentication flows.

## 3. Secure Deployment Checklist (Future)
- **HTTPS Enforcement**: Ensure the production server runs strictly on HTTPS so cookies with `secure: true` are transmitted safely.
- **Database Isolation**: The PostgreSQL database MUST NOT be accessible from the public internet. It should be placed in a private network (VPC) where only the backend server can communicate with it.
- **Secrets Management**: Double-check that `.env` is in `.gitignore`. Use proper Environment Variables injection on the hosting provider (Render, AWS, Vercel, Railway).
- **Monitoring & Logging (Bonus)**: Add a logging tool (like Winston or Datadog) to track failed login attempts, API crashes, and unusual traffic patterns.

## 4. Future Backend Tasks (Pending)
- **Real Email Provider Integration**: Replace console logs with a real email service (like Resend, SendGrid, or Nodemailer) to send actual "Verify Email" and "Reset Password" links to users.
- **Additional Social Providers**: Expand the `/providers` architecture by adding `github.provider.js` and `linkedin.provider.js` to offer users more login options.
- **OAuth Accounts Table (Scalable SSO)**: Instead of adding `google_id`, `github_id`, etc., to the `users` table, a separate `oauth_accounts` table should be used. This table links a `user_id` to a `provider` (e.g., Google, GitHub) and a `provider_account_id`. This is the industry standard (used by Auth.js/NextAuth) and allows a single user to link multiple social accounts to their profile without bloating the main `users` table.

## 3. Future "Identity Platform" Features (Auth0/Clerk Level)
The following advanced features are tracked for future phases to evolve ChaiAuth into a full-scale Identity Platform:
- **Enterprise SSO (SAML, SCIM)**: Integration for B2B customers to login via Microsoft Entra, Okta, etc., and automatic Just-In-Time (JIT) provisioning of employees.
- **Passkeys & WebAuthn**: Passwordless authentication using device biometrics (Fingerprint, FaceID, Windows Hello).
- **Multi-Tenancy & Organizations**: Allowing a single user to belong to multiple organizations or workspaces (B2B SaaS model) with Role-Based Access Control (RBAC).
- **Session & Device Management**: Giving users a dashboard to see active sessions (e.g., "Chrome on Windows") and remotely revoke them.
- **Admin Console & Analytics**: A comprehensive dashboard showing MAU (Monthly Active Users), login failures, audit logs, and security events.
- **Management API & Webhooks**: Programmatic access to manage users/clients and real-time events (e.g., `user.created`) to sync data with third-party apps.
