import { Request, Response } from "express";
import { StandingsService } from "@application/StandingsService";
import { isBrowserRequest } from "../views/layout";
import { renderStandingsView } from "../views/standingsView";
import { CategoryIdParamSchema } from "@domain/validation/schemas";

export class StandingsController {
  constructor(private standingsService: StandingsService) {}

  /**
   * GET /api/standings/:categoryId
   */
  async getStandingsByCategory(req: Request, res: Response): Promise<void> {
    try {
      const { categoryId } = CategoryIdParamSchema.parse(req.params);

      const standings = await this.standingsService.getByCategoryId(categoryId);

      if (isBrowserRequest(req)) {
        res.send(await renderStandingsView(standings, categoryId));
        return;
      }

      res.json({
        success: true,
        categoryId,
        count: standings.length,
        standings,
        lastUpdated: new Date(),
      });
    } catch (error: any) {
      if (isBrowserRequest(req)) {
        res.send(await renderStandingsView([], req.params.categoryId || ""));
        return;
      }
      throw error;
    }
  }
}
