import { z } from 'zod';
import { ReactNode } from 'react';

// ============================================
// WIZARD KERNEL TYPES
// ============================================

export interface WizardStepConfig {
  id: string;
  label: string;
  shortLabel: string;
  component: string;
  skipValidation?: boolean;
}

export interface WizardStep {
  id: string;
  label: string;
  shortLabel: string;
  render: () => ReactNode;
}

export interface WizardValidationConfig<T extends z.ZodRawShape = z.ZodRawShape> {
  schemas: Record<number, z.ZodObject<T>>;
}

export interface WizardConfig<T extends z.ZodRawShape = z.ZodRawShape> {
  id: string;
  totalSteps: number;
  validation: WizardValidationConfig<T>;
  steps: WizardStepConfig[];
}

export interface WizardNavigation {
  currentStep: number;
  totalSteps: number;
  isFirst: boolean;
  isLast: boolean;
  next: () => void;
  back: () => void;
  goTo: (step: number) => void;
  reset: () => void;
}

export interface WizardValidation {
  errors: Record<string, string>;
  validateStep: (step: number, data: unknown) => boolean;
  clearErrors: () => void;
}

// ============================================
// QUOTER PLUGIN INTERFACE
// ============================================

/**
 * Datos resumidos de un lead para mostrar en el dashboard.
 * Cada plugin define cómo representar su resultado en formato genérico.
 */
export interface LeadSummaryData {
  primaryValue: string;    // "$21,250"
  primaryLabel: string;    // "Inversión estimada"
  secondaryValue: string;  // "8.5 kW"
  secondaryLabel: string;  // "Potencia del sistema"
  badge: string;           // "Solar", "Gym", etc.
  extraValues?: {
    label: string;
    value: string;
  }[];
}

/**
 * Step renderizable de un plugin.
 * Recibe los datos del formulario y un callback de cambio.
 */
export interface WizardStepRenderer<TFormData> {
  id: string;
  label: string;
  shortLabel: string;
  skipValidation?: boolean;
  render: (
    data: TFormData,
    onChange: (data: TFormData) => void,
    errors: Record<string, string>,
    context: QuoterStepContext,
  ) => ReactNode;
}

/**
 * Contexto disponible para cada step durante el render.
 */
export interface QuoterStepContext {
  tenant: string;
  isCalculating: boolean;
  calculationResult: unknown;
}

/**
 * Contrato que todo plugin de cotizador debe cumplir.
 *
 * TFormData: tipo de los datos del formulario (ej: SolarFormData)
 * TResult:   tipo del resultado del cálculo (ej: SolarCalculation)
 * TConfig:   tipo de la configuración del provider (ej: SolarConfig)
 */
export interface QuoterPlugin<
  TFormData = unknown,
  TResult = unknown,
  TConfig = unknown,
> {
  // Identidad
  id: string;
  label: string;
  icon: ReactNode;
  description: string;

  // Configuración del wizard (steps, validaciones)
  wizardConfig: WizardConfig;

  // Steps con su lógica de renderizado
  steps: WizardStepRenderer<TFormData>[];

  // Estado inicial del formulario
  initialFormData: TFormData;

  // Extrae los datos relevantes para validar un step específico
  // step 1 → contact, step 2 → consumption, step 3 → installation, etc.
  getStepData: (step: number, formData: TFormData) => unknown;

  // Lógica de negocio: calcula el resultado a partir del formulario y la config
  calculate: (formData: TFormData, tenant: string) => Promise<TResult>;

  // Para el dashboard: cómo resumir un resultado en formato genérico
  renderLeadSummary: (result: TResult) => LeadSummaryData;

  // Para el dashboard: detalle completo de un lead (usado en LeadDetailsSheet)
  renderLeadDetail: (result: TResult) => ReactNode;
}