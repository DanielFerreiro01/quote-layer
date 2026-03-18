"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QuotePreview } from "@/components/quote-preview";
import { defaultQuoteConfig } from "@/lib/types";
import type { ViewMode } from "./DeviceToggle";

interface PreviewContainerProps {
  viewMode: ViewMode;
}

export function PreviewContainer({ viewMode }: PreviewContainerProps) {
  const getWidthClass = () => {
    switch (viewMode) {
      case "desktop":
        return "w-full max-w-md";
      case "tablet":
        return "w-full max-w-sm";
      case "mobile":
        return "w-full max-w-[320px]";
      default:
        return "w-full max-w-md";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Preview</CardTitle>
        <CardDescription>
          This is how your calculator will appear on your website
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center rounded-lg border bg-muted/30 p-6">
          <div className={getWidthClass()}>
            <QuotePreview config={defaultQuoteConfig} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}