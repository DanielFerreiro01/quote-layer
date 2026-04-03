"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";

const ExportLeadsCsvInputSchema = z.object({
  tenant: z.string().min(1).max(100),
  filters: z
    .object({
      status: z.enum(["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "LOST", "all"]).optional(),
      from:   z.coerce.date().optional(),
      to:     z.coerce.date().optional(),
    })
    .optional(),
});

export type ExportLeadsCsvInput = z.infer<typeof ExportLeadsCsvInputSchema>;

export type ExportLeadsCsvResult =
  | { ok: true;  csv: string; filename: string }
  | { ok: false; error: string; code: "VALIDATION_ERROR" | "PROVIDER_NOT_FOUND" | "DB_ERROR" };

const STATUS_LABELS: Record<string, string> = {
  NEW:       "Nuevo",
  CONTACTED: "Contactado",
  QUALIFIED: "Calificado",
  CONVERTED: "Convertido",
  LOST:      "Perdido",
};

export async function exportLeadsCsv(
  rawInput: ExportLeadsCsvInput,
): Promise<ExportLeadsCsvResult> {
  const parsed = ExportLeadsCsvInputSchema.safeParse(rawInput);

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.errors[0]?.message ?? "Datos inválidos",
      code: "VALIDATION_ERROR",
    };
  }

  const { tenant, filters = {} } = parsed.data;

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

  try {
    const rows = await prisma.lead.findMany({
      where: {
        quote:  { providerId: provider.id },
        ...(filters.status && filters.status !== "all"
          ? { status: filters.status as any }
          : {}),
        ...(filters.from || filters.to
          ? { createdAt: {
              ...(filters.from ? { gte: filters.from } : {}),
              ...(filters.to   ? { lte: filters.to   } : {}),
            }}
          : {}),
      },
      orderBy: { createdAt: "desc" },
      include: {
        quote: {
          select: {
            customerName:  true,
            customerEmail: true,
            customerPhone: true,
            result:        true,
            createdAt:     true,
          },
        },
      },
    });

    // Build CSV
    const headers = [
      "ID",
      "Nombre",
      "Email",
      "Teléfono",
      "Potencia (kW)",
      "Valor (USD)",
      "Estado",
      "Notas",
      "Fecha",
    ];

    const escape = (v: string | null | undefined) => {
      const s = v ?? "";
      // Wrap in quotes if the value contains commas, quotes, or newlines
      if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
      return s;
    };

    const lines = [
      headers.join(","),
      ...rows.map((row) => {
        const result = row.quote.result as Record<string, any>;
        const systemSize: number  = result?.system?.power  ?? 0;
        const quoteValue: number  = result?.costs?.total   ?? 0;

        return [
          escape(row.id),
          escape(row.quote.customerName),
          escape(row.quote.customerEmail),
          escape(row.quote.customerPhone),
          systemSize.toFixed(1),
          quoteValue.toString(),
          escape(STATUS_LABELS[row.status] ?? row.status),
          escape(row.notes),
          new Date(row.createdAt).toLocaleDateString("es-AR"),
        ].join(",");
      }),
    ];

    const date     = new Date().toISOString().split("T")[0];
    const filename = `leads-${tenant}-${date}.csv`;

    return { ok: true, csv: lines.join("\n"), filename };
  } catch (err) {
    console.error("[exportLeadsCsv] DB error:", err);
    return {
      ok: false,
      error: "Error al exportar los leads",
      code: "DB_ERROR",
    };
  }
}