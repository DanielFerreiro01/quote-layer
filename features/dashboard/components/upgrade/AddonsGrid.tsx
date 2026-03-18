import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Addon {
  name: string;
  price: number;
  suffix?: string;
  description: string;
}

interface AddonsGridProps {
  addons: Addon[];
}

export function AddonsGrid({ addons }: AddonsGridProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Add-ons opcionales</CardTitle>
        <CardDescription>
          Potencia tu plan con funcionalidades adicionales
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {addons.map((addon) => (
            <div
              key={addon.name}
              className="flex items-start justify-between rounded-lg border border-border p-4 hover:border-muted-foreground/50 transition-colors cursor-pointer"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium">{addon.name}</p>
                <p className="text-xs text-muted-foreground">{addon.description}</p>
              </div>
              <Badge variant="secondary" className="ml-3 shrink-0 text-[10px] px-1.5 py-0">
                ${addon.price}{addon.suffix ? ` ${addon.suffix}` : " / mes"}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}