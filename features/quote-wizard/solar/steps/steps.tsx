// features/quote-wizard/solar/steps/steps.ts
import { WizardStep } from "@/features/quote-wizard/types";

import {
  StepContact,
  StepConsumption,
  StepInstallation,
  StepResults,
  StepCTA,
} from ".";

import type {
  FormData,
  ContactData,
  ConsumptionData,
  InstallationData,
  SolarCalculation,
} from "@/lib/solar/solar-types";

interface CreateSolarStepsArgs {
  formData: FormData;
  errors: Record<string, string>;
  calculation: SolarCalculation | null;
  isCalculating: boolean;
  updateContact: (data: ContactData) => void;
  updateConsumption: (data: ConsumptionData) => void;
  updateInstallation: (data: InstallationData) => void;
}

export function createSolarSteps({
  formData,
  errors,
  calculation,
  isCalculating,
  updateContact,
  updateConsumption,
  updateInstallation,
}: CreateSolarStepsArgs): WizardStep[] {
  return [
    {
      id: "contact",
      label: "Información de contacto",
      shortLabel: "Contacto",
      render: () => (
        <StepContact
          data={formData.contact}
          errors={errors}
          onChange={updateContact}
        />
      ),
    },
    {
      id: "consumption",
      label: "Consumo energético",
      shortLabel: "Consumo",
      render: () => (
        <StepConsumption
          data={formData.consumption}
          onChange={updateConsumption}
        />
      ),
    },
    {
      id: "installation",
      label: "Tipo de instalación",
      shortLabel: "Instalación",
      render: () => (
        <StepInstallation
          data={formData.installation}
          onChange={updateInstallation}
        />
      ),
    },
    {
      id: "results",
      label: "Resultados",
      shortLabel: "Resultados",
      render: () =>
        isCalculating ? (
          <p className="text-center text-muted-foreground">
            Calculando cotización...
          </p>
        ) : calculation ? (
          <StepResults calculation={calculation} />
        ) : null,
    },
    {
      id: "cta",
      label: "Contactar",
      shortLabel: "Contactar",
      render: () =>
        calculation ? (
          <StepCTA formData={formData} calculation={calculation} />
        ) : null,
    },
  ];
}
