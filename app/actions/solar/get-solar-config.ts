// ✅ app/actions/solar/get-solar-config.ts
"use server";

import { prisma } from "@/lib/prisma";
import type { SolarConfig } from "@/lib/solar/solar-types";
import { QuoteType } from "@prisma/client"; // ✅ Import correcto

export async function getSolarConfig(providerSlug: string): Promise<SolarConfig> {
  const provider = await prisma.provider.findUnique({
    where: { slug: providerSlug },
    include: {
      quoteConfigs: {
        where: { type: QuoteType.SOLAR, isActive: true },
        include: {
          solarConfig: true,
        },
      },
    },
  });

  if (!provider) {
    throw new Error(`Provider '${providerSlug}' no encontrado`);
  }

  const quoteConfig = provider.quoteConfigs[0];
  if (!quoteConfig?.solarConfig) {
    throw new Error(`Configuración solar no encontrada para '${providerSlug}'`);
  }

  const dbConfig = quoteConfig.solarConfig;

  return {
    clients: {
      residential: {
        tariff: {
          energyCost: dbConfig.residentialEnergyCost,
          fixedCharge: dbConfig.residentialFixedCharge,
        },
        taxRate: dbConfig.residentialTaxRate,
        inflationRate: dbConfig.residentialInflationRate,
      },
      industrial: {
        tariff: {
          energyCost: dbConfig.industrialEnergyCost,
          fixedCharge: dbConfig.industrialFixedCharge,
          demandCharge: dbConfig.industrialDemandCharge ?? undefined,
        },
        taxRate: dbConfig.industrialTaxRate,
        inflationRate: dbConfig.industrialInflationRate,
      },
      agro: {
        tariff: {
          energyCost: dbConfig.agroEnergyCost,
          fixedCharge: dbConfig.agroFixedCharge,
        },
        taxRate: dbConfig.agroTaxRate,
        inflationRate: dbConfig.agroInflationRate,
      },
    },
    system: {
      panelPower: dbConfig.panelPower,
      panelEfficiency: dbConfig.panelEfficiency,
      systemLosses: dbConfig.systemLosses,
      systemEfficiency: 100 - dbConfig.systemLosses, // ✅ Calcular de systemLosses
      degradationRate: dbConfig.degradationRate,
      peakSunHours: {
        day: dbConfig.peakSunHoursDay,
        night: dbConfig.peakSunHoursNight,
        mixed: dbConfig.peakSunHoursMixed,
      },
    },
    costs: {
      panelCost: dbConfig.panelCost,
      inverterCost: dbConfig.inverterCost,
      inverterCostPerKw: dbConfig.inverterCostPerKw,
      installationCostPerKw: dbConfig.installationCostPerKw,
      structureCostPerKw: dbConfig.structureCostPerKw,
      marginPercentage: dbConfig.marginPercentage,
      mountingCosts: {
        'roof-sheet': dbConfig.mountingCostRoofSheet,
        'roof-tile': dbConfig.mountingCostRoofTile,
        'ground': dbConfig.mountingCostGround,
        'carport': dbConfig.mountingCostCarport,
      },
    },
    financing: {
      enabled: dbConfig.financingEnabled,
      downPaymentPercentage: dbConfig.downPaymentPercentage,
      interestRate: dbConfig.interestRate,
      termMonths: dbConfig.termMonths,
    },
  };
}