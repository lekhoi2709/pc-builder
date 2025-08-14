import { create } from 'zustand';
import type { ComponentFilter, PaginationMeta } from '../services/api';

interface ComponentStore {
  filters: ComponentFilter;
  pagination: PaginationMeta;
  setFilters: (filter: Partial<ComponentFilter>) => void;
  setPagination: (pagination: Partial<PaginationMeta>) => void;
  clearFilter: () => void;
}

export const useComponentStore = create<ComponentStore>(set => ({
  filters: {
    sort_by: 'name',
    sort_order: 'asc',
  },
  pagination: {
    current_page: 1,
    page_size: 12,
  },
  setFilters: filter =>
    set(state => ({ filters: { ...state.filters, ...filter } })),
  setPagination: pagination =>
    set(state => ({ pagination: { ...state.pagination, ...pagination } })),
  clearFilter: () =>
    set(() => ({
      filters: {
        sort_by: 'name',
        sort_order: 'asc',
      },
      pagination: {
        current_page: 1,
        page_size: 12,
      },
    })),
}));
