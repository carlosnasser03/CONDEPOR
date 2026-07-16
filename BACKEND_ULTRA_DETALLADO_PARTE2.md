# 🏆 DeporteHN - BACKEND COMPLETO (PARTE 2)
## Controllers, Routes, Server Configuration, Testing

---

# ✅ PASO 5 CONTINUACIÓN: REPOSITORIES

## 5.3 Repositorios Completos

**`backend/src/infrastructure/persistence/prisma/PrismaTeamRepository.ts`:**

```typescript
import { IRepository } from "@application/ports/IRepository";
import { getPrismaClient } from "./PrismaClient";

export interface Team {
  id: string;
  name: string;
  crestUrl: string | null;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class PrismaTeamRepository implements IRepository<Team> {
  private prisma = getPrismaClient();

  async create(data: Partial<Team>): Promise<Team> {
    return this.prisma.team.create({
      data: {
        name: data.name!,
        crestUrl: data.crestUrl,
        categoryId: data.categoryId!,
      },
    }) as Promise<Team>;
  }

  async findById(id: string): Promise<Team | null> {
    return (this.prisma.team.findUnique({
      where: { id },
    }) as Promise<Team | null>) || null;
  }

  async findMany(filters?: Record<string, any>): Promise<Team[]> {
    return (this.prisma.team.findMany({
      where: filters,
    }) as Promise<Team[]>) || [];
  }

  async update(id: string, data: Partial<Team>): Promise<Team> {
    return this.prisma.team.update({
      where: { id },
      data,
    }) as Promise<Team>;
  }

  async delete(id: string): Promise<void> {
    // Cascade a Players
    await this.prisma.player.deleteMany({
      where: { teamId: id },
    });

    // Cascade a Matches
    await this.prisma.match.deleteMany({
      where: {
        OR: [{ homeTeamId: id }, { awayTeamId: id }],
      },
    });

    await this.prisma.team.delete({
      where: { id },
    });
  }
}
```

**`backend/src/infrastructure/persistence/prisma/PrismaPlayerRepository.ts`:**

```typescript
import { IRepository } from "@application/ports/IRepository";
import { getPrismaClient } from "./PrismaClient";

export interface Player {
  id: string;
  name: string;
  photoUrl: string | null;
  position: string;
  jerseyNumber: number;
  teamId: string;
  categoryId: string;
  seasonGoals: number;
  seasonPoints: number;
  seasonMatches: number;
  createdAt: Date;
  updatedAt: Date;
}

export class PrismaPlayerRepository implements IRepository<Player> {
  private prisma = getPrismaClient();

  async create(data: Partial<Player>): Promise<Player> {
    return this.prisma.player.create({
      data: {
        name: data.name!,
        photoUrl: data.photoUrl,
        position: data.position!,
        jerseyNumber: data.jerseyNumber!,
        teamId: data.teamId!,
        categoryId: data.categoryId!,
        seasonGoals: 0,
        seasonPoints: 0,
        seasonMatches: 0,
      },
    }) as Promise<Player>;
  }

  async findById(id: string): Promise<Player | null> {
    return (this.prisma.player.findUnique({
      where: { id },
      include: { team: true },
    }) as Promise<Player | null>) || null;
  }

  async findMany(filters?: Record<string, any>): Promise<Player[]> {
    return (this.prisma.player.findMany({
      where: filters,
      include: { team: true },
    }) as Promise<Player[]>) || [];
  }

  async update(id: string, data: Partial<Player>): Promise<Player> {
    return this.prisma.player.update({
      where: { id },
      data,
    }) as Promise<Player>;
  }

  async delete(id: string): Promise<void> {
    // Las stats (PlayerMatchStat) quedan como huérfanas pero se guardan
    await this.prisma.player.delete({
      where: { id },
    });
  }
}
```

**`backend/src/infrastructure/persistence/prisma/PrismaPlayerMatchStatRepository.ts`:**

