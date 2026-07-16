import { Router } from "express";
import { StandingsController } from "../controllers/StandingsController";
import { StandingsService } from "@application/StandingsService";
import { PrismaTeamRepository } from "@infrastructure/persistence/prisma/PrismaTeamRepository";
import { PrismaMatchRepository } from "@infrastructure/persistence/prisma/PrismaMatchRepository";
import { StandingsCalculator } from "@domain/standings/StandingsCalculator";
import { getPrismaClient } from "@infrastructure/persistence/prisma/PrismaClient";
import { asyncHandler } from "@infrastructure/middleware/errorHandler";

const router = Router();

const prisma = getPrismaClient();
const teamRepo = new PrismaTeamRepository();
const matchRepo = new PrismaMatchRepository();
const calculator = new StandingsCalculator(prisma);

const service = new StandingsService(teamRepo, matchRepo, calculator);
const controller = new StandingsController(service);

router.get("/:categoryId", asyncHandler((req, res) =>
  controller.getStandingsByCategory(req, res)
));

export default router;
