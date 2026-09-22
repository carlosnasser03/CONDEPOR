/**
 * LANDING SERVICE - Datos públicos para landing page
 *
 * RESPONSABILIDADES:
 * 1. Obtener categorías públicas (sin datos sensibles)
 * 2. Obtener partidos por categoría para padres
 * 3. Obtener top goleadores por categoría
 * 4. Validar acceso a categorías
 *
 * SEGURIDAD:
 * - No expone información de jugadores individuales en listas
 * - Solo retorna datos públicos
 * - Valida acceso a categorías existentes
 */

import { IRepository } from "./ports/IRepository";
import { NotFoundError } from "@infrastructure/errors/AppError";
import logger from "@infrastructure/logger/Logger";

export interface PublicCategory {
  id: string;
  name: string;
  color: string;
  description: string | null;
}

export interface PublicMatch {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeTeam: {
    name: string;
    crestUrl: string | null;
  };
  awayTeam: {
    name: string;
    crestUrl: string | null;
  };
  date: Date;
  venue: string;
  status: "scheduled" | "in_progress" | "finished";
  homeGoals: number | null;
  awayGoals: number | null;
}

export interface PublicScorer {
  position: number;
  playerName: string;
  teamName: string;
  goals: number;
}

interface Category {
  id: string;
  name: string;
  color: string;
  description: string | null;
}

interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  date: Date;
  venue: string;
  status: "scheduled" | "in_progress" | "finished";
  homeGoals: number | null;
  awayGoals: number | null;
  homeTeam?: { name: string; crestUrl: string | null };
  awayTeam?: { name: string; crestUrl: string | null };
}

interface PlayerMatchStat {
  id: string;
  playerId: string;
  matchId: string;
  goals: number;
}

interface Player {
  id: string;
  name: string;
  seasonGoals: number;
  team?: { name: string };
}

export class LandingService {
  constructor(
    private categoryRepository: IRepository<Category>,
    private matchRepository: IRepository<Match>,
    private playerMatchStatRepository: IRepository<PlayerMatchStat>,
    private playerRepository: IRepository<Player>
  ) {}

  /**
   * Obtiene categorías públicas sin datos sensibles
   */
  async getPublicCategoriesSummary(): Promise<PublicCategory[]> {
    logger.info("Fetching public categories summary");

    try {
      const categories = await this.categoryRepository.findMany();
      logger.info(`Found ${categories.length} public categories`);

      return categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        color: cat.color,
        description: cat.description,
      }));
    } catch (error) {
      logger.error("Error fetching public categories", { error });
      throw error;
    }
  }

  /**
   * Obtiene partidos públicos por categoría para visualización en landing
   * Excluye datos individuales de jugadores
   */
  async getPublicMatchesByCategoryForParents(
    categoryId: string
  ): Promise<PublicMatch[]> {
    logger.info(`Fetching public matches for category: ${categoryId}`);

    await this.validateCategoryAccess(categoryId);

    try {
      const matches = await this.matchRepository.findMany({
        categoryId,
        orderBy: { date: "asc" },
      });

      logger.info(`Found ${matches.length} public matches for category ${categoryId}`);

      return matches
        .filter((match) => match.homeTeam && match.awayTeam)
        .map((match) => ({
          id: match.id,
          homeTeamId: match.homeTeamId,
          awayTeamId: match.awayTeamId,
          homeTeam: {
            name: match.homeTeam!.name,
            crestUrl: match.homeTeam!.crestUrl,
          },
          awayTeam: {
            name: match.awayTeam!.name,
            crestUrl: match.awayTeam!.crestUrl,
          },
          date: match.date,
          venue: match.venue,
          status: match.status as "scheduled" | "in_progress" | "finished",
          homeGoals: match.homeGoals,
          awayGoals: match.awayGoals,
        }));
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      logger.error(`Error fetching public matches for category ${categoryId}`, {
        error,
      });
      throw error;
    }
  }

  /**
   * Obtiene top goleadores por categoría
   * Retorna estructura simplificada sin datos sensibles
   */
  async getTopScorersByCategory(
    categoryId: string,
    limit: number = 10
  ): Promise<PublicScorer[]> {
    logger.info(
      `Fetching top ${limit} scorers for category: ${categoryId}`
    );

    await this.validateCategoryAccess(categoryId);

    try {
      const players = await this.playerRepository.findMany({
        categoryId,
        orderBy: { seasonGoals: "desc" },
        take: limit,
      });

      logger.info(
        `Found ${players.length} top scorers for category ${categoryId}`
      );

      return players.map((player, index) => ({
        position: index + 1,
        playerName: player.name,
        teamName: player.team ? player.team.name : "Sin Equipo",
        goals: player.seasonGoals,
      }));
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      logger.error(`Error fetching top scorers for category ${categoryId}`, {
        error,
      });
      throw error;
    }
  }

  /**
   * Valida que una categoría exista
   * Lanza NotFoundError si no existe
   */
  async validateCategoryAccess(categoryId: string): Promise<void> {
    logger.debug(`Validating access to category: ${categoryId}`);

    const category = await this.categoryRepository.findById(categoryId);

    if (!category) {
      logger.warn(`Category not found: ${categoryId}`);
      throw new NotFoundError(`Category with id ${categoryId} not found`);
    }

    logger.debug(`Category access validated: ${categoryId}`);
  }
}
