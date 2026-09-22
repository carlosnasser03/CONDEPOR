import { describe, it, expect } from "vitest";
import {
  PublicCategorySchema,
  PublicMatchSchema,
  PublicScorerSchema,
  CategoryIdParamSchema,
} from "../schemas";
import { z } from "zod";

describe("PublicCategorySchema", () => {
  it("should validate correct public category data", () => {
    const validData = {
      id: "cat-1",
      name: "Categoría A",
      color: "#2563eb",
      description: "Primera categoría",
    };

    const result = PublicCategorySchema.parse(validData);

    expect(result).toEqual(validData);
  });

  it("should accept null description", () => {
    const validData = {
      id: "cat-1",
      name: "Categoría A",
      color: "#2563eb",
      description: null,
    };

    const result = PublicCategorySchema.parse(validData);

    expect(result.description).toBeNull();
  });

  it("should accept undefined description", () => {
    const validData = {
      id: "cat-1",
      name: "Categoría A",
      color: "#2563eb",
    };

    const result = PublicCategorySchema.parse(validData);

    expect(result.id).toBe("cat-1");
    expect(result.name).toBe("Categoría A");
  });

  it("should reject missing id", () => {
    const invalidData = {
      name: "Categoría A",
      color: "#2563eb",
      description: "Test",
    };

    expect(() => PublicCategorySchema.parse(invalidData)).toThrow();
  });

  it("should reject missing name", () => {
    const invalidData = {
      id: "cat-1",
      color: "#2563eb",
      description: "Test",
    };

    expect(() => PublicCategorySchema.parse(invalidData)).toThrow();
  });

  it("should reject empty name", () => {
    const invalidData = {
      id: "cat-1",
      name: "",
      color: "#2563eb",
      description: "Test",
    };

    expect(() => PublicCategorySchema.parse(invalidData)).toThrow();
  });

  it("should reject invalid color format", () => {
    const invalidData = {
      id: "cat-1",
      name: "Categoría A",
      color: "not-a-color",
      description: "Test",
    };

    expect(() => PublicCategorySchema.parse(invalidData)).toThrow();
  });

  it("should accept valid hex color formats", () => {
    const validColors = ["#abc", "#abcdef", "#ABC", "#ABCDEF"];

    validColors.forEach((color) => {
      const data = {
        id: "cat-1",
        name: "Test",
        color,
        description: "Test",
      };

      expect(() => PublicCategorySchema.parse(data)).not.toThrow();
    });
  });

  it("should reject description longer than 1000 characters", () => {
    const longDescription = "a".repeat(1001);
    const invalidData = {
      id: "cat-1",
      name: "Categoría A",
      color: "#2563eb",
      description: longDescription,
    };

    expect(() => PublicCategorySchema.parse(invalidData)).toThrow();
  });
});

describe("PublicMatchSchema", () => {
  const validMatch = {
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
    date: new Date("2025-08-01"),
    venue: "Estadio Municipal",
    status: "finished" as const,
    homeGoals: 2,
    awayGoals: 1,
  };

  it("should validate correct public match data", () => {
    const result = PublicMatchSchema.parse(validMatch);

    expect(result.id).toBe("match-1");
    expect(result.homeTeamId).toBe("team-1");
    expect(result.status).toBe("finished");
  });

  it("should accept null goals", () => {
    const data = {
      ...validMatch,
      homeGoals: null,
      awayGoals: null,
    };

    const result = PublicMatchSchema.parse(data);

    expect(result.homeGoals).toBeNull();
    expect(result.awayGoals).toBeNull();
  });

  it("should accept null crestUrl", () => {
    const data = {
      ...validMatch,
      homeTeam: { name: "Equipo A", crestUrl: null },
      awayTeam: { name: "Equipo B", crestUrl: null },
    };

    const result = PublicMatchSchema.parse(data);

    expect(result.homeTeam.crestUrl).toBeNull();
    expect(result.awayTeam.crestUrl).toBeNull();
  });

  it("should reject invalid status", () => {
    const data = {
      ...validMatch,
      status: "invalid_status" as any,
    };

    expect(() => PublicMatchSchema.parse(data)).toThrow();
  });

  it("should reject negative goals", () => {
    const data = {
      ...validMatch,
      homeGoals: -1,
    };

    expect(() => PublicMatchSchema.parse(data)).toThrow();
  });

  it("should accept valid status values", () => {
    const statuses = ["scheduled", "in_progress", "finished"];

    statuses.forEach((status) => {
      const data = {
        ...validMatch,
        status: status as any,
      };

      expect(() => PublicMatchSchema.parse(data)).not.toThrow();
    });
  });

  it("should reject invalid crestUrl", () => {
    const data = {
      ...validMatch,
      homeTeam: { name: "Equipo A", crestUrl: "not-a-url" },
    };

    expect(() => PublicMatchSchema.parse(data)).toThrow();
  });
});

