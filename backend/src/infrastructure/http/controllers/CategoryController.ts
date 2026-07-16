import { Request, Response } from "express";
import { isBrowserRequest } from "../views/layout";
import { renderHomeView } from "../views/homeView";
import { getPrismaClient } from "@infrastructure/persistence/prisma/PrismaClient";

export class CategoryController {
  private prisma = getPrismaClient();

  /**
   * GET /api/categories
   */
  async getCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await this.prisma.category.findMany({
        orderBy: { name: "asc" }
      });

      if (isBrowserRequest(req)) {
        const firstCat = categories[0] || { id: "cmrmhh5zq008ur60awmghreez", name: "Fútbol Infantil U-12" };
        res.send(await renderHomeView(firstCat.id, firstCat.name));
        return;
      }

      res.json({
        success: true,
        count: categories.length,
        data: categories,
        categories
      });
    } catch (error: any) {
      if (isBrowserRequest(req)) {
        res.send(await renderHomeView("cmrmhh5zq008ur60awmghreez", "Fútbol Infantil U-12"));
        return;
      }
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * GET /api/categories/:id
   */
  async getCategoryDetail(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const category = await this.prisma.category.findUnique({
        where: { id }
      });

      if (!category) {
        res.status(404).json({ success: false, error: "Category not found" });
        return;
      }

      if (isBrowserRequest(req)) {
        res.send(await renderHomeView(category.id, category.name));
        return;
      }

      res.json({
        success: true,
        data: category,
        category
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
