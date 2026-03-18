import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'LOST';

interface LeadsState {
  // Selección múltiple
  selectedLeads: Set<string>;
  selectLead: (id: string) => void;
  deselectLead: (id: string) => void;
  toggleLead: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
  
  // Modals
  deleteModalOpen: boolean;
  leadToDelete: string | null;
  openDeleteModal: (leadId: string) => void;
  closeDeleteModal: () => void;
  
  detailsSheetOpen: boolean;
  selectedLeadForDetails: string | null;
  openDetailsSheet: (leadId: string) => void;
  closeDetailsSheet: () => void;
  
  // Bulk actions
  bulkActionInProgress: boolean;
  setBulkActionInProgress: (inProgress: boolean) => void;
}

export const useLeadsStore = create<LeadsState>()(
  devtools(
    (set) => ({
      selectedLeads: new Set(),
      deleteModalOpen: false,
      leadToDelete: null,
      detailsSheetOpen: false,
      selectedLeadForDetails: null,
      bulkActionInProgress: false,
      
      selectLead: (id) =>
        set((state) => ({
          selectedLeads: new Set(state.selectedLeads).add(id),
        })),
      
      deselectLead: (id) =>
        set((state) => {
          const newSet = new Set(state.selectedLeads);
          newSet.delete(id);
          return { selectedLeads: newSet };
        }),
      
      toggleLead: (id) =>
        set((state) => {
          const newSet = new Set(state.selectedLeads);
          if (newSet.has(id)) {
            newSet.delete(id);
          } else {
            newSet.add(id);
          }
          return { selectedLeads: newSet };
        }),
      
      selectAll: (ids) =>
        set({ selectedLeads: new Set(ids) }),
      
      clearSelection: () =>
        set({ selectedLeads: new Set() }),
      
      openDeleteModal: (leadId) =>
        set({ deleteModalOpen: true, leadToDelete: leadId }),
      
      closeDeleteModal: () =>
        set({ deleteModalOpen: false, leadToDelete: null }),
      
      openDetailsSheet: (leadId) =>
        set({ detailsSheetOpen: true, selectedLeadForDetails: leadId }),
      
      closeDetailsSheet: () =>
        set({ detailsSheetOpen: false, selectedLeadForDetails: null }),
      
      setBulkActionInProgress: (inProgress) =>
        set({ bulkActionInProgress: inProgress }),
    }),
    { name: 'LeadsStore' }
  )
);