'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProgressStepsProps {
  currentStep: number
  totalSteps: number
  steps: { label: string; shortLabel: string }[]
}

export function ProgressSteps({ currentStep, totalSteps, steps }: ProgressStepsProps) {
  return (
    <div className="w-full">
      {/* Mobile: Simple progress bar */}
      <div className="block md:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            {steps[currentStep - 1]?.label}
          </span>
          <span className="text-sm text-muted-foreground">
            {currentStep} / {totalSteps}
          </span>
        </div>
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          />
        </div>
      </div>

      {/* Desktop: Full step indicator */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const stepNumber = index + 1
            const isCompleted = stepNumber < currentStep
            const isCurrent = stepNumber === currentStep
            const isUpcoming = stepNumber > currentStep

            return (
              <div key={step.label} className="flex items-center">
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={false}
                    animate={{
                      scale: isCurrent ? 1.1 : 1,
                      backgroundColor: isCompleted
                        ? 'var(--primary)'
                        : isCurrent
                          ? 'var(--primary)'
                          : 'var(--muted)',
                    }}
                    className={cn(
                      'relative flex h-10 w-10 items-center justify-center rounded-full transition-colors',
                      isCompleted || isCurrent
                        ? 'text-primary-foreground'
                        : 'text-muted-foreground'
                    )}
                  >
                    {isCompleted ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      >
                        <Check className="h-5 w-5" />
                      </motion.div>
                    ) : (
                      <span className="text-sm font-semibold">{stepNumber}</span>
                    )}

                    {isCurrent && (
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-primary"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1.2, opacity: [0, 1, 0] }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                      />
                    )}
                  </motion.div>

                  <motion.span
                    initial={false}
                    animate={{
                      color: isCurrent
                        ? 'var(--foreground)'
                        : isCompleted
                          ? 'var(--primary)'
                          : 'var(--muted-foreground)',
                    }}
                    className={cn(
                      'mt-2 text-xs font-medium text-center max-w-[80px]',
                      isCurrent && 'font-semibold'
                    )}
                  >
                    {step.shortLabel}
                  </motion.span>
                </div>

                {index < steps.length - 1 && (
                  <div className="relative mx-2 h-0.5 flex-1 min-w-[40px] bg-muted overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: isCompleted ? '100%' : '0%' }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
