import type { WizardConfig } from "@/features/quote-wizard/types";
import {
  ContactDataSchema,
  ConsumptionDataSchema,
  SystemDataSchema,
  InstallationDataSchema,
} from "../validations/solar.schemas";

export const SOLAR_WIZARD_CONFIG: WizardConfig = {
  id: "solar-quote",
  totalSteps: 6,

  validation: {
    schemas: {
      1: ContactDataSchema,
      2: ConsumptionDataSchema,
      3: SystemDataSchema,
      4: InstallationDataSchema,
    },
  },

  steps: [
    {
      id: "contact",
      label: "Información de contacto",
      shortLabel: "Contacto",
      component: "StepContact",
    },
    {
      id: "consumption",
      label: "Consumo energético",
      shortLabel: "Consumo",
      component: "StepConsumption",
    },
    {
      id: "system",
      label: "Tipo de sistema",
      shortLabel: "Sistema",
      component: "StepSystem",
    },
    {
      id: "installation",
      label: "Tipo de instalación",
      shortLabel: "Instalación",
      component: "StepInstallation",
    },
    {
      id: "results",
      label: "Resultados",
      shortLabel: "Resultados",
      component: "StepResults",
      skipValidation: true,
    },
    {
      id: "cta",
      label: "Contactar",
      shortLabel: "Contactar",
      component: "StepCTA",
      skipValidation: true,
    },
  ],
};