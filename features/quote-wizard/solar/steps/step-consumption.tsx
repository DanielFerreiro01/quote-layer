// steps/step-consumption.tsx
"use client";

import { Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { StepLayout } from "../components/layout/StepLayout";
import { OptionCard } from "../components/fields/OptionCard";
import { useFieldHandlers } from "../hooks/useFieldHandlers";
import {
  TIME_PROFILE_OPTIONS,
  CONSUMPTION_SLIDER_CONFIG,
  getConsumptionLevel,
} from "../config/consumption.config";
import type { ConsumptionData } from "@/lib/solar/solar-types";

interface StepConsumptionProps {
  data: ConsumptionData;
  onChange: (data: ConsumptionData) => void;
}

export function StepConsumption({ data, onChange }: StepConsumptionProps) {
  const { handleFieldChange } = useFieldHandlers(data, onChange);
  const currentLevel = getConsumptionLevel(data.monthlyKwh);

  return (
    <StepLayout
      title="Consumo energético"
      description="Ayúdanos a dimensionar tu sistema solar ideal."
    >
      <div className="space-y-8">
        {/* Slider de consumo */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Consumo mensual</Label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {currentLevel.label}
              </span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">
                {currentLevel.description}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
              <div className="flex items-center justify-center gap-3">
                <Zap className="h-8 w-8 text-primary" />
                <div className="text-center">
                  <motion.span
                    key={data.monthlyKwh}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-bold text-foreground tabular-nums"
                  >
                    {data.monthlyKwh.toLocaleString()}
                  </motion.span>
                  <span className="text-lg text-muted-foreground ml-2">
                    kWh/mes
                  </span>
                </div>
              </div>
            </div>

            <Slider
              value={[data.monthlyKwh]}
              onValueChange={(value) => handleFieldChange('monthlyKwh', value[0])}
              min={CONSUMPTION_SLIDER_CONFIG.min}
              max={CONSUMPTION_SLIDER_CONFIG.max}
              step={CONSUMPTION_SLIDER_CONFIG.step}
              className="py-4"
            />

            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{CONSUMPTION_SLIDER_CONFIG.min} kWh</span>
              <span>{CONSUMPTION_SLIDER_CONFIG.max.toLocaleString()} kWh</span>
            </div>
          </div>
        </div>

        {/* Perfil de consumo */}
        <div className="space-y-4">
          <Label className="text-sm font-medium">
            Perfil de consumo horario
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {TIME_PROFILE_OPTIONS.map((option) => (
              <OptionCard
                key={option.value}
                value={option.value}
                label={option.label}
                description={option.description}
                icon={option.icon}
                isSelected={data.timeProfile === option.value}
                onSelect={(value) => handleFieldChange('timeProfile', value)}
              />
            ))}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-muted/50 border border-border"
        >
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Tip: </span>
            Puedes encontrar tu consumo mensual en tu factura de luz. Busca el valor en kWh del último mes o el promedio de los últimos 12 meses.
          </p>
        </div>
      </div>
    </StepLayout>
  );
}