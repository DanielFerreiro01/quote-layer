"use client";

import { Check, LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PlanCardProps {
  plan: {
    name: string;
    description: string;
    monthlyPrice: number;
    yearlyPrice: number;
    icon: LucideIcon;
    popular?: boolean;
    features: string[];
  };
  isYearly: boolean;
  isSelected: boolean;
  onSelect: () => void;
}

export function PlanCard({ plan, isYearly, isSelected, onSelect }: PlanCardProps) {
  const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
  const Icon = plan.icon;

  return (
    <Card
      className={`relative cursor-pointer transition-all ${
        plan.popular
          ? "border-primary shadow-lg shadow-primary/10"
          : isSelected
            ? "border-primary/50"
            : "border-border hover:border-muted-foreground/50"
      }`}
      onClick={onSelect}
    >
      {plan.popular && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-[10px]">
          Mas elegido
        </Badge>
      )}
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className={`flex size-10 items-center justify-center rounded-lg ${
            plan.popular ? "bg-primary/20" : "bg-muted"
          }`}>
            <Icon className={`size-5 ${plan.popular ? "text-primary" : "text-muted-foreground"}`} />
          </div>
          <div>
            <CardTitle className="text-lg">{plan.name}</CardTitle>
          </div>
        </div>
        <CardDescription className="mt-2 leading-relaxed">
          {plan.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <span className="text-4xl font-bold">${price}</span>
          <span className="text-muted-foreground"> / {isYearly ? "ano" : "mes"}</span>
          {isYearly && (
            <p className="mt-1 text-xs text-muted-foreground">
              ${Math.round(price / 12)} / mes facturado anualmente
            </p>
          )}
        </div>
        <Button
          className="w-full"
          variant={plan.popular ? "default" : "outline"}
        >
          {plan.popular ? "Comenzar prueba gratis" : "Seleccionar"}
        </Button>
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2.5 text-sm">
              <Check className="size-4 shrink-0 text-primary mt-0.5" />
              <span className="text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}