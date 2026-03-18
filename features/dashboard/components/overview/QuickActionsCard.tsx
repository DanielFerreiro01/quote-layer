import Link from "next/link";
import { Zap, Activity, HelpCircle, MessageCircle, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function QuickActionsCard() {
  return (
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
              <FileText className="mr-2 size-4" />
              View All Leads
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Help & Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Help & Resources</CardTitle>
          <CardDescription>Get support and learn more</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <HelpCircle className="mr-2 size-4" />
            Documentation
          </Button>
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <MessageCircle className="mr-2 size-4" />
            Contact Support
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}