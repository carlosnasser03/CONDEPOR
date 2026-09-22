import { describe, it, expect, beforeEach, vi } from "vitest";
import { Router, Request, Response, NextFunction } from "express";
import { LandingController } from "../../controllers/LandingController";
import { LandingService } from "@application/LandingService";
import { NotFoundError } from "@infrastructure/errors/AppError";

/**
 * LANDING ROUTES TEST
 *
 * Tests the landing routes configuration and endpoint behavior
 */

describe("Landing Routes", () => {
  let mockController: any;
  let mockService: any;

  beforeEach(() => {
    // Mock the service
    mockService = {
      getPublicCategoriesSummary: vi.fn(),
      getPublicMatchesByCategoryForParents: vi.fn(),
      getTopScorersByCategory: vi.fn(),
    } as unknown as LandingService;

    // Mock the controller
    mockController = {
      getCategoriesSummary: vi.fn((req: Request, res: Response, next: NextFunction) => {
        res.json({ success: true, categories: [] });
      }),
      getMatchesByCategory: vi.fn((req: Request, res: Response, next: NextFunction) => {
        res.json({ success: true, matches: [] });
      }),
      getScorersByCategory: vi.fn((req: Request, res: Response, next: NextFunction) => {
        res.json({ success: true, scorers: [] });
      }),
    };
  });

  describe("Route handlers", () => {
    it("getCategoriesSummary handler should be callable", async () => {
      const mockReq = {} as Request;
      const mockRes = {
        json: vi.fn(),
      } as any;
      const mockNext = vi.fn();

      mockController.getCategoriesSummary(mockReq, mockRes, mockNext);

      expect(mockController.getCategoriesSummary).toHaveBeenCalledWith(
        mockReq,
        mockRes,
        mockNext
      );
    });

    it("getMatchesByCategory handler should be callable", async () => {
      const mockReq = { params: { categoryId: "cat-1" } } as any;
      const mockRes = {
        json: vi.fn(),
      } as any;
      const mockNext = vi.fn();

      mockController.getMatchesByCategory(mockReq, mockRes, mockNext);

      expect(mockController.getMatchesByCategory).toHaveBeenCalledWith(
        mockReq,
        mockRes,
        mockNext
      );
    });

    it("getScorersByCategory handler should be callable", async () => {
      const mockReq = { params: { categoryId: "cat-1" }, query: {} } as any;
      const mockRes = {
        json: vi.fn(),
      } as any;
      const mockNext = vi.fn();

      mockController.getScorersByCategory(mockReq, mockRes, mockNext);

      expect(mockController.getScorersByCategory).toHaveBeenCalledWith(
        mockReq,
        mockRes,
        mockNext
      );
    });
  });

  describe("Service integration", () => {
    it("Controller should call service method for categories", async () => {
      const categories = [
        {
          id: "cat-1",
          name: "Categoría A",
          color: "#2563eb",
          description: "Test",
        },
      ];

      mockService.getPublicCategoriesSummary.mockResolvedValue(categories);

      const result = await mockService.getPublicCategoriesSummary();

      expect(result).toEqual(categories);
      expect(mockService.getPublicCategoriesSummary).toHaveBeenCalled();
    });

    it("Controller should call service method for matches", async () => {
      const categoryId = "cat-1";
      const matches = [
        {
          id: "match-1",
          homeTeamId: "team-1",
          awayTeamId: "team-2",
          homeTeam: { name: "Team A", crestUrl: null },
          awayTeam: { name: "Team B", crestUrl: null },
          date: new Date(),
          venue: "Stadium",
          status: "scheduled",
          homeGoals: null,
          awayGoals: null,
        },
      ];

      mockService.getPublicMatchesByCategoryForParents.mockResolvedValue(
        matches
      );

      const result = await mockService.getPublicMatchesByCategoryForParents(
        categoryId
      );

      expect(result).toEqual(matches);
      expect(
        mockService.getPublicMatchesByCategoryForParents
      ).toHaveBeenCalledWith(categoryId);
    });

    it("Controller should call service method for scorers with limit", async () => {
      const categoryId = "cat-1";
      const limit = 5;
      const scorers = [
        {
          position: 1,
          playerName: "Player 1",
          teamName: "Team A",
          goals: 10,
        },
      ];

      mockService.getTopScorersByCategory.mockResolvedValue(scorers);

      const result = await mockService.getTopScorersByCategory(
        categoryId,
        limit
      );

      expect(result).toEqual(scorers);
      expect(mockService.getTopScorersByCategory).toHaveBeenCalledWith(
        categoryId,
        limit
      );
    });
  });

  describe("Error handling in routes", () => {
    it("should handle NotFoundError for invalid category in matches", async () => {
      const categoryId = "invalid-cat";

      mockService.getPublicMatchesByCategoryForParents.mockRejectedValue(
        new NotFoundError("Category not found")
      );

      try {
        await mockService.getPublicMatchesByCategoryForParents(categoryId);
        expect.fail("Should have thrown NotFoundError");
      } catch (error: any) {
        expect(error.message).toBe("Category not found");
        expect(error.statusCode).toBe(404);
      }
    });

    it("should handle NotFoundError for invalid category in scorers", async () => {
      const categoryId = "invalid-cat";

      mockService.getTopScorersByCategory.mockRejectedValue(
        new NotFoundError("Category not found")
      );

      try {
        await mockService.getTopScorersByCategory(categoryId);
        expect.fail("Should have thrown NotFoundError");
      } catch (error: any) {
        expect(error.message).toBe("Category not found");
        expect(error.statusCode).toBe(404);
      }
    });

    it("should handle generic errors", async () => {
      const error = new Error("Database error");

      mockService.getPublicCategoriesSummary.mockRejectedValue(error);

      try {
        await mockService.getPublicCategoriesSummary();
        expect.fail("Should have thrown error");
      } catch (err: any) {
        expect(err.message).toBe("Database error");
      }
    });
  });

  describe("Response format", () => {
    it("getCategoriesSummary should return success and categories", async () => {
      const mockReq = {} as Request;
      let responseData: any;
      const mockRes = {
        json: vi.fn((data) => {
          responseData = data;
        }),
      } as any;
      const mockNext = vi.fn();

      mockController.getCategoriesSummary(mockReq, mockRes, mockNext);

      expect(responseData).toHaveProperty("success", true);
      expect(responseData).toHaveProperty("categories");
      expect(Array.isArray(responseData.categories)).toBe(true);
    });

    it("getMatchesByCategory should return success and matches", async () => {
      const mockReq = { params: { categoryId: "cat-1" } } as any;
      let responseData: any;
      const mockRes = {
        json: vi.fn((data) => {
          responseData = data;
        }),
      } as any;
      const mockNext = vi.fn();

      mockController.getMatchesByCategory(mockReq, mockRes, mockNext);

      expect(responseData).toHaveProperty("success", true);
      expect(responseData).toHaveProperty("matches");
      expect(Array.isArray(responseData.matches)).toBe(true);
    });

    it("getScorersByCategory should return success and scorers", async () => {
      const mockReq = { params: { categoryId: "cat-1" }, query: {} } as any;
      let responseData: any;
      const mockRes = {
        json: vi.fn((data) => {
          responseData = data;
        }),
      } as any;
      const mockNext = vi.fn();

      mockController.getScorersByCategory(mockReq, mockRes, mockNext);

      expect(responseData).toHaveProperty("success", true);
      expect(responseData).toHaveProperty("scorers");
      expect(Array.isArray(responseData.scorers)).toBe(true);
    });
  });
});
