# 🔗 GUÍA DE INTEGRACIÓN BACKEND-FRONTEND
## DeporteHN - Todo conectado y funcionando

---

# 📊 ARQUITECTURA COMPLETA

```
┌──────────────────────────────────────────────────────────────┐
│                       FRONTEND (Next.js 14)                   │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  Pages:                                                        │
│  - / (Home con Hero + Categorías)                             │
│  - /categories/[categoryId] (Tabla + Tabs)                    │
│  - /teams/[teamId] (Jugadores)                                │
│  - /matches/[categoryId] (3 secciones)                        │
│                                                                │
│  ↓ HTTP Requests ↓                                             │
│  api/categories                                               │
│  api/standings/[categoryId]                                   │
│  api/players?teamId=xxx                                       │
│  api/matches?categoryId=xxx                                   │
│                                                                │
└────────────────────────┬──────────────────────────────────────┘
                         │
                    ↓ API Calls ↓
                    
┌──────────────────────────────────────────────────────────────┐
│                    BACKEND (Express + Prisma)                 │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  Controllers:                                                 │
│  - CategoryController                                         │
│  - TeamController                                             │
│  - PlayerController                                           │
│  - MatchController                                            │
│  - StandingsController                                        │
│  - ScorerController                                           │
│                                                                │
│  Services (Lógica de Negocio):                               │
│  - ScoringEngine (calcula puntos)                            │
│  - StandingsCalculator (calcula tabla)                       │
│  - MatchService (orquesta todo)                              │
│                                                                │
│  Repositories (Acceso a BD):                                 │
│  - PrismaMatchRepository                                      │
│  - PrismaTeamRepository                                       │
│  - PrismaPlayerRepository                                     │
│  - PrismaPlayerMatchStatRepository                            │
│                                                                │
│  ↓ Prisma ORM ↓                                               │
│                                                                │
└────────────────────────┬──────────────────────────────────────┘
                         │
                    ↓ SQL Queries ↓
                    
┌──────────────────────────────────────────────────────────────┐
│                    BASE DE DATOS (SQLite/PostgreSQL)          │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  Tables:                                                      │
│  - Category                                                   │
│  - Team                                                       │
│  - Player                                                     │
│  - Match                                                      │
│  - PlayerMatchStat                                            │
│  - Sponsor                                                    │
│                                                                │
└──────────────────────────────────────────────────────────────┘
```

---

# 🚀 CHECKLIST DE IMPLEMENTACIÓN

## FASE 1: BACKEND (Ya completo)

- [x] Schema Prisma definido
- [x] Migration ejecutada
- [x] ScoringEngine implementado
- [x] StandingsCalculator implementado
- [x] Services (MatchService, StandingsService, ScorerService)
- [x] Controllers implementados
- [x] Routes configuradas
- [x] Server iniciado
- [x] Seed data creado
- [x] Testing con curl verificado

```bash
# Verificar backend
curl http://localhost:4000/api/health
# Debe devolver: {"status":"ok"}
```

---

## FASE 2: FRONTEND (Pronto)

### Setup Inicial
- [ ] Proyecto Next.js 14 creado
- [ ] Dependencias instaladas
- [ ] .env.local configurado
- [ ] Tailwind CSS configurado

```bash
# Setup
cd frontend
npm install
# Editar .env.local
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### Componentes Base
- [ ] Card.tsx
- [ ] Button.tsx
- [ ] Badge.tsx
- [ ] Tabs.tsx
- [ ] LoadingSpinner.tsx
- [ ] EmptyState.tsx

### Componentes Deportivos
- [ ] CategoryCard.tsx
- [ ] StandingsTable.tsx
- [ ] PlayerCard.tsx
- [ ] MatchCard.tsx
- [ ] HeroSection.tsx

### API Client y Hooks
- [ ] api.ts (API client)
- [ ] hooks.ts (useCategories, useTeamPlayers, etc)
- [ ] utils.ts (formatDate, etc)
- [ ] types/index.ts

### Páginas
- [ ] app/page.tsx (Home)
- [ ] app/categories/[categoryId]/page.tsx
- [ ] app/teams/[teamId]/page.tsx
- [ ] app/matches/[categoryId]/page.tsx

---

# 🔄 FLUJO DE DATOS

## Ejemplo 1: Ver Tabla de Posiciones

```
1. Usuario entra a http://localhost:3000
   ↓
2. Ve categorías disponibles
   ↓
3. Click en "U-12"
   ↓
4. Frontend hace: GET /api/standings/cat_u12
   ↓
5. Backend (StandingsController):
   - Obtiene todos los teams de la categoría
   - Obtiene todos los matches de la categoría
   - StandingsCalculator.calculate() calcula tabla
   ↓
