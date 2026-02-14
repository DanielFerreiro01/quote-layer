import { Sun, Moon, Blend } from "lucide-react";
import type { TimeProfile } from "@/lib/solar/solar-types";

export interface TimeProfileOption {
  value: TimeProfile;
  label: string;
  icon: React.ReactNode;
  description: string;
}

export const TIME_PROFILE_OPTIONS: TimeProfileOption[] = [
  {
    value: "day",
    label: "Diurno",
    icon: <Sun className="h-5 w-5" />,
    description: "Mayor consumo de día",
  },
  {
    value: "night",
    label: "Nocturno",
    icon: <Moon className="h-5 w-5" />,
    description: "Mayor consumo de noche",
  },
  {
    value: "mixed",
    label: "Mixto",
    icon: <Blend className="h-5 w-5" />,
    description: "Consumo equilibrado",
  },
];

export const CONSUMPTION_LEVELS = [
  { min: 0, max: 300, label: "Bajo", description: "Hogar pequeño" },
  { min: 301, max: 600, label: "Medio", description: "Hogar típico" },
  { min: 601, max: 1000, label: "Alto", description: "Hogar grande" },
  { min: 1001, max: 2000, label: "Muy Alto", description: "Comercio pequeño" },
  { min: 2001, max: 5000, label: "Comercial", description: "Negocio mediano" },
  { min: 5001, max: 15000, label: "Industrial", description: "Gran consumidor" },
];

export const CONSUMPTION_SLIDER_CONFIG = {
  min: 100,
  max: 15000,
  step: 50,
};

export function getConsumptionLevel(kwh: number) {
  return (
    CONSUMPTION_LEVELS.find((level) => kwh >= level.min && kwh <= level.max) ||
    CONSUMPTION_LEVELS[CONSUMPTION_LEVELS.length - 1]
  );
}