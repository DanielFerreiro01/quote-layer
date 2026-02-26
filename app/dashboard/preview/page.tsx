"use client"

import { useState } from "react"
import { Monitor, Smartphone, Tablet, ExternalLink } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { QuotePreview } from "@/components/quote-preview"
import { defaultQuoteConfig } from "@/lib/types"

export default function PreviewPage() {
  const [viewMode, setViewMode] = useState("desktop")

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Calculator Preview
          </h1>
          <p className="text-muted-foreground">
            Preview how your quote calculator appears to customers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ToggleGroup
            type="single"
            value={viewMode}
            onValueChange={(value) => value && setViewMode(value)}
          >
            <ToggleGroupItem value="desktop" aria-label="Desktop view">
              <Monitor className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="tablet" aria-label="Tablet view">
              <Tablet className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="mobile" aria-label="Mobile view">
              <Smartphone className="size-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          <Button variant="outline">
            <ExternalLink className="mr-2 size-4" />
            Open in New Tab
          </Button>
        </div>
      </div>

      {/* Preview Area */}
      <Card>
        <CardHeader>
          <CardTitle>Live Preview</CardTitle>
          <CardDescription>
            This is how your calculator will appear on your website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center rounded-lg border bg-muted/30 p-6">
            <div
              className={
                viewMode === "desktop"
                  ? "w-full max-w-md"
                  : viewMode === "tablet"
                    ? "w-80"
                    : "w-72"
              }
            >
              <QuotePreview config={defaultQuoteConfig} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Embed Code */}
      <Card>
        <CardHeader>
          <CardTitle>Embed Code</CardTitle>
          <CardDescription>
            Copy this code to embed the calculator on your website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-muted p-4 font-mono text-sm">
            <code className="text-muted-foreground">
              {'<script src="https://solarquote.app/embed.js" data-provider="sunpower-solutions"></script>'}
            </code>
          </div>
          <Button variant="outline" className="mt-4 bg-transparent">
            Copy to Clipboard
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
