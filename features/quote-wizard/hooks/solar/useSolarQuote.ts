import { useState } from "react";
import { useWizard } from "../useWizard";
import {
  FormData,
  ContactData,
  ConsumptionData,
  InstallationData,
} from "@/lib/solar/solar-types";

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

export function useSolarQuote(totalSteps: number) {
  const wizard = useWizard(totalSteps);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  /* -------- VALIDACIONES -------- */

  const validateContact = () => {
    const errors: Record<string, string> = {};
    if (!formData.contact.name.trim()) errors.name = "El nombre es requerido";
    if (!formData.contact.email.trim()) errors.email = "El email es requerido";
    if (!formData.contact.phone.trim()) errors.phone = "El teléfono es requerido";
    return errors;
  };

  const validateConsumption = () => {
    const errors: Record<string, string> = {};
    if (formData.consumption.monthlyKwh < 100) {
      errors.monthlyKwh = "El consumo debe ser mayor a 100 kWh";
    }
    return errors;
  };

  const stepValidators: Record<number, () => Record<string, string>> = {
    1: validateContact,
    2: validateConsumption,
  };

  const validateCurrentStep = () => {
    const validator = stepValidators[wizard.currentStep];
    const validationErrors = validator ? validator() : {};
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  /* -------- ACTIONS -------- */

  const updateContact = (contact: ContactData) => {
    setFormData((prev) => ({ ...prev, contact }));
    setErrors({});
  };

  const updateConsumption = (consumption: ConsumptionData) => {
    setFormData((prev) => ({ ...prev, consumption }));
    setErrors({});
  };

  const updateInstallation = (installation: InstallationData) => {
    setFormData((prev) => ({ ...prev, installation }));
  };

  return {
    ...wizard,
    formData,
    errors,
    validateCurrentStep,
    updateContact,
    updateConsumption,
    updateInstallation,
  };
}
