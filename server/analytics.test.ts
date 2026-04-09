import { describe, expect, it, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("Analytics & Reports Procedures", () => {
  let ctx: TrpcContext;

  beforeAll(() => {
    ctx = createAuthContext();
  });

  describe("analytics.dashboard", () => {
    it("should return dashboard statistics", async () => {
      const caller = appRouter.createCaller(ctx);
      const result = await caller.analytics.dashboard();

      expect(result).toBeDefined();
      expect(result).toHaveProperty("activeReports");
      expect(result).toHaveProperty("resolvedIssues");
      expect(result).toHaveProperty("criticalAlerts");
      expect(result).toHaveProperty("activeUsers");

      expect(typeof result.activeReports).toBe("number");
      expect(typeof result.resolvedIssues).toBe("number");
      expect(typeof result.criticalAlerts).toBe("number");
      expect(typeof result.activeUsers).toBe("number");

      expect(result.activeReports).toBeGreaterThanOrEqual(0);
      expect(result.resolvedIssues).toBeGreaterThanOrEqual(0);
      expect(result.criticalAlerts).toBeGreaterThanOrEqual(0);
      expect(result.activeUsers).toBeGreaterThanOrEqual(0);
    });
  });

  describe("predictions.resolutionTimeForecast", () => {
    it("should return resolution time forecasts", async () => {
      const caller = appRouter.createCaller(ctx);
      const result = await caller.predictions.resolutionTimeForecast({});

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it("should return valid forecast entries", async () => {
      const caller = appRouter.createCaller(ctx);
      const result = await caller.predictions.resolutionTimeForecast({});

      result.forEach((item) => {
        expect(item).toHaveProperty("category");
        expect(item).toHaveProperty("avgDays");
        expect(item).toHaveProperty("confidence");
        expect(typeof item.category).toBe("string");
        expect(typeof item.avgDays).toBe("number");
        expect(typeof item.confidence).toBe("number");
        expect(item.avgDays).toBeGreaterThan(0);
        expect(item.confidence).toBeGreaterThanOrEqual(0);
        expect(item.confidence).toBeLessThanOrEqual(1);
      });
    });

    it("should filter by category when provided", async () => {
      const caller = appRouter.createCaller(ctx);
      const result = await caller.predictions.resolutionTimeForecast({ category: "infrastructure" });

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      result.forEach((item) => {
        expect(item.category).toBe("infrastructure");
      });
    });
  });

  describe("predictions.hotspotPredictions", () => {
    it("should return hotspot predictions", async () => {
      const caller = appRouter.createCaller(ctx);
      const result = await caller.predictions.hotspotPredictions();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("predictions.categoryTrends", () => {
    it("should return category trends", async () => {
      const caller = appRouter.createCaller(ctx);
      const result = await caller.predictions.categoryTrends({ days: 30 });

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("reports.list", () => {
    it("should return reports list", async () => {
      const caller = appRouter.createCaller(ctx);
      const result = await caller.reports.list({});

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("reports.activeCount", () => {
    it("should return active reports count", async () => {
      const caller = appRouter.createCaller(ctx);
      const result = await caller.reports.activeCount();

      expect(result).toBeDefined();
      expect(typeof result).toBe("number");
      expect(result).toBeGreaterThanOrEqual(0);
    });
  });

  describe("reports.resolvedCount", () => {
    it("should return resolved reports count", async () => {
      const caller = appRouter.createCaller(ctx);
      const result = await caller.reports.resolvedCount();

      expect(result).toBeDefined();
      expect(typeof result).toBe("number");
      expect(result).toBeGreaterThanOrEqual(0);
    });
  });

  describe("reports.criticalCount", () => {
    it("should return critical alerts count", async () => {
      const caller = appRouter.createCaller(ctx);
      const result = await caller.reports.criticalCount();

      expect(result).toBeDefined();
      expect(typeof result).toBe("number");
      expect(result).toBeGreaterThanOrEqual(0);
    });
  });

  describe("trends.all", () => {
    it("should return all trends", async () => {
      const caller = appRouter.createCaller(ctx);
      const result = await caller.trends.all({ days: 30 });

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("hotspots.all", () => {
    it("should return all hotspots", async () => {
      const caller = appRouter.createCaller(ctx);
      const result = await caller.hotspots.all();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
