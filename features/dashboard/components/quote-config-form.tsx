"use client"

import { Button } from "@/components/ui/button"
import { RotateCcw, Loader2, Save } from "lucide-react"

import {
  Settings,
  DollarSign,
  SunMedium,
  Users,
  Building2,
  Wrench,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { QuoteConfig } from "@/lib/types"

interface QuoteConfigFormProps {
  config: QuoteConfig
  onConfigChange: (config: QuoteConfig) => void
  handleReset: () => void
  handleSave: () => void
  isSaving: boolean
}

export function QuoteConfigForm({ config, onConfigChange, handleReset, handleSave, isSaving }: QuoteConfigFormProps) {
  const updateConfig = <K extends keyof QuoteConfig>(
    key: K,
    value: QuoteConfig[K]
  ) => {
    onConfigChange({ ...config, [key]: value })
  }

  const updateClientMultiplier = (
    key: keyof QuoteConfig["clientMultipliers"],
    value: number
  ) => {
    onConfigChange({
      ...config,
      clientMultipliers: { ...config.clientMultipliers, [key]: value },
    })
  }

  const updateMountingMultiplier = (
    key: keyof QuoteConfig["mountingMultipliers"],
    value: number
  ) => {
    onConfigChange({
      ...config,
      mountingMultipliers: { ...config.mountingMultipliers, [key]: value },
    })
  }

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
              <Settings className="size-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">General Settings</CardTitle>
              <CardDescription>
                Basic configuration for your quote calculator
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="providerName">Provider Name</Label>
              <Input
                id="providerName"
                value={config.providerName}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Contact support to change your provider name
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quoteStatus">Quote Status</Label>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Calculator</span>
                    <Badge variant={config.isActive ? "default" : "secondary"} className="text-[10px] px-1.5 py-0">
                      {config.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enable or disable the public quote calculator
                  </p>
                </div>
                <Switch
                  id="quoteStatus"
                  checked={config.isActive}
                  onCheckedChange={(checked) => updateConfig("isActive", checked)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Base Costs */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
              <DollarSign className="size-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Base Costs</CardTitle>
              <CardDescription>
                Define your pricing structure and electricity rates
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="baseCostPerKw">Base Cost per kW (USD)</Label>
              <Input
                id="baseCostPerKw"
                type="number"
                value={config.baseCostPerKw}
                onChange={(e) =>
                  updateConfig("baseCostPerKw", Number(e.target.value))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="electricityCostPerKwh">
                Electricity Cost per kWh
              </Label>
              <Input
                id="electricityCostPerKwh"
                type="number"
                step="0.01"
                value={config.electricityCostPerKwh}
                onChange={(e) =>
                  updateConfig("electricityCostPerKwh", Number(e.target.value))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="annualElectricityIncrease">
                Annual Price Increase (%)
              </Label>
              <Input
                id="annualElectricityIncrease"
                type="number"
                step="0.1"
                value={config.annualElectricityIncrease}
                onChange={(e) =>
                  updateConfig("annualElectricityIncrease", Number(e.target.value))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Parameters */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
              <SunMedium className="size-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">System Parameters</CardTitle>
              <CardDescription>
                Technical specifications for solar calculations
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="panelWattCapacity">Panel Watt Capacity</Label>
              <Input
                id="panelWattCapacity"
                type="number"
                value={config.panelWattCapacity}
                onChange={(e) =>
                  updateConfig("panelWattCapacity", Number(e.target.value))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sunHoursPerDay">Sun Hours per Day</Label>
              <Input
                id="sunHoursPerDay"
                type="number"
                step="0.1"
                value={config.sunHoursPerDay}
                onChange={(e) =>
                  updateConfig("sunHoursPerDay", Number(e.target.value))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="systemEfficiency">System Efficiency (0-1)</Label>
              <Input
                id="systemEfficiency"
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={config.systemEfficiency}
                onChange={(e) =>
                  updateConfig("systemEfficiency", Number(e.target.value))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectionYears">Projection Years</Label>
              <Input
                id="projectionYears"
                type="number"
                value={config.projectionYears}
                onChange={(e) =>
                  updateConfig("projectionYears", Number(e.target.value))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Client Type Multipliers */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
              <Users className="size-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Client Type Multipliers</CardTitle>
              <CardDescription>
                Price adjustments based on customer segment
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Client Type</TableHead>
                <TableHead>Multiplier</TableHead>
                <TableHead className="text-right">Effect</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Residential</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    className="w-24"
                    value={config.clientMultipliers.residential}
                    onChange={(e) =>
                      updateClientMultiplier("residential", Number(e.target.value))
                    }
                  />
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {config.clientMultipliers.residential >= 1 ? "+" : ""}
                  {((config.clientMultipliers.residential - 1) * 100).toFixed(0)}%
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Industrial</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    className="w-24"
                    value={config.clientMultipliers.industrial}
                    onChange={(e) =>
                      updateClientMultiplier("industrial", Number(e.target.value))
                    }
                  />
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {config.clientMultipliers.industrial >= 1 ? "+" : ""}
                  {((config.clientMultipliers.industrial - 1) * 100).toFixed(0)}%
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Agricultural</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    className="w-24"
                    value={config.clientMultipliers.agro}
                    onChange={(e) =>
                      updateClientMultiplier("agro", Number(e.target.value))
                    }
                  />
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {config.clientMultipliers.agro >= 1 ? "+" : ""}
                  {((config.clientMultipliers.agro - 1) * 100).toFixed(0)}%
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Mounting Type Multipliers */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="size-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Mounting Type Multipliers</CardTitle>
              <CardDescription>
                Price adjustments based on installation type
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Mounting Type</TableHead>
                <TableHead>Multiplier</TableHead>
                <TableHead className="text-right">Effect</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Roof (Sheet)</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    className="w-24"
                    value={config.mountingMultipliers.roofSheet}
                    onChange={(e) =>
                      updateMountingMultiplier("roofSheet", Number(e.target.value))
                    }
                  />
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {config.mountingMultipliers.roofSheet >= 1 ? "+" : ""}
                  {((config.mountingMultipliers.roofSheet - 1) * 100).toFixed(0)}%
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Roof (Tile)</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    className="w-24"
                    value={config.mountingMultipliers.roofTile}
                    onChange={(e) =>
                      updateMountingMultiplier("roofTile", Number(e.target.value))
                    }
                  />
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {config.mountingMultipliers.roofTile >= 1 ? "+" : ""}
                  {((config.mountingMultipliers.roofTile - 1) * 100).toFixed(0)}%
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Ground</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    className="w-24"
                    value={config.mountingMultipliers.ground}
                    onChange={(e) =>
                      updateMountingMultiplier("ground", Number(e.target.value))
                    }
                  />
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {config.mountingMultipliers.ground >= 1 ? "+" : ""}
                  {((config.mountingMultipliers.ground - 1) * 100).toFixed(0)}%
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Carport</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    className="w-24"
                    value={config.mountingMultipliers.carport}
                    onChange={(e) =>
                      updateMountingMultiplier("carport", Number(e.target.value))
                    }
                  />
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {config.mountingMultipliers.carport >= 1 ? "+" : ""}
                  {((config.mountingMultipliers.carport - 1) * 100).toFixed(0)}%
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Maintenance */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
              <Wrench className="size-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Maintenance</CardTitle>
              <CardDescription>
                Annual maintenance cost configuration
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="max-w-sm space-y-2">
            <Label htmlFor="annualMaintenanceRate">
              Annual Maintenance Rate (%)
            </Label>
            <Input
              id="annualMaintenanceRate"
              type="number"
              step="0.1"
              value={config.annualMaintenanceRate}
              onChange={(e) =>
                updateConfig("annualMaintenanceRate", Number(e.target.value))
              }
            />
            <p className="text-xs text-muted-foreground">
              Percentage of system cost charged annually for maintenance
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
