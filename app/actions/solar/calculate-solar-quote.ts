"use server";

import { FormDataSchema } from "@/lib/solar/solar-types";
import { calculateSolarSystem } from "@/lib/solar/calculate-solar-system";
import { getSolarConfig } from "./get-solar-config";
import type { SolarCalculation } from "@/lib/solar/solar-types";
import { z } from "zod";

export async function calculateSolarQuote(
  providerSlug: string,
  rawData: unknown,
): Promise<SolarCalculation> {
  try {
    const slugSchema = z.string().min(1).max(100);
    const validatedSlug = slugSchema.parse(providerSlug);

    const data = FormDataSchema.parse(rawData);

    const solarConfig = await getSolarConfig(validatedSlug);

    return calculateSolarSystem(data, solarConfig);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Datos inválidos: ${error.errors[0]?.message}`);
    }
    throw error;
  }
}