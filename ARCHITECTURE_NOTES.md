# Future Architecture & Optimization Notes

This document tracks all the future implementation plans, security optimizations, and architectural decisions discussed during development.

## 1. Secure Deployment Checklist (Future)
- **HTTPS Enforcement**: Ensure the production server runs strictly on HTTPS so cookies with `secure: true` are transmitted safely.
- **Database Isolation**: The PostgreSQL database MUST NOT be accessible from the public internet. It should be placed in a private network (VPC) where only the backend server can communicate with it.
- **Secrets Management**: Double-check that `.env` is in `.gitignore`. Use proper Environment Variables injection on the hosting provider (Render, AWS, Vercel, Railway).
- **Monitoring & Logging (Bonus)**: Add a logging tool (like Winston or Datadog) to track failed login attempts, API crashes, and unusual traffic patterns.
- **Email Service (Resend) Verification**: 
  - **Development Phase**: Currently on the free tier. Without a verified domain, emails can ONLY be sent to the registered Resend email address (sender appears as `onboarding@resend.dev`).
  - **Production Phase**: Before going live, MUST verify the custom production domain (e.g., `auth.yourdomain.com`) via DNS records in the Resend Dashboard. Once verified, emails can be sent to any external user (e.g., `noreply@yourdomain.com`).
## 2. High Priority / Immediate Next Steps (Pending)
These tasks must be completed before launching the backend to production:
- **Role-Based Access Control (RBAC) Middleware**: **[CRITICAL]** Create an `authorizeRole(['admin'])` middleware to protect sensitive routes (like the upcoming Admin Console APIs) from unauthorized access.
- **Dynamic Client Registration API (Developer Portal)**: **[CRITICAL]** Build the `POST /api/clients/register` API allowing third-party developers to dynamically register their apps and securely receive a `client_id` and `client_secret`.
- **Real Email Provider Integration**: Replace console logs with a real email service (like Resend, SendGrid, or Nodemailer) to send actual "Verify Email" and "Reset Password" links to users.
- **Additional Social Providers**: Expand the `/providers` architecture by adding `github.provider.js` and `linkedin.provider.js` to offer users more login options.

## 3. Future Template Requirements (For Phase 2 Features)
As we implement the advanced "Identity Platform" features in Phase 2, we must ensure we build the corresponding templates to maintain modularity in the `src/common/templates/` folder:
- **Magic Link Emails (`magic-link.email.js`)**: Required when we build the Passwordless Auth feature.
- **2FA SMS/Email (`otp.sms.js` & `otp.email.js`)**: Required when we implement Multi-Factor Authentication (MFA).
- **Webhook Payloads (`events.webhook.js`)**: Required when we build the B2B Management API to dispatch real-time events (`user.created`, `user.deleted`) to third-party developers.
- **OIDC Fallback Error Pages (`error.page.js`)**: Required for handling invalid `client_id` or `redirect_uri` scenarios where the backend cannot safely redirect back to the client.
- **Admin/Security Audit Alerts (`audit.email.js`)**: Alerts sent to Admin Console users for suspicious activities or monthly MAU reports.

## 4. Future "Identity Platform" Features (Auth0/Clerk Level)
The following advanced features are tracked for future phases to evolve ChaiAuth into a full-scale Billion-Dollar Identity Platform:
- **Two-Factor Authentication (2FA / MFA)**: Implement TOTP (Google Authenticator) or SMS codes by adding `mfa_enabled` and `mfa_secret` to the user schema.
- **Passwordless "Magic Links"**: Allow users to log in via a secure, one-time use token sent to their email, bypassing the need for a password.
- **Passkeys & WebAuthn**: Passwordless authentication using device biometrics (Fingerprint, FaceID, Windows Hello) relying on asymmetric public key cryptography.
- **Session & Device Management**: Track user sessions (Browser, IP, OS) in a new `sessions` table and provide a dashboard to remotely revoke active sessions (e.g., "Log out of all devices").
- **Multi-Tenancy & Organizations (B2B)**: Allow a single user to belong to multiple organizations or workspaces with varying Role-Based Access Control (RBAC) levels (e.g., Admin in Org A, Member in Org B).
- **Security Audit Logs**: Track every sensitive API action in an `audit_logs` table (e.g., "Failed login attempt from IP X", "Password changed") to display in a security dashboard.
- **Enterprise SSO (SAML, SCIM)**: Integration for B2B customers to login via Microsoft Entra, Okta, etc., and automatic Just-In-Time (JIT) provisioning of employees.
- **Admin Console & Analytics**: A comprehensive dashboard showing MAU (Monthly Active Users), login failures, audit logs, and security events.
- **Management API & Webhooks**: Programmatic access to manage users/clients and real-time events (e.g., `user.created`) to sync data with third-party apps.

## 5. Code Quality & Refactoring Roadmap (Strict Audit Findings)
To elevate this codebase from "Great" to "Flawless Enterprise Grade", the following architectural refactors should be implemented (ordered from easiest to hardest):
- **Cross-Module Boundaries Enforcement**: Configure strict ESLint rules (like `no-restricted-imports`) to programmatically ensure that domains (e.g., `/auth` and `/oidc`) do not bypass interfaces and access each other's databases directly.
- **Dependency Injection (DI)**: Refactor services to accept their dependencies (like the database instance) via constructors using a DI Container (e.g., Awilix). This decouples the code and makes isolated Unit Testing much easier.
- **TypeScript Migration**: The ultimate upgrade. Migrate the entire `.js` codebase to `.ts` to ensure compile-time type safety, better DTO strictness, and superior Developer Experience (DX).
