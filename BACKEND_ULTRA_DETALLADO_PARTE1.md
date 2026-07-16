# 🏆 DeporteHN - BACKEND COMPLETO (ULTRA DETALLADO)
## Implementación con SOLID, SCRUM y Arquitectura Desacoplada

---

# 📋 TABLA DE CONTENIDOS

1. [Estructura SCRUM](#estructura-scrum)
2. [Principios SOLID Aplicados](#principios-solid-aplicados)
3. [Arquitectura de Carpetas](#arquitectura-de-carpetas)
4. [Paso 1: Setup Inicial](#paso-1-setup-inicial)
5. [Paso 2: Database Schema](#paso-2-database-schema)
6. [Paso 3: Domain Layer (Lógica Pura)](#paso-3-domain-layer)
7. [Paso 4: Application Layer (Casos de Uso)](#paso-4-application-layer)
8. [Paso 5: Infrastructure Layer](#paso-5-infrastructure-layer)
9. [Paso 6: Server Configuración](#paso-6-server-configuración)
10. [Paso 7: Seed Data](#paso-7-seed-data)
11. [Paso 8: Testing con Curl](#paso-8-testing-con-curl)

---

# 🎯 ESTRUCTURA SCRUM

## Sprint 1: Backend (1 Semana)

### Historias de Usuario

#### Historias Técnicas (No dependen una de otra)

```
HISTORIA 1: Sistema de Puntuación
├─ Requisito: Motor que calcula puntos de jugadores
├─ Entrada: {goals, assists, minutesPlayed, cleanSheet, position}
├─ Salida: puntos (float)
├─ Independencia: NO depende de DB, NO depende de otros cálculos
├─ SOLID: Single Responsibility - solo calcula puntos
└─ Beneficio: Padres ven puntos reales de sus hijos

HISTORIA 2: Cálculo de Tabla de Posiciones
├─ Requisito: Calcula tabla automáticamente después de cada partido
├─ Entrada: categoryId
├─ Salida: [{position, teamId, points, wins, draws, losses, ...}]
├─ Independencia: NO depende de matches anteriores, recalcula siempre
├─ SOLID: Single Responsibility - solo calcula tabla
└─ Beneficio: Tabla siempre actualizada correctamente

HISTORIA 3: Crear Partido
├─ Requisito: Programar nuevo partido (fecha, hora, cancha, equipos)
├─ Entrada: {categoryId, homeTeamId, awayTeamId, date, venue}
├─ Salida: Match object con status "scheduled"
├─ Independencia: NO afecta historias anteriores
├─ Validaciones:
│  ├─ Los equipos existen en la categoría
│  ├─ No es el mismo equipo local y visitante
│  └─ Fecha es válida
└─ Beneficio: Organizadores pueden crear partidos fácilmente

HISTORIA 4: Registrar Resultado (CRÍTICO)
├─ Requisito: Registrar resultado de partido + stats de jugadores
├─ Entrada: {matchId, homeGoals, awayGoals, playerStats[]}
├─ Salida: {match actualizado, standings recalculada}
├─ Independencia: 
│  ├─ NO borra nada
│  ├─ Si se registra mal, se puede actualizar sin romper nada
│  └─ Usa HISTORIA 1 (scoring) para calcular puntos
├─ Validaciones:
│  ├─ Partido existe
│  ├─ Goles son válidos (>= 0)
│  ├─ Jugadores pertenecen a los equipos del partido
│  └─ No hay stats duplicados
└─ Beneficio: Sistema actualiza automáticamente tabla y rankings

HISTORIA 5: Obtener Tabla
├─ Requisito: Consultar tabla de posiciones de categoría
├─ Entrada: categoryId
├─ Salida: Standings[] ordenada
├─ Independencia: Solo lectura, no modifica nada
├─ SOLID: Single Responsibility
└─ Beneficio: Padres ven tabla actualizada

HISTORIA 6: Obtener Goleadores
├─ Requisito: Ranking de top goleadores
├─ Entrada: categoryId, limit (opcional)
├─ Salida: TopScorer[] con {position, name, goals, points}
├─ Independencia: Solo lectura, no modifica nada
└─ Beneficio: Niños ven quién es el goleador

HISTORIA 7: Gestión de Categorías
├─ CRUD de categorías
├─ SOLID: Independiente de matches, jugadores, etc
└─ Si se elimina: CASCADE delete de equipos, matches, jugadores

HISTORIA 8: Gestión de Equipos
├─ CRUD de equipos
├─ Si se elimina: CASCADE delete de jugadores, matches del equipo
└─ Si se actualiza: NO afecta resultados históricos

HISTORIA 9: Gestión de Jugadores
├─ CRUD de jugadores
├─ Si se elimina: Cascada a PlayerMatchStat (histórico de partidos)
└─ Stats históricas NO se pierden, se marcan como huérfanas

HISTORIA 10: Gestión de Partidos
├─ CRUD de partidos
├─ Si se elimina: CASCADE delete de PlayerMatchStat
└─ Tabla se recalcula automáticamente
```

---

# 🎨 PRINCIPIOS SOLID APLICADOS

## 1. SINGLE RESPONSIBILITY PRINCIPLE (SRP)

```
❌ MALO - Una clase hace todo:
class MatchManager {
  createMatch() { }
  recordResult() { }
  calculatePoints() { }        // ← Responsabilidades diferentes
  calculateStandings() { }
  updatePlayer() { }
}

✅ BUENO - Cada clase una responsabilidad:
class ScoringEngine {
  calculatePoints() { }        // Solo calcula puntos
}

class StandingsCalculator {
  calculate() { }              // Solo calcula tabla
}

class MatchService {
  createMatch() { }            // Solo orquesta
  recordResult() { }
}
```

## 2. OPEN/CLOSED PRINCIPLE (OCP)

```
❌ MALO - Necesitas modificar si quieres cambiar scoring:
class MatchService {
  recordResult(matchId, goals) {
    const points = goals * 10;  // Hardcoded, cambiar = editar clase
  }
}

✅ BUENO - Inyectamos el motor:
class MatchService {
  constructor(private scoringEngine: ScoringEngine) {}
  
  recordResult(matchId, data) {
    const points = this.scoringEngine.calculatePoints(...);
  }
}

// Luego si quieres otro scoring:
const newScoring = new NewScoringEngine();
new MatchService(newScoring);
```

## 3. LISKOV SUBSTITUTION PRINCIPLE (LSP)

```
✅ BUENO - Las interfaces son reemplazables:

interface IRepository<T> {
  create(data: T): Promise<T>;
  findById(id: string): Promise<T>;
  update(id: string, data: T): Promise<T>;
  delete(id: string): Promise<void>;
}

// Cualquier repositorio cumple el contrato:
class PrismaTeamRepository implements IRepository<Team> { }
class MockTeamRepository implements IRepository<Team> { }
class PostgresTeamRepository implements IRepository<Team> { }

// Son intercambiables:
const teamService = new TeamService(new PrismaTeamRepository());
// Funciona igual:
const teamService2 = new TeamService(new MockTeamRepository());
```

## 4. INTERFACE SEGREGATION PRINCIPLE (ISP)

```
❌ MALO - Cliente forzado a depender de métodos que no usa:
interface IService {
  create(): void;
  read(): void;
  update(): void;
  delete(): void;
  export(): void;
  import(): void;
  backup(): void;     // ← No todos necesitan esto
  analytics(): void;  // ← No todos necesitan esto
}

✅ BUENO - Interfaces específicas:
interface IRepository<T> {
  create(data: T): Promise<T>;
  findById(id: string): Promise<T>;
  update(id: string, data: T): Promise<T>;
  delete(id: string): Promise<void>;
}

interface IExportable {
  export(): void;
}

interface IAnalyzable {
  getAnalytics(): void;
}

// Implementas solo lo que necesitas:
class MatchService implements IRepository<Match> { }
class ExportService implements IExportable { }
```

## 5. DEPENDENCY INVERSION PRINCIPLE (DIP)

```
❌ MALO - Alto nivel depende de bajo nivel:
class MatchService {
  private prisma = new PrismaClient();  // ← Tight coupling
  
  createMatch(data) {
    return this.prisma.match.create(data);
  }
}

✅ BUENO - Ambos dependen de abstracción:
interface IMatchRepository {
  create(data: MatchData): Promise<Match>;
}

class MatchService {
  constructor(private repository: IMatchRepository) {}  // ← Dependency injection
  
  createMatch(data) {
    return this.repository.create(data);
  }
}

class PrismaMatchRepository implements IMatchRepository {
  constructor(private prisma: PrismaClient) {}
  
  create(data) {
    return this.prisma.match.create(data);
  }
}

// Inyectamos la dependencia:
const repo = new PrismaMatchRepository(new PrismaClient());
const service = new MatchService(repo);
```

---

# 🏗️ ARQUITECTURA DE CARPETAS

```
backend/
├── src/
│   ├── domain/                          # Lógica pura (NO dependencias externas)
│   │   ├── scoring/
│   │   │   ├── ScoringEngine.ts         # Motor de puntos (SOLID)
│   │   │   ├── ScoringEngine.test.ts    # Tests unitarios
│   │   │   └── types.ts                 # Tipos para scoring
│   │   │
│   │   ├── standings/
│   │   │   ├── StandingsCalculator.ts   # Calcula tabla (SOLID)
│   │   │   ├── StandingsCalculator.test.ts
│   │   │   └── types.ts
│   │   │
│   │   └── shared/
│   │       ├── Entity.ts                # Clase base para entidades
│   │       ├── ValueObject.ts           # Clase base para value objects
│   │       └── types.ts                 # Tipos compartidos
│   │
│   ├── application/                     # Casos de uso (Servicios)
│   │   ├── CategoryService.ts
│   │   ├── TeamService.ts
│   │   ├── PlayerService.ts
│   │   ├── MatchService.ts              # Orquesta scoring + standings
│   │   ├── StandingsService.ts
│   │   ├── ScorerService.ts
│   │   └── ports/                       # Interfaces de dependencias
│   │       ├── IRepository.ts
│   │       ├── ICategoryRepository.ts
│   │       ├── ITeamRepository.ts
│   │       ├── IPlayerRepository.ts
│   │       ├── IMatchRepository.ts
│   │       └── IScoringEngine.ts
│   │
│   ├── infrastructure/                  # Implementaciones concretas
│   │   ├── http/
│   │   │   ├── controllers/
│   │   │   │   ├── CategoryController.ts
│   │   │   │   ├── TeamController.ts
│   │   │   │   ├── PlayerController.ts
│   │   │   │   ├── MatchController.ts
│   │   │   │   ├── StandingsController.ts
│   │   │   │   └── ScorerController.ts
│   │   │   │
│   │   │   ├── routes/
│   │   │   │   ├── categoryRoutes.ts
│   │   │   │   ├── teamRoutes.ts
│   │   │   │   ├── playerRoutes.ts
│   │   │   │   ├── matchRoutes.ts
│   │   │   │   ├── standingsRoutes.ts
│   │   │   │   └── scorerRoutes.ts
│   │   │   │
│   │   │   └── middleware/
│   │   │       ├── errorHandler.ts
│   │   │       ├── validation.ts
│   │   │       └── logging.ts
│   │   │
│   │   ├── persistence/                 # Base de datos
│   │   │   ├── prisma/
│   │   │   │   ├── PrismaClient.ts
│   │   │   │   ├── PrismaCategoryRepository.ts
│   │   │   │   ├── PrismaTeamRepository.ts
│   │   │   │   ├── PrismaPlayerRepository.ts
│   │   │   │   ├── PrismaMatchRepository.ts
│   │   │   │   └── PrismaSponsorRepository.ts
│   │   │   │
│   │   │   └── migrations/
│   │   │       └── (prisma migrations)
│   │   │
│   │   └── container/                   # Inyección de dependencias
│   │       └── Container.ts
│   │
│   ├── config/
│   │   ├── environment.ts               # Variables de entorno
│   │   ├── database.ts                  # Configuración DB
│   │   └── server.ts                    # Configuración servidor
│   │
│   ├── server.ts                        # Entry point Express
│   ├── app.ts                           # Express app (sin listen)
│   └── index.ts                         # Main file
│
├── prisma/
│   ├── schema.prisma                    # Schema DB
│   ├── seed.ts                          # Seed data
│   └── migrations/
│
├── tests/
│   ├── unit/
│   │   ├── scoring.test.ts
│   │   ├── standings.test.ts
│   │   └── services.test.ts
│   │
│   ├── integration/
│   │   └── api.test.ts
│   │
│   └── fixtures/
│       └── testData.ts
│
├── .env.example                         # Variables de entorno
├── .env                                 # Variables actuales
├── package.json
├── tsconfig.json
└── README.md
```

---

# ✅ PASO 1: SETUP INICIAL

## 1.1 Verificar que tienes el proyecto

```bash
# Ir al directorio backend
cd /ruta/a/DeporteHN/backend

# Verificar que existen archivos clave
ls -la
# Debe mostrar: package.json, tsconfig.json, src/, prisma/

# Si no existe, crear estructura:
mkdir -p backend/src/{domain,application,infrastructure}
```

## 1.2 Instalar/Actualizar dependencias

```bash
cd backend

# Instalar todas:
npm install

# Actualizar Prisma
npm install @prisma/client@latest prisma@latest

# Instalar tipos TypeScript
npm install --save-dev @types/node @types/express

# Verificar instalación
npm list prisma
npm list @prisma/client
```

## 1.3 Verificar package.json

**`backend/package.json`:**

```json
{
  "name": "deportehn-backend",
  "version": "1.0.0",
  "description": "Backend para DeporteHN",
  "main": "dist/index.js",
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "build": "prisma generate && tsc",
    "start": "node dist/index.js",
    "prisma:migrate": "prisma migrate dev",
    "prisma:reset": "prisma migrate reset",
    "prisma:studio": "prisma studio",
    "seed": "ts-node prisma/seed.ts",
    "test": "vitest",
    "lint": "tsc --noEmit"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@prisma/client": "^5.8.0",
    "compression": "^1.8.1",
    "cors": "^2.8.5",
    "dotenv": "^17.4.2",
    "express": "^4.18.2",
    "express-rate-limit": "^7.5.1",
    "helmet": "^7.2.0"
  },
  "devDependencies": {
    "@types/compression": "^1.8.1",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.18",
    "@types/node": "^20.14.0",
    "prisma": "^5.8.0",
    "ts-node": "^10.9.1",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.5.0",
    "vitest": "^1.5.8"
  }
}
```

## 1.4 Crear .env

**`backend/.env`:**

```env
# Database
DATABASE_URL="file:./dev.db"

# Server
PORT=4000
NODE_ENV=development

# CORS
CORS_ORIGIN="http://localhost:3000"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

## 1.5 Verificar tsconfig.json

**`backend/tsconfig.json`:**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "moduleResolution": "node",
    "baseUrl": "./src",
    "paths": {
      "@domain/*": ["domain/*"],
      "@application/*": ["application/*"],
      "@infrastructure/*": ["infrastructure/*"],
      "@config/*": ["config/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

---

# ✅ PASO 2: DATABASE SCHEMA

## 2.1 Crear carpeta prisma

```bash
# Si no existe
mkdir -p prisma

# Verificar que existe schema.prisma
ls prisma/schema.prisma
```

## 2.2 Schema Prisma COMPLETO

**`backend/prisma/schema.prisma`:**

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ============================================
// CATEGORÍAS - Liga, Torneo, División
// ============================================
model Category {
  id        String    @id @default(cuid())
  name      String    @unique
  color     String    // Ej: "#2563eb"
  description String? 
  
  // Relaciones - TODO esto se borra al eliminar categoría
  teams     Team[]
  matches   Match[]
  players   Player[]
  sponsors  Sponsor[]
  
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

// ============================================
// EQUIPOS - Cada equipo en una categoría
// Independencia: Si se elimina, cascade a jugadores y partidos
// ============================================
model Team {
  id          String    @id @default(cuid())
  name        String
  crestUrl    String?   // URL de logo/escudo
  categoryId  String
  
  // Relaciones
  category    Category  @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  players     Player[]
  homeMatches Match[]   @relation("homeTeam")
  awayMatches Match[]   @relation("awayTeam")
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  // Restricciones de unicidad
  @@unique([name, categoryId]) // No se puede repetir nombre en misma categoría
  @@index([categoryId])
}

// ============================================
// JUGADORES - Niños en cada equipo
// Independencia: Si se elimina, NO se pierden stats históricas
// Las stats (PlayerMatchStat) quedan huérfanas pero existen
// ============================================
model Player {
  id              String            @id @default(cuid())
  name            String
  photoUrl        String?           // URL foto del niño (IMPORTANTE)
  position        String            // "Delantero", "Medio", "Defensa", "Portero"
  jerseyNumber    Int               // Número de dorsal
  teamId          String
  categoryId      String
  
  // Relaciones
  team            Team              @relation(fields: [teamId], references: [id], onDelete: Cascade)
  category        Category          @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  stats           PlayerMatchStat[] // Stats de CADA partido
  
  // Stats acumulativas de la temporada (se actualizan automáticamente)
  seasonGoals     Int               @default(0)
  seasonPoints    Float             @default(0)
  seasonMatches   Int               @default(0)
  
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt
  
  // Índices para queries frecuentes
  @@index([teamId])
  @@index([categoryId])
}

// ============================================
// PARTIDOS - Encuentros entre equipos
// Independencia: Si se elimina, cascade a PlayerMatchStat
// Las stats se borran automáticamente
// ============================================
model Match {
  id            String            @id @default(cuid())
  categoryId    String
  homeTeamId    String
  awayTeamId    String
  
  date          DateTime          // Fecha y hora del partido
  venue         String            // Nombre de la cancha
  status        String            // "scheduled" | "in_progress" | "finished"
  
  // Resultados - null hasta que se registre
  homeGoals     Int?              
  awayGoals     Int?
  
  // Relaciones
  category      Category          @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  homeTeam      Team              @relation("homeTeam", fields: [homeTeamId], references: [id], onDelete: Cascade)
  awayTeam      Team              @relation("awayTeam", fields: [awayTeamId], references: [id], onDelete: Cascade)
  playerStats   PlayerMatchStat[] // Stats de jugadores en este partido
  
  createdAt     DateTime          @default(now())
  updatedAt     DateTime          @updatedAt
  
  // Índices para queries frecuentes
  @@index([categoryId])
  @@index([homeTeamId])
  @@index([awayTeamId])
  @@index([status])
  @@index([date])
}

// ============================================
// ESTADÍSTICAS DE JUGADOR POR PARTIDO
// Cada fila = desempeño de 1 jugador en 1 partido
// Independencia: Si jugador se elimina, esto queda huérfano
// Si partido se elimina, esto se borra (onDelete: Cascade)
// ============================================
model PlayerMatchStat {
  id              String   @id @default(cuid())
  playerId        String
  matchId         String
  
  // Stats del partido
  goals           Int      @default(0)
  assists         Int      @default(0)
  minutesPlayed   Int      @default(0)  // 0-90 minutos
  cleanSheet      Boolean  @default(false)  // Para defensores/porteros
  
  // Puntos calculados AUTOMÁTICAMENTE por ScoringEngine
  points          Float    @default(0)
  
  // Relaciones
  player          Player   @relation(fields: [playerId], references: [id], onDelete: Cascade)
  match           Match    @relation(fields: [matchId], references: [id], onDelete: Cascade)
  
  createdAt       DateTime @default(now())
  
  // Restricciones
  @@unique([playerId, matchId]) // 1 jugador solo puede tener 1 stat por partido
  @@index([matchId])
  @@index([playerId])
}

// ============================================
// SPONSORS - Patrocinadores de categorías
// Independencia: Si se elimina categoría, sponsor se marca como NULL
// ============================================
model Sponsor {
  id         String    @id @default(cuid())
  name       String
  imageUrl   String
  linkUrl    String?
  placement  String    // "header" | "sidebar" | "footer"
  categoryId String?   // Nullable - puede no estar asociado a categoría
  active     Boolean   @default(true)
  
  category   Category? @relation(fields: [categoryId], references: [id], onDelete: SetNull)
  
  createdAt  DateTime  @default(now())
  
  @@index([categoryId])
  @@index([active])
}
```

## 2.3 Ejecutar Migration

```bash
cd backend

# Ejecutar migration (crea base de datos)
npx prisma migrate dev --name init

# Debe mostrar algo como:
# ✔ Created a new migration folder at prisma/migrations/[timestamp]_init
# ✔ Generated Prisma Client
# ✔ Ran all pending migrations (1)
# ✔ Prisma Client generated

# Verificar que funcionó
ls prisma/dev.db
# Debe existir el archivo dev.db
```

## 2.4 Generar tipos TypeScript

```bash
# Generar tipos de Prisma
npx prisma generate

# Debe mostrar:
# ✔ Generated Prisma Client (v5.x.x) in XXXms
```

---

# ✅ PASO 3: DOMAIN LAYER (Lógica Pura)

## 3.1 Crear Carpeta y Tipos

```bash
mkdir -p backend/src/domain/scoring
mkdir -p backend/src/domain/standings
mkdir -p backend/src/domain/shared
```

## 3.2 Tipos Base del Domain

**`backend/src/domain/shared/types.ts`:**

```typescript
/**
 * Tipos base compartidos en el domain
 * NO importan ningún archivo externo
 * Pueden ser usados en cualquier capa
 */

// ============================================
// TIPOS DE ENTRADA
// ============================================

export interface PlayerPerformanceInput {
  goals: number;          // Goles anotados
  assists: number;        // Asistencias
  minutesPlayed: number;  // 0-90
  cleanSheet: boolean;    // Sin goles en contra (defensores)
  position: "Delantero" | "Medio" | "Defensa" | "Portero";
}

export interface TeamStatsInput {
  teamId: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
}

// ============================================
// TIPOS DE SALIDA
// ============================================

export interface PointsOutput {
  goals: number;
  assists: number;
  cleanSheet: number;
  minutesBonus: number;
  total: number;
}

export interface StandingOutput {
  position: number;
  teamId: string;
  teamName: string;
  teamCrest: string | null;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface TopScorerOutput {
  position: number;
  playerId: string;
  playerName: string;
  teamName: string;
  teamCrest: string | null;
  goals: number;
  points: number;
}

// ============================================
// CONSTANTES DE SCORING
// ============================================

export const SCORING_RULES = {
  GOAL: 10,           // Gol = 10 puntos
  ASSIST: 3,          // Asistencia = 3 puntos
  CLEAN_SHEET: 5,     // Defensa limpia = 5 puntos
  FEW_MINUTES: -2,    // Jugó < 45 min = -2 puntos
  FULL_GAME: 1,       // Jugó 90 min = +1 punto bonus
  MIN_POINTS: 0,      // Mínimo puntos permitidos
  MATCH_MIN_THRESHOLD: 45, // Umbral de minutos para penalización
  FULL_MATCH_MINUTES: 90,  // Minutos para bonus
} as const;

export const TEAM_STATS = {
  WIN: 3,             // Victoria = 3 puntos
  DRAW: 1,            // Empate = 1 punto
  LOSS: 0,            // Derrota = 0 puntos
} as const;
```

## 3.3 ScoringEngine (SOLID - Single Responsibility)

**`backend/src/domain/scoring/ScoringEngine.ts`:**

```typescript
/**
 * MOTOR DE PUNTUACIÓN
 * 
 * RESPONSABILIDAD ÚNICA: Calcular puntos de un jugador
 * 
 * NO HACE:
 * - Database queries
 * - HTTP requests
 * - File operations
 * 
 * SOLO CALCULA:
 * - Puntos basados en goles, asistencias, minutos, clean sheet
 * 
 * PARÁMETROS INDEPENDIENTES:
 * - Cada jugador se calcula independientemente
 * - No afecta a otros jugadores
 * - Si se cambia la regla de scoring, solo cambiar aquí
 */

import {
  PlayerPerformanceInput,
  PointsOutput,
  SCORING_RULES,
} from "../shared/types";

export class ScoringEngine {
  /**
   * Calcula puntos de UN jugador basado en su desempeño
   * 
   * FÓRMULA:
   * - Goles: goals * 10
   * - Asistencias: assists * 3
   * - Clean Sheet (solo Defensa/Portero): 5 puntos
   * - Minutos < 45: -2 puntos
   * - Minutos = 90: +1 punto bonus
   * 
   * EJEMPLOS:
   * 
   * Delantero: 2 goles, 1 asistencia, 90 min
   * = (2*10) + (1*3) + 0 + 0 + 1 = 24 puntos
   * 
   * Defensa: 0 goles, 0 asistencias, 90 min, clean sheet
   * = 0 + 0 + 5 + 0 + 1 = 6 puntos
   * 
   * Jugador que entró tarde: 1 gol, 0 asistencias, 30 min
   * = (1*10) + 0 + 0 + (-2) + 0 = 8 puntos
   */
  calculatePoints(performance: PlayerPerformanceInput): PointsOutput {
    let points = 0;

    // 1. GOLES
    const goalsPoints = performance.goals * SCORING_RULES.GOAL;
    points += goalsPoints;

    // 2. ASISTENCIAS
    const assistsPoints = performance.assists * SCORING_RULES.ASSIST;
    points += assistsPoints;

    // 3. CLEAN SHEET (solo para defensas y porteros)
    let cleanSheetPoints = 0;
    if (
      (performance.position === "Defensa" ||
        performance.position === "Portero") &&
      performance.cleanSheet
    ) {
      cleanSheetPoints = SCORING_RULES.CLEAN_SHEET;
      points += cleanSheetPoints;
    }

    // 4. MINUTOS JUGADOS
    let minutesBonus = 0;
    if (performance.minutesPlayed < SCORING_RULES.MATCH_MIN_THRESHOLD) {
      // Jugó menos de 45 minutos = -2 puntos
      minutesBonus = SCORING_RULES.FEW_MINUTES;
      points += minutesBonus;
    } else if (performance.minutesPlayed === SCORING_RULES.FULL_MATCH_MINUTES) {
      // Jugó todo el partido = +1 punto bonus
      minutesBonus = SCORING_RULES.FULL_GAME;
      points += minutesBonus;
    }

    // 5. GARANTIZAR MÍNIMO
    const total = Math.max(SCORING_RULES.MIN_POINTS, points);

    // Retornar desglose para transparencia
    return {
      goals: goalsPoints,
      assists: assistsPoints,
      cleanSheet: cleanSheetPoints,
      minutesBonus,
      total,
    };
  }

  /**
   * Calcula puntos para múltiples jugadores
   * Útil para procesar batch de stats
   */
  calculateBatch(
    performances: PlayerPerformanceInput[]
  ): Map<string, PointsOutput> {
    const results = new Map<string, PointsOutput>();
    performances.forEach((perf, index) => {
      results.set(index.toString(), this.calculatePoints(perf));
    });
    return results;
  }
}

// TESTS unitarios (No requiere DB, rápido)
export class ScoringEngineTests {
  static runTests() {
    const engine = new ScoringEngine();

    // Test 1: Delantero con 2 goles
    const test1 = engine.calculatePoints({
      goals: 2,
      assists: 0,
      minutesPlayed: 90,
      cleanSheet: false,
      position: "Delantero",
    });
    console.assert(test1.total === 21, `Test 1 failed: ${test1.total}`);
    console.log("✓ Test 1: Delantero 2 goles = 21 puntos");

    // Test 2: Defensa con clean sheet
    const test2 = engine.calculatePoints({
      goals: 0,
      assists: 0,
      minutesPlayed: 90,
      cleanSheet: true,
      position: "Defensa",
    });
    console.assert(test2.total === 6, `Test 2 failed: ${test2.total}`);
    console.log("✓ Test 2: Defensa clean sheet = 6 puntos");

    // Test 3: Jugador con pocos minutos
    const test3 = engine.calculatePoints({
      goals: 1,
      assists: 0,
      minutesPlayed: 30,
      cleanSheet: false,
      position: "Delantero",
    });
    console.assert(test3.total === 8, `Test 3 failed: ${test3.total}`);
    console.log("✓ Test 3: 1 gol + 30 min = 8 puntos");

    // Test 4: Portero con clean sheet
    const test4 = engine.calculatePoints({
      goals: 0,
      assists: 0,
      minutesPlayed: 90,
      cleanSheet: true,
      position: "Portero",
    });
    console.assert(test4.total === 6, `Test 4 failed: ${test4.total}`);
    console.log("✓ Test 4: Portero clean sheet = 6 puntos");
  }
}
```

## 3.4 StandingsCalculator (SOLID - Single Responsibility)

**`backend/src/domain/standings/StandingsCalculator.ts`:**

```typescript
/**
 * CALCULADORA DE TABLA DE POSICIONES
 * 
 * RESPONSABILIDAD ÚNICA: Calcular tabla ordena de un conjunto de equipos
 * 
 * ENTRADA: 
 * - Lista de partidos (con resultados)
 * - Lista de equipos
 * 
 * SALIDA:
 * - Standings[] ordenada por puntos, diferencia goles, goles favor
 * 
 * INDEPENDENCIA:
 * - NO modifica nada en base de datos
 * - NO depende de scoring (scoring ya está hecho)
 * - Recalcula desde cero cada vez (agnóstico a estado anterior)
 * - Si se elimina un partido, tabla se recalcula correctamente
 * - Si se elimina un equipo, simplemente no aparece en tabla
 */

import { StandingOutput, TEAM_STATS } from "../shared/types";

export interface MatchData {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeGoals: number | null;
  awayGoals: number | null;
  status: string;
}

export interface TeamData {
  id: string;
  name: string;
  crestUrl: string | null;
}

export class StandingsCalculator {
  /**
   * Calcula tabla de posiciones
   * 
   * ALGORITMO:
   * 1. Para cada equipo, buscar todos sus partidos
   * 2. Contar ganancias, empates, pérdidas
   * 3. Sumar goles a favor y en contra
   * 4. Calcular puntos (ganancias*3 + empates*1)
   * 5. Ordenar por: puntos DESC, diferencia goles DESC, goles favor DESC
   * 6. Asignar posición (1, 2, 3, ...)
   * 
   * INDEPENDENCIA:
   * - Cada equipo se calcula de forma independiente
   * - No afecta a otros equipos
   * - Idempotente: llamar 2 veces da mismo resultado
   */
  calculate(teams: TeamData[], matches: MatchData[]): StandingOutput[] {
    // 1. Calcular stats para cada equipo
    const standings: StandingOutput[] = teams.map((team) => {
      // Filtrar partidos del equipo (home o away)
      const teamMatches = matches.filter(
        (m) =>
          (m.homeTeamId === team.id || m.awayTeamId === team.id) &&
          m.status === "finished" &&
          m.homeGoals !== null &&
          m.awayGoals !== null
      );

      // Inicializar contadores
      let wins = 0;
      let draws = 0;
      let losses = 0;
      let goalsFor = 0;
      let goalsAgainst = 0;

      // Procesar cada partido del equipo
      teamMatches.forEach((match) => {
        if (match.homeTeamId === team.id) {
          // El equipo es local
          goalsFor += match.homeGoals!;
          goalsAgainst += match.awayGoals!;

          // Determinar resultado
          if (match.homeGoals! > match.awayGoals!) {
            wins++;
          } else if (match.homeGoals! === match.awayGoals!) {
            draws++;
          } else {
            losses++;
          }
        } else {
          // El equipo es visitante
          goalsFor += match.awayGoals!;
          goalsAgainst += match.homeGoals!;

          // Determinar resultado
          if (match.awayGoals! > match.homeGoals!) {
            wins++;
          } else if (match.awayGoals! === match.homeGoals!) {
            draws++;
          } else {
            losses++;
          }
        }
      });

      // Calcular puntos totales
      const points = wins * TEAM_STATS.WIN + draws * TEAM_STATS.DRAW;

      // Calcular diferencia goles
      const goalDifference = goalsFor - goalsAgainst;

      // Crear objeto standing (posición será asignada después)
      return {
        position: 0, // Temporal, será actualizado en paso 2
        teamId: team.id,
        teamName: team.name,
        teamCrest: team.crestUrl,
        played: teamMatches.length,
        wins,
        draws,
        losses,
        goalsFor,
        goalsAgainst,
        goalDifference,
        points,
      };
    });

    // 2. Ordenar por criterios de desempate (CRÍTICO)
    // Orden: Puntos DESC > Diferencia Goles DESC > Goles Favor DESC
    standings.sort((a, b) => {
      // Comparar puntos primero (mayor primero)
      if (b.points !== a.points) {
        return b.points - a.points;
      }

      // Si puntos iguales, comparar diferencia goles
      if (b.goalDifference !== a.goalDifference) {
        return b.goalDifference - a.goalDifference;
      }

      // Si aún igual, comparar goles a favor
      return b.goalsFor - a.goalsFor;
    });

    // 3. Asignar posiciones finales (1, 2, 3, ...)
    standings.forEach((standing, index) => {
      standing.position = index + 1;
    });

    return standings;
  }

  /**
   * Calcular tabla solo de equipos vivos (que han jugado)
   * Útil si queremos excluir equipos sin partidos
   */
  calculateActive(teams: TeamData[], matches: MatchData[]): StandingOutput[] {
    const standings = this.calculate(teams, matches);
    return standings.filter((s) => s.played > 0);
  }
}

// TESTS
export class StandingsCalculatorTests {
  static runTests() {
    const calc = new StandingsCalculator();

    const teams: TeamData[] = [
      { id: "1", name: "Real Madrid", crestUrl: null },
      { id: "2", name: "Barcelona", crestUrl: null },
      { id: "3", name: "Atlético", crestUrl: null },
    ];

    const matches: MatchData[] = [
      {
        id: "m1",
        homeTeamId: "1",
        awayTeamId: "2",
        homeGoals: 2,
        awayGoals: 1,
        status: "finished",
      },
      {
        id: "m2",
        homeTeamId: "2",
        awayTeamId: "3",
        homeGoals: 1,
        awayGoals: 1,
        status: "finished",
      },
      {
        id: "m3",
        homeTeamId: "3",
        awayTeamId: "1",
        homeGoals: 0,
        awayGoals: 2,
        status: "finished",
      },
    ];

    const standings = calc.calculate(teams, matches);

    console.log("✓ Test: Tabla calculada correctamente");
    console.log(JSON.stringify(standings, null, 2));

    // Verificaciones
    console.assert(standings[0].teamName === "Real Madrid");
    console.assert(standings[0].points === 6);
    console.assert(standings[1].teamName === "Barcelona");
    console.assert(standings[1].points === 1);
  }
}
```

---

# ✅ PASO 4: APPLICATION LAYER (Casos de Uso)

## 4.1 Crear Carpeta

```bash
mkdir -p backend/src/application/ports
```

## 4.2 Interfaces (Puertos)

**`backend/src/application/ports/IRepository.ts`:**

```typescript
/**
 * INTERFAZ GENÉRICA DE REPOSITORIO
 * 
 * PRINCIPIO: Dependency Inversion (DIP)
 * - Application depende de abstracción, no de implementación
 * - Fácil de mockear para tests
 * - Fácil cambiar de Prisma a otra BD
 */

export interface IRepository<T> {
  /**
   * Crear nueva entidad
   */
  create(data: Partial<T>): Promise<T>;

  /**
   * Obtener por ID
   */
  findById(id: string): Promise<T | null>;

  /**
   * Obtener muchos con filtros
   */
  findMany(filters?: Record<string, any>): Promise<T[]>;

  /**
   * Actualizar
   */
  update(id: string, data: Partial<T>): Promise<T>;

  /**
   * Eliminar
   */
  delete(id: string): Promise<void>;
}
```

**`backend/src/application/ports/IScoringEngine.ts`:**

```typescript
/**
 * INTERFAZ PARA MOTOR DE SCORING
 * 
 * Permite intercambiar implementaciones sin cambiar Services
 */

import { PlayerPerformanceInput, PointsOutput } from "@domain/shared/types";

export interface IScoringEngine {
  calculatePoints(performance: PlayerPerformanceInput): PointsOutput;
  calculateBatch(
    performances: PlayerPerformanceInput[]
  ): Map<string, PointsOutput>;
}
```

**`backend/src/application/ports/IStandingsCalculator.ts`:**

```typescript
/**
 * INTERFAZ PARA CALCULADORA DE TABLA
 */

import { StandingOutput } from "@domain/shared/types";

export interface TeamDataPort {
  id: string;
  name: string;
  crestUrl: string | null;
}

export interface MatchDataPort {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeGoals: number | null;
  awayGoals: number | null;
  status: string;
}

export interface IStandingsCalculator {
  calculate(teams: TeamDataPort[], matches: MatchDataPort[]): StandingOutput[];
  calculateActive(
    teams: TeamDataPort[],
    matches: MatchDataPort[]
  ): StandingOutput[];
}
```

## 4.3 Match Service (Orquestador)

**`backend/src/application/MatchService.ts`:**

```typescript
/**
 * MATCH SERVICE - Orquestador de casos de uso
 * 
 * RESPONSABILIDADES:
 * 1. Crear partidos
 * 2. Registrar resultados (usa ScoringEngine + StandingsCalculator)
 * 3. Actualizar partidos
 * 4. Eliminar partidos
 * 
 * INDEPENDENCIA:
 * - Si se elimina un partido, solo se borran sus stats (cascade)
 * - Si se actualiza una fecha, no afecta otros partidos
 * - Scoring es independiente, cada jugador se calcula solo
 * - Tabla se recalcula completa cada vez (agnóstica)
 * 
 * INYECCIÓN DE DEPENDENCIAS:
 * - Recibe repositories como parámetros
 * - Recibe ScoringEngine como parámetro
 * - Recibe StandingsCalculator como parámetro
 */

import { IScoringEngine } from "./ports/IScoringEngine";
import { IStandingsCalculator } from "./ports/IStandingsCalculator";
import { IRepository } from "./ports/IRepository";

interface Match {
  id: string;
  categoryId: string;
  homeTeamId: string;
  awayTeamId: string;
  date: Date;
  venue: string;
  status: "scheduled" | "in_progress" | "finished";
  homeGoals: number | null;
  awayGoals: number | null;
}

interface Team {
  id: string;
  name: string;
  crestUrl: string | null;
}

interface Player {
  id: string;
  name: string;
  position: string;
  seasonGoals: number;
  seasonPoints: number;
}

interface PlayerMatchStat {
  id: string;
  playerId: string;
  matchId: string;
  goals: number;
  assists: number;
  minutesPlayed: number;
  cleanSheet: boolean;
  points: number;
}

export class MatchService {
  constructor(
    private matchRepository: IRepository<Match>,
    private teamRepository: IRepository<Team>,
    private playerRepository: IRepository<Player>,
    private playerStatRepository: IRepository<PlayerMatchStat>,
    private scoringEngine: IScoringEngine,
    private standingsCalculator: IStandingsCalculator
  ) {}

  /**
   * CASO DE USO 1: Crear nuevo partido
   * 
   * ENTRADA:
   * {
   *   categoryId: "cat_1",
   *   homeTeamId: "team_1",
   *   awayTeamId: "team_2",
   *   date: new Date("2024-02-15T14:00:00"),
   *   venue: "Estadio Técnico"
   * }
   * 
   * PROCESO:
   * 1. Validar que los equipos existen en la categoría
   * 2. Validar que no sea el mismo equipo local y visitante
   * 3. Crear partido con status "scheduled"
   * 
   * SALIDA:
   * {
   *   id: "match_xyz",
   *   homeTeamId: "team_1",
   *   awayTeamId: "team_2",
   *   status: "scheduled",
   *   homeGoals: null,
   *   awayGoals: null
   * }
   * 
   * ERRORES:
   * - "Team not found" si equipo no existe
   * - "Team not in category" si equipo no está en categoría
   * - "Cannot play against itself" si equipos iguales
   */
  async createMatch(data: {
    categoryId: string;
    homeTeamId: string;
    awayTeamId: string;
    date: Date;
    venue: string;
  }): Promise<Match> {
    // VALIDACIÓN 1: Equipos existen
    const homeTeam = await this.teamRepository.findById(data.homeTeamId);
    const awayTeam = await this.teamRepository.findById(data.awayTeamId);

    if (!homeTeam || !awayTeam) {
      throw new Error("MATCH_001: One or both teams not found");
    }

    // VALIDACIÓN 2: Equipos en misma categoría
    if (
      homeTeam.categoryId !== data.categoryId ||
      awayTeam.categoryId !== data.categoryId
    ) {
      throw new Error("MATCH_002: Teams must be in same category");
    }

    // VALIDACIÓN 3: Equipos diferentes
    if (data.homeTeamId === data.awayTeamId) {
      throw new Error("MATCH_003: Cannot play against itself");
    }

    // Crear partido
    const match = await this.matchRepository.create({
      ...data,
      status: "scheduled" as const,
      homeGoals: null,
      awayGoals: null,
    });

    return match;
  }

  /**
   * CASO DE USO 2: Registrar Resultado (CRÍTICO ⭐)
   * 
   * Este es el endpoint más importante del sistema.
   * Cuando se registra un resultado:
   * 1. Se actualizan goles del partido
   * 2. Se calculan puntos de cada jugador (independiente)
   * 3. Se actualiza tabla de posiciones automáticamente
   * 4. Se actualiza ranking de goleadores automáticamente
   * 
   * TODO es INDEPENDIENTE:
   * - Si falla un jugador, otros siguen procesándose
   * - Si se corrige un resultado, tabla se recalcula correctamente
   * - Si se elimina un jugador, su stat histórica se guarda (huérfana)
   * 
   * ENTRADA:
   * {
   *   matchId: "match_1",
   *   homeGoals: 3,
   *   awayGoals: 1,
   *   playerStats: [
   *     {
   *       playerId: "player_1",
   *       goals: 2,
   *       assists: 1,
   *       minutesPlayed: 90,
   *       cleanSheet: false
   *     }
   *   ]
   * }
   */
  async recordResult(
    matchId: string,
    data: {
      homeGoals: number;
      awayGoals: number;
      playerStats: Array<{
        playerId: string;
        goals: number;
        assists?: number;
        minutesPlayed: number;
        cleanSheet?: boolean;
      }>;
    }
  ): Promise<{ match: Match; standings: any[] }> {
    // PASO 1: Obtener partido
    const match = await this.matchRepository.findById(matchId);
    if (!match) {
      throw new Error("MATCH_004: Match not found");
    }

    // PASO 2: Validar goles
    if (data.homeGoals < 0 || data.awayGoals < 0) {
      throw new Error("MATCH_005: Goals cannot be negative");
    }

    // PASO 3: Actualizar partido
    const updatedMatch = await this.matchRepository.update(matchId, {
      homeGoals: data.homeGoals,
      awayGoals: data.awayGoals,
      status: "finished" as const,
    });

    // PASO 4: Procesar estadísticas de cada jugador (INDEPENDIENTE)
    for (const stat of data.playerStats) {
      // Obtener jugador para su posición
      const player = await this.playerRepository.findById(stat.playerId);
      if (!player) {
        // NO romper, solo skip con warning
        console.warn(
          `MATCH_006: Player ${stat.playerId} not found, skipping stats`
        );
        continue;
      }

      // CALCULAR PUNTOS (ScoringEngine es independiente)
      const pointsBreakdown = this.scoringEngine.calculatePoints({
        goals: stat.goals,
        assists: stat.assists || 0,
        minutesPlayed: stat.minutesPlayed,
        cleanSheet: stat.cleanSheet || false,
        position: player.position as any,
      });

      // Guardar stat del partido
      await this.playerStatRepository.create({
        playerId: stat.playerId,
        matchId: matchId,
        goals: stat.goals,
        assists: stat.assists || 0,
        minutesPlayed: stat.minutesPlayed,
        cleanSheet: stat.cleanSheet || false,
        points: pointsBreakdown.total,
      });

      // Actualizar stats acumulativos del jugador
      await this.playerRepository.update(stat.playerId, {
        seasonGoals: player.seasonGoals + stat.goals,
        seasonPoints: player.seasonPoints + pointsBreakdown.total,
      });
    }

    // PASO 5: Recalcular tabla (agnóstica, recalcula desde cero)
    const allTeams = await this.teamRepository.findMany({
      categoryId: match.categoryId,
    });
    const allMatches = await this.matchRepository.findMany({
      categoryId: match.categoryId,
    });

    const standings = this.standingsCalculator.calculate(allTeams, allMatches);

    return {
      match: updatedMatch,
      standings,
    };
  }

  /**
   * Actualizar partido (cambiar fecha, hora, cancha)
   * No afecta resultados históricos
   */
  async updateMatch(
    matchId: string,
    data: { date?: Date; venue?: string }
  ): Promise<Match> {
    return await this.matchRepository.update(matchId, data);
  }

  /**
   * Eliminar partido
   * Elimina sus stats (cascade)
   * Tabla se recalcula automáticamente
   */
  async deleteMatch(matchId: string): Promise<void> {
    // Eliminar stats primero (cascade)
    const stats = await this.playerStatRepository.findMany({
      matchId,
    });
    for (const stat of stats) {
      await this.playerStatRepository.delete(stat.id);
    }

    // Eliminar partido
    await this.matchRepository.delete(matchId);
  }
}
```

## 4.4 Standings Service

**`backend/src/application/StandingsService.ts`:**

```typescript
/**
 * STANDINGS SERVICE - Calcula tabla de posiciones
 * 
 * RESPONSABILIDAD ÚNICA: Consultar y calcular tabla
 * 
 * NO MODIFICA NADA
 * - Solo lectura
 * - Recalcula cada vez desde cero
 * - Agnóstica a estado anterior
 */

import { IRepository } from "./ports/IRepository";
import { IStandingsCalculator } from "./ports/IStandingsCalculator";
import { StandingOutput } from "@domain/shared/types";

interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeGoals: number | null;
  awayGoals: number | null;
  status: string;
}

interface Team {
  id: string;
  name: string;
  crestUrl: string | null;
  categoryId: string;
}

export class StandingsService {
  constructor(
    private teamRepository: IRepository<Team>,
    private matchRepository: IRepository<Match>,
    private calculator: IStandingsCalculator
  ) {}

  /**
   * Obtener tabla de una categoría específica
   */
  async getByCategoryId(categoryId: string): Promise<StandingOutput[]> {
    const teams = await this.teamRepository.findMany({
      categoryId,
    });

    const matches = await this.matchRepository.findMany({
      categoryId,
      status: "finished",
    });

    return this.calculator.calculate(teams, matches);
  }

  /**
   * Obtener solo equipos que han jugado
   */
  async getActiveByCategory(categoryId: string): Promise<StandingOutput[]> {
    const teams = await this.teamRepository.findMany({
      categoryId,
    });

    const matches = await this.matchRepository.findMany({
      categoryId,
      status: "finished",
    });

    return this.calculator.calculateActive(teams, matches);
  }
}
```

## 4.5 Scorer Service

**`backend/src/application/ScorerService.ts`:**

```typescript
/**
 * SCORER SERVICE - Ranking de goleadores
 * 
 * RESPONSABILIDAD ÚNICA: Consultar y ordenar top scorers
 * 
 * NO MODIFICA NADA - Solo lectura
 */

import { IRepository } from "./ports/IRepository";
import { TopScorerOutput } from "@domain/shared/types";

interface Player {
  id: string;
  name: string;
  seasonGoals: number;
  seasonPoints: number;
  team: { name: string; crestUrl: string | null };
}

export class ScorerService {
  constructor(private playerRepository: IRepository<Player>) {}

  /**
   * Obtener top scorers de una categoría
   */
  async getTopScorers(
    categoryId: string,
    limit: number = 10
  ): Promise<TopScorerOutput[]> {
    const players = await this.playerRepository.findMany({
      categoryId,
      orderBy: { seasonGoals: "desc" },
      take: limit,
    });

    return players.map((player, index) => ({
      position: index + 1,
      playerId: player.id,
      playerName: player.name,
      teamName: player.team.name,
      teamCrest: player.team.crestUrl,
      goals: player.seasonGoals,
      points: player.seasonPoints,
    }));
  }

  /**
   * Obtener todos los scorers (sin límite)
   */
  async getAllScorers(categoryId: string): Promise<TopScorerOutput[]> {
    const players = await this.playerRepository.findMany({
      categoryId,
      orderBy: { seasonGoals: "desc" },
    });

    return players.map((player, index) => ({
      position: index + 1,
      playerId: player.id,
      playerName: player.name,
      teamName: player.team.name,
      teamCrest: player.team.crestUrl,
      goals: player.seasonGoals,
      points: player.seasonPoints,
    }));
  }
}
```

---

# ✅ PASO 5: INFRASTRUCTURE LAYER

## 5.1 Crear Carpeta

```bash
mkdir -p backend/src/infrastructure/persistence/prisma
mkdir -p backend/src/infrastructure/http/controllers
mkdir -p backend/src/infrastructure/http/routes
mkdir -p backend/src/infrastructure/container
```

## 5.2 Prisma Client Wrapper

**`backend/src/infrastructure/persistence/prisma/PrismaClient.ts`:**

```typescript
/**
 * Wrapper alrededor de PrismaClient
 * Centraliza la instancia
 */

import { PrismaClient as PrismaClientType } from "@prisma/client";

let prismaInstance: PrismaClientType;

export function getPrismaClient(): PrismaClientType {
  if (!prismaInstance) {
    prismaInstance = new PrismaClientType({
      log: process.env.NODE_ENV === "development" ? ["query"] : [],
    });
  }
  return prismaInstance;
}

export async function disconnectPrisma(): Promise<void> {
  if (prismaInstance) {
    await prismaInstance.$disconnect();
  }
}
```

## 5.3 Repositories (Implementar Interfaces)

**`backend/src/infrastructure/persistence/prisma/PrismaMatchRepository.ts`:**

```typescript
/**
 * REPOSITORIO DE PARTIDOS
 * 
 * Implementa IRepository<Match>
 * Encapsula acceso a base de datos Prisma
 * 
 * VENTAJAS:
 * - Si cambias de BD, cambias solo esto
 * - Application no sabe que existe Prisma
 * - Fácil de mockear en tests
 */

import { IRepository } from "@application/ports/IRepository";
import { getPrismaClient } from "./PrismaClient";
import { Prisma } from "@prisma/client";

export interface Match {
  id: string;
  categoryId: string;
  homeTeamId: string;
  awayTeamId: string;
  date: Date;
  venue: string;
  status: "scheduled" | "in_progress" | "finished";
  homeGoals: number | null;
  awayGoals: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export class PrismaMatchRepository implements IRepository<Match> {
  private prisma = getPrismaClient();

  async create(data: Partial<Match>): Promise<Match> {
    return this.prisma.match.create({
      data: {
        categoryId: data.categoryId!,
        homeTeamId: data.homeTeamId!,
        awayTeamId: data.awayTeamId!,
        date: data.date!,
        venue: data.venue!,
        status: data.status || "scheduled",
        homeGoals: data.homeGoals,
        awayGoals: data.awayGoals,
      },
    }) as Promise<Match>;
  }

  async findById(id: string): Promise<Match | null> {
    return (this.prisma.match.findUnique({
      where: { id },
      include: {
        homeTeam: true,
        awayTeam: true,
      },
    }) as Promise<Match | null>) || null;
  }

  async findMany(filters?: Record<string, any>): Promise<Match[]> {
    return (this.prisma.match.findMany({
      where: filters,
      orderBy: { date: "desc" },
      include: {
        homeTeam: true,
        awayTeam: true,
      },
    }) as Promise<Match[]>) || [];
  }

  async update(id: string, data: Partial<Match>): Promise<Match> {
    return (this.prisma.match.update({
      where: { id },
      data,
    }) as Promise<Match>);
  }

  async delete(id: string): Promise<void> {
    // Cascade a PlayerMatchStat
    await this.prisma.playerMatchStat.deleteMany({
      where: { matchId: id },
    });

    await this.prisma.match.delete({
      where: { id },
    });
  }
}
```

Voy a continuar con el resto... Déjame crear un archivo de continuación porque este es MUY largo.
