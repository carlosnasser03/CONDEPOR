/**
 * Hooks Tests
 * Tests for landing page hooks
 */

import { renderHook, waitFor } from '@testing-library/react';
import { useLandingCategories, useLandingMatches, useLandingScorers } from '../hooks';
import { apiClient } from '../api';
import { Category, Match, TopScorer } from '@/types';

// Mock the apiClient
jest.mock('../api', () => ({
  apiClient: {
    getLandingCategories: jest.fn(),
    getLandingMatches: jest.fn(),
    getLandingScorers: jest.fn(),
  },
}));

describe('Landing Page Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useLandingCategories', () => {
    it('should load categories successfully', async () => {
      const mockCategories: Category[] = [
        {
          id: '1',
          name: 'Sub-10',
          color: '#3b82f6',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      (apiClient.getLandingCategories as jest.Mock).mockResolvedValueOnce(mockCategories);

      const { result } = renderHook(() => useLandingCategories());

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(mockCategories);
      expect(result.current.error).toBeNull();
    });

    it('should handle loading errors', async () => {
      const mockError = new Error('API Error');
      (apiClient.getLandingCategories as jest.Mock).mockRejectedValueOnce(mockError);

      const { result } = renderHook(() => useLandingCategories());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toBeNull();
      expect(result.current.error).toBeDefined();
    });
  });

  describe('useLandingMatches', () => {
    it('should load matches when categoryId is provided', async () => {
      const categoryId = 'cat-1';
      const mockMatches: Match[] = [
        {
          id: 'match-1',
          categoryId,
          homeTeamId: 'team-1',
          awayTeamId: 'team-2',
          homeTeam: {
            id: 'team-1',
            name: 'Team A',
            crestUrl: null,
            categoryId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          awayTeam: {
            id: 'team-2',
            name: 'Team B',
            crestUrl: null,
            categoryId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          date: new Date().toISOString(),
          venue: 'Stadium',
          status: 'scheduled',
          homeGoals: null,
          awayGoals: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      (apiClient.getLandingMatches as jest.Mock).mockResolvedValueOnce(mockMatches);

      const { result } = renderHook(() => useLandingMatches(categoryId));

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(mockMatches);
      expect(result.current.error).toBeNull();
    });

    it('should skip fetching when categoryId is undefined', async () => {
      const { result } = renderHook(() => useLandingMatches(undefined));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual([]);
      expect(apiClient.getLandingMatches).not.toHaveBeenCalled();
    });
  });

  describe('useLandingScorers', () => {
    it('should load scorers with default limit', async () => {
      const categoryId = 'cat-1';
      const mockScorers: TopScorer[] = [
        {
          position: 1,
          playerId: 'player-1',
          playerName: 'Juan',
          teamName: 'Team A',
          teamCrest: null,
          goals: 10,
          points: 30,
        },
      ];

      (apiClient.getLandingScorers as jest.Mock).mockResolvedValueOnce(mockScorers);

      const { result } = renderHook(() => useLandingScorers(categoryId));

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(mockScorers);
      expect(apiClient.getLandingScorers).toHaveBeenCalledWith(categoryId, 10);
    });

    it('should load scorers with custom limit', async () => {
      const categoryId = 'cat-1';
      const limit = 5;
      const mockScorers: TopScorer[] = [];

      (apiClient.getLandingScorers as jest.Mock).mockResolvedValueOnce(mockScorers);

      const { result } = renderHook(() => useLandingScorers(categoryId, limit));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(apiClient.getLandingScorers).toHaveBeenCalledWith(categoryId, limit);
    });

    it('should skip fetching when categoryId is undefined', async () => {
      const { result } = renderHook(() => useLandingScorers(undefined, 10));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual([]);
      expect(apiClient.getLandingScorers).not.toHaveBeenCalled();
    });
  });
});
