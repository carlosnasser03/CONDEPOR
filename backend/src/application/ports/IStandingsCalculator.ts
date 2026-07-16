/**
 * INTERFAZ PARA CALCULADORA DE TABLA
 */

import { StandingOutput } from "@domain/shared/types";

export interface TeamDataPort {
  id: string;
  name: string;
  crestUrl: string | null;
}

export interface MatchDataPort {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeGoals: number | null;
  awayGoals: number | null;
  status: string;
}

export interface IStandingsCalculator {
  calculate(teams: TeamDataPort[], matches: MatchDataPort[]): StandingOutput[];
  calculateActive(
    teams: TeamDataPort[],
    matches: MatchDataPort[]
  ): StandingOutput[];
}
