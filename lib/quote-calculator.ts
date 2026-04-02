import type { QuoteConfig, QuotePreviewInputs, QuoteCalculationOutputs } from './types';
import { calculateSolarSystem } from './solar/calculate-solar-system';
import type { FormData, SolarConfig, MountingType, SystemType } from './solar/solar-types';

// Mapeo de tipos del dashboard al formato del cotizador
const MOUNTING_TYPE_MAP: Record<QuotePreviewInputs['mountingType'], MountingType> = {
  roofSheet: 'roof-sheet',
  roofTile:  'roof-tile',
  ground:    'ground',
  carport:   'carport',
};

/**
 * Adapta QuoteConfig (formato dashboard) a SolarConfig (formato cotizador)
 * y ejecuta exactamente el mismo cálculo que el wizard público.
 * Garantiza que el preview del dashboard y el cotizador siempre den el mismo resultado.
 */
export function calculateQuote(
  config: QuoteConfig,
  inputs: QuotePreviewInputs,
): QuoteCalculationOutputs {

  // Armar FormData con valores típicos/neutros para el preview
  const formData: FormData = {
    contact: {
      name: 'Preview',
      email: 'preview@example.com',
      phone: '+10000000000',
      clientType: inputs.clientType,
    },
    consumption: {
      monthlyKwh: inputs.monthlyKwh,
      timeProfile: 'mixed',   // perfil neutro para el preview
    },
    system: {
      systemType: inputs.systemType as SystemType,
    },
    installation: {
      mountingType: MOUNTING_TYPE_MAP[inputs.mountingType],
    },
  };

  // Adaptar QuoteConfig → SolarConfig
  // Los valores de tarifa son neutros — el preview solo muestra el costo de instalación,
  // no el análisis económico (eso requiere tarifas reales de la DB)
  const solarConfig: SolarConfig = {
    clients: {
      residential: {
        tariff: { energyCost: 0.15, fixedCharge: 10 },
        taxRate: 21,
        inflationRate: 4,
      },
      industrial: {
        tariff: { energyCost: 0.12, fixedCharge: 50 },
        taxRate: 21,
        inflationRate: 4,
      },
      agro: {
        tariff: { energyCost: 0.13, fixedCharge: 30 },
        taxRate: 10.5,
        inflationRate: 4,
      },
    },
    system: {
      panelPower: config.panelPower,
      panelEfficiency: 21,
      systemLosses: 100 - config.systemEfficiency,
      systemEfficiency: config.systemEfficiency,
      degradationRate: 0.5,
      peakSunHours: {
        day: config.peakSunHours,
        night: config.peakSunHours,   // preview usa el mismo valor para todos
        mixed: config.peakSunHours,
      },
    },
    costs: {
      panelCost: config.panelCost,
      inverterCost: config.inverterCost,
      inverterCostPerKw: config.inverterCostPerKw,
      baseInstallationFee: config.baseInstallationFee,
      laborCostPerKw: config.laborCostPerKw,
      structureCostPerPanel: config.structureCostPerPanel,
      marginPercentage: config.marginPercentage,
      mountingMultipliers: {
        'roof-sheet': config.mountingMultipliers.roofSheet,
        'roof-tile':  config.mountingMultipliers.roofTile,
        'ground':     config.mountingMultipliers.ground,
        'carport':    config.mountingMultipliers.carport,
      },
      systemExtraCostPerKw: {
        'on-grid':  config.systemExtraCostPerKw['on-grid'],
        'off-grid': config.systemExtraCostPerKw['off-grid'],
        'hybrid':   config.systemExtraCostPerKw['hybrid'],
      },
    },
    financing: {
      enabled: config.enableFinancing,
      downPaymentPercentage: 20,
      interestRate: config.interestRate,
      termMonths: config.loanTermYears * 12,
    },
  };

  const result = calculateSolarSystem(formData, solarConfig);

  return {
    systemSize: result.system.power,
    panelCount: result.system.panels,
    annualProduction: result.system.annualProduction,
    totalCost: result.costs.total,
    monthlySavings: result.economics.monthlySavings,
    paybackYears: result.economics.paybackYears,
  };
}