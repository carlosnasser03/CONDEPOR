# 🔐 SECURITY HARDENING - OWASP TOP 10 COMPLIANCE
## Vulnerabilidades Identificadas y Soluciones

---

# 📊 OWASP TOP 10 ANALYSIS

```
┌─────────────────────────────────────────┐
│    CONDEPOR SECURITY ASSESSMENT         │
├─────────────────────────────────────────┤
│                                          │
│ A1: Broken Access Control  🟡 MEDIUM   │
│ A2: Cryptographic Failures 🟡 MEDIUM   │
│ A3: Injection              🟢 LOW      │
│ A4: Insecure Design        🟢 LOW      │
│ A5: Security Misconfiguration 🔴 HIGH  │
│ A6: Vulnerable Components  🟡 MEDIUM   │
│ A7: Authentication         🟢 LOW      │
│ A8: Data Integrity         🟡 MEDIUM   │
│ A9: Logging & Monitoring   🔴 HIGH     │
│ A10: SSRF                  🟢 LOW      │
│                                          │
└─────────────────────────────────────────┘
```

---

# 🔴 CRITICAL SECURITY ISSUES

## CRITICAL-1: No Input Validation (A3: Injection)

**Risk Level:** 🔴 CRITICAL

**Vulnerability:**
```typescript
// ❌ VULNERABLE
async createMatch(req: Request, res: Response) {
  const { categoryId, homeTeamId, awayTeamId, date, venue } = req.body;
  
  // Directamente a database sin validar
  const match = await prisma.match.create({
    data: { categoryId, homeTeamId, awayTeamId, date, venue }
  });
}
```

**Impacts:**
- SQL Injection possible (though Prisma mitigates)
- Invalid data types in database
- Data integrity issues

**Solution:** Already provided in Backend Fixes (FIX 3: Input Validation with Zod)

**Status:** 📋 See `02_BACKEND_FIXES.md` - FIX 3

---

## CRITICAL-2: .env Files Exposure

**Risk Level:** 🔴 CRITICAL

**Vulnerability:**
- DATABASE_URL could be committed
- API keys exposed
- Secrets visible in git history

**Solution:**

```bash
# Immediately:
git rm --cached .env
git rm --cached backend/.env
git rm --cached frontend/.env.local

# Add to .gitignore (root)
echo ".env*" >> .gitignore

# If secrets were committed, rotate:
1. Supabase: Change database password
2. Generate new API keys
3. Update environment variables everywhere
4. Force push (if allowed): git push --force-with-lease
```

**Prevention:**
- Use `.env.example` for template
- Never commit `.env` files
- Use GitHub Secrets for CI/CD
- Regular secret audits

**Status:** 📋 See `04_DEVOPS_INFRASTRUCTURE.md` - FIX 1

---

## CRITICAL-3: Missing CORS Security Headers

**Risk Level:** 🔴 CRITICAL

**Vulnerability:**
```typescript
// ❌ CURRENT (VULNERABLE)
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true,
}));
```

Issues:
- Wildcard CORS not set, but fallback to localhost
- In production, hardcoded fallback
- Credentials exposed unnecessarily

**Solution:** See `02_BACKEND_FIXES.md` - FIX 5

**Verification:**
```bash
# Test CORS headers
curl -i -X OPTIONS http://localhost:4000/api/health \
  -H "Origin: http://malicious.com"

# Should return 403 or error, NOT allow
```

---

# 🟠 HIGH PRIORITY SECURITY ISSUES

## HIGH-1: Missing Security Headers (A5)

**Risk Level:** 🟠 HIGH

**Vulnerable:**
```javascript
// ❌ Headers missing from Express app
```

**Missing Headers:**
- `Content-Security-Policy` (CSP)
- `X-Content-Type-Options`
- `X-Frame-Options`
- `Strict-Transport-Security`
- `Referrer-Policy`
- `Permissions-Policy`

**Solution:**

**Backend:** `backend/src/app.ts`

```typescript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "http://localhost:3000"],
      frameSrc: ["none"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
    },
  },
  frameguard: {
    action: 'deny',
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin',
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));

// Additional security headers
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  next();
});
```

**Verification:**
```bash
# Test headers
curl -i http://localhost:4000/api/health
# Should see security headers in response
```

**Status:** 📋 See `02_BACKEND_FIXES.md` - FIX 9

---

## HIGH-2: No Rate Limiting on Critical Endpoints

**Risk Level:** 🟠 HIGH

