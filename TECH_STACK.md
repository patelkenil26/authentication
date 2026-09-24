# Full-Stack Technology Stack

This document outlines the complete technology stack used and planned for this project. It serves as a quick reference for developers and a master list of the architectural choices made to build this Enterprise-Grade application.

## 1. Backend Stack (Fully Implemented) 🛠️

**Core & Architecture**
- **Node.js & Express.js**: High-performance asynchronous backend server.
- **Domain-Driven Design (DDD)**: Modular monolith architecture ensuring separation of concerns (e.g., `/auth` vs `/oidc`).

**Database & ORM**
- **PostgreSQL**: Relational database for robust, ACID-compliant data storage.
- **Drizzle ORM**: Extremely fast, type-safe ORM for writing SQL queries without boilerplate.
- **Docker**: Containerized PostgreSQL and Redis for seamless local development (`docker-compose.yml`).

**Security & Authentication**
- **JWT (JSON Web Tokens)**: Stateless authentication using symmetric (HS256) and asymmetric (RS256) cryptography.
- **bcrypt**: Secure, salted password hashing.
- **OAuth 2.0 & OIDC**: Full OpenID Connect provider flow with Consent screens and JWKS.
- **Helmet.js**: Injects HTTP headers to protect against XSS, clickjacking, and sniffing.
- **CORS**: Strictly configured Cross-Origin Resource Sharing.

**Performance & Anti-Abuse**
- **Redis (ioredis)**: In-memory database used for storing short-lived OIDC tokens and Rate Limiting IPs.
- **Rate Limiting**: `express-rate-limit` combined with `rate-limit-redis` to prevent brute-force and DDoS attacks.

**Validation & Utilities**
- **Joi**: Strict schema validation for incoming API requests (`req.body`, `req.query`) and environment variables (`env.config.js`).

---

## 2. Frontend Stack (Planned) 🎨

**Core Framework**
- **Next.js (App Router)**: The industry standard React framework providing Server-Side Rendering (SSR), SEO optimization, and Edge Middleware for security.
- **React**: Modern component-based UI library.

**UI & Styling**
- **Tailwind CSS**: Utility-first CSS framework for rapid, highly customizable styling.
- **Shadcn UI**: Unstyled, accessible component library for building premium "Silicon Valley" level interfaces (Buttons, Cards, Modals).
- **Framer Motion**: Powerful animation library for smooth page transitions and micro-interactions.

**State Management & Data Fetching**
- **Redux Toolkit (RTK)**: Managing complex Client-Side global state (e.g., UI themes, multi-step flows).
- **TanStack Query (React Query)**: Managing Server State. Handles automatic caching, background refetching, and loading states for API calls.

**Forms & Validation**
- **React Hook Form**: Performant, flexible, and extensible forms with easy-to-use validation.
- **Zod**: TypeScript-first schema declaration and validation library (pairs perfectly with React Hook Form for instant client-side errors).

- **Next.js Edge Middleware**: Intercepts requests at the edge to verify `httpOnly` JWT cookies and protect restricted routes (e.g., `/dashboard`) before the page even renders.

**Additional Modern Utilities**
- **TypeScript**: Absolute mandatory for modern enterprise frontend. Prevents runtime errors and provides perfect intellisense.
- **Lucide React**: The current industry standard for modern, clean, and customizable SVG icons (pairs with Shadcn).
- **Next-Themes**: Seamless and flicker-free Light/Dark mode switching.
- **Axios (Interceptors)**: Custom HTTP client to automatically attach tokens and silently refresh them in the background on `401 Unauthorized` errors.

---

## 3. Frontend Architecture Pattern (Planned) 🏗️

To prevent the frontend from becoming a messy "Spaghetti Code" as it grows, we will completely avoid the outdated flat folder structure (`/components`, `/hooks`, `/api`). 

Instead, we will strictly follow **Feature-Sliced Design (FSD)** / **Domain-Driven Design (DDD)**.

**Proposed Folder Structure:**
```text
src/
├── app/                      <-- Next.js App Router (Only page routing, no logic)
│   ├── (auth)/login/page.tsx
│   └── dashboard/page.tsx
│
├── features/                 <-- The Core of the App (Grouped by domain)
│   ├── auth/                 <-- All Auth Logic lives here
│   │   ├── components/       (LoginForm.tsx, GoogleButton.tsx)
│   │   ├── api/              (useLogin.ts, useRegister.ts -> TanStack Query hooks)
│   │   └── store/            (authSlice.ts -> Redux)
│   │
│   └── profile/              <-- Profile Logic
│
└── shared/                   <-- Global/Reusable things across all features
    ├── components/ui/        (Shadcn UI: Button.tsx, Input.tsx, Card.tsx)
    ├── lib/                  (axios.ts, utils.ts)
    └── store/                (store.ts -> Main Redux Store setup)
```
**Why this is the best?** If there is a bug in the Login system, you don't need to hunt through 5 different global folders. You just open `features/auth/` and everything you need (UI, API, State) is right there!
