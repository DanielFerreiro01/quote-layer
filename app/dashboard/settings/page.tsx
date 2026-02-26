"use client"

import { useState } from "react"
import {
  Shield,
  Key,
  Smartphone,
  Monitor,
  LogOut,
  AlertTriangle,
  Trash2,
  Download,
  Bell,
  Mail,
  Globe,
  Save,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const activeSessions = [
  {
    id: "1",
    device: "MacBook Pro",
    browser: "Chrome 120",
    location: "New York, US",
    current: true,
    lastActive: "Now",
  },
  {
    id: "2",
    device: "iPhone 15",
    browser: "Safari",
    location: "New York, US",
    current: false,
    lastActive: "2 hours ago",
  },
  {
    id: "3",
    device: "Windows PC",
    browser: "Firefox 121",
    location: "Boston, US",
    current: false,
    lastActive: "3 days ago",
  },
]

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [notifications, setNotifications] = useState({
    emailNewLeads: true,
    emailQuoteStatus: true,
    emailWeeklyReport: false,
    pushNewLeads: true,
    pushQuoteStatus: false,
    webNewLeads: true,
    webQuoteStatus: true,
    webSystemAlerts: true,
  })

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 pb-8 space-y-8 max-w-4xl">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account security and preferences
          </p>
        </div>

        {/* Security Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Shield className="size-5 text-primary" />
            <h2 className="text-lg font-semibold">Security</h2>
          </div>

          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Key className="size-4" />
                Change Password
              </CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Enter current password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="size-4 text-muted-foreground" />
                      ) : (
                        <Eye className="size-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="size-4 text-muted-foreground" />
                      ) : (
                        <Eye className="size-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              <Button variant="outline">Update Password</Button>
            </CardContent>
          </Card>

          {/* Two-Factor Authentication */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Smartphone className="size-4" />
                Two-Factor Authentication
              </CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="font-medium">Enable 2FA</p>
                  <p className="text-sm text-muted-foreground">
                    Require a verification code when signing in
                  </p>
                </div>
                <Switch
                  checked={twoFactorEnabled}
                  onCheckedChange={setTwoFactorEnabled}
                />
              </div>
              {twoFactorEnabled && (
                <div className="mt-4 p-4 rounded-lg bg-muted/50 border border-dashed">
                  <p className="text-sm text-muted-foreground">
                    Scan the QR code with your authenticator app or enter the setup key manually.
                  </p>
                  <Button variant="outline" size="sm" className="mt-3 bg-transparent">
                    Configure 2FA
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Monitor className="size-4" />
                Active Sessions
              </CardTitle>
              <CardDescription>
                Devices currently logged into your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                      {session.device.includes("iPhone") ? (
                        <Smartphone className="size-4 text-muted-foreground" />
                      ) : (
                        <Monitor className="size-4 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{session.device}</p>
                        {session.current && (
                          <Badge variant="default" className="text-[10px] px-1.5 py-0">
                            Current
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {session.browser} • {session.location}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{session.lastActive}</p>
                    {!session.current && (
                      <Button variant="ghost" size="sm" className="mt-1 h-7 text-destructive hover:text-destructive">
                        Revoke
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full bg-transparent">
                <LogOut className="mr-2 size-4" />
                Sign Out All Other Devices
              </Button>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Notifications Section */}
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

        <Separator />

        {/* Danger Zone */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-destructive" />
            <h2 className="text-lg font-semibold text-destructive">Danger Zone</h2>
          </div>

          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-base">Data & Account</CardTitle>
              <CardDescription>
                Export your data or permanently delete your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <p className="font-medium">Export Your Data</p>
                  <p className="text-sm text-muted-foreground">
                    Download all your data in a portable format (GDPR compliant)
                  </p>
                </div>
                <Button variant="outline" size="sm" className="shrink-0 bg-transparent">
                  <Download className="mr-2 size-4" />
                  Export Data
                </Button>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-destructive/50 bg-destructive/5 p-4">
                <div className="space-y-0.5">
                  <p className="font-medium text-destructive">Delete Account</p>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                </div>
                <Button variant="destructive" size="sm" className="shrink-0">
                  <Trash2 className="mr-2 size-4" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Save className="mr-2 size-4" />
            )}
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}
