"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { FormDataSchema } from "@/lib/solar/solar-types";
import { QuoteType, QuoteStatus, LeadStatus } from "@prisma/client";
import type { SolarCalculation } from "@/lib/solar/solar-types";

// ─── Input schema ────────────────────────────────────────────────────────────

const SaveQuoteInputSchema = z.object({
  /** Provider slug, e.g. "solar-demo" */
  tenant: z.string().min(1).max(100),
  /** Raw form data — validated again server-side */
  formData: FormDataSchema,
});

// calculation is typed directly as SolarCalculation — Zod can't validate its
// full shape without duplicating the entire type, and it's already produced
// by calculateSolarQuote which validates on the way out.
export type SaveQuoteInput = z.infer<typeof SaveQuoteInputSchema> & {
  calculation: SolarCalculation;
};

// ─── Output types ────────────────────────────────────────────────────────────

export type SaveQuoteSuccess = {
  ok: true;
  quoteId: string;
  leadId: string;
};

export type SaveQuoteError = {
  ok: false;
  error: string;
  code:
    | "VALIDATION_ERROR"
    | "PROVIDER_NOT_FOUND"
    | "CONFIG_NOT_FOUND"
    | "DUPLICATE_QUOTE"
    | "DB_ERROR";
};

export type SaveQuoteResult = SaveQuoteSuccess | SaveQuoteError;

// ─── Constants ───────────────────────────────────────────────────────────────

/** Quote expiry window in days */
const QUOTE_EXPIRY_DAYS = 30;

/**
 * Deduplication window: if the same email already has a PENDING quote
 * for this provider within this window, return the existing one instead
 * of creating a duplicate.
 */
const DEDUP_WINDOW_HOURS = 1;

// ─── Action ──────────────────────────────────────────────────────────────────

export async function saveQuote(
  rawInput: SaveQuoteInput,
): Promise<SaveQuoteResult> {
  // 1. Validate the Zod-parseable fields (tenant + formData)
  const parsed = SaveQuoteInputSchema.safeParse(rawInput);

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.errors[0]?.message ?? "Datos inválidos",
      code: "VALIDATION_ERROR",
    };
  }

  const { tenant, formData } = parsed.data;
  // calculation comes from the caller typed as SolarCalculation
  const { calculation } = rawInput;
  const { contact } = formData;

  // 2. Resolve provider + active solar config in a single query
  const provider = await prisma.provider.findUnique({
    where: { slug: tenant },
    include: {
      quoteConfigs: {
        where: { type: QuoteType.SOLAR, isActive: true },
        select: { id: true },
        take: 1,
      },
    },
  });

  if (!provider) {
    return {
      ok: false,
      error: `Provider '${tenant}' no encontrado`,
      code: "PROVIDER_NOT_FOUND",
    };
  }

  const quoteConfig = provider.quoteConfigs[0];

  if (!quoteConfig) {
    return {
      ok: false,
      error: `Configuración solar activa no encontrada para '${tenant}'`,
      code: "CONFIG_NOT_FOUND",
    };
  }

  // 3. Deduplication check — avoid creating duplicate quotes for the same
  //    email + provider within the dedup window.
  const dedupSince = new Date(
    Date.now() - DEDUP_WINDOW_HOURS * 60 * 60 * 1000,
  );

  const existing = await prisma.quote.findFirst({
    where: {
      providerId: provider.id,
      customerEmail: contact.email,
      status: QuoteStatus.PENDING,
      createdAt: { gte: dedupSince },
    },
    include: {
      lead: { select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  if (existing) {
    return {
      ok: true,
      quoteId: existing.id,
      leadId: existing.lead?.id ?? "",
    };
  }

  // 4. Persist Quote + Lead atomically
  try {
    const expiresAt = new Date(
      Date.now() + QUOTE_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
    );

    const result = await prisma.$transaction(async (tx) => {
      const quote = await tx.quote.create({
        data: {
          providerId: provider.id,
          quoteConfigId: quoteConfig.id,
          type: QuoteType.SOLAR,

          // Customer info — denormalized for fast dashboard queries
          customerName: contact.name,
          customerEmail: contact.email,
          customerPhone: contact.phone ?? null,

          status: QuoteStatus.PENDING,
          expiresAt,

          // Serialize to plain JSON — removes Date objects, class instances, etc.
          // Prisma's Json field requires InputJsonValue (plain JS objects).
          input: JSON.parse(JSON.stringify(formData)),
          result: JSON.parse(JSON.stringify(calculation)),
        },
      });

      const lead = await tx.lead.create({
        data: {
          quoteId: quote.id,
          status: LeadStatus.NEW,
          notes: null,
        },
      });

      return { quote, lead };
    });

    return {
      ok: true,
      quoteId: result.quote.id,
      leadId: result.lead.id,
    };
  } catch (err) {
    console.error("[saveQuote] DB error:", err);

    return {
      ok: false,
      error: "Error al guardar la cotización. Por favor intentá de nuevo.",
      code: "DB_ERROR",
    };
  }
}