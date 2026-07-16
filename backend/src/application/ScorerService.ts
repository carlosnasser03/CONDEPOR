/**
 * SCORER SERVICE - Ranking de goleadores
 * 
 * RESPONSABILIDAD ÚNICA: Consultar y ordenar top scorers
 */

import { IRepository } from "./ports/IRepository";
import { TopScorerOutput } from "@domain/shared/types";

interface Player {
  id: string;
  name: string;
  seasonGoals: number;
  seasonPoints: number;
  team?: { name: string; crestUrl: string | null } | any;
}

export class ScorerService {
  constructor(private playerRepository: IRepository<Player>) {}

  /**
   * Obtener top scorers de una categoría
   */
  async getTopScorers(
    categoryId: string,
    limit: number = 10
  ): Promise<TopScorerOutput[]> {
    const players = await this.playerRepository.findMany({
      categoryId,
      orderBy: { seasonGoals: "desc" },
      take: limit,
    });

    return players.map((player, index) => ({
      position: index + 1,
      playerId: player.id,
      playerName: player.name,
      teamName: player.team ? player.team.name : "Sin Equipo",
      teamCrest: player.team ? player.team.crestUrl : null,
      goals: player.seasonGoals,
      points: player.seasonPoints,
    }));
  }

  /**
   * Obtener todos los scorers (sin límite)
   */
  async getAllScorers(categoryId: string): Promise<TopScorerOutput[]> {
    const players = await this.playerRepository.findMany({
      categoryId,
      orderBy: { seasonGoals: "desc" },
    });

    return players.map((player, index) => ({
      position: index + 1,
      playerId: player.id,
      playerName: player.name,
      teamName: player.team ? player.team.name : "Sin Equipo",
      teamCrest: player.team ? player.team.crestUrl : null,
      goals: player.seasonGoals,
      points: player.seasonPoints,
    }));
  }
}
