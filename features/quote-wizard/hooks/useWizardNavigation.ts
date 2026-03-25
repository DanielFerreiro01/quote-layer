import { useCallback, useState } from "react";


export function useWizardNavigation(totalSteps: number) {
  const [currentStep, setCurrentStep] = useState(1);

  const next = useCallback(() => {
    setCurrentStep((s) => Math.min(s + 1, totalSteps));
  }, [totalSteps]);

  const back = useCallback(() => {
    setCurrentStep((s) => Math.max(s - 1, 1));
  }, []);

  const goTo = useCallback((step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  }, [totalSteps]);

  return {
    currentStep,
    totalSteps,
    isFirst: currentStep === 1,
    isLast: currentStep === totalSteps,
    next,
    back,
    goTo,
  };
}