import { IRepository } from "@application/ports/IRepository";
import { getPrismaClient, buildPrismaQuery } from "./PrismaClient";

export interface Team {
  id: string;
  name: string;
  crestUrl: string | null;
  categoryId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class PrismaTeamRepository implements IRepository<Team> {
  private prisma = getPrismaClient();

  async create(data: Partial<Team>): Promise<Team> {
    return this.prisma.team.create({
      data: {
        name: data.name!,
        crestUrl: data.crestUrl,
        categoryId: data.categoryId!,
      },
    }) as unknown as Promise<Team>;
  }

  async findById(id: string): Promise<Team | null> {
    return (this.prisma.team.findUnique({
      where: { id },
    }) as unknown as Promise<Team | null>) || null;
  }

  async findMany(filters?: Record<string, any>): Promise<Team[]> {
    const query = buildPrismaQuery(filters);
    return (this.prisma.team.findMany({
      ...query as any,
    }) as unknown as Promise<Team[]>) || [];
  }

  async update(id: string, data: Partial<Team>): Promise<Team> {
    return this.prisma.team.update({
      where: { id },
      data,
    }) as unknown as Promise<Team>;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.player.deleteMany({
      where: { teamId: id },
    });

    await this.prisma.match.deleteMany({
      where: {
        OR: [{ homeTeamId: id }, { awayTeamId: id }],
      },
    });

    await this.prisma.team.delete({
      where: { id },
    });
  }
}
