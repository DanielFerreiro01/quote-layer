"use client";

import { GenericQuoteWizard } from "@/features/quote-wizard/GenericQuoteWizard";

interface SolarQuoteWizardProps {
  tenant: string;
}

/**
 * Punto de entrada del wizard solar.
 * Toda la lógica vive en SolarPlugin y GenericQuoteWizard.
 */
export default function SolarQuoteWizard({ tenant }: SolarQuoteWizardProps) {
  return <GenericQuoteWizard quoterId="solar" tenant={tenant} />;
}