'use client';

import { useState, useEffect } from 'react';
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

interface UseDataState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

// ============================================
// CATEGORÍAS
// ============================================

export const useCategories = () => {
  const [state, setState] = useState<UseDataState<Category[]>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true }));
        const response = await apiClient.getCategories();
        const rawList = Array.isArray(response) ? response : [];
        const categories = rawList.map((cat: any) =>
          validateData(CategorySchema, cat) || cat
        ) as Category[];

        setState({
          data: categories,
          loading: false,
          error: null,
        });
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error: error as Error,
        });
      }
    };

    fetchCategories();
  }, []);

  return state;
};

// ============================================
// JUGADORES DE UN EQUIPO
// ============================================

export const useTeamPlayers = (teamId: string | undefined) => {
  const [state, setState] = useState<UseDataState<Player[]>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!teamId) return;

    const fetchPlayers = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true }));
        const response = await apiClient.getPlayers({ teamId });
        const rawList = Array.isArray(response) ? response : [];
        const players = rawList.map((player: any) =>
          validateData(PlayerSchema, player) || player
        ) as Player[];

        setState({
          data: players,
          loading: false,
          error: null,
        });
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error: error as Error,
        });
      }
    };

    fetchPlayers();
  }, [teamId]);

  return state;
};

// ============================================
// PARTIDOS DE UNA CATEGORÍA
// ============================================

export const useCategoryMatches = (categoryId: string | undefined) => {
  const [state, setState] = useState<UseDataState<Match[]>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!categoryId) return;

    const fetchMatches = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true }));
        const response = await apiClient.getMatches({ categoryId });
        const rawList = Array.isArray(response) ? response : [];
        const matches = rawList.map((match: any) =>
          validateData(MatchSchema, match) || match
        ) as Match[];

        setState({
          data: matches,
          loading: false,
          error: null,
        });
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error: error as Error,
        });
      }
    };

    fetchMatches();
  }, [categoryId]);

  return state;
};

// ============================================
// TABLA DE POSICIONES
// ============================================

export const useStandings = (categoryId: string | undefined) => {
  const [state, setState] = useState<UseDataState<Standing[]>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!categoryId) return;

    const fetchStandings = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true }));
        const response = await apiClient.getStandings(categoryId);
        const rawList = response?.standings || (Array.isArray(response) ? response : []);
        const standings = rawList.map((standing: any) =>
          validateData(StandingSchema, standing) || standing
        ) as Standing[];

        setState({
          data: standings,
          loading: false,
          error: null,
        });
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error: error as Error,
        });
      }
    };

    fetchStandings();
  }, [categoryId]);

  return state;
};

// ============================================
// GOLEADORES
// ============================================

export const useScorers = (categoryId: string | undefined, limit?: number) => {
  const [state, setState] = useState<UseDataState<TopScorer[]>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!categoryId) return;

    const fetchScorers = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true }));
        const response = await apiClient.getScorers(categoryId, limit);
        const rawList = response?.scorers || (Array.isArray(response) ? response : []);
        const scorers = rawList.map((scorer: any) =>
          validateData(TopScorerSchema, scorer) || scorer
        ) as TopScorer[];

        setState({
          data: scorers,
          loading: false,
          error: null,
        });
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error: error as Error,
        });
      }
    };

    fetchScorers();
  }, [categoryId, limit]);

  return state;
};
