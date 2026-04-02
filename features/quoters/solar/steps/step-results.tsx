"use client";

import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { TrendingUp, DollarSign, Calendar, Zap, LayoutGrid, Percent } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";
import type { SolarCalculation } from "@/lib/solar/solar-types";

interface StepResultsProps {
  calculation: SolarCalculation;
}

const SYSTEM_TYPE_LABELS: Record<string, string> = {
  "on-grid":  "On-Grid",
  "off-grid": "Off-Grid",
  "hybrid":   "Híbrido",
};

const MOUNTING_TYPE_LABELS: Record<string, string> = {
  "roof-sheet": "Techo Chapa",
  "roof-tile":  "Techo Teja",
  "ground":     "Suelo",
  "carport":    "Carport",
};

export function StepResults({ calculation }: StepResultsProps) {
  const { system, costs, economics } = calculation;

  const chartData = economics.projection.map((item) => ({
    year: item.year,
    "Red Eléctrica": Math.round(item.billWithoutSolar * item.year),
    "Sistema Solar":  Math.round(costs.total + item.billWithSolar * item.year),
  }));

  const netSavings = (economics.projection[24]?.cumulativeSavings ?? 0) - costs.total;

  const stats = [
    { label: "Inversión Total",      value: `$${costs.total.toLocaleString()}`,             sublabel: "USD",          icon: <DollarSign className="h-5 w-5" />, color: "text-primary" },
    { label: "Ahorro Mensual",        value: `$${economics.monthlySavings.toLocaleString()}`, sublabel: "USD/mes",       icon: <TrendingUp className="h-5 w-5" />, color: "text-success" },
    { label: "Retorno de Inversión",  value: `${economics.paybackYears}`,                    sublabel: "años",          icon: <Calendar className="h-5 w-5" />,   color: "text-primary" },
    { label: "Potencia del Sistema",  value: `${system.power}`,                              sublabel: "kW",            icon: <Zap className="h-5 w-5" />,        color: "text-warning" },
    { label: "Paneles Solares",       value: `${system.panels}`,                             sublabel: "unidades",      icon: <LayoutGrid className="h-5 w-5" />, color: "text-primary" },
    { label: "Cobertura",             value: `${system.coveragePercentage}%`,                sublabel: "de tu consumo", icon: <Percent className="h-5 w-5" />,    color: "text-success" },
  ];

  const gridColor  = "#f97316";
  const solarColor = "#22c55e";

  const mountingMultiplier = calculation.config.costs.mountingMultipliers[system.mountingType];
  const hasComplexityExtra = mountingMultiplier > 1;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="space-y-8"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Tu cotización solar</h2>
        <p className="text-muted-foreground">Análisis personalizado de tu inversión en energía solar.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
            <Card className="border-border bg-card hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <span className={stat.color}>{stat.icon}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-foreground tabular-nums">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.sublabel}</p>
                  <p className="text-sm font-medium text-foreground/80">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Proyección de costos a 25 años</CardTitle>
            <p className="text-sm text-muted-foreground">Red eléctrica vs. sistema solar</p>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{ "Red Eléctrica": { label: "Red Eléctrica", color: gridColor }, "Sistema Solar": { label: "Sistema Solar", color: solarColor } }}
              className="h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gridGradient"  x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={gridColor}  stopOpacity={0.3} />
                      <stop offset="95%" stopColor={gridColor}  stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="solarGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={solarColor} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={solarColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                  <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} tickFormatter={(v) => `Año ${v}`} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} width={50} />
                  <ChartTooltip content={<ChartTooltipContent formatter={(value, name) => (<span>{name}: <strong>${Number(value).toLocaleString()}</strong></span>)} />} />
                  <Area type="monotone" dataKey="Red Eléctrica" stroke={gridColor}  strokeWidth={2} fill="url(#gridGradient)" />
                  <Area type="monotone" dataKey="Sistema Solar"  stroke={solarColor} strokeWidth={2} fill="url(#solarGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: gridColor }} />
                <span className="text-sm text-muted-foreground">Red Eléctrica</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: solarColor }} />
                <span className="text-sm text-muted-foreground">Sistema Solar</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ROI */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        className="p-4 rounded-xl bg-success/10 border border-success/20"
      >
        <div className="flex items-start gap-3">
          <TrendingUp className="h-5 w-5 text-success mt-0.5" />
          <div>
            <p className="font-medium text-foreground">
              Tu inversión se recupera en {economics.paybackYears} años
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Después del período de recuperación, generarás energía prácticamente gratis durante los
              siguientes {Math.round(25 - economics.paybackYears)} años de vida útil del sistema.
            </p>
            <p className="text-sm font-semibold text-success mt-2">
              Ahorro neto a 25 años: ${netSavings.toLocaleString()} USD
            </p>
          </div>
        </div>
      </motion.div>

      {/* Cost breakdown */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Desglose de costos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">

            {/* Equipamiento */}
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider pt-1">Equipamiento</p>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Paneles ({system.panels} × {Math.round(system.power / system.panels * 1000)}W)</span>
              <span className="font-medium">${costs.panels.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Inversor ({system.inverterPower} kW)</span>
              <span className="font-medium">${costs.inverter.toLocaleString()}</span>
            </div>

            <Separator className="my-2" />

            {/* Operativo */}
            <div className="flex justify-between items-center">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Operativo
                {hasComplexityExtra && (
                  <span className="ml-2 normal-case font-normal">
                    (× {mountingMultiplier} {MOUNTING_TYPE_LABELS[system.mountingType]})
                  </span>
                )}
              </p>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Instalación base</span>
              <span className="font-medium">${costs.baseInstallation.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mano de obra</span>
              <span className="font-medium">${costs.labor.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estructura ({system.panels} paneles)</span>
              <span className="font-medium">${costs.structure.toLocaleString()}</span>
            </div>

            {/* Extra tipo de sistema */}
            {costs.systemTypeExtra > 0 && (
              <>
                <Separator className="my-2" />
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Sistema {SYSTEM_TYPE_LABELS[system.systemType]}</p>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Baterías + inversor {SYSTEM_TYPE_LABELS[system.systemType].toLowerCase()}</span>
                  <span className="font-medium">${costs.systemTypeExtra.toLocaleString()}</span>
                </div>
              </>
            )}

            <Separator className="my-2" />

            {/* Totales */}
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>${costs.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Margen ({((costs.margin / costs.subtotal) * 100).toFixed(0)}%)</span>
              <span>${costs.margin.toLocaleString()}</span>
            </div>

            <Separator className="my-2" />

            <div className="flex justify-between font-semibold text-base">
              <span>Total</span>
              <span className="text-primary">${costs.total.toLocaleString()} USD</span>
            </div>

          </CardContent>
        </Card>
      </motion.div>

    </motion.div>
  );
}