import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface DashboardState {
  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  
  // Active view
  activeView: 'overview' | 'leads' | 'preview' | 'settings' | 'billing';
  setActiveView: (view: DashboardState['activeView']) => void;
  
  // Stats refresh
  lastRefresh: Date | null;
  setLastRefresh: (date: Date) => void;
}

export const useDashboardStore = create<DashboardState>()(
  devtools(
    persist(
      (set) => ({
        // Estado inicial
        sidebarOpen: true,
        activeView: 'overview',
        lastRefresh: null,
        
        // Acciones
        setSidebarOpen: (open) => set({ sidebarOpen: open }),
        toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
        setActiveView: (view) => set({ activeView: view }),
        setLastRefresh: (date) => set({ lastRefresh: date }),
      }),
      {
        name: 'dashboard-storage',
        partialize: (state) => ({
          sidebarOpen: state.sidebarOpen,
        }),
      }
    ),
    { name: 'DashboardStore' }
  )
);