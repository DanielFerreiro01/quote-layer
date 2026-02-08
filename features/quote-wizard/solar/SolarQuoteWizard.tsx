"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import { Wizard } from "@/features/quote-wizard/components/Wizard";
import { createSolarSteps } from "./steps/steps";
import { useSolarQuote } from "@/features/quote-wizard/hooks/solar/useSolarQuote";
import { calculateSolarQuote } from "@/app/actions/solar/calculate-solar-quote";
import { SolarCalculation } from "@/lib/solar/solar-types";

export default function SolarQuoteWizard() {
  const wizard = useSolarQuote(5);
  const { tenant } = useParams<{ tenant: string }>();

  const [calculation, setCalculation] =
    useState<SolarCalculation | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleNext = async () => {
    const isValid = wizard.validateCurrentStep();
    if (!isValid) return;

    if (wizard.currentStep === 3 && !calculation) {
      setIsCalculating(true);
      try {
        const result = await calculateSolarQuote(
          tenant,
          wizard.formData
        );
        setCalculation(result);
      } finally {
        setIsCalculating(false);
      }
    }

    wizard.next();
  };

  const steps = createSolarSteps({
    formData: wizard.formData,
    errors: wizard.errors,
    calculation,
    isCalculating,
    updateContact: wizard.updateContact,
    updateConsumption: wizard.updateConsumption,
    updateInstallation: wizard.updateInstallation,
  });

  return (
    <Wizard
      steps={steps}
      currentStep={wizard.currentStep}
      isFirst={wizard.isFirst}
      isLast={wizard.isLast}
      onNext={handleNext}
      onBack={wizard.back}
      disabled={isCalculating}
    />
  );
}
