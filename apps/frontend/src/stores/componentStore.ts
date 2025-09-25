import { create } from 'zustand';
import type {
  Brand,
  Category,
  ComponentFilter,
  PaginationMeta,
} from '../types/components';

interface ActiveFilter {
  key: keyof ComponentFilter;
  value?: string | number;
  display_name?: string;
}

interface ComponentStore {
  filters: ComponentFilter;
  activeFilters: ActiveFilter[];
  pagination: PaginationMeta;
  categories: Category[];
  brands: Brand[];
  availableSpecs: Record<string, Array<{ value: string; count: number }>>;

  setFilters: (filter: Partial<ComponentFilter>) => void;
  setPagination: (pagination: Partial<PaginationMeta>) => void;
  clearFilter: () => void;
  removeFilter: (key: keyof ComponentFilter) => void;
  setCategories: (categories?: Category[]) => void;
  setBrands: (brands?: Brand[]) => void;
  setAvailableSpecs: (
    specs: Record<string, Array<{ value: string; count: number }>>
  ) => void;

  getCategoryById: (id: string) => Category | undefined;
  getBrandById: (id: string) => Brand | undefined;
  getActiveFiltersWithDisplayNames: () => ActiveFilter[];
}

export const useComponentStore = create<ComponentStore>((set, get) => ({
  filters: {
    sort_by: 'name',
    sort_order: 'asc',
  },
  activeFilters: [],
  pagination: {
    current_page: 1,
    page_size: 12,
  },
  categories: [],
  brands: [],
  availableSpecs: {},

  setFilters: filter =>
    set(state => {
      const newFilters = { ...state.filters, ...filter };

      const newActiveFilters: ActiveFilter[] = Object.entries(newFilters)
        .filter(
          ([key, value]) =>
            key !== 'sort_by' &&
            key !== 'sort_order' &&
            value !== undefined &&
            value !== '' &&
            key !== 'currency'
        )
        .map(([k, value]) => ({
          key: k as keyof ComponentFilter,
          value,
        }));

      return {
        filters: newFilters,
        activeFilters: newActiveFilters,
        pagination: { ...state.pagination, current_page: 1 },
      };
    }),

  setPagination: pagination =>
    set(state => ({ pagination: { ...state.pagination, ...pagination } })),

  clearFilter: () =>
    set(state => ({
      filters: {
        sort_by: 'name',
        sort_order: 'asc',
      },
      activeFilters: [],
      pagination: { current_page: 1, page_size: state.pagination.page_size },
    })),

  removeFilter: key =>
    set(state => {
      const newFilters = { ...state.filters, [key]: undefined };

      const newActiveFilters: ActiveFilter[] = Object.entries(newFilters)
        .filter(
          ([key, value]) =>
            key !== 'sort_by' &&
            key !== 'sort_order' &&
            value !== undefined &&
            value !== '' &&
            key !== 'currency'
        )
        .map(([k, value]) => ({
          key: k as keyof ComponentFilter,
          value,
        }));

      return {
        filters: newFilters,
        activeFilters: newActiveFilters,
        pagination: { ...state.pagination, current_page: 1 },
      };
    }),

  setCategories: categories => set({ categories }),
  setBrands: brands => set({ brands }),
  setAvailableSpecs: specs => set({ availableSpecs: specs }),

  getCategoryById: id => get().categories.find(cat => cat.id === id),
  getBrandById: id => get().brands.find(brand => brand.id === id),

  getActiveFiltersWithDisplayNames: () => {
    const state = get();
    return state.activeFilters.map(filter => ({
      ...filter,
    }));
  },
}));