```typescript
import { IRepository } from "@application/ports/IRepository";
import { getPrismaClient } from "./PrismaClient";

export interface PlayerMatchStat {
  id: string;
  playerId: string;
  matchId: string;
  goals: number;
  assists: number;
  minutesPlayed: number;
  cleanSheet: boolean;
  points: number;
  createdAt: Date;
}

export class PrismaPlayerMatchStatRepository
  implements IRepository<PlayerMatchStat>
{
  private prisma = getPrismaClient();

  async create(data: Partial<PlayerMatchStat>): Promise<PlayerMatchStat> {
    return this.prisma.playerMatchStat.create({
      data: {
        playerId: data.playerId!,
        matchId: data.matchId!,
        goals: data.goals || 0,
        assists: data.assists || 0,
        minutesPlayed: data.minutesPlayed || 0,
        cleanSheet: data.cleanSheet || false,
        points: data.points || 0,
      },
    }) as Promise<PlayerMatchStat>;
  }

  async findById(id: string): Promise<PlayerMatchStat | null> {
    return (this.prisma.playerMatchStat.findUnique({
      where: { id },
      include: { player: true, match: true },
    }) as Promise<PlayerMatchStat | null>) || null;
  }

  async findMany(filters?: Record<string, any>): Promise<PlayerMatchStat[]> {
    return (this.prisma.playerMatchStat.findMany({
      where: filters,
      include: { player: true, match: true },
    }) as Promise<PlayerMatchStat[]>) || [];
  }

  async update(
    id: string,
    data: Partial<PlayerMatchStat>
  ): Promise<PlayerMatchStat> {
    return this.prisma.playerMatchStat.update({
      where: { id },
      data,
    }) as Promise<PlayerMatchStat>;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.playerMatchStat.delete({
      where: { id },
    });
  }
}
```

---

# ✅ PASO 6: CONTROLLERS

## 6.1 Match Controller

**`backend/src/infrastructure/http/controllers/MatchController.ts`:**

```typescript
/**
 * MATCH CONTROLLER
 * 
 * Responsabilidades:
 * - Recibir HTTP requests
 * - Validar entrada
 * - Llamar al service
 * - Devolver HTTP response
 * 
 * NO HACE:
 * - Lógica de negocio (eso es service)
 * - Acceso a BD (eso es repository)
 */

import { Request, Response } from "express";
import { MatchService } from "@application/MatchService";

export class MatchController {
  constructor(private matchService: MatchService) {}

  /**
   * POST /api/matches
   * Crear nuevo partido
   */
  async createMatch(req: Request, res: Response): Promise<void> {
    try {
      const { categoryId, homeTeamId, awayTeamId, date, venue } = req.body;

      // Validar campos requeridos
      if (!categoryId || !homeTeamId || !awayTeamId || !date || !venue) {
        res.status(400).json({
          error: "Missing required fields",
          required: [
            "categoryId",
            "homeTeamId",
            "awayTeamId",
            "date",
            "venue",
          ],
        });
        return;
      }

      // Llamar service
      const match = await this.matchService.createMatch({
        categoryId,
        homeTeamId,
        awayTeamId,
        date: new Date(date),
        venue,
      });

      res.status(201).json({
        success: true,
        data: match,
      });
    } catch (error: any) {
      res.status(400).json({
        error: error.message,
      });
    }
  }

  /**
   * GET /api/matches
   * Listar partidos con filtros opcionales
   */
  async getMatches(req: Request, res: Response): Promise<void> {
    try {
      const { categoryId, status, teamId } = req.query;

      const matches = await this.matchService.getMatches({
        categoryId: categoryId as string,
        status: status as string,
        teamId: teamId as string,
      });

      res.json({
        success: true,
        count: matches.length,
        data: matches,
      });
    } catch (error: any) {
      res.status(400).json({
        error: error.message,
      });
    }
  }

  /**
   * GET /api/matches/:id
   * Obtener detalle de un partido
   */
  async getMatch(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const match = await this.matchService.getMatchDetail(id);
      if (!match) {
        res.status(404).json({
          error: "Match not found",
        });
        return;
      }

      res.json({
        success: true,
        data: match,
      });
    } catch (error: any) {
      res.status(400).json({
        error: error.message,
      });
    }
  }

  /**
   * POST /api/matches/:id/result
   * ⭐ REGISTRAR RESULTADO (CRÍTICO)
   * 
   * ENTRADA:
   * {
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
  async recordResult(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { homeGoals, awayGoals, playerStats } = req.body;

      // Validaciones
      if (homeGoals === undefined || awayGoals === undefined) {
        res.status(400).json({
          error: "Missing required fields",
          required: ["homeGoals", "awayGoals", "playerStats"],
        });
        return;
      }

      if (!Array.isArray(playerStats)) {
        res.status(400).json({
          error: "playerStats must be an array",
        });
        return;
      }

      if (homeGoals < 0 || awayGoals < 0) {
        res.status(400).json({
          error: "Goals cannot be negative",
        });
        return;
      }

      // Registrar resultado
      const result = await this.matchService.recordResult(id, {
        homeGoals,
        awayGoals,
        playerStats,
      });

      res.json({
        success: true,
        message: "Result registered successfully",
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        error: error.message,
      });
    }
  }

  /**
   * PUT /api/matches/:id
   * Actualizar partido
   */
  async updateMatch(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { date, venue } = req.body;

      const match = await this.matchService.updateMatch(id, {
        ...(date && { date: new Date(date) }),
        venue,
      });

      res.json({
        success: true,
        data: match,
      });
    } catch (error: any) {
      res.status(400).json({
        error: error.message,
      });
    }
  }

  /**
   * DELETE /api/matches/:id
   * Eliminar partido
   */
  async deleteMatch(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      await this.matchService.deleteMatch(id);

      res.json({
        success: true,
        message: "Match deleted successfully",
      });
    } catch (error: any) {
      res.status(400).json({
        error: error.message,
      });
    }
  }
}
```

