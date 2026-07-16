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
