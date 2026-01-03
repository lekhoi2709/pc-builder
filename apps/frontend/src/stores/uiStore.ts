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

const applyTheme = (theme: Theme) => {
  const isDark =
    theme === 'Dark' ||
    (theme === 'System' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  document.documentElement.classList.toggle('dark', isDark);
};

export const useUIStore = create<UIStore>()(
  persist(
    set => ({
      theme: 'Light',
      openPanel: null,
      isSideBarOpen: false,
      isFilterOpen: false,

      setTheme: theme => {
        set({ theme });
        applyTheme(theme);
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
      onRehydrateStorage: () => state => {
        if (state) {
          applyTheme(state.theme);
        }
      },
    }
  )
);

const initialTheme = localStorage.getItem('ui-storage');
if (initialTheme) {
  try {
    const parsed = JSON.parse(initialTheme);
    if (parsed.state?.theme) {
      applyTheme(parsed.state.theme);
    }
  } catch (e) {
    console.error('Failed to parse theme from localStorage:', e);
  }
}
