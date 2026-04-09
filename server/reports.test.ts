import { describe, expect, it } from "vitest";
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
    res: {} as TrpcContext["res"],
  };
}

describe("Reports Router", () => {
  it("should list reports", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.reports.list({
      limit: 10,
      offset: 0,
    });

    expect(Array.isArray(result)).toBe(true);
  });

  it("should filter reports by category", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.reports.withFilters({
      category: "infrastructure",
      limit: 10,
    });

    expect(Array.isArray(result)).toBe(true);
    if (result.length > 0) {
      expect(result[0].category).toBe("infrastructure");
    }
  });

  it("should filter reports by status", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.reports.withFilters({
      status: "open",
      limit: 10,
    });

    expect(Array.isArray(result)).toBe(true);
    if (result.length > 0) {
      expect(result[0].status).toBe("open");
    }
  });
});

describe("Street Lights Router", () => {
  it("should list street lights", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.streetLights.list();

    expect(Array.isArray(result)).toBe(true);
  });

  it("should filter lights by status", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.streetLights.byStatus("on");

    expect(Array.isArray(result)).toBe(true);
    if (result.length > 0) {
      expect(result[0].status).toBe("on");
    }
  });
});

describe("Authentication", () => {
  it("should provide authenticated user context", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const user = await caller.auth.me();

    expect(user).toBeDefined();
    expect(user?.id).toBe(1);
    expect(user?.email).toBe("test@example.com");
  });

  it("should handle logout", async () => {
    const ctx = createAuthContext();
    const clearedCookies: Array<{ name: string; options: Record<string, unknown> }> = [];

    const modifiedCtx: TrpcContext = {
      ...ctx,
      res: {
        clearCookie: (name: string, options: Record<string, unknown>) => {
          clearedCookies.push({ name, options });
        },
      } as TrpcContext["res"],
    };

    const caller = appRouter.createCaller(modifiedCtx);
    const result = await caller.auth.logout();

    expect(result.success).toBe(true);
  });
});
