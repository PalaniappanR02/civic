import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, json, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Civic Reports Table - Stores all reported civic issues
 */
export const civicReports = mysqlTable("civic_reports", {
  id: int("id").autoincrement().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  category: mysqlEnum("category", [
    "infrastructure",
    "utilities",
    "environment",
    "safety",
    "sanitation",
    "transport",
    "other"
  ]).notNull(),
  priority: mysqlEnum("priority", ["low", "medium", "high", "critical"]).notNull(),
  status: mysqlEnum("status", ["open", "in-progress", "resolved", "closed"]).default("open").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  ward: varchar("ward", { length: 100 }),
  votes: int("votes").default(0),
  userId: int("userId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  resolvedAt: timestamp("resolvedAt"),
});

export type CivicReport = typeof civicReports.$inferSelect;
export type InsertCivicReport = typeof civicReports.$inferInsert;

/**
 * Report Updates/Timeline Table - Tracks status changes and updates
 */
export const reportUpdates = mysqlTable("report_updates", {
  id: int("id").autoincrement().primaryKey(),
  reportId: int("reportId").notNull(),
  status: mysqlEnum("status", ["open", "in-progress", "resolved", "closed"]).notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ReportUpdate = typeof reportUpdates.$inferSelect;
export type InsertReportUpdate = typeof reportUpdates.$inferInsert;

/**
 * ML Predictions Table - Stores ML model predictions
 */
export const predictions = mysqlTable("predictions", {
  id: int("id").autoincrement().primaryKey(),
  reportId: int("reportId"),
  predictionType: mysqlEnum("predictionType", [
    "resolution_time",
    "hotspot",
    "category_trend",
    "priority_forecast"
  ]).notNull(),
  category: varchar("category", { length: 100 }),
  ward: varchar("ward", { length: 100 }),
  predictedValue: decimal("predictedValue", { precision: 10, scale: 2 }),
  confidence: decimal("confidence", { precision: 5, scale: 4 }),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt"),
});

export type Prediction = typeof predictions.$inferSelect;
export type InsertPrediction = typeof predictions.$inferInsert;

/**
 * Analytics Summary Table - Pre-computed analytics for performance
 */
export const analyticsSummary = mysqlTable("analytics_summary", {
  id: int("id").autoincrement().primaryKey(),
  date: timestamp("date").notNull(),
  totalReports: int("totalReports").default(0),
  resolvedReports: int("resolvedReports").default(0),
  activeReports: int("activeReports").default(0),
  criticalAlerts: int("criticalAlerts").default(0),
  activeUsers: int("activeUsers").default(0),
  averageResolutionTime: decimal("averageResolutionTime", { precision: 10, scale: 2 }),
  categoryBreakdown: json("categoryBreakdown"),
  priorityBreakdown: json("priorityBreakdown"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AnalyticsSummary = typeof analyticsSummary.$inferSelect;
export type InsertAnalyticsSummary = typeof analyticsSummary.$inferInsert;

/**
 * Daily Trends Table - Historical trend data for charting
 */
export const dailyTrends = mysqlTable("daily_trends", {
  id: int("id").autoincrement().primaryKey(),
  date: timestamp("date").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  reportCount: int("reportCount").default(0),
  resolvedCount: int("resolvedCount").default(0),
  averagePriority: decimal("averagePriority", { precision: 3, scale: 2 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DailyTrend = typeof dailyTrends.$inferSelect;
export type InsertDailyTrend = typeof dailyTrends.$inferInsert;

/**
 * Hotspot Analysis Table - Geographic hotspot data
 */
export const hotspots = mysqlTable("hotspots", {
  id: int("id").autoincrement().primaryKey(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  ward: varchar("ward", { length: 100 }),
  intensity: decimal("intensity", { precision: 5, scale: 2 }),
  reportCount: int("reportCount").default(0),
  category: varchar("category", { length: 100 }),
  lastUpdated: timestamp("lastUpdated").defaultNow().onUpdateNow(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Hotspot = typeof hotspots.$inferSelect;
export type InsertHotspot = typeof hotspots.$inferInsert;

/**
 * Street Lights Table - Stores street light locations and status
 */
export const streetLights = mysqlTable("street_lights", {
  id: int("id").autoincrement().primaryKey(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  status: mysqlEnum("status", ["on", "off", "faulty"]).default("on").notNull(),
  ward: varchar("ward", { length: 100 }),
  lastChecked: timestamp("lastChecked").defaultNow(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type StreetLight = typeof streetLights.$inferSelect;
export type InsertStreetLight = typeof streetLights.$inferInsert;

/**
 * Report Photos Table - Stores photo URLs and metadata for reports
 */
export const reportPhotos = mysqlTable("report_photos", {
  id: int("id").autoincrement().primaryKey(),
  reportId: int("reportId").notNull(),
  photoUrl: text("photoUrl").notNull(),
  caption: text("caption"),
  uploadedAt: timestamp("uploadedAt").defaultNow().notNull(),
});

export type ReportPhoto = typeof reportPhotos.$inferSelect;
export type InsertReportPhoto = typeof reportPhotos.$inferInsert;
