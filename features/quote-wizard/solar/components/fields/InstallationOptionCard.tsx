// components/fields/InstallationOptionCard.tsx
"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface InstallationOptionCardProps<T> {
  value: T;
  label: string;
  description: string;
  icon: ReactNode;
  features: string[];
  isSelected: boolean;
  onSelect: (value: T) => void;
  index: number; // Para la animación escalonada
}

export function InstallationOptionCard<T>({
  value,
  label,
  description,
  icon,
  features,
  isSelected,
  onSelect,
  index,
}: InstallationOptionCardProps<T>) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(value)}
      className={cn(
        "relative flex flex-col p-6 rounded-2xl border-2 text-left transition-all duration-200",
        isSelected
          ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
          : "border-border bg-card hover:border-primary/50 hover:shadow-md"
      )}
    >
      {/* Check indicator cuando está seleccionado */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-4 right-4"
        >
          <CheckCircle2 className="h-6 w-6 text-primary" />
        </motion.div>
      )}

      {/* Ícono SVG */}
      <div className="mb-4 text-foreground">{icon}</div>

      {/* Título */}
      <h3
        className={cn(
          "text-lg font-semibold mb-1",
          isSelected ? "text-primary" : "text-foreground"
        )}
      >
        {label}
      </h3>

      {/* Descripción */}
      <p className="text-sm text-muted-foreground mb-4">{description}</p>

      {/* Features */}
      <ul className="space-y-1.5 mt-auto">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <div
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                isSelected ? "bg-primary" : "bg-muted-foreground"
              )}
            />
            {feature}
          </li>
        ))}
      </ul>
    </motion.button>
  );
}