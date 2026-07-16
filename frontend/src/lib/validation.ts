import { z } from 'zod';

// ============================================
// CATEGORY
// ============================================
export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string().default('#2563eb'),
  description: z.string().optional().nullable(),
  createdAt: z.string().or(z.date()).optional().nullable(),
  updatedAt: z.string().or(z.date()).optional().nullable(),
});

export type Category = z.infer<typeof CategorySchema>;

// ============================================
// TEAM
// ============================================
export const TeamSchema = z.object({
  id: z.string(),
  name: z.string(),
  crestUrl: z.string().nullable().optional(),
  categoryId: z.string().optional(),
  createdAt: z.string().or(z.date()).optional().nullable(),
  updatedAt: z.string().or(z.date()).optional().nullable(),
});

export type Team = z.infer<typeof TeamSchema>;

// ============================================
// PLAYER
// ============================================
export const PlayerSchema = z.object({
  id: z.string(),
  name: z.string(),
  photoUrl: z.string().nullable().optional(),
  position: z.string().default('Medio'),
  jerseyNumber: z.number().or(z.string().transform((val) => Number(val) || 0)).default(0),
  teamId: z.string().optional(),
  categoryId: z.string().optional(),
  seasonGoals: z.number().default(0),
  seasonPoints: z.number().default(0),
  seasonMatches: z.number().default(0),
  createdAt: z.string().or(z.date()).optional().nullable(),
  updatedAt: z.string().or(z.date()).optional().nullable(),
});

export type Player = z.infer<typeof PlayerSchema>;

// ============================================
// MATCH
// ============================================
export const MatchSchema = z.object({
  id: z.string(),
  categoryId: z.string().optional(),
  homeTeamId: z.string().optional(),
  awayTeamId: z.string().optional(),
  homeTeam: TeamSchema.optional(),
  awayTeam: TeamSchema.optional(),
  date: z.string().or(z.date()),
  venue: z.string().default('Estadio Principal'),
  status: z.enum(['scheduled', 'in_progress', 'finished']).or(z.string() as any).default('scheduled'),
  homeGoals: z.number().nullable().optional(),
  awayGoals: z.number().nullable().optional(),
  playerStats: z.any().array().optional(),
  createdAt: z.string().or(z.date()).optional().nullable(),
  updatedAt: z.string().or(z.date()).optional().nullable(),
});

export type Match = z.infer<typeof MatchSchema>;

// ============================================
// STANDING
// ============================================
export const StandingSchema = z.object({
  position: z.number().default(1),
  teamId: z.string(),
  teamName: z.string(),
  teamCrest: z.string().nullable().optional(),
  played: z.number().default(0),
  wins: z.number().default(0),
  draws: z.number().default(0),
  losses: z.number().default(0),
  goalsFor: z.number().default(0),
  goalsAgainst: z.number().default(0),
  goalDifference: z.number().default(0),
  points: z.number().default(0),
});

export type Standing = z.infer<typeof StandingSchema>;

// ============================================
// TOP SCORER
// ============================================
export const TopScorerSchema = z.object({
  position: z.number().default(1),
  playerId: z.string().optional(),
  playerName: z.string(),
  playerPhoto: z.string().nullable().optional(),
  teamId: z.string().optional(),
  teamName: z.string(),
  teamCrest: z.string().nullable().optional(),
  goals: z.number().default(0),
  assists: z.number().default(0).optional(),
  points: z.number().default(0),
});

export type TopScorer = z.infer<typeof TopScorerSchema>;

/**
 * Helper de validación Zod seguro.
 * Retorna la data parseada si es válida, o null si falla.
 */
export const validateData = <T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
): z.infer<T> | null => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production' && error instanceof z.ZodError) {
      console.warn('[Zod Validation Warning]:', (error as any).issues || (error as any).errors);
    }
    return null;
  }
};
