# 🔴 BACKEND FIXES - CÓDIGO CORREGIDO
## Todas las correcciones listadas y código listo

---

# 📋 ÍNDICE DE CORRECCIONES

```
1. Cambiar Prisma SQLite → PostgreSQL
2. Agregar .env.example
3. Agregar input validation en Controllers
4. Implementar Rate Limiting
5. Hardened CORS
6. Async Error Handler
7. Remove Hardcoded IDs
8. Structured Logging
9. Security Headers
10. Environment Validation
```

---

# ✅ FIX 1: CAMBIAR PRISMA A POSTGRESQL

**Archivo:** `backend/prisma/schema.prisma`

**Cambiar de:**
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

**A:**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**Nota:** También cambiar `provider` de SQLite en `DATABASE_URL`:
- Antes: `file:./dev.db`
- Después: `postgresql://user:password@localhost:5432/condepor`

**Tiempo:** 5 min
**Verificación:** `npx prisma db push`

---

# ✅ FIX 2: AGREGAR .env.example

**Crear archivo:** `backend/.env.example`

```env
# ================================
# DATABASE CONFIGURATION
# ================================
# Para desarrollo local:
# DATABASE_URL="postgresql://user:password@localhost:5432/condepor"
# 
# Para Supabase:
# DATABASE_URL="postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres"
DATABASE_URL="postgresql://user:password@localhost:5432/condepor"

# ================================
# SERVER CONFIGURATION
# ================================
PORT=4000
NODE_ENV=development

# ================================
# CORS CONFIGURATION
# ================================
CORS_ORIGINS="http://localhost:3000,http://localhost:3001"

# ================================
# LOGGING
# ================================
LOG_LEVEL=info

# ================================
# OPTIONAL: Rate Limiting
# ================================
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Crear archivo:** `frontend/.env.local.example`

```env
# ================================
# API CONFIGURATION
# ================================
NEXT_PUBLIC_API_URL=http://localhost:4000/api

# ================================
# OPTIONAL: Animation URL (Lottie)
# ================================
NEXT_PUBLIC_HERO_ANIMATION_URL=""
```

**Instrucciones en README:**
```markdown
## Setup

1. Clone repository
2. Copy .env.example to .env.local:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.local.example frontend/.env.local
   ```
3. Update with your values
4. `npm install` in both directories
5. `npm run dev` in both directories
```

**Tiempo:** 10 min

---

# ✅ FIX 3: INPUT VALIDATION EN CONTROLLERS

**Instalar Zod:**
```bash
cd backend
npm install zod
npm install --save-dev @types/zod
```

**Crear archivo:** `backend/src/domain/validation/schemas.ts`

```typescript
import { z } from 'zod';

// CATEGORY SCHEMAS
export const CreateCategorySchema = z.object({
  name: z.string().min(1).max(255).trim(),
  color: z.string().regex(/^#([A-Fa-f0-9]{6})$/), // Hex color
  description: z.string().max(1000).optional(),
});

export const UpdateCategorySchema = CreateCategorySchema.partial();

// TEAM SCHEMAS
export const CreateTeamSchema = z.object({
  name: z.string().min(1).max(255).trim(),
  categoryId: z.string().cuid(),
  crestUrl: z.string().url().optional(),
});

export const UpdateTeamSchema = CreateTeamSchema.partial();

// PLAYER SCHEMAS
export const CreatePlayerSchema = z.object({
  name: z.string().min(1).max(255).trim(),
  position: z.enum(['Delantero', 'Medio', 'Defensa', 'Portero']),
  jerseyNumber: z.number().int().min(1).max(99),
  teamId: z.string().cuid(),
  categoryId: z.string().cuid(),
  photoUrl: z.string().url().optional(),
});

export const UpdatePlayerSchema = CreatePlayerSchema.partial();

// MATCH SCHEMAS
export const CreateMatchSchema = z.object({
  categoryId: z.string().cuid(),
  homeTeamId: z.string().cuid(),
  awayTeamId: z.string().cuid(),
  date: z.coerce.date(),
  venue: z.string().min(1).max(255).trim(),
  status: z.enum(['scheduled', 'in_progress', 'finished']).default('scheduled'),
});

export const UpdateMatchSchema = CreateMatchSchema.partial();

export const RecordMatchResultSchema = z.object({
  homeGoals: z.number().int().min(0),
  awayGoals: z.number().int().min(0),
  playerStats: z.array(z.object({
    playerId: z.string().cuid(),
    goals: z.number().int().min(0).default(0),
    assists: z.number().int().min(0).default(0),
    minutesPlayed: z.number().int().min(0).max(90).default(0),
    cleanSheet: z.boolean().default(false),
  })),
});

export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
export type CreateTeamInput = z.infer<typeof CreateTeamSchema>;
export type CreatePlayerInput = z.infer<typeof CreatePlayerSchema>;
export type CreateMatchInput = z.infer<typeof CreateMatchSchema>;
export type RecordMatchResultInput = z.infer<typeof RecordMatchResultSchema>;
```

