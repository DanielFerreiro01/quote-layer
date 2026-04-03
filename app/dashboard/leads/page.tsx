"use client";

import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  LeadFilters,
  LeadsTable,
  BulkActionsBar,
} from "@/features/dashboard/components/leads";
import { LeadDetailsSheet } from "@/features/dashboard/components/leads/LeadDetailsSheet";
import { useLeadsPage } from "@/features/dashboard/hooks/useLeadsPage";

const TENANT = "solar-demo"; // TODO: replace with auth session

export default function LeadsPage() {
  const {
    leads,
    total,
    isLoading,
    detailsSheetOpen,
    selectedLeadForDetails,
    closeDetailsSheet,
    isSaving,
    selectedLeads,
    clearSelection,
    isBulkDeleting,
    updatingLeadId,
    isExporting,
    handleViewDetails,
    handleUpdateStatus,
    handleSaveDetails,
    handleDelete,
    handleBulkDelete,
    handleExportCsv,
  } = useLeadsPage(TENANT);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Leads</h1>
          <p className="text-muted-foreground">
            {isLoading ? "Cargando..." : `${total} leads en total`}
          </p>
        </div>
        <Button
          variant="outline"
          disabled={isLoading || leads.length === 0 || isExporting}
          onClick={handleExportCsv}
        >
          {isExporting ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <Download className="mr-2 size-4" />
          )}
          Exportar CSV
        </Button>
      </div>

      <LeadFilters />

      <LeadsTable
        leads={leads}
        isLoading={isLoading}
        onViewDetails={handleViewDetails}
        onUpdateStatus={handleUpdateStatus}
        onDelete={handleDelete}
        updatingLeadId={updatingLeadId}
      />

      <LeadDetailsSheet
        leadId={selectedLeadForDetails}
        tenant={TENANT}
        open={detailsSheetOpen}
        onOpenChange={closeDetailsSheet}
        onSave={handleSaveDetails}
        isSaving={isSaving}
      />

      <BulkActionsBar
        selectedCount={selectedLeads.size}
        onClearSelection={clearSelection}
        onBulkDelete={handleBulkDelete}
        isDeleting={isBulkDeleting}
      />
    </div>
  );
}