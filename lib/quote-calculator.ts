import type { QuoteConfig, QuotePreviewInputs, QuoteCalculationOutputs } from './types';

/**
 * Calcula una cotización solar basada en configuración e inputs
 */
export function calculateQuote(
  config: QuoteConfig,
  inputs: QuotePreviewInputs
): QuoteCalculationOutputs {
  // Consumo anual
  const annualConsumption = inputs.monthlyKwh * 12;
  
  // Producción diaria necesaria
  const dailyProductionNeeded = annualConsumption / 365;
  
  // Tamaño del sistema (kW)
  const systemSize = dailyProductionNeeded / (config.peakSunHours * config.systemEfficiency);
  
  // Cantidad de paneles
  const panelCount = Math.ceil((systemSize * 1000) / config.panelPower);
  
  // Tamaño real ajustado a paneles completos
  const actualSystemSize = (panelCount * config.panelPower) / 1000;
  
  // Producción anual
  const annualProduction = actualSystemSize * config.peakSunHours * 365 * config.systemEfficiency;
  
  // Costo base
  const baseCost = actualSystemSize * config.baseCostPerKw;
  
  // Multiplicador por tipo de cliente
  const clientMultiplier = config.clientMultipliers[inputs.clientType];
  
  // Multiplicador por tipo de montaje
  const mountingMultiplier = config.mountingMultipliers[inputs.mountingType];
  
  // Costo con multiplicadores
  const costWithMultipliers = baseCost * clientMultiplier * mountingMultiplier;
  
  // Costo total con margen
  const totalCost = costWithMultipliers * (1 + config.marginPercentage / 100);
  
  // Ahorro mensual estimado
  const monthlySavings = (annualProduction * config.electricityCostPerKwh) / 12;
  
  // Años de retorno
  const paybackYears = totalCost / (monthlySavings * 12);
  
  return {
    systemSize: Math.round(actualSystemSize * 100) / 100,
    panelCount,
    annualProduction: Math.round(annualProduction),
    totalCost: Math.round(totalCost),
    monthlySavings: Math.round(monthlySavings),
    paybackYears: Math.round(paybackYears * 10) / 10,
  };
}