## 6.2 Standings Controller

**`backend/src/infrastructure/http/controllers/StandingsController.ts`:**

```typescript
import { Request, Response } from "express";
import { StandingsService } from "@application/StandingsService";

export class StandingsController {
  constructor(private standingsService: StandingsService) {}

  /**
   * GET /api/standings/:categoryId
   * Obtener tabla de posiciones
   */
  async getStandingsByCategory(req: Request, res: Response): Promise<void> {
    try {
      const { categoryId } = req.params;

      const standings =
        await this.standingsService.getByCategoryId(categoryId);

      res.json({
        success: true,
        categoryId,
        count: standings.length,
        standings,
        lastUpdated: new Date(),
      });
    } catch (error: any) {
      res.status(400).json({
        error: error.message,
      });
    }
  }
}
```

## 6.3 Scorer Controller

**`backend/src/infrastructure/http/controllers/ScorerController.ts`:**

```typescript
import { Request, Response } from "express";
import { ScorerService } from "@application/ScorerService";

export class ScorerController {
  constructor(private scorerService: ScorerService) {}

  /**
   * GET /api/scorers/:categoryId?limit=10
   * Obtener top goleadores
   */
  async getTopScorers(req: Request, res: Response): Promise<void> {
    try {
      const { categoryId } = req.params;
      const { limit = "10" } = req.query;

      const scorers = await this.scorerService.getTopScorers(
        categoryId,
        parseInt(limit as string)
      );

      res.json({
        success: true,
        categoryId,
        count: scorers.length,
        scorers,
      });
    } catch (error: any) {
      res.status(400).json({
        error: error.message,
      });
    }
  }

  /**
   * GET /api/scorers/:categoryId/all
   * Obtener todos los scorers
   */
  async getAllScorers(req: Request, res: Response): Promise<void> {
    try {
      const { categoryId } = req.params;

      const scorers = await this.scorerService.getAllScorers(categoryId);

      res.json({
        success: true,
        categoryId,
        count: scorers.length,
        scorers,
      });
    } catch (error: any) {
      res.status(400).json({
        error: error.message,
      });
    }
  }
}
```

---

# ✅ PASO 7: ROUTES

## 7.1 Match Routes

**`backend/src/infrastructure/http/routes/matchRoutes.ts`:**

