"use client"

import { useState } from "react"
import { Save, RotateCcw, Loader2 } from "lucide-react"
import { QuoteConfigForm } from "@/components/quote-config-form"
import { QuotePreview } from "@/components/quote-preview"
import { Button } from "@/components/ui/button"
import { defaultQuoteConfig } from "@/lib/types"
import type { QuoteConfig } from "@/lib/types"

export default function QuoteConfigPage() {
  const [config, setConfig] = useState<QuoteConfig>(defaultQuoteConfig)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  const handleReset = () => {
    setConfig(defaultQuoteConfig)
  }

  return (
    <div className="flex h-full flex-col">
      {/* Main Content Area */}
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* Preview Panel - Fixed on desktop (order changes on lg) */}
        <div className="order-2 border-t border-border lg:order-2 lg:w-80 lg:border-l lg:border-t-0 xl:w-96">
          <div className="h-full p-5">
            <QuotePreview config={config} />
          </div>
        </div>

        {/* Form Area - Scrollable (scrollbar will be on the right edge next to preview) */}
        <div className="order-1 flex-1 overflow-y-auto p-6 pb-4 lg:order-1">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">
              Solar Quote Configuration
            </h1>
            <p className="text-muted-foreground">
              Configure your pricing variables and calculator settings
            </p>
          </div>
          <QuoteConfigForm config={config} onConfigChange={setConfig} />
        </div>
      </div>

      {/* Action Buttons - Full width sticky footer */}
      <div className="flex items-center justify-end gap-3 border-t border-border bg-background px-6 py-4">
        <Button variant="outline" onClick={handleReset} disabled={isSaving}>
          <RotateCcw className="mr-2 size-4" />
          Reset to Defaults
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <Save className="mr-2 size-4" />
          )}
          Save Changes
        </Button>
      </div>
    </div>
  )
}
