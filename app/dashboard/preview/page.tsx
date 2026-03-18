"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeviceToggle, PreviewContainer, type ViewMode } from "@/features/dashboard/components/preview";

export default function PreviewPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("desktop");

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
          <DeviceToggle value={viewMode} onValueChange={setViewMode} />
          <Button variant="outline">
            <ExternalLink className="mr-2 size-4" />
            Open in New Tab
          </Button>
        </div>
      </div>

      {/* Preview Area */}
      <PreviewContainer viewMode={viewMode} />
    </div>
  );
}