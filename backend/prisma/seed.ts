/**
 * SEED DATA COMPLETO OFICIAL - CONDEPOR (DeporteHN)
 * 
 * Crea:
 * - 6 Categorías Oficiales (U-8, U-10, U-12, U-14, U-16, U-18)
 * - 8 Equipos por categoría (48 Equipos totales)
 * - 15 Jugadores exactos por equipo (720 Jugadores totales con posiciones y dorsales)
 * - Partidos y Estadísticas de juego en cada categoría
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CATEGORIES_DATA = [
  { name: "Fútbol Infantil U-8", color: "#3b82f6", description: "Torneo Pre-Infantil Menores de 8 años" },
  { name: "Fútbol Infantil U-10", color: "#10b981", description: "Torneo Infantil Menor Menores de 10 años" },
  { name: "Fútbol Infantil U-12", color: "#f59e0b", description: "Torneo Infantil Mayor Menores de 12 años" },
  { name: "Fútbol Juvenil U-14", color: "#8b5cf6", description: "Torneo Juvenil Menor Menores de 14 años" },
  { name: "Fútbol Juvenil U-16", color: "#ec4899", description: "Torneo Juvenil Mayor Menores de 16 años" },
  { name: "Fútbol Reservas U-18", color: "#ef4444", description: "Torneo Reservas Menores de 18 años" }
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

async function main() {
  console.log("🌱 Starting Oficial CONDEPOR Full Seed...\n");

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

    for (let c = 0; c < CATEGORIES_DATA.length; c++) {
      const catData = CATEGORIES_DATA[c];
      console.log(`\n📋 Creating Category [${c + 1}/${CATEGORIES_DATA.length}]: ${catData.name}...`);
      
      const category = await prisma.category.create({
        data: catData
      });

      const teamsInCat: { id: string }[] = [];
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

      // Obtener todos los jugadores creados de la categoría para las estadísticas de partidos
      const playersInCat = await prisma.player.findMany({
        where: { categoryId: category.id }
      });

      // Crear 4 partidos finalizados y 2 programados en esta categoría para que haya tablas vivas
      const now = new Date();
      
      // Jornada 1: Olimpia (0) vs Motagua (1) | Real España (2) vs Marathón (3)
      const match1 = await prisma.match.create({
        data: {
          categoryId: category.id,
          homeTeamId: teamsInCat[0].id,
          awayTeamId: teamsInCat[1].id,
          date: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
          venue: "Estadio Nacional CONDEPOR (Tegucigalpa)",
          status: "finished",
          homeGoals: 3,
          awayGoals: 1
        }
      });
      totalMatchesCreated++;

      const match2 = await prisma.match.create({
        data: {
          categoryId: category.id,
          homeTeamId: teamsInCat[2].id,
          awayTeamId: teamsInCat[3].id,
          date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
          venue: "Estadio Olímpico CONDEPOR (San Pedro Sula)",
          status: "finished",
          homeGoals: 2,
          awayGoals: 2
        }
      });
      totalMatchesCreated++;

      // Jornada 2: Lobos (4) vs Victoria (5) | Vida (6) vs Génesis (7)
      const match3 = await prisma.match.create({
        data: {
          categoryId: category.id,
          homeTeamId: teamsInCat[4].id,
          awayTeamId: teamsInCat[5].id,
          date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
          venue: "Estadio Emilio Williams (Choluteca)",
          status: "finished",
          homeGoals: 0,
          awayGoals: 2
        }
      });
      totalMatchesCreated++;

      const match4 = await prisma.match.create({
        data: {
          categoryId: category.id,
          homeTeamId: teamsInCat[6].id,
          awayTeamId: teamsInCat[7].id,
          date: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
          venue: "Estadio Municipal CONDEPOR",
          status: "finished",
          homeGoals: 1,
          awayGoals: 0
        }
      });
      totalMatchesCreated++;

      // Próximos partidos programados
      await prisma.match.create({
        data: {
          categoryId: category.id,
          homeTeamId: teamsInCat[0].id,
          awayTeamId: teamsInCat[2].id,
          date: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
          venue: "Estadio Nacional CONDEPOR (Tegucigalpa)",
          status: "scheduled"
        }
      });
      totalMatchesCreated++;

      await prisma.match.create({
        data: {
          categoryId: category.id,
          homeTeamId: teamsInCat[1].id,
          awayTeamId: teamsInCat[3].id,
          date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
          venue: "Estadio Olímpico CONDEPOR (San Pedro Sula)",
          status: "scheduled"
        }
      });
      totalMatchesCreated++;

      // Crear Stats de Jugadores en los partidos finalizados
      // Match 1 (Olimpia 3 - 1 Motagua)
      const isStriker = (p: any) => p.position === "DC" || p.position === "Delantero" || p.position === "ED" || p.position === "EI";
      const olimpiaStrikers = playersInCat.filter(p => p.teamId === teamsInCat[0].id && isStriker(p));
      const motaguaStrikers = playersInCat.filter(p => p.teamId === teamsInCat[1].id && isStriker(p));
      
      if (olimpiaStrikers.length > 0 && motaguaStrikers.length > 0) {
        await prisma.playerMatchStat.create({
          data: {
            playerId: olimpiaStrikers[0].id,
            matchId: match1.id,
            goals: 2,
            assists: 1,
            minutesPlayed: 85,
            cleanSheet: false,
            points: 2 * 10 + 1 * 3 + (85 > 60 ? 2 : 1) // 25 pts
          }
        });
        await prisma.playerMatchStat.create({
          data: {
            playerId: olimpiaStrikers[1].id,
            matchId: match1.id,
            goals: 1,
            assists: 1,
            minutesPlayed: 90,
            cleanSheet: false,
            points: 1 * 10 + 1 * 3 + 2 // 15 pts
          }
        });
        await prisma.playerMatchStat.create({
          data: {
            playerId: motaguaStrikers[0].id,
            matchId: match1.id,
            goals: 1,
            assists: 0,
            minutesPlayed: 90,
            cleanSheet: false,
            points: 1 * 10 + 2 // 12 pts
          }
        });
        totalStatsCreated += 3;

        // Actualizar acumulados de temporada
        await prisma.player.update({
          where: { id: olimpiaStrikers[0].id },
          data: { seasonGoals: 2, seasonPoints: 25, seasonMatches: 1 }
        });
        await prisma.player.update({
          where: { id: olimpiaStrikers[1].id },
          data: { seasonGoals: 1, seasonPoints: 15, seasonMatches: 1 }
        });
        await prisma.player.update({
          where: { id: motaguaStrikers[0].id },
          data: { seasonGoals: 1, seasonPoints: 12, seasonMatches: 1 }
        });
      }

      // Match 2 (Real España 2 - 2 Marathón)
      const rceStrikers = playersInCat.filter(p => p.teamId === teamsInCat[2].id && isStriker(p));
      const marStrikers = playersInCat.filter(p => p.teamId === teamsInCat[3].id && isStriker(p));
      if (rceStrikers.length > 0 && marStrikers.length > 0) {
        await prisma.playerMatchStat.create({
          data: {
            playerId: rceStrikers[0].id,
            matchId: match2.id,
            goals: 2,
            assists: 0,
            minutesPlayed: 90,
            cleanSheet: false,
            points: 22
          }
        });
        await prisma.playerMatchStat.create({
          data: {
            playerId: marStrikers[0].id,
            matchId: match2.id,
            goals: 2,
            assists: 0,
            minutesPlayed: 90,
            cleanSheet: false,
            points: 22
          }
        });
        totalStatsCreated += 2;
        await prisma.player.update({
          where: { id: rceStrikers[0].id },
          data: { seasonGoals: 2, seasonPoints: 22, seasonMatches: 1 }
        });
        await prisma.player.update({
          where: { id: marStrikers[0].id },
          data: { seasonGoals: 2, seasonPoints: 22, seasonMatches: 1 }
        });
      }
    }

    console.log("\n✅ FULL CONDEPOR SEED COMPLETED SUCCESSFULLY!");
    console.log(`   🏆 Categorías creadas: ${CATEGORIES_DATA.length}`);
    console.log(`   ⚽ Equipos creados: ${totalTeamsCreated} (8 por categoría)`);
    console.log(`   👥 Jugadores creados: ${totalPlayersCreated} (15 exactos por equipo)`);
    console.log(`   📅 Partidos generados: ${totalMatchesCreated}`);
    console.log(`   📊 Estadísticas de partido: ${totalStatsCreated}`);

  } catch (error) {
    console.error("❌ Error running seed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
