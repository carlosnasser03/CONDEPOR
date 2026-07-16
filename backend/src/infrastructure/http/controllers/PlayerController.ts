import { Request, Response } from "express";
import { getPrismaClient } from "@infrastructure/persistence/prisma/PrismaClient";
import { IdParamSchema, UpdatePlayerSchema } from "@domain/validation/schemas";
import { NotFoundError } from "@infrastructure/errors/AppError";

export class PlayerController {
  private prisma = getPrismaClient();

  /**
   * GET /api/players?teamId=...&categoryId=...
   */
  async getPlayers(req: Request, res: Response): Promise<void> {
    const { teamId, categoryId } = req.query;
    const where: any = {};
    if (typeof teamId === "string" && teamId.trim() !== "") where.teamId = teamId;
    if (typeof categoryId === "string" && categoryId.trim() !== "") where.categoryId = categoryId;

    const players = await this.prisma.player.findMany({
      where,
      orderBy: { jerseyNumber: "asc" },
    });

    res.json({
      success: true,
      count: players.length,
      data: players,
      players,
    });
  }

  /**
   * GET /api/players/:id
   */
  async getPlayerDetail(req: Request, res: Response): Promise<void> {
    const { id } = IdParamSchema.parse(req.params);
    const player = await this.prisma.player.findUnique({
      where: { id },
      include: {
        team: true,
        category: true,
      },
    });

    if (!player) {
      throw new NotFoundError("Player not found");
    }

    res.json({
      success: true,
      data: player,
      player,
    });
  }

  /**
   * PUT /api/players/:id
   */
  async updatePlayer(req: Request, res: Response): Promise<void> {
    const { id } = IdParamSchema.parse(req.params);
    const data = UpdatePlayerSchema.parse(req.body);

    const existing = await this.prisma.player.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError("Player not found");
    }

    const updated = await this.prisma.player.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.position && { position: data.position }),
        ...(data.jerseyNumber !== undefined && { jerseyNumber: data.jerseyNumber }),
        ...(data.photoUrl !== undefined && { photoUrl: data.photoUrl }),
      },
    });

    res.json({ success: true, player: updated });
  }

  /**
   * DELETE /api/players/:id
   */
  async deletePlayer(req: Request, res: Response): Promise<void> {
    const { id } = IdParamSchema.parse(req.params);

    const existing = await this.prisma.player.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError("Player not found");
    }

    await this.prisma.player.delete({ where: { id } });
    res.json({ success: true, message: "Player deleted successfully" });
  }
}
