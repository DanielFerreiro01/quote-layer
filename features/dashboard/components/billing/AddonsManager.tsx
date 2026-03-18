"use client";

import { Check, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

interface Addon {
  id: string;
  name: string;
  price: number;
  description: string;
  active: boolean;
}

interface AddonsManagerProps {
  addons: Addon[];
  onToggleAddon: (addonId: string) => void;
}

export function AddonsManager({ addons, onToggleAddon }: AddonsManagerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Add-ons</CardTitle>
        <CardDescription>
          Potencia tu plan con funcionalidades adicionales
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {addons.map((addon) => (
            <div
              key={addon.id}
              className={`flex items-center justify-between rounded-lg border p-4 transition-colors ${
                addon.active ? "border-primary/50 bg-primary/5" : "border-border"
              }`}
            >
              <div className="flex items-center gap-4">
                <Switch
                  checked={addon.active}
                  onCheckedChange={() => onToggleAddon(addon.id)}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{addon.name}</p>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      +${addon.price}/mes
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{addon.description}</p>
                </div>
              </div>
              {addon.active && (
                <Check className="size-5 text-primary" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}