"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { LeadStatus, QuoteStatus } from "@prisma/client";
import type { Lead } from "@/features/dashboard/types";

// ─── Input schema ─────────────────────────────────────────────────────────────

const GetLeadsInputSchema = z.object({
  tenant: z.string().min(1).max(100),
  filters: z
    .object({
      search: z.string().optional(),
      status: z.enum(["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "LOST", "all"]).optional(),
      from: z.coerce.date().optional(),
      to: z.coerce.date().optional(),
      sortBy: z.enum(["date", "value", "name"]).optional(),
      sortOrder: z.enum(["asc", "desc"]).optional(),
    })
    .optional(),
  pagination: z
    .object({
      page: z.number().int().min(1).default(1),
      pageSize: z.number().int().min(1).max(100).default(20),
    })
    .optional(),
});

export type GetLeadsInput = z.infer<typeof GetLeadsInputSchema>;

export type GetLeadsResult =
  | {
      ok: true;
      leads: Lead[];
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
    }
  | {
      ok: false;
      error: string;
      code: "VALIDATION_ERROR" | "PROVIDER_NOT_FOUND" | "DB_ERROR";
    };

// ─── Action ───────────────────────────────────────────────────────────────────

export async function getLeads(rawInput: GetLeadsInput): Promise<GetLeadsResult> {
  const parsed = GetLeadsInputSchema.safeParse(rawInput);

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.errors[0]?.message ?? "Datos inválidos",
      code: "VALIDATION_ERROR",
    };
  }

  const { tenant, filters = {}, pagination = { page: 1, pageSize: 20 } } = parsed.data;

  // 1. Resolve provider
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

  // 2. Build where clause
  // Lead → Quote → Provider. Filter at the Quote level using nested where.
  const statusFilter =
    filters.status && filters.status !== "all"
      ? { status: filters.status as LeadStatus }
      : {};

  const searchFilter = filters.search
    ? {
        quote: {
          OR: [
            { customerName: { contains: filters.search, mode: "insensitive" as const } },
            { customerEmail: { contains: filters.search, mode: "insensitive" as const } },
          ],
        },
      }
    : {};

  const dateFilter =
    filters.from || filters.to
      ? {
          createdAt: {
            ...(filters.from ? { gte: filters.from } : {}),
            ...(filters.to ? { lte: filters.to } : {}),
          },
        }
      : {};

  const where = {
    quote: { providerId: provider.id },
    ...statusFilter,
    ...searchFilter,
    ...dateFilter,
  };

  // 3. Build orderBy
  const orderBy = buildOrderBy(filters.sortBy, filters.sortOrder);

  // 4. Count + paginated fetch in parallel
  const skip = (pagination.page - 1) * pagination.pageSize;

  try {
    const [total, rows] = await Promise.all([
      prisma.lead.count({ where }),
      prisma.lead.findMany({
        where,
        orderBy,
        skip,
        take: pagination.pageSize,
        include: {
          quote: {
            select: {
              customerName: true,
              customerEmail: true,
              customerPhone: true,
              result: true,
            },
          },
        },
      }),
    ]);

    // 5. Map DB rows → dashboard Lead type
    const leads: Lead[] = rows.map((row) => {
      // result is stored as JSON — extract system size and quote value
      const result = row.quote.result as Record<string, any>;
      const systemSize: number = result?.system?.power ?? 0;
      const quoteValue: number = result?.costs?.total ?? 0;

      return {
        id: row.id,
        quoteId: row.quoteId,
        customerName: row.quote.customerName,
        customerEmail: row.quote.customerEmail,
        customerPhone: row.quote.customerPhone ?? null,
        systemSize,
        quoteValue,
        status: row.status,
        notes: row.notes ?? null,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      };
    });

    return {
      ok: true,
      leads,
      total,
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalPages: Math.ceil(total / pagination.pageSize),
    };
  } catch (err) {
    console.error("[getLeads] DB error:", err);
    return {
      ok: false,
      error: "Error al obtener los leads",
      code: "DB_ERROR",
    };
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildOrderBy(
  sortBy?: string,
  sortOrder?: string,
): Record<string, any> | Record<string, any>[] {
  const dir = sortOrder === "asc" ? "asc" : "desc";

  switch (sortBy) {
    case "name":
      // Sort by customerName on the related Quote
      return { quote: { customerName: dir } };
    case "value":
      // Can't sort by a JSON field in Prisma directly — sort by createdAt as fallback
      // and handle client-side sorting for value if needed
      return { createdAt: dir };
    case "date":
    default:
      return { createdAt: dir };
  }
}