// config/installation.config.tsx
import type { MountingType } from "@/lib/solar/solar-types";
import type { ReactNode } from "react";
import { 
  RoofSheetIcon, 
  RoofTileIcon, 
  GroundMountIcon, 
  CarportIcon 
} from "./installation-icons";

export interface MountingTypeOption {
  value: MountingType;
  label: string;
  description: string;
  features: string[];
  icon: ReactNode;
}

export const MOUNTING_TYPE_OPTIONS: MountingTypeOption[] = [
  {
    value: "roof-sheet",
    label: "Techo Chapa",
    description: "Instalación sobre techo metálico",
    features: ["Instalación rápida", "Menor costo", "Ideal para galpones"],
    icon: <RoofSheetIcon />,
  },
  {
    value: "roof-tile",
    label: "Techo Teja",
    description: "Instalación sobre techo de tejas",
    features: ["Estética preservada", "Residencial", "Integración completa"],
    icon: <RoofTileIcon />,
  },
  {
    value: "ground",
    label: "Montaje en Suelo",
    description: "Estructura sobre terreno",
    features: ["Óptima orientación", "Fácil mantenimiento", "Gran escala"],
    icon: <GroundMountIcon />,
  },
  {
    value: "carport",
    label: "Carport Solar",
    description: "Estacionamiento con paneles",
    features: ["Doble función", "Protección vehicular", "Moderno"],
    icon: <CarportIcon />,
  },
];