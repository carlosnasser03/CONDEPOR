/**
 * TIPOS COMPARTIDOS FRONTEND
 * Espejo de backend pero para Frontend
 */

export interface Category {
  id: string;
  name: string;
  color: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Team {
  id: string;
  name: string;
  crestUrl: string | null;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Player {
  id: string;
  name: string;
  photoUrl: string | null;
  position: "Delantero" | "Medio" | "Defensa" | "Portero" | string;
  jerseyNumber: number;
  teamId: string;
  categoryId: string;
  seasonGoals: number;
  seasonPoints: number;
  seasonMatches: number;
  createdAt: string;
  updatedAt: string;
}

export interface Match {
  id: string;
  categoryId: string;
  homeTeamId: string;
  awayTeamId: string;
  homeTeam: Team;
  awayTeam: Team;
  date: string;
  venue: string;
  status: "scheduled" | "in_progress" | "finished";
  homeGoals: number | null;
  awayGoals: number | null;
  playerStats?: any[];
  createdAt: string;
  updatedAt: string;
}

export interface Standing {
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

export interface TopScorer {
  position: number;
  playerId: string;
  playerName: string;
  playerPhoto?: string | null;
  teamName: string;
  teamCrest: string | null;
  goals: number;
  points: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
}
