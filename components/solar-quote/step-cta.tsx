'use client'

import { motion } from 'framer-motion'
import { MessageCircle, CheckCircle, ArrowRight, Mail, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { FormData, SolarCalculation } from '@/lib/solar-types'
import { generateWhatsAppMessage } from '@/lib/solar-calculations'

interface StepCTAProps {
  formData: FormData
  calculation: SolarCalculation
}

const WHATSAPP_NUMBER = '5491112345678'

export function StepCTA({ formData, calculation }: StepCTAProps) {
  const whatsappMessage = generateWhatsAppMessage(formData, calculation)
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`

  const benefits = [
    'Asesoramiento personalizado sin compromiso',
    'Visita técnica para evaluar tu instalación',
    'Financiamiento flexible disponible',
    'Garantía extendida en equipos',
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="space-y-8"
    >
      <div className="space-y-2 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="flex justify-center mb-4"
        >
          <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-success" />
          </div>
        </motion.div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          ¡Tu cotización está lista!
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Contacta con nuestro equipo para comenzar tu proyecto solar y obtener una propuesta detallada.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-transparent">
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-6">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Resumen de tu cotización
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-left">
                    <p className="text-muted-foreground">Sistema</p>
                    <p className="font-medium text-foreground">{calculation.systemSizeKw} kW</p>
                  </div>
                  <div className="text-left">
                    <p className="text-muted-foreground">Paneles</p>
                    <p className="font-medium text-foreground">{calculation.panelCount} unidades</p>
                  </div>
                  <div className="text-left">
                    <p className="text-muted-foreground">Inversión</p>
                    <p className="font-medium text-foreground">${calculation.costUSD.toLocaleString()} USD</p>
                  </div>
                  <div className="text-left">
                    <p className="text-muted-foreground">ROI</p>
                    <p className="font-medium text-foreground">{calculation.roiYears} años</p>
                  </div>
                </div>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button
                  size="lg"
                  className="w-full h-14 text-base font-semibold bg-[#25D366] hover:bg-[#22c55e] text-white shadow-lg shadow-[#25D366]/20 transition-all hover:shadow-xl hover:shadow-[#25D366]/30"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Contactar por WhatsApp
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </a>

              <p className="text-xs text-muted-foreground text-center">
                Al hacer clic, se abrirá WhatsApp con un mensaje preformateado con todos los datos de tu cotización.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground text-center">
          Al contactarnos recibirás:
        </h4>
        <div className="grid gap-3">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
            >
              <CheckCircle className="h-4 w-4 text-success shrink-0" />
              <span className="text-sm text-foreground">{benefit}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="pt-6 border-t border-border"
      >
        <p className="text-sm text-muted-foreground text-center mb-4">
          También puedes contactarnos por:
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Mail className="h-4 w-4" />
            ventas@solarquote.pro
          </Button>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Phone className="h-4 w-4" />
            +54 11 1234-5678
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}
