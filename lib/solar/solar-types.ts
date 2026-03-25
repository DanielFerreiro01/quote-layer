import { z } from 'zod';

/* ========================================
   ZOD SCHEMAS
   ======================================== */

export const ContactDataSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre es demasiado largo'),
  email: z
    .string()
    .email('Email inválido')
    .toLowerCase()
    .trim(),
  phone: z
    .string()
    .regex(
      /^\+?[1-9]\d{1,14}$/,
      'Teléfono inválido. Formato: +541112345678 o 1112345678'
    ),
  clientType: z.enum(['residential', 'industrial', 'agro'], {
    errorMap: () => ({ message: 'Tipo de cliente inválido' })
  }),
});

export const ConsumptionDataSchema = z.object({
  monthlyKwh: z
    .number()
    .min(100, 'El consumo mínimo es 100 kWh/mes')
    .max(50000, 'El consumo máximo es 50,000 kWh/mes'),
  timeProfile: z.enum(['day', 'night', 'mixed'], {
    errorMap: () => ({ message: 'Perfil de consumo inválido' })
  }),
});

export const SystemDataSchema = z.object({
  systemType: z.enum(['on-grid', 'off-grid', 'hybrid'], {
    errorMap: () => ({ message: 'Tipo de sistema inválido' })
  }),
});

export const InstallationDataSchema = z.object({
  mountingType: z.enum(['roof-sheet', 'roof-tile', 'ground', 'carport'], {
    errorMap: () => ({ message: 'Tipo de instalación inválido' })
  }),
});

export const FormDataSchema = z.object({
  contact: ContactDataSchema,
  consumption: ConsumptionDataSchema,
  system: SystemDataSchema,
  installation: InstallationDataSchema,
});

/* ========================================
   TYPESCRIPT TYPES
   ======================================== */

export type ClientType = z.infer<typeof ContactDataSchema>['clientType'];
export type TimeProfile = z.infer<typeof ConsumptionDataSchema>['timeProfile'];
export type SystemType = z.infer<typeof SystemDataSchema>['systemType'];
export type MountingType = z.infer<typeof InstallationDataSchema>['mountingType'];

export type ContactData = z.infer<typeof ContactDataSchema>;
export type ConsumptionData = z.infer<typeof ConsumptionDataSchema>;
export type SystemData = z.infer<typeof SystemDataSchema>;
export type InstallationData = z.infer<typeof InstallationDataSchema>;
export type FormData = z.infer<typeof FormDataSchema>;

/* ========================================
   SYSTEM TYPE COST MULTIPLIERS
   ======================================== */

/**
 * Costos adicionales fijos por tipo de sistema (USD por kW instalado).
 * On-grid: solo inversor grid-tie (ya contemplado en el cálculo base).
 * Off-grid: agrega baterías + inversor off-grid.
 * Hybrid: agrega baterías + inversor híbrido (mayor costo que off-grid puro).
 */
export const SYSTEM_TYPE_EXTRA_COST_PER_KW: Record<SystemType, number> = {
  'on-grid':  0,    // sin costo adicional — es el caso base
  'off-grid': 400,  // baterías + inversor off-grid
  'hybrid':   600,  // baterías + inversor híbrido
};

/* ========================================
   TIPOS DE CONFIGURACIÓN
   ======================================== */

export interface ElectricityTariff {
  energyCost: number;
  fixedCharge: number;
  demandCharge?: number;
}

export interface ClientConfig {
  tariff: ElectricityTariff;
  taxRate: number;
  inflationRate: number;
}

export interface SolarSystemConfig {
  panelPower: number;
  panelEfficiency: number;
  systemLosses: number;
  systemEfficiency: number;
  degradationRate: number;
  peakSunHours: {
    day: number;
    night: number;
    mixed: number;
  };
}

export interface CostConfig {
  panelCost: number;
  inverterCost: number;
  inverterCostPerKw: number;
  installationCostPerKw: number;
  structureCostPerKw: number;
  marginPercentage: number;
  mountingCosts: {
    [K in MountingType]: number;
  };
}

export interface FinancingConfig {
  enabled: boolean;
  downPaymentPercentage: number;
  interestRate: number;
  termMonths: number;
}

export interface SolarConfig {
  clients: {
    [K in ClientType]: ClientConfig;
  };
  system: SolarSystemConfig;
  costs: CostConfig;
  financing: FinancingConfig;
}

/* ========================================
   TIPOS DE RESULTADOS
   ======================================== */

export interface SystemDetails {
  power: number;
  panels: number;
  inverterPower: number;
  annualProduction: number;
  coveragePercentage: number;
  mountingType: MountingType;
  systemType: SystemType;
}

export interface CostBreakdown {
  panels: number;
  inverter: number;
  installation: number;
  structure: number;
  mounting: number;
  systemTypeExtra: number;
  subtotal: number;
  margin: number;
  total: number;
}

export interface FinancingOptions {
  enabled: boolean;
  downPayment: number;
  loanAmount: number;
  monthlyPayment: number;
  totalPayments: number;
  totalInterest: number;
}

export interface EconomicAnalysis {
  monthlyBillWithoutSolar: number;
  monthlyBillWithSolar: number;
  monthlySavings: number;
  annualSavings: number;
  paybackYears: number;
  roi25Years: number;
  projection: Array<{
    year: number;
    billWithoutSolar: number;
    billWithSolar: number;
    savings: number;
    cumulativeSavings: number;
  }>;
}

export interface SolarCalculation {
  system: SystemDetails;
  costs: CostBreakdown;
  financing: FinancingOptions;
  economics: EconomicAnalysis;
  calculatedAt: Date;
  config: SolarConfig;
  input: FormData;
}