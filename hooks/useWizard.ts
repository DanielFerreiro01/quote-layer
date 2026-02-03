import { useState } from "react";

export function useWizard(totalSteps: number) {
  const [currentStep, setCurrentStep] = useState(1);

  const next = () =>
    setCurrentStep((s) => Math.min(s + 1, totalSteps));

  const back = () =>
    setCurrentStep((s) => Math.max(s - 1, 1));

  return {
    currentStep,
    next,
    back,
    isFirst: currentStep === 1,
    isLast: currentStep === totalSteps,
    totalSteps,
  };
}
