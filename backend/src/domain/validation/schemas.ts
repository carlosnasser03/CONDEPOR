import { z } from "zod";

// ==========================================
// CATEGORY SCHEMAS
// ==========================================
export const CreateCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(255).trim(),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color hex format"),
  description: z.string().max(1000).optional(),
});

export const UpdateCategorySchema = CreateCategorySchema.partial();

// ==========================================
// TEAM SCHEMAS
// ==========================================
export const CreateTeamSchema = z.object({
  name: z.string().min(1, "Team name is required").max(255).trim(),
  categoryId: z.string().min(1, "Category ID is required"),
  crestUrl: z.string().url("Invalid crest URL").optional().or(z.literal("")).nullable(),
});

export const UpdateTeamSchema = CreateTeamSchema.partial();

export const AddTeamPlayerSchema = z.object({
  name: z.string().min(1, "Player name is required").max(255).trim(),
  position: z.enum(["Delantero", "Medio", "Defensa", "Portero"]),
  jerseyNumber: z.coerce.number().int().min(1).max(99),
  categoryId: z.string().min(1, "Category ID is required"),
  photoUrl: z.string().url("Invalid photo URL").optional().or(z.literal("")).nullable(),
});

// ==========================================
// PLAYER SCHEMAS
// ==========================================
export const CreatePlayerSchema = z.object({
  name: z.string().min(1, "Player name is required").max(255).trim(),
  position: z.enum(["Delantero", "Medio", "Defensa", "Portero"]),
  jerseyNumber: z.coerce.number().int().min(1).max(99),
  teamId: z.string().min(1, "Team ID is required"),
  categoryId: z.string().min(1, "Category ID is required"),
  photoUrl: z.string().url().optional().or(z.literal("")).nullable(),
});

export const UpdatePlayerSchema = z.object({
  name: z.string().min(1).max(255).trim().optional(),
  position: z.enum(["Delantero", "Medio", "Defensa", "Portero"]).optional(),
  jerseyNumber: z.coerce.number().int().min(1).max(99).optional(),
  photoUrl: z.string().url().optional().or(z.literal("")).nullable(),
});

// ==========================================
// MATCH SCHEMAS
// ==========================================
export const CreateMatchSchema = z.object({
  categoryId: z.string().min(1, "Category ID is required"),
  homeTeamId: z.string().min(1, "Home Team ID is required"),
  awayTeamId: z.string().min(1, "Away Team ID is required"),
  date: z.coerce.date(),
  venue: z.string().min(1, "Venue is required").max(255).trim(),
  status: z.enum(["scheduled", "in_progress", "finished"]).default("scheduled").optional(),
});

export const UpdateMatchSchema = z.object({
  date: z.coerce.date().optional(),
  venue: z.string().min(1).max(255).trim().optional(),
  status: z.enum(["scheduled", "in_progress", "finished"]).optional(),
});

export const RecordMatchResultSchema = z.object({
  homeGoals: z.coerce.number().int().min(0, "Home goals cannot be negative"),
  awayGoals: z.coerce.number().int().min(0, "Away goals cannot be negative"),
  playerStats: z.array(
    z.object({
      playerId: z.string().min(1, "Player ID is required"),
      goals: z.coerce.number().int().min(0).default(0),
      assists: z.coerce.number().int().min(0).default(0),
      minutesPlayed: z.coerce.number().int().min(0).max(120).default(0),
      cleanSheet: z.boolean().default(false),
    })
  ),
});

// ==========================================
// QUERY SCHEMAS & ID VALIDATION
// ==========================================
export const IdParamSchema = z.object({
  id: z.string().min(1, "Invalid ID parameter"),
});

export const TopScorersQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export const MatchQuerySchema = z.object({
  categoryId: z.string().optional(),
  status: z.string().optional(),
  teamId: z.string().optional(),
});

// ==========================================
// LANDING SCHEMAS
// ==========================================
export const LandingCategoryIdSchema = z.object({
  categoryId: z.string().min(1, "Invalid category ID parameter"),
});

export const LandingScorersQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

// ==========================================
// PUBLIC DATA SCHEMAS (Landing Page)
// ==========================================

export const PublicCategorySchema = z.object({
  id: z.string().min(1, "Category ID is required"),
  name: z.string().min(1, "Category name is required").max(255),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color format"),
  description: z.string().max(1000).nullable().optional(),
});

export const PublicMatchSchema = z.object({
  id: z.string().min(1, "Match ID is required"),
  homeTeamId: z.string().min(1, "Home team ID is required"),
  awayTeamId: z.string().min(1, "Away team ID is required"),
  homeTeam: z.object({
    name: z.string().min(1, "Team name is required"),
    crestUrl: z.string().url("Invalid crest URL").nullable().optional(),
  }),
  awayTeam: z.object({
    name: z.string().min(1, "Team name is required"),
    crestUrl: z.string().url("Invalid crest URL").nullable().optional(),
  }),
  date: z.date(),
  venue: z.string().min(1, "Venue is required").max(255),
  status: z.enum(["scheduled", "in_progress", "finished"]),
  homeGoals: z.number().int().min(0).nullable().optional(),
  awayGoals: z.number().int().min(0).nullable().optional(),
});

export const PublicScorerSchema = z.object({
  position: z.number().int().min(1, "Position must be >= 1"),
  playerName: z.string().min(1, "Player name is required").max(255),
  teamName: z.string().min(1, "Team name is required").max(255),
  goals: z.number().int().min(0, "Goals cannot be negative"),
});

export const CategoryIdParamSchema = z.object({
  categoryId: z
    .string()
    .min(3, "Category ID must be at least 3 characters")
    .max(50, "Category ID cannot exceed 50 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Category ID must be alphanumeric"),
});

// TYPE EXPORTS
export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>;
export type CreateTeamInput = z.infer<typeof CreateTeamSchema>;
export type AddTeamPlayerInput = z.infer<typeof AddTeamPlayerSchema>;
export type CreatePlayerInput = z.infer<typeof CreatePlayerSchema>;
export type UpdatePlayerInput = z.infer<typeof UpdatePlayerSchema>;
export type CreateMatchInput = z.infer<typeof CreateMatchSchema>;
export type UpdateMatchInput = z.infer<typeof UpdateMatchSchema>;
export type RecordMatchResultInput = z.infer<typeof RecordMatchResultSchema>;
export type PublicCategory = z.infer<typeof PublicCategorySchema>;
export type PublicMatch = z.infer<typeof PublicMatchSchema>;
export type PublicScorer = z.infer<typeof PublicScorerSchema>;
export type CategoryIdParam = z.infer<typeof CategoryIdParamSchema>;
