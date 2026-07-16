'use client';

import { useState, useEffect, useCallback } from 'react';
import { z } from 'zod';
import { apiClient } from './api';
import { Category, Player, Match, Standing, TopScorer } from '@/types';
import {
  validateData,
  CategorySchema,
  PlayerSchema,
  MatchSchema,
  StandingSchema,
  TopScorerSchema,
} from './validation';

export interface UseDataState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

const MAX_RETRIES = 3;

/**
 * Generic Hook Factory (useApi)
 * - Eliminates code duplication across all data fetching hooks (P2)
 * - Implements automatic error retry logic with exponential backoff (P5)
 * - Enforces strict Zod validation without fallback masking of corrupted items (P3)
 */
export function useApi<T>(
  fetcher: () => Promise<unknown>,
  schema: z.ZodTypeAny,
  dependencies: unknown[] = [],
  enabled: boolean = true
): UseDataState<T[]> {
  const [state, setState] = useState<UseDataState<T[]>>({
    data: null,
    loading: true,
    error: null,
  });
  const [retryCount, setRetryCount] = useState(0);

  const executeFetch = useCallback(async (currentRetry: number) => {
    if (!enabled) {
      setState({ data: [], loading: false, error: null });
      return;
    }

    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const response = await fetcher();
      
      let rawList: unknown[] = [];
      if (Array.isArray(response)) {
        rawList = response;
      } else if (response && typeof response === 'object') {
        const obj = response as Record<string, unknown>;
        rawList = Array.isArray(obj.data) ? obj.data :
                  Array.isArray(obj.categories) ? obj.categories :
                  Array.isArray(obj.players) ? obj.players :
                  Array.isArray(obj.matches) ? obj.matches :
                  Array.isArray(obj.standings) ? obj.standings :
                  Array.isArray(obj.scorers) ? obj.scorers :
                  Array.isArray(obj.teams) ? obj.teams : [];
      }

      // Strict validation filtering: filter out corrupted items rather than masking via fallback || item (P3)
      const validatedList = rawList
        .map((item) => validateData(schema, item))
        .filter((item): item is T => item !== null);

      if (validatedList.length < rawList.length && process.env.NODE_ENV !== 'production') {
        console.warn(`[Validation Notice]: ${rawList.length - validatedList.length} items failed validation against schema.`);
      }

      setState({
        data: validatedList,
        loading: false,
        error: null,
      });
      setRetryCount(0); // Reset retry on success
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('Unknown error during fetch');
      
      if (currentRetry < MAX_RETRIES) {
        const backoffDelay = 1000 * Math.pow(2, currentRetry);
        setTimeout(() => {
          setRetryCount((prev) => prev + 1);
        }, backoffDelay);
      } else {
        setState({
          data: null,
          loading: false,
          error: errorObj,
        });
      }
    }
  }, [enabled, ...dependencies]);

  useEffect(() => {
    executeFetch(retryCount);
  }, [retryCount, executeFetch]);

  return state;
}

// ============================================
// CATEGORÍAS
// ============================================
export const useCategories = (): UseDataState<Category[]> =>
  useApi<Category>(() => apiClient.getCategories(), CategorySchema);

// ============================================
// JUGADORES DE UN EQUIPO
// ============================================
export const useTeamPlayers = (teamId: string | undefined): UseDataState<Player[]> =>
  useApi<Player>(
    () => (teamId ? apiClient.getPlayers({ teamId }) : Promise.resolve([])),
    PlayerSchema,
    [teamId],
    Boolean(teamId)
  );

// ============================================
// PARTIDOS DE UNA CATEGORÍA
// ============================================
export const useCategoryMatches = (categoryId: string | undefined): UseDataState<Match[]> =>
  useApi<Match>(
    () => (categoryId ? apiClient.getMatches({ categoryId }) : Promise.resolve([])),
    MatchSchema,
    [categoryId],
    Boolean(categoryId)
  );

// ============================================
// TABLA DE POSICIONES
// ============================================
export const useStandings = (categoryId: string | undefined): UseDataState<Standing[]> =>
  useApi<Standing>(
    () => (categoryId ? apiClient.getStandings(categoryId) : Promise.resolve([])),
    StandingSchema,
    [categoryId],
    Boolean(categoryId)
  );

// ============================================
// GOLEADORES
// ============================================
export const useScorers = (categoryId: string | undefined, limit?: number): UseDataState<TopScorer[]> =>
  useApi<TopScorer>(
    () => (categoryId ? apiClient.getScorers(categoryId, limit) : Promise.resolve([])),
    TopScorerSchema,
    [categoryId, limit],
    Boolean(categoryId)
  );
