// src/stores/exclusivePanelStore.ts
import { create } from 'zustand';

type PanelType = 'sidebar' | 'filter' | null;

interface ExclusivePanelStore {
  openPanel: PanelType;

  toggleSidebar: () => void;
  toggleFilter: () => void;
  closeAll: () => void;
  openSidebar: () => void;
  openFilter: () => void;

  // Computed values for convenience
  isSideBarOpen: boolean;
  isFilterOpen: boolean;
}

export const useExclusivePanel = create<ExclusivePanelStore>(set => ({
  openPanel: null,
  isSideBarOpen: false,
  isFilterOpen: false,

  toggleSidebar: () =>
    set(state => {
      const newOpenPanel = state.openPanel === 'sidebar' ? null : 'sidebar';
      return {
        openPanel: newOpenPanel,
        isSideBarOpen: newOpenPanel === 'sidebar',
        isFilterOpen: false,
      };
    }),

  toggleFilter: () =>
    set(state => {
      const newOpenPanel = state.openPanel === 'filter' ? null : 'filter';
      return {
        openPanel: newOpenPanel,
        isSideBarOpen: false,
        isFilterOpen: newOpenPanel === 'filter',
      };
    }),

  closeAll: () =>
    set({
      openPanel: null,
      isSideBarOpen: false,
      isFilterOpen: false,
    }),

  openSidebar: () =>
    set({
      openPanel: 'sidebar',
      isSideBarOpen: true,
      isFilterOpen: false,
    }),

  openFilter: () =>
    set({
      openPanel: 'filter',
      isSideBarOpen: false,
      isFilterOpen: true,
    }),
}));
