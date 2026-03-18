import { LucideIcon } from "lucide-react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down';
  icon: LucideIcon;
  description?: string;
}

export function StatCard({ 
  title, 
  value, 
  change, 
  trend, 
  icon: Icon, 
  description 
}: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && trend && (
          <div className="flex items-center text-xs text-muted-foreground">
            {trend === 'up' ? (
              <ArrowUpRight className="mr-1 size-3 text-green-500" />
            ) : (
              <ArrowDownRight className="mr-1 size-3 text-red-500" />
            )}
            <span className={trend === 'up' ? "text-green-500" : "text-red-500"}>
              {change > 0 ? '+' : ''}{change}%
            </span>
            {description && (
              <span className="ml-1">{description}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}