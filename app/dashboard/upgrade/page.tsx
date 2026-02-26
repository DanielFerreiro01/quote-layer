"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, Sparkles, Zap, Building2, ArrowLeft, CreditCard, Shield, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

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
]

const addons = [
  { name: "Analytics avanzados", price: 15, description: "Metricas detalladas y reportes personalizados" },
  { name: "White-label completo", price: 25, description: "Elimina toda referencia a SolarQuote" },
  { name: "Usuarios extra", price: 5, suffix: "/ usuario", description: "Agrega mas miembros a tu equipo" },
  { name: "Exportaciones avanzadas", price: 10, description: "Excel, CSV y formatos adicionales" },
  { name: "Reglas personalizadas", price: 20, description: "Logica de precios avanzada" },
]

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
]

export default function UpgradePage() {
  const [isYearly, setIsYearly] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

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
          <div className="flex items-center justify-center gap-3">
            <Label htmlFor="billing" className={!isYearly ? "font-medium" : "text-muted-foreground"}>
              Mensual
            </Label>
            <Switch
              id="billing"
              checked={isYearly}
              onCheckedChange={setIsYearly}
            />
            <Label htmlFor="billing" className={isYearly ? "font-medium" : "text-muted-foreground"}>
              Anual
            </Label>
            {isYearly && (
              <Badge variant="secondary" className="ml-2 text-[10px] px-1.5 py-0">
                Ahorra 2 meses
              </Badge>
            )}
          </div>

          {/* Plans Grid */}
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => {
              const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice
              const isSelected = selectedPlan === plan.name
              
              return (
                <Card
                  key={plan.name}
                  className={`relative cursor-pointer transition-all ${
                    plan.popular
                      ? "border-primary shadow-lg shadow-primary/10"
                      : isSelected
                        ? "border-primary/50"
                        : "border-border hover:border-muted-foreground/50"
                  }`}
                  onClick={() => setSelectedPlan(plan.name)}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-[10px]">
                      Mas elegido
                    </Badge>
                  )}
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex size-10 items-center justify-center rounded-lg ${
                        plan.popular ? "bg-primary/20" : "bg-muted"
                      }`}>
                        <plan.icon className={`size-5 ${plan.popular ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                      </div>
                    </div>
                    <CardDescription className="mt-2 leading-relaxed">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <span className="text-4xl font-bold">${price}</span>
                      <span className="text-muted-foreground"> / {isYearly ? "ano" : "mes"}</span>
                      {isYearly && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          ${Math.round(price / 12)} / mes facturado anualmente
                        </p>
                      )}
                    </div>
                    <Button
                      className="w-full"
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.popular ? "Comenzar prueba gratis" : "Seleccionar"}
                    </Button>
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2.5 text-sm">
                          <Check className="size-4 shrink-0 text-primary mt-0.5" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Add-ons Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Add-ons opcionales</CardTitle>
              <CardDescription>
                Potencia tu plan con funcionalidades adicionales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {addons.map((addon) => (
                  <div
                    key={addon.name}
                    className="flex items-start justify-between rounded-lg border border-border p-4 hover:border-muted-foreground/50 transition-colors cursor-pointer"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{addon.name}</p>
                      <p className="text-xs text-muted-foreground">{addon.description}</p>
                    </div>
                    <Badge variant="secondary" className="ml-3 shrink-0 text-[10px] px-1.5 py-0">
                      ${addon.price}{addon.suffix ? ` ${addon.suffix}` : " / mes"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-8 py-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="size-4" />
              <span>Pago seguro SSL</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="size-4" />
              <span>14 dias de prueba gratis</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CreditCard className="size-4" />
              <span>Cancela cuando quieras</span>
            </div>
          </div>

          {/* FAQs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Preguntas frecuentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {faqs.map((faq, index) => (
                  <div key={index} className="space-y-2">
                    <h4 className="text-sm font-medium">{faq.question}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contact CTA */}
          <div className="rounded-lg border border-border bg-muted/30 p-6 text-center">
            <h3 className="text-lg font-semibold">Necesitas un plan personalizado?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Contactanos para discutir opciones enterprise con precios y funcionalidades a medida.
            </p>
            <Button variant="outline" className="mt-4 bg-transparent">
              Contactar ventas
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