```typescript
import { Router } from "express";
import { MatchController } from "../controllers/MatchController";
import { MatchService } from "@application/MatchService";
import { PrismaMatchRepository } from "@infrastructure/persistence/prisma/PrismaMatchRepository";
import { PrismaTeamRepository } from "@infrastructure/persistence/prisma/PrismaTeamRepository";
import { PrismaPlayerRepository } from "@infrastructure/persistence/prisma/PrismaPlayerRepository";
import { PrismaPlayerMatchStatRepository } from "@infrastructure/persistence/prisma/PrismaPlayerMatchStatRepository";
import { ScoringEngine } from "@domain/scoring/ScoringEngine";
import { StandingsCalculator } from "@domain/standings/StandingsCalculator";
import { getPrismaClient } from "@infrastructure/persistence/prisma/PrismaClient";

const router = Router();

// Inyección de dependencias
const prisma = getPrismaClient();
const matchRepo = new PrismaMatchRepository();
const teamRepo = new PrismaTeamRepository();
const playerRepo = new PrismaPlayerRepository();
const statRepo = new PrismaPlayerMatchStatRepository();
const scoringEngine = new ScoringEngine();
const standingsCalculator = new StandingsCalculator(prisma);

const matchService = new MatchService(
  matchRepo,
  teamRepo,
  playerRepo,
  statRepo,
  scoringEngine,
  standingsCalculator
);

const controller = new MatchController(matchService);

// Rutas
router.post("/", (req, res) => controller.createMatch(req, res));
router.get("/", (req, res) => controller.getMatches(req, res));
router.get("/:id", (req, res) => controller.getMatch(req, res));
router.put("/:id", (req, res) => controller.updateMatch(req, res));
router.delete("/:id", (req, res) => controller.deleteMatch(req, res));
router.post("/:id/result", (req, res) => controller.recordResult(req, res));

export default router;
```

## 7.2 Standings Routes

**`backend/src/infrastructure/http/routes/standingsRoutes.ts`:**

```typescript
import { Router } from "express";
import { StandingsController } from "../controllers/StandingsController";
import { StandingsService } from "@application/StandingsService";
import { PrismaTeamRepository } from "@infrastructure/persistence/prisma/PrismaTeamRepository";
import { PrismaMatchRepository } from "@infrastructure/persistence/prisma/PrismaMatchRepository";
import { StandingsCalculator } from "@domain/standings/StandingsCalculator";
import { getPrismaClient } from "@infrastructure/persistence/prisma/PrismaClient";

const router = Router();

const prisma = getPrismaClient();
const teamRepo = new PrismaTeamRepository();
const matchRepo = new PrismaMatchRepository();
const calculator = new StandingsCalculator(prisma);

const service = new StandingsService(teamRepo, matchRepo, calculator);
const controller = new StandingsController(service);

router.get("/:categoryId", (req, res) =>
  controller.getStandingsByCategory(req, res)
);

export default router;
```

## 7.3 Scorer Routes

**`backend/src/infrastructure/http/routes/scorerRoutes.ts`:**

```typescript
import { Router } from "express";
import { ScorerController } from "../controllers/ScorerController";
import { ScorerService } from "@application/ScorerService";
import { PrismaPlayerRepository } from "@infrastructure/persistence/prisma/PrismaPlayerRepository";

const router = Router();

const playerRepo = new PrismaPlayerRepository();
const service = new ScorerService(playerRepo);
const controller = new ScorerController(service);

router.get("/:categoryId/top", (req, res) =>
  controller.getTopScorers(req, res)
);
router.get("/:categoryId", (req, res) => controller.getAllScorers(req, res));

export default router;
```

---

# ✅ PASO 8: SERVER CONFIGURATION

## 8.1 Express App

**`backend/src/app.ts`:**

