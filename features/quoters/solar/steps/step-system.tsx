"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { StepLayout } from "../components/layout/StepLayout";
import { useFieldHandlers } from "../hooks/useFieldHandlers";
import { SYSTEM_TYPE_OPTIONS } from "../config/system.config";
import type { SystemData } from "@/lib/solar/solar-types";

interface StepSystemProps {
  data: SystemData;
  onChange: (data: SystemData) => void;
}

export function StepSystem({ data, onChange }: StepSystemProps) {
  const { handleFieldChange } = useFieldHandlers(data, onChange);
  const selectedSystem = SYSTEM_TYPE_OPTIONS.find((s) => s.id === data.systemType);

  return (
    <StepLayout
      title="Tipo de sistema"
      description="Selecciona el tipo de sistema solar que mejor se adapte a tus necesidades."
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {SYSTEM_TYPE_OPTIONS.map((system, index) => {
            const Icon = system.icon;
            const isSelected = data.systemType === system.id;

            return (
              <motion.div
                key={system.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={cn(
                    "relative cursor-pointer transition-all duration-200 hover:border-primary/50 h-full",
                    isSelected
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border hover:bg-accent/50"
                  )}
                  onClick={() => handleFieldChange("systemType", system.id)}
                >
                  <CardContent className="p-5">
                    <div className="flex flex-col items-center text-center">
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-3 right-3"
                        >
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        </motion.div>
                      )}

                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                          "mb-4 flex h-14 w-14 items-center justify-center rounded-xl transition-colors",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        <Icon className="h-7 w-7" />
                      </motion.div>

                      <h3 className="font-semibold text-foreground text-lg">
                        {system.name}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {system.description}
                      </p>

                      <ul className="mt-4 space-y-2 text-left w-full">
                        {system.details.map((detail) => (
                          <li
                            key={detail}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <span
                              className={cn(
                                "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                                isSelected
                                  ? "bg-primary"
                                  : "bg-muted-foreground/50"
                              )}
                            />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {selectedSystem && (
          <motion.div
            key={selectedSystem.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-border">
              <CardContent className="p-5">
                <h3 className="font-semibold text-foreground mb-4">
                  Preguntas frecuentes sobre {selectedSystem.name}
                </h3>
                <Accordion type="single" collapsible className="w-full">
                  {selectedSystem.faqs.map((faq, idx) => (
                    <AccordionItem key={idx} value={`faq-${idx}`}>
                      <AccordionTrigger className="text-left text-sm font-medium">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </StepLayout>
  );
}