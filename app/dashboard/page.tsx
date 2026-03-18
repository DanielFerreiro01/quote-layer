import Link from "next/link";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatsCards, RecentQuotesCard, QuickActionsCard } from "@/features/dashboard/components/overview";

// TODO: Reemplazar con datos reales usando server actions
const mockStats = {
  totalQuotes: {
    value: 1284,
    change: 12.5,
    trend: 'up' as const,
  },
  activeLeads: {
    value: 342,
    change: 8.2,
    trend: 'up' as const,
  },
  avgQuoteValue: {
    value: 18450,
    change: 4.1,
    trend: 'up' as const,
  },
  conversionRate: {
    value: 24.3,
    change: -2.1,
    trend: 'down' as const,
  },
};

const mockRecentQuotes = [
  {
    id: "Q-1234",
    customer: "John Smith",
    systemSize: "8.5 kW",
    value: "$21,250",
    status: "pending" as const,
    date: "2 hours ago",
  },
  {
    id: "Q-1233",
    customer: "Sarah Johnson",
    systemSize: "12.0 kW",
    value: "$30,000",
    status: "accepted" as const,
    date: "5 hours ago",
  },
  {
    id: "Q-1232",
    customer: "Mike Davis",
    systemSize: "6.0 kW",
    value: "$15,000",
    status: "pending" as const,
    date: "1 day ago",
  },
  {
    id: "Q-1231",
    customer: "Emily Brown",
    systemSize: "10.5 kW",
    value: "$26,250",
    status: "rejected" as const,
    date: "2 days ago",
  },
];

export default function DashboardPage() {
  return (
    <div className="h-full overflow-y-auto p-6 pb-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your solar quote performance
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/quote-config">
            <Zap className="mr-2 size-4" />
            Configure Calculator
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <StatsCards stats={mockStats} />

      {/* Recent Quotes & Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <RecentQuotesCard quotes={mockRecentQuotes} />
        <QuickActionsCard />
      </div>
    </div>
  );
}