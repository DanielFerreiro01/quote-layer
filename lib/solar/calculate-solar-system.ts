import type { FormData, SolarCalculation } from "@/lib/solar/solar-types";
import type { SolarRuntimeConfig } from "./solar-config.schema";

export function calculateSolarSystem(
  data: FormData,
  config: SolarRuntimeConfig,
): SolarCalculation {
  const { consumption, installation, contact } = data;

  const annualConsumption = consumption.monthlyKwh * 12;

  const dailyProduction =
    (annualConsumption / 365) * (1 / config.systemEfficiency);

  const systemSizeKw = dailyProduction / config.sunHoursPerDay;

  const panelCount = Math.ceil(
    (systemSizeKw * 1000) / config.panelWattCapacity,
  );

  const actualSystemSize = (panelCount * config.panelWattCapacity) / 1000;

  const costUSD =
    actualSystemSize *
    config.baseCostPerKw *
    config.mountingTypeMultiplier[installation.mountingType] *
    config.clientTypeMultiplier[contact.clientType];

  const monthlySavings = consumption.monthlyKwh * config.electricityCostPerKwh;

  const annualSavings = monthlySavings * 12;

  const roiYears = costUSD / annualSavings;

  const gridCostProjection: number[] = [];
  const solarCostProjection: number[] = [];

  let cumulativeGridCost = 0;
  let cumulativeSolarCost = costUSD;

  for (let year = 0; year <= config.projectionYears; year++) {
    const electricityCostThisYear =
      annualConsumption *
      config.electricityCostPerKwh *
      (1 + config.annualElectricityIncrease) ** year;

    cumulativeGridCost += electricityCostThisYear;
    gridCostProjection.push(Math.round(cumulativeGridCost));

    if (year > 0) {
      cumulativeSolarCost += annualSavings * config.maintenanceAnnualRate;
    }

    solarCostProjection.push(Math.round(cumulativeSolarCost));
  }

  return {
    systemSizeKw: Math.round(actualSystemSize * 100) / 100,
    panelCount,
    costUSD: Math.round(costUSD),
    monthlySavings: Math.round(monthlySavings),
    annualSavings: Math.round(annualSavings),
    roiYears: Math.round(roiYears * 10) / 10,
    gridCostProjection,
    solarCostProjection,
  };
}
