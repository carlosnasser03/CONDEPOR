# 🚀 DEVOPS & INFRASTRUCTURE - GUÍA COMPLETA
## GitHub Setup, CI/CD, Supabase, Vercel Deployment

---

# 📋 ÍNDICE

```
1. GitHub Repository Setup
2. .gitignore Configuration
3. GitHub Actions CI/CD Workflows
4. Supabase Configuration & Setup
5. Vercel Configuration & Deployment
6. Environment Management
7. Database Migrations
8. Monitoring & Error Tracking
9. Deployment Checklist
10. Production Procedure
```

---

# ✅ FIX 1: GITHUB REPOSITORY SETUP

**Crear archivo:** `.gitignore` (root directory)

```gitignore
# ================================
# Dependencies
# ================================
node_modules/
.pnp
.pnp.js

# ================================
# Testing
# ================================
/coverage

# ================================
# Next.js build output, cache and misc
# ================================
.next/
out/
build/
dist/

# ================================
# Misc
# ================================
.DS_Store
.AppleDouble
.LSOverride
*.pem
Thumbs.db
.vscode/
.idea/

# ================================
# Debug
# ================================
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# ================================
# Local env files (IMPORTANT!)
# ================================
.env
.env.local
.env.*.local
.env.production.local

# ================================
# IDE
# ================================
.vscode/*
!.vscode/settings.json
!.vscode/extensions.json
.idea/*
*.swp
*.swo

# ================================
# OS Files
# ================================
$RECYCLE.BIN/
ehthumbs.db

# ================================
# Logs
# ================================
logs/
*.log
```

**Crear archivo:** `README.md` (root)

```markdown
# CONDEPOR - DeporteHN Backend & Frontend

Full-stack application for managing youth football leagues.

## Project Structure

```
CONDEPOR/
├── backend/
│   ├── src/
│   ├── prisma/
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── frontend/
│   ├── src/
│   ├── app/
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.local.example
├── .github/
│   └── workflows/
├── .gitignore
└── README.md
```

## Quick Start

### Backend

```bash
cd backend
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment

### Supabase (Backend)

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed instructions.

### Vercel (Frontend)

Connect GitHub repository to Vercel dashboard and configure environment variables.

## Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit pull request

## License

ISC
```

**Tiempo:** 15 minutos

---

# ✅ FIX 2: GITHUB ACTIONS CI/CD WORKFLOWS

**Crear archivo:** `.github/workflows/backend-tests.yml`

```yaml
name: Backend CI

on:
  push:
    branches: [main, develop]
    paths:
      - 'backend/**'
      - '.github/workflows/backend-*.yml'
  pull_request:
    branches: [main, develop]
    paths:
      - 'backend/**'

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: condepor_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: 'backend/package-lock.json'

      - name: Install dependencies
        working-directory: backend
        run: npm ci

      - name: Run linter
        working-directory: backend
        run: npm run lint

      - name: Run type check
        working-directory: backend
        run: npm run build

      - name: Run tests
        working-directory: backend
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/condepor_test
        run: npm run test

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./backend/coverage/coverage-final.json
          flags: backend
```

**Crear archivo:** `.github/workflows/frontend-tests.yml`

```yaml
name: Frontend CI

on:
  push:
    branches: [main, develop]
    paths:
      - 'frontend/**'
      - '.github/workflows/frontend-*.yml'
  pull_request:
    branches: [main, develop]
    paths:
      - 'frontend/**'

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: 'frontend/package-lock.json'

      - name: Install dependencies
        working-directory: frontend
        run: npm ci

      - name: Run linter
        working-directory: frontend
        run: npm run lint

      - name: Build
        working-directory: frontend
        run: npm run build

      - name: Run tests
        working-directory: frontend
        run: npm run test

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./frontend/coverage/coverage-final.json
          flags: frontend
```

**Crear archivo:** `.github/workflows/security-scan.yml`

```yaml
name: Security Scan

on:
  push:
    branches: [main]
  schedule:
    - cron: '0 0 * * 0'  # Weekly

jobs:
  dependency-check:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Audit backend dependencies
        working-directory: backend
        run: npm audit --audit-level=moderate
        continue-on-error: true

      - name: Audit frontend dependencies
        working-directory: frontend
        run: npm audit --audit-level=moderate
        continue-on-error: true

  dependency-updates:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write

    steps:
      - uses: actions/checkout@v4

      - name: Run Dependabot
        uses: dependabot/fetch-metadata@v1
        id: metadata
