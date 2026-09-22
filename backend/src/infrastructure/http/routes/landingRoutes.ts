/**
 * LANDING ROUTES
 *
 * Rutas públicas para la landing page
 */

import { Router } from "express";
import { LandingController } from "../controllers/LandingController";
import { LandingService } from "@application/LandingService";
import { PrismaCategoryRepository } from "@infrastructure/persistence/prisma/PrismaCategoryRepository";
import { PrismaMatchRepository } from "@infrastructure/persistence/prisma/PrismaMatchRepository";
import { PrismaPlayerMatchStatRepository } from "@infrastructure/persistence/prisma/PrismaPlayerMatchStatRepository";
import { PrismaPlayerRepository } from "@infrastructure/persistence/prisma/PrismaPlayerRepository";
import { asyncHandler } from "@infrastructure/middleware/errorHandler";
import { generalLimiter } from "@infrastructure/middleware/rateLimiter";

const router = Router();

// Inyección de dependencias
const categoryRepo = new PrismaCategoryRepository();
const matchRepo = new PrismaMatchRepository();
const playerMatchStatRepo = new PrismaPlayerMatchStatRepository();
const playerRepo = new PrismaPlayerRepository();

const service = new LandingService(
  categoryRepo,
  matchRepo,
  playerMatchStatRepo,
  playerRepo
);
const controller = new LandingController(service);

// Rutas con validación de parámetros
router.get(
  "/categories-summary",
  generalLimiter,
  asyncHandler((req, res, next) => controller.getCategoriesSummary(req, res, next))
);

router.get(
  "/matches/:categoryId",
  generalLimiter,
  asyncHandler((req, res, next) => controller.getMatchesByCategory(req, res, next))
);

router.get(
  "/scorers/:categoryId",
  generalLimiter,
  asyncHandler((req, res, next) => controller.getScorersByCategory(req, res, next))
);

export default router;
