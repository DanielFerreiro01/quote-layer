'use client'

import React from "react"

import { motion } from 'framer-motion'
import { Sun, Moon, Blend, Zap } from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { ConsumptionData, TimeProfile } from '@/lib/solar-types'

interface StepConsumptionProps {
  data: ConsumptionData
  onChange: (data: ConsumptionData) => void
  errors?: Record<string, string>
}

const timeProfiles: { value: TimeProfile; label: string; icon: React.ReactNode; description: string }[] = [
  {
    value: 'day',
    label: 'Diurno',
    icon: <Sun className="h-5 w-5" />,
    description: 'Mayor consumo de día',
  },
  {
    value: 'night',
    label: 'Nocturno',
    icon: <Moon className="h-5 w-5" />,
    description: 'Mayor consumo de noche',
  },
  {
    value: 'mixed',
    label: 'Mixto',
    icon: <Blend className="h-5 w-5" />,
    description: 'Consumo equilibrado',
  },
]

const consumptionLevels = [
  { min: 0, max: 300, label: 'Bajo', description: 'Hogar pequeño' },
  { min: 301, max: 600, label: 'Medio', description: 'Hogar típico' },
  { min: 601, max: 1000, label: 'Alto', description: 'Hogar grande' },
  { min: 1001, max: 2000, label: 'Muy Alto', description: 'Comercio pequeño' },
  { min: 2001, max: 5000, label: 'Comercial', description: 'Negocio mediano' },
  { min: 5001, max: 15000, label: 'Industrial', description: 'Gran consumidor' },
]

function getConsumptionLevel(kwh: number) {
  return consumptionLevels.find((level) => kwh >= level.min && kwh <= level.max) || consumptionLevels[consumptionLevels.length - 1]
}

export function StepConsumption({ data, onChange }: StepConsumptionProps) {
  const handleKwhChange = (value: number[]) => {
    onChange({ ...data, monthlyKwh: value[0] })
  }

  const handleProfileChange = (profile: TimeProfile) => {
    onChange({ ...data, timeProfile: profile })
  }

  const currentLevel = getConsumptionLevel(data.monthlyKwh)

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="space-y-8"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Consumo energético
        </h2>
        <p className="text-muted-foreground">
          Ayúdanos a dimensionar tu sistema solar ideal.
        </p>
      </div>

      <div className="space-y-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Consumo mensual</Label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {currentLevel.label}
              </span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">
                {currentLevel.description}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
              <div className="flex items-center justify-center gap-3">
                <Zap className="h-8 w-8 text-primary" />
                <div className="text-center">
                  <motion.span
                    key={data.monthlyKwh}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-bold text-foreground tabular-nums"
                  >
                    {data.monthlyKwh.toLocaleString()}
                  </motion.span>
                  <span className="text-lg text-muted-foreground ml-2">
                    kWh/mes
                  </span>
                </div>
              </div>
            </div>

            <Slider
              value={[data.monthlyKwh]}
              onValueChange={handleKwhChange}
              min={100}
              max={15000}
              step={50}
              className="py-4"
            />

            <div className="flex justify-between text-xs text-muted-foreground">
              <span>100 kWh</span>
              <span>15,000 kWh</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-sm font-medium">Perfil de consumo horario</Label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {timeProfiles.map((profile) => (
              <motion.button
                key={profile.value}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleProfileChange(profile.value)}
                className={cn(
                  'relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200',
                  data.timeProfile === profile.value
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border bg-card hover:border-primary/50 hover:bg-accent/50'
                )}
              >
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
                    data.timeProfile === profile.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {profile.icon}
                </div>
                <div className="text-center">
                  <p
                    className={cn(
                      'font-medium',
                      data.timeProfile === profile.value
                        ? 'text-primary'
                        : 'text-foreground'
                    )}
                  >
                    {profile.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {profile.description}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-xl bg-muted/50 border border-border"
        >
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Tip: </span>
            Puedes encontrar tu consumo mensual en tu factura de luz. Busca el valor en kWh del último mes o el promedio de los últimos 12 meses.
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