```typescript
/**
 * CONFIGURACIÓN DE EXPRESS
 * Sin iniciar listen (separado para testing)
 */

import express, { Express } from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";

import matchRoutes from "@infrastructure/http/routes/matchRoutes";
import standingsRoutes from "@infrastructure/http/routes/standingsRoutes";
import scorerRoutes from "@infrastructure/http/routes/scorerRoutes";

export function createApp(): Express {
  const app = express();

  // ==================
  // MIDDLEWARE SEGURIDAD
  // ==================
  app.use(helmet());
  app.use(compression());

  // ==================
  // MIDDLEWARE CORS
  // ==================
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || "http://localhost:3000",
      credentials: true,
    })
  );

  // ==================
  // MIDDLEWARE PARSING
  // ==================
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ==================
  // HEALTH CHECK
  // ==================
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    });
  });

  // ==================
  // API ROUTES
  // ==================
  app.use("/api/matches", matchRoutes);
  app.use("/api/standings", standingsRoutes);
  app.use("/api/scorers", scorerRoutes);

  // ==================
  // 404 HANDLER
  // ==================
  app.use((req, res) => {
    res.status(404).json({
      error: "Route not found",
      path: req.path,
      method: req.method,
    });
  });

  // ==================
  // ERROR HANDLER
  // ==================
  app.use(
    (
      err: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      console.error(err);
      res.status(500).json({
        error: "Internal server error",
        message: process.env.NODE_ENV === "development" ? err.message : "",
      });
    }
  );

  return app;
}
```

## 8.2 Server Startup

**`backend/src/server.ts`:**

```typescript
/**
 * PUNTO DE ENTRADA DEL SERVER
 * Aquí se inicia Express y se escucha en puerto
 */

import { createApp } from "./app";
import { getPrismaClient, disconnectPrisma } from "@infrastructure/persistence/prisma/PrismaClient";

const PORT = parseInt(process.env.PORT || "4000", 10);

async function startServer(): Promise<void> {
  try {
    // Crear app
    const app = createApp();

    // Verificar conexión a BD
    const prisma = getPrismaClient();
    await prisma.$queryRaw`SELECT 1`;
    console.log("✓ Database connected");

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`\n🚀 Backend running at http://localhost:${PORT}`);
      console.log(`📊 API at http://localhost:${PORT}/api`);
      console.log(`✓ Health check at http://localhost:${PORT}/api/health\n`);
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      console.log("\nShutting down...");
      await disconnectPrisma();
      process.exit(0);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
```

## 8.3 Main Entry Point

**`backend/src/index.ts`:**

```typescript
/**
 * Exportar app para testing
 */

