import type {
  FormData,
  SolarCalculation,
  SolarConfig,
} from './solar-types';
import { SYSTEM_TYPE_EXTRA_COST_PER_KW } from './solar-types';

export function calculateSolarSystem(
  data: FormData,
  config: SolarConfig,
): SolarCalculation {
  const { consumption, installation, contact, system } = data;
  const clientConfig = config.clients[contact.clientType];
  const systemConfig = config.system;
  const costConfig = config.costs;

  // ========================================
  // CÁLCULOS DEL SISTEMA
  // ========================================

  const annualConsumption = consumption.monthlyKwh * 12;
  const peakSunHours = systemConfig.peakSunHours[consumption.timeProfile];
  const dailyProductionNeeded = annualConsumption / 365;
  const systemSizeKw = dailyProductionNeeded / (peakSunHours * (systemConfig.systemEfficiency / 100));
  const panelCount = Math.ceil((systemSizeKw * 1000) / systemConfig.panelPower);
  const actualSystemSizeKw = (panelCount * systemConfig.panelPower) / 1000;
  const annualProduction = actualSystemSizeKw * peakSunHours * 365 * (systemConfig.systemEfficiency / 100);
  const inverterPower = actualSystemSizeKw * 0.85;
  const coveragePercentage = Math.min((annualProduction / annualConsumption) * 100, 100);

  // ========================================
  // CÁLCULOS DE COSTOS
  // ========================================

  const panelsCost = panelCount * costConfig.panelCost;
  const inverterCost = costConfig.inverterCost + (inverterPower * costConfig.inverterCostPerKw);
  const installationCost = actualSystemSizeKw * costConfig.installationCostPerKw;
  const structureCost = actualSystemSizeKw * costConfig.structureCostPerKw;
  const mountingCost = actualSystemSizeKw * costConfig.mountingCosts[installation.mountingType];

  // Costo adicional por tipo de sistema (baterías, inversor híbrido, etc.)
  const systemTypeExtraCost = actualSystemSizeKw * SYSTEM_TYPE_EXTRA_COST_PER_KW[system.systemType];

  const subtotal = panelsCost + inverterCost + installationCost + structureCost + mountingCost + systemTypeExtraCost;
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
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
                          (Math.pow(1 + monthlyRate, termMonths) - 1);
    const totalPayments = monthlyPayment * termMonths;
    const totalInterest = totalPayments - loanAmount;

    financingOptions = {
      enabled: true,
      downPayment: Math.round(downPayment),
      loanAmount: Math.round(loanAmount),
      monthlyPayment: Math.round(monthlyPayment),
      totalPayments: Math.round(totalPayments),
      totalInterest: Math.round(totalInterest),
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

  const monthlyEnergyWithoutSolar = (consumption.monthlyKwh * energyCost) + fixedCharge;
  const monthlyBillWithoutSolar = monthlyEnergyWithoutSolar * (1 + taxRate);

  const residualConsumption = consumption.monthlyKwh * (1 - coveragePercentage / 100);
  const monthlyEnergyWithSolar = (residualConsumption * energyCost) + fixedCharge;
  const monthlyBillWithSolar = monthlyEnergyWithSolar * (1 + taxRate);

  const monthlySavings = monthlyBillWithoutSolar - monthlyBillWithSolar;
  const annualSavings = monthlySavings * 12;
  const paybackYears = totalCost / annualSavings;

  const projection = [];
  let cumulativeSavings = 0;

  for (let year = 1; year <= 25; year++) {
    const systemDegradation = Math.pow(1 - systemConfig.degradationRate / 100, year);
    const adjustedProduction = annualProduction * systemDegradation;
    const adjustedCoverage = Math.min((adjustedProduction / annualConsumption) * 100, 100);
    const yearlyInflation = Math.pow(1 + inflationRate, year);
    const energyCostThisYear = energyCost * yearlyInflation;
    const yearlyBillWithoutSolar = (annualConsumption * energyCostThisYear + fixedCharge * 12) * (1 + taxRate);
    const residualConsumptionThisYear = annualConsumption * (1 - adjustedCoverage / 100);
    const yearlyBillWithSolar = (residualConsumptionThisYear * energyCostThisYear + fixedCharge * 12) * (1 + taxRate);
    const savingsThisYear = yearlyBillWithoutSolar - yearlyBillWithSolar;
    cumulativeSavings += savingsThisYear;

    projection.push({
      year,
      billWithoutSolar: Math.round(yearlyBillWithoutSolar),
      billWithSolar: Math.round(yearlyBillWithSolar),
      savings: Math.round(savingsThisYear),
      cumulativeSavings: Math.round(cumulativeSavings),
    });
  }

  const roi25Years = ((cumulativeSavings - totalCost) / totalCost) * 100;

  // ========================================
  // RESULTADO FINAL
  // ========================================

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
      installation: Math.round(installationCost),
      structure: Math.round(structureCost),
      mounting: Math.round(mountingCost),
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