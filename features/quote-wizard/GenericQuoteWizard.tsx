"use client";

import { useState, useCallback, useRef } from "react";
import { getQuoterPlugin } from "@/features/quoters/registry";
import { useWizardNavigation } from "./hooks/useWizardNavigation";
import { useWizardValidation } from "./hooks/useWizardValidation";
import { Wizard } from "./components/Wizard";
import type { QuoterStepContext } from "./types";

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

  const [formData, setFormData] = useState(plugin.initialFormData);
  const [calculationResult, setCalculationResult] = useState<unknown>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Ref para siempre tener el formData más actualizado en handleNext,
  // evitando el stale closure cuando React aún no commitó el último setState
  const formDataRef = useRef(formData);

  const handleFormChange = useCallback((data: unknown) => {
    formDataRef.current = data;
    setFormData(data);
  }, []);

  const handleNext = async () => {
    const currentStepConfig = plugin.wizardConfig.steps[navigation.currentStep - 1];

    // Usar ref para validación — garantiza el valor más reciente
    const currentFormData = formDataRef.current;

    if (!currentStepConfig?.skipValidation) {
      const stepData = plugin.getStepData(navigation.currentStep, currentFormData);
      const isValid = validateStep(navigation.currentStep, stepData);
      if (!isValid) return;
    }

    const isPreResultStep = navigation.currentStep === plugin.wizardConfig.totalSteps - 2;

    if (isPreResultStep && !calculationResult) {
      setIsCalculating(true);
      try {
        // Usar ref para el cálculo — garantiza el valor más reciente
        const result = await plugin.calculate(currentFormData, tenant);
        setCalculationResult(result);
        navigation.next();
      } catch (error) {
        console.error(`[${plugin.id}] Error en cálculo:`, error);
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
    render: () => stepRenderer.render(formData, handleFormChange, errors, context),
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