```

**Tiempo:** 1 hora

---

# ✅ FIX 3: SUPABASE SETUP

**Crear archivo:** `docs/SUPABASE_SETUP.md`

```markdown
# Supabase Setup Guide

## Prerequisites

- GitHub account (already have)
- Supabase account: https://supabase.com

## Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Click "New Project"
3. Fill in:
   - Name: `condepor`
   - Database password: (strong password)
   - Region: Select closest to you (e.g., `us-east-1`)
4. Click "Create new project"
5. Wait 2-3 minutes for setup

## Step 2: Get Connection String

1. After project is created, go to: Settings → Database
2. Copy connection string for `postgresql://` URL
3. Format:
   ```
   postgresql://postgres:PASSWORD@db.PROJECT_ID.supabase.co:5432/postgres
   ```

## Step 3: Setup Environment Variables

### Supabase Environment

Go to Settings → API → Project API keys, copy:
- `ANON_KEY` (public key)
- `SERVICE_ROLE_KEY` (private key)

### Backend Configuration

Set in Vercel/production environment:
```
DATABASE_URL=postgresql://postgres:PASSWORD@db.PROJECT_ID.supabase.co:5432/postgres
NODE_ENV=production
```

## Step 4: Run Migrations

```bash
# Use Supabase connection string
DATABASE_URL="postgresql://..." npx prisma migrate deploy

# Or through web interface:
# Supabase Dashboard → SQL Editor → Run migrations
```

## Step 5: Enable RLS (Row Level Security)

In Supabase Dashboard:

```sql
-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_match_stats ENABLE ROW LEVEL SECURITY;

-- Create policy to allow reading all (public read)
CREATE POLICY "Allow public read"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Allow public read"
  ON teams FOR SELECT
  USING (true);

-- ... repeat for all tables
```

## Step 6: Seed Data

```bash
DATABASE_URL="postgresql://..." npm run seed
```

## Step 7: Test Connection

```bash
# From local machine
psql postgresql://postgres:PASSWORD@db.PROJECT_ID.supabase.co:5432/postgres

# Or in Node.js
npx prisma db push
```

## Backups

Supabase automatically:
- Daily backups (30 days retention)
- Point-in-time recovery
- Manual backup button in dashboard

To restore:
- Settings → Backups → Click "Restore"
```

**Tiempo:** 30 minutos (guide creation)

---

# ✅ FIX 4: VERCEL DEPLOYMENT

**Crear archivo:** `docs/VERCEL_SETUP.md`

```markdown
# Vercel Deployment Guide

## Step 1: Connect GitHub to Vercel

1. Go to https://vercel.com
2. Click "New Project"
3. Select GitHub repository: `carlosnasser03/CONDEPOR`
4. Select "frontend" as root directory
5. Click "Deploy"

## Step 2: Configure Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

Add:
```
NEXT_PUBLIC_API_URL=https://api.condepor.com/api
NEXT_PUBLIC_HERO_ANIMATION_URL=
```

Note: `NEXT_PUBLIC_*` variables are exposed to browser (safe to expose)

## Step 3: Configure Custom Domain

1. Go to: Vercel Dashboard → Domains
2. Add custom domain
3. Update DNS records:
   - CNAME: `cname.vercel-dns.com`
   - Or use Nameservers

## Step 4: Configure Build Settings

Framework: Next.js 14
Build Command: `npm run build`
Output Directory: `.next`
Root Directory: `frontend`

## Step 5: Deployment Strategy

Automatic on:
- Push to `main` branch (production)
- Push to other branches (preview)

Manual deployment:
```bash
npm i -g vercel
vercel deploy --prod
```

## Step 6: Monitor Deployment

Vercel Dashboard shows:
- Build status
- Deployment logs
- Error tracking (integrated)
- Analytics

## Environment Secrets

For sensitive data (API keys, etc.):
```
Settings → Environment Variables → Sensitive
```

These are NOT exposed to frontend.

## Rollback

If deployment fails:
1. Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click "Promote to Production"

