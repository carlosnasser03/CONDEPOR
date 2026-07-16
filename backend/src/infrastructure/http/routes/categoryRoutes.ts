import { Router } from "express";
import { CategoryController } from "../controllers/CategoryController";

const router = Router();
const controller = new CategoryController();

router.get("/", (req, res) => controller.getCategories(req, res));
router.get("/:id", (req, res) => controller.getCategoryDetail(req, res));

export default router;