6. Devuelve: StandingOutput[]
   ↓
7. Frontend renderiza StandingsTable
   ↓
8. Usuario ve tabla con:
   - Posiciones
   - Nombres de equipos
   - Puntos, goles, etc.
```

## Ejemplo 2: Ver Jugadores de un Equipo

```
1. Usuario en tabla de posiciones
   ↓
2. Click en "Real Madrid"
   ↓
3. Frontend hace: GET /api/players?teamId=team_rm
   ↓
4. Backend (PlayerController):
   - Busca todos los players del team_rm
   ↓
5. Devuelve: Player[]
   ↓
6. Frontend renderiza PlayerCard[] en grid
   ↓
7. Usuario ve:
   - Foto del jugador
   - Nombre
   - Posición
   - Número de dorsal
   - Goles + Puntos de la temporada
```

## Ejemplo 3: Registrar Resultado de Partido

```
1. Admin en aplicación (página especial)
   ↓
2. Llena formulario:
   - Match ID
   - Goles local y visitante
   - Stats de cada jugador (goles, asistencias, minutos, etc)
   ↓
3. Click "Registrar Resultado"
   ↓
4. Frontend hace: POST /api/matches/match_1/result
   {
     "homeGoals": 3,
     "awayGoals": 1,
     "playerStats": [
       {"playerId": "p1", "goals": 2, "assists": 1, "minutesPlayed": 90}
     ]
   }
   ↓
5. Backend (MatchService.recordResult):
   a) Actualiza Match con goles
   b) Para cada PlayerStat:
      - Crea PlayerMatchStat en BD
      - ScoringEngine calcula puntos
      - Actualiza seasonGoals y seasonPoints del jugador
   c) StandingsCalculator recalcula tabla completa
   ↓
6. Devuelve: {match actualizado, standings recalculada}
   ↓
7. Frontend actualiza vista
   ↓
8. Usuarios ven:
   - Tabla actualizada
   - Goleadores actualizados
   - Resultado del partido
```

---

# 📡 ENDPOINTS QUE FRONTEND USA

## Categorías
```
GET /api/categories
Response: Category[]

GET /api/categories/:id
Response: Category
```

## Equipos
```
GET /api/teams?categoryId=xxx
Response: Team[]

GET /api/teams/:id
Response: Team
```

## Jugadores
```
GET /api/players?teamId=xxx
Response: Player[]

GET /api/players?categoryId=xxx
Response: Player[]

GET /api/players/:id
Response: Player
```

## Partidos
```
GET /api/matches?categoryId=xxx&status=scheduled
Response: Match[]

GET /api/matches?categoryId=xxx&status=in_progress
Response: Match[]

GET /api/matches?categoryId=xxx&status=finished
Response: Match[]

GET /api/matches/:id
Response: Match
```

## Tabla de Posiciones
```
GET /api/standings/:categoryId
Response: {standings: Standing[]}
```

## Goleadores
```
GET /api/scorers/:categoryId/top?limit=10
Response: {scorers: TopScorer[]}

GET /api/scorers/:categoryId
Response: {scorers: TopScorer[]}
```

---

# 🧪 TESTING FULL STACK

## 1. Iniciar Backend

```bash
cd backend
npm run dev

# Debe mostrar:
# ✓ Database connected
# 🚀 Backend running at http://localhost:4000
```

## 2. Ejecutar Seed (datos de prueba)

```bash
cd backend
npm run seed

# Debe mostrar:
# ✅ Seed completed successfully!
# - 1 Category
# - 3 Teams
# - 9 Players
# - 2 Finished matches
# - 5 Player match stats
```

## 3. Iniciar Frontend

```bash
cd frontend
npm run dev

# Debe mostrar:
# ▲ Next.js 14.0.0
# - Local: http://localhost:3000
```

## 4. Navegar en Frontend

```
http://localhost:3000
├─ Ver Home con hero + categorías ✓
├─ Click en categoría
│  ├─ Ver tabla de posiciones ✓
│  ├─ Click en equipo
│  │  └─ Ver jugadores ✓
│  └─ Tab de partidos
│     ├─ Ver próximos ✓
│     ├─ Ver en juego ✓
│     └─ Ver terminados ✓
└─ Tab de goleadores ✓
```

## 5. Verificar en DevTools

```javascript
// En console del navegador:
// Debe ver requests a:
// GET http://localhost:4000/api/categories
// GET http://localhost:4000/api/standings/[id]
// GET http://localhost:4000/api/players?teamId=[id]
// GET http://localhost:4000/api/matches?categoryId=[id]
// GET http://localhost:4000/api/scorers/[categoryId]/top
```

---

# ⚙️ VARIABLES DE ENTORNO

## Backend

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

## Frontend

**`frontend/.env.local`:**
```env
# API Backend
NEXT_PUBLIC_API_URL=http://localhost:4000/api

