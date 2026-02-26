"use client"

import { useState } from "react"
import { Camera, Mail, Phone, Building2, MapPin, Globe, Save, Loader2 } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

export default function ProfilePage() {
  const [isSaving, setIsSaving] = useState(false)
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john@sunpower.com",
    phone: "+1 (555) 123-4567",
    role: "Administrator",
    companyName: "SunPower Solutions",
    companyWebsite: "https://sunpowersolutions.com",
    companyAddress: "123 Solar Street, Suite 400",
    companyCity: "San Francisco",
    companyState: "CA",
    companyZip: "94102",
    companyCountry: "United States",
    bio: "Solar energy specialist with over 10 years of experience in residential and commercial installations.",
  })

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  const updateProfile = (field: string, value: string) => {
    setProfile({ ...profile, [field]: value })
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal and company information
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Photo Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-base">Profile Photo</CardTitle>
              <CardDescription>
                Your photo will be visible to clients
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <div className="relative">
                <Avatar className="size-32">
                  <AvatarImage src="/avatars/user.jpg" alt="Profile" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {profile.firstName[0]}{profile.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-0 right-0 size-8 rounded-full"
                >
                  <Camera className="size-4" />
                </Button>
              </div>
              <div className="text-center">
                <p className="font-medium">{profile.firstName} {profile.lastName}</p>
                <p className="text-sm text-muted-foreground">{profile.role}</p>
              </div>
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                Change Photo
              </Button>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Personal Information</CardTitle>
              <CardDescription>
                Update your personal details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profile.firstName}
                    onChange={(e) => updateProfile("firstName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profile.lastName}
                    onChange={(e) => updateProfile("lastName", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => updateProfile("email", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => updateProfile("phone", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => updateProfile("bio", e.target.value)}
                  rows={3}
                  placeholder="Tell us about yourself..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Company Information */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-base">Company Information</CardTitle>
              <CardDescription>
                This information appears on your quotes and client communications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="companyName"
                      value={profile.companyName}
                      onChange={(e) => updateProfile("companyName", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyWebsite">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="companyWebsite"
                      value={profile.companyWebsite}
                      onChange={(e) => updateProfile("companyWebsite", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="companyAddress">Street Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="companyAddress"
                    value={profile.companyAddress}
                    onChange={(e) => updateProfile("companyAddress", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="companyCity">City</Label>
                  <Input
                    id="companyCity"
                    value={profile.companyCity}
                    onChange={(e) => updateProfile("companyCity", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyState">State / Province</Label>
                  <Input
                    id="companyState"
                    value={profile.companyState}
                    onChange={(e) => updateProfile("companyState", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyZip">ZIP / Postal Code</Label>
                  <Input
                    id="companyZip"
                    value={profile.companyZip}
                    onChange={(e) => updateProfile("companyZip", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyCountry">Country</Label>
                  <Input
                    id="companyCountry"
                    value={profile.companyCountry}
                    onChange={(e) => updateProfile("companyCountry", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="flex items-center justify-end gap-3 border-t border-border bg-background px-6 py-4">
        <Button variant="outline">Cancel</Button>
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
  )
}
