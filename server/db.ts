import { eq, desc, and, gte, lte, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, civicReports, predictions, analyticsSummary, dailyTrends, hotspots, reportUpdates, streetLights, reportPhotos, InsertCivicReport } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ========== Civic Reports Queries ==========

export async function getAllReports(limit = 100, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(civicReports)
    .orderBy(desc(civicReports.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getReportsByCategory(category: string, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(civicReports)
    .where(eq(civicReports.category, category as any))
    .orderBy(desc(civicReports.createdAt))
    .limit(limit);
}

export async function getReportsByStatus(status: string, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(civicReports)
    .where(eq(civicReports.status, status as any))
    .orderBy(desc(civicReports.createdAt))
    .limit(limit);
}

export async function getReportById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select()
    .from(civicReports)
    .where(eq(civicReports.id, id))
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

export async function getReportsByDateRange(startDate: Date, endDate: Date) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(civicReports)
    .where(and(
      gte(civicReports.createdAt, startDate),
      lte(civicReports.createdAt, endDate)
    ))
    .orderBy(desc(civicReports.createdAt));
}

export async function getActiveReportsCount() {
  const db = await getDb();
  if (!db) return 0;
  
  const result = await db.select({ count: sql<number>`COUNT(*)` })
    .from(civicReports)
    .where(eq(civicReports.status, 'open'));
  
  return result[0]?.count || 0;
}

export async function getResolvedReportsCount() {
  const db = await getDb();
  if (!db) return 0;
  
  const result = await db.select({ count: sql<number>`COUNT(*)` })
    .from(civicReports)
    .where(eq(civicReports.status, 'resolved'));
  
  return result[0]?.count || 0;
}

export async function getCriticalAlertsCount() {
  const db = await getDb();
  if (!db) return 0;
  
  const result = await db.select({ count: sql<number>`COUNT(*)` })
    .from(civicReports)
    .where(and(
      eq(civicReports.priority, 'critical' as any),
      eq(civicReports.status, 'open' as any)
    ));
  
  return result[0]?.count || 0;
}

// ========== Report Updates/Timeline ==========

export async function getReportUpdates(reportId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(reportUpdates)
    .where(eq(reportUpdates.reportId, reportId))
    .orderBy(desc(reportUpdates.createdAt));
}

export async function addReportUpdate(reportId: number, status: string, description: string) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.insert(reportUpdates).values({
    reportId,
    status: status as any,
    description,
  });
  
  return result;
}

// ========== Predictions Queries ==========

export async function getPredictionsByType(predictionType: string, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(predictions)
    .where(eq(predictions.predictionType, predictionType as any))
    .orderBy(desc(predictions.createdAt))
    .limit(limit);
}

export async function getPredictionsByCategory(category: string) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(predictions)
    .where(eq(predictions.category, category as any))
    .orderBy(desc(predictions.createdAt));
}

// ========== Analytics Queries ==========

export async function getLatestAnalyticsSummary() {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select()
    .from(analyticsSummary)
    .orderBy(desc(analyticsSummary.date))
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

export async function getAnalyticsByDateRange(startDate: Date, endDate: Date) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(analyticsSummary)
    .where(and(
      gte(analyticsSummary.date, startDate),
      lte(analyticsSummary.date, endDate)
    ))
    .orderBy(desc(analyticsSummary.date));
}

// ========== Daily Trends Queries ==========

export async function getDailyTrendsByCategory(category: string, days = 30) {
  const db = await getDb();
  if (!db) return [];
  
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return db.select()
    .from(dailyTrends)
    .where(and(
      eq(dailyTrends.category, category),
      gte(dailyTrends.date, startDate)
    ))
    .orderBy(desc(dailyTrends.date));
}

export async function getAllDailyTrends(days = 30) {
  const db = await getDb();
  if (!db) return [];
  
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return db.select()
    .from(dailyTrends)
    .where(gte(dailyTrends.date, startDate))
    .orderBy(desc(dailyTrends.date));
}

// ========== Hotspots Queries ==========

export async function getAllHotspots() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(hotspots)
    .orderBy(desc(hotspots.intensity));
}

export async function getHotspotsByCategory(category: string) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(hotspots)
    .where(eq(hotspots.category, category))
    .orderBy(desc(hotspots.intensity));
}

export async function getHotspotsByWard(ward: string) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(hotspots)
    .where(eq(hotspots.ward, ward))
    .orderBy(desc(hotspots.intensity));
}

// ========== Street Lights Queries ==========

export async function getAllStreetLights() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(streetLights)
    .orderBy(desc(streetLights.createdAt));
}

export async function getStreetLightsByStatus(status: string) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(streetLights)
    .where(eq(streetLights.status, status as any))
    .orderBy(desc(streetLights.createdAt));
}

export async function updateStreetLightStatus(lightId: number, status: string) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.update(streetLights)
    .set({ status: status as any, updatedAt: new Date() })
    .where(eq(streetLights.id, lightId));
  
  return result;
}

// ========== Report Photos Queries ==========

export async function getReportPhotos(reportId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(reportPhotos)
    .where(eq(reportPhotos.reportId, reportId))
    .orderBy(desc(reportPhotos.uploadedAt));
}

export async function addReportPhoto(reportId: number, photoUrl: string, caption?: string) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.insert(reportPhotos).values({
    reportId,
    photoUrl,
    caption,
  });
  
  return result;
}

// ========== Report Creation & Updates ==========

export async function createReport(data: InsertCivicReport) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.insert(civicReports).values(data);
  return result;
}

export async function updateReportStatus(reportId: number, status: string) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.update(civicReports)
    .set({ status: status as any, updatedAt: new Date() })
    .where(eq(civicReports.id, reportId));
  
  return result;
}

export async function upvoteReport(reportId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const report = await getReportById(reportId);
  if (!report) return null;
  
  const result = await db.update(civicReports)
    .set({ votes: (report.votes || 0) + 1, updatedAt: new Date() })
    .where(eq(civicReports.id, reportId));
  
  return result;
}

export async function getReportsWithFilters(
  category?: string,
  status?: string,
  startDate?: Date,
  endDate?: Date,
  limit = 50
) {
  const db = await getDb();
  if (!db) return [];
  
  const conditions: any[] = [];
  
  if (category) conditions.push(eq(civicReports.category, category as any));
  if (status) conditions.push(eq(civicReports.status, status as any));
  if (startDate) conditions.push(gte(civicReports.createdAt, startDate));
  if (endDate) conditions.push(lte(civicReports.createdAt, endDate));
  
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
  
  return db.select()
    .from(civicReports)
    .where(whereClause)
    .orderBy(desc(civicReports.createdAt))
    .limit(limit);
}
