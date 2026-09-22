/**
 * API Client Tests
 * Tests for landing page API methods
 */

import { apiClient, ApiError, NetworkError, TimeoutError } from '../api';
import { Category, Match, TopScorer } from '@/types';

describe('API Client - Landing Page Methods', () => {
  // Mock setup
  const mockFetch = jest.fn();

  beforeEach(() => {
    mockFetch.mockClear();
    global.fetch = mockFetch as any;
  });

  describe('getLandingCategories', () => {
    it('should fetch categories successfully', async () => {
      const mockCategories: Category[] = [
        {
          id: '1',
          name: 'Sub-10',
          color: '#3b82f6',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: mockCategories,
        }),
      });

      const result = await apiClient.getLandingCategories();

      expect(result).toEqual(mockCategories);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/landing/categories-summary'),
        expect.any(Object)
      );
    });

    it('should throw error on failed response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({
          error: 'Server error',
        }),
      });

      await expect(apiClient.getLandingCategories()).rejects.toThrow(ApiError);
    });

    it('should handle array response', async () => {
      const mockCategories: Category[] = [
        {
          id: '1',
          name: 'Sub-10',
          color: '#3b82f6',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCategories,
      });

      const result = await apiClient.getLandingCategories();
      expect(result).toEqual(mockCategories);
    });
  });

  describe('getLandingMatches', () => {
    it('should fetch matches for a category', async () => {
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

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: mockMatches,
        }),
      });

      const result = await apiClient.getLandingMatches(categoryId);

      expect(result).toEqual(mockMatches);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`/landing/matches/${categoryId}`),
        expect.any(Object)
      );
    });

    it('should handle empty matches list', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: [],
        }),
      });

      const result = await apiClient.getLandingMatches('cat-1');
      expect(result).toEqual([]);
    });
  });

  describe('getLandingScorers', () => {
    it('should fetch scorers for a category', async () => {
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

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          scorers: mockScorers,
        }),
      });

      const result = await apiClient.getLandingScorers(categoryId);

      expect(result).toEqual(mockScorers);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`/landing/scorers/${categoryId}`),
        expect.any(Object)
      );
    });

    it('should include limit parameter when provided', async () => {
      const categoryId = 'cat-1';
      const limit = 5;

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          scorers: [],
        }),
      });

      await apiClient.getLandingScorers(categoryId, limit);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`?limit=${limit}`),
        expect.any(Object)
      );
    });

    it('should handle scorers in data field', async () => {
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

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: mockScorers,
        }),
      });

      const result = await apiClient.getLandingScorers('cat-1');
      expect(result).toEqual(mockScorers);
    });
  });
});
