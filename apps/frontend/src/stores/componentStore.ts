import { create } from 'zustand';
import type { ComponentFilter, PaginationMeta } from '../services/api';

interface ActiveFilter {
  key: keyof ComponentFilter;
  value: string | number;
}

interface ComponentStore {
  filters: ComponentFilter;
  activeFilters: ActiveFilter[];
  pagination: PaginationMeta;
  setFilters: (filter: Partial<ComponentFilter>) => void;
  setPagination: (pagination: Partial<PaginationMeta>) => void;
  clearFilter: () => void;
  removeFilter: (key: keyof ComponentFilter) => void;
}

export const useComponentStore = create<ComponentStore>(set => ({
  filters: {
    sort_by: 'name',
    sort_order: 'asc',
  },
  activeFilters: [],
  pagination: {
    current_page: 1,
    page_size: 12,
  },
  setFilters: filter =>
    set(state => {
      const newFilters = { ...state.filters, ...filter };

      const newActiveFilters: ActiveFilter[] = Object.entries(newFilters)
        .filter(
          ([key, value]) =>
            key !== 'sort_by' &&
            key !== 'sort_order' &&
            value !== undefined &&
            value !== ''
        )
        .map(([k, value]) => ({ key: k as keyof ComponentFilter, value }));

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
          ([k, value]) =>
            k !== 'sort_by' &&
            k !== 'sort_order' &&
            value !== undefined &&
            value !== ''
        )
        .map(([k, value]) => ({ key: k as keyof ComponentFilter, value }));

      return {
        filters: newFilters,
        activeFilters: newActiveFilters,
        pagination: { ...state.pagination, current_page: 1 },
      };
    }),
}));
