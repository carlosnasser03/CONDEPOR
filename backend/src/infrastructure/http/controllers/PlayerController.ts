import { Request, Response } from "express";
import { getPrismaClient } from "@infrastructure/persistence/prisma/PrismaClient";

export class PlayerController {
  private prisma = getPrismaClient();

  /**
   * GET /api/players?teamId=...&categoryId=...
   */
  async getPlayers(req: Request, res: Response): Promise<void> {
    try {
      const { teamId, categoryId } = req.query;
      const where: any = {};
      if (typeof teamId === "string") where.teamId = teamId;
      if (typeof categoryId === "string") where.categoryId = categoryId;

      const players = await this.prisma.player.findMany({
        where,
        orderBy: { jerseyNumber: "asc" }
      });

      res.json({
        success: true,
        count: players.length,
        data: players,
        players
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * GET /api/players/:id
   */
  async getPlayerDetail(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const player = await this.prisma.player.findUnique({
        where: { id },
        include: {
          team: true,
          category: true
        }
      });

      if (!player) {
        res.status(404).json({ success: false, error: "Player not found" });
        return;
      }

      res.json({
        success: true,
        data: player,
        player
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * PUT /api/players/:id
   */
  async updatePlayer(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, position, jerseyNumber, photoUrl } = req.body;

      const updated = await this.prisma.player.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(position && { position }),
          ...(jerseyNumber !== undefined && { jerseyNumber: Number(jerseyNumber) }),
          ...(photoUrl !== undefined && { photoUrl })
        }
      });

      res.json({ success: true, player: updated });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  /**
   * DELETE /api/players/:id
   */
  async deletePlayer(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.prisma.player.delete({ where: { id } });
      res.json({ success: true, message: "Player deleted successfully" });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
}
