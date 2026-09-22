import { describe, it, expect, beforeEach, vi } from "vitest";
import { LandingService } from "../LandingService";
import { IRepository } from "../ports/IRepository";
import { NotFoundError } from "@infrastructure/errors/AppError";

describe("LandingService", () => {
  let landingService: LandingService;
  let mockCategoryRepository: any;
  let mockMatchRepository: any;
  let mockPlayerMatchStatRepository: any;
  let mockPlayerRepository: any;

  beforeEach(() => {
    mockCategoryRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    } as IRepository<any>;

    mockMatchRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    } as IRepository<any>;

    mockPlayerMatchStatRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    } as IRepository<any>;

    mockPlayerRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    } as IRepository<any>;

    landingService = new LandingService(
      mockCategoryRepository,
      mockMatchRepository,
      mockPlayerMatchStatRepository,
      mockPlayerRepository
    );
  });

  describe("getPublicCategoriesSummary", () => {
    it("should return array of public categories", async () => {
      const mockCategories = [
        {
          id: "cat-1",
          name: "Categoría A",
          color: "#2563eb",
          description: "Primera categoría",
        },
        {
          id: "cat-2",
          name: "Categoría B",
          color: "#dc2626",
          description: "Segunda categoría",
        },
      ];

      mockCategoryRepository.findMany.mockResolvedValue(mockCategories);

      const result = await landingService.getPublicCategoriesSummary();

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: "cat-1",
        name: "Categoría A",
        color: "#2563eb",
        description: "Primera categoría",
      });
      expect(result[1]).toEqual({
        id: "cat-2",
        name: "Categoría B",
        color: "#dc2626",
        description: "Segunda categoría",
      });
      expect(mockCategoryRepository.findMany).toHaveBeenCalled();
    });

    it("should return empty array when no categories exist", async () => {
      mockCategoryRepository.findMany.mockResolvedValue([]);

      const result = await landingService.getPublicCategoriesSummary();

      expect(result).toEqual([]);
    });
  });

  describe("getPublicMatchesByCategoryForParents", () => {
    it("should return array of public matches for category", async () => {
      const categoryId = "cat-1";
      const mockMatches = [
        {
          id: "match-1",
          homeTeamId: "team-1",
          awayTeamId: "team-2",
          date: new Date("2025-08-01"),
          venue: "Estadio A",
          status: "finished" as const,
          homeGoals: 2,
          awayGoals: 1,
          homeTeam: {
            name: "Equipo A",
            crestUrl: "http://example.com/crest-a.png",
          },
          awayTeam: {
            name: "Equipo B",
            crestUrl: "http://example.com/crest-b.png",
          },
        },
      ];

      mockCategoryRepository.findById.mockResolvedValue({
        id: categoryId,
        name: "Categoría A",
        color: "#2563eb",
        description: "Test",
      });

      mockMatchRepository.findMany.mockResolvedValue(mockMatches);

      const result = await landingService.getPublicMatchesByCategoryForParents(
        categoryId
      );

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: "match-1",
        homeTeamId: "team-1",
        awayTeamId: "team-2",
        homeTeam: {
          name: "Equipo A",
          crestUrl: "http://example.com/crest-a.png",
        },
        awayTeam: {
          name: "Equipo B",
          crestUrl: "http://example.com/crest-b.png",
        },
        homeGoals: 2,
        awayGoals: 1,
      });
    });

    it("should filter out matches without team data", async () => {
      const categoryId = "cat-1";
      const mockMatches = [
        {
          id: "match-1",
          homeTeamId: "team-1",
          awayTeamId: "team-2",
          date: new Date("2025-08-01"),
          venue: "Estadio A",
          status: "scheduled" as const,
          homeGoals: null,
          awayGoals: null,
          homeTeam: {
            name: "Equipo A",
            crestUrl: null,
          },
          awayTeam: {
            name: "Equipo B",
            crestUrl: null,
          },
        },
        {
          id: "match-2",
          homeTeamId: "team-3",
          awayTeamId: "team-4",
          date: new Date("2025-08-02"),
          venue: "Estadio B",
          status: "scheduled" as const,
          homeGoals: null,
          awayGoals: null,
          homeTeam: null,
          awayTeam: null,
        },
      ];

      mockCategoryRepository.findById.mockResolvedValue({
        id: categoryId,
        name: "Categoría A",
        color: "#2563eb",
        description: "Test",
      });

      mockMatchRepository.findMany.mockResolvedValue(mockMatches);

      const result = await landingService.getPublicMatchesByCategoryForParents(
        categoryId
      );

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("match-1");
    });

    it("should throw NotFoundError for invalid category", async () => {
      const invalidCategoryId = "invalid-cat";

      mockCategoryRepository.findById.mockResolvedValue(null);

      try {
        await landingService.getPublicMatchesByCategoryForParents(invalidCategoryId);
        expect.fail("Should have thrown NotFoundError");
      } catch (error: any) {
        expect(error.statusCode).toBe(404);
        expect(error.message).toContain("not found");
      }
    });

    it("should propagate NotFoundError correctly", async () => {
      const categoryId = "cat-1";

      mockCategoryRepository.findById.mockResolvedValue({
        id: categoryId,
        name: "Categoría A",
        color: "#2563eb",
        description: "Test",
      });

      const notFoundError = new NotFoundError("Category not found");
      mockMatchRepository.findMany.mockRejectedValue(notFoundError);

      try {
        await landingService.getPublicMatchesByCategoryForParents(categoryId);
        expect.fail("Should have thrown NotFoundError");
      } catch (error: any) {
        expect(error.statusCode).toBe(404);
        expect(error.message).toBe("Category not found");
      }
    });
  });

  describe("getTopScorersByCategory", () => {
    it("should return top N scorers for category", async () => {
      const categoryId = "cat-1";
      const mockPlayers = [
        {
          id: "player-1",
          name: "Juan Pérez",
          seasonGoals: 15,
          seasonPoints: 150,
          team: { name: "Equipo A" },
        },
        {
          id: "player-2",
          name: "Carlos López",
          seasonGoals: 12,
          seasonPoints: 120,
          team: { name: "Equipo B" },
        },
        {
          id: "player-3",
          name: "Miguel García",
          seasonGoals: 10,
          seasonPoints: 100,
          team: { name: "Equipo A" },
        },
      ];

      mockCategoryRepository.findById.mockResolvedValue({
        id: categoryId,
        name: "Categoría A",
        color: "#2563eb",
        description: "Test",
      });

      mockPlayerRepository.findMany.mockResolvedValue(mockPlayers);

      const result = await landingService.getTopScorersByCategory(
        categoryId,
        10
      );

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({
        position: 1,
        playerName: "Juan Pérez",
        teamName: "Equipo A",
        goals: 15,
      });
      expect(result[1]).toEqual({
        position: 2,
        playerName: "Carlos López",
        teamName: "Equipo B",
        goals: 12,
      });
      expect(result[2]).toEqual({
        position: 3,
        playerName: "Miguel García",
        teamName: "Equipo A",
        goals: 10,
      });
    });

    it("should handle players without team", async () => {
      const categoryId = "cat-1";
      const mockPlayers = [
        {
          id: "player-1",
          name: "Juan Pérez",
          seasonGoals: 15,
          seasonPoints: 150,
          team: undefined,
        },
      ];

      mockCategoryRepository.findById.mockResolvedValue({
        id: categoryId,
        name: "Categoría A",
        color: "#2563eb",
        description: "Test",
      });

      mockPlayerRepository.findMany.mockResolvedValue(mockPlayers);

      const result = await landingService.getTopScorersByCategory(
        categoryId,
        10
      );

      expect(result[0]).toEqual({
        position: 1,
        playerName: "Juan Pérez",
        teamName: "Sin Equipo",
        goals: 15,
      });
    });

    it("should respect limit parameter", async () => {
      const categoryId = "cat-1";
      const mockPlayers = Array.from({ length: 5 }, (_, i) => ({
        id: `player-${i}`,
        name: `Jugador ${i}`,
        seasonGoals: 10 - i,
        seasonPoints: (10 - i) * 10,
        team: { name: `Equipo ${i}` },
      }));

      mockCategoryRepository.findById.mockResolvedValue({
        id: categoryId,
        name: "Categoría A",
        color: "#2563eb",
        description: "Test",
      });

      mockPlayerRepository.findMany.mockResolvedValue(mockPlayers);

      const result = await landingService.getTopScorersByCategory(
        categoryId,
        3
      );

      expect(mockPlayerRepository.findMany).toHaveBeenCalledWith({
        categoryId,
        orderBy: { seasonGoals: "desc" },
        take: 3,
      });
    });

    it("should throw NotFoundError for invalid category", async () => {
      const invalidCategoryId = "invalid-cat";

      mockCategoryRepository.findById.mockResolvedValue(null);

      try {
        await landingService.getTopScorersByCategory(invalidCategoryId);
        expect.fail("Should have thrown NotFoundError");
      } catch (error: any) {
        expect(error.statusCode).toBe(404);
        expect(error.message).toContain("not found");
      }
    });
  });

  describe("validateCategoryAccess", () => {
    it("should not throw for valid category", async () => {
      const categoryId = "cat-1";
      mockCategoryRepository.findById.mockResolvedValue({
        id: categoryId,
        name: "Categoría A",
        color: "#2563eb",
        description: "Test",
      });

      await expect(
        landingService.validateCategoryAccess(categoryId)
      ).resolves.not.toThrow();
    });

    it("should throw NotFoundError for invalid category", async () => {
      const invalidCategoryId = "invalid-cat";
      mockCategoryRepository.findById.mockResolvedValue(null);

      try {
        await landingService.validateCategoryAccess(invalidCategoryId);
        expect.fail("Should have thrown NotFoundError");
      } catch (error: any) {
        expect(error.statusCode).toBe(404);
        expect(error.message).toContain("not found");
      }
    });

    it("should throw NotFoundError with correct message", async () => {
      const invalidCategoryId = "invalid-cat";
      mockCategoryRepository.findById.mockResolvedValue(null);

      try {
        await landingService.validateCategoryAccess(invalidCategoryId);
        expect.fail("Should have thrown NotFoundError");
      } catch (error: any) {
        expect(error.statusCode).toBe(404);
        expect(error.message).toContain(invalidCategoryId);
      }
    });
  });

  describe("Error handling", () => {
    it("should propagate generic errors from repositories", async () => {
      mockCategoryRepository.findMany.mockRejectedValue(
        new Error("Database connection failed")
      );

      await expect(
        landingService.getPublicCategoriesSummary()
      ).rejects.toThrow("Database connection failed");
    });

    it("should log errors appropriately", async () => {
      const spyError = vi.spyOn(console, "error").mockImplementation(() => {});

      mockCategoryRepository.findMany.mockRejectedValue(
        new Error("Test error")
      );

      try {
        await landingService.getPublicCategoriesSummary();
      } catch (error) {
        // Expected error
      }

      spyError.mockRestore();
    });
  });
});
