"use client";

import { Monitor, Smartphone, Tablet } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type ViewMode = 'desktop' | 'tablet' | 'mobile';

interface DeviceToggleProps {
  value: ViewMode;
  onValueChange: (value: ViewMode) => void;
}

export function DeviceToggle({ value, onValueChange }: DeviceToggleProps) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(newValue) => newValue && onValueChange(newValue as ViewMode)}
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
  );
}