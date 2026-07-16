/**
 * MATCH SERVICE - Orquestador de casos de uso
 * 
 * RESPONSABILIDADES:
 * 1. Crear partidos
 * 2. Registrar resultados (usa ScoringEngine + StandingsCalculator)
 * 3. Actualizar partidos
 * 4. Eliminar partidos
 * 5. Consultar partidos (getMatches, getMatchDetail)
 */

import { IScoringEngine } from "./ports/IScoringEngine";
import { IStandingsCalculator } from "./ports/IStandingsCalculator";
import { IRepository } from "./ports/IRepository";

export interface Match {
  id: string;
  categoryId: string;
  homeTeamId: string;
  awayTeamId: string;
  date: Date;
  venue: string;
  status: "scheduled" | "in_progress" | "finished";
  homeGoals: number | null;
  awayGoals: number | null;
  homeTeam?: any;
  awayTeam?: any;
}

export interface Team {
  id: string;
  name: string;
  crestUrl: string | null;
  categoryId: string;
}

export interface Player {
  id: string;
  name: string;
  position: string;
  seasonGoals: number;
  seasonPoints: number;
}

export interface PlayerMatchStat {
  id: string;
  playerId: string;
  matchId: string;
  goals: number;
  assists: number;
  minutesPlayed: number;
  cleanSheet: boolean;
  points: number;
}

export class MatchService {
  constructor(
    private matchRepository: IRepository<Match>,
    private teamRepository: IRepository<Team>,
    private playerRepository: IRepository<Player>,
    private playerStatRepository: IRepository<PlayerMatchStat>,
    private scoringEngine: IScoringEngine,
    private standingsCalculator: IStandingsCalculator
  ) {}

  /**
   * CASO DE USO 1: Crear nuevo partido
   */
  async createMatch(data: {
    categoryId: string;
    homeTeamId: string;
    awayTeamId: string;
    date: Date;
    venue: string;
  }): Promise<Match> {
    // VALIDACIÓN 1: Equipos existen
    const homeTeam = await this.teamRepository.findById(data.homeTeamId);
    const awayTeam = await this.teamRepository.findById(data.awayTeamId);

    if (!homeTeam || !awayTeam) {
      throw new Error("MATCH_001: One or both teams not found");
    }

    // VALIDACIÓN 2: Equipos en misma categoría
    if (
      homeTeam.categoryId !== data.categoryId ||
      awayTeam.categoryId !== data.categoryId
    ) {
      throw new Error("MATCH_002: Teams must be in same category");
    }

    // VALIDACIÓN 3: Equipos diferentes
    if (data.homeTeamId === data.awayTeamId) {
      throw new Error("MATCH_003: Cannot play against itself");
    }

    // Crear partido
    const match = await this.matchRepository.create({
      ...data,
      status: "scheduled" as const,
      homeGoals: null,
      awayGoals: null,
    });

    return match;
  }

  /**
   * CASO DE USO 2: Registrar Resultado (CRÍTICO ⭐)
   */
  async recordResult(
    matchId: string,
    data: {
      homeGoals: number;
      awayGoals: number;
      playerStats: Array<{
        playerId: string;
        goals: number;
        assists?: number;
        minutesPlayed: number;
        cleanSheet?: boolean;
      }>;
    }
  ): Promise<{ match: Match; standings: any[] }> {
    // PASO 1: Obtener partido
    const match = await this.matchRepository.findById(matchId);
    if (!match) {
      throw new Error("MATCH_004: Match not found");
    }

    // PASO 2: Validar goles
    if (data.homeGoals < 0 || data.awayGoals < 0) {
      throw new Error("MATCH_005: Goals cannot be negative");
    }

    // PASO 3: Actualizar partido
    const updatedMatch = await this.matchRepository.update(matchId, {
      homeGoals: data.homeGoals,
      awayGoals: data.awayGoals,
      status: "finished" as const,
    });

    // PASO 4: Procesar estadísticas de cada jugador (INDEPENDIENTE)
    for (const stat of data.playerStats) {
      const player = await this.playerRepository.findById(stat.playerId);
      if (!player) {
        console.warn(
          `MATCH_006: Player ${stat.playerId} not found, skipping stats`
        );
        continue;
      }

      const pointsBreakdown = this.scoringEngine.calculatePoints({
        goals: stat.goals,
        assists: stat.assists || 0,
        minutesPlayed: stat.minutesPlayed,
        cleanSheet: stat.cleanSheet || false,
        position: player.position as any,
      });

      await this.playerStatRepository.create({
        playerId: stat.playerId,
        matchId: matchId,
        goals: stat.goals,
        assists: stat.assists || 0,
        minutesPlayed: stat.minutesPlayed,
        cleanSheet: stat.cleanSheet || false,
        points: pointsBreakdown.total,
      });

      await this.playerRepository.update(stat.playerId, {
        seasonGoals: player.seasonGoals + stat.goals,
        seasonPoints: player.seasonPoints + pointsBreakdown.total,
      });
    }

    // PASO 5: Recalcular tabla
    const allTeams = await this.teamRepository.findMany({
      categoryId: match.categoryId,
    });
    const allMatches = await this.matchRepository.findMany({
      categoryId: match.categoryId,
    });

    const standings = this.standingsCalculator.calculate(allTeams, allMatches);

    return {
      match: updatedMatch,
      standings,
    };
  }

  /**
   * Consultar partidos con filtros
   */
  async getMatches(filters: {
    categoryId?: string;
    status?: string;
    teamId?: string;
  }): Promise<Match[]> {
    const queryFilters: Record<string, any> = {};
    if (filters.categoryId) queryFilters.categoryId = filters.categoryId;
    if (filters.status) queryFilters.status = filters.status;
    if (filters.teamId) {
      queryFilters.OR = [
        { homeTeamId: filters.teamId },
        { awayTeamId: filters.teamId },
      ];
    }
    return await this.matchRepository.findMany(
      Object.keys(queryFilters).length > 0 ? queryFilters : undefined
    );
  }

  /**
   * Consultar detalle de un partido
   */
  async getMatchDetail(id: string): Promise<Match | null> {
    return await this.matchRepository.findById(id);
  }

  /**
   * Actualizar partido (cambiar fecha, hora, cancha)
   */
  async updateMatch(
    matchId: string,
    data: { date?: Date; venue?: string }
  ): Promise<Match> {
    return await this.matchRepository.update(matchId, data);
  }

  /**
   * Eliminar partido
   */
  async deleteMatch(matchId: string): Promise<void> {
    const stats = await this.playerStatRepository.findMany({
      matchId,
    });
    for (const stat of stats) {
      await this.playerStatRepository.delete(stat.id);
    }

    await this.matchRepository.delete(matchId);
  }
}
