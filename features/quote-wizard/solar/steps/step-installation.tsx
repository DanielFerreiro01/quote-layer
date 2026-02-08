"use client";

import React from "react";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { InstallationData, MountingType } from "@/lib/solar/solar-types";

interface StepInstallationProps {
  data: InstallationData;
  onChange: (data: InstallationData) => void;
}

const mountingTypes: {
  value: MountingType;
  label: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
}[] = [
  {
    value: "roof-sheet",
    label: "Techo Chapa",
    description: "Instalación sobre techo metálico",
    features: ["Instalación rápida", "Menor costo", "Ideal para galpones"],
    icon: (
      <svg className="h-12 w-12" viewBox="0 0 48 48" fill="none">
        <rect
          x="6"
          y="20"
          width="36"
          height="22"
          rx="2"
          className="fill-muted stroke-current"
          strokeWidth="2"
        />
        <path
          d="M4 22L24 8L44 22"
          className="stroke-current"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 22V18L24 10L36 18V22"
          className="stroke-primary"
          strokeWidth="2"
        />
        <rect
          x="14"
          y="24"
          width="8"
          height="6"
          rx="1"
          className="fill-primary/30 stroke-primary"
          strokeWidth="1.5"
        />
        <rect
          x="26"
          y="24"
          width="8"
          height="6"
          rx="1"
          className="fill-primary/30 stroke-primary"
          strokeWidth="1.5"
        />
        <rect
          x="14"
          y="32"
          width="8"
          height="6"
          rx="1"
          className="fill-primary/30 stroke-primary"
          strokeWidth="1.5"
        />
        <rect
          x="26"
          y="32"
          width="8"
          height="6"
          rx="1"
          className="fill-primary/30 stroke-primary"
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
  {
    value: "roof-tile",
    label: "Techo Teja",
    description: "Instalación sobre techo de tejas",
    features: ["Estético", "Residencial", "Integración perfecta"],
    icon: (
      <svg className="h-12 w-12" viewBox="0 0 48 48" fill="none">
        <rect
          x="6"
          y="22"
          width="36"
          height="20"
          rx="2"
          className="fill-muted stroke-current"
          strokeWidth="2"
        />
        <path
          d="M4 24L24 8L44 24"
          className="stroke-current"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <ellipse
          cx="12"
          cy="14"
          rx="4"
          ry="2"
          className="stroke-current"
          strokeWidth="1.5"
        />
        <ellipse
          cx="20"
          cy="12"
          rx="4"
          ry="2"
          className="stroke-current"
          strokeWidth="1.5"
        />
        <ellipse
          cx="28"
          cy="12"
          rx="4"
          ry="2"
          className="stroke-current"
          strokeWidth="1.5"
        />
        <ellipse
          cx="36"
          cy="14"
          rx="4"
          ry="2"
          className="stroke-current"
          strokeWidth="1.5"
        />
        <rect
          x="16"
          y="26"
          width="16"
          height="10"
          rx="1"
          className="fill-primary/30 stroke-primary"
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
  {
    value: "ground",
    label: "Montaje en Suelo",
    description: "Estructura sobre terreno",
    features: ["Óptima orientación", "Fácil mantenimiento", "Gran escala"],
    icon: (
      <svg className="h-12 w-12" viewBox="0 0 48 48" fill="none">
        <rect
          x="4"
          y="40"
          width="40"
          height="4"
          rx="1"
          className="fill-muted stroke-current"
          strokeWidth="2"
        />
        <path d="M10 40V28" className="stroke-current" strokeWidth="2" />
        <path d="M38 40V28" className="stroke-current" strokeWidth="2" />
        <rect
          x="8"
          y="16"
          width="32"
          height="14"
          rx="1"
          className="fill-primary/30 stroke-primary"
          strokeWidth="2"
          transform="rotate(-15 24 23)"
        />
        <path
          d="M10 28L24 12L38 28"
          className="stroke-primary/50"
          strokeWidth="1.5"
          strokeDasharray="2 2"
        />
      </svg>
    ),
  },
  {
    value: "carport",
    label: "Carport Solar",
    description: "Estacionamiento con paneles",
    features: ["Doble función", "Protección vehicular", "Moderno"],
    icon: (
      <svg className="h-12 w-12" viewBox="0 0 48 48" fill="none">
        <rect
          x="4"
          y="40"
          width="40"
          height="4"
          rx="1"
          className="fill-muted stroke-current"
          strokeWidth="2"
        />
        <path d="M8 40V24" className="stroke-current" strokeWidth="2" />
        <path d="M40 40V24" className="stroke-current" strokeWidth="2" />
        <rect
          x="4"
          y="18"
          width="40"
          height="8"
          rx="1"
          className="fill-primary/30 stroke-primary"
          strokeWidth="2"
        />
        <ellipse
          cx="16"
          cy="38"
          rx="4"
          ry="2"
          className="stroke-muted-foreground"
          strokeWidth="1.5"
        />
        <ellipse
          cx="32"
          cy="38"
          rx="4"
          ry="2"
          className="stroke-muted-foreground"
          strokeWidth="1.5"
        />
        <rect
          x="12"
          y="32"
          width="24"
          height="6"
          rx="2"
          className="stroke-muted-foreground"
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
];

export function StepInstallation({ data, onChange }: StepInstallationProps) {
  const handleSelect = (type: MountingType) => {
    onChange({ mountingType: type });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="space-y-8"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Tipo de instalación
        </h2>
        <p className="text-muted-foreground">
          Selecciona dónde se instalarán tus paneles solares.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mountingTypes.map((type, index) => (
          <motion.button
            key={type.value}
            type="button"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect(type.value)}
            className={cn(
              "relative flex flex-col p-6 rounded-2xl border-2 text-left transition-all duration-200",
              data.mountingType === type.value
                ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                : "border-border bg-card hover:border-primary/50 hover:shadow-md",
            )}
          >
            {data.mountingType === type.value && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-4 right-4"
              >
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </motion.div>
            )}

            <div className="mb-4 text-foreground">{type.icon}</div>

            <h3
              className={cn(
                "text-lg font-semibold mb-1",
                data.mountingType === type.value
                  ? "text-primary"
                  : "text-foreground",
              )}
            >
              {type.label}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {type.description}
            </p>

            <ul className="space-y-1.5 mt-auto">
              {type.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <div
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      data.mountingType === type.value
                        ? "bg-primary"
                        : "bg-muted-foreground",
                    )}
                  />
                  {feature}
                </li>
              ))}
            </ul>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
