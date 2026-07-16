# ⚽ CONDEPOR - DeporteHN Backend & Frontend

[![CI/CD Pipeline](https://github.com/carlosnasser03/CONDEPOR/actions/workflows/ci.yml/badge.svg)](https://github.com/carlosnasser03/CONDEPOR/actions/workflows/ci.yml)
[![Production Deploy Check](https://github.com/carlosnasser03/CONDEPOR/actions/workflows/deploy-check.yml/badge.svg)](https://github.com/carlosnasser03/CONDEPOR/actions/workflows/deploy-check.yml)
[![Database: PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%2015-4169E1.svg?style=flat&logo=postgresql)](https://supabase.com)
[![Frontend: Next.js 14](https://img.shields.io/badge/Frontend-Next.js%2014-black.svg?style=flat&logo=next.js)](https://nextjs.org)

**CONDEPOR (Comisión Nacional de Deportes, Educación Física y Recreación)** is the official full-stack web platform for managing youth football leagues, tournaments, teams, players, statistics, and match schedules across Honduras.

---

## 📦 Project Structure

```
CONDEPOR/
├── backend/                  # Node.js + Express REST API
│   ├── src/                  # Controllers, routes, services & middleware
│   ├── prisma/               # Prisma schema (PostgreSQL) & seed scripts
│   ├── package.json          # Backend scripts and dependencies
│   ├── tsconfig.json         # TypeScript configuration
│   └── .env.example          # Template for required environment variables
├── frontend/                 # Next.js 14 App Router application
│   ├── src/                  # Components, utilities, types & styling
│   ├── app/                  # Next.js App Router pages & API routes
│   ├── package.json          # Frontend dependencies & build scripts
│   ├── tsconfig.json         # TypeScript configuration
│   └── .env.local.example    # Template for public client environment variables
├── .github/
│   └── workflows/            # GitHub Actions CI/CD automation pipelines
│       ├── ci.yml            # Automated Build, Lint, Test & Type Check
│       └── deploy-check.yml  # Production Readiness & Security Verification
├── .gitignore Hardened       # Multi-layer gitignore blocking secrets & artifacts
├── DEPLOYMENT_GUIDE.md       # Comprehensive setup, migration & CI/CD guide
├── PRODUCTION_CHECKLIST.md   # Production readiness deployment checklist
└── README.md                 # Project root documentation
```

---

## ⚡ Quick Start & Local Setup

### 1. Clone & Prerequisites
Ensure you have **Node.js (v18+)** and **PostgreSQL (v15+)** running locally or a Supabase account.

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your local PostgreSQL DATABASE_URL
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```
The REST API will launch on `http://localhost:4000`.

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.local.example .env.local
# Verify NEXT_PUBLIC_API_URL=http://localhost:4000/api
npm run dev
```
Open [`http://localhost:3000`](http://localhost:3000) to view the CONDEPOR web application.

---

## 🧪 Testing & Quality Assurance

Both `backend` and `frontend` feature automated linting, type checks, and unit test suites:

### Backend Testing
```bash
cd backend
npm run lint         # TypeScript compilation check (noEmit)
npx vitest run       # Run automated unit/integration tests
npm run build        # Build production dist/ artifact
```

### Frontend Testing
```bash
cd frontend
npm run lint         # Run Next.js and ESLint verification
npx tsc --noEmit     # Check strict TypeScript types across App Router
npm run build        # Build Next.js production bundle (.next/)
```

---

## 🤖 GitHub Actions CI/CD Automation

CONDEPOR utilizes enterprise-grade CI/CD workflows under `.github/workflows/`:

1. **[`ci.yml`](./.github/workflows/ci.yml)** (`CI/CD Pipeline`):
   - Automatically executes on pull requests and pushes to `main` and `develop`.
   - Provisions an ephemeral PostgreSQL 15 service container.
   - Runs `npm ci`, generates Prisma Client, validates types, and runs `vitest` for the backend.
   - Runs `npm ci`, lints, checks types, and builds Next.js production bundles for the frontend.

2. **[`deploy-check.yml`](./.github/workflows/deploy-check.yml)** (`Production Readiness & Deployment Check`):
   - Triggers on pushes and PRs to `main`.
   - **Secret Leak Guard**: Scans repository index to guarantee zero `.env*`, `.pem`, or `.key` files are tracked.
   - **Supabase Compatibility Guard**: Verifies `prisma/schema.prisma` strictly uses `provider = "postgresql"` and blocks SQLite.
   - **Migration Simulation**: Validates schema syntax and simulates database push against a clean PostgreSQL container.

---

## 🚀 Deployment Documentation

For complete instructions on deploying CONDEPOR to production environments (**Supabase PostgreSQL** + **Vercel Next.js / Express Backend**), refer to our official guides:

- **📘 [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md)**: Detailed technical architecture, local vs staging workflows, migration rules (`prisma migrate deploy`), and Sentry/monitoring configuration.
- **📋 [`PRODUCTION_CHECKLIST.md`](./PRODUCTION_CHECKLIST.md)**: An exhaustive 10-point production readiness checklist covering pre-flight security checks, RLS policies, CORS hardening, rate limiting, and emergency rollback procedures.

---

## 👥 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Commit your changes: `git commit -m 'feat: add new tournament standings feature'`
3. Push to your branch: `git push origin feature/your-feature-name`
4. Open a Pull Request on GitHub and ensure all CI/CD Action checks pass green.

---

## 📄 License

ISC License - DeporteHN / CONDEPOR © 2024-2026.
