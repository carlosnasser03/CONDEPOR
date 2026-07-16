# 📘 CONDEPOR Deployment & DevOps Guide

This guide details the end-to-end architecture, continuous integration (CI/CD) pipelines, database migration strategy, and deployment workflows for **CONDEPOR (DeporteHN)**.

---

## 🏛️ System Architecture Overview

CONDEPOR is a modern, high-performance web platform built to manage youth football leagues across Honduras:

```
┌────────────────────────────────────────────────────────────────────────┐
│                          CLIENT TIER (Vercel)                          │
│   Next.js 14 (App Router) + Tailwind CSS + Framer Motion + SWR         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTPS / REST API
┌───────────────────────────────────▼────────────────────────────────────┐
│                       API SERVER TIER (Node/Express)                   │
│   Express + TypeScript + Prisma ORM + Helmet + Rate Limit + Sentry     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Transaction Pooler / PostgreSQL
┌───────────────────────────────────▼────────────────────────────────────┐
│                      DATABASE TIER (Supabase Cloud)                    │
│   PostgreSQL 15 + Row Level Security (RLS) + Automated Backups         │
└────────────────────────────────────────────────────────────────────────┘
```

---

## ⚙️ Local Development & Environment Setup

### 1. Prerequisites
- **Node.js**: v18.x or v20.x (LTS recommended)
- **npm**: v9.x or higher
- **PostgreSQL**: v15.x local instance or remote Supabase dev project

### 2. Backend Setup (`backend/`)

1. **Install Dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment Variables**:
   Copy the example template and fill in your connection string:
   ```bash
   cp .env.example .env
   ```
   Modify `backend/.env`:
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/condepor_dev?schema=public"
   PORT=4000
   NODE_ENV=development
   CORS_ORIGIN="http://localhost:3000"
   ```

3. **Run Database Migrations & Seed Data**:
   ```bash
   # Generate Prisma Client
   npx prisma generate

   # Apply development migrations
   npx prisma migrate dev --name init

   # Seed database with league categories and teams
   npm run seed
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```
   The backend API will run at `http://localhost:4000`.

### 3. Frontend Setup (`frontend/`)

1. **Install Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Configure Environment Variables**:
   ```bash
   cp .env.local.example .env.local
   ```
   Modify `frontend/.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4000/api
   ```

3. **Start Next.js Dev Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## 🧪 Testing & Quality Assurance

CONDEPOR utilizes **Vitest** for fast unit and integration testing across the backend and frontend.

### Running Backend Tests
```bash
cd backend

# Run Vitest test suite once (CI mode)
npx vitest run

# Run tests in interactive watch mode
npm run test

# Run TypeScript type check
npm run lint

# Build production bundle
npm run build
```

### Running Frontend Tests
```bash
cd frontend

# Run Next.js linting check
npm run lint

# Run TypeScript type check across App Router pages & components
npx tsc --noEmit

# Test production build generation
npm run build
```

---

## 🤖 GitHub Actions CI/CD Pipelines

All pull requests and pushes to `main` and `develop` are automatically checked and validated by our GitHub Actions workflows located in `.github/workflows/`.

### 1. Automated CI Pipeline (`ci.yml`)
- **Triggers**: Pushes and PRs targeting `main` or `develop`.
- **Service Containers**: Boots a transient **PostgreSQL 15 container** (`condepor_test`) with health-check probes.
- **Backend Verification (`backend-ci`)**:
  - Installs npm dependencies using clean cache (`npm ci`).
  - Generates Prisma Client against test database.
  - Runs TypeScript linting and type checks.
  - Compiles TypeScript to `dist/`.
  - Executes full unit and integration test suite (`npx vitest run`).
- **Frontend Verification (`frontend-ci`)**:
  - Installs npm dependencies (`npm ci`).
  - Executes Next.js linting and TypeScript verification (`npx tsc --noEmit`).
  - Compiles full production bundle (`npm run build`).

### 2. Deploy-Check Workflow (`deploy-check.yml`)
- **Triggers**: Pushes to `main`, PRs to `main`, or manual dispatch (`workflow_dispatch`).
- **Security Audit**: Scans git index (`git ls-files`) to ensure zero sensitive `.env`, `.pem`, `.key`, or `.cert` files are tracked.
- **Prisma PostgreSQL Hardening**: Inspects `backend/prisma/schema.prisma` to verify `provider = "postgresql"` and blocks any accidental `sqlite` configurations from reaching Supabase.
- **Migration & Schema Simulation**: Validates schema syntax and executes `npx prisma db push --skip-generate` against a clean PostgreSQL container to guarantee zero migration conflicts before production deployment.

---

## 🗄️ Database Migrations & Management Strategy

### Development Workflow
Whenever modifying `backend/prisma/schema.prisma`:
```bash
cd backend

# Create and apply migration locally
npx prisma migrate dev --name descriptive_migration_name

# Verify changes in visual Studio tool
npx prisma studio
```

### Production Deployment Strategy
When deploying to Supabase production:
1. **NEVER use `migrate dev` in production.** It attempts to prompt and generate dev files.
2. Always apply existing SQL migrations using `migrate deploy`:
   ```bash
   DATABASE_URL="postgresql://postgres:[SECRET]@db.[PROJECT].supabase.co:5432/postgres" npx prisma migrate deploy
   ```
3. Check migration status anytime:
   ```bash
   DATABASE_URL="postgresql://..." npx prisma migrate status
   ```

---

## 🚀 Step-by-Step Production Deployment

For the detailed checklist verifying security headers, rate limiting, Sentry integration, and Vercel domain DNS configurations, consult **[`PRODUCTION_CHECKLIST.md`](./PRODUCTION_CHECKLIST.md)**.
