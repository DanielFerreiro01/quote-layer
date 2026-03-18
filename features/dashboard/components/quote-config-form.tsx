"use client";

import {
  Settings,
  DollarSign,
  SunMedium,
  Users,
  Building2,
  Wrench,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { QuoteConfig } from "@/lib/types";

interface QuoteConfigFormProps {
  config: QuoteConfig;
  onConfigChange: (config: QuoteConfig) => void;
}

export function QuoteConfigForm({ config, onConfigChange }: QuoteConfigFormProps) {
  const updateConfig = <K extends keyof QuoteConfig>(
    key: K,
    value: QuoteConfig[K]
  ) => {
    onConfigChange({ ...config, [key]: value });
  };

  const updateClientMultiplier = (
    key: keyof QuoteConfig["clientMultipliers"],
    value: number
  ) => {
    onConfigChange({
      ...config,
      clientMultipliers: { ...config.clientMultipliers, [key]: value },
    });
  };

  const updateMountingMultiplier = (
    key: keyof QuoteConfig["mountingMultipliers"],
    value: number
  ) => {
    onConfigChange({
      ...config,
      mountingMultipliers: { ...config.mountingMultipliers, [key]: value },
    });
  };

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
              <Label htmlFor="baseCostPerKw">Base Cost per kW ($)</Label>
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
              <Label htmlFor="electricityCostPerKwh">Electricity Cost ($/kWh)</Label>
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
          </div>
        </CardContent>
      </Card>

      {/* System Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
              <SunMedium className="size-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">System Configuration</CardTitle>
              <CardDescription>
                Technical specifications for solar panels
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="panelPower">Panel Power (W)</Label>
              <Input
                id="panelPower"
                type="number"
                value={config.panelPower}
                onChange={(e) =>
                  updateConfig("panelPower", Number(e.target.value))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="systemEfficiency">System Efficiency (%)</Label>
              <Input
                id="systemEfficiency"
                type="number"
                step="0.01"
                max="1"
                value={config.systemEfficiency}
                onChange={(e) =>
                  updateConfig("systemEfficiency", Number(e.target.value))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="peakSunHours">Peak Sun Hours</Label>
              <Input
                id="peakSunHours"
                type="number"
                step="0.1"
                value={config.peakSunHours}
                onChange={(e) =>
                  updateConfig("peakSunHours", Number(e.target.value))
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
              <Wrench className="size-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Mounting Type Multipliers</CardTitle>
              <CardDescription>
                Cost adjustments based on installation type
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

      {/* Financial Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
              <DollarSign className="size-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Financial Settings</CardTitle>
              <CardDescription>
                Margin and financing configuration
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="marginPercentage">Margin Percentage (%)</Label>
              <Input
                id="marginPercentage"
                type="number"
                value={config.marginPercentage}
                onChange={(e) =>
                  updateConfig("marginPercentage", Number(e.target.value))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="financing">Enable Financing</Label>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <span className="text-sm">Offer financing options</span>
                <Switch
                  id="financing"
                  checked={config.enableFinancing}
                  onCheckedChange={(checked) =>
                    updateConfig("enableFinancing", checked)
                  }
                />
              </div>
            </div>
          </div>
          {config.enableFinancing && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="interestRate">Interest Rate (%)</Label>
                <Input
                  id="interestRate"
                  type="number"
                  step="0.1"
                  value={config.interestRate}
                  onChange={(e) =>
                    updateConfig("interestRate", Number(e.target.value))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="loanTermYears">Loan Term (years)</Label>
                <Input
                  id="loanTermYears"
                  type="number"
                  value={config.loanTermYears}
                  onChange={(e) =>
                    updateConfig("loanTermYears", Number(e.target.value))
                  }
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}