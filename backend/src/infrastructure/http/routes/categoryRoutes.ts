import { Router } from "express";
import { CategoryController } from "../controllers/CategoryController";
import { asyncHandler } from "@infrastructure/middleware/errorHandler";

const router = Router();
const controller = new CategoryController();

router.get("/", asyncHandler((req, res) => controller.getCategories(req, res)));
router.post("/", asyncHandler((req, res) => controller.createCategory(req, res)));
router.get("/:id", asyncHandler((req, res) => controller.getCategoryDetail(req, res)));
router.put("/:id", asyncHandler((req, res) => controller.updateCategory(req, res)));
router.delete("/:id", asyncHandler((req, res) => controller.deleteCategory(req, res)));

export default router;
