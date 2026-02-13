// ✅ app/api/seed/route.ts (VERIFICAR)
import { NextResponse } from 'next/server'
import { QuoteType } from '@prisma/client' // ✅ Cambiar import
import { prisma } from "@/lib/prisma"

export async function POST() {
  try {
    const provider = await prisma.provider.upsert({
      where: { slug: 'solar-demo' },
      update: {},
      create: {
        name: 'Solar Demo Provider',
        slug: 'solar-demo',
      },
    })

    const solarQuoteConfig = await prisma.quoteConfig.upsert({
      where: {
        providerId_type: {
          providerId: provider.id,
          type: QuoteType.SOLAR, // ✅ Esto ahora debería funcionar
        },
      },
      update: {},
      create: {
        providerId: provider.id,
        type: QuoteType.SOLAR,
        isActive: true,
      },
    })

    await prisma.solarConfig.upsert({
      where: {
        quoteConfigId: solarQuoteConfig.id,
      },
      update: {},
      create: {
        quoteConfigId: solarQuoteConfig.id,
        
        // Residencial
        residentialEnergyCost: 0.15,
        residentialFixedCharge: 10,
        residentialTaxRate: 21,
        residentialInflationRate: 4,
        
        // Industrial
        industrialEnergyCost: 0.12,
        industrialFixedCharge: 50,
        industrialDemandCharge: 15,
        industrialTaxRate: 21,
        industrialInflationRate: 4,
        
        // Agro
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
        peakSunHoursNight: 0,
        peakSunHoursMixed: 5,
        
        // Costos
        panelCost: 200,
        inverterCost: 500,
        inverterCostPerKw: 300,
        installationCostPerKw: 150,
        structureCostPerKw: 100,
        marginPercentage: 20,
        
        mountingCostRoofSheet: 50,
        mountingCostRoofTile: 80,
        mountingCostGround: 120,
        mountingCostCarport: 150,
        
        // Financiamiento
        financingEnabled: true,
        downPaymentPercentage: 20,
        interestRate: 8,
        termMonths: 60,
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