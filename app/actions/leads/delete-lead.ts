"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";

// ─── Input schemas ────────────────────────────────────────────────────────────

const DeleteLeadInputSchema = z.object({
  leadId: z.string().uuid(),
  tenant: z.string().min(1).max(100),
});

const BulkDeleteLeadsInputSchema = z.object({
  leadIds: z.array(z.string().uuid()).min(1).max(100),
  tenant: z.string().min(1).max(100),
});

export type DeleteLeadInput = z.infer<typeof DeleteLeadInputSchema>;
export type BulkDeleteLeadsInput = z.infer<typeof BulkDeleteLeadsInputSchema>;

export type DeleteLeadResult =
  | { ok: true; deletedId: string }
  | {
      ok: false;
      error: string;
      code: "VALIDATION_ERROR" | "NOT_FOUND" | "FORBIDDEN" | "DB_ERROR";
    };

export type BulkDeleteLeadsResult =
  | { ok: true; deletedCount: number; deletedIds: string[] }
  | {
      ok: false;
      error: string;
      code: "VALIDATION_ERROR" | "FORBIDDEN" | "DB_ERROR";
    };

// ─── Single delete ────────────────────────────────────────────────────────────

export async function deleteLead(rawInput: DeleteLeadInput): Promise<DeleteLeadResult> {
  const parsed = DeleteLeadInputSchema.safeParse(rawInput);

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.errors[0]?.message ?? "Datos inválidos",
      code: "VALIDATION_ERROR",
    };
  }

  const { leadId, tenant } = parsed.data;

  // Verify existence + ownership
  const existing = await prisma.lead.findUnique({
    where: { id: leadId },
    include: {
      quote: {
        include: { provider: { select: { slug: true } } },
      },
    },
  });

  if (!existing) {
    return { ok: false, error: "Lead no encontrado", code: "NOT_FOUND" };
  }

  if (existing.quote.provider.slug !== tenant) {
    return { ok: false, error: "Sin permisos para eliminar este lead", code: "FORBIDDEN" };
  }

  try {
    // Cascade on the schema deletes the lead when quote is deleted.
    // Here we only delete the lead — the quote is kept for audit purposes.
    await prisma.lead.delete({ where: { id: leadId } });

    return { ok: true, deletedId: leadId };
  } catch (err) {
    console.error("[deleteLead] DB error:", err);
    return {
      ok: false,
      error: "Error al eliminar el lead",
      code: "DB_ERROR",
    };
  }
}

// ─── Bulk delete ──────────────────────────────────────────────────────────────

export async function bulkDeleteLeads(
  rawInput: BulkDeleteLeadsInput,
): Promise<BulkDeleteLeadsResult> {
  const parsed = BulkDeleteLeadsInputSchema.safeParse(rawInput);

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.errors[0]?.message ?? "Datos inválidos",
      code: "VALIDATION_ERROR",
    };
  }

  const { leadIds, tenant } = parsed.data;

  // Resolve provider id once
  const provider = await prisma.provider.findUnique({
    where: { slug: tenant },
    select: { id: true },
  });

  if (!provider) {
    return {
      ok: false,
      error: `Provider '${tenant}' no encontrado`,
      code: "FORBIDDEN",
    };
  }

  // Verify all requested leads belong to this provider before deleting any
  const leads = await prisma.lead.findMany({
    where: { id: { in: leadIds } },
    include: {
      quote: { select: { providerId: true } },
    },
  });

  const unauthorized = leads.filter((l) => l.quote.providerId !== provider.id);

  if (unauthorized.length > 0) {
    return {
      ok: false,
      error: `Sin permisos para eliminar ${unauthorized.length} lead(s)`,
      code: "FORBIDDEN",
    };
  }

  // Only delete leads that actually exist and belong to this provider
  const verifiedIds = leads.map((l) => l.id);

  try {
    const { count } = await prisma.lead.deleteMany({
      where: { id: { in: verifiedIds } },
    });

    return { ok: true, deletedCount: count, deletedIds: verifiedIds };
  } catch (err) {
    console.error("[bulkDeleteLeads] DB error:", err);
    return {
      ok: false,
      error: "Error al eliminar los leads",
      code: "DB_ERROR",
    };
  }
}