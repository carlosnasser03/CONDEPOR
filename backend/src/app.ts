/**
 * CONFIGURACIÓN DE EXPRESS
 * Sin iniciar listen (separado para testing)
 */

import express, { Express } from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";

import matchRoutes from "@infrastructure/http/routes/matchRoutes";
import standingsRoutes from "@infrastructure/http/routes/standingsRoutes";
import scorerRoutes from "@infrastructure/http/routes/scorerRoutes";
import teamRoutes from "@infrastructure/http/routes/teamRoutes";
import categoryRoutes from "@infrastructure/http/routes/categoryRoutes";
import playerRoutes from "@infrastructure/http/routes/playerRoutes";
import { isBrowserRequest } from "@infrastructure/http/views/layout";
import { renderHomeView } from "@infrastructure/http/views/homeView";
import { renderHealthView } from "@infrastructure/http/views/healthView";

export function createApp(): Express {
  const app = express();

  // ==================
  // MIDDLEWARE SEGURIDAD
  // ==================
  app.use(helmet({
    contentSecurityPolicy: false,
  }));
  app.use(compression());

  // ==================
  // MIDDLEWARE CORS
  // ==================
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || "http://localhost:3000",
      credentials: true,
    })
  );

  // ==================
  // MIDDLEWARE PARSING
  // ==================
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static("public"));

  // ==================
  // HEALTH CHECK
  // ==================
  app.get("/api/health", async (req, res) => {
    const healthData = {
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
    };

    if (isBrowserRequest(req)) {
      try {
        const { getPrismaClient } = require("@infrastructure/persistence/prisma/PrismaClient");
        const prisma = getPrismaClient();
        const categories = await prisma.category.findMany();
        const queryCatId = typeof req.query.categoryId === "string" ? req.query.categoryId : null;
        const selectedCat = categories.find((c: any) => c.id === queryCatId) || categories[2] || categories[0] || { id: "cmrmgtd5e000013z3yfwke2kl" };
        return res.send(await renderHealthView(healthData, selectedCat.id));
      } catch (err) {
        return res.send(await renderHealthView(healthData, "cmrmgtd5e000013z3yfwke2kl"));
      }
    }

    res.json(healthData);
  });

  // ==================
  // API ROUTES
  // ==================
  app.use("/api/matches", matchRoutes);
  app.use("/api/standings", standingsRoutes);
  app.use("/api/scorers", scorerRoutes);
  app.use("/api/teams", teamRoutes);
  app.use("/api/categories", categoryRoutes);
  app.use("/api/players", playerRoutes);

  // ==================
  // ROOT ROUTE (WELCOME DASHBOARD / API)
  // ==================
  app.get("/", async (req, res) => {
    try {
      const { getPrismaClient } = require("@infrastructure/persistence/prisma/PrismaClient");
      const prisma = getPrismaClient();
      const categories = await prisma.category.findMany();
      const queryCatId = typeof req.query.categoryId === "string" ? req.query.categoryId : null;
      const selectedCat = categories.find((c: any) => c.id === queryCatId) || categories[2] || categories[0] || { id: "cmrmgtd5e000013z3yfwke2kl", name: "Fútbol Infantil U-12" };
      const categoryId = selectedCat.id;
      const categoryName = selectedCat.name;

      if (isBrowserRequest(req)) {
        return res.send(await renderHomeView(categoryId, categoryName));
      }

      res.json({
        project: "DeporteHN - CONDEPOR Backend API",
        status: "online",
        version: "1.0.0",
        activeCategory: {
          id: categoryId,
          name: categoryName
        },
        documentation: "Servidor backend de arquitectura por capas (Domain/Application/Infrastructure)",
        endpoints: {
          health: "/api/health",
          categories: "/api/categories",
          standings: `/api/standings/${categoryId}`,
          topScorers: `/api/scorers/${categoryId}/top`,
          matches: `/api/matches?categoryId=${categoryId}`,
          teams: `/api/teams?categoryId=${categoryId}`,
          players: `/api/players`
        }
      });
    } catch (error) {
      if (isBrowserRequest(req)) {
        return res.send(await renderHomeView("cmrmgtd5e000013z3yfwke2kl", "Fútbol Infantil U-12"));
      }
      res.json({
        project: "DeporteHN - CONDEPOR Backend API",
        status: "online",
        version: "1.0.0",
        documentation: "Servidor backend de arquitectura por capas (Domain/Application/Infrastructure)",
        endpoints: {
          health: "/api/health",
          categories: "/api/categories",
          standings: "/api/standings/:categoryId",
          topScorers: "/api/scorers/:categoryId/top",
          matches: "/api/matches",
          teams: "/api/teams",
          players: "/api/players"
        }
      });
    }
  });

  // ==================
  // 404 HANDLER
  // ==================
  app.use((req, res) => {
    res.status(404).json({
      error: "Route not found",
      path: req.path,
      method: req.method,
    });
  });

  // ==================
  // ERROR HANDLER
  // ==================
  app.use(
    (
      err: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      console.error(err);
      res.status(500).json({
        error: "Internal server error",
        message: process.env.NODE_ENV === "development" ? err.message : "",
      });
    }
  );

  return app;
}
