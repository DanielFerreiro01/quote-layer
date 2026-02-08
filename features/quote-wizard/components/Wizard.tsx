"use client";

import { AnimatePresence, motion } from "framer-motion";
import { WizardStep } from "../types";
import { ProgressSteps } from "./ProgressSteps";
import NavigationSteps from "./NavigationSteps";

interface WizardProps {
  steps: WizardStep[];
  currentStep: number;
  isFirst: boolean;
  isLast: boolean;
  onNext: () => void;
  onBack: () => void;
  disabled?: boolean;
}

export function Wizard({
  steps,
  currentStep,
  isFirst,
  isLast,
  onNext,
  onBack,
  disabled = false,
}: WizardProps) {
  const step = steps[currentStep - 1];

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8">
        <ProgressSteps
          currentStep={currentStep}
          totalSteps={steps.length}
          steps={steps}
        />
      </div>

      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div key={step.id}>
            {step.render()}
          </motion.div>
        </AnimatePresence>
      </div>

      <NavigationSteps
        isFirst={isFirst}
        isLast={isLast}
        onNext={onNext}
        onBack={onBack}
        disabled={disabled}
      />
    </main>
  );
}
