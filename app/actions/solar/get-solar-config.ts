'use server'

import { cache } from 'react'
import { prisma } from '@/lib/prisma'
import { QuoteType } from '@prisma/client'
import { SolarRuntimeConfigSchema } from '@/lib/solar/solar-config.schema'

async function _getSolarConfig(providerSlug: string) {
  const config = await prisma.quoteConfig.findFirst({
    where: {
      type: QuoteType.SOLAR,
      isActive: true,
      provider: { slug: providerSlug },
    },
    include: {
      solarConfig: true,
    },
  })

  if (!config?.solarConfig) {
    throw new Error('Solar config not found')
  }

  return SolarRuntimeConfigSchema.parse({
    baseCostPerKw: config.solarConfig.baseCostPerKw,
    electricityCostPerKwh: config.solarConfig.electricityCostPerKwh,
    annualElectricityIncrease: config.solarConfig.annualElectricityIncrease,

    panelWattCapacity: config.solarConfig.panelWattCapacity,
    sunHoursPerDay: config.solarConfig.sunHoursPerDay,
    systemEfficiency: config.solarConfig.systemEfficiency,

    clientTypeMultiplier: config.solarConfig.clientTypeMultiplier,
    mountingTypeMultiplier: config.solarConfig.mountingTypeMultiplier,

    maintenanceAnnualRate: config.solarConfig.maintenanceAnnualRate,
    projectionYears: config.solarConfig.projectionYears,
  })
}

export const getSolarConfig = cache(_getSolarConfig)
