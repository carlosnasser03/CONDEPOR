/**
 * MOTOR DE PUNTUACIÓN
 * 
 * RESPONSABILIDAD ÚNICA: Calcular puntos de un jugador
 * 
 * NO HACE:
 * - Database queries
 * - HTTP requests
 * - File operations
 * 
 * SOLO CALCULA:
 * - Puntos basados en goles, asistencias, minutos, clean sheet
 * 
 * PARÁMETROS INDEPENDIENTES:
 * - Cada jugador se calcula independientemente
 * - No afecta a otros jugadores
 * - Si se cambia la regla de scoring, solo cambiar aquí
 */

import {
  PlayerPerformanceInput,
  PointsOutput,
  SCORING_RULES,
} from "../shared/types";

export class ScoringEngine {
  /**
   * Calcula puntos de UN jugador basado en su desempeño
   * 
   * FÓRMULA:
   * - Goles: goals * 10
   * - Asistencias: assists * 3
   * - Clean Sheet (solo Defensa/Portero): 5 puntos
   * - Minutos < 45: -2 puntos
   * - Minutos = 90: +1 punto bonus
   */
  calculatePoints(performance: PlayerPerformanceInput): PointsOutput {
    let points = 0;

    // 1. GOLES
    const goalsPoints = performance.goals * SCORING_RULES.GOAL;
    points += goalsPoints;

    // 2. ASISTENCIAS
    const assistsPoints = performance.assists * SCORING_RULES.ASSIST;
    points += assistsPoints;

    // 3. CLEAN SHEET (solo para defensas y porteros)
    let cleanSheetPoints = 0;
    if (
      (performance.position === "Defensa" ||
        performance.position === "Portero") &&
      performance.cleanSheet
    ) {
      cleanSheetPoints = SCORING_RULES.CLEAN_SHEET;
      points += cleanSheetPoints;
    }

    // 4. MINUTOS JUGADOS
    let minutesBonus = 0;
    if (performance.minutesPlayed < SCORING_RULES.MATCH_MIN_THRESHOLD) {
      // Jugó menos de 45 minutos = -2 puntos
      minutesBonus = SCORING_RULES.FEW_MINUTES;
      points += minutesBonus;
    } else if (performance.minutesPlayed === SCORING_RULES.FULL_MATCH_MINUTES) {
      // Jugó todo el partido = +1 punto bonus
      minutesBonus = SCORING_RULES.FULL_GAME;
      points += minutesBonus;
    }

    // 5. GARANTIZAR MÍNIMO
    const total = Math.max(SCORING_RULES.MIN_POINTS, points);

    // Retornar desglose para transparencia
    return {
      goals: goalsPoints,
      assists: assistsPoints,
      cleanSheet: cleanSheetPoints,
      minutesBonus,
      total,
    };
  }

  /**
   * Calcula puntos para múltiples jugadores
   * Útil para procesar batch de stats
   */
  calculateBatch(
    performances: PlayerPerformanceInput[]
  ): Map<string, PointsOutput> {
    const results = new Map<string, PointsOutput>();
    performances.forEach((perf, index) => {
      results.set(index.toString(), this.calculatePoints(perf));
    });
    return results;
  }
}
