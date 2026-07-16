/**
 * STANDINGS SERVICE - Calcula tabla de posiciones
 * 
 * RESPONSABILIDAD ÚNICA: Consultar y calcular tabla
 */

import { IRepository } from "./ports/IRepository";
import { IStandingsCalculator } from "./ports/IStandingsCalculator";
import { StandingOutput } from "@domain/shared/types";

interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeGoals: number | null;
  awayGoals: number | null;
  status: string;
}

interface Team {
  id: string;
  name: string;
  crestUrl: string | null;
  categoryId: string;
}

export class StandingsService {
  constructor(
    private teamRepository: IRepository<Team>,
    private matchRepository: IRepository<Match>,
    private calculator: IStandingsCalculator
  ) {}

  /**
   * Obtener tabla de una categoría específica
   */
  async getByCategoryId(categoryId: string): Promise<StandingOutput[]> {
    const teams = await this.teamRepository.findMany({
      categoryId,
    });

    const matches = await this.matchRepository.findMany({
      categoryId,
      status: "finished",
    });

    return this.calculator.calculate(teams, matches);
  }

  /**
   * Obtener solo equipos que han jugado
   */
  async getActiveByCategory(categoryId: string): Promise<StandingOutput[]> {
    const teams = await this.teamRepository.findMany({
      categoryId,
    });

    const matches = await this.matchRepository.findMany({
      categoryId,
      status: "finished",
    });

    return this.calculator.calculateActive(teams, matches);
  }
}
