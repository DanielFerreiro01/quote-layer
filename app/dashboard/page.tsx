"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Zap, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PlanCard,
  BillingToggle,
  AddonsGrid,
  TrustBadges,
  FAQSection,
  EnterpriseCTA,
} from "@/features/dashboard/components/upgrade";

const plans = [
  {
    name: "Starter",
    description: "Para empezar a cotizar online sin friccion",
    monthlyPrice: 19,
    yearlyPrice: 190,
    icon: Zap,
    features: [
      "1 cotizador activo",
      "Hasta 50 cotizaciones por mes",
      "Configuracion basica de precios",
      "Formulario de contacto",
      "Branding basico (logo + colores)",
      "Acceso al dashboard",
      "Soporte por email",
    ],
  },
  {
    name: "Pro",
    description: "Para empresas que cotizan todos los dias",
    monthlyPrice: 59,
    yearlyPrice: 590,
    icon: Sparkles,
    popular: true,
    features: [
      "Todo lo de Starter, mas:",
      "Cotizaciones ilimitadas",
      "Historial completo de leads",
      "Exportar cotizaciones en PDF",
      "Dominio personalizado",
      "Personalizacion visual completa",
      "Preview en tiempo real",
      "Soporte prioritario",
    ],
  },
  {
    name: "Business",
    description: "Para equipos y operaciones mas grandes",
    monthlyPrice: 179,
    yearlyPrice: 1790,
    icon: Building2,
    features: [
      "Todo lo de Pro, mas:",
      "Hasta 5 cotizadores activos",
      "Gestion de usuarios y roles",
      "Estados de leads",
      "Integraciones (email, WhatsApp)",
      "Acceso a API",
      "Onboarding asistido",
    ],
  },
];

const addons = [
  { name: "Analytics avanzados", price: 15, description: "Metricas detalladas y reportes personalizados" },
  { name: "White-label completo", price: 25, description: "Elimina toda referencia a SolarQuote" },
  { name: "Usuarios extra", price: 5, suffix: "/ usuario", description: "Agrega mas miembros a tu equipo" },
  { name: "Exportaciones avanzadas", price: 10, description: "Excel, CSV y formatos adicionales" },
  { name: "Reglas personalizadas", price: 20, description: "Logica de precios avanzada" },
];

const faqs = [
  {
    question: "Puedo cambiar de plan en cualquier momento?",
    answer: "Si, puedes actualizar o degradar tu plan cuando quieras. Los cambios se aplican inmediatamente y se prorratea el costo.",
  },
  {
    question: "Que metodos de pago aceptan?",
    answer: "Aceptamos todas las tarjetas de credito y debito principales (Visa, Mastercard, American Express), asi como transferencias bancarias para planes anuales.",
  },
  {
    question: "Hay contratos de permanencia?",
    answer: "No, todos nuestros planes son mensuales sin compromiso. Puedes cancelar en cualquier momento sin penalizaciones.",
  },
  {
    question: "Que pasa con mis datos si cancelo?",
    answer: "Tus datos se mantienen durante 30 dias despues de la cancelacion. Puedes exportarlos en cualquier momento o reactivar tu cuenta.",
  },
];

export default function UpgradePage() {
  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Header */}
      <div className="border-b border-border bg-background/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-semibold">Elige tu plan</h1>
            <p className="text-sm text-muted-foreground">
              Comienza con 14 dias gratis del plan Pro. Sin tarjeta, sin compromiso.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <div className="mx-auto max-w-5xl space-y-8">
          {/* Billing Toggle */}
          <BillingToggle isYearly={isYearly} onToggle={setIsYearly} />

          {/* Plans Grid */}
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <PlanCard
                key={plan.name}
                plan={plan}
                isYearly={isYearly}
                isSelected={selectedPlan === plan.name}
                onSelect={() => setSelectedPlan(plan.name)}
              />
            ))}
          </div>

          {/* Add-ons Section */}
          <AddonsGrid addons={addons} />

          {/* Trust Badges */}
          <TrustBadges />

          {/* FAQs */}
          <FAQSection faqs={faqs} />

          {/* Enterprise CTA */}
          <EnterpriseCTA />
        </div>
      </div>
    </div>
  );
}