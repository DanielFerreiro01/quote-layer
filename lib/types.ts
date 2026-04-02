// ============================================
// QUOTE CONFIG TYPES — Dashboard
// Representa la configuración editable en quote-config
// Se convierte a SolarConfig para el cálculo real
// ============================================

export interface QuoteConfig {
  // Sistema
  panelPower: number;
  systemEfficiency: number;  // 0-100 (%)
  peakSunHours: number;

  // Equipamiento
  panelCost: number;
  inverterCost: number;
  inverterCostPerKw: number;

  // Operativo
  baseInstallationFee: number;
  laborCostPerKw: number;
  structureCostPerPanel: number;

  // Multiplicadores de montaje
  mountingMultipliers: {
    roofSheet: number;
    roofTile: number;
    ground: number;
    carport: number;
  };

  // Extra por tipo de sistema
  systemExtraCostPerKw: {
    "on-grid": number;
    "off-grid": number;
    "hybrid": number;
  };

  // Financiero
  marginPercentage: number;
  enableFinancing: boolean;
  interestRate: number;
  loanTermYears: number;
}

export interface QuotePreviewInputs {
  monthlyKwh: number;
  clientType: "residential" | "industrial" | "agro";
  mountingType: "roofSheet" | "roofTile" | "ground" | "carport";
  systemType: "on-grid" | "off-grid" | "hybrid";
}

export interface QuoteCalculationOutputs {
  systemSize: number;
  panelCount: number;
  annualProduction: number;
  totalCost: number;
  monthlySavings: number;
  paybackYears: number;
}

export const defaultQuoteConfig: QuoteConfig = {
  panelPower: 550,
  systemEfficiency: 85,
  peakSunHours: 5,

  panelCost: 200,
  inverterCost: 500,
  inverterCostPerKw: 300,

  baseInstallationFee: 300,
  laborCostPerKw: 150,
  structureCostPerPanel: 45,

  mountingMultipliers: {
    roofSheet: 1.0,
    roofTile: 1.2,
    ground: 1.3,
    carport: 1.4,
  },

  systemExtraCostPerKw: {
    "on-grid": 0,
    "off-grid": 400,
    "hybrid": 600,
  },

  marginPercentage: 20,
  enableFinancing: true,
  interestRate: 8,
  loanTermYears: 5,
};