**Actualizar CategoryController:**

```typescript
import { Request, Response } from 'express';
import { CategoryService } from '@application/CategoryService';
import { CreateCategorySchema } from '@domain/validation/schemas';
import { BadRequestError } from '@infrastructure/errors/AppError';

export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  async createCategory(req: Request, res: Response): Promise<void> {
    try {
      // Validar input
      const data = CreateCategorySchema.parse(req.body);
      
      // Crear categoría
      const category = await this.categoryService.createCategory(data);
      
      // Responder
      res.status(201).json({
        success: true,
        data: category,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new BadRequestError('Invalid request data', error.errors);
      }
      throw error;
    }
  }

  async getCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await this.categoryService.getCategories();
      res.json({
        success: true,
        data: categories,
      });
    } catch (error) {
      throw error;
    }
  }

  async getCategoryById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      // Validar ID format
      if (!id || id.length < 10) {
        throw new BadRequestError('Invalid category ID');
      }

      const category = await this.categoryService.getCategoryById(id);
      
      if (!category) {
        res.status(404).json({
          success: false,
          error: 'Category not found',
        });
        return;
      }

      res.json({
        success: true,
        data: category,
      });
    } catch (error) {
      throw error;
    }
  }

  async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data = UpdateCategorySchema.parse(req.body);

      const category = await this.categoryService.updateCategory(id, data);
      
      if (!category) {
        res.status(404).json({
          success: false,
          error: 'Category not found',
        });
        return;
      }

      res.json({
        success: true,
        data: category,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new BadRequestError('Invalid request data', error.errors);
      }
      throw error;
    }
  }

  async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const category = await this.categoryService.deleteCategory(id);
      
      if (!category) {
        res.status(404).json({
          success: false,
          error: 'Category not found',
        });
        return;
      }

      res.status(204).send();
    } catch (error) {
      throw error;
    }
  }
}
```

**Crear Error handling:**

**Archivo:** `backend/src/infrastructure/errors/AppError.ts`

```typescript
export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: any
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string, details?: any) {
    super(400, message, details);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(404, message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(401, message);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, message);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = 'Internal server error') {
    super(500, message);
  }
}
```

**Tiempo:** 2-3 horas
**Verificación:** Todos los controllers usan validación

---

# ✅ FIX 4: RATE LIMITING

**Archivo:** `backend/src/infrastructure/middleware/rateLimiter.ts`

```typescript
import rateLimit from 'express-rate-limit';
import express from 'express';

// General API limiter
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  keyGenerator: (req: express.Request) => {
    return req.ip || 'unknown';
  },
});

// Strict limiter for critical endpoints
export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 requests per windowMs
  skipSuccessfulRequests: true, // Don't count successful requests
  message: 'Too many attempts, please try again after 15 minutes.',
});

// Create endpoint limiter
export const createLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 creates per hour
  skipSuccessfulRequests: false,
  message: 'Too many resources created, please try again later.',
});
```

**Actualizar app.ts:**

