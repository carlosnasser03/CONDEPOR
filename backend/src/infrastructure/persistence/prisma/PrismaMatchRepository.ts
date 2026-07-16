/**
 * REPOSITORIO DE PARTIDOS
 * 
 * Implementa IRepository<Match>
 */

import { IRepository } from "@application/ports/IRepository";
import { getPrismaClient, buildPrismaQuery } from "./PrismaClient";

export interface Match {
  id: string;
  categoryId: string;
  homeTeamId: string;
  awayTeamId: string;
  date: Date;
  venue: string;
  status: "scheduled" | "in_progress" | "finished";
  homeGoals: number | null;
  awayGoals: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class PrismaMatchRepository implements IRepository<Match> {
  private prisma = getPrismaClient();

  async create(data: Partial<Match>): Promise<Match> {
    return this.prisma.match.create({
      data: {
        categoryId: data.categoryId!,
        homeTeamId: data.homeTeamId!,
        awayTeamId: data.awayTeamId!,
        date: data.date!,
        venue: data.venue!,
        status: data.status || "scheduled",
        homeGoals: data.homeGoals,
        awayGoals: data.awayGoals,
      },
    }) as unknown as Promise<Match>;
  }

  async findById(id: string): Promise<Match | null> {
    return (this.prisma.match.findUnique({
      where: { id },
      include: {
        homeTeam: true,
        awayTeam: true,
        playerStats: {
          include: { player: true },
        },
      },
    }) as unknown as Promise<Match | null>) || null;
  }

  async findMany(filters?: Record<string, any>): Promise<Match[]> {
    const query = buildPrismaQuery(filters);
    return (this.prisma.match.findMany({
      orderBy: { date: "desc" },
      include: {
        homeTeam: true,
        awayTeam: true,
        playerStats: {
          include: { player: true },
        },
      },
      ...query as any,
    }) as unknown as Promise<Match[]>) || [];
  }

  async update(id: string, data: Partial<Match>): Promise<Match> {
    return (this.prisma.match.update({
      where: { id },
      data,
    }) as unknown as Promise<Match>);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.playerMatchStat.deleteMany({
      where: { matchId: id },
    });

    await this.prisma.match.delete({
      where: { id },
    });
  }
}
