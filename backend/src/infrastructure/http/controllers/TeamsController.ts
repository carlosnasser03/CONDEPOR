import { Request, Response } from "express";
import { isBrowserRequest } from "../views/layout";
import { renderTeamsView } from "../views/teamsView";
import { renderTeamDetailView } from "../views/teamDetailView";
import { getPrismaClient } from "@infrastructure/persistence/prisma/PrismaClient";
import {
  CreateTeamSchema,
  UpdateTeamSchema,
  AddTeamPlayerSchema,
  IdParamSchema,
} from "@domain/validation/schemas";
import { NotFoundError } from "@infrastructure/errors/AppError";

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
      const defaultCatId = process.env.DEFAULT_CATEGORY_ID;
      const selectedCat =
        categories.find((c: any) => c.id === queryCatId) ||
        categories[0] ||
        (defaultCatId
          ? { id: defaultCatId, name: "Categoría Predeterminada" }
          : { id: "default", name: "Fútbol Infantil" });
      const activeCatId = selectedCat.id;
      const activeCatName = selectedCat.name;

      const teams = await this.prisma.team.findMany({
        where: { categoryId: activeCatId },
        include: {
          _count: {
            select: { players: true },
          },
        },
        orderBy: { name: "asc" },
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
        teams,
      });
    } catch (error: any) {
      if (isBrowserRequest(req)) {
        const fallbackId = process.env.DEFAULT_CATEGORY_ID || "default";
        res.send(await renderTeamsView([], fallbackId, "Fútbol Infantil"));
        return;
      }
      throw error;
    }
  }

  /**
   * POST /api/teams
   */
  async createTeam(req: Request, res: Response): Promise<void> {
    const data = CreateTeamSchema.parse(req.body);

    const team = await this.prisma.team.create({
      data: {
        categoryId: data.categoryId,
        name: data.name,
        crestUrl: data.crestUrl || null,
      },
    });

    res.status(201).json({ success: true, team });
  }

  /**
   * GET /api/teams/:id
   */
  async getTeamDetail(req: Request, res: Response): Promise<void> {
    const { id } = IdParamSchema.parse(req.params);
    const team = await this.prisma.team.findUnique({
      where: { id },
      include: {
        category: true,
        players: {
          orderBy: { jerseyNumber: "asc" },
        },
      },
    });

    if (!team) {
      throw new NotFoundError("Team not found");
    }

    if (isBrowserRequest(req)) {
      res.send(await renderTeamDetailView(team));
      return;
    }

    res.json({ success: true, team });
  }

  /**
   * POST /api/teams/:id/players
   */
  async addPlayer(req: Request, res: Response): Promise<void> {
    const { id } = IdParamSchema.parse(req.params);
    const data = AddTeamPlayerSchema.parse(req.body);

    const team = await this.prisma.team.findUnique({ where: { id } });
    if (!team) {
      throw new NotFoundError("Team not found");
    }

    // Validar que el dorsal sea único en el equipo
    const existingPlayer = await this.prisma.player.findUnique({
      where: { teamId_jerseyNumber: { teamId: id, jerseyNumber: data.jerseyNumber } },
    });

    if (existingPlayer) {
      res.status(400).json({
        success: false,
        error: `El dorsal #${data.jerseyNumber} ya está asignado a ${existingPlayer.name} en este equipo`,
      });
      return;
    }

    const player = await this.prisma.player.create({
      data: {
        teamId: id,
        categoryId: data.categoryId,
        name: data.name,
        position: data.position,
        jerseyNumber: data.jerseyNumber,
        photoUrl: data.photoUrl || null,
        seasonGoals: 0,
        seasonPoints: 0,
        seasonMatches: 0,
      },
    });

    res.status(201).json({ success: true, player });
  }

  /**
   * PUT /api/teams/:id
   */
  async updateTeam(req: Request, res: Response): Promise<void> {
    const { id } = IdParamSchema.parse(req.params);
    const data = UpdateTeamSchema.parse(req.body);

    const existing = await this.prisma.team.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError("Team not found");
    }

    const team = await this.prisma.team.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.crestUrl !== undefined && { crestUrl: data.crestUrl || null }),
      },
    });
    res.json({ success: true, team });
  }

  /**
   * DELETE /api/teams/:id
   */
  async deleteTeam(req: Request, res: Response): Promise<void> {
    const { id } = IdParamSchema.parse(req.params);

    const existing = await this.prisma.team.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError("Team not found");
    }

    await this.prisma.team.delete({ where: { id } });
    res.json({ success: true, message: "Team deleted successfully" });
  }

  /**
   * PUT /api/teams/:id/players/:playerId
   */
  async updatePlayer(req: Request, res: Response): Promise<void> {
    const { playerId } = req.params;
    if (!playerId) {
      throw new NotFoundError("Player ID required");
    }

    const existing = await this.prisma.player.findUnique({ where: { id: playerId } });
    if (!existing) {
      throw new NotFoundError("Player not found");
    }

    const { jerseyNumber, name, position } = req.body;
    const parsedJerseyNumber = jerseyNumber ? parseInt(jerseyNumber) : null;

    // Si se intenta cambiar el dorsal, validar que no exista otro jugador con ese dorsal en el mismo equipo
    if (parsedJerseyNumber && parsedJerseyNumber !== existing.jerseyNumber) {
      const conflictingPlayer = await this.prisma.player.findUnique({
        where: { teamId_jerseyNumber: { teamId: existing.teamId, jerseyNumber: parsedJerseyNumber } },
      });

      if (conflictingPlayer) {
        res.status(400).json({
          success: false,
          error: `El dorsal #${parsedJerseyNumber} ya está asignado a ${conflictingPlayer.name} en este equipo`,
        });
        return;
      }
    }

    const player = await this.prisma.player.update({
      where: { id: playerId },
      data: {
        ...(name && { name }),
        ...(parsedJerseyNumber && { jerseyNumber: parsedJerseyNumber }),
        ...(position && { position }),
      },
    });

    res.json({ success: true, player });
  }

  /**
   * DELETE /api/teams/:id/players/:playerId
   */
  async removePlayer(req: Request, res: Response): Promise<void> {
    const { playerId } = req.params;
    if (!playerId) {
      throw new NotFoundError("Player ID required");
    }

    const existing = await this.prisma.player.findUnique({ where: { id: playerId } });
    if (!existing) {
      throw new NotFoundError("Player not found");
    }

    await this.prisma.player.delete({ where: { id: playerId } });
    res.json({ success: true, message: "Player removed from team successfully" });
  }
}
