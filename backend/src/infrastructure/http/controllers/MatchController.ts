/**
 * MATCH CONTROLLER
 */

import { Request, Response } from "express";
import { MatchService } from "@application/MatchService";
import { isBrowserRequest } from "../views/layout";
import { renderMatchesView } from "../views/matchesView";
import {
  CreateMatchSchema,
  UpdateMatchSchema,
  RecordMatchResultSchema,
  IdParamSchema,
  MatchQuerySchema,
} from "@domain/validation/schemas";
import { NotFoundError } from "@infrastructure/errors/AppError";

export class MatchController {
  constructor(private matchService: MatchService) {}

  /**
   * POST /api/matches
   */
  async createMatch(req: Request, res: Response): Promise<void> {
    const data = CreateMatchSchema.parse(req.body);

    const match = await this.matchService.createMatch({
      categoryId: data.categoryId,
      homeTeamId: data.homeTeamId,
      awayTeamId: data.awayTeamId,
      date: data.date,
      venue: data.venue,
    });

    res.status(201).json({
      success: true,
      data: match,
    });
  }

  /**
   * GET /api/matches
   */
  async getMatches(req: Request, res: Response): Promise<void> {
    try {
      const query = MatchQuerySchema.parse(req.query);

      const matches = await this.matchService.getMatches({
        categoryId: query.categoryId,
        status: query.status,
        teamId: query.teamId,
      });

      if (isBrowserRequest(req)) {
        res.send(await renderMatchesView(matches, query.categoryId || ""));
        return;
      }

      res.json({
        success: true,
        count: matches.length,
        data: matches,
      });
    } catch (error: any) {
      if (isBrowserRequest(req)) {
        res.send(await renderMatchesView([], (req.query.categoryId as string) || ""));
        return;
      }
      throw error;
    }
  }

  /**
   * GET /api/matches/:id
   */
  async getMatch(req: Request, res: Response): Promise<void> {
    const { id } = IdParamSchema.parse(req.params);

    const match = await this.matchService.getMatchDetail(id);
    if (!match) {
      throw new NotFoundError("Match not found");
    }

    res.json({
      success: true,
      data: match,
    });
  }

  /**
   * POST /api/matches/:id/result
   */
  async recordResult(req: Request, res: Response): Promise<void> {
    const { id } = IdParamSchema.parse(req.params);
    const data = RecordMatchResultSchema.parse(req.body);

    const result = await this.matchService.recordResult(id, {
      homeGoals: data.homeGoals,
      awayGoals: data.awayGoals,
      playerStats: data.playerStats,
    });

    res.json({
      success: true,
      message: "Result registered successfully",
      data: result,
    });
  }

  /**
   * PUT /api/matches/:id
   */
  async updateMatch(req: Request, res: Response): Promise<void> {
    const { id } = IdParamSchema.parse(req.params);
    const data = UpdateMatchSchema.parse(req.body);

    const match = await this.matchService.updateMatch(id, {
      ...(data.date && { date: data.date }),
      ...(data.venue && { venue: data.venue }),
    });

    res.json({
      success: true,
      data: match,
    });
  }

  /**
   * DELETE /api/matches/:id
   */
  async deleteMatch(req: Request, res: Response): Promise<void> {
    const { id } = IdParamSchema.parse(req.params);

    await this.matchService.deleteMatch(id);

    res.json({
      success: true,
      message: "Match deleted successfully",
    });
  }
}
