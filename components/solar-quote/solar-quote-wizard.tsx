"use client";

import { useState, useMemo, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { ProgressSteps } from "../layout/widgets/progress-steps";
import { StepContact } from "./step-contact";
import { StepConsumption } from "./step-consumption";
import { StepInstallation } from "./step-installation";
import { StepResults } from "./step-results";
import { StepCTA } from "./step-cta";
import { calculateSolarSystem } from "@/lib/solar-calculations";
import type {
  FormData,
  ContactData,
  ConsumptionData,
  InstallationData,
} from "@/lib/solar-types";

const STEPS = [
  { label: "Información de contacto", shortLabel: "Contacto" },
  { label: "Consumo energético", shortLabel: "Consumo" },
  { label: "Tipo de instalación", shortLabel: "Instalación" },
  { label: "Resultados", shortLabel: "Resultados" },
  { label: "Contactar", shortLabel: "Contactar" },
];

const initialFormData: FormData = {
  contact: {
    name: "",
    email: "",
    phone: "",
    clientType: "residential",
  },
  consumption: {
    monthlyKwh: 500,
    timeProfile: "mixed",
  },
  installation: {
    mountingType: "roof-sheet",
  },
};

export function SolarQuoteWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  console.log("[v0] Theme debug:", { mounted, theme, resolvedTheme });

  const calculation = useMemo(() => calculateSolarSystem(formData), [formData]);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.contact.name.trim()) {
        newErrors.name = "El nombre es requerido";
      }
      if (!formData.contact.email.trim()) {
        newErrors.email = "El email es requerido";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact.email)) {
        newErrors.email = "Email inválido";
      }
      if (!formData.contact.phone.trim()) {
        newErrors.phone = "El teléfono es requerido";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const updateContact = (contact: ContactData) => {
    setFormData((prev) => ({ ...prev, contact }));
    setErrors({});
  };

  const updateConsumption = (consumption: ConsumptionData) => {
    setFormData((prev) => ({ ...prev, consumption }));
  };

  const updateInstallation = (installation: InstallationData) => {
    setFormData((prev) => ({ ...prev, installation }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepContact
            data={formData.contact}
            onChange={updateContact}
            errors={errors}
          />
        );
      case 2:
        return (
          <StepConsumption
            data={formData.consumption}
            onChange={updateConsumption}
          />
        );
      case 3:
        return (
          <StepInstallation
            data={formData.installation}
            onChange={updateInstallation}
          />
        );
      // case 4:
      //   return <StepResults calculation={calculation} />
      case 5:
        return <StepCTA formData={formData} calculation={calculation} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Sun className="h-5 w-5" />
              </div>
              <span className="text-lg font-semibold text-foreground">
                SolarQuote<span className="text-primary">Pro</span>
              </span>
            </div>

            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  setTheme(resolvedTheme === "dark" ? "light" : "dark")
                }
                className="h-9 w-9"
              >
                {resolvedTheme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
                <span className="sr-only">Cambiar tema</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <ProgressSteps
            currentStep={currentStep}
            totalSteps={STEPS.length}
            steps={STEPS}
          />
        </div>

        {/* Step Content */}
        <div className="min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div key={currentStep}>{renderStep()}</motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between pt-6 border-t border-border">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Anterior
          </Button>

          {currentStep < STEPS.length && (
            <Button onClick={handleNext} className="gap-2">
              {currentStep === STEPS.length - 1
                ? "Ver cotización"
                : "Siguiente"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-muted-foreground">
            © 2026 SolarQuote Pro. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