export { createApp } from "./app";
```

---

# ✅ PASO 9: SEED DATA

## 9.1 Crear Seed File

**`backend/prisma/seed.ts`:**

```typescript
/**
 * SEED DATA
 * 
 * Crea datos de prueba para desarrollo
 * Ejecutar con: npm run seed
 * 
 * Crea:
 * - 1 Categoría
 * - 3 Equipos
 * - 9 Jugadores (3 por equipo)
 * - 3 Partidos
 * - Resultados y stats
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...\n");

  try {
    // LIMPIAR BD EXISTENTE
    console.log("🧹 Cleaning database...");
    await prisma.playerMatchStat.deleteMany();
    await prisma.match.deleteMany();
    await prisma.player.deleteMany();
    await prisma.team.deleteMany();
    await prisma.category.deleteMany();

    // CREAR CATEGORÍA
    console.log("📋 Creating category...");
    const category = await prisma.category.create({
      data: {
        name: "Fútbol Infantil U-12",
        color: "#2563eb",
        description: "Menores de 12 años",
      },
    });
    console.log(`✓ Category created: ${category.name}`);

    // CREAR EQUIPOS
    console.log("\n⚽ Creating teams...");
    const teams = await Promise.all([
      prisma.team.create({
        data: {
          name: "Real Madrid",
          categoryId: category.id,
          crestUrl: "https://via.placeholder.com/100?text=RM",
        },
      }),
      prisma.team.create({
        data: {
          name: "Barcelona",
          categoryId: category.id,
          crestUrl: "https://via.placeholder.com/100?text=FCB",
        },
      }),
      prisma.team.create({
        data: {
          name: "Atlético Madrid",
          categoryId: category.id,
          crestUrl: "https://via.placeholder.com/100?text=ATM",
        },
      }),
    ]);
    console.log(`✓ ${teams.length} teams created`);

    // CREAR JUGADORES
    console.log("\n👥 Creating players...");
    const players = await Promise.all([
      // Real Madrid
      prisma.player.create({
        data: {
          name: "Vinicius Jr",
          position: "Delantero",
          jerseyNumber: 7,
          photoUrl: "https://via.placeholder.com/150?text=Vinicius",
          teamId: teams[0].id,
          categoryId: category.id,
        },
      }),
      prisma.player.create({
        data: {
          name: "Jude Bellingham",
          position: "Medio",
          jerseyNumber: 5,
          photoUrl: "https://via.placeholder.com/150?text=Bellingham",
          teamId: teams[0].id,
          categoryId: category.id,
        },
      }),
      prisma.player.create({
        data: {
          name: "Rodrygo",
          position: "Delantero",
          jerseyNumber: 21,
          photoUrl: "https://via.placeholder.com/150?text=Rodrygo",
          teamId: teams[0].id,
          categoryId: category.id,
        },
      }),
      // Barcelona
      prisma.player.create({
        data: {
          name: "Robert Lewandowski",
          position: "Delantero",
          jerseyNumber: 9,
          photoUrl:
            "https://via.placeholder.com/150?text=Lewandowski",
          teamId: teams[1].id,
          categoryId: category.id,
        },
      }),
      prisma.player.create({
        data: {
          name: "Gavi",
          position: "Medio",
          jerseyNumber: 6,
          photoUrl: "https://via.placeholder.com/150?text=Gavi",
          teamId: teams[1].id,
          categoryId: category.id,
        },
      }),
      prisma.player.create({
        data: {
          name: "Lamine Yamal",
          position: "Delantero",
          jerseyNumber: 27,
          photoUrl: "https://via.placeholder.com/150?text=Yamal",
          teamId: teams[1].id,
          categoryId: category.id,
        },
      }),
      // Atlético
      prisma.player.create({
        data: {
          name: "Antoine Griezmann",
          position: "Delantero",
          jerseyNumber: 8,
          photoUrl: "https://via.placeholder.com/150?text=Griezmann",
          teamId: teams[2].id,
          categoryId: category.id,
        },
      }),
      prisma.player.create({
        data: {
          name: "Rodrigo De Paul",
          position: "Medio",
          jerseyNumber: 4,
          photoUrl: "https://via.placeholder.com/150?text=DePaul",
          teamId: teams[2].id,
          categoryId: category.id,
        },
      }),
      prisma.player.create({
        data: {
          name: "Koke",
          position: "Medio",
          jerseyNumber: 6,
          photoUrl: "https://via.placeholder.com/150?text=Koke",
          teamId: teams[2].id,
          categoryId: category.id,
        },
      }),
    ]);
    console.log(`✓ ${players.length} players created`);

    // CREAR PARTIDOS
    console.log("\n🎮 Creating matches...");
    const now = new Date();
    const matches = await Promise.all([
      prisma.match.create({
        data: {
          categoryId: category.id,
          homeTeamId: teams[0].id,
          awayTeamId: teams[1].id,
          date: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
          venue: "Estadio Bernabéu",
          status: "finished",
          homeGoals: 3,
          awayGoals: 2,
        },
      }),
      prisma.match.create({
        data: {
          categoryId: category.id,
          homeTeamId: teams[1].id,
          awayTeamId: teams[2].id,
          date: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
          venue: "Camp Nou",
          status: "finished",
          homeGoals: 2,
          awayGoals: 1,
        },
      }),
      prisma.match.create({
        data: {
          categoryId: category.id,
          homeTeamId: teams[2].id,
          awayTeamId: teams[0].id,
          date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
          venue: "Wanda Metropolitano",
          status: "scheduled",
          homeGoals: null,
          awayGoals: null,
        },
      }),
    ]);
    console.log(`✓ ${matches.length} matches created`);

    // CREAR STATS
    console.log("\n📊 Creating player match stats...");
    const stats = await Promise.all([
      // Match 1: Real Madrid 3 - Barcelona 2
      prisma.playerMatchStat.create({
        data: {
          playerId: players[0].id, // Vinicius
          matchId: matches[0].id,
          goals: 2,
          assists: 1,
          minutesPlayed: 90,
          cleanSheet: false,
          points: 24, // (2*10) + (1*3) + 0 + 0 + 1 = 24
        },
      }),
      prisma.playerMatchStat.create({
        data: {
          playerId: players[1].id, // Bellingham
          matchId: matches[0].id,
          goals: 1,
          assists: 0,
          minutesPlayed: 85,
          cleanSheet: false,
          points: 11, // (1*10) + 0 + 0 + 0 + 1 = 11
        },
      }),
      prisma.playerMatchStat.create({
        data: {
          playerId: players[3].id, // Lewandowski
          matchId: matches[0].id,
          goals: 2,
          assists: 0,
          minutesPlayed: 90,
          cleanSheet: false,
          points: 21, // (2*10) + 0 + 0 + 0 + 1 = 21
        },
      }),
      // Match 2: Barcelona 2 - Atlético 1
      prisma.playerMatchStat.create({
        data: {
          playerId: players[3].id, // Lewandowski
          matchId: matches[1].id,
          goals: 1,
          assists: 1,
          minutesPlayed: 90,
          cleanSheet: false,
          points: 14, // (1*10) + (1*3) + 0 + 0 + 1 = 14
        },
      }),
      prisma.playerMatchStat.create({
        data: {
          playerId: players[6].id, // Griezmann
          matchId: matches[1].id,
          goals: 1,
          assists: 0,
          minutesPlayed: 75,
          cleanSheet: false,
          points: 10, // (1*10) + 0 + 0 + 0 = 10
        },
      }),
    ]);
    console.log(`✓ ${stats.length} player stats created`);

    // ACTUALIZAR STATS ACUMULATIVAS
    console.log("\n🔄 Updating player season stats...");
    await prisma.player.update({
      where: { id: players[0].id }, // Vinicius
      data: {
        seasonGoals: 2,
        seasonPoints: 24,
      },
    });
    await prisma.player.update({
      where: { id: players[1].id }, // Bellingham
      data: {
        seasonGoals: 1,
        seasonPoints: 11,
      },
    });
    await prisma.player.update({
      where: { id: players[3].id }, // Lewandowski
      data: {
        seasonGoals: 3,
        seasonPoints: 35,
      },
    });
    await prisma.player.update({
      where: { id: players[6].id }, // Griezmann
      data: {
        seasonGoals: 1,
        seasonPoints: 10,
      },
    });

    console.log("\n✅ Seed completed successfully!");
    console.log("\nData created:");
    console.log(`- 1 Category`);
    console.log(`- 3 Teams`);
    console.log(`- 9 Players`);
    console.log(`- 2 Finished matches`);
    console.log(`- 1 Scheduled match`);
    console.log(`- 5 Player match stats`);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
```

## 9.2 Actualizar package.json

En `backend/package.json`, agregar a scripts:

```json
"scripts": {
  "seed": "ts-node prisma/seed.ts"
}
```

---

# ✅ PASO 10: TESTING CON CURL

## 10.1 Iniciar Backend

```bash
cd backend

# Terminal 1: Iniciar server
npm run dev

# Debe mostrar:
# ✓ Database connected
# 🚀 Backend running at http://localhost:4000
# 📊 API at http://localhost:4000/api
```

## 10.2 Ejecutar Seed

```bash
cd backend

# En otra terminal:
npm run seed

# Debe mostrar:
# ✅ Seed completed successfully!
# - 1 Category
# - 3 Teams
# - 9 Players
# - 2 Finished matches
# - 1 Scheduled match
# - 5 Player match stats
```

## 10.3 Testing Endpoints

### Test 1: Health Check

```bash
curl http://localhost:4000/api/health

# Response:
# {
#   "status": "ok",
#   "timestamp": "2024-02-15T10:00:00.000Z",
#   "environment": "development"
# }
```

### Test 2: Ver Tabla de Posiciones

```bash
# Primero obtener categoryId del seed
curl http://localhost:4000/api/standings/[CATEGORY_ID]

# Expected:
# {
#   "success": true,
#   "categoryId": "...",
#   "count": 3,
#   "standings": [
#     {
#       "position": 1,
#       "teamName": "Real Madrid",
#       "points": 3,
#       "played": 1,
#       "wins": 1,
#       "draws": 0,
#       "losses": 0,
#       "goalsFor": 3,
#       "goalsAgainst": 2,
#       "goalDifference": 1
#     }
#   ]
# }
```

### Test 3: Ver Goleadores

```bash
curl http://localhost:4000/api/scorers/[CATEGORY_ID]/top

# Expected:
# {
#   "success": true,
#   "categoryId": "...",
#   "count": 4,
#   "scorers": [
#     {
#       "position": 1,
#       "playerName": "Robert Lewandowski",
#       "teamName": "Barcelona",
#       "goals": 3,
#       "points": 35
#     }
#   ]
# }
```

### Test 4: Crear Nuevo Partido

```bash
curl -X POST http://localhost:4000/api/matches \
  -H "Content-Type: application/json" \
  -d '{
    "categoryId": "[CATEGORY_ID]",
    "homeTeamId": "[TEAM_1_ID]",
    "awayTeamId": "[TEAM_2_ID]",
    "date": "2024-02-20T15:00:00",
    "venue": "Nueva Cancha"
  }'

# Response:
# {
#   "success": true,
#   "data": {
#     "id": "match_xyz",
#     "status": "scheduled",
#     "homeGoals": null,
#     "awayGoals": null
#   }
# }
```

### Test 5: Registrar Resultado (CRÍTICO)

```bash
curl -X POST http://localhost:4000/api/matches/[MATCH_ID]/result \
  -H "Content-Type: application/json" \
  -d '{
    "homeGoals": 4,
    "awayGoals": 1,
    "playerStats": [
      {
        "playerId": "[PLAYER_1_ID]",
        "goals": 2,
        "assists": 1,
        "minutesPlayed": 90,
        "cleanSheet": false
      },
      {
        "playerId": "[PLAYER_2_ID]",
        "goals": 1,
        "assists": 0,
        "minutesPlayed": 85,
        "cleanSheet": false
      },
      {
        "playerId": "[PLAYER_3_ID]",
        "goals": 1,
        "assists": 0,
        "minutesPlayed": 70,
        "cleanSheet": false
      }
    ]
  }'

# Response:
# {
#   "success": true,
#   "message": "Result registered successfully",
#   "data": {
#     "match": { ... actualizado ... },
#     "standings": [ ... recalculada ... ]
#   }
# }
```

### Test 6: Ver Tabla Actualizada (Después de registrar resultado)

```bash
curl http://localhost:4000/api/standings/[CATEGORY_ID]

# Debe mostrar tabla actualizada con nuevo partido
# Equipo goleador debe tener más puntos
```

---

# ✅ VERIFICACIÓN FINAL

```bash
# 1. Backend corriendo
curl http://localhost:4000/api/health
# Debe devolver: {"status":"ok"}

# 2. Base de datos con datos
curl http://localhost:4000/api/standings/[CATEGORY_ID]
# Debe devolver tabla con equipos

# 3. Scoring funciona
# Ver goleadores debe mostrar Lewandowski con 3 goles

# 4. Tabla se actualiza
# Crear partido, registrar resultado, tabla debe cambiar
```

---

# 🎯 RESUMEN

Tienes un backend COMPLETO con:

✅ **SOLID Principles:**
- Single Responsibility: Cada clase una responsabilidad
- Open/Closed: Fácil de extender sin modificar
- Liskov Substitution: Interfaces reemplazables
- Interface Segregation: Interfaces específicas
- Dependency Inversion: Inyección de dependencias

✅ **Variables Independientes:**
- Cada jugador se calcula solo
- Si se elimina equipo, solo se borran SUS datos
- Si se elimina jugador, stats históricas quedan
- Si se actualiza resultado, tabla se recalcula correctamente

✅ **SCRUM:**
- 10 historias de usuario definidas
- Cada una independiente de otras
- Priorización clara

✅ **Arquitectura:**
- Domain: Lógica pura
- Application: Casos de uso
- Infrastructure: Implementación concreta

✅ **Testing:**
- Todos los curl commands listos
- Seed data para desarrollo
- Health check funciona

¿Necesitas que agregue algo más? 🚀
