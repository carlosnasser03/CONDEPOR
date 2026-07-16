/**
 * PUNTO DE ENTRADA DEL SERVER
 * Aquí se inicia Express y se escucha en puerto
 */

import env from "@config/env";
import { createApp } from "./app";
import { getPrismaClient, disconnectPrisma } from "@infrastructure/persistence/prisma/PrismaClient";

const PORT = env.PORT;

async function startServer(): Promise<void> {
  try {
    console.log(`\n🔧 Environment: ${env.NODE_ENV}`);
    console.log(
      `📊 Database: ${env.DATABASE_URL.replace(/:[^:@]+@/, ":***@")}`
    );
    console.log(
      `🔐 CORS Origins: ${env.CORS_ORIGINS || env.CORS_ORIGIN || "http://localhost:3000,http://localhost:3001"}`
    );

    // Crear app
    const app = createApp();

    // Verificar conexión a BD
    const prisma = getPrismaClient();
    await prisma.$queryRaw`SELECT 1`;
    console.log("✓ Database connected");

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`\n🚀 Backend running at http://localhost:${PORT}`);
      console.log(`📊 API at http://localhost:${PORT}/api`);
      console.log(`✓ Health check at http://localhost:${PORT}/api/health\n`);
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      console.log("\nShutting down...");
      await disconnectPrisma();
      process.exit(0);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
