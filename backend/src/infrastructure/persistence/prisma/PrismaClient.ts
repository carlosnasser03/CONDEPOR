/**
 * Wrapper alrededor de PrismaClient
 * Centraliza la instancia
 */

import { PrismaClient as PrismaClientType } from "@prisma/client";

let prismaInstance: PrismaClientType;

export function getPrismaClient(): PrismaClientType {
  if (!prismaInstance) {
    prismaInstance = new PrismaClientType({
      log: process.env.NODE_ENV === "development" ? ["query"] : [],
    });
  }
  return prismaInstance;
}

export async function disconnectPrisma(): Promise<void> {
  if (prismaInstance) {
    await prismaInstance.$disconnect();
  }
}

export function buildPrismaQuery(filters?: Record<string, any>): Record<string, any> {
  if (!filters) return {};
  const { where, orderBy, take, skip, include, ...rest } = filters;
  const finalWhere = where
    ? { ...where, ...rest }
    : Object.keys(rest).length > 0
    ? rest
    : undefined;
  return {
    ...(finalWhere && { where: finalWhere }),
    ...(orderBy && { orderBy }),
    ...(take !== undefined && { take }),
    ...(skip !== undefined && { skip }),
    ...(include && { include }),
  };
}
