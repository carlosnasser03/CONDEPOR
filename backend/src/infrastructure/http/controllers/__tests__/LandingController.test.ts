import { describe, it, expect, beforeEach, vi } from "vitest";
import { Request, Response, NextFunction } from "express";
import { LandingController } from "../LandingController";
import { LandingService } from "@application/LandingService";
import { NotFoundError } from "@infrastructure/errors/AppError";

describe("LandingController", () => {
  let controller: LandingController;
  let mockService: any;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockService = {
      getPublicCategoriesSummary: vi.fn(),
      getPublicMatchesByCategoryForParents: vi.fn(),
      getTopScorersByCategory: vi.fn(),
      validateCategoryAccess: vi.fn(),
    } as unknown as LandingService;

    controller = new LandingController(mockService);

    mockRequest = {
      params: {},
      query: {},
    };

    mockResponse = {
      json: vi.fn().mockReturnThis(),
      status: vi.fn().mockReturnThis(),
    };

    mockNext = vi.fn() as unknown as NextFunction;
  });

  describe("getCategoriesSummary", () => {
    it("should return 200 with categories array", async () => {
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

      mockService.getPublicCategoriesSummary.mockResolvedValue(mockCategories);

      await controller.getCategoriesSummary(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        categories: mockCategories,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return empty array when no categories exist", async () => {
      mockService.getPublicCategoriesSummary.mockResolvedValue([]);

      await controller.getCategoriesSummary(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        categories: [],
      });
    });

    it("should call next with error on service failure", async () => {
      const testError = new Error("Database error");
      mockService.getPublicCategoriesSummary.mockRejectedValue(testError);

      await controller.getCategoriesSummary(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(testError);
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });

  describe("getMatchesByCategory", () => {
    it("should return 200 with matches for valid category", async () => {
      const categoryId = "cat-1";
      mockRequest.params = { categoryId };

      const mockMatches = [
        {
          id: "match-1",
          homeTeamId: "team-1",
          awayTeamId: "team-2",
          homeTeam: { name: "Equipo A", crestUrl: null },
          awayTeam: { name: "Equipo B", crestUrl: null },
          date: new Date("2025-08-01"),
          venue: "Estadio A",
          status: "finished",
          homeGoals: 2,
          awayGoals: 1,
        },
      ];

      mockService.getPublicMatchesByCategoryForParents.mockResolvedValue(
        mockMatches
      );

      await controller.getMatchesByCategory(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        categoryId,
        matches: mockMatches,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 404 NotFoundError for invalid category", async () => {
      const categoryId = "invalid-cat";
      mockRequest.params = { categoryId };

      const notFoundError = new NotFoundError("Category not found");
      mockService.getPublicMatchesByCategoryForParents.mockRejectedValue(
        notFoundError
      );

      await controller.getMatchesByCategory(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(notFoundError);
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it("should return empty array when no matches exist", async () => {
      const categoryId = "cat-1";
      mockRequest.params = { categoryId };

      mockService.getPublicMatchesByCategoryForParents.mockResolvedValue([]);

      await controller.getMatchesByCategory(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        categoryId,
        matches: [],
      });
    });

    it("should validate categoryId parameter", async () => {
      mockRequest.params = { categoryId: "" };

      await controller.getMatchesByCategory(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });

  describe("getScorersByCategory", () => {
    it("should return 200 with scorers for valid category", async () => {
      const categoryId = "cat-1";
      mockRequest.params = { categoryId };
      mockRequest.query = { limit: "10" };

      const mockScorers = [
        {
          position: 1,
          playerName: "Juan Pérez",
          teamName: "Equipo A",
          goals: 15,
        },
        {
          position: 2,
          playerName: "Carlos López",
          teamName: "Equipo B",
          goals: 12,
        },
      ];

      mockService.getTopScorersByCategory.mockResolvedValue(mockScorers);

      await controller.getScorersByCategory(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        categoryId,
        scorers: mockScorers,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should respect limit query parameter", async () => {
      const categoryId = "cat-1";
      const limit = 5;
      mockRequest.params = { categoryId };
      mockRequest.query = { limit: String(limit) };

      const mockScorers = [
        {
          position: 1,
          playerName: "Juan Pérez",
          teamName: "Equipo A",
          goals: 15,
        },
      ];

      mockService.getTopScorersByCategory.mockResolvedValue(mockScorers);

      await controller.getScorersByCategory(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockService.getTopScorersByCategory).toHaveBeenCalledWith(
        categoryId,
        limit
      );
    });

    it("should use default limit when not provided", async () => {
      const categoryId = "cat-1";
      mockRequest.params = { categoryId };
      mockRequest.query = {};

      const mockScorers: any[] = [];
      mockService.getTopScorersByCategory.mockResolvedValue(mockScorers);

      await controller.getScorersByCategory(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockService.getTopScorersByCategory).toHaveBeenCalledWith(
        categoryId,
        10 // default limit
      );
    });

    it("should return 404 NotFoundError for invalid category", async () => {
      const categoryId = "invalid-cat";
      mockRequest.params = { categoryId };
      mockRequest.query = {};

      const notFoundError = new NotFoundError("Category not found");
      mockService.getTopScorersByCategory.mockRejectedValue(notFoundError);

      await controller.getScorersByCategory(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(notFoundError);
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it("should validate categoryId parameter", async () => {
      mockRequest.params = { categoryId: "" };
      mockRequest.query = {};

      await controller.getScorersByCategory(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it("should reject limit > 100", async () => {
      const categoryId = "cat-1";
      mockRequest.params = { categoryId };
      mockRequest.query = { limit: "150" };

      await controller.getScorersByCategory(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });

  describe("Error handling", () => {
    it("should pass all errors to next middleware", async () => {
      const error = new Error("Unexpected error");
      mockRequest.params = { categoryId: "cat-1" };
      mockService.getPublicMatchesByCategoryForParents.mockRejectedValue(
        error
      );

      await controller.getMatchesByCategory(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
