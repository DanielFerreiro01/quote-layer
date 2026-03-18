"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  LeadFilters, 
  LeadsTable, 
  LeadDetailsSheet, 
  BulkActionsBar 
} from "@/features/dashboard/components/leads";
import { useLeadsStore } from "@/features/dashboard/stores/useLeadsStore";
import type { Lead, LeadStatus } from "@/features/dashboard/types";

// TODO: Reemplazar con useLeads hook y datos reales
const mockLeads: Lead[] = [
  {
    id: "lead-1",
    quoteId: "quote-1",
    customerName: "John Smith",
    customerEmail: "john@example.com",
    customerPhone: "+1 234 567 8900",
    systemSize: 8.5,
    quoteValue: 21250,
    status: "NEW",
    notes: null,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    updatedAt: new Date(),
  },
  {
    id: "lead-2",
    quoteId: "quote-2",
    customerName: "Sarah Johnson",
    customerEmail: "sarah@example.com",
    customerPhone: "+1 234 567 8901",
    systemSize: 12.0,
    quoteValue: 30000,
    status: "CONTACTED",
    notes: "Interested in financing options",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    updatedAt: new Date(),
  },
  {
    id: "lead-3",
    quoteId: "quote-3",
    customerName: "Mike Davis",
    customerEmail: "mike@example.com",
    customerPhone: null,
    systemSize: 6.0,
    quoteValue: 15000,
    status: "QUALIFIED",
    notes: null,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    updatedAt: new Date(),
  },
  {
    id: "lead-4",
    quoteId: "quote-4",
    customerName: "Emily Brown",
    customerEmail: "emily@example.com",
    customerPhone: "+1 234 567 8903",
    systemSize: 10.5,
    quoteValue: 26250,
    status: "CONVERTED",
    notes: "Installation scheduled for next month",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    updatedAt: new Date(),
  },
];

export default function LeadsPage() {
  // TODO: Reemplazar con datos reales
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [isLoading, setIsLoading] = useState(false);
  
  // Zustand stores
  const {
    selectedLeads,
    clearSelection,
    detailsSheetOpen,
    selectedLeadForDetails,
    openDetailsSheet,
    closeDetailsSheet,
  } = useLeadsStore();

  // Selected lead data
  const selectedLead = leads.find(l => l.id === selectedLeadForDetails);

  // Handlers
  const handleViewDetails = (lead: Lead) => {
    openDetailsSheet(lead.id);
  };

  const handleUpdateStatus = (leadId: string, status: LeadStatus) => {
    // TODO: Usar mutation de React Query
    setLeads(leads.map(lead => 
      lead.id === leadId ? { ...lead, status } : lead
    ));
  };

  const handleSaveDetails = (leadId: string, data: { status?: LeadStatus; notes?: string }) => {
    // TODO: Usar mutation de React Query
    setLeads(leads.map(lead => 
      lead.id === leadId ? { ...lead, ...data } : lead
    ));
    closeDetailsSheet();
  };

  const handleDelete = (leadId: string) => {
    // TODO: Usar mutation de React Query
    setLeads(leads.filter(lead => lead.id !== leadId));
  };

  const handleBulkDelete = () => {
    // TODO: Usar bulk delete mutation
    const selectedIds = Array.from(selectedLeads);
    setLeads(leads.filter(lead => !selectedIds.includes(lead.id)));
    clearSelection();
  };

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
      <LeadFilters />

      {/* Leads Table */}
      <LeadsTable
        leads={leads}
        isLoading={isLoading}
        onViewDetails={handleViewDetails}
        onUpdateStatus={handleUpdateStatus}
        onDelete={handleDelete}
      />

      {/* Lead Details Sheet */}
      <LeadDetailsSheet
        lead={selectedLead || null}
        open={detailsSheetOpen}
        onOpenChange={closeDetailsSheet}
        onSave={handleSaveDetails}
      />

      {/* Bulk Actions Bar */}
      <BulkActionsBar
        selectedCount={selectedLeads.size}
        onClearSelection={clearSelection}
        onBulkDelete={handleBulkDelete}
      />
    </div>
  );
}