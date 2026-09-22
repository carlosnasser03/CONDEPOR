import { IRepository } from "@application/ports/IRepository";
import { getPrismaClient, buildPrismaQuery } from "./PrismaClient";

export interface Category {
  id: string;
  name: string;
  color: string;
  description: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class PrismaCategoryRepository implements IRepository<Category> {
  private prisma = getPrismaClient();

  async create(data: Partial<Category>): Promise<Category> {
    return this.prisma.category.create({
      data: {
        name: data.name!,
        color: data.color!,
        description: data.description || null,
      },
    }) as unknown as Promise<Category>;
  }

  async findById(id: string): Promise<Category | null> {
    return (this.prisma.category.findUnique({
      where: { id },
    }) as unknown as Promise<Category | null>) || null;
  }

  async findMany(filters?: Record<string, any>): Promise<Category[]> {
    const query = buildPrismaQuery(filters);
    return (this.prisma.category.findMany({
      orderBy: { name: "asc" },
      ...query as any,
    }) as unknown as Promise<Category[]>) || [];
  }

  async update(id: string, data: Partial<Category>): Promise<Category> {
    return this.prisma.category.update({
      where: { id },
      data,
    }) as unknown as Promise<Category>;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.category.delete({
      where: { id },
    });
  }
}
