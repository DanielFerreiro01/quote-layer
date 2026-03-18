"use client";

import { useState } from "react";
import { AlertCircle, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlanCard, AddonsManager, BillingHistory } from "@/features/dashboard/components/billing";

const currentPlan = {
  name: "Pro",
  price: 59,
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
};

const availableAddons = [
  { id: "analytics", name: "Analytics avanzados", price: 15, description: "Metricas detalladas y reportes personalizados", active: true },
  { id: "whitelabel", name: "White-label completo", price: 25, description: "Elimina toda referencia a SolarQuote", active: false },
  { id: "exports", name: "Exportaciones avanzadas", price: 10, description: "Excel, CSV y formatos adicionales", active: true },
  { id: "rules", name: "Reglas personalizadas", price: 20, description: "Logica de precios avanzada", active: false },
];

const invoices = [
  { id: "INV-2026-002", date: "15 Feb 2026", amount: "$84.00", status: "paid" as const },
  { id: "INV-2026-001", date: "15 Ene 2026", amount: "$84.00", status: "paid" as const },
  { id: "INV-2025-012", date: "15 Dic 2025", amount: "$59.00", status: "paid" as const },
  { id: "INV-2025-011", date: "15 Nov 2025", amount: "$59.00", status: "paid" as const },
];

export default function BillingPage() {
  const [addons, setAddons] = useState(availableAddons);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const toggleAddon = (addonId: string) => {
    setAddons(addons.map(addon => 
      addon.id === addonId ? { ...addon, active: !addon.active } : addon
    ));
  };

  const activeAddonsTotal = addons.filter(a => a.active).reduce((sum, a) => sum + a.price, 0);

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
          <PlanCard plan={currentPlan} addonsTotal={activeAddonsTotal} />

          {/* Add-ons */}
          <AddonsManager addons={addons} onToggleAddon={toggleAddon} />

          {/* Billing History */}
          <BillingHistory invoices={invoices} />

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
                    <Button variant="destructive" onClick={() => setCancelDialogOpen(false)}>
                      Confirmar cancelacion
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}