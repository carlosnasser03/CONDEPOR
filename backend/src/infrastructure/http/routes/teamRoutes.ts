import { Router } from "express";
import { TeamsController } from "../controllers/TeamsController";

const router = Router();
const controller = new TeamsController();

router.get("/", (req, res) => controller.getTeams(req, res));
router.post("/", (req, res) => controller.createTeam(req, res));
router.get("/:id", (req, res) => controller.getTeamDetail(req, res));
router.put("/:id", (req, res) => controller.updateTeam(req, res));
router.delete("/:id", (req, res) => controller.deleteTeam(req, res));
router.post("/:id/players", (req, res) => controller.addPlayer(req, res));
router.delete("/:id/players/:playerId", (req, res) => controller.removePlayer(req, res));

export default router;
