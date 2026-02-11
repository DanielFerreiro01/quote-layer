"use client";

import { useParams } from "next/navigation";
import { useWizardNavigation } from "../core/hooks/useWizardNavigation";
import { useWizardValidation } from "../core/hooks/useWizardValidation";
import { useSolarQuoteForm } from "./hooks/useSolarQuoteForm";
import { useSolarCalculation } from "./hooks/useSolarCalculation";
import { SOLAR_WIZARD_CONFIG } from "./config/wizard.config";
import { Wizard } from "../components/Wizard";
import { StepConsumption, StepContact, StepCTA, StepInstallation, StepResults } from "./steps";


const STEP_COMPONENTS = {
  StepContact,
  StepConsumption,
  StepInstallation,
  StepResults,
  StepCTA,
};

export default function SolarQuoteWizard() {
  const { tenant } = useParams<{ tenant: string }>();
  
  // ✅ Hooks separados por responsabilidad
  const navigation = useWizardNavigation(SOLAR_WIZARD_CONFIG.totalSteps);
  const { formData, updateContact, updateConsumption, updateInstallation } = useSolarQuoteForm();
  const { errors, validateStep } = useWizardValidation(SOLAR_WIZARD_CONFIG.validation);
  const calculation = useSolarCalculation(tenant);

  // ✅ Handler limpio
  const handleNext = async () => {
    const currentStepConfig = SOLAR_WIZARD_CONFIG.steps[navigation.currentStep - 1];
    
    // Validar step actual
    if (!currentStepConfig.skipValidation) {
      const isValid = validateStep(navigation.currentStep, getStepData(navigation.currentStep));
      if (!isValid) return;
    }

    // Calcular cotización en step 3
    if (navigation.currentStep === 3 && !calculation.data) {
      calculation.mutate(formData);
    }

    navigation.next();
  };

  const getStepData = (step: number) => {
    switch (step) {
      case 1: return formData.contact;
      case 2: return formData.consumption;
      case 3: return formData.installation;
      default: return {};
    }
  };

  // ✅ Renderizar steps dinámicamente
  const steps = SOLAR_WIZARD_CONFIG.steps.map((config) => {
    const StepComponent = STEP_COMPONENTS[config.component as keyof typeof STEP_COMPONENTS];
    
    return {
      id: config.id,
      label: config.label,
      shortLabel: config.shortLabel,
      render: () => {
        switch (config.id) {
          case 'contact':
            return <StepContact data={formData.contact} onChange={updateContact} errors={errors} />;
          case 'consumption':
            return <StepConsumption data={formData.consumption} onChange={updateConsumption} />;
          case 'installation':
            return <StepInstallation data={formData.installation} onChange={updateInstallation} />;
          case 'results':
            return calculation.data ? <StepResults calculation={calculation.data} /> : null;
          case 'cta':
            return calculation.data ? <StepCTA formData={formData} calculation={calculation.data} /> : null;
          default:
            return null;
        }
      },
    };
  });

  return (
    <Wizard
      steps={steps}
      currentStep={navigation.currentStep}
      isFirst={navigation.isFirst}
      isLast={navigation.isLast}
      onNext={handleNext}
      onBack={navigation.back}
      disabled={calculation.isPending}
    />
  );
}