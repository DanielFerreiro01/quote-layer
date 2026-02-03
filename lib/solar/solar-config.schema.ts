import { z } from 'zod'

export const ClientTypeMultiplierSchema = z.object({
  residential: z.number().positive(),
  industrial: z.number().positive(),
  agro: z.number().positive(),
})

export const MountingTypeMultiplierSchema = z.object({
  'roof-sheet': z.number().positive(),
  'roof-tile': z.number().positive(),
  ground: z.number().positive(),
  carport: z.number().positive(),
})

export const SolarRuntimeConfigSchema = z.object({
  baseCostPerKw: z.number().positive(),
  electricityCostPerKwh: z.number().positive(),
  annualElectricityIncrease: z.number().min(0),

  panelWattCapacity: z.number().positive(),
  sunHoursPerDay: z.number().positive(),
  systemEfficiency: z.number().min(0).max(1),

  clientTypeMultiplier: ClientTypeMultiplierSchema,
  mountingTypeMultiplier: MountingTypeMultiplierSchema,

  maintenanceAnnualRate: z.number().min(0),
  projectionYears: z.number().int().positive(),
})

export type SolarRuntimeConfig = z.infer<
  typeof SolarRuntimeConfigSchema
>
