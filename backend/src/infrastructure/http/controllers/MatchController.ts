/**
 * MATCH CONTROLLER
 */

import { Request, Response } from "express";
import { MatchService } from "@application/MatchService";
import { isBrowserRequest } from "../views/layout";
import { renderMatchesView } from "../views/matchesView";

export class MatchController {
  constructor(private matchService: MatchService) {}

  /**
   * POST /api/matches
   */
  async createMatch(req: Request, res: Response): Promise<void> {
    try {
      const { categoryId, homeTeamId, awayTeamId, date, venue } = req.body;

      if (!categoryId || !homeTeamId || !awayTeamId || !date || !venue) {
        res.status(400).json({
          error: "Missing required fields",
          required: [
            "categoryId",
            "homeTeamId",
            "awayTeamId",
            "date",
            "venue",
          ],
        });
        return;
      }

      const match = await this.matchService.createMatch({
        categoryId,
        homeTeamId,
        awayTeamId,
        date: new Date(date),
        venue,
      });

      res.status(201).json({
        success: true,
        data: match,
      });
    } catch (error: any) {
      res.status(400).json({
        error: error.message,
      });
    }
  }

  /**
   * GET /api/matches
   */
  async getMatches(req: Request, res: Response): Promise<void> {
    try {
      const { categoryId, status, teamId } = req.query;

      const matches = await this.matchService.getMatches({
        categoryId: categoryId as string,
        status: status as string,
        teamId: teamId as string,
      });

      if (isBrowserRequest(req)) {
        res.send(await renderMatchesView(matches, (categoryId as string) || ""));
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
      res.status(400).json({
        error: error.message,
      });
    }
  }

  /**
   * GET /api/matches/:id
   */
  async getMatch(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const match = await this.matchService.getMatchDetail(id);
      if (!match) {
        res.status(404).json({
          error: "Match not found",
        });
        return;
      }

      res.json({
        success: true,
        data: match,
      });
    } catch (error: any) {
      res.status(400).json({
        error: error.message,
      });
    }
  }

  /**
   * POST /api/matches/:id/result
   */
  async recordResult(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { homeGoals, awayGoals, playerStats } = req.body;

      if (homeGoals === undefined || awayGoals === undefined) {
        res.status(400).json({
          error: "Missing required fields",
          required: ["homeGoals", "awayGoals", "playerStats"],
        });
        return;
      }

      if (!Array.isArray(playerStats)) {
        res.status(400).json({
          error: "playerStats must be an array",
        });
        return;
      }

      if (homeGoals < 0 || awayGoals < 0) {
        res.status(400).json({
          error: "Goals cannot be negative",
        });
        return;
      }

      const result = await this.matchService.recordResult(id, {
        homeGoals,
        awayGoals,
        playerStats,
      });

      res.json({
        success: true,
        message: "Result registered successfully",
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        error: error.message,
      });
    }
  }

  /**
   * PUT /api/matches/:id
   */
  async updateMatch(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { date, venue } = req.body;

      const match = await this.matchService.updateMatch(id, {
        ...(date && { date: new Date(date) }),
        venue,
      });

      res.json({
        success: true,
        data: match,
      });
    } catch (error: any) {
      res.status(400).json({
        error: error.message,
      });
    }
  }

  /**
   * DELETE /api/matches/:id
   */
  async deleteMatch(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      await this.matchService.deleteMatch(id);

      res.json({
        success: true,
        message: "Match deleted successfully",
      });
    } catch (error: any) {
      res.status(400).json({
        error: error.message,
      });
    }
  }
}
