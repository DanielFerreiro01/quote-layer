// ✅ lib/solar/solar-types.ts (MODIFICADO)
import { z } from 'zod';

/* ========================================
   ZOD SCHEMAS (NUEVOS - Validación Runtime)
   ======================================== */

/**
 * Schema para datos de contacto
 */
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

/**
 * Schema para datos de consumo
 */
export const ConsumptionDataSchema = z.object({
  monthlyKwh: z
    .number()
    .min(100, 'El consumo mínimo es 100 kWh/mes')
    .max(50000, 'El consumo máximo es 50,000 kWh/mes'),
  
  timeProfile: z.enum(['day', 'night', 'mixed'], {
    errorMap: () => ({ message: 'Perfil de consumo inválido' })
  }),
});

/**
 * Schema para datos de instalación
 */
export const InstallationDataSchema = z.object({
  mountingType: z.enum(['roof-sheet', 'roof-tile', 'ground', 'carport'], {
    errorMap: () => ({ message: 'Tipo de instalación inválido' })
  }),
});

/**
 * Schema completo del formulario
 */
export const FormDataSchema = z.object({
  contact: ContactDataSchema,
  consumption: ConsumptionDataSchema,
  installation: InstallationDataSchema,
});

/* ========================================
   TYPESCRIPT TYPES (Inferidos de Zod)
   ======================================== */

/**
 * Tipo de cliente
 */
export type ClientType = z.infer<typeof ContactDataSchema>['clientType'];

/**
 * Perfil temporal de consumo
 */
export type TimeProfile = z.infer<typeof ConsumptionDataSchema>['timeProfile'];

/**
 * Tipo de montaje/instalación
 */
export type MountingType = z.infer<typeof InstallationDataSchema>['mountingType'];

/**
 * Datos de contacto del cliente
 */
export type ContactData = z.infer<typeof ContactDataSchema>;

/**
 * Datos de consumo energético
 */
export type ConsumptionData = z.infer<typeof ConsumptionDataSchema>;

/**
 * Datos de instalación
 */
export type InstallationData = z.infer<typeof InstallationDataSchema>;

/**
 * Datos completos del formulario
 */
export type FormData = z.infer<typeof FormDataSchema>;

/* ========================================
   TIPOS DE CONFIGURACIÓN (No cambian)
   ======================================== */

/**
 * Configuración de tarifa eléctrica
 */
export interface ElectricityTariff {
  energyCost: number;      // $/kWh
  fixedCharge: number;     // $ mensuales
  demandCharge?: number;   // $/kW (opcional para industrial)
}

/**
 * Configuración específica por tipo de cliente
 */
export interface ClientConfig {
  tariff: ElectricityTariff;
  taxRate: number;         // % impuestos
  inflationRate: number;   // % anual
}

/**
 * Configuración de sistema solar
 */
export interface SolarSystemConfig {
  panelPower: number;           // Watts por panel
  panelEfficiency: number;      // %
  systemLosses: number;         // %
  degradationRate: number;      // % anual
  peakSunHours: {
    day: number;
    night: number;
    mixed: number;
  };
}

/**
 * Configuración de costos
 */
export interface CostConfig {
  panelCost: number;            // $ por panel
  inverterCost: number;         // $ base
  inverterCostPerKw: number;    // $ por kW
  installationCostPerKw: number; // $ por kW
  structureCostPerKw: number;   // $ por kW
  marginPercentage: number;     // %
  
  // Costos según tipo de montaje
  mountingCosts: {
    [K in MountingType]: number; // $ por kW
  };
}

/**
 * Configuración financiera
 */
export interface FinancingConfig {
  enabled: boolean;
  downPaymentPercentage: number; // %
  interestRate: number;          // % anual
  termMonths: number;            // meses
}

/**
 * Configuración completa del proveedor
 */
export interface SolarConfig {
  clients: {
    [K in ClientType]: ClientConfig;
  };
  system: SolarSystemConfig;
  costs: CostConfig;
  financing: FinancingConfig;
}

/* ========================================
   TIPOS DE RESULTADOS (No cambian)
   ======================================== */

/**
 * Detalles del sistema solar calculado
 */
export interface SystemDetails {
  power: number;              // kW
  panels: number;             // cantidad
  inverterPower: number;      // kW
  annualProduction: number;   // kWh/año
  coveragePercentage: number; // %
  mountingType: MountingType;
}

/**
 * Desglose de costos
 */
export interface CostBreakdown {
  panels: number;
  inverter: number;
  installation: number;
  structure: number;
  mounting: number;
  subtotal: number;
  margin: number;
  total: number;
}

/**
 * Opciones de financiamiento
 */
export interface FinancingOptions {
  enabled: boolean;
  downPayment: number;
  loanAmount: number;
  monthlyPayment: number;
  totalPayments: number;
  totalInterest: number;
}

/**
 * Análisis económico
 */
export interface EconomicAnalysis {
  monthlyBillWithoutSolar: number;
  monthlyBillWithSolar: number;
  monthlySavings: number;
  annualSavings: number;
  paybackYears: number;
  roi25Years: number;
  
  // Proyección a 25 años
  projection: Array<{
    year: number;
    billWithoutSolar: number;
    billWithSolar: number;
    savings: number;
    cumulativeSavings: number;
  }>;
}

/**
 * Resultado completo del cálculo
 */
export interface SolarCalculation {
  system: SystemDetails;
  costs: CostBreakdown;
  financing: FinancingOptions;
  economics: EconomicAnalysis;
  
  // Metadata
  calculatedAt: Date;
  config: SolarConfig;
  input: FormData;
}