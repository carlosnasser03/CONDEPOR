/**
 * Script para exportar datos de CONDEPOR para la landing page
 * Extrae: Categorías, Equipos Top, Jugadores Top, Partidos Recientes
 */

import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

async function exportLandingData() {
  console.log("📊 Exportando datos para landing page...\n");

  try {
    // 1. CATEGORÍAS
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: "asc" }
    });

    // 2. EQUIPOS TOP (por categoría)
    const teamsByCategory: Record<string, any> = {};
    for (const cat of categories) {
      const teams = await prisma.team.findMany({
        where: { categoryId: cat.id },
        take: 4 // Top 4 equipos
      });
      teamsByCategory[cat.id] = teams;
    }

    // 3. JUGADORES TOP (goles, asistencias)
    const topPlayers = await prisma.player.findMany({
      orderBy: { seasonGoals: "desc" },
      take: 10,
      include: {
        team: { select: { name: true } },
        category: { select: { name: true } }
      }
    });

    // 4. PARTIDOS RECIENTES (últimos 5)
    const recentMatches = await prisma.match.findMany({
      orderBy: { date: "desc" },
      take: 5,
      include: {
        homeTeam: true,
        awayTeam: true,
        category: true,
        playerStats: {
          include: { player: true },
          orderBy: { goals: "desc" },
          take: 3
        }
      }
    });

    // 5. PRÓXIMOS PARTIDOS (siguientes 5)
    const upcomingMatches = await prisma.match.findMany({
      where: { status: "scheduled" },
      orderBy: { date: "asc" },
      take: 5,
      include: {
        homeTeam: true,
        awayTeam: true,
        category: true
      }
    });

    // 6. RANKINGS POR CATEGORÍA
    const rankings: Record<string, any> = {};
    for (const cat of categories) {
      const players = await prisma.player.findMany({
        where: { categoryId: cat.id },
        orderBy: { seasonGoals: "desc" },
        take: 5,
        include: { team: { select: { name: true } } }
      });
      rankings[cat.id] = {
        categoryName: cat.name,
        categoryColor: cat.color,
        topPlayers: players
      };
    }

    const landingData = {
      timestamp: new Date().toISOString(),
      categories,
      topPlayers,
      recentMatches: recentMatches.map(m => ({
        id: m.id,
        homeTeam: m.homeTeam.name,
        awayTeam: m.awayTeam.name,
        homeGoals: m.homeGoals,
        awayGoals: m.awayGoals,
        date: m.date,
        venue: m.venue,
        status: m.status,
        categoryName: m.category.name,
        categoryColor: m.category.color,
        topScorers: m.playerStats.map(s => ({
          playerName: s.player.name,
          goals: s.goals,
          assists: s.assists
        }))
      })),
      upcomingMatches: upcomingMatches.map(m => ({
        id: m.id,
        homeTeam: m.homeTeam.name,
        awayTeam: m.awayTeam.name,
        date: m.date,
        venue: m.venue,
        categoryName: m.category.name
      })),
      rankings
    };

    // Guardar como JSON
    const outputPath = path.join(__dirname, "../landing-data.json");
    fs.writeFileSync(outputPath, JSON.stringify(landingData, null, 2));

    console.log("✅ Datos exportados exitosamente!");
    console.log(`📁 Archivo: ${outputPath}`);
    console.log(`\n📊 Resumen:`);
    console.log(`   - Categorías: ${categories.length}`);
    console.log(`   - Jugadores Top: ${topPlayers.length}`);
    console.log(`   - Partidos Recientes: ${recentMatches.length}`);
    console.log(`   - Próximos Partidos: ${upcomingMatches.length}`);

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

exportLandingData();
