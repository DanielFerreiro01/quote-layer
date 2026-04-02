"use client";

import { Settings, DollarSign, SunMedium, Wrench, Zap, HardHat } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import type { QuoteConfig } from "@/lib/types";

interface QuoteConfigFormProps {
  config: QuoteConfig;
  onConfigChange: (config: QuoteConfig) => void;
}

export function QuoteConfigForm({ config, onConfigChange }: QuoteConfigFormProps) {
  const update = <K extends keyof QuoteConfig>(key: K, value: QuoteConfig[K]) =>
    onConfigChange({ ...config, [key]: value });

  const updateMounting = (key: keyof QuoteConfig["mountingMultipliers"], value: number) =>
    onConfigChange({ ...config, mountingMultipliers: { ...config.mountingMultipliers, [key]: value } });

  const updateSystemCost = (key: keyof QuoteConfig["systemExtraCostPerKw"], value: number) =>
    onConfigChange({ ...config, systemExtraCostPerKw: { ...config.systemExtraCostPerKw, [key]: value } });

  return (
    <div className="space-y-6">

      {/* Sistema */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
              <SunMedium className="size-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Especificaciones técnicas</CardTitle>
              <CardDescription>Parámetros del panel y del sistema</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="panelPower">Potencia del panel (W)</Label>
              <Input id="panelPower" type="number"
                value={config.panelPower}
                onChange={(e) => update("panelPower", Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="systemEfficiency">Eficiencia del sistema (%)</Label>
              <Input id="systemEfficiency" type="number" min="0" max="100"
                value={config.systemEfficiency}
                onChange={(e) => update("systemEfficiency", Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="peakSunHours">Horas pico de sol (HSP)</Label>
              <Input id="peakSunHours" type="number" step="0.1"
                value={config.peakSunHours}
                onChange={(e) => update("peakSunHours", Number(e.target.value))} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Equipamiento */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
              <Settings className="size-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Equipamiento</CardTitle>
              <CardDescription>Costo de paneles e inversor</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="panelCost">Costo por panel (USD)</Label>
              <Input id="panelCost" type="number"
                value={config.panelCost}
                onChange={(e) => update("panelCost", Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inverterCost">Inversor base (USD)</Label>
              <Input id="inverterCost" type="number"
                value={config.inverterCost}
                onChange={(e) => update("inverterCost", Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inverterCostPerKw">Inversor por kW (USD/kW)</Label>
              <Input id="inverterCostPerKw" type="number"
                value={config.inverterCostPerKw}
                onChange={(e) => update("inverterCostPerKw", Number(e.target.value))} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Costos operativos */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
              <HardHat className="size-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Costos operativos</CardTitle>
              <CardDescription>
                Se aplica un multiplicador según el tipo de montaje
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="baseInstallationFee">Instalación base (USD)</Label>
              <p className="text-xs text-muted-foreground">Fijo por proyecto</p>
              <Input id="baseInstallationFee" type="number"
                value={config.baseInstallationFee}
                onChange={(e) => update("baseInstallationFee", Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="laborCostPerKw">Mano de obra (USD/kW)</Label>
              <p className="text-xs text-muted-foreground">Escala con el sistema</p>
              <Input id="laborCostPerKw" type="number"
                value={config.laborCostPerKw}
                onChange={(e) => update("laborCostPerKw", Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="structureCostPerPanel">Estructura (USD/panel)</Label>
              <p className="text-xs text-muted-foreground">Rieles y anclajes</p>
              <Input id="structureCostPerPanel" type="number"
                value={config.structureCostPerPanel}
                onChange={(e) => update("structureCostPerPanel", Number(e.target.value))} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Multiplicadores de montaje */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
              <Wrench className="size-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Multiplicadores por tipo de montaje</CardTitle>
              <CardDescription>
                Se aplican sobre los costos operativos (instalación + mano de obra + estructura)
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Tipo de montaje</TableHead>
                <TableHead>Multiplicador</TableHead>
                <TableHead className="text-right">Efecto sobre operativo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { key: "roofSheet" as const, label: "Techo (Chapa)" },
                { key: "roofTile"  as const, label: "Techo (Teja)" },
                { key: "ground"    as const, label: "Suelo" },
                { key: "carport"   as const, label: "Carport" },
              ].map(({ key, label }) => (
                <TableRow key={key}>
                  <TableCell className="font-medium">{label}</TableCell>
                  <TableCell>
                    <Input type="number" step="0.01" className="w-24"
                      value={config.mountingMultipliers[key]}
                      onChange={(e) => updateMounting(key, Number(e.target.value))} />
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {config.mountingMultipliers[key] >= 1 ? "+" : ""}
                    {((config.mountingMultipliers[key] - 1) * 100).toFixed(0)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Costo extra por tipo de sistema */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
              <Zap className="size-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Costo extra por tipo de sistema</CardTitle>
              <CardDescription>
                USD adicionales por kW instalado. On-Grid no tiene costo extra.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Tipo de sistema</TableHead>
                <TableHead>USD extra / kW</TableHead>
                <TableHead className="text-right text-xs text-muted-foreground">Incluye</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">On-Grid</TableCell>
                <TableCell>
                  <Input type="number" className="w-24" disabled value={0} />
                </TableCell>
                <TableCell className="text-right text-xs text-muted-foreground">
                  Solo inversor grid-tie
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Off-Grid</TableCell>
                <TableCell>
                  <Input type="number" className="w-24"
                    value={config.systemExtraCostPerKw["off-grid"]}
                    onChange={(e) => updateSystemCost("off-grid", Number(e.target.value))} />
                </TableCell>
                <TableCell className="text-right text-xs text-muted-foreground">
                  Baterías + inversor off-grid
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Híbrido</TableCell>
                <TableCell>
                  <Input type="number" className="w-24"
                    value={config.systemExtraCostPerKw["hybrid"]}
                    onChange={(e) => updateSystemCost("hybrid", Number(e.target.value))} />
                </TableCell>
                <TableCell className="text-right text-xs text-muted-foreground">
                  Baterías + inversor híbrido
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Financiero */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
              <DollarSign className="size-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Configuración financiera</CardTitle>
              <CardDescription>Margen y opciones de financiamiento</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="marginPercentage">Margen (%)</Label>
              <Input id="marginPercentage" type="number"
                value={config.marginPercentage}
                onChange={(e) => update("marginPercentage", Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label>Financiamiento</Label>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <span className="text-sm">Ofrecer opciones de financiamiento</span>
                <Switch
                  checked={config.enableFinancing}
                  onCheckedChange={(checked) => update("enableFinancing", checked)} />
              </div>
            </div>
          </div>
          {config.enableFinancing && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="interestRate">Tasa de interés (%)</Label>
                <Input id="interestRate" type="number" step="0.1"
                  value={config.interestRate}
                  onChange={(e) => update("interestRate", Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="loanTermYears">Plazo (años)</Label>
                <Input id="loanTermYears" type="number"
                  value={config.loanTermYears}
                  onChange={(e) => update("loanTermYears", Number(e.target.value))} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}