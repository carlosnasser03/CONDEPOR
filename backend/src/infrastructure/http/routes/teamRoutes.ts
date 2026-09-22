import { Router } from "express";
import { TeamsController } from "../controllers/TeamsController";
import { asyncHandler } from "@infrastructure/middleware/errorHandler";

const router = Router();
const controller = new TeamsController();

router.get("/", asyncHandler((req, res) => controller.getTeams(req, res)));
router.post("/", asyncHandler((req, res) => controller.createTeam(req, res)));
router.get("/:id", asyncHandler((req, res) => controller.getTeamDetail(req, res)));
router.put("/:id", asyncHandler((req, res) => controller.updateTeam(req, res)));
router.delete("/:id", asyncHandler((req, res) => controller.deleteTeam(req, res)));
router.post("/:id/players", asyncHandler((req, res) => controller.addPlayer(req, res)));
router.put("/:id/players/:playerId", asyncHandler((req, res) => controller.updatePlayer(req, res)));
router.delete("/:id/players/:playerId", asyncHandler((req, res) => controller.removePlayer(req, res)));

export default router;
