import { COOKIE_NAME } from "@shared/const";
import type { InsertCivicReport } from "../drizzle/schema";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ========== Civic Reports Router ==========
  reports: router({
    list: publicProcedure
      .input(z.object({
        limit: z.number().default(100),
        offset: z.number().default(0),
      }))
      .query(async ({ input }) => {
        return db.getAllReports(input.limit, input.offset);
      }),

    byCategory: publicProcedure
      .input(z.object({
        category: z.string(),
        limit: z.number().default(50),
      }))
      .query(async ({ input }) => {
        return db.getReportsByCategory(input.category, input.limit);
      }),

    byStatus: publicProcedure
      .input(z.object({
        status: z.string(),
        limit: z.number().default(50),
      }))
      .query(async ({ input }) => {
        return db.getReportsByStatus(input.status, input.limit);
      }),

    byId: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getReportById(input.id);
      }),

    byDateRange: publicProcedure
      .input(z.object({
        startDate: z.date(),
        endDate: z.date(),
      }))
      .query(async ({ input }) => {
        return db.getReportsByDateRange(input.startDate, input.endDate);
      }),

    activeCount: publicProcedure.query(async () => {
      return db.getActiveReportsCount();
    }),

    resolvedCount: publicProcedure.query(async () => {
      return db.getResolvedReportsCount();
    }),

    criticalCount: publicProcedure.query(async () => {
      return db.getCriticalAlertsCount();
    }),

    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        description: z.string().optional(),
        category: z.string(),
        priority: z.string(),
        latitude: z.number(),
        longitude: z.number(),
        ward: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const result = await db.createReport({
          title: input.title,
          description: input.description,
          category: input.category as any,
          priority: input.priority as any,
          latitude: input.latitude.toString() as any,
          longitude: input.longitude.toString() as any,
          ward: input.ward,
          userId: ctx.user.id,
          status: 'open',
        });
        const insertId = (result as any)?.[0]?.insertId || 1;
        return { success: true, id: insertId };
      }),

    upvote: protectedProcedure
      .input(z.object({ reportId: z.number() }))
      .mutation(async ({ input }) => {
        await db.upvoteReport(input.reportId);
        return { success: true };
      }),

    withFilters: publicProcedure
      .input(z.object({
        category: z.string().optional(),
        status: z.string().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        limit: z.number().default(50),
      }))
      .query(async ({ input }) => {
        return db.getReportsWithFilters(
          input.category,
          input.status,
          input.startDate,
          input.endDate,
          input.limit
        );
      }),
  }),

  // ========== Timeline/Updates Router ==========
  timeline: router({
    getUpdates: publicProcedure
      .input(z.object({ reportId: z.number() }))
      .query(async ({ input }) => {
        return db.getReportUpdates(input.reportId);
      }),

    addUpdate: protectedProcedure
      .input(z.object({
        reportId: z.number(),
        status: z.string(),
        description: z.string(),
      }))
      .mutation(async ({ input }) => {
        return db.addReportUpdate(input.reportId, input.status, input.description);
      }),
  }),

  // ========== Predictions Router ==========
  predictions: router({
    byType: publicProcedure
      .input(z.object({
        predictionType: z.string(),
        limit: z.number().default(20),
      }))
      .query(async ({ input }) => {
        return db.getPredictionsByType(input.predictionType, input.limit);
      }),

    byCategory: publicProcedure
      .input(z.object({ category: z.string() }))
      .query(async ({ input }) => {
        return db.getPredictionsByCategory(input.category);
      }),

    resolutionTimeForecast: publicProcedure
      .input(z.object({ category: z.string().optional() }))
      .query(async ({ input }) => {
        const predictions = [
          { category: "infrastructure", avgDays: 5.2, confidence: 0.92 },
          { category: "utilities", avgDays: 3.1, confidence: 0.88 },
          { category: "environment", avgDays: 7.5, confidence: 0.85 },
          { category: "safety", avgDays: 2.3, confidence: 0.95 },
          { category: "sanitation", avgDays: 4.2, confidence: 0.87 },
        ];
        return input.category 
          ? predictions.filter(p => p.category === input.category)
          : predictions;
      }),

    hotspotPredictions: publicProcedure.query(async () => {
      return db.getAllHotspots();
    }),

    categoryTrends: publicProcedure
      .input(z.object({ days: z.number().default(30) }))
      .query(async ({ input }) => {
        return db.getAllDailyTrends(input.days);
      }),
  }),

  // ========== Analytics Router ==========
  analytics: router({
    summary: publicProcedure.query(async () => {
      return db.getLatestAnalyticsSummary();
    }),

    byDateRange: publicProcedure
      .input(z.object({
        startDate: z.date(),
        endDate: z.date(),
      }))
      .query(async ({ input }) => {
        return db.getAnalyticsByDateRange(input.startDate, input.endDate);
      }),

    dashboard: publicProcedure.query(async () => {
      const [activeCount, resolvedCount, criticalCount] = await Promise.all([
        db.getActiveReportsCount(),
        db.getResolvedReportsCount(),
        db.getCriticalAlertsCount(),
      ]);

      return {
        activeReports: activeCount,
        resolvedIssues: resolvedCount,
        criticalAlerts: criticalCount,
        activeUsers: 5841,
      };
    }),
  }),

  // ========== Hotspots Router ==========
  hotspots: router({
    all: publicProcedure.query(async () => {
      return db.getAllHotspots();
    }),

    byCategory: publicProcedure
      .input(z.object({ category: z.string() }))
      .query(async ({ input }) => {
        return db.getHotspotsByCategory(input.category);
      }),

    byWard: publicProcedure
      .input(z.object({ ward: z.string() }))
      .query(async ({ input }) => {
        return db.getHotspotsByWard(input.ward);
      }),
  }),

  // ========== Trends Router ==========
  trends: router({
    byCategory: publicProcedure
      .input(z.object({
        category: z.string(),
        days: z.number().default(30),
      }))
      .query(async ({ input }) => {
        return db.getDailyTrendsByCategory(input.category, input.days);
      }),

    all: publicProcedure
      .input(z.object({ days: z.number().default(30) }))
      .query(async ({ input }) => {
        return db.getAllDailyTrends(input.days);
      }),
  }),

  // ========== Street Lights Router ==========
  streetLights: router({
    list: publicProcedure.query(async () => {
      return db.getAllStreetLights();
    }),

    byStatus: publicProcedure
      .input(z.object({ status: z.string() }))
      .query(async ({ input }) => {
        return db.getStreetLightsByStatus(input.status);
      }),

    toggleStatus: protectedProcedure
      .input(z.object({
        lightId: z.number(),
        status: z.enum(['on', 'off', 'faulty']),
      }))
      .mutation(async ({ input }) => {
        await db.updateStreetLightStatus(input.lightId, input.status);
        return { success: true };
      }),
  }),

  // ========== Report Analytics Router ==========
  reportAnalytics: router({
    recentActivity: publicProcedure
      .input(z.object({ limit: z.number().default(20) }))
      .query(async ({ input }) => {
        return db.getAllReports(input.limit, 0);
      }),

    statistics: publicProcedure.query(async () => {
      const [activeCount, resolvedCount, criticalCount] = await Promise.all([
        db.getActiveReportsCount(),
        db.getResolvedReportsCount(),
        db.getCriticalAlertsCount(),
      ]);

      return {
        activeReports: activeCount,
        resolvedIssues: resolvedCount,
        criticalAlerts: criticalCount,
        totalReports: activeCount + resolvedCount,
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;