describe("PublicScorerSchema", () => {
  const validScorer = {
    position: 1,
    playerName: "Juan Pérez",
    teamName: "Equipo A",
    goals: 15,
  };

  it("should validate correct public scorer data", () => {
    const result = PublicScorerSchema.parse(validScorer);

    expect(result).toEqual(validScorer);
  });

  it("should reject position less than 1", () => {
    const data = {
      ...validScorer,
      position: 0,
    };

    expect(() => PublicScorerSchema.parse(data)).toThrow();
  });

  it("should reject negative goals", () => {
    const data = {
      ...validScorer,
      goals: -1,
    };

    expect(() => PublicScorerSchema.parse(data)).toThrow();
  });

  it("should reject empty playerName", () => {
    const data = {
      ...validScorer,
      playerName: "",
    };

    expect(() => PublicScorerSchema.parse(data)).toThrow();
  });

  it("should reject empty teamName", () => {
    const data = {
      ...validScorer,
      teamName: "",
    };

    expect(() => PublicScorerSchema.parse(data)).toThrow();
  });

  it("should accept zero goals", () => {
    const data = {
      ...validScorer,
      goals: 0,
    };

    const result = PublicScorerSchema.parse(data);

    expect(result.goals).toBe(0);
  });
});

describe("CategoryIdParamSchema", () => {
  it("should validate correct categoryId", () => {
    const validIds = [
      "cat-1",
      "category_123",
      "ABC-DEF",
      "cat1cat",
      "a".repeat(50), // Max length
    ];

    validIds.forEach((id) => {
      const result = CategoryIdParamSchema.parse({ categoryId: id });
      expect(result.categoryId).toBe(id);
    });
  });

  it("should reject empty categoryId", () => {
    expect(() =>
      CategoryIdParamSchema.parse({ categoryId: "" })
    ).toThrow();
  });

  it("should reject categoryId shorter than 3 characters", () => {
    const invalidIds = ["a", "ab", "c"];

    invalidIds.forEach((id) => {
      expect(() =>
        CategoryIdParamSchema.parse({ categoryId: id })
      ).toThrow();
    });
  });

  it("should reject categoryId longer than 50 characters", () => {
    const longId = "a".repeat(51);

    expect(() =>
      CategoryIdParamSchema.parse({ categoryId: longId })
    ).toThrow();
  });

  it("should reject non-alphanumeric characters (except - and _)", () => {
    const invalidIds = ["cat@1", "cat!id", "cat.name", "cat id", "cat#1"];

    invalidIds.forEach((id) => {
      expect(() =>
        CategoryIdParamSchema.parse({ categoryId: id })
      ).toThrow();
    });
  });

  it("should accept hyphens and underscores", () => {
    const validIds = ["cat-1", "category_2", "CAT_-_123"];

    validIds.forEach((id) => {
      expect(() =>
        CategoryIdParamSchema.parse({ categoryId: id })
      ).not.toThrow();
    });
  });

  it("should reject missing categoryId", () => {
    expect(() => CategoryIdParamSchema.parse({})).toThrow();
  });
});
