/**
 * LANDING CONTROLLER
 *
 * Endpoints para la landing page:
 * - Resumen de categorías
 * - Partidos por categoría
 * - Goleadores por categoría
 */

import { Request, Response, NextFunction } from "express";
import { LandingService } from "@application/LandingService";
import {
  LandingCategoryIdSchema,
  LandingScorersQuerySchema,
} from "@domain/validation/schemas";
import logger from "@infrastructure/logger/Logger";

export class LandingController {
  constructor(private landingService: LandingService) {}

  /**
   * GET /api/landing/categories-summary
   * Retorna resumen de todas las categorías
   */
  async getCategoriesSummary(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      logger.info("Fetching categories summary for landing");

      const categories = await this.landingService.getPublicCategoriesSummary();

      res.json({
        success: true,
        categories,
      });
    } catch (error) {
      logger.error("Error in getCategoriesSummary", { error });
      next(error);
    }
  }

  /**
   * GET /api/landing/matches/:categoryId
   * Retorna partidos de una categoría
   */
  async getMatchesByCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { categoryId } = LandingCategoryIdSchema.parse(req.params);

      logger.info("Fetching matches for category", { categoryId });

      const matches = await this.landingService.getPublicMatchesByCategoryForParents(
        categoryId
      );

      res.json({
        success: true,
        categoryId,
        matches,
      });
    } catch (error) {
      logger.error("Error in getMatchesByCategory", { error, params: req.params });
      next(error);
    }
  }

  /**
   * GET /api/landing/scorers/:categoryId
   * Retorna goleadores de una categoría con límite opcional
   */
  async getScorersByCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { categoryId } = LandingCategoryIdSchema.parse(req.params);
      const { limit } = LandingScorersQuerySchema.parse(req.query);

      logger.info("Fetching scorers for category", { categoryId, limit });

      const scorers = await this.landingService.getTopScorersByCategory(
        categoryId,
        limit
      );

      res.json({
        success: true,
        categoryId,
        scorers,
      });
    } catch (error) {
      logger.error("Error in getScorersByCategory", {
        error,
        params: req.params,
        query: req.query,
      });
      next(error);
    }
  }
}
