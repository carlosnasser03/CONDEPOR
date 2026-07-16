import { Request, Response } from "express";
import { isBrowserRequest } from "../views/layout";
import { renderHomeView } from "../views/homeView";
import { getPrismaClient } from "@infrastructure/persistence/prisma/PrismaClient";
import {
  IdParamSchema,
  CreateCategorySchema,
  UpdateCategorySchema,
} from "@domain/validation/schemas";
import { BadRequestError, NotFoundError } from "@infrastructure/errors/AppError";

export class CategoryController {
  private prisma = getPrismaClient();

  /**
   * GET /api/categories
   */
  async getCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await this.prisma.category.findMany({
        orderBy: { name: "asc" },
      });

      if (isBrowserRequest(req)) {
        const defaultCategoryId = process.env.DEFAULT_CATEGORY_ID;
        const firstCat =
          categories[0] ||
          (defaultCategoryId
            ? { id: defaultCategoryId, name: "Categoría Predeterminada" }
            : { id: "default", name: "Fútbol Infantil" });
        res.send(await renderHomeView(firstCat.id, firstCat.name));
        return;
      }

      res.json({
        success: true,
        count: categories.length,
        data: categories,
        categories,
      });
    } catch (error: any) {
      if (isBrowserRequest(req)) {
        const fallbackId = process.env.DEFAULT_CATEGORY_ID || "default";
        res.send(await renderHomeView(fallbackId, "Fútbol Infantil"));
        return;
      }
      throw error;
    }
  }

  /**
   * GET /api/categories/:id
   */
  async getCategoryDetail(req: Request, res: Response): Promise<void> {
    try {
      const { id } = IdParamSchema.parse(req.params);
      const category = await this.prisma.category.findUnique({
        where: { id },
      });

      if (!category) {
        throw new NotFoundError("Category not found");
      }

      if (isBrowserRequest(req)) {
        res.send(await renderHomeView(category.id, category.name));
        return;
      }

      res.json({
        success: true,
        data: category,
        category,
      });
    } catch (error: any) {
      if (isBrowserRequest(req)) {
        const fallbackId = process.env.DEFAULT_CATEGORY_ID || "default";
        res.send(await renderHomeView(fallbackId, "Fútbol Infantil"));
        return;
      }
      throw error;
    }
  }

  /**
   * POST /api/categories
   */
  async createCategory(req: Request, res: Response): Promise<void> {
    const data = CreateCategorySchema.parse(req.body);
    const category = await this.prisma.category.create({
      data: {
        name: data.name,
        color: data.color,
        description: data.description || null,
      },
    });

    res.status(201).json({
      success: true,
      data: category,
    });
  }

  /**
   * PUT /api/categories/:id
   */
  async updateCategory(req: Request, res: Response): Promise<void> {
    const { id } = IdParamSchema.parse(req.params);
    const data = UpdateCategorySchema.parse(req.body);

    const existing = await this.prisma.category.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError("Category not found");
    }

    const category = await this.prisma.category.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.color && { color: data.color }),
        ...(data.description !== undefined && { description: data.description || null }),
      },
    });

    res.json({
      success: true,
      data: category,
    });
  }

  /**
   * DELETE /api/categories/:id
   */
  async deleteCategory(req: Request, res: Response): Promise<void> {
    const { id } = IdParamSchema.parse(req.params);

    const existing = await this.prisma.category.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError("Category not found");
    }

    await this.prisma.category.delete({ where: { id } });
    res.status(204).send();
  }
}
