"use client"

import { useState } from "react"
import { Search, Filter, Download, MoreHorizontal, Mail, Phone, FileText, Paperclip, X, Check } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"

type LeadStatus = "new" | "contacted" | "qualified" | "converted" | "lost"

interface Lead {
  id: string
  name: string
  email: string
  phone: string
  systemSize: string
  quoteValue: string
  clientType: string
  mountingType: string
  status: LeadStatus
  createdAt: string
  notes?: string
  attachments?: { name: string; size: string; type: string }[]
}

const initialLeads: Lead[] = [
  {
    id: "L-1234",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    systemSize: "8.5 kW",
    quoteValue: "$21,250",
    clientType: "Residential",
    mountingType: "Roof (Sheet)",
    status: "new",
    createdAt: "2024-01-15",
    notes: "Interested in financing options. Prefers installation in March.",
    attachments: [
      { name: "roof-photo.jpg", size: "2.4 MB", type: "image" },
      { name: "electricity-bill.pdf", size: "156 KB", type: "document" },
    ],
  },
  {
    id: "L-1233",
    name: "Sarah Johnson",
    email: "sarah.j@company.com",
    phone: "+1 (555) 234-5678",
    systemSize: "12.0 kW",
    quoteValue: "$30,000",
    clientType: "Industrial",
    mountingType: "Ground",
    status: "contacted",
    createdAt: "2024-01-14",
    notes: "Large warehouse facility. Needs site assessment.",
    attachments: [
      { name: "site-plans.pdf", size: "4.1 MB", type: "document" },
    ],
  },
  {
    id: "L-1232",
    name: "Mike Davis",
    email: "mike.davis@email.com",
    phone: "+1 (555) 345-6789",
    systemSize: "6.0 kW",
    quoteValue: "$15,000",
    clientType: "Residential",
    mountingType: "Roof (Tile)",
    status: "qualified",
    createdAt: "2024-01-13",
    attachments: [],
  },
  {
    id: "L-1231",
    name: "Emily Brown",
    email: "emily.b@farm.com",
    phone: "+1 (555) 456-7890",
    systemSize: "10.5 kW",
    quoteValue: "$26,250",
    clientType: "Agricultural",
    mountingType: "Ground",
    status: "converted",
    createdAt: "2024-01-12",
    notes: "Contract signed. Installation scheduled for Feb 20.",
    attachments: [
      { name: "signed-contract.pdf", size: "890 KB", type: "document" },
    ],
  },
  {
    id: "L-1230",
    name: "Robert Wilson",
    email: "robert.w@email.com",
    phone: "+1 (555) 567-8901",
    systemSize: "7.2 kW",
    quoteValue: "$18,000",
    clientType: "Residential",
    mountingType: "Carport",
    status: "lost",
    createdAt: "2024-01-11",
    notes: "Went with competitor. Price was the main factor.",
    attachments: [],
  },
]

const statusOptions: { value: LeadStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "converted", label: "Converted" },
  { value: "lost", label: "Lost" },
]

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  new: "default",
  contacted: "secondary",
  qualified: "default",
  converted: "default",
  lost: "destructive",
}

export default function LeadsPage() {
  const [leads, setLeads] = useState(initialLeads)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editedLead, setEditedLead] = useState<Lead | null>(null)

  const handleViewDetails = (lead: Lead) => {
    setSelectedLead(lead)
    setEditedLead({ ...lead })
    setIsSheetOpen(true)
  }

  const handleUpdateStatus = (leadId: string, newStatus: LeadStatus) => {
    setLeads(leads.map(lead => 
      lead.id === leadId ? { ...lead, status: newStatus } : lead
    ))
  }

  const handleSaveChanges = () => {
    if (editedLead) {
      setLeads(leads.map(lead => 
        lead.id === editedLead.id ? editedLead : lead
      ))
      setSelectedLead(editedLead)
    }
    setIsSheetOpen(false)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Leads</h1>
          <p className="text-muted-foreground">
            Manage and track your quote requests
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 size-4" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search leads..." className="pl-9" />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 size-4" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Leads</CardTitle>
          <CardDescription>
            {leads.length} total leads from your quote calculator
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>System</TableHead>
                <TableHead>Quote Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-[50px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarFallback className="text-xs">
                          {lead.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{lead.name}</p>
                        <p className="text-xs text-muted-foreground">{lead.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="size-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{lead.email}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="size-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{lead.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{lead.systemSize}</p>
                      <p className="text-xs text-muted-foreground">
                        {lead.clientType} • {lead.mountingType}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">{lead.quoteValue}</TableCell>
                  <TableCell>
                    <Badge variant={statusColors[lead.status]} className="capitalize text-[10px] px-1.5 py-0">
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {lead.createdAt}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontal className="size-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={() => handleViewDetails(lead)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>Send Email</DropdownMenuItem>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>Update Status</DropdownMenuSubTrigger>
                          <DropdownMenuSubContent>
                            <DropdownMenuRadioGroup 
                              value={lead.status} 
                              onValueChange={(value) => handleUpdateStatus(lead.id, value as LeadStatus)}
                            >
                              {statusOptions.map((option) => (
                                <DropdownMenuRadioItem key={option.value} value={option.value}>
                                  {option.label}
                                </DropdownMenuRadioItem>
                              ))}
                            </DropdownMenuRadioGroup>
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Delete Lead
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Lead Details Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-lg">
          <SheetHeader className="border-b border-border px-6 py-5">
            <SheetTitle>Lead Details</SheetTitle>
            <SheetDescription>
              View and edit lead information
            </SheetDescription>
          </SheetHeader>
          
          {editedLead && (
            <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Contact Information
                </h3>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={editedLead.name}
                      onChange={(e) => setEditedLead({ ...editedLead, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editedLead.email}
                      onChange={(e) => setEditedLead({ ...editedLead, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={editedLead.phone}
                      onChange={(e) => setEditedLead({ ...editedLead, phone: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Quote Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Quote Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">System Size</p>
                    <p className="font-medium">{editedLead.systemSize}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Quote Value</p>
                    <p className="font-medium text-primary">{editedLead.quoteValue}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Client Type</p>
                    <p className="font-medium">{editedLead.clientType}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Mounting Type</p>
                    <p className="font-medium">{editedLead.mountingType}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant={statusColors[editedLead.status]} className="capitalize text-[10px] px-1.5 py-0">
                      {editedLead.status}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="font-medium">{editedLead.createdAt}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Notes */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Notes
                </h3>
                <Textarea
                  placeholder="Add notes about this lead..."
                  value={editedLead.notes || ""}
                  onChange={(e) => setEditedLead({ ...editedLead, notes: e.target.value })}
                  rows={4}
                />
              </div>

              <Separator />

              {/* Attachments */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Attachments
                </h3>
                {editedLead.attachments && editedLead.attachments.length > 0 ? (
                  <div className="space-y-2">
                    {editedLead.attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg border border-border p-3"
                      >
                        <div className="flex items-center gap-3">
                          {file.type === "image" ? (
                            <div className="flex size-10 items-center justify-center rounded-md bg-primary/10">
                              <Paperclip className="size-4 text-primary" />
                            </div>
                          ) : (
                            <div className="flex size-10 items-center justify-center rounded-md bg-muted">
                              <FileText className="size-4 text-muted-foreground" />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{file.size}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="size-8">
                          <Download className="size-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No attachments</p>
                )}
              </div>
            </div>
          )}

          <SheetFooter className="border-t border-border px-6 py-4">
            <Button variant="outline" onClick={() => setIsSheetOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveChanges}>
              <Check className="mr-2 size-4" />
              Save Changes
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
