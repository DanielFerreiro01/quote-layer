"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  CreditCard, 
  Calendar, 
  Check, 
  Sparkles, 
  ArrowUpRight, 
  AlertCircle,
  Download,
  Plus,
  X,
  Zap
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const currentPlan = {
  name: "Pro",
  price: 59,
  billingCycle: "monthly",
  nextBillingDate: "15 de Marzo, 2026",
  features: [
    "Cotizaciones ilimitadas",
    "Historial completo de leads",
    "Exportar cotizaciones en PDF",
    "Dominio personalizado",
    "Personalizacion visual completa",
    "Preview en tiempo real",
    "Soporte prioritario",
  ],
}

const availableAddons = [
  { id: "analytics", name: "Analytics avanzados", price: 15, description: "Metricas detalladas y reportes personalizados", active: true },
  { id: "whitelabel", name: "White-label completo", price: 25, description: "Elimina toda referencia a SolarQuote", active: false },
  { id: "exports", name: "Exportaciones avanzadas", price: 10, description: "Excel, CSV y formatos adicionales", active: true },
  { id: "rules", name: "Reglas personalizadas", price: 20, description: "Logica de precios avanzada", active: false },
]

const invoices = [
  { id: "INV-2026-002", date: "15 Feb 2026", amount: "$84.00", status: "paid" },
  { id: "INV-2026-001", date: "15 Ene 2026", amount: "$84.00", status: "paid" },
  { id: "INV-2025-012", date: "15 Dic 2025", amount: "$59.00", status: "paid" },
  { id: "INV-2025-011", date: "15 Nov 2025", amount: "$59.00", status: "paid" },
]

export default function BillingPage() {
  const [isSubscribed, setIsSubscribed] = useState(true)
  const [addons, setAddons] = useState(availableAddons)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)

  const toggleAddon = (addonId: string) => {
    setAddons(addons.map(addon => 
      addon.id === addonId ? { ...addon, active: !addon.active } : addon
    ))
  }

  const activeAddonsTotal = addons.filter(a => a.active).reduce((sum, a) => sum + a.price, 0)
  const totalMonthly = currentPlan.price + activeAddonsTotal

  // Not subscribed view
  if (!isSubscribed) {
    return (
      <div className="flex h-full flex-col overflow-y-auto">
        <div className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
            <p className="text-muted-foreground">
              Manage your subscription and billing
            </p>
          </div>

          <div className="mx-auto max-w-2xl">
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 mb-6">
                  <Sparkles className="size-8 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold mb-2">Comienza tu prueba gratuita</h2>
                <p className="text-muted-foreground max-w-md mb-6">
                  Accede a todas las funcionalidades Pro durante 14 dias sin costo. 
                  Sin tarjeta de credito requerida.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button size="lg" asChild>
                    <Link href="/dashboard/upgrade">
                      <Sparkles className="mr-2 size-4" />
                      Comenzar prueba gratis
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild className="bg-transparent">
                    <Link href="/dashboard/upgrade">
                      Ver planes y precios
                      <ArrowUpRight className="ml-2 size-4" />
                    </Link>
                  </Button>
                </div>
                <div className="flex items-center gap-6 mt-8 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Check className="size-4 text-primary" />
                    <span>14 dias gratis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="size-4 text-primary" />
                    <span>Sin tarjeta</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="size-4 text-primary" />
                    <span>Cancela cuando quieras</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Demo toggle */}
            <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <span>Demo:</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsSubscribed(true)}
                className="bg-transparent"
              >
                Ver vista suscrito
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Subscribed view
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="flex-1 p-6 pb-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
          <p className="text-muted-foreground">
            Manage your subscription and billing
          </p>
        </div>

        <div className="space-y-6">
          {/* Current Plan */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/20">
                    <Sparkles className="size-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Plan {currentPlan.name}
                      <Badge className="text-[10px] px-1.5 py-0">Activo</Badge>
                    </CardTitle>
                    <CardDescription>
                      ${currentPlan.price}/mes + ${activeAddonsTotal} add-ons = ${totalMonthly}/mes
                    </CardDescription>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild className="bg-transparent">
                  <Link href="/dashboard/upgrade">
                    <ArrowUpRight className="mr-2 size-4" />
                    Upgrade a Business
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-lg border border-border p-4">
                  <Calendar className="size-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Proxima facturacion</p>
                    <p className="text-sm text-muted-foreground">{currentPlan.nextBillingDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-border p-4">
                  <CreditCard className="size-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Metodo de pago</p>
                    <p className="text-sm text-muted-foreground">Visa terminada en 4242</p>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium mb-3">Incluido en tu plan:</p>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {currentPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="size-4 text-primary shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Add-ons */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Add-ons</CardTitle>
              <CardDescription>
                Potencia tu plan con funcionalidades adicionales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {addons.map((addon) => (
                  <div
                    key={addon.id}
                    className={`flex items-center justify-between rounded-lg border p-4 transition-colors ${
                      addon.active ? "border-primary/50 bg-primary/5" : "border-border"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <Switch
                        checked={addon.active}
                        onCheckedChange={() => toggleAddon(addon.id)}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{addon.name}</p>
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                            +${addon.price}/mes
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{addon.description}</p>
                      </div>
                    </div>
                    {addon.active && (
                      <Check className="size-5 text-primary" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Billing History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Historial de facturacion</CardTitle>
              <CardDescription>
                Descarga tus facturas anteriores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                        <CreditCard className="size-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{invoice.id}</p>
                        <p className="text-sm text-muted-foreground">{invoice.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{invoice.amount}</p>
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 capitalize">
                          {invoice.status === "paid" ? "Pagado" : invoice.status}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="icon" className="size-8">
                        <Download className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cancel Subscription */}
          <Card className="border-destructive/30">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="size-5 text-destructive" />
                <CardTitle className="text-lg text-destructive">Cancelar suscripcion</CardTitle>
              </div>
              <CardDescription>
                Cancela tu suscripcion en cualquier momento. Mantendras acceso hasta el final del periodo facturado.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    Cancelar suscripcion
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Estas seguro?</DialogTitle>
                    <DialogDescription>
                      Tu suscripcion se cancelara al final del periodo actual ({currentPlan.nextBillingDate}). 
                      Despues de esa fecha, perderas acceso a las funcionalidades Pro.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="rounded-lg bg-muted p-4 my-4">
                    <p className="text-sm font-medium mb-2">Perderas acceso a:</p>
                    <ul className="space-y-1">
                      {currentPlan.features.slice(0, 4).map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <X className="size-3 text-destructive" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setCancelDialogOpen(false)} className="bg-transparent">
                      Mantener suscripcion
                    </Button>
                    <Button variant="destructive" onClick={() => {
                      setIsSubscribed(false)
                      setCancelDialogOpen(false)
                    }}>
                      Confirmar cancelacion
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Demo toggle */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-4">
            <span>Demo:</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsSubscribed(false)}
              className="bg-transparent"
            >
              Ver vista no suscrito
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
