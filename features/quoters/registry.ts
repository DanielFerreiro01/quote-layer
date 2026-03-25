import type { QuoterPlugin } from "@/features/quote-wizard/types";
import { SolarPlugin } from "./solar/SolarPlugin";

/**
 * Registro central de todos los plugins de cotizadores disponibles.
 *
 * Para agregar un nuevo rubro:
 * 1. Crear la carpeta features/quoters/<rubro>/
 * 2. Implementar QuoterPlugin
 * 3. Importar y registrar acá
 */
const registry: Record<string, QuoterPlugin> = {
  solar: SolarPlugin,
  // gym: GymPlugin,
  // insurance: InsurancePlugin,
};

export function getQuoterPlugin(id: string): QuoterPlugin | null {
  return registry[id] ?? null;
}

export function getAllQuoterPlugins(): QuoterPlugin[] {
  return Object.values(registry);
}

export function getRegisteredQuoterIds(): string[] {
  return Object.keys(registry);
}