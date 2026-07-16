/**
 * CALCULADORA DE TABLA DE POSICIONES
 * 
 * RESPONSABILIDAD ÚNICA: Calcular tabla ordenada de un conjunto de equipos
 */

import { StandingOutput, TEAM_STATS } from "../shared/types";

export interface MatchData {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeGoals: number | null;
  awayGoals: number | null;
  status: string;
}

export interface TeamData {
  id: string;
  name: string;
  crestUrl: string | null;
}

export class StandingsCalculator {
  /**
   * Optional constructor accepting prisma client or dependencies if needed
   */
  constructor(private prisma?: any) {}

  /**
   * Calcula tabla de posiciones
   */
  calculate(teams: TeamData[], matches: MatchData[]): StandingOutput[] {
    // 1. Calcular stats para cada equipo
    const standings: StandingOutput[] = teams.map((team) => {
      // Filtrar partidos del equipo (home o away)
      const teamMatches = matches.filter(
        (m) =>
          (m.homeTeamId === team.id || m.awayTeamId === team.id) &&
          m.status === "finished" &&
          m.homeGoals !== null &&
          m.awayGoals !== null
      );

      // Inicializar contadores
      let wins = 0;
      let draws = 0;
      let losses = 0;
      let goalsFor = 0;
      let goalsAgainst = 0;

      // Procesar cada partido del equipo
      teamMatches.forEach((match) => {
        if (match.homeTeamId === team.id) {
          // El equipo es local
          goalsFor += match.homeGoals!;
          goalsAgainst += match.awayGoals!;

          // Determinar resultado
          if (match.homeGoals! > match.awayGoals!) {
            wins++;
          } else if (match.homeGoals! === match.awayGoals!) {
            draws++;
          } else {
            losses++;
          }
        } else {
          // El equipo es visitante
          goalsFor += match.awayGoals!;
          goalsAgainst += match.homeGoals!;

          // Determinar resultado
          if (match.awayGoals! > match.homeGoals!) {
            wins++;
          } else if (match.awayGoals! === match.homeGoals!) {
            draws++;
          } else {
            losses++;
          }
        }
      });

      // Calcular puntos totales
      const points = wins * TEAM_STATS.WIN + draws * TEAM_STATS.DRAW;

      // Calcular diferencia goles
      const goalDifference = goalsFor - goalsAgainst;

      // Crear objeto standing (posición será asignada después)
      return {
        position: 0, // Temporal, será actualizado en paso 2
        teamId: team.id,
        teamName: team.name,
        teamCrest: team.crestUrl,
        played: teamMatches.length,
        wins,
        draws,
        losses,
        goalsFor,
        goalsAgainst,
        goalDifference,
        points,
      };
    });

    // 2. Ordenar por criterios de desempate (CRÍTICO)
    // Orden: Puntos DESC > Diferencia Goles DESC > Goles Favor DESC
    standings.sort((a, b) => {
      // Comparar puntos primero (mayor primero)
      if (b.points !== a.points) {
        return b.points - a.points;
      }

      // Si puntos iguales, comparar diferencia goles
      if (b.goalDifference !== a.goalDifference) {
        return b.goalDifference - a.goalDifference;
      }

      // Si aún igual, comparar goles a favor
      return b.goalsFor - a.goalsFor;
    });

    // 3. Asignar posiciones finales (1, 2, 3, ...)
    standings.forEach((standing, index) => {
      standing.position = index + 1;
    });

    return standings;
  }

  /**
   * Calcular tabla solo de equipos vivos (que han jugado)
   */
  calculateActive(teams: TeamData[], matches: MatchData[]): StandingOutput[] {
    const standings = this.calculate(teams, matches);
    return standings.filter((s) => s.played > 0);
  }
}
