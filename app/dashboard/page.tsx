import {
  Activity,
  TrendingUp,
  Users,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  HelpCircle,
  MessageCircle,
  FileText,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const stats = [
  {
    title: "Total Quotes",
    value: "1,284",
    change: "+12.5%",
    trend: "up",
    icon: Activity,
    description: "vs. last month",
  },
  {
    title: "Active Leads",
    value: "342",
    change: "+8.2%",
    trend: "up",
    icon: Users,
    description: "vs. last month",
  },
  {
    title: "Avg. Quote Value",
    value: "$18,450",
    change: "+4.1%",
    trend: "up",
    icon: DollarSign,
    description: "vs. last month",
  },
  {
    title: "Conversion Rate",
    value: "24.3%",
    change: "-2.1%",
    trend: "down",
    icon: TrendingUp,
    description: "vs. last month",
  },
]

const recentQuotes = [
  {
    id: "Q-1234",
    customer: "John Smith",
    systemSize: "8.5 kW",
    value: "$21,250",
    status: "pending",
    date: "2 hours ago",
  },
  {
    id: "Q-1233",
    customer: "Sarah Johnson",
    systemSize: "12.0 kW",
    value: "$30,000",
    status: "accepted",
    date: "5 hours ago",
  },
  {
    id: "Q-1232",
    customer: "Mike Davis",
    systemSize: "6.0 kW",
    value: "$15,000",
    status: "pending",
    date: "1 day ago",
  },
  {
    id: "Q-1231",
    customer: "Emily Brown",
    systemSize: "10.5 kW",
    value: "$26,250",
    status: "rejected",
    date: "2 days ago",
  },
]

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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="mr-1 size-3 text-green-500" />
                ) : (
                  <ArrowDownRight className="mr-1 size-3 text-red-500" />
                )}
                <span
                  className={
                    stat.trend === "up" ? "text-green-500" : "text-red-500"
                  }
                >
                  {stat.change}
                </span>
                <span className="ml-1">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Quotes & Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Quotes */}
        <Card className="flex flex-col lg:col-span-2">
          <CardHeader className="flex-shrink-0 border-b border-border">
            <CardTitle>Recent Quotes</CardTitle>
            <CardDescription>
              Latest quote requests from your calculator
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-0">
            <div className="max-h-[340px] space-y-3 overflow-y-auto p-6">
              {recentQuotes.map((quote) => (
                <div
                  key={quote.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                      <Zap className="size-4 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{quote.customer}</p>
                        <Badge
                          variant={
                            quote.status === "accepted"
                              ? "default"
                              : quote.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                          className="text-[10px] px-1.5 py-0"
                        >
                          {quote.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {quote.id} • {quote.systemSize}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{quote.value}</p>
                    <p className="text-xs text-muted-foreground">{quote.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <div className="flex-shrink-0 border-t border-border p-4">
            <Button variant="outline" className="w-full bg-transparent" asChild>
              <Link href="/dashboard/leads">View All Leads</Link>
            </Button>
          </div>
        </Card>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                <Link href="/dashboard/quote-config">
                  <Zap className="mr-2 size-4" />
                  Edit Pricing Variables
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                <Link href="/dashboard/preview">
                  <Activity className="mr-2 size-4" />
                  Preview Calculator
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                <Link href="/dashboard/leads">
                  <Users className="mr-2 size-4" />
                  Manage Leads
                </Link>
              </Button>
              <div className="rounded-lg border border-dashed p-4">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-full bg-green-500/10">
                    <div className="size-2 rounded-full bg-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Calculator Active</p>
                    <p className="text-xs text-muted-foreground">
                      Accepting new quotes
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="size-5" />
                Need Help?
              </CardTitle>
              <CardDescription>Get support and learn more</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                <Link href="#">
                  <MessageCircle className="mr-2 size-4" />
                  Contact Support
                  <ExternalLink className="ml-auto size-3 text-muted-foreground" />
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                <Link href="#">
                  <FileText className="mr-2 size-4" />
                  Documentation
                  <ExternalLink className="ml-auto size-3 text-muted-foreground" />
                </Link>
              </Button>
              <p className="text-xs text-muted-foreground pt-2">
                Available Monday to Friday, 9am - 6pm EST
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
