"use client";

import { useState, useCallback } from "react";
import { getQuoterPlugin } from "@/features/quoters/registry";
import { useWizardNavigation } from "./hooks/useWizardNavigation";
import { useWizardValidation } from "./hooks/useWizardValidation";
import { useSaveQuote } from "@/features/quote-wizard/hooks/useSaveQuote";
import { Wizard } from "./components/Wizard";
import type { QuoterStepContext } from "./types";
import type { FormData, SolarCalculation } from "@/lib/solar/solar-types";

interface GenericQuoteWizardProps {
  quoterId: string;
  tenant: string;
}

export function GenericQuoteWizard({ quoterId, tenant }: GenericQuoteWizardProps) {
  const plugin = getQuoterPlugin(quoterId);
  if (!plugin) return null;
  return <QuoteWizardInner plugin={plugin} tenant={tenant} />;
}

function QuoteWizardInner({
  plugin,
  tenant,
}: {
  plugin: NonNullable<ReturnType<typeof getQuoterPlugin>>;
  tenant: string;
}) {
  const navigation = useWizardNavigation(plugin.wizardConfig.totalSteps);
  const { errors, validateStep } = useWizardValidation(plugin.wizardConfig.validation);
  const { mutate: saveQuote } = useSaveQuote();

  const [formData, setFormData] = useState(plugin.initialFormData);
  const [calculationResult, setCalculationResult] = useState<unknown>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleFormChange = useCallback((data: unknown) => {
    setFormData(data);
  }, []);

  const handleNext = async () => {
    const currentStepConfig = plugin.wizardConfig.steps[navigation.currentStep - 1];

    if (!currentStepConfig?.skipValidation) {
      const stepData = plugin.getStepData(navigation.currentStep, formData);
      const isValid = validateStep(navigation.currentStep, stepData);
      if (!isValid) return;
    }

    // The step just before results triggers the calculation
    const isPreResultStep =
      navigation.currentStep === plugin.wizardConfig.totalSteps - 2;

    if (isPreResultStep && !calculationResult) {
      setIsCalculating(true);
      try {
        const result = await plugin.calculate(formData, tenant);
        setCalculationResult(result);

        // Fire-and-forget: persist quote + lead. We don't block navigation
        // on the save — the user sees results immediately. If save fails it
        // logs server-side; we can add a toast here if needed.
        saveQuote(
          {
            tenant,
            formData: formData as FormData,
            calculation: result as SolarCalculation,
          },
          {
            onError: (err) => {
              console.error("[GenericQuoteWizard] saveQuote failed:", err);
            },
          },
        );

        navigation.next();
      } catch (error) {
        console.error(`[${plugin.id}] Calculation error:`, error);
      } finally {
        setIsCalculating(false);
      }
      return;
    }

    navigation.next();
  };

  const context: QuoterStepContext = {
    tenant,
    isCalculating,
    calculationResult,
  };

  const steps = plugin.steps.map((stepRenderer) => ({
    id: stepRenderer.id,
    label: stepRenderer.label,
    shortLabel: stepRenderer.shortLabel,
    render: () =>
      stepRenderer.render(formData, handleFormChange, errors, context),
  }));

  return (
    <Wizard
      steps={steps}
      currentStep={navigation.currentStep}
      isFirst={navigation.isFirst}
      isLast={navigation.isLast}
      onNext={handleNext}
      onBack={navigation.back}
      disabled={isCalculating}
    />
  );
}