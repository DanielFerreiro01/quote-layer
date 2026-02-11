import { z } from 'zod';
import { ReactNode } from 'react';

/**
 * Configuración de un step individual del wizard
 */
export interface WizardStepConfig {
  id: string;
  label: string;
  shortLabel: string;
  component: string;
  skipValidation?: boolean;
}

/**
 * Step con su función de renderizado (usado en runtime)
 */
export interface WizardStep {
  id: string;
  label: string;
  shortLabel: string;
  render: () => ReactNode;
}

/**
 * Configuración de validación del wizard
 */
export interface WizardValidationConfig<T extends z.ZodRawShape = z.ZodRawShape> {
  schemas: Record<number, z.ZodObject<T>>;
}

/**
 * Configuración completa del wizard
 */
export interface WizardConfig<T extends z.ZodRawShape = z.ZodRawShape> {
  id: string;
  totalSteps: number;
  validation: WizardValidationConfig<T>;
  steps: WizardStepConfig[];
}

/**
 * Estado de navegación del wizard
 */
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

/**
 * Estado de validación del wizard
 */
export interface WizardValidation {
  errors: Record<string, string>;
  validateStep: (step: number, data: unknown) => boolean;
  clearErrors: () => void;
}