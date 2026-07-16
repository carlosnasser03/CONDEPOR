import { Router } from "express";
import { PlayerController } from "../controllers/PlayerController";

const router = Router();
const controller = new PlayerController();

router.get("/", (req, res) => controller.getPlayers(req, res));
router.get("/:id", (req, res) => controller.getPlayerDetail(req, res));
router.put("/:id", (req, res) => controller.updatePlayer(req, res));
router.delete("/:id", (req, res) => controller.deletePlayer(req, res));

export default router;
