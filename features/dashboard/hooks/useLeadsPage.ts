import { useState } from "react";
import { toast } from "sonner";
import { useLeadsStore } from "@/features/dashboard/store/useLeadsStore";
import { useFiltersStore } from "@/features/dashboard/store/useFiltersStore";
import {
  useLeads,
  useUpdateLead,
  useDeleteLead,
  useBulkDeleteLeads,
} from "@/features/dashboard/hooks/useLeads";
import { exportLeadsCsv } from "@/app/actions/leads/export-leads-csv";
import type { Lead, LeadStatus } from "@/features/dashboard/types";

export function useLeadsPage(tenant: string) {
  // ── Store state ───────────────────────────────────────────────────────────────
  const {
    selectedLeads,
    clearSelection,
    detailsSheetOpen,
    selectedLeadForDetails,
    openDetailsSheet,
    closeDetailsSheet,
  } = useLeadsStore();

  const { searchQuery, statusFilter, sortBy, sortOrder } = useFiltersStore();

  // Tracks which row is pending a status update (for the spinner in LeadRow)
  const [updatingLeadId, setUpdatingLeadId] = useState<string | null>(null);
  const [isExporting,    setIsExporting]    = useState(false);

  // ── Data ──────────────────────────────────────────────────────────────────────
  const { data, isLoading } = useLeads({
    tenant,
    filters: {
      search:    searchQuery || undefined,
      status:    statusFilter,
      sortBy,
      sortOrder,
    },
    pagination: { page: 1, pageSize: 50 },
  });

  const leads = data?.leads ?? [];
  const total = data?.total ?? 0;

  // ── Mutations ─────────────────────────────────────────────────────────────────
  const { mutate: updateLead, isPending: isSaving } = useUpdateLead(tenant);
  const { mutate: deleteLead }                      = useDeleteLead(tenant);
  const { mutate: bulkDelete, isPending: isBulkDeleting } =
    useBulkDeleteLeads(tenant);

  // ── Handlers ──────────────────────────────────────────────────────────────────
  const handleViewDetails = (lead: Lead) => openDetailsSheet(lead.id);

  const handleUpdateStatus = (leadId: string, status: LeadStatus) => {
    setUpdatingLeadId(leadId);
    updateLead(
      { tenant, leadId, data: { status } },
      {
        onSuccess: (result) => {
          if (result.ok) toast.success("Estado actualizado");
          else           toast.error("No se pudo actualizar el estado");
        },
        onError:   () => toast.error("Error al actualizar el estado"),
        onSettled: () => setUpdatingLeadId(null),
      },
    );
  };

  const handleSaveDetails = (
    leadId: string,
    updates: { status?: LeadStatus; notes?: string },
  ) => {
    updateLead(
      { tenant, leadId, data: updates },
      {
        onSuccess: (result) => {
          if (result.ok) {
            toast.success("Lead actualizado");
            closeDetailsSheet();
          } else {
            toast.error("No se pudo guardar los cambios");
          }
        },
        onError: () => toast.error("Error al guardar los cambios"),
      },
    );
  };

  const handleDelete = (leadId: string) => {
    deleteLead(
      { tenant, leadId },
      {
        onSuccess: (result) => {
          if (result.ok) toast.success("Lead eliminado");
          else           toast.error("No se pudo eliminar el lead");
        },
        onError: () => toast.error("Error al eliminar el lead"),
      },
    );
  };

  const handleBulkDelete = () => {
    bulkDelete(
      { tenant, leadIds: Array.from(selectedLeads) },
      {
        onSuccess: (result) => {
          if (result.ok) {
            toast.success(`${result.deletedCount} leads eliminados`);
            clearSelection();
          } else {
            toast.error("No se pudo eliminar los leads");
          }
        },
        onError: () => toast.error("Error al eliminar los leads"),
      },
    );
  };

  const handleExportCsv = async () => {
    setIsExporting(true);
    try {
      const result = await exportLeadsCsv({
        tenant,
        filters: {
          status: statusFilter !== "all" ? (statusFilter as LeadStatus) : undefined,
        },
      });

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      // Trigger browser download without a new tab
      const blob = new Blob([result.csv], { type: "text/csv;charset=utf-8;" });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = result.filename;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("CSV descargado");
    } catch {
      toast.error("Error al exportar");
    } finally {
      setIsExporting(false);
    }
  };

  return {
    // Data
    leads,
    total,
    isLoading,
    // Sheet — passes leadId, not the full object
    detailsSheetOpen,
    selectedLeadForDetails,
    closeDetailsSheet,
    isSaving,
    // Selection
    selectedLeads,
    clearSelection,
    isBulkDeleting,
    // Row state
    updatingLeadId,
    // Export
    isExporting,
    // Handlers
    handleViewDetails,
    handleUpdateStatus,
    handleSaveDetails,
    handleDelete,
    handleBulkDelete,
    handleExportCsv,
  };
}