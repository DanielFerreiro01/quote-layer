import Link from "next/link";
import { Sparkles, Calendar, CreditCard, Check, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PlanCardProps {
  plan: {
    name: string;
    price: number;
    nextBillingDate: string;
    features: string[];
  };
  addonsTotal: number;
}

export function PlanCard({ plan, addonsTotal }: PlanCardProps) {
  const totalMonthly = plan.price + addonsTotal;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/20">
              <Sparkles className="size-5 text-primary" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Plan {plan.name}
                <Badge className="text-[10px] px-1.5 py-0">Activo</Badge>
              </CardTitle>
              <CardDescription>
                ${plan.price}/mes + ${addonsTotal} add-ons = ${totalMonthly}/mes
              </CardDescription>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild className="bg-transparent">
            <Link href="/dashboard/upgrade">
              <ArrowUpRight className="mr-2 size-4" />
              Upgrade a Business
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-lg border border-border p-4">
            <Calendar className="size-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Proxima facturacion</p>
              <p className="text-sm text-muted-foreground">{plan.nextBillingDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border p-4">
            <CreditCard className="size-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Metodo de pago</p>
              <p className="text-sm text-muted-foreground">Visa terminada en 4242</p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium mb-3">Incluido en tu plan:</p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="size-4 text-primary shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}