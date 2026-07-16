/**
 * INTERFAZ PARA MOTOR DE SCORING
 * 
 * Permite intercambiar implementaciones sin cambiar Services
 */

import { PlayerPerformanceInput, PointsOutput } from "@domain/shared/types";

export interface IScoringEngine {
  calculatePoints(performance: PlayerPerformanceInput): PointsOutput;
  calculateBatch(
    performances: PlayerPerformanceInput[]
  ): Map<string, PointsOutput>;
}