# App
NEXT_PUBLIC_APP_NAME=DeporteHN

# Hero Animation (usuario proporciona link a Lottie JSON)
NEXT_PUBLIC_HERO_ANIMATION_URL=https://lottie.host/[ID]/animation.json
```

---

# 🎬 INTEGRACIÓN PASO A PASO

## Paso 1: Backend funcionando

```bash
# Terminal 1
cd backend
npm run dev
npm run seed

# Verificar:
curl http://localhost:4000/api/health
# ✓ {"status":"ok"}
```

## Paso 2: Frontend inicial

```bash
# Terminal 2
cd frontend
npm install
npm run dev

# Verificar:
# http://localhost:3000 debe cargar sin errores
```

## Paso 3: Conectar API

**`frontend/.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

## Paso 4: Copiar componentes

Copiar todos los archivos de:
- `src/components/ui/`
- `src/components/sports/`
- `src/lib/`
- `src/types/`
- `app/` (pages)

## Paso 5: Probar cada página

```
✓ http://localhost:3000 - Home
✓ http://localhost:3000/categories/[id] - Tabla
✓ http://localhost:3000/teams/[id] - Jugadores
✓ http://localhost:3000/matches/[id] - Partidos
```

---

# 🔍 DEBUGGING

## Frontend no conecta al Backend

```bash
# 1. Verificar que backend corre
curl http://localhost:4000/api/health

# 2. Verificar CORS en .env.local
NEXT_PUBLIC_API_URL=http://localhost:4000/api

# 3. Ver console del navegador (DevTools)
# Debe ver requests sin errores CORS
```

## Datos no se muestran

```bash
# 1. Verificar que seed corrió
# Base de datos debe tener datos

# 2. Verificar endpoint en Postman
curl http://localhost:4000/api/standings/[CATEGORY_ID]

# 3. Ver network tab en DevTools
# Request debe tener status 200
```

## Tabla de posiciones vacía

```bash
# Esto es normal si no hay partidos terminados
# Los partidos del seed tienen status "finished"
# Si no ves tabla, verificar:

# 1. Base de datos tiene datos
# 2. Backend calcula standings correctamente
# 3. Frontend recibe standings desde API

# Solución: Ejecutar seed de nuevo
npm run seed
```

---

# 📝 NOTAS IMPORTANTES

## SOLID Principles

✅ **Single Responsibility**
- ScoringEngine solo calcula puntos
- StandingsCalculator solo calcula tabla
- Cada servicio un caso de uso

✅ **Open/Closed**
- Fácil agregar nuevas categorías sin cambiar código
- Fácil cambiar scoring sin afectar otros servicios

✅ **Liskov Substitution**
- Repositories son intercambiables
- Fácil cambiar de Prisma a otra BD

✅ **Interface Segregation**
- Interfaces específicas, no monolíticas

✅ **Dependency Inversion**
- Todo depende de abstracciones
- Fácil de testear

## Independencia de Variables

✅ **Si se elimina un jugador**
- Solo se borra su registro
- Stats históricas quedan (huérfanas)
- No rompe nada más

✅ **Si se cambia scoring**
- Solo cambias ScoringEngine
- El resto sigue igual

✅ **Si se elimina un equipo**
- Cascade delete automático
- Sus jugadores, partidos se borran
- Tabla se recalcula correctamente

✅ **Si se actualiza resultado**
- No borra nada
- Solo actualiza y recalcula
- Totalmente reversible

---

# 🎯 PRÓXIMOS PASOS

1. **Backend** ✅ (Completo)
   - Schema Prisma
   - Migration
   - Services + Controllers
   - Testing con curl

2. **Frontend** 🔄 (En construcción)
   - Componentes base
   - Componentes deportivos
   - Páginas
   - Conectar a API

3. **Extras** (Futuro)
   - Admin dashboard para registrar resultados
   - Notificaciones en tiempo real
   - Exportar datos (PDF/Excel)
   - Autenticación

---

# 📞 SOPORTE

Si algo no funciona:

1. Revisar console del navegador (DevTools)
2. Revisar logs del backend
3. Verificar que backend corre en puerto 4000
4. Verificar que frontend corre en puerto 3000
5. Verificar que base de datos tiene datos (seed)
6. Probar endpoints con curl

---

**¡Tu app DeporteHN está lista para brillar! 🚀⚽**
