import type { FormData, SolarCalculation, SolarConfig } from './solar-types';

export function calculateSolarSystem(
  data: FormData,
  config: SolarConfig,
): SolarCalculation {
  const { consumption, installation, contact, system } = data;
  const clientConfig = config.clients[contact.clientType];
  const systemConfig = config.system;
  const costConfig = config.costs;

  // ========================================
  // DIMENSIONAMIENTO DEL SISTEMA
  // ========================================

  const annualConsumption = consumption.monthlyKwh * 12;

  // Guard: peakSunHoursNight = 0 en DB → fallback a mixed
  const rawPeakSunHours = systemConfig.peakSunHours[consumption.timeProfile];
  const peakSunHours = rawPeakSunHours > 0
    ? rawPeakSunHours
    : systemConfig.peakSunHours.mixed;

  const systemEfficiency = systemConfig.systemEfficiency / 100;

  const dailyProductionNeeded = annualConsumption / 365;
  const systemSizeKw = dailyProductionNeeded / (peakSunHours * systemEfficiency);
  const panelCount = Math.ceil((systemSizeKw * 1000) / systemConfig.panelPower);
  const actualSystemSizeKw = (panelCount * systemConfig.panelPower) / 1000;
  const annualProduction = actualSystemSizeKw * peakSunHours * 365 * systemEfficiency;
  const inverterPower = actualSystemSizeKw * 0.85;
  const coveragePercentage = Math.min((annualProduction / annualConsumption) * 100, 100);

  // ========================================
  // CÁLCULO DE COSTOS (3 capas)
  // ========================================

  // Capa 1 — Equipamiento (no afectado por multiplicador de montaje)
  const panelsCost = panelCount * costConfig.panelCost;
  const inverterCost = costConfig.inverterCost + (inverterPower * costConfig.inverterCostPerKw);

  // Capa 2 — Operativo (afectado por multiplicador de montaje)
  // baseInstallationFee: costo fijo por proyecto (no importa el tamaño del sistema)
  // laborCostPerKw: mano de obra escala con el tamaño
  // structureCostPerPanel: rieles y anclajes escalan con cantidad de paneles
  const baseInstallationRaw = costConfig.baseInstallationFee;
  const laborRaw = actualSystemSizeKw * costConfig.laborCostPerKw;
  const structureRaw = panelCount * costConfig.structureCostPerPanel;

  const mountingMultiplier = costConfig.mountingMultipliers[installation.mountingType];
  const operativeSubtotal = (baseInstallationRaw + laborRaw + structureRaw) * mountingMultiplier;

  // Capa 3 — Extra por tipo de sistema (baterías, inversor híbrido, etc.)
  const systemTypeExtraCost = actualSystemSizeKw * costConfig.systemExtraCostPerKw[system.systemType];

  // ========================================
  // SUBTOTAL Y MARGEN
  // ========================================

  const subtotal = panelsCost + inverterCost + operativeSubtotal + systemTypeExtraCost;
  const margin = subtotal * (costConfig.marginPercentage / 100);
  const totalCost = subtotal + margin;

  // ========================================
  // FINANCIAMIENTO
  // ========================================

  let financingOptions;
  if (config.financing.enabled) {
    const downPayment = totalCost * (config.financing.downPaymentPercentage / 100);
    const loanAmount = totalCost - downPayment;
    const monthlyRate = config.financing.interestRate / 100 / 12;
    const termMonths = config.financing.termMonths;
    const monthlyPayment =
      loanAmount *
      ((monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
        (Math.pow(1 + monthlyRate, termMonths) - 1));
    const totalPayments = monthlyPayment * termMonths;
    financingOptions = {
      enabled: true,
      downPayment: Math.round(downPayment),
      loanAmount: Math.round(loanAmount),
      monthlyPayment: Math.round(monthlyPayment),
      totalPayments: Math.round(totalPayments),
      totalInterest: Math.round(totalPayments - loanAmount),
    };
  } else {
    financingOptions = {
      enabled: false,
      downPayment: 0,
      loanAmount: 0,
      monthlyPayment: 0,
      totalPayments: 0,
      totalInterest: 0,
    };
  }

  // ========================================
  // ANÁLISIS ECONÓMICO
  // ========================================

  const energyCost = clientConfig.tariff.energyCost;
  const fixedCharge = clientConfig.tariff.fixedCharge;
  const taxRate = clientConfig.taxRate / 100;
  const inflationRate = clientConfig.inflationRate / 100;

  const monthlyBillWithoutSolar =
    (consumption.monthlyKwh * energyCost + fixedCharge) * (1 + taxRate);
  const residualConsumption = consumption.monthlyKwh * (1 - coveragePercentage / 100);
  const monthlyBillWithSolar =
    (residualConsumption * energyCost + fixedCharge) * (1 + taxRate);

  const monthlySavings = monthlyBillWithoutSolar - monthlyBillWithSolar;
  const annualSavings = monthlySavings * 12;
  const paybackYears = totalCost / annualSavings;

  const projection = [];
  let cumulativeSavings = 0;
  for (let year = 1; year <= 25; year++) {
    const degradation = Math.pow(1 - systemConfig.degradationRate / 100, year);
    const adjustedCoverage = Math.min(
      ((annualProduction * degradation) / annualConsumption) * 100,
      100
    );
    const inflation = Math.pow(1 + inflationRate, year);
    const eCostYear = energyCost * inflation;
    const billWithoutSolar =
      (annualConsumption * eCostYear + fixedCharge * 12) * (1 + taxRate);
    const billWithSolar =
      (annualConsumption * (1 - adjustedCoverage / 100) * eCostYear + fixedCharge * 12) * (1 + taxRate);
    const savingsYear = billWithoutSolar - billWithSolar;
    cumulativeSavings += savingsYear;
    projection.push({
      year,
      billWithoutSolar: Math.round(billWithoutSolar),
      billWithSolar: Math.round(billWithSolar),
      savings: Math.round(savingsYear),
      cumulativeSavings: Math.round(cumulativeSavings),
    });
  }

  const roi25Years = ((cumulativeSavings - totalCost) / totalCost) * 100;

  return {
    system: {
      power: Math.round(actualSystemSizeKw * 100) / 100,
      panels: panelCount,
      inverterPower: Math.round(inverterPower * 100) / 100,
      annualProduction: Math.round(annualProduction),
      coveragePercentage: Math.round(coveragePercentage * 10) / 10,
      mountingType: installation.mountingType,
      systemType: system.systemType,
    },
    costs: {
      panels: Math.round(panelsCost),
      inverter: Math.round(inverterCost),
      baseInstallation: Math.round(baseInstallationRaw * mountingMultiplier),
      labor: Math.round(laborRaw * mountingMultiplier),
      structure: Math.round(structureRaw * mountingMultiplier),
      operativeSubtotal: Math.round(operativeSubtotal),
      systemTypeExtra: Math.round(systemTypeExtraCost),
      subtotal: Math.round(subtotal),
      margin: Math.round(margin),
      total: Math.round(totalCost),
    },
    financing: financingOptions,
    economics: {
      monthlyBillWithoutSolar: Math.round(monthlyBillWithoutSolar),
      monthlyBillWithSolar: Math.round(monthlyBillWithSolar),
      monthlySavings: Math.round(monthlySavings),
      annualSavings: Math.round(annualSavings),
      paybackYears: Math.round(paybackYears * 10) / 10,
      roi25Years: Math.round(roi25Years * 10) / 10,
      projection,
    },
    calculatedAt: new Date(),
    config,
    input: data,
  };
}