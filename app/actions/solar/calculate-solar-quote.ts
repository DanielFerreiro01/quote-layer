'use server'

import { calculateSolarSystem } from '@/lib/solar/calculate-solar-system'
import { getSolarConfig } from './get-solar-config'
import type { FormData } from '@/lib/solar-types'

export async function calculateSolarQuote(
  providerSlug: string,
  data: FormData,
) {
  const solarConfig = await getSolarConfig(providerSlug)

  const calculation = calculateSolarSystem(data, solarConfig)

  return calculation
}
