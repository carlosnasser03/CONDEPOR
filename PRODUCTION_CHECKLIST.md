# 🚀 CONDEPOR Production Deployment Checklist

This document provides the exhaustive, production-readiness verification checklist and procedures for deploying **CONDEPOR (DeporteHN)** to **Supabase (PostgreSQL Database)** and **Vercel (Next.js Frontend + Express Backend API)**.

---

## 1. 🔍 Repository & Security Pre-Flight Checks

### Git Ignore & Secrets Verification
- [x] **Root `.gitignore` Hardened**: Verifies that `.env`, `.env.*`, `.pem`, `.key`, `.cert`, `node_modules/`, `.next/`, `dist/`, and `logs/` are strictly ignored.
- [x] **Backend `.gitignore` Hardened**: Blocks `backend/.env*` (except `!.env.example`), `dist/`, `.sqlite`, `.db`, and coverage reports.
- [x] **Frontend `.gitignore` Hardened**: Blocks `frontend/.env*` (except `!.env.local.example`), `.next/`, `out/`, `build/`, `dist/`, and Vercel temporary files.
- [ ] **No Leaked Secrets**: Run `git ls-files | grep -E '\.env|\.pem|\.key'` to confirm zero tracked secrets or private keys across the git history.
- [ ] **Environment Templates (`.env.example`) Provided**:
  - `backend/.env.example` exists with documented required variables (`DATABASE_URL`, `PORT`, `CORS_ORIGIN`, `NODE_ENV`).
  - `frontend/.env.local.example` exists with documented client variables (`NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_HERO_ANIMATION_URL`).

---

## 2. 🗄️ Supabase PostgreSQL Database Setup & Verification

### Database Provisioning
- [ ] **Supabase Project Created**: Project `condepor` created in the optimal geographic region (`us-east-1` or nearest to user base).
- [ ] **Connection String Secured**: Copy exact PostgreSQL connection URL from **Supabase Dashboard → Settings → Database**:
  ```env
  DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres?schema=public"
  ```
- [ ] **Connection Pooling Configured**: Use Supabase Transaction Pooler connection string (`port 6543`) for high-concurrency serverless execution if deploying via Vercel Serverless.

### Prisma Configuration & Migrations
- [x] **Provider Confirmed**: Verify `backend/prisma/schema.prisma` datasource uses `provider = "postgresql"` (never `"sqlite"` in production).
- [ ] **Schema Syntax Validation**: Run locally before deploying:
  ```bash
  cd backend && npx prisma validate
  ```
- [ ] **Production Migration Deployment**: Apply schema migrations cleanly to Supabase without generating dev history files:
  ```bash
  DATABASE_URL="postgresql://postgres:[PASSWORD]..." npx prisma migrate deploy
  ```
- [ ] **Initial Database Seeding**: Populate official league categories, teams, and seed reference data:
  ```bash
  DATABASE_URL="postgresql://postgres:[PASSWORD]..." npm run seed
  ```

### Row Level Security (RLS) & Backups
- [ ] **RLS Policies Enabled**: Execute security SQL in Supabase Dashboard (`SQL Editor`) to ensure table access security:
  ```sql
  ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
  ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
  ALTER TABLE players ENABLE ROW LEVEL SECURITY;
  ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
  ALTER TABLE player_match_stats ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "Allow public read categories" ON categories FOR SELECT USING (true);
  CREATE POLICY "Allow public read teams" ON teams FOR SELECT USING (true);
  CREATE POLICY "Allow public read players" ON players FOR SELECT USING (true);
  CREATE POLICY "Allow public read matches" ON matches FOR SELECT USING (true);
  ```
- [ ] **Automatic Backups Verified**: Confirm daily automated backups (`30-day retention`) and Point-in-Time Recovery (PITR) are enabled in Supabase settings.

---

## 3. 🌐 Vercel Deployment Setup (Next.js Frontend & Express Backend)

### Frontend Deployment on Vercel
- [ ] **GitHub Repository Linked**: Connect `carlosnasser03/CONDEPOR` inside Vercel Dashboard.
- [ ] **Project Build Configuration**:
  - **Framework Preset**: `Next.js`
  - **Root Directory**: `frontend`
  - **Build Command**: `npm run build`
  - **Output Directory**: `.next`
- [ ] **Frontend Environment Variables Set in Vercel Settings**:
  | Variable Name | Production Value | Environment |
  | :--- | :--- | :--- |
  | `NEXT_PUBLIC_API_URL` | `https://api.condepor.com/api` (or custom backend URL) | Production / Preview |
  | `NEXT_PUBLIC_HERO_ANIMATION_URL` | `https://...` (if applicable) | Production / Preview |
  | `NEXT_PUBLIC_SENTRY_DSN` | `https://key@sentry.io/project-id` | Production |

