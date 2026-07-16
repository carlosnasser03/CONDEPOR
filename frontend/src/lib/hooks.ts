'use client';

import { useState, useEffect } from 'react';
import { apiClient } from './api';
import { Category, Player, Match, Standing, TopScorer } from '@/types';

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
        setState({
          data: response,
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
        setState({
          data: response,
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
        setState({
          data: response,
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
        setState({
          data: response.standings || [],
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
        setState({
          data: response.scorers || [],
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
