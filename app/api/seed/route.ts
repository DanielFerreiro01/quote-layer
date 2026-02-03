import { NextResponse } from 'next/server'
import { QuoteType } from '@/lib/generated/prisma/enums'
import { prisma } from "@/lib/prisma";


export async function POST() {
  try {
    /**
     * 1️⃣ Provider demo
     */
    const provider = await prisma.provider.upsert({
      where: { slug: 'solar-demo' },
      update: {},
      create: {
        name: 'Solar Demo Provider',
        slug: 'solar-demo',
      },
    })

    /**
     * 2️⃣ QuoteConfig SOLAR
     */
    const solarQuoteConfig = await prisma.quoteConfig.upsert({
      where: {
        providerId_type: {
          providerId: provider.id,
          type: QuoteType.SOLAR,
        },
      },
      update: {},
      create: {
        providerId: provider.id,
        type: QuoteType.SOLAR,
        isActive: true,
      },
    })

    /**
     * 3️⃣ SolarConfig (tu seed real)
     */
    await prisma.solarConfig.upsert({
      where: {
        quoteConfigId: solarQuoteConfig.id,
      },
      update: {},
      create: {
        quoteConfigId: solarQuoteConfig.id,

        baseCostPerKw: 1200,
        electricityCostPerKwh: 0.15,
        annualElectricityIncrease: 0.04,

        panelWattCapacity: 550,
        sunHoursPerDay: 5,
        systemEfficiency: 0.85,

        clientTypeMultiplier: {
          residential: 1,
          industrial: 0.85,
          agro: 0.9,
        },

        mountingTypeMultiplier: {
          'roof-sheet': 1,
          'roof-tile': 1.15,
          ground: 1.25,
          carport: 1.4,
        },

        maintenanceAnnualRate: 0.05,
        projectionYears: 20,
      },
    })

    return NextResponse.json({
      ok: true,
      message: 'Seed SOLAR ejecutado correctamente',
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { ok: false, error: 'Error ejecutando seed' },
      { status: 500 },
    )
  }
}
