"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface BillingToggleProps {
  isYearly: boolean;
  onToggle: (isYearly: boolean) => void;
}

export function BillingToggle({ isYearly, onToggle }: BillingToggleProps) {
  return (
    <div className="flex items-center justify-center gap-3">
      <Label htmlFor="billing" className={!isYearly ? "font-medium" : "text-muted-foreground"}>
        Mensual
      </Label>
      <Switch
        id="billing"
        checked={isYearly}
        onCheckedChange={onToggle}
      />
      <Label htmlFor="billing" className={isYearly ? "font-medium" : "text-muted-foreground"}>
        Anual
      </Label>
      {isYearly && (
        <Badge variant="secondary" className="ml-2 text-[10px] px-1.5 py-0">
          Ahorra 2 meses
        </Badge>
      )}
    </div>
  );
}