# Frontend UI/UX Design Requirements (Based on Backend Capabilities)

**To the Designer / AI:**
This document outlines the exact pages and UI components required for a highly secure, enterprise-grade Identity Provider application (similar to Auth0 or Clerk). The backend is 100% complete. Please design a **Premium, Modern, Clean, and Professional UI** that instantly "wows" the user. 

---

## 🎨 Design Aesthetic Goals
1. **Vibe**: Elite, trustworthy, and modern. Avoid generic Bootstrap-like designs.
2. **Components**: Use subtle shadows, frosted glass (Glassmorphism), or sleek dark-mode aesthetics (Neo-Brutalism/Vercel style).
3. **Typography**: Clean, sans-serif fonts (like Inter, Roboto, or Geist).
4. **Animations**: Buttons should feel tactile. Inputs should have smooth focus states.

---

## 📱 Phase 1: Ready to Build (Backend 100% Complete)
*These screens have fully functional backend APIs ready to be connected.*

### 1. Login Page (`/login`)
*The main gateway for users.*
- **Header**: Company Logo and "Welcome Back".
- **Form Fields**: 
  - `Email Address` (Input)
  - `Password` (Input - with a 'view password' eye icon)
- **Actions**:
  - "Sign In" (Primary Button)
  - "Forgot Password?" (Subtle Link)
- **Social Login Area**:
  - Divider: "Or continue with"
  - "Sign in with Google" (Button with Google Icon)
- **Footer**: "Don't have an account? Sign Up"

### 2. Registration Page (`/register`)
*For creating new local accounts.*
- **Header**: "Create an Account".
- **Form Fields**:
  - `Full Name` (Input)
  - `Email Address` (Input)
  - `Password` (Input - must show requirements e.g., 6+ chars)
  - `Account Type` (Dropdown/Radio: Customer or Seller)
- **Actions**:
  - "Create Account" (Primary Button)
- **Social Login Area**:
  - "Sign up with Google" (Button)
- **Footer**: "Already have an account? Sign In"

### 3. Forgot Password (`/forgot-password`) & Reset (`/reset-password`)
*Minimal utility pages.*
- **Forgot Screen**: Input for `Email` and a "Send Reset Link" button.
- **Reset Screen**: Inputs for `New Password` and `Confirm Password`, plus a "Update Password" button.

### 4. User Dashboard (`/dashboard`)
*The protected area users see after successful login.*
- **Sidebar / Navbar**: User Avatar, Name, and Logout button.
- **Main Area**: 
  - A "Welcome, [Name]" header.
  - A Profile Card showing: `Email`, `Account Role` (Customer/Seller), and `Account Status` (Verified/Unverified).
  - A "Security" section to update passwords.

### 5. OIDC Consent Screen (`/consent`)
*The most advanced screen. Shown when a third-party app tries to login using this system.*
- **Layout**: Usually a centered modal/card.
- **Header**: "[Third-Party App Name] wants to access your account."
- **Details**: "This will allow the app to view your name and email address."
- **User Context**: Display the currently logged-in user's mini-profile (Avatar + Email) so they know *who* they are authorizing as.
- **Actions**:
  - "Allow Access" (Primary, Green/Blue)
  - "Deny" (Secondary/Outline, Red/Grey)

### 6. Email Verification Status (`/verify`)
*An extremely premium, "Google-level" user experience for when a user clicks the email link.*
- **Layout**: A beautiful split-screen or large elevated card with premium SVG illustrations.
- **Success State (Magic UX)**: 
  - Instead of a static icon, use a **Fluid Lottie Animation** (e.g., an envelope opening, a shield locking, or a smooth glowing checkmark drawing itself).
  - Include an **Auto-Redirect**: "Email Verified! Teleporting you to your dashboard in 3s..." with a circular smooth progress bar.
- **Error State (Expired/Invalid)**: 
  - A sleek, non-intimidating error illustration.
  - **Smart Recovery**: Don't just show an error. Automatically show an input field pre-filled with their email and a "Send New Magic Link" button so they don't hit a dead end.

### 7. API Documentation Page (`/docs`)
*A beautiful docs page for developers integrating this Auth system. (No backend needed)*
- **Layout**: Sidebar with navigation links, main content area with code snippets.
- **Sections**: "Getting Started", "OAuth 2.0 Flow", "Endpoints".
- **Code Blocks**: Syntax-highlighted code snippets for cURL, Node.js, etc., explaining how to call `/o/authorize` and `/o/token`.

---

## 🚀 Phase 2: Future UI Roadmap (Backend Pending)
*These screens are for future advanced features. Their backend APIs have not been written yet.*

### 8. Developer Portal / App Registration (`/developer`)
*Where third-party developers register their apps to get API keys.*
- **Header**: "Developer Settings" or "Register New Client".
- **Form**: Input for `App Name` and `Redirect URIs`.
- **Credentials View**: Secure UI showing generated `Client ID` and `Client Secret`.

### 9. Admin Console (`/admin/users`)
*For the super-admins to manage the platform (Auth0 style user-management).*
- **Layout**: Sidebar dashboard (Analytics, Users, Clients).
- **Users Table**: A data table listing all registered users with their `Avatar`, `Name`, `Email`, `Role`, and `Status` (Verified/Unverified).
- **Actions**: Three-dot menu on each row to "Block User", "Reset Password", or "Delete Account".

### 10. Multi-Factor Authentication (2FA) Flow (`/mfa`)
*For future-proofing enterprise security.*
- **Setup Screen**: A clean UI showing a QR Code to scan with Google Authenticator, a "Copy Secret Key" button, and an input for the 6-digit verification code.
- **Verification Screen (Login Step 2)**: A focused, minimalist input (6 individual boxes) that auto-advances when the 6th digit is typed, asking for the TOTP code to complete login.
- **Recovery Codes**: A secure modal showing 10 backup codes with a "Download as PDF" button.

### 11. Security & Device Management (`/dashboard/security`)
*A dedicated dashboard tab giving users ultimate control over their account.*
- **Active Sessions View**: A list showing devices (e.g., "💻 Chrome on Windows 11" and "📱 Safari on iPhone") with their IP location and last active time.
- **Remote Logout**: A red "Revoke" button next to each session, and a global "Log out of all other devices" button.

---

## ⚙️ Functional Requirements (For Frontend Dev)
- **State**: The UI must handle loading states (spinners on buttons) while waiting for the backend.
- **Errors**: Show elegant toast notifications (red/green) for backend errors (e.g., "Invalid Credentials" or "Too many attempts, try again in 1 min").
- **Tokens**: The UI does not need to handle JWT saving manually. The backend sends `httpOnly` cookies automatically.
