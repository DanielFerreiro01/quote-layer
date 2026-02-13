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
    // Validar provider slug
    const slugSchema = z.string().min(1).max(100);
    const validatedSlug = slugSchema.parse(providerSlug);
    
    // Validar datos del formulario
    const data = FormDataSchema.parse(rawData);
    
    // Obtener configuración
    const solarConfig = await getSolarConfig(validatedSlug);
    
    const calculation = calculateSolarSystem(data, solarConfig);
    
    return calculation;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Datos inválidos: ${error.errors[0]?.message}`);
    }
    throw error;
  }
}