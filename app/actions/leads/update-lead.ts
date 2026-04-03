"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { LeadStatus } from "@prisma/client";
import type { Lead } from "@/features/dashboard/types";

// ─── Input schema ─────────────────────────────────────────────────────────────

const UpdateLeadInputSchema = z.object({
  leadId: z.string().uuid(),
  // tenant is required to verify ownership — never trust the client alone
  tenant: z.string().min(1).max(100),
  data: z
    .object({
      status: z.enum(["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "LOST"]).optional(),
      notes: z.string().max(5000).optional(),
    })
    .refine((d) => d.status !== undefined || d.notes !== undefined, {
      message: "Debe actualizar al menos status o notes",
    }),
});

export type UpdateLeadInput = z.infer<typeof UpdateLeadInputSchema>;

export type UpdateLeadResult =
  | { ok: true; lead: Pick<Lead, "id" | "status" | "notes" | "updatedAt"> }
  | {
      ok: false;
      error: string;
      code: "VALIDATION_ERROR" | "NOT_FOUND" | "FORBIDDEN" | "DB_ERROR";
    };

// ─── Action ───────────────────────────────────────────────────────────────────

export async function updateLead(rawInput: UpdateLeadInput): Promise<UpdateLeadResult> {
  const parsed = UpdateLeadInputSchema.safeParse(rawInput);

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.errors[0]?.message ?? "Datos inválidos",
      code: "VALIDATION_ERROR",
    };
  }

  const { leadId, tenant, data } = parsed.data;

  // 1. Verify lead exists and belongs to the provider (ownership check)
  const existing = await prisma.lead.findUnique({
    where: { id: leadId },
    include: {
      quote: {
        include: {
          provider: { select: { slug: true } },
        },
      },
    },
  });

  if (!existing) {
    return { ok: false, error: "Lead no encontrado", code: "NOT_FOUND" };
  }

  if (existing.quote.provider.slug !== tenant) {
    return { ok: false, error: "Sin permisos para modificar este lead", code: "FORBIDDEN" };
  }

  // 2. Update
  try {
    const updated = await prisma.lead.update({
      where: { id: leadId },
      data: {
        ...(data.status ? { status: data.status as LeadStatus } : {}),
        ...(data.notes !== undefined ? { notes: data.notes } : {}),
      },
      select: {
        id: true,
        status: true,
        notes: true,
        updatedAt: true,
      },
    });

    return {
      ok: true,
      lead: {
        id: updated.id,
        status: updated.status,
        notes: updated.notes,
        updatedAt: updated.updatedAt,
      },
    };
  } catch (err) {
    console.error("[updateLead] DB error:", err);
    return {
      ok: false,
      error: "Error al actualizar el lead",
      code: "DB_ERROR",
    };
  }
}