Instant rollback with no downtime.
```

**Tiempo:** 30 minutos

---

# ✅ FIX 5: DATABASE MIGRATIONS

**Crear archivo:** `backend/prisma/migrations-guide.md`

```markdown
# Database Migrations Guide

## Initial Setup

```bash
# Create initial migration from schema
npx prisma migrate dev --name init

# This:
1. Generates migration SQL
2. Applies to local database
3. Generates Prisma Client
```

## Adding New Column

```bash
# Add column to schema.prisma
# Example: Add field to Player model

model Player {
  // ... existing fields
  nickname String?
}

# Create migration
npx prisma migrate dev --name add_player_nickname

# This generates a migration file in prisma/migrations/
```

## Schema Changes

### Safe Changes (No data loss):
- Add new table
- Add optional column
- Add unique index

### Unsafe Changes (Data loss possible):
- Remove column
- Change column type
- Make optional column required

### Verifying Changes

```bash
# Check current schema
npx prisma studio

# Validate schema syntax
npx prisma validate
```

## Production Migrations

```bash
# Don't use 'dev'!
# Instead: 'deploy' only applies, doesn't generate

DATABASE_URL="postgresql://..." npx prisma migrate deploy

# Check migration status
DATABASE_URL="postgresql://..." npx prisma migrate status
```

## Rollback (If needed)

```bash
# WARNING: Destructive operation!
# Only in development:
npx prisma migrate reset

# Production: Manual rollback
# 1. Revert schema.prisma to previous
# 2. Create new migration
# 3. Deploy new migration
```

## Supabase Migrations

Supabase provides web interface:
- Dashboard → SQL Editor
- Run migrations manually
- Backup before major changes

## Migration Files

Each migration creates:
- `migration.sql` - SQL statements
- `.snapshot.json` - Prisma schema state

Keep migrations:
- Small and focused
- In source control
- Well-named
```

**Tiempo:** 20 minutos

---

# ✅ FIX 6: MONITORING & ERROR TRACKING

**Instalar Sentry:**

```bash
cd backend
npm install @sentry/node

cd ../frontend
npm install @sentry/nextjs
```

**Backend:** `backend/src/index.ts`

```typescript
import * as Sentry from '@sentry/node';

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.Express({ request: true }),
    ],
  });
}

// ... rest of code
```

**Frontend:** `frontend/sentry.client.config.ts`

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.Replay({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

**Agregar a .env.example:**

```env
SENTRY_DSN=https://key@sentry.io/project-id
NEXT_PUBLIC_SENTRY_DSN=https://key@sentry.io/project-id
```

**Tiempo:** 1 hora

---

# ✅ FIX 7: PRODUCTION CHECKLIST

**Crear archivo:** `docs/PRODUCTION_CHECKLIST.md`

```markdown
# Production Checklist

## 1. Code Quality ✅
- [ ] All tests passing (>80% coverage)
- [ ] No console.logs in production code
- [ ] No hardcoded secrets
- [ ] TypeScript: no `any` types
- [ ] Linting: npm run lint passes

## 2. Security ✅
- [ ] .env files in .gitignore
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Helmet security headers
- [ ] Input validation on all endpoints
- [ ] Secrets rotated
- [ ] API keys are secure

## 3. Database ✅
- [ ] Migrations tested locally
- [ ] Backup strategy defined
- [ ] RLS policies enabled (Supabase)
- [ ] Indexes optimized
- [ ] Connection pooling enabled

## 4. Frontend ✅
- [ ] next.config.js optimized
- [ ] Images optimized
- [ ] Bundle size < 500KB
- [ ] Core Web Vitals passing
- [ ] Mobile responsive tested
- [ ] Accessibility tested
- [ ] Error boundary working

## 5. Backend ✅
- [ ] Error handling complete
- [ ] Logging structured
- [ ] Health check endpoint working
- [ ] Rate limiting tested
- [ ] CORS tested

## 6. Documentation ✅
- [ ] README complete
- [ ] API documentation updated
- [ ] Environment variables documented
- [ ] Deployment guide complete
- [ ] Troubleshooting guide

## 7. Deployment ✅
- [ ] GitHub Actions workflows green
- [ ] Supabase database ready
- [ ] Vercel environment variables set
- [ ] Custom domain configured
- [ ] SSL certificate valid
- [ ] DNS records updated

