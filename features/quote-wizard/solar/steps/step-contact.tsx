"use client";

import React from "react";

import { motion } from "framer-motion";
import { User, Mail, Phone, Building2, Home, Wheat } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { ContactData, ClientType } from "@/lib/solar/solar-types";

interface StepContactProps {
  data: ContactData;
  onChange: (data: ContactData) => void;
  errors: Record<string, string>;
}

const clientTypes: {
  value: ClientType;
  label: string;
  icon: React.ReactNode;
  description: string;
}[] = [
  {
    value: "residential",
    label: "Residencial",
    icon: <Home className="h-5 w-5" />,
    description: "Hogares y departamentos",
  },
  {
    value: "industrial",
    label: "Industrial",
    icon: <Building2 className="h-5 w-5" />,
    description: "Fábricas y comercios",
  },
  {
    value: "agro",
    label: "Agro",
    icon: <Wheat className="h-5 w-5" />,
    description: "Campo y agroindustria",
  },
];

export function StepContact({ data, onChange, errors }: StepContactProps) {
  const handleChange = (field: keyof ContactData, value: string) => {
    onChange({ ...data, [field]: value });
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
          Información de contacto
        </h2>
        <p className="text-muted-foreground">
          Cuéntanos sobre ti para personalizar tu cotización solar.
        </p>
      </div>

      <div className="grid gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Nombre completo
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="name"
              type="text"
              placeholder="Juan Pérez"
              value={data.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={cn(
                "pl-10 h-12 bg-background border-input transition-colors",
                errors.name &&
                  "border-destructive focus-visible:ring-destructive",
              )}
            />
          </div>
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Correo electrónico
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="juan@ejemplo.com"
              value={data.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={cn(
                "pl-10 h-12 bg-background border-input transition-colors",
                errors.email &&
                  "border-destructive focus-visible:ring-destructive",
              )}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium">
            Teléfono
          </Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              placeholder="+54 9 11 1234-5678"
              value={data.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className={cn(
                "pl-10 h-12 bg-background border-input transition-colors",
                errors.phone &&
                  "border-destructive focus-visible:ring-destructive",
              )}
            />
          </div>
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone}</p>
          )}
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium">Tipo de cliente</Label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {clientTypes.map((type) => (
              <motion.button
                key={type.value}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleChange("clientType", type.value)}
                className={cn(
                  "relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
                  data.clientType === type.value
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border bg-card hover:border-primary/50 hover:bg-accent/50",
                )}
              >
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                    data.clientType === type.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {type.icon}
                </div>
                <div className="text-center">
                  <p
                    className={cn(
                      "font-medium",
                      data.clientType === type.value
                        ? "text-primary"
                        : "text-foreground",
                    )}
                  >
                    {type.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {type.description}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
