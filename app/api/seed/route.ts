import { NextResponse } from 'next/server'
import { QuoteType } from '@prisma/client'
import { prisma } from "@/lib/prisma"

export async function POST() {
  try {
    const provider = await prisma.provider.upsert({
      where: { slug: 'solar-demo' },
      update: {},
      create: { name: 'Solar Demo Provider', slug: 'solar-demo' },
    })

    const solarQuoteConfig = await prisma.quoteConfig.upsert({
      where: { providerId_type: { providerId: provider.id, type: QuoteType.SOLAR } },
      update: {},
      create: { providerId: provider.id, type: QuoteType.SOLAR, isActive: true },
    })

    await prisma.solarConfig.upsert({
      where: { quoteConfigId: solarQuoteConfig.id },
      update: {},
      create: {
        quoteConfigId: solarQuoteConfig.id,

        // Tarifas por tipo de cliente
        residentialEnergyCost: 0.15,
        residentialFixedCharge: 10,
        residentialTaxRate: 21,
        residentialInflationRate: 4,

        industrialEnergyCost: 0.12,
        industrialFixedCharge: 50,
        industrialDemandCharge: 15,
        industrialTaxRate: 21,
        industrialInflationRate: 4,

        agroEnergyCost: 0.13,
        agroFixedCharge: 30,
        agroTaxRate: 10.5,
        agroInflationRate: 4,

        // Sistema
        panelPower: 550,
        panelEfficiency: 21,
        systemLosses: 15,
        degradationRate: 0.5,
        peakSunHoursDay: 6,
        peakSunHoursNight: 4,   // corregido — no es 0
        peakSunHoursMixed: 5,

        // Costos — Equipamiento
        panelCost: 200,
        inverterCost: 500,
        inverterCostPerKw: 300,

        // Costos — Operativo (nueva estructura)
        baseInstallationFee: 300,       // fijo por proyecto
        laborCostPerKw: 150,            // mano de obra por kW
        structureCostPerPanel: 45,      // estructura por panel

        // Multiplicadores de montaje (sobre costos operativos)
        mountingMultiplierRoofSheet: 1.0,
        mountingMultiplierRoofTile: 1.2,
        mountingMultiplierGround: 1.3,
        mountingMultiplierCarport: 1.4,

        // Extra por tipo de sistema
        systemExtraCostOffGrid: 400,
        systemExtraCostHybrid: 600,

        // Margen
        marginPercentage: 20,

        // Financiamiento
        financingEnabled: true,
        downPaymentPercentage: 20,
        interestRate: 8,
        termMonths: 60,
      },
    })

    return NextResponse.json({ ok: true, message: 'Seed ejecutado correctamente' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ ok: false, error: 'Error ejecutando seed' }, { status: 500 })
  }
}