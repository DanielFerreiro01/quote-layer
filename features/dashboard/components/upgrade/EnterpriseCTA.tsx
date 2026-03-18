import { Button } from "@/components/ui/button";

export function EnterpriseCTA() {
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-6 text-center">
      <h3 className="text-lg font-semibold">Necesitas un plan personalizado?</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Contactanos para discutir opciones enterprise con precios y funcionalidades a medida.
      </p>
      <Button variant="outline" className="mt-4 bg-transparent">
        Contactar ventas
      </Button>
    </div>
  );
}