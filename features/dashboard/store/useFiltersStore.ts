import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { LeadStatus } from './useLeadsStore';

interface FiltersState {
  // Búsqueda
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Filtros
  statusFilter: LeadStatus | 'all';
  setStatusFilter: (status: FiltersState['statusFilter']) => void;
  
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  setDateRange: (from: Date | null, to: Date | null) => void;
  
  sortBy: 'date' | 'value' | 'name';
  sortOrder: 'asc' | 'desc';
  setSortBy: (sortBy: FiltersState['sortBy']) => void;
  toggleSortOrder: () => void;
  
  // Reset
  resetFilters: () => void;
}

const initialState = {
  searchQuery: '',
  statusFilter: 'all' as const,
  dateRange: { from: null, to: null },
  sortBy: 'date' as const,
  sortOrder: 'desc' as const,
};

export const useFiltersStore = create<FiltersState>()(
  devtools(
    (set) => ({
      ...initialState,
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      setStatusFilter: (status) => set({ statusFilter: status }),
      setDateRange: (from, to) => set({ dateRange: { from, to } }),
      setSortBy: (sortBy) => set({ sortBy }),
      toggleSortOrder: () => set((state) => ({ 
        sortOrder: state.sortOrder === 'asc' ? 'desc' : 'asc' 
      })),
      
      resetFilters: () => set(initialState),
    }),
    { name: 'FiltersStore' }
  )
);
