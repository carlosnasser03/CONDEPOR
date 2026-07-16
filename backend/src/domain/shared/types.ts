/**
 * Tipos base compartidos en el domain
 * NO importan ningún archivo externo
 * Pueden ser usados en cualquier capa
 */

// ============================================
// TIPOS DE ENTRADA
// ============================================

export interface PlayerPerformanceInput {
  goals: number;          // Goles anotados
  assists: number;        // Asistencias
  minutesPlayed: number;  // 0-90
  cleanSheet: boolean;    // Sin goles en contra (defensores)
  position: "Delantero" | "Medio" | "Defensa" | "Portero";
}

export interface TeamStatsInput {
  teamId: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
}

// ============================================
// TIPOS DE SALIDA
// ============================================

export interface PointsOutput {
  goals: number;
  assists: number;
  cleanSheet: number;
  minutesBonus: number;
  total: number;
}

export interface StandingOutput {
  position: number;
  teamId: string;
  teamName: string;
  teamCrest: string | null;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface TopScorerOutput {
  position: number;
  playerId: string;
  playerName: string;
  teamName: string;
  teamCrest: string | null;
  goals: number;
  points: number;
}

// ============================================
// CONSTANTES DE SCORING
// ============================================

export const SCORING_RULES = {
  GOAL: 10,           // Gol = 10 puntos
  ASSIST: 3,          // Asistencia = 3 puntos
  CLEAN_SHEET: 5,     // Defensa limpia = 5 puntos
  FEW_MINUTES: -2,    // Jugó < 45 min = -2 puntos
  FULL_GAME: 1,       // Jugó 90 min = +1 punto bonus
  MIN_POINTS: 0,      // Mínimo puntos permitidos
  MATCH_MIN_THRESHOLD: 45, // Umbral de minutos para penalización
  FULL_MATCH_MINUTES: 90,  // Minutos para bonus
} as const;

export const TEAM_STATS = {
  WIN: 3,             // Victoria = 3 puntos
  DRAW: 1,            // Empate = 1 punto
  LOSS: 0,            // Derrota = 0 puntos
} as const;