**Vulnerability:**
- No DDoS protection
- Brute force attacks possible
- API abuse possible

**Solution:** See `02_BACKEND_FIXES.md` - FIX 4

**Verification:**
```bash
# Test rate limiting
for i in {1..150}; do
  curl http://localhost:4000/api/health
done

# Should start getting 429 (Too Many Requests) after 100
```

---

## HIGH-3: Insufficient Logging & Monitoring (A9)

**Risk Level:** 🟠 HIGH

**Vulnerable:**
```typescript
// ❌ Logs go to console only
console.error(err);
res.status(500).json({ error: 'Server error' });
```

Problems:
- No centralized logging
- No audit trail
- Impossible to debug production issues
- No security event tracking

**Solution:**

```typescript
// Structured logging with Winston
import logger from '@infrastructure/logger/Logger';

app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.path}`, {
    userId: req.user?.id,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});

// Error logging
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`[${error.name}] ${error.message}`, {
    error: error.stack,
    method: req.method,
    path: req.path,
    ip: req.ip,
  });
  res.status(500).json({ error: 'Server error' });
});
```

**With Sentry Integration:**
```typescript
import * as Sentry from '@sentry/node';

Sentry.captureException(error);
logger.error('Critical error captured', { errorId: error.event_id });
```

**Status:** 📋 See `02_BACKEND_FIXES.md` - FIX 8

---

## HIGH-4: No Input Type Validation (A3)

**Risk Level:** 🟠 HIGH

**Vulnerable:**
```typescript
// ❌ No validation
const { jerseyNumber } = req.body;
// jerseyNumber could be string, negative, 99999, etc
```

**Solution:** Zod validation (Backend FIX 3)

```typescript
const CreatePlayerSchema = z.object({
  jerseyNumber: z.number().int().min(1).max(99),
  // ...
});

// Automatic validation
const data = CreatePlayerSchema.parse(req.body);
```

---

## HIGH-5: API Endpoints Accessible Without Authentication

**Risk Level:** 🟠 HIGH

**Current State:** ✅ OK for MVP (no auth implemented)

**Future Implementation:** When authentication is added:

```typescript
// JWT middleware
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Apply to protected routes
app.use('/api/admin', verifyToken);
```

---

# 🟡 MEDIUM PRIORITY SECURITY ISSUES

## MEDIUM-1: Vulnerable Dependencies

**Risk Level:** 🟡 MEDIUM

**Check:**
```bash
cd backend
npm audit

cd ../frontend
npm audit
```

**Solutions:**
```bash
# Update all dependencies
npm update

# Fix security vulnerabilities
npm audit fix

# Review manual fixes
npm audit
```

**Automated:** GitHub Dependabot

Go to: GitHub Repo → Settings → Code security → Dependabot

---

## MEDIUM-2: No Database Row Level Security (RLS)

**Risk Level:** 🟡 MEDIUM

**Vulnerable:** All data accessible to anyone with database connection

**Solution (Supabase):**

```sql
-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Public read"
  ON teams FOR SELECT
  USING (true);

-- Admin only write
CREATE POLICY "Admin create"
  ON categories FOR INSERT
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- ... similar for other tables
```

**Status:** 📋 See `04_DEVOPS_INFRASTRUCTURE.md` - Supabase Setup

---

## MEDIUM-3: Error Messages Leak Information

**Risk Level:** 🟡 MEDIUM

**Vulnerable:**
```typescript
// ❌ Shows database errors
res.json({
  error: 'Unique constraint failed on teams.name_categoryId'
});
```

**Solution:**
```typescript
// ✅ Generic message in production
const isDev = process.env.NODE_ENV === 'development';

res.status(400).json({
  error: isDev ? err.message : 'Invalid request',
  ...(isDev && { details: err.meta }),
});
```

---

## MEDIUM-4: No HTTPS Enforcement

**Risk Level:** 🟡 MEDIUM

**Solution:**

**Backend (Supabase):** Automatic HTTPS ✅

**Frontend (Vercel):** Automatic HTTPS ✅

**Add header redirect:**
```typescript
app.use((req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'production' && !req.secure) {
    res.redirect(`https://${req.get('host')}${req.url}`);
  } else {
    next();
  }
});
```

---

## MEDIUM-5: Secrets in Logs

**Risk Level:** 🟡 MEDIUM

**Vulnerable:**
```typescript
logger.info('Database connected', { DATABASE_URL });
```

**Solution:**
```typescript
// Mask sensitive data
const maskSecret = (url: string) =>
  url.replace(/([a-zA-Z0-9]+):([^@]+)@/, '$1:***@');

logger.info('Database connected', {
  database: maskSecret(process.env.DATABASE_URL!),
});
```

---

# 🟢 LOW PRIORITY SECURITY ISSUES

## LOW-1: Missing .well-known Security Files

**Solution:**

Create `backend/public/.well-known/security.txt`:
```
Contact: security@condepor.com
Expires: 2025-12-31T23:59:59.000Z
Preferred-Languages: en, es
```

---

## LOW-2: No Subresource Integrity (SRI) for CDN

**Currently:** No external CDN resources

**If added:** Use SRI hashes:
```html
<script 
  src="https://cdn.example.com/library.js"
  integrity="sha384-abc123...def456"
  crossorigin="anonymous">
</script>
```

---

# 🔒 SECURITY CHECKLIST

```
AUTHENTICATION & AUTHORIZATION
[ ] Input validation on all endpoints (Zod)
[ ] CORS configured securely
[ ] Rate limiting enabled
[ ] Error messages don't leak info
[ ] RLS policies enabled (Supabase)

CRYPTOGRAPHY
[ ] HTTPS enforced everywhere
[ ] Sensitive data in .env
[ ] Secrets not in logs
[ ] Strong database password

INJECTION PROTECTION
[ ] SQL injection: Prisma prevents ✅
[ ] XSS: React prevents ✅
[ ] CSRF: Implement tokens when auth added

SECURITY HEADERS
[ ] Content-Security-Policy ✅
[ ] X-Content-Type-Options ✅
[ ] X-Frame-Options ✅
[ ] Strict-Transport-Security ✅
[ ] Referrer-Policy ✅
[ ] Permissions-Policy ✅

DEPENDENCY MANAGEMENT
[ ] npm audit clean
[ ] Regular updates
[ ] No known vulnerabilities
[ ] Dependabot enabled

MONITORING & LOGGING
[ ] Structured logging (Winston)
[ ] Error tracking (Sentry)
[ ] Security event logging
[ ] Audit trail maintained

SECRETS MANAGEMENT
[ ] .env in .gitignore ✅
[ ] No secrets in code ✅
[ ] No secrets in logs ✅
[ ] Regular secret rotation
[ ] Access control to secrets

INFRASTRUCTURE
[ ] Firewall rules
[ ] DDoS protection
[ ] Backup & recovery
[ ] Disaster recovery plan
```

---

# 🚀 SECURITY IMPLEMENTATION ROADMAP

## Phase 1 (Immediate - Before Production)
- ✅ Fix critical issues (SQLite, CORS, .env)
- ✅ Add input validation
- ✅ Security headers
- ✅ Rate limiting
- ✅ Structured logging

**Time:** 8-10 hours

## Phase 2 (Before Supabase Deploy)
- ✅ npm audit clean
- ✅ Sentry setup
- ✅ RLS policies
- ✅ Error handling secure
- ✅ Secrets not exposed

**Time:** 2-3 hours

## Phase 3 (After MVP)
- 🔲 Authentication (JWT)
- 🔲 Authorization (RBAC)
- 🔲 API key system
- 🔲 Audit logging
- 🔲 Pen testing

**Time:** 20+ hours

## Phase 4 (Long-term)
- 🔲 OAuth2 integration
- 🔲 2FA support
- 🔲 Rate limiting per user
- 🔲 IP whitelisting
- 🔲 SIEM integration

---

# 📞 SECURITY INCIDENT RESPONSE

**If you find a vulnerability:**

1. **Do NOT** create public issue
2. **Do** email: security@condepor.com
3. Include:
   - Vulnerability description
   - Proof of concept
   - Suggested fix
4. Response within 48 hours

---

# 📚 RESOURCES

- OWASP Top 10: https://owasp.org/Top10/
- OWASP Cheat Sheets: https://cheatsheetseries.owasp.org/
- npm audit: https://docs.npmjs.com/cli/v8/commands/npm-audit
- Sentry: https://sentry.io/
- Helmet.js: https://helmetjs.github.io/

---

**Fin de Security Hardening**

---

# ⏱️ TIEMPO TOTAL SECURITY

```
Critical Fixes:    4-5 horas
High Fixes:        6-8 horas
Medium Fixes:      2-3 horas
Monitoring Setup:  2-3 horas
Testing:           2-3 horas
───────────────
TOTAL:             16-22 horas

Parallelizable:    8-10 horas con 2 security engineers
```
