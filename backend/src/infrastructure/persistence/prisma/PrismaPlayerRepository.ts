import { IRepository } from "@application/ports/IRepository";
import { getPrismaClient, buildPrismaQuery } from "./PrismaClient";

export interface Player {
  id: string;
  name: string;
  photoUrl: string | null;
  position: string;
  jerseyNumber: number;
  teamId: string;
  categoryId: string;
  seasonGoals: number;
  seasonPoints: number;
  seasonMatches: number;
  createdAt?: Date;
  updatedAt?: Date;
  team?: any;
}

export class PrismaPlayerRepository implements IRepository<Player> {
  private prisma = getPrismaClient();

  async create(data: Partial<Player>): Promise<Player> {
    return this.prisma.player.create({
      data: {
        name: data.name!,
        photoUrl: data.photoUrl,
        position: data.position!,
        jerseyNumber: data.jerseyNumber!,
        teamId: data.teamId!,
        categoryId: data.categoryId!,
        seasonGoals: 0,
        seasonPoints: 0,
        seasonMatches: 0,
      },
    }) as unknown as Promise<Player>;
  }

  async findById(id: string): Promise<Player | null> {
    return (this.prisma.player.findUnique({
      where: { id },
      include: { team: true },
    }) as unknown as Promise<Player | null>) || null;
  }

  async findMany(filters?: Record<string, any>): Promise<Player[]> {
    const query = buildPrismaQuery(filters);
    return (this.prisma.player.findMany({
      include: { team: true },
      ...query as any,
    }) as unknown as Promise<Player[]>) || [];
  }

  async update(id: string, data: Partial<Player>): Promise<Player> {
    return this.prisma.player.update({
      where: { id },
      data,
    }) as unknown as Promise<Player>;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.player.delete({
      where: { id },
    });
  }
}
