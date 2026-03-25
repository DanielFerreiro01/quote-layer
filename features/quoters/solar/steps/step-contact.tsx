// steps/step-contact.tsx
"use client";

import { User, Mail, Phone } from "lucide-react";

import { TextInputField } from "../components/fields/TextInputField";
import { OptionCard } from "../components/fields/OptionCard";
import { useFieldHandlers } from "../hooks/useFieldHandlers";
import { CLIENT_TYPE_OPTIONS } from "../config/contact.config";
import type { ContactData } from "@/lib/solar/solar-types";
import { StepLayout } from "../components/layout/StepLayout";

interface StepContactProps {
  data: ContactData;
  onChange: (data: ContactData) => void;
  errors: Record<string, string>;
}

export function StepContact({ data, onChange, errors }: StepContactProps) {
  const { handleFieldChange } = useFieldHandlers(data, onChange);

  return (
    <StepLayout
      title="Información de contacto"
      description="Cuéntanos sobre ti para personalizar tu cotización solar."
    >
      <div className="grid gap-6">
        <TextInputField
          id="name"
          label="Nombre completo"
          placeholder="Juan Pérez"
          value={data.name}
          error={errors.name}
          icon={<User className="h-4 w-4" />}
          onChange={(value) => handleFieldChange('name', value)}
        />

        <TextInputField
          id="email"
          type="email"
          label="Correo electrónico"
          placeholder="juan@ejemplo.com"
          value={data.email}
          error={errors.email}
          icon={<Mail className="h-4 w-4" />}
          onChange={(value) => handleFieldChange('email', value)}
        />

        <TextInputField
          id="phone"
          type="tel"
          label="Teléfono"
          placeholder="+54 9 11 1234-5678"
          value={data.phone}
          error={errors.phone}
          icon={<Phone className="h-4 w-4" />}
          onChange={(value) => handleFieldChange('phone', value)}
        />

        <div className="space-y-3">
          <label className="text-sm font-medium block">Tipo de cliente</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {CLIENT_TYPE_OPTIONS.map((option) => (
              <OptionCard
                key={option.value}
                value={option.value}
                label={option.label}
                description={option.description}
                icon={option.icon}
                isSelected={data.clientType === option.value}
                onSelect={(value) => handleFieldChange('clientType', value)}
              />
            ))}
          </div>
        </div>
      </div>
    </StepLayout>
  );
}