### Backend API Deployment
- [ ] **Hosting Environment Selected**: Deploy Node/Express backend (`backend/`) on Vercel (via Serverless Express adapter), Railway, Render, or dedicated container instance.
- [ ] **Backend Environment Variables Set**:
  | Variable Name | Production Value | Security Scope |
  | :--- | :--- | :--- |
  | `DATABASE_URL` | `postgresql://postgres:[PASSWORD]@db.[ID].supabase.co:5432/postgres` | **Sensitive / Encrypted** |
  | `NODE_ENV` | `production` | Standard |
  | `PORT` | `4000` (or runtime assigned `$PORT`) | Standard |
  | `CORS_ORIGIN` | `https://condepor.com,https://www.condepor.com` | Standard |
  | `SENTRY_DSN` | `https://key@sentry.io/project-id` | **Sensitive / Encrypted** |
- [ ] **CORS Hardening Verified**: Confirm backend CORS middleware strictly allows requests ONLY from the authorized production domain (`https://condepor.com`).

---

## 4. 🛡️ Security, Performance & Monitoring Audit

### Security Hardening
- [ ] **Rate Limiting Active**: Verify `express-rate-limit` middleware prevents brute-force attacks and DDOS on `/api/*` routes.
- [ ] **HTTP Security Headers**: Verify `helmet` secures HTTP headers (`CSP`, `X-Content-Type-Options`, `X-Frame-Options`, `HSTS`).
- [ ] **Input Validation & Sanitization**: Ensure all backend REST API endpoints validate payload parameters using DTOs or validation schemas.

### Performance & Bundle Optimization
- [ ] **Next.js Bundle Size Checked**: Verify initial JS payload is `< 500KB`. Run build analysis:
  ```bash
  cd frontend && npm run build
  ```
- [ ] **Image Optimization**: Ensure images use Next.js `<Image />` component with configured `remotePatterns` in `next.config.mjs`.

### Error Tracking (Sentry)
- [ ] **Sentry SDK Initialized**: Verify both `@sentry/node` (backend) and `@sentry/nextjs` (frontend) successfully capture unhandled exceptions and performance traces in production.

---

## 5. 🤖 GitHub Actions CI/CD Verification

- [ ] **CI Pipeline (`.github/workflows/ci.yml`) Green**:
  - Automatically triggers on `push` and `pull_request` to `main` and `develop`.
  - Spins up ephemeral PostgreSQL 15 container to validate Prisma schema client generation.
  - Passes TypeScript compilation (`tsc --noEmit`), code linting, and full unit/integration test suite (`npx vitest run`).
  - Builds production artifacts for both `backend` (`dist/`) and `frontend` (`.next/`).
- [ ] **Deploy-Check Pipeline (`.github/workflows/deploy-check.yml`) Green**:
  - Verifies zero tracked `.env` or `.pem`/`.key` files across repository history.
  - Verifies `schema.prisma` explicitly uses `provider = "postgresql"` (blocks SQLite).
  - Validates syntax of `schema.prisma` and existence of `.env.example` templates.
  - Simulates `prisma db push` and `prisma migrate status` against a clean staging PostgreSQL instance.

---

## 6. 🔄 Post-Deployment Verification & Rollback Procedures

### Live Smoke Testing
- [ ] **Health Endpoint Verification**: Hit `GET https://api.condepor.com/api/health` and verify `{ status: "ok", database: "connected" }`.
- [ ] **Frontend Application Walkthrough**:
  - Homepage visual check & responsive layout verification across mobile and desktop.
  - League tables, category navigation, and team profile loading from live PostgreSQL database.
- [ ] **Sentry Dashboard Check**: Monitor real-time logs during first 30 minutes for any unhandled exceptions.

### Emergency Rollback Procedures
- **Frontend Rollback (Vercel)**:
  1. Navigate to **Vercel Dashboard → Deployments**.
  2. Locate the last stable deployment build.
  3. Click **Three Dots (...) → Promote to Production** (instant zero-downtime switch).
- **Backend Rollback (Supabase Database)**:
  1. If bad migration occurred, go to **Supabase Dashboard → Settings → Backups**.
  2. Select point-in-time recovery timestamp right before deployment and click **Restore**.
  3. Revert git branch, create compensating migration, and redeploy stable API artifact.