## 8. Monitoring ✅
- [ ] Sentry configured
- [ ] Error tracking active
- [ ] Performance monitoring
- [ ] Uptime monitoring setup
- [ ] Alert rules configured

## 9. Backups ✅
- [ ] Database backups enabled
- [ ] Recovery tested
- [ ] RTO/RPO defined
- [ ] Disaster recovery plan

## 10. Post-Deployment ✅
- [ ] Verify all endpoints working
- [ ] Test from multiple devices
- [ ] Monitor error logs
- [ ] Monitor performance metrics
- [ ] Team notified

## Final Sign-off

- [ ] Backend: Approved by Backend Lead
- [ ] Frontend: Approved by Frontend Lead
- [ ] DevOps: Approved by DevOps Engineer
- [ ] Security: Approved by Security Team
- [ ] Product: Approved by Product Owner
```

**Tiempo:** 20 minutos

---

# ✅ FIX 8: DEPLOYMENT PROCEDURE

**Crear archivo:** `docs/DEPLOYMENT_PROCEDURE.md`

```markdown
# Deployment Procedure

## Pre-Deployment (1 day before)

1. Merge all PRs to `develop`
2. Run full test suite
3. Manual testing on staging
4. Create release notes

## 6 hours before

```bash
cd backend
npm install
npm run lint
npm run build

cd ../frontend
npm install
npm run lint
npm run build
```

All must pass.

## 2 hours before

1. Take database backup:
   ```bash
   # Supabase: Settings → Backups → Manual Backup
   ```

2. Notify team on Slack:
   > "Deploying CONDEPOR backend + frontend in 2 hours"

3. Final security check:
   ```bash
   npm audit
   npm audit --production
   ```

## Deployment (30 min window)

### Step 1: Deploy Backend to Supabase

```bash
cd backend

# Environment variables
export DATABASE_URL="postgresql://..."
export NODE_ENV=production

# Migrations
npx prisma migrate deploy

# Verify
npx prisma studio
```

### Step 2: Deploy Frontend to Vercel

```bash
cd frontend

# Trigger deployment
git push origin main
# OR manual
vercel deploy --prod
```

### Step 3: Verify Deployment

1. Frontend: Open https://condepor.com
2. Check homepage loads
3. Check API connection
4. Check error logs (Sentry)

## Post-Deployment (1 hour after)

1. Monitor error logs
2. Monitor performance
3. Verify all endpoints
4. Test from multiple devices
5. Post to Slack:
   > "✅ CONDEPOR deployed successfully"

## Rollback (if needed)

### Frontend (Vercel)
1. Vercel Dashboard → Deployments
2. Find previous working version
3. Click "Promote to Production"
4. Instant rollback

### Backend (Supabase)
1. Restore database from backup
2. Re-run migrations if needed
3. Verify

## Status Monitoring

Check every 5 minutes for 30 minutes:
- https://condepor.com (should load)
- Sentry errors (should be none)
- Database logs
- API response times
```

**Tiempo:** 30 minutos

---

# 📋 DEVOPS CHECKLIST

```
SETUP:
[ ] .gitignore configured
[ ] README.md created
[ ] GitHub repository organized
[ ] .env.example files created
[ ] GitHub Actions workflows created

INFRASTRUCTURE:
[ ] Supabase project created
[ ] Database connected
[ ] Migrations tested
[ ] RLS policies configured
[ ] Backups enabled

DEPLOYMENT:
[ ] Vercel project linked
[ ] Environment variables set
[ ] Custom domain configured
[ ] SSL certificate valid
[ ] Auto-deployment enabled

MONITORING:
[ ] Sentry configured
[ ] Error tracking active
[ ] Performance monitoring
[ ] Uptime alerts setup
[ ] Log aggregation

DOCUMENTATION:
[ ] Deployment guide
[ ] Supabase setup guide
[ ] Vercel setup guide
[ ] Migrations guide
[ ] Production checklist
[ ] Procedure document
```

---

# ⏱️ TIEMPO TOTAL DEVOPS

```
Setup:           1-2 horas
CI/CD:           1-2 horas
Supabase:        1 hora
Vercel:          30 min
Migrations:      30 min
Monitoring:      1 hora
Documentation:   1-2 horas
───────────────
TOTAL:           6-9 horas

Parallelizable:  3-4 horas con 2 DevOps engineers
```

---

**Fin de DevOps & Infrastructure**
