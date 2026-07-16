import { IRepository } from "@application/ports/IRepository";
import { getPrismaClient, buildPrismaQuery } from "./PrismaClient";

export interface PlayerMatchStat {
  id: string;
  playerId: string;
  matchId: string;
  goals: number;
  assists: number;
  minutesPlayed: number;
  cleanSheet: boolean;
  points: number;
  createdAt?: Date;
}

export class PrismaPlayerMatchStatRepository
  implements IRepository<PlayerMatchStat>
{
  private prisma = getPrismaClient();

  async create(data: Partial<PlayerMatchStat>): Promise<PlayerMatchStat> {
    return this.prisma.playerMatchStat.create({
      data: {
        playerId: data.playerId!,
        matchId: data.matchId!,
        goals: data.goals || 0,
        assists: data.assists || 0,
        minutesPlayed: data.minutesPlayed || 0,
        cleanSheet: data.cleanSheet || false,
        points: data.points || 0,
      },
    }) as unknown as Promise<PlayerMatchStat>;
  }

  async findById(id: string): Promise<PlayerMatchStat | null> {
    return (this.prisma.playerMatchStat.findUnique({
      where: { id },
      include: { player: true, match: true },
    }) as unknown as Promise<PlayerMatchStat | null>) || null;
  }

  async findMany(filters?: Record<string, any>): Promise<PlayerMatchStat[]> {
    const query = buildPrismaQuery(filters);
    return (this.prisma.playerMatchStat.findMany({
      include: { player: true, match: true },
      ...query as any,
    }) as unknown as Promise<PlayerMatchStat[]>) || [];
  }

  async update(
    id: string,
    data: Partial<PlayerMatchStat>
  ): Promise<PlayerMatchStat> {
    return this.prisma.playerMatchStat.update({
      where: { id },
      data,
    }) as unknown as Promise<PlayerMatchStat>;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.playerMatchStat.delete({
      where: { id },
    });
  }
}
