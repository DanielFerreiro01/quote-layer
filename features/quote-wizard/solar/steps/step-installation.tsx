// steps/step-installation.tsx
"use client";

import { useFieldHandlers } from "../hooks/useFieldHandlers";
import { MOUNTING_TYPE_OPTIONS } from "../config/installation.config";
import type { InstallationData } from "@/lib/solar/solar-types";
import { StepLayout } from "../components/layout/StepLayout";
import { InstallationOptionCard } from "../components/fields/InstallationOptionCard";

interface StepInstallationProps {
  data: InstallationData;
  onChange: (data: InstallationData) => void;
}

export function StepInstallation({ data, onChange }: StepInstallationProps) {
  const { handleFieldChange } = useFieldHandlers(data, onChange);

  return (
    <StepLayout
      title="Tipo de instalación"
      description="Selecciona dónde se instalarán tus paneles solares."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOUNTING_TYPE_OPTIONS.map((option, index) => (
          <InstallationOptionCard
            key={option.value}
            index={index}
            value={option.value}
            label={option.label}
            description={option.description}
            icon={option.icon}
            features={option.features}
            isSelected={data.mountingType === option.value}
            onSelect={(value) => handleFieldChange('mountingType', value)}
          />
        ))}
      </div>
    </StepLayout>
  );
}