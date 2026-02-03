"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useParams } from "next/navigation"
import { useSolarQuote } from "@/hooks/solar/useSolarQuote";
import { JSX, useState } from "react";
import { StepContact } from "@/components/solar-quote/step-contact";
import { ProgressSteps } from "@/components/layout/widgets/progress-steps";
import NavigationSteps from "@/components/layout/widgets/NavigationSteps";
import { StepConsumption } from "../../../../components/solar-quote/step-consumption";
import { StepInstallation } from "@/components/solar-quote/step-installation";
import { calculateSolarQuote } from "@/app/actions/solar/calculate-solar-quote";
import type { SolarCalculation } from "@/lib/solar-types";
import { StepResults } from "@/components/solar-quote/step-results";
import { StepCTA } from "@/components/solar-quote/step-cta";

const STEPS = [
  { label: "Información de contacto", shortLabel: "Contacto" },
  { label: "Consumo energético", shortLabel: "Consumo" },
  { label: "Tipo de instalación", shortLabel: "Instalación" },
  { label: "Resultados", shortLabel: "Resultados" },
  { label: "Contactar", shortLabel: "Contactar" },
];

export default function SolarQuoteWizard() {
  const {
    currentStep,
    isFirst,
    isLast,
    formData,
    errors,
    validateCurrentStep,
    next,
    back,
    updateContact,
    updateConsumption,
    updateInstallation,
  } = useSolarQuote(STEPS.length);

  const [calculation, setCalculation] = useState<SolarCalculation | null>(null);

  const [isCalculating, setIsCalculating] = useState(false);

  const { tenant } = useParams<{ tenant: string }>()
  const PROVIDER_SLUG = tenant

  const handleNext = async () => {
    const isValid = validateCurrentStep();
    if (!isValid) return;

    if (currentStep === 3 && !calculation) {
      setIsCalculating(true);

      try {
        const result = await calculateSolarQuote(PROVIDER_SLUG, formData);

        setCalculation(result);
      } catch (error) {
        console.error(error);
        return;
      } finally {
        setIsCalculating(false);
      }
    }

    next();
  };

  const STEP_COMPONENTS: Record<number, JSX.Element | null> = {
    1: (
      <StepContact
        data={formData.contact}
        errors={errors}
        onChange={updateContact}
      />
    ),
    2: (
      <StepConsumption
        data={formData.consumption}
        onChange={updateConsumption}
      />
    ),
    3: (
      <StepInstallation
        data={formData.installation}
        onChange={updateInstallation}
      />
    ),
    4: isCalculating ? (
      <p className="text-center text-muted-foreground">
        Calculando cotización...
      </p>
    ) : calculation ? (
      <StepResults calculation={calculation} />
    ) : null,
    5: (
      <StepCTA formData={formData} calculation={calculation!} />
    )
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8">
        <ProgressSteps
          currentStep={currentStep}
          totalSteps={STEPS.length}
          steps={STEPS}
        />
      </div>

      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div key={currentStep}>
            {STEP_COMPONENTS[currentStep]}
          </motion.div>
        </AnimatePresence>
      </div>

      <NavigationSteps
        isFirst={isFirst}
        isLast={isLast}
        onNext={handleNext}
        onBack={back}
        disabled={isCalculating}
        nextLabel={
          currentStep === STEPS.length - 1 ? "Ver cotización" : "Siguiente"
        }
      />
    </main>
  );
}
