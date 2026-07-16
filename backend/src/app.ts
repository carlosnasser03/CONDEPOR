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

import { getCorsOptions } from "@infrastructure/middleware/cors";
import {
  generalLimiter,
  strictLimiter,
  createLimiter,
} from "@infrastructure/middleware/rateLimiter";
import { errorHandler } from "@infrastructure/middleware/errorHandler";
import logger from "@infrastructure/logger/Logger";

export function createApp(): Express {
  const app = express();

  // ==================
  // MIDDLEWARE SEGURIDAD (FIX 9)
  // ==================
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: [
            "'self'",
            process.env.CORS_ORIGINS ||
              process.env.CORS_ORIGIN ||
              "http://localhost:3000",
          ],
          frameSrc: ["'none'"],
          baseUri: ["'self'"],
          formAction: ["'self'"],
        },
      },
      frameguard: { action: "deny" },
      noSniff: true,
      xssFilter: true,
      referrerPolicy: { policy: "strict-origin-when-cross-origin" },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
    })
  );

  // Custom security headers
  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );
    res.setHeader(
      "Permissions-Policy",
      "geolocation=(), microphone=(), camera=()"
    );
    next();
  });

  app.use(compression());

  // ==================
  // STRUCTURED LOGGING (FIX 8)
  // ==================
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`, {
      ip: req.ip || req.socket.remoteAddress,
      userAgent: req.get("user-agent"),
    });
    next();
  });

  // ==================
  // MIDDLEWARE CORS (FIX 5)
  // ==================
  app.use(cors(getCorsOptions()));

  // ==================
  // RATE LIMITING (FIX 4)
  // ==================
  app.use("/api/", generalLimiter);
  app.use("/api/matches/:id/result", strictLimiter);
  app.use("/api/categories", createLimiter);

  // ==================
  // MIDDLEWARE PARSING
  // ==================
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static("public"));

  // ==================
  // HEALTH CHECK
  // ==================
  app.get("/api/health", async (req, res, next) => {
    try {
      const healthData = {
        status: "ok",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development",
      };

      if (isBrowserRequest(req)) {
        try {
          const { getPrismaClient } = require("@infrastructure/persistence/prisma/PrismaClient");
          const prisma = getPrismaClient();
          const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
          const queryCatId = typeof req.query.categoryId === "string" ? req.query.categoryId : null;
          const defaultCatId = process.env.DEFAULT_CATEGORY_ID;
          const selectedCat =
            categories.find((c: any) => c.id === queryCatId) ||
            categories[0] ||
            (defaultCatId
              ? { id: defaultCatId, name: "Categoría Predeterminada" }
              : { id: "default", name: "Fútbol Infantil" });
          return res.send(await renderHealthView(healthData, selectedCat.id));
        } catch (err) {
          const fallbackId = process.env.DEFAULT_CATEGORY_ID || "default";
          return res.send(await renderHealthView(healthData, fallbackId));
        }
      }

      res.json(healthData);
    } catch (error) {
      next(error);
    }
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
  app.get("/", async (req, res, next) => {
    try {
      const { getPrismaClient } = require("@infrastructure/persistence/prisma/PrismaClient");
      const prisma = getPrismaClient();
      const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
      const queryCatId = typeof req.query.categoryId === "string" ? req.query.categoryId : null;
      const defaultCatId = process.env.DEFAULT_CATEGORY_ID;
      const selectedCat =
        categories.find((c: any) => c.id === queryCatId) ||
        categories[0] ||
        (defaultCatId
          ? { id: defaultCatId, name: "Categoría Predeterminada" }
          : { id: "default", name: "Fútbol Infantil" });
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
          name: categoryName,
        },
        documentation:
          "Servidor backend de arquitectura por capas (Domain/Application/Infrastructure)",
        endpoints: {
          health: "/api/health",
          categories: "/api/categories",
          standings: `/api/standings/${categoryId}`,
          topScorers: `/api/scorers/${categoryId}/top`,
          matches: `/api/matches?categoryId=${categoryId}`,
          teams: `/api/teams?categoryId=${categoryId}`,
          players: `/api/players`,
        },
      });
    } catch (error) {
      if (isBrowserRequest(req)) {
        const fallbackId = process.env.DEFAULT_CATEGORY_ID || "default";
        return res.send(await renderHomeView(fallbackId, "Fútbol Infantil"));
      }
      next(error);
    }
  });

  // ==================
  // 404 HANDLER
  // ==================
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: "Route not found",
      path: req.path,
      method: req.method,
    });
  });

  // ==================
  // ASYNC ERROR HANDLER (FIX 6 & 8)
  // ==================
  app.use(errorHandler);

  return app;
}
