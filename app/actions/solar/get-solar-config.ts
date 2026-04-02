"use server";

import { prisma } from "@/lib/prisma";
import type { SolarConfig } from "@/lib/solar/solar-types";
import { QuoteType } from "@prisma/client";

export async function getSolarConfig(providerSlug: string): Promise<SolarConfig> {
  const provider = await prisma.provider.findUnique({
    where: { slug: providerSlug },
    include: {
      quoteConfigs: {
        where: { type: QuoteType.SOLAR, isActive: true },
        include: { solarConfig: true },
      },
    },
  });

  if (!provider) throw new Error(`Provider '${providerSlug}' no encontrado`);

  const quoteConfig = provider.quoteConfigs[0];
  if (!quoteConfig?.solarConfig) {
    throw new Error(`Configuración solar no encontrada para '${providerSlug}'`);
  }

  const db = quoteConfig.solarConfig;

  return {
    clients: {
      residential: {
        tariff: { energyCost: db.residentialEnergyCost, fixedCharge: db.residentialFixedCharge },
        taxRate: db.residentialTaxRate,
        inflationRate: db.residentialInflationRate,
      },
      industrial: {
        tariff: {
          energyCost: db.industrialEnergyCost,
          fixedCharge: db.industrialFixedCharge,
          demandCharge: db.industrialDemandCharge ?? undefined,
        },
        taxRate: db.industrialTaxRate,
        inflationRate: db.industrialInflationRate,
      },
      agro: {
        tariff: { energyCost: db.agroEnergyCost, fixedCharge: db.agroFixedCharge },
        taxRate: db.agroTaxRate,
        inflationRate: db.agroInflationRate,
      },
    },
    system: {
      panelPower: db.panelPower,
      panelEfficiency: db.panelEfficiency,
      systemLosses: db.systemLosses,
      systemEfficiency: 100 - db.systemLosses,
      degradationRate: db.degradationRate,
      peakSunHours: {
        day: db.peakSunHoursDay,
        night: db.peakSunHoursNight,
        mixed: db.peakSunHoursMixed,
      },
    },
    costs: {
      panelCost: db.panelCost,
      inverterCost: db.inverterCost,
      inverterCostPerKw: db.inverterCostPerKw,
      baseInstallationFee: db.baseInstallationFee,
      laborCostPerKw: db.laborCostPerKw,
      structureCostPerPanel: db.structureCostPerPanel,
      marginPercentage: db.marginPercentage,
      mountingMultipliers: {
        'roof-sheet': db.mountingMultiplierRoofSheet,
        'roof-tile': db.mountingMultiplierRoofTile,
        'ground': db.mountingMultiplierGround,
        'carport': db.mountingMultiplierCarport,
      },
      systemExtraCostPerKw: {
        'on-grid': 0,
        'off-grid': db.systemExtraCostOffGrid,
        'hybrid': db.systemExtraCostHybrid,
      },
    },
    financing: {
      enabled: db.financingEnabled,
      downPaymentPercentage: db.downPaymentPercentage,
      interestRate: db.interestRate,
      termMonths: db.termMonths,
    },
  };
}