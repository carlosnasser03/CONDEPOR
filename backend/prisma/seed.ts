/**
 * SEED DATA COMPLETO OFICIAL - CONDEPOR (DeporteHN)
 *
 * Crea:
 * - 4 Categorías Principales (U-10, U-12, U-14, U-16)
 * - 8 Equipos por categoría (32 Equipos totales)
 * - 15 Jugadores exactos por equipo (480 Jugadores totales con posiciones y dorsales)
 * - 10-12 Partidos por categoría con estados variados (scheduled, in_progress, finished)
 * - Estadísticas completas de jugadores y goleadores
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CATEGORIES_DATA = [
  { name: "Fútbol Infantil U-10", color: "#10b981", description: "Torneo Infantil Menor Menores de 10 años" },
  { name: "Fútbol Infantil U-12", color: "#f59e0b", description: "Torneo Infantil Mayor Menores de 12 años" },
  { name: "Fútbol Juvenil U-14", color: "#8b5cf6", description: "Torneo Juvenil Menor Menores de 14 años" },
  { name: "Fútbol Juvenil U-16", color: "#ec4899", description: "Torneo Juvenil Mayor Menores de 16 años" }
];

const TEAMS_DATA = [
  { name: "CD Olimpia", crestUrl: "/crests/cd_olimpia.png" },
  { name: "FC Motagua", crestUrl: "/crests/fc_motagua.png" },
  { name: "Real CD España", crestUrl: "/crests/real_cd_espana.png" },
  { name: "CD Marathón", crestUrl: "/crests/cd_marathon.png" },
  { name: "Lobos UPNFM", crestUrl: "/crests/lobos_upnfm.png" },
  { name: "CD Victoria", crestUrl: "/crests/cd_victoria.png" },
  { name: "CDS Vida", crestUrl: "/crests/cds_vida.png" },
  { name: "Génesis de Comayagua", crestUrl: "/crests/genesis_comayagua.png" }
];

const FIRST_NAMES = [
  "Carlos", "José", "Juan", "Luis", "Jorge", "Ángel", "Diego", "Mario", "Óscar", "Fernando",
  "Roberto", "Eduardo", "Daniel", "David", "Javier", "Gabriel", "Ricardo", "Héctor", "Alejandro", "Marco",
  "Rodrigo", "Cristian", "Kevin", "Brayan", "Axel", "Darío", "Mateo", "Sebastián", "Emiliano", "Santiago"
];

const LAST_NAMES = [
  "Martínez", "García", "López", "Hernández", "González", "Rodríguez", "Pérez", "Sánchez", "Ramírez", "Cruz",
  "Flores", "Gómez", "Morales", "Vásquez", "Reyes", "Díaz", "Torres", "Aguilar", "Mendoza", "Castillo",
  "Mejía", "Castro", "Romero", "Álvarez", "Chávez", "Rivera", "Ramos", "Espinoza", "Suárez", "Pineda"
];

function getRandomName(idx: number, teamIdx: number): string {
  const first = FIRST_NAMES[(idx + teamIdx * 3) % FIRST_NAMES.length];
  const last = LAST_NAMES[(idx * 2 + teamIdx) % LAST_NAMES.length];
  return `${first} ${last}`;
}

const ROSTER_POSITIONS = [
  { position: "POR", jerseyNumber: 1 },
  { position: "POR", jerseyNumber: 12 },
  { position: "LD", jerseyNumber: 2 },
  { position: "LI", jerseyNumber: 3 },
  { position: "DFC", jerseyNumber: 4 },
  { position: "DFC", jerseyNumber: 5 },
  { position: "DFC", jerseyNumber: 13 },
  { position: "MCD", jerseyNumber: 6 },
  { position: "MC", jerseyNumber: 8 },
  { position: "MCO", jerseyNumber: 10 },
  { position: "MC", jerseyNumber: 14 },
  { position: "MCD", jerseyNumber: 15 },
  { position: "ED", jerseyNumber: 7 },
  { position: "DC", jerseyNumber: 9 },
  { position: "EI", jerseyNumber: 11 }
];

// Interface para match data
interface MatchData {
  homeTeam: number;
  awayTeam: number;
  homeGoals: number;
  awayGoals: number;
  status: "scheduled" | "in_progress" | "finished";
  daysOffset: number;
  venue: string;
  goalScorers?: { team: "home" | "away"; playerIdx: number; goals: number }[];
}

// Definir partidos por categoría - 10-12 por categoría
const MATCH_TEMPLATES: MatchData[] = [
  // Jornada 1 - Pasados
  { homeTeam: 0, awayTeam: 1, homeGoals: 3, awayGoals: 1, status: "finished", daysOffset: -9, venue: "Estadio Nacional CONDEPOR (Tegucigalpa)", goalScorers: [
    { team: "home", playerIdx: 0, goals: 2 }, { team: "home", playerIdx: 1, goals: 1 }, { team: "away", playerIdx: 0, goals: 1 }
  ]},
  { homeTeam: 2, awayTeam: 3, homeGoals: 2, awayGoals: 2, status: "finished", daysOffset: -9, venue: "Estadio Olímpico CONDEPOR (San Pedro Sula)", goalScorers: [
    { team: "home", playerIdx: 0, goals: 1 }, { team: "home", playerIdx: 1, goals: 1 }, { team: "away", playerIdx: 0, goals: 2 }
  ]},

  // Jornada 2 - Pasados
  { homeTeam: 4, awayTeam: 5, homeGoals: 0, awayGoals: 2, status: "finished", daysOffset: -7, venue: "Estadio Emilio Williams (Choluteca)", goalScorers: [
    { team: "away", playerIdx: 0, goals: 2 }
  ]},
  { homeTeam: 6, awayTeam: 7, homeGoals: 1, awayGoals: 0, status: "finished", daysOffset: -7, venue: "Estadio Municipal CONDEPOR", goalScorers: [
    { team: "home", playerIdx: 0, goals: 1 }
  ]},

  // Jornada 3 - Pasados
  { homeTeam: 1, awayTeam: 2, homeGoals: 4, awayGoals: 1, status: "finished", daysOffset: -5, venue: "Estadio Nacional CONDEPOR (Tegucigalpa)", goalScorers: [
    { team: "home", playerIdx: 0, goals: 2 }, { team: "home", playerIdx: 1, goals: 1 }, { team: "home", playerIdx: 2, goals: 1 }, { team: "away", playerIdx: 0, goals: 1 }
  ]},
  { homeTeam: 3, awayTeam: 0, homeGoals: 1, awayGoals: 1, status: "finished", daysOffset: -5, venue: "Estadio Olímpico CONDEPOR (San Pedro Sula)", goalScorers: [
    { team: "home", playerIdx: 0, goals: 1 }, { team: "away", playerIdx: 0, goals: 1 }
  ]},

  // Jornada 4 - Pasados/Recientes
  { homeTeam: 5, awayTeam: 6, homeGoals: 2, awayGoals: 3, status: "finished", daysOffset: -3, venue: "Estadio Emilio Williams (Choluteca)", goalScorers: [
    { team: "home", playerIdx: 0, goals: 2 }, { team: "away", playerIdx: 0, goals: 2 }, { team: "away", playerIdx: 1, goals: 1 }
  ]},
  { homeTeam: 7, awayTeam: 4, homeGoals: 0, awayGoals: 0, status: "finished", daysOffset: -3, venue: "Estadio Municipal CONDEPOR", goalScorers: []},

  // Jornada 5 - HOY/RECIENTE (in_progress)
  { homeTeam: 0, awayTeam: 3, homeGoals: 2, awayGoals: 1, status: "in_progress", daysOffset: -1, venue: "Estadio Nacional CONDEPOR (Tegucigalpa)", goalScorers: [
    { team: "home", playerIdx: 0, goals: 1 }, { team: "home", playerIdx: 2, goals: 1 }, { team: "away", playerIdx: 0, goals: 1 }
  ]},

  // Próximos - Scheduled
  { homeTeam: 1, awayTeam: 4, homeGoals: 0, awayGoals: 0, status: "scheduled", daysOffset: 2, venue: "Estadio Olímpico CONDEPOR (San Pedro Sula)", goalScorers: []},
  { homeTeam: 2, awayTeam: 5, homeGoals: 0, awayGoals: 0, status: "scheduled", daysOffset: 3, venue: "Estadio Nacional CONDEPOR (Tegucigalpa)", goalScorers: []},
  { homeTeam: 6, awayTeam: 0, homeGoals: 0, awayGoals: 0, status: "scheduled", daysOffset: 5, venue: "Estadio Emilio Williams (Choluteca)", goalScorers: []},
];

async function main() {
  console.log("🌱 Starting CONDEPOR COMPREHENSIVE Full Seed...\n");

  try {
    console.log("🧹 Cleaning old database records...");
    await prisma.playerMatchStat.deleteMany();
    await prisma.match.deleteMany();
    await prisma.player.deleteMany();
    await prisma.team.deleteMany();
    await prisma.category.deleteMany();

    let totalTeamsCreated = 0;
    let totalPlayersCreated = 0;
    let totalMatchesCreated = 0;
    let totalStatsCreated = 0;

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    for (let c = 0; c < CATEGORIES_DATA.length; c++) {
      const catData = CATEGORIES_DATA[c];
      console.log(`\n📋 Creating Category [${c + 1}/${CATEGORIES_DATA.length}]: ${catData.name}...`);

      const category = await prisma.category.create({
        data: catData
      });

      const teamsInCat: { id: string; name: string }[] = [];
      for (let t = 0; t < TEAMS_DATA.length; t++) {
        const teamData = TEAMS_DATA[t];
        const team = await prisma.team.create({
          data: {
            name: teamData.name,
            crestUrl: teamData.crestUrl,
            categoryId: category.id
          }
        });
        teamsInCat.push(team);
        totalTeamsCreated++;

        // Crear los 15 jugadores exactos del equipo
        const playersToCreate = ROSTER_POSITIONS.map((pos, pIdx) => ({
          name: getRandomName(pIdx, t + c * TEAMS_DATA.length),
          position: pos.position,
          jerseyNumber: pos.jerseyNumber,
          photoUrl: `https://via.placeholder.com/150/1e293b/ffffff?text=${pos.jerseyNumber}`,
          teamId: team.id,
          categoryId: category.id
        }));

        await prisma.player.createMany({
          data: playersToCreate
        });
        totalPlayersCreated += playersToCreate.length;
      }

      // Obtener todos los jugadores creados de la categoría
      const playersInCat = await prisma.player.findMany({
        where: { categoryId: category.id }
      });

      const isStriker = (p: any) => p.position === "DC" || p.position === "ED" || p.position === "EI" || p.position === "MCO";

      // Crear matches según templates
      const matchIds: { [key: string]: string } = {};

      for (let m = 0; m < MATCH_TEMPLATES.length; m++) {
        const template = MATCH_TEMPLATES[m];
        const matchDate = new Date(now.getTime() + template.daysOffset * 24 * 60 * 60 * 1000);

        const match = await prisma.match.create({
          data: {
            categoryId: category.id,
            homeTeamId: teamsInCat[template.homeTeam].id,
            awayTeamId: teamsInCat[template.awayTeam].id,
            date: matchDate,
            venue: template.venue,
            status: template.status,
            homeGoals: template.status === "scheduled" ? null : template.homeGoals,
            awayGoals: template.status === "scheduled" ? null : template.awayGoals
          }
        });
        matchIds[m.toString()] = match.id;
        totalMatchesCreated++;

        // Crear stats si el partido está finished o in_progress
        if ((template.status === "finished" || template.status === "in_progress") && template.goalScorers && template.goalScorers.length > 0) {
          const homeTeamPlayers = playersInCat.filter(p => p.teamId === teamsInCat[template.homeTeam].id);
          const awayTeamPlayers = playersInCat.filter(p => p.teamId === teamsInCat[template.awayTeam].id);

          for (const goalScorer of template.goalScorers) {
            const team = goalScorer.team === "home" ? homeTeamPlayers : awayTeamPlayers;
            const strikers = team.filter(isStriker);

            if (strikers.length > goalScorer.playerIdx && strikers[goalScorer.playerIdx]) {
              const player = strikers[goalScorer.playerIdx];
              const points = goalScorer.goals * 10 + 2; // 10 pts per goal + 2 for playing

              await prisma.playerMatchStat.create({
                data: {
                  playerId: player.id,
                  matchId: match.id,
                  goals: goalScorer.goals,
                  assists: Math.floor(Math.random() * 2),
                  minutesPlayed: Math.random() > 0.3 ? 90 : Math.random() > 0.5 ? 75 : 45,
                  cleanSheet: false,
                  points
                }
              });

              // Update player stats
              await prisma.player.update({
                where: { id: player.id },
                data: {
                  seasonGoals: { increment: goalScorer.goals },
                  seasonPoints: { increment: points },
                  seasonMatches: { increment: 1 }
                }
              });

              totalStatsCreated++;
            }
          }
        }
      }

      console.log(`   ✅ Category ${catData.name} completed`);
      console.log(`      • Teams: ${teamsInCat.length}`);
      console.log(`      • Players: ${playersInCat.length}`);
      console.log(`      • Matches: ${MATCH_TEMPLATES.length}`);
    }

    console.log("\n✅ COMPREHENSIVE CONDEPOR SEED COMPLETED SUCCESSFULLY!");
    console.log(`\n📊 SUMMARY:`);
    console.log(`   🏆 Categorías creadas: ${CATEGORIES_DATA.length}`);
    console.log(`   ⚽ Equipos creados: ${totalTeamsCreated} (8 por categoría)`);
    console.log(`   👥 Jugadores creados: ${totalPlayersCreated} (15 exactos por equipo)`);
    console.log(`   📅 Partidos generados: ${totalMatchesCreated} (${MATCH_TEMPLATES.length} por categoría)`);
    console.log(`   📊 Estadísticas de partido: ${totalStatsCreated}`);
    console.log(`\n   Estados de partidos:`);
    console.log(`      • Finished (terminados): 8`);
    console.log(`      • In Progress (en vivo): 1`);
    console.log(`      • Scheduled (próximos): 3`);

  } catch (error) {
    console.error("❌ Error running seed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
