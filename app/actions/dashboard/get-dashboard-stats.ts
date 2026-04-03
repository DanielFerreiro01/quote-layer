"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { QuoteStatus, LeadStatus } from "@prisma/client";
import type { DashboardStats } from "@/features/dashboard/types";

// ─── Input schema ─────────────────────────────────────────────────────────────

const GetDashboardStatsInputSchema = z.object({
  tenant: z.string().min(1).max(100),
});

export type GetDashboardStatsInput = z.infer<typeof GetDashboardStatsInputSchema>;

export type GetDashboardStatsResult =
  | { ok: true; stats: DashboardStats }
  | {
      ok: false;
      error: string;
      code: "VALIDATION_ERROR" | "PROVIDER_NOT_FOUND" | "DB_ERROR";
    };

// ─── Constants ────────────────────────────────────────────────────────────────

const ACTIVE_LEAD_STATUSES: LeadStatus[] = [
  LeadStatus.NEW,
  LeadStatus.CONTACTED,
  LeadStatus.QUALIFIED,
];

// ─── Action ───────────────────────────────────────────────────────────────────

export async function getDashboardStats(
  rawInput: GetDashboardStatsInput,
): Promise<GetDashboardStatsResult> {
  const parsed = GetDashboardStatsInputSchema.safeParse(rawInput);

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.errors[0]?.message ?? "Datos inválidos",
      code: "VALIDATION_ERROR",
    };
  }

  const { tenant } = parsed.data;

  const provider = await prisma.provider.findUnique({
    where: { slug: tenant },
    select: { id: true },
  });

  if (!provider) {
    return {
      ok: false,
      error: `Provider '${tenant}' no encontrado`,
      code: "PROVIDER_NOT_FOUND",
    };
  }

  const providerId = provider.id;

  // ── Date windows ─────────────────────────────────────────────────────────────
  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

  try {
    // Run all queries in parallel for a single round-trip
    const [
      totalQuotesThisMonth,
      totalQuotesLastMonth,
      activeLeadsThisMonth,
      activeLeadsLastMonth,
      allQuotesThisMonth,
      allQuotesLastMonth,
      convertedLeadsThisMonth,
      convertedLeadsLastMonth,
      totalLeadsThisMonth,
      totalLeadsLastMonth,
    ] = await Promise.all([
      // 1. Total quotes this month
      prisma.quote.count({
        where: { providerId, createdAt: { gte: startOfThisMonth } },
      }),

      // 2. Total quotes last month
      prisma.quote.count({
        where: {
          providerId,
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
        },
      }),

      // 3. Active leads this month
      prisma.lead.count({
        where: {
          status: { in: ACTIVE_LEAD_STATUSES },
          quote: { providerId },
          createdAt: { gte: startOfThisMonth },
        },
      }),

      // 4. Active leads last month
      prisma.lead.count({
        where: {
          status: { in: ACTIVE_LEAD_STATUSES },
          quote: { providerId },
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
        },
      }),

      // 5. All quotes this month (to compute avg value from JSON result)
      prisma.quote.findMany({
        where: { providerId, createdAt: { gte: startOfThisMonth } },
        select: { result: true },
      }),

      // 6. All quotes last month (for avg value comparison)
      prisma.quote.findMany({
        where: {
          providerId,
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
        },
        select: { result: true },
      }),

      // 7. Converted leads this month
      prisma.lead.count({
        where: {
          status: LeadStatus.CONVERTED,
          quote: { providerId },
          createdAt: { gte: startOfThisMonth },
        },
      }),

      // 8. Converted leads last month
      prisma.lead.count({
        where: {
          status: LeadStatus.CONVERTED,
          quote: { providerId },
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
        },
      }),

      // 9. Total leads this month (for conversion rate denominator)
      prisma.lead.count({
        where: {
          quote: { providerId },
          createdAt: { gte: startOfThisMonth },
        },
      }),

      // 10. Total leads last month
      prisma.lead.count({
        where: {
          quote: { providerId },
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
        },
      }),
    ]);

    // ── Compute avg quote value from JSON result field ──────────────────────────
    const avgValue = (quotes: { result: unknown }[]) => {
      if (quotes.length === 0) return 0;
      const sum = quotes.reduce((acc, q) => {
        const total = (q.result as Record<string, any>)?.costs?.total ?? 0;
        return acc + (typeof total === "number" ? total : 0);
      }, 0);
      return Math.round(sum / quotes.length);
    };

    const avgQuoteValueThisMonth = avgValue(allQuotesThisMonth);
    const avgQuoteValueLastMonth = avgValue(allQuotesLastMonth);

    // ── Conversion rate ────────────────────────────────────────────────────────
    const conversionRate = (converted: number, total: number) =>
      total === 0 ? 0 : Math.round((converted / total) * 1000) / 10; // one decimal

    const conversionRateThisMonth = conversionRate(
      convertedLeadsThisMonth,
      totalLeadsThisMonth,
    );
    const conversionRateLastMonth = conversionRate(
      convertedLeadsLastMonth,
      totalLeadsLastMonth,
    );

    // ── % change helper ────────────────────────────────────────────────────────
    const pctChange = (current: number, previous: number): number => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 1000) / 10;
    };

    const stats: DashboardStats = {
      totalQuotes: {
        value: totalQuotesThisMonth,
        change: pctChange(totalQuotesThisMonth, totalQuotesLastMonth),
        trend: totalQuotesThisMonth >= totalQuotesLastMonth ? "up" : "down",
      },
      activeLeads: {
        value: activeLeadsThisMonth,
        change: pctChange(activeLeadsThisMonth, activeLeadsLastMonth),
        trend: activeLeadsThisMonth >= activeLeadsLastMonth ? "up" : "down",
      },
      avgQuoteValue: {
        value: avgQuoteValueThisMonth,
        change: pctChange(avgQuoteValueThisMonth, avgQuoteValueLastMonth),
        trend: avgQuoteValueThisMonth >= avgQuoteValueLastMonth ? "up" : "down",
      },
      conversionRate: {
        value: conversionRateThisMonth,
        change: pctChange(conversionRateThisMonth, conversionRateLastMonth),
        trend: conversionRateThisMonth >= conversionRateLastMonth ? "up" : "down",
      },
    };

    return { ok: true, stats };
  } catch (err) {
    console.error("[getDashboardStats] DB error:", err);
    return {
      ok: false,
      error: "Error al obtener las estadísticas",
      code: "DB_ERROR",
    };
  }
}