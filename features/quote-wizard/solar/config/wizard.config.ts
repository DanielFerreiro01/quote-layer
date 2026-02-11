// ✅ features/quote-wizard/solar/config/wizard.config.ts
import { z } from 'zod';
import type { WizardConfig } from '../../core/types';
import { ContactDataSchema, ConsumptionDataSchema, InstallationDataSchema } from '../validations/solar.schemas';

export const SOLAR_WIZARD_CONFIG: WizardConfig = {
  id: 'solar-quote',
  totalSteps: 5,
  
  validation: {
    schemas: {
      1: ContactDataSchema,
      2: ConsumptionDataSchema,
      3: InstallationDataSchema,
    },
  },
  
  steps: [
    {
      id: 'contact',
      label: 'Información de contacto',
      shortLabel: 'Contacto',
      component: 'StepContact',
    },
    {
      id: 'consumption',
      label: 'Consumo energético',
      shortLabel: 'Consumo',
      component: 'StepConsumption',
    },
    {
      id: 'installation',
      label: 'Tipo de instalación',
      shortLabel: 'Instalación',
      component: 'StepInstallation',
    },
    {
      id: 'results',
      label: 'Resultados',
      shortLabel: 'Resultados',
      component: 'StepResults',
      skipValidation: true,
    },
    {
      id: 'cta',
      label: 'Contactar',
      shortLabel: 'Contactar',
      component: 'StepCTA',
      skipValidation: true,
    },
  ],
};