"use client";

import { useState } from "react";
import { Bell, Mail, Smartphone, Globe } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    emailNewLeads: true,
    emailQuoteStatus: true,
    emailWeeklyReport: false,
    pushNewLeads: true,
    pushQuoteStatus: false,
    webNewLeads: true,
    webQuoteStatus: true,
    webSystemAlerts: true,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Bell className="size-5 text-primary" />
        <h2 className="text-lg font-semibold">Notifications</h2>
      </div>

      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Mail className="size-4" />
            Email Notifications
          </CardTitle>
          <CardDescription>
            Manage email alerts for your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="font-medium">New Leads</p>
              <p className="text-sm text-muted-foreground">
                Receive an email when a new lead submits a quote
              </p>
            </div>
            <Switch
              checked={notifications.emailNewLeads}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, emailNewLeads: checked })
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="font-medium">Quote Status Changes</p>
              <p className="text-sm text-muted-foreground">
                Get notified when a quote status is updated
              </p>
            </div>
            <Switch
              checked={notifications.emailQuoteStatus}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, emailQuoteStatus: checked })
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="font-medium">Weekly Reports</p>
              <p className="text-sm text-muted-foreground">
                Receive a weekly summary of your performance
              </p>
            </div>
            <Switch
              checked={notifications.emailWeeklyReport}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, emailWeeklyReport: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Smartphone className="size-4" />
            Push Notifications
          </CardTitle>
          <CardDescription>
            Mobile push notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="font-medium">New Leads</p>
              <p className="text-sm text-muted-foreground">
                Instant push notification for new leads
              </p>
            </div>
            <Switch
              checked={notifications.pushNewLeads}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, pushNewLeads: checked })
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="font-medium">Quote Updates</p>
              <p className="text-sm text-muted-foreground">
                Push notifications for quote status changes
              </p>
            </div>
            <Switch
              checked={notifications.pushQuoteStatus}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, pushQuoteStatus: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Web Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Globe className="size-4" />
            Web Notifications
          </CardTitle>
          <CardDescription>
            Browser notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="font-medium">New Leads</p>
              <p className="text-sm text-muted-foreground">
                Show browser notification for new leads
              </p>
            </div>
            <Switch
              checked={notifications.webNewLeads}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, webNewLeads: checked })
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="font-medium">Quote Status</p>
              <p className="text-sm text-muted-foreground">
                Browser alerts for quote updates
              </p>
            </div>
            <Switch
              checked={notifications.webQuoteStatus}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, webQuoteStatus: checked })
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="font-medium">System Alerts</p>
              <p className="text-sm text-muted-foreground">
                Important system and maintenance notifications
              </p>
            </div>
            <Switch
              checked={notifications.webSystemAlerts}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, webSystemAlerts: checked })
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}