```typescript
import { generalLimiter, strictLimiter } from '@infrastructure/middleware/rateLimiter';

// Apply general rate limiting to all API routes
app.use('/api/', generalLimiter);

// Apply strict rate limiting to critical endpoints
app.use('/api/matches/:id/result', strictLimiter);
app.use('/api/categories', createLimiter);
```

**Tiempo:** 30 minutos

---

# ✅ FIX 5: HARDENED CORS

**Archivo:** `backend/src/infrastructure/middleware/cors.ts`

```typescript
import cors, { CorsOptions } from 'cors';
import express from 'express';

export function getCorsOptions(): CorsOptions {
  const allowedOrigins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

  return {
    origin: function (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void
    ) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Development mode - allow localhost
      if (process.env.NODE_ENV === 'development') {
        if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
          return callback(null, true);
        }
      }

      // Production mode - check allowed origins
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS policy`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400, // 24 hours
  };
}
```

**Actualizar app.ts:**

```typescript
import { getCorsOptions } from '@infrastructure/middleware/cors';

app.use(cors(getCorsOptions()));

// Add security headers
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  next();
});
```

**Tiempo:** 20 minutos

---

# ✅ FIX 6: ASYNC ERROR HANDLER

**Archivo:** `backend/src/infrastructure/middleware/errorHandler.ts`

```typescript
import { Request, Response, NextFunction, Express } from 'express';
import { AppError } from '@infrastructure/errors/AppError';

// Wrap async functions to catch errors
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Global error handler
export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(`[ERROR] ${err.message}`, err);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
      ...(process.env.NODE_ENV === 'development' && { details: err.details }),
    });
    return;
  }

  // Handle validation errors
  if (err.name === 'ZodError') {
    res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: process.env.NODE_ENV === 'development' ? err : undefined,
    });
    return;
  }

  // Generic error
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
  });
}
```

**Actualizar routes:**

```typescript
import { asyncHandler } from '@infrastructure/middleware/errorHandler';

router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const team = await teamService.getTeamById(id);
    
    if (!team) {
      res.status(404).json({
        success: false,
        error: 'Team not found',
      });
      return;
    }

    res.json({
      success: true,
      data: team,
    });
  })
);

router.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const data = CreateTeamSchema.parse(req.body);
    const team = await teamService.createTeam(data);
    res.status(201).json({
      success: true,
      data: team,
    });
  })
);
```

**Actualizar app.ts:**

```typescript
import { errorHandler } from '@infrastructure/middleware/errorHandler';

// ... todas las rutas ...

// Error handler (DEBE SER AL FINAL)
app.use(errorHandler);
```

**Tiempo:** 1-2 horas

---

# ✅ FIX 7: REMOVE HARDCODED IDs

**Archivo:** `backend/src/app.ts`

**Cambiar de:**
```typescript
const selectedCat = categories.find((c: any) => c.id === queryCatId) 
  || categories[2] 
  || categories[0] 
  || { id: "cmrmgtd5e000013z3yfwke2kl" }; // ❌ Hardcoded
```

**A:**
```typescript
const defaultCategoryId = process.env.DEFAULT_CATEGORY_ID;

if (!defaultCategoryId && categories.length === 0) {
  console.warn('No categories found and DEFAULT_CATEGORY_ID not set');
}

const selectedCat = 
  categories.find((c: any) => c.id === queryCatId) ||
  categories[0] ||
  (defaultCategoryId ? { id: defaultCategoryId } : null);

