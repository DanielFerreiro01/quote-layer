"use client";

import { Activity, TrendingUp, Users, DollarSign } from "lucide-react";
import { StatCard } from "../shared/StatCard";
import type { DashboardStats } from "@/features/dashboard/types";

interface StatsCardsProps {
  stats?: DashboardStats;
  isLoading?: boolean;
}

export function StatsCards({ stats, isLoading }: StatsCardsProps) {
  if (isLoading || !stats) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Quotes"
        value={stats.totalQuotes.value.toLocaleString()}
        change={stats.totalQuotes.change}
        trend={stats.totalQuotes.trend}
        icon={Activity}
        description="vs. last month"
      />
      <StatCard
        title="Active Leads"
        value={stats.activeLeads.value.toLocaleString()}
        change={stats.activeLeads.change}
        trend={stats.activeLeads.trend}
        icon={Users}
        description="vs. last month"
      />
      <StatCard
        title="Avg. Quote Value"
        value={`$${stats.avgQuoteValue.value.toLocaleString()}`}
        change={stats.avgQuoteValue.change}
        trend={stats.avgQuoteValue.trend}
        icon={DollarSign}
        description="vs. last month"
      />
      <StatCard
        title="Conversion Rate"
        value={`${stats.conversionRate.value}%`}
        change={stats.conversionRate.change}
        trend={stats.conversionRate.trend}
        icon={TrendingUp}
        description="vs. last month"
      />
    </div>
  );
}