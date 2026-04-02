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

import { calculateQuote } from "@/lib/quote-calculator"
import { QuoteConfig, QuotePreviewInputs } from "@/lib/types"

interface QuotePreviewProps {
  config: QuoteConfig
}

export function QuotePreview({ config }: QuotePreviewProps) {
  const [inputs, setInputs] = useState<QuotePreviewInputs>({
    monthlyKwh: 800,
    clientType: "residential",
    mountingType: "roofSheet",
    systemType: "on-grid",
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
          <h3 className="text-sm font-semibold">Vista previa</h3>
          <p className="text-xs text-muted-foreground">Cotizador en vivo</p>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4 border-t border-border pt-5">
        <div className="space-y-1.5">
          <Label htmlFor="monthlyKwh" className="text-xs text-muted-foreground">
            Consumo mensual (kWh)
          </Label>
          <Input
            id="monthlyKwh"
            type="number"
            value={inputs.monthlyKwh}
            onChange={(e) => setInputs({ ...inputs, monthlyKwh: Number(e.target.value) })}
            className="h-9"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="clientType" className="text-xs text-muted-foreground">
            Tipo de cliente
          </Label>
          <Select
            value={inputs.clientType}
            onValueChange={(value) =>
              setInputs({ ...inputs, clientType: value as QuotePreviewInputs["clientType"] })
            }
          >
            <SelectTrigger id="clientType" className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="residential">Residencial</SelectItem>
              <SelectItem value="industrial">Industrial</SelectItem>
              <SelectItem value="agro">Agroindustrial</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="systemType" className="text-xs text-muted-foreground">
            Tipo de sistema
          </Label>
          <Select
            value={inputs.systemType}
            onValueChange={(value) =>
              setInputs({ ...inputs, systemType: value as QuotePreviewInputs["systemType"] })
            }
          >
            <SelectTrigger id="systemType" className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="on-grid">On-Grid</SelectItem>
              <SelectItem value="off-grid">Off-Grid</SelectItem>
              <SelectItem value="hybrid">Híbrido</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="mountingType" className="text-xs text-muted-foreground">
            Tipo de montaje
          </Label>
          <Select
            value={inputs.mountingType}
            onValueChange={(value) =>
              setInputs({ ...inputs, mountingType: value as QuotePreviewInputs["mountingType"] })
            }
          >
            <SelectTrigger id="mountingType" className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="roofSheet">Techo (Chapa)</SelectItem>
              <SelectItem value="roofTile">Techo (Teja)</SelectItem>
              <SelectItem value="ground">Suelo</SelectItem>
              <SelectItem value="carport">Carport</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results */}
      <div className="mt-5 border-t border-border pt-5">
        <h4 className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Resultado estimado
        </h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <Zap className="size-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Potencia del sistema</span>
            </div>
            <span className="text-sm font-medium">{outputs.systemSize} kW</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <PanelTop className="size-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Cantidad de paneles</span>
            </div>
            <span className="text-sm font-medium">{outputs.panelCount}</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Retorno de inversión</span>
            </div>
            <span className="text-sm font-medium">{outputs.paybackYears} años</span>
          </div>
        </div>
      </div>

      {/* Total */}
      <div className="mt-5 border-t border-border pt-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="size-5 text-primary" />
            <span className="font-medium">Total estimado</span>
          </div>
          <span className="text-xl font-bold text-primary">
            ${outputs.totalCost.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )
}