// ============================================
// QUOTE CONFIG TYPES
// ============================================

export interface QuoteConfig {
  // General Settings
  baseCostPerKw: number;
  electricityCostPerKwh: number;
  panelPower: number;
  systemEfficiency: number;
  peakSunHours: number;
  
  // Client Type Multipliers
  clientMultipliers: {
    residential: number;
    industrial: number;
    agro: number;
  };
  
  // Mounting Type Multipliers
  mountingMultipliers: {
    roofSheet: number;
    roofTile: number;
    ground: number;
    carport: number;
  };
  
  // Financial Settings
  marginPercentage: number;
  enableFinancing: boolean;
  interestRate: number;
  loanTermYears: number;
}

// ============================================
// QUOTE PREVIEW INPUTS
// ============================================

export interface QuotePreviewInputs {
  monthlyKwh: number;
  clientType: 'residential' | 'industrial' | 'agro';
  mountingType: 'roofSheet' | 'roofTile' | 'ground' | 'carport';
}

// ============================================
// QUOTE CALCULATION OUTPUTS
// ============================================

export interface QuoteCalculationOutputs {
  systemSize: number;          // kW
  panelCount: number;
  annualProduction: number;    // kWh
  totalCost: number;           // $
  monthlySavings: number;      // $
  paybackYears: number;
}

// ============================================
// DEFAULT CONFIGURATION
// ============================================

export const defaultQuoteConfig: QuoteConfig = {
  // General Settings
  baseCostPerKw: 1200,
  electricityCostPerKwh: 0.15,
  panelPower: 550,              // Watts
  systemEfficiency: 0.85,       // 85%
  peakSunHours: 5,             // hours per day
  
  // Client Type Multipliers
  clientMultipliers: {
    residential: 1.0,
    industrial: 0.9,
    agro: 0.95,
  },
  
  // Mounting Type Multipliers
  mountingMultipliers: {
    roofSheet: 1.0,
    roofTile: 1.15,
    ground: 1.25,
    carport: 1.35,
  },
  
  // Financial Settings
  marginPercentage: 25,
  enableFinancing: true,
  interestRate: 8.5,
  loanTermYears: 10,
};