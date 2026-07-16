import { Request, Response } from "express";
import { isBrowserRequest } from "../views/layout";
import { renderTeamsView } from "../views/teamsView";
import { renderTeamDetailView } from "../views/teamDetailView";
import { getPrismaClient } from "@infrastructure/persistence/prisma/PrismaClient";

export class TeamsController {
  private prisma = getPrismaClient();

  /**
   * GET /api/teams
   */
  async getTeams(req: Request, res: Response): Promise<void> {
    try {
      const { categoryId } = req.query;
      const categories = await this.prisma.category.findMany({ orderBy: { name: "asc" } });
      const queryCatId = typeof categoryId === "string" ? categoryId : null;
      const selectedCat = categories.find((c: any) => c.id === queryCatId) || categories[2] || categories[0] || { id: "cmrmhh5zq008ur60awmghreez", name: "Fútbol Infantil U-12" };
      const activeCatId = selectedCat.id;
      const activeCatName = selectedCat.name;

      const teams = await this.prisma.team.findMany({
        where: { categoryId: activeCatId },
        include: {
          _count: {
            select: { players: true }
          }
        },
        orderBy: { name: "asc" }
      });

      if (isBrowserRequest(req)) {
        res.send(await renderTeamsView(teams, activeCatId, activeCatName));
        return;
      }

      res.json({
        success: true,
        categoryId: activeCatId,
        categoryName: activeCatName,
        count: teams.length,
        teams
      });
    } catch (error: any) {
      if (isBrowserRequest(req)) {
        res.send(await renderTeamsView([], "cmrmhh5zq008ur60awmghreez", "Fútbol Infantil U-12"));
        return;
      }
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * POST /api/teams
   */
  async createTeam(req: Request, res: Response): Promise<void> {
    try {
      const { categoryId, name, crestUrl } = req.body;
      if (!categoryId || !name) {
        res.status(400).json({ error: "Missing categoryId or name" });
        return;
      }

      const team = await this.prisma.team.create({
        data: {
          categoryId,
          name,
          crestUrl: crestUrl || null
        }
      });

      res.status(201).json({ success: true, team });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * GET /api/teams/:id
   */
  async getTeamDetail(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const team = await this.prisma.team.findUnique({
        where: { id },
        include: {
          category: true,
          players: {
            orderBy: { jerseyNumber: "asc" }
          }
        }
      });

      if (!team) {
        res.status(404).json({ error: "Team not found" });
        return;
      }

      if (isBrowserRequest(req)) {
        res.send(await renderTeamDetailView(team));
        return;
      }

      res.json({ success: true, team });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * POST /api/teams/:id/players
   */
  async addPlayer(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { categoryId, name, position, jerseyNumber, photoUrl } = req.body;

      if (!name || !position || jerseyNumber === undefined || !categoryId) {
        res.status(400).json({ error: "Missing required fields (name, position, jerseyNumber, categoryId)" });
        return;
      }

      const player = await this.prisma.player.create({
        data: {
          teamId: id,
          categoryId,
          name,
          position,
          jerseyNumber: Number(jerseyNumber),
          photoUrl: photoUrl || null,
          seasonGoals: 0,
          seasonPoints: 0,
          seasonMatches: 0
        }
      });

      res.status(201).json({ success: true, player });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * PUT /api/teams/:id
   */
  async updateTeam(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, crestUrl } = req.body;
      const team = await this.prisma.team.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(crestUrl !== undefined && { crestUrl: crestUrl || null })
        }
      });
      res.json({ success: true, team });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * DELETE /api/teams/:id
   */
  async deleteTeam(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.prisma.team.delete({ where: { id } });
      res.json({ success: true, message: "Team deleted successfully" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * DELETE /api/teams/:id/players/:playerId
   */
  async removePlayer(req: Request, res: Response): Promise<void> {
    try {
      const { playerId } = req.params;
      await this.prisma.player.delete({ where: { id: playerId } });
      res.json({ success: true, message: "Player removed from team successfully" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
