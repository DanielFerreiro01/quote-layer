import { Sun } from "lucide-react";
import type { QuoterPlugin, LeadSummaryData } from "@/features/quote-wizard/types";
import type { FormData, SolarCalculation } from "@/lib/solar/solar-types";
import { SOLAR_WIZARD_CONFIG } from "./config/wizard.config";
import { calculateSolarQuote } from "@/app/actions/solar/calculate-solar-quote";
import { StepContact } from "./steps/step-contact";
import { StepConsumption } from "./steps/step-consumption";
import { StepInstallation } from "./steps/step-installation";
import { StepResults } from "./steps/step-results";
import { StepCTA } from "./steps/step-cta";

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

export const SolarPlugin: QuoterPlugin<FormData, SolarCalculation> = {
  id: "solar",
  label: "SolarQuote Pro",
  description: "Cotizador de instalaciones de paneles solares",
  icon: <Sun className="h-5 w-5" />,

  wizardConfig: SOLAR_WIZARD_CONFIG,
  initialFormData,

  steps: [
    {
      id: "contact",
      label: "Información de contacto",
      shortLabel: "Contacto",
      render: (data, onChange, errors) => (
        <StepContact
          data={data.contact}
          onChange={(contact) => onChange({ ...data, contact })}
          errors={errors}
        />
      ),
    },
    {
      id: "consumption",
      label: "Consumo energético",
      shortLabel: "Consumo",
      render: (data, onChange) => (
        <StepConsumption
          data={data.consumption}
          onChange={(consumption) => onChange({ ...data, consumption })}
        />
      ),
    },
    {
      id: "installation",
      label: "Tipo de instalación",
      shortLabel: "Instalación",
      render: (data, onChange) => (
        <StepInstallation
          data={data.installation}
          onChange={(installation) => onChange({ ...data, installation })}
        />
      ),
    },
    {
      id: "results",
      label: "Resultados",
      shortLabel: "Resultados",
      skipValidation: true,
      render: (_data, _onChange, _errors, context) =>
        context.calculationResult ? (
          <StepResults calculation={context.calculationResult as SolarCalculation} />
        ) : null,
    },
    {
      id: "cta",
      label: "Contactar",
      shortLabel: "Contactar",
      skipValidation: true,
      render: (data, _onChange, _errors, context) =>
        context.calculationResult ? (
          <StepCTA
            formData={data}
            calculation={context.calculationResult as SolarCalculation}
          />
        ) : null,
    },
  ],

  getStepData: (step: number, formData: FormData) => {
    switch (step) {
      case 1: return formData.contact;
      case 2: return formData.consumption;
      case 3: return formData.installation;
      default: return formData;
    }
  },

  calculate: async (formData: FormData, tenant: string) => {
    return calculateSolarQuote(tenant, formData);
  },

  renderLeadSummary: (result: SolarCalculation): LeadSummaryData => ({
    primaryValue: `$${result.costs.total.toLocaleString()}`,
    primaryLabel: "Inversión estimada",
    secondaryValue: `${result.system.power} kW`,
    secondaryLabel: "Potencia del sistema",
    badge: "Solar",
    extraValues: [
      {
        label: "Paneles",
        value: `${result.system.panels} unidades`,
      },
      {
        label: "Retorno",
        value: `${result.economics.paybackYears} años`,
      },
      {
        label: "Ahorro mensual",
        value: `$${result.economics.monthlySavings.toLocaleString()}`,
      },
    ],
  }),

  renderLeadDetail: (result: SolarCalculation) => (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Sistema</span>
        <span className="font-medium">{result.system.power} kW</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Paneles</span>
        <span className="font-medium">{result.system.panels} unidades</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Cobertura</span>
        <span className="font-medium">{result.system.coveragePercentage}%</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Inversión</span>
        <span className="font-medium">${result.costs.total.toLocaleString()}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Ahorro mensual</span>
        <span className="font-medium">${result.economics.monthlySavings.toLocaleString()}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Retorno de inversión</span>
        <span className="font-medium">{result.economics.paybackYears} años</span>
      </div>
    </div>
  ),
};