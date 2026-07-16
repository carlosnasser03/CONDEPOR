import { Request, Response } from "express";
import { ScorerService } from "@application/ScorerService";
import { isBrowserRequest } from "../views/layout";
import { renderScorersView } from "../views/scorersView";
import {
  CategoryIdParamSchema,
  TopScorersQuerySchema,
} from "@domain/validation/schemas";

export class ScorerController {
  constructor(private scorerService: ScorerService) {}

  /**
   * GET /api/scorers/:categoryId?limit=10
   */
  async getTopScorers(req: Request, res: Response): Promise<void> {
    try {
      const { categoryId } = CategoryIdParamSchema.parse(req.params);
      const { limit } = TopScorersQuerySchema.parse(req.query);

      const scorers = await this.scorerService.getTopScorers(categoryId, limit);

      if (isBrowserRequest(req)) {
        res.send(await renderScorersView(scorers, categoryId));
        return;
      }

      res.json({
        success: true,
        categoryId,
        count: scorers.length,
        scorers,
      });
    } catch (error: any) {
      if (isBrowserRequest(req)) {
        res.send(await renderScorersView([], req.params.categoryId || ""));
        return;
      }
      throw error;
    }
  }

  /**
   * GET /api/scorers/:categoryId/all
   */
  async getAllScorers(req: Request, res: Response): Promise<void> {
    try {
      const { categoryId } = CategoryIdParamSchema.parse(req.params);

      const scorers = await this.scorerService.getAllScorers(categoryId);

      if (isBrowserRequest(req)) {
        res.send(await renderScorersView(scorers, categoryId));
        return;
      }

      res.json({
        success: true,
        categoryId,
        count: scorers.length,
        scorers,
      });
    } catch (error: any) {
      if (isBrowserRequest(req)) {
        res.send(await renderScorersView([], req.params.categoryId || ""));
        return;
      }
      throw error;
    }
  }
}
