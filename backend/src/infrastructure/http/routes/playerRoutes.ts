import { Router } from "express";
import { PlayerController } from "../controllers/PlayerController";
import { asyncHandler } from "@infrastructure/middleware/errorHandler";

const router = Router();
const controller = new PlayerController();

router.get("/", asyncHandler((req, res) => controller.getPlayers(req, res)));
router.get("/:id", asyncHandler((req, res) => controller.getPlayerDetail(req, res)));
router.put("/:id", asyncHandler((req, res) => controller.updatePlayer(req, res)));
router.delete("/:id", asyncHandler((req, res) => controller.deletePlayer(req, res)));

export default router;
