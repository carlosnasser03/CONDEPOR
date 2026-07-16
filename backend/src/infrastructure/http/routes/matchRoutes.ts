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
