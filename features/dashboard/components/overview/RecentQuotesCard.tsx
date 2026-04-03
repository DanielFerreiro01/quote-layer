"use client";

import Link from "next/link";
import { Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface RecentQuote {
  id: string;
  customer: string;
  systemSize: string;
  value: string;
  status: 'pending' | 'accepted' | 'rejected';
  date: string;
}

interface RecentQuotesCardProps {
  quotes: RecentQuote[];
  isLoading?: boolean;
}

export function RecentQuotesCard({ quotes, isLoading }: RecentQuotesCardProps) {
  if (isLoading) {
    return (
      <Card className="flex flex-col lg:col-span-2">
        <CardHeader className="flex-shrink-0 border-b border-border">
          <CardTitle>Recent Quotes</CardTitle>
          <CardDescription>Loading quotes...</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-6">
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col lg:col-span-2">
      <CardHeader className="flex-shrink-0 border-b border-border">
        <CardTitle>Recent Quotes</CardTitle>
        <CardDescription>
          Latest quote requests from your calculator
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-0 -mt-6">
        <div className="max-h-[340px] space-y-3 overflow-y-auto px-6 py-3">
          {quotes.map((quote) => (
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
      <div className="flex-shrink-0 border-t border-border px-6 pt-6 -mb-6">
        <Button variant="outline" className="w-full bg-transparent" asChild>
          <Link href="/dashboard/leads">View All Leads</Link>
        </Button>
      </div>
    </Card>
  );
}
