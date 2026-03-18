import { Shield, Clock, CreditCard } from "lucide-react";

export function TrustBadges() {
  const badges = [
    { icon: Shield, text: "Pago seguro SSL" },
    { icon: Clock, text: "14 dias de prueba gratis" },
    { icon: CreditCard, text: "Cancela cuando quieras" },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-8 py-4">
      {badges.map((badge) => {
        const Icon = badge.icon;
        return (
          <div key={badge.text} className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon className="size-4" />
            <span>{badge.text}</span>
          </div>
        );
      })}
    </div>
  );
}