if (!selectedCat) {
  // Handle gracefully - return empty default
  const fallbackId = defaultCategoryId || 'unknown';
  return res.json({
    project: 'DeporteHN - CONDEPOR Backend API',
    status: 'online',
    version: '1.0.0',
    message: 'No categories available. Run seed script to populate data.',
    endpoints: { /* ... */ },
  });
}
```

**Agregar a .env.example:**
```env
DEFAULT_CATEGORY_ID="cat_xxx_yyy_zzz"
```

**Tiempo:** 30 minutos

---

# ✅ FIX 8: STRUCTURED LOGGING

**Instalar:**
```bash
npm install winston
npm install --save-dev @types/winston
```

**Crear archivo:** `backend/src/infrastructure/logger/Logger.ts`

```typescript
import winston from 'winston';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) =>
      `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

const transports = [
  // Console transport
  new winston.transports.Console(),
  
  // Error file transport
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
  }),
  
  // All logs file transport
  new winston.transports.File({
    filename: 'logs/all.log',
  }),
];

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'debug',
  levels,
  format,
  transports,
});

export default logger;
```

**Usar en app.ts:**

```typescript
import logger from '@infrastructure/logger/Logger';

app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// En error handler
export function errorHandler(...) {
  logger.error(`[${err.name}] ${err.message}`, { error: err });
  // ...
}
```

**Tiempo:** 1-2 horas

---

# ✅ FIX 9: SECURITY HEADERS

**Archivo:** `backend/src/app.ts`

```typescript
import helmet from 'helmet';

// Apply helmet with custom CSP
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // Solo si es necesario
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", process.env.CORS_ORIGINS || 'localhost:3000'],
    },
  },
  frameguard: { action: 'deny' },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));

// Custom security headers
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  next();
});
```

**Tiempo:** 20 minutos

---

# ✅ FIX 10: ENVIRONMENT VALIDATION

**Crear archivo:** `backend/src/config/env.ts`

```typescript
import { z } from 'zod';

const EnvSchema = z.object({
  // Database
  DATABASE_URL: z.string().url('Invalid DATABASE_URL'),
  
  // Server
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  
  // CORS
  CORS_ORIGINS: z.string().default('http://localhost:3000'),
  
  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'debug']).default('info'),
  
  // Optional
  DEFAULT_CATEGORY_ID: z.string().optional(),
});

type Env = z.infer<typeof EnvSchema>;

let env: Env;

try {
  env = EnvSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('❌ Invalid environment variables:');
    error.errors.forEach((err) => {
      console.error(`  - ${err.path.join('.')}: ${err.message}`);
    });
  }
  process.exit(1);
}

export default env;
```

**Usar en server.ts:**

```typescript
import env from '@config/env';

const PORT = env.PORT;

async function startServer(): Promise<void> {
  try {
    console.log(`🔧 Environment: ${env.NODE_ENV}`);
    console.log(`📊 Database: ${env.DATABASE_URL.replace(/password.*@/, 'password:***@')}`);
    console.log(`🔐 CORS Origins: ${env.CORS_ORIGINS}`);
    
    // ... rest of startup ...
  }
}
```

**Tiempo:** 1 hora

---

# 📋 CHECKLIST DE IMPLEMENTACIÓN

```
[ ] FIX 1: SQLite → PostgreSQL en schema.prisma
[ ] FIX 2: Crear .env.example files
[ ] FIX 3: Implementar input validation (Zod)
[ ] FIX 4: Agregar rate limiting
[ ] FIX 5: Hardened CORS
[ ] FIX 6: Async error handler
[ ] FIX 7: Remover hardcoded IDs
[ ] FIX 8: Structured logging (Winston)
[ ] FIX 9: Security headers (Helmet)
[ ] FIX 10: Environment validation

Validaciones:
[ ] npm run lint (sin errores)
[ ] npm run build (sin errores)
[ ] npm run dev (inicia sin errores)
[ ] npm test (todos los tests pasan)
[ ] Verificar todas las rutas en Postman
```

---

# ⏱️ TIEMPO TOTAL

```
FIX 1:  5 min
FIX 2:  10 min
FIX 3:  2-3 horas
FIX 4:  30 min
FIX 5:  20 min
FIX 6:  1-2 horas
FIX 7:  30 min
FIX 8:  1-2 horas
FIX 9:  20 min
FIX 10: 1 hora
───────────────
TOTAL: 8-11 horas

Parallelizable: 4-5 horas con 2-3 programadores
```

---

**Fin de Backend Fixes**
