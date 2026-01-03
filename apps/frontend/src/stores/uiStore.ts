import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'Light' | 'Dark' | 'System';
type PanelType = 'sidebar' | 'filter' | null;

interface UIStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;

  openPanel: PanelType;
  isSideBarOpen: boolean;
  isFilterOpen: boolean;

  toggleSidebar: () => void;
  toggleFilter: () => void;
  closeAll: () => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    set => ({
      theme: 'Light',
      openPanel: null,
      isSideBarOpen: false,
      isFilterOpen: false,

      setTheme: theme => {
        set({ theme });
        document.documentElement.classList.toggle(
          'dark',
          theme === 'Dark' ||
            (theme === 'System' &&
              window.matchMedia('(prefers-color-scheme: dark)').matches)
        );
      },

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
    }),
    {
      name: 'ui-storage',
      partialize: state => ({ theme: state.theme }),
    }
  )
);
