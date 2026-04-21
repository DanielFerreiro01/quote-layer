"use client";

import { motion } from "framer-motion";
import { Check, Users, Zap } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left column — decorative, hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 sticky top-0 h-screen flex-col justify-between bg-gradient-to-br from-primary/20 via-primary/5 to-background p-12 overflow-hidden">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
            <Zap className="size-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-foreground">QuoteLayer</span>
        </Link>

        {/* Center content */}
        <div className="flex flex-col gap-8">
          {/* Badge */}
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur-sm">
            <Users className="size-3.5 text-primary" />
            Más de 120 instaladoras confían en QuoteLayer
          </div>

          {/* Headline */}
          <div className="flex flex-col gap-3">
            <h1 className="text-balance text-4xl font-bold leading-tight text-foreground">
              Transforma tu proceso de cotización
            </h1>
            <p className="text-pretty text-base leading-relaxed text-muted-foreground">
              De cotizar por WhatsApp a recibir leads calificados
              automáticamente en tu dashboard.
            </p>
          </div>

          {/* Features */}
          <ul className="flex flex-col gap-3">
            {[
              "Cotizador embebible en tu sitio en 5 minutos",
              "Leads automáticos con datos completos",
              "Configuración de precios sin código",
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-sm text-foreground">
                <Check className="size-4 shrink-0 text-primary" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Testimonial card */}
        <div className="rounded-xl border border-border bg-background/60 p-5 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary">
              CM
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">Carlos M.</span>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                  Solar
                </span>
              </div>
              <span className="text-xs text-muted-foreground">SolarTech Argentina</span>
            </div>
          </div>
          <p className="mt-3 text-sm italic leading-relaxed text-muted-foreground">
            &quot;Pasamos de cotizar por WhatsApp a recibir 40 leads calificados por mes.&quot;
          </p>
          <p className="mt-2 text-sm text-primary">★★★★★</p>
        </div>
      </div>

      {/* Right column — form */}
      <div className="flex w-full min-h-screen items-center justify-center overflow-y-auto p-6 lg:w-1/2 lg:p-12">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
