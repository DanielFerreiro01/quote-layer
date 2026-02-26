"use client"

import { useState, useMemo } from "react"
import { Calculator, Zap, PanelTop, DollarSign, TrendingUp } from "lucide-react"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { QuoteConfig, QuotePreviewInputs } from "@/lib/types"
import { calculateQuote } from "@/lib/quote-calculator"

interface QuotePreviewProps {
  config: QuoteConfig
}

export function QuotePreview({ config }: QuotePreviewProps) {
  const [inputs, setInputs] = useState<QuotePreviewInputs>({
    monthlyKwh: 800,
    clientType: "residential",
    mountingType: "roofSheet",
  })

  const outputs = useMemo(() => calculateQuote(config, inputs), [config, inputs])

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 pb-5">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
          <Calculator className="size-4 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-semibold">Quote Preview</h3>
          <p className="text-xs text-muted-foreground">Live calculator preview</p>
        </div>
      </div>

      {/* Inputs Section */}
      <div className="space-y-4 border-t border-border pt-5">
        <div className="space-y-1.5">
          <Label htmlFor="monthlyKwh" className="text-xs text-muted-foreground">
            Monthly Usage (kWh)
          </Label>
          <Input
            id="monthlyKwh"
            type="number"
            value={inputs.monthlyKwh}
            onChange={(e) =>
              setInputs({ ...inputs, monthlyKwh: Number(e.target.value) })
            }
            className="h-9"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="clientType" className="text-xs text-muted-foreground">
            Client Type
          </Label>
          <Select
            value={inputs.clientType}
            onValueChange={(value) =>
              setInputs({
                ...inputs,
                clientType: value as QuotePreviewInputs["clientType"],
              })
            }
          >
            <SelectTrigger id="clientType" className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="industrial">Industrial</SelectItem>
              <SelectItem value="agro">Agricultural</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="mountingType" className="text-xs text-muted-foreground">
            Mounting Type
          </Label>
          <Select
            value={inputs.mountingType}
            onValueChange={(value) =>
              setInputs({
                ...inputs,
                mountingType: value as QuotePreviewInputs["mountingType"],
              })
            }
          >
            <SelectTrigger id="mountingType" className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="roofSheet">Roof (Sheet)</SelectItem>
              <SelectItem value="roofTile">Roof (Tile)</SelectItem>
              <SelectItem value="ground">Ground</SelectItem>
              <SelectItem value="carport">Carport</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Section */}
      <div className="mt-5 border-t border-border pt-5">
        <h4 className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Estimated Results
        </h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <Zap className="size-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">System Size</span>
            </div>
            <span className="text-sm font-medium">{outputs.systemSizeKw} kW</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <PanelTop className="size-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Panel Count</span>
            </div>
            <span className="text-sm font-medium">{outputs.panelCount}</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">ROI Period</span>
            </div>
            <span className="text-sm font-medium">{outputs.roiYears} years</span>
          </div>
        </div>
      </div>

      {/* Total Section */}
      <div className="mt-5 border-t border-border pt-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="size-5 text-primary" />
            <span className="font-medium">Total Estimate</span>
          </div>
          <span className="text-xl font-bold text-primary">
            ${outputs.estimatedCost.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )
}
