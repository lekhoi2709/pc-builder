import { create } from 'zustand';
import type {
  Brand,
  Category,
  ComponentFilter,
  PaginationMeta,
} from '../types/components';

interface ActiveFilter {
  key: keyof ComponentFilter;
  value?: string | string[] | number;
  display_name?: string;
}

interface ComponentStore {
  filters: ComponentFilter;
  activeFilters: ActiveFilter[];
  pagination: PaginationMeta;
  categories: Category[];
  brands: Brand[];
  availableSpecs: Record<string, Array<{ value: string; count: number }>>;

  initializeFromURL: (searchParams: URLSearchParams) => void;
  setFilters: (filter: Partial<ComponentFilter>) => void;
  setPagination: (pagination: Partial<PaginationMeta>) => void;
  clearFilter: () => void;
  removeFilter: (key: keyof ComponentFilter, value?: string) => void;
  toggleCategoryFilter: (categoryId: string) => void;
  toggleBrandFilter: (brandId: string) => void;
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
    category_id: [],
    brand_id: [],
  },
  activeFilters: [],
  pagination: {
    current_page: 1,
    page_size: 12,
  },
  categories: [],
  brands: [],
  availableSpecs: {},

  initializeFromURL: (searchParams: URLSearchParams) => {
    const filters: ComponentFilter = {
      sort_by:
        (searchParams.get('sort_by') as ComponentFilter['sort_by']) || 'name',
      sort_order:
        (searchParams.get('sort_order') as ComponentFilter['sort_order']) ||
        'asc',
    };

    const categoryParam = searchParams.get('category_id');
    if (categoryParam) {
      filters.category_id = categoryParam.split(',');
    }

    const brandParam = searchParams.get('brand_id');
    if (brandParam) {
      filters.brand_id = brandParam.split(',');
    }

    const minPrice = searchParams.get('min_price');
    if (minPrice) filters.min_price = Number(minPrice);

    const maxPrice = searchParams.get('max_price');
    if (maxPrice) filters.max_price = Number(maxPrice);

    const search = searchParams.get('search');
    if (search) filters.search = search;

    const currency = searchParams.get('currency');
    if (currency) filters.currency = currency;

    const page = searchParams.get('page');
    const pageSize = searchParams.get('page_size');

    const pagination: PaginationMeta = {
      current_page: page ? Number(page) : 1,
      page_size: pageSize ? Number(pageSize) : 12,
    };

    const newActiveFilters: ActiveFilter[] = Object.entries(filters)
      .filter(
        ([key, value]) =>
          key !== 'sort_by' &&
          key !== 'sort_order' &&
          value !== undefined &&
          value !== '' &&
          key !== 'currency' &&
          !(Array.isArray(value) && value.length === 0)
      )
      .map(([k, value]) => ({
        key: k as keyof ComponentFilter,
        value,
      }));

    set({
      filters,
      activeFilters: newActiveFilters,
      pagination,
    });
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
            value !== '' &&
            key !== 'currency' &&
            !(Array.isArray(value) && value.length === 0)
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
        category_id: [],
        brand_id: [],
      },
      activeFilters: [],
      pagination: { current_page: 1, page_size: state.pagination.page_size },
    })),

  removeFilter: (key, value?) =>
    set(state => {
      const currentValue = state.filters[key];
      let newValue: string | string[] | number | undefined;

      if (Array.isArray(currentValue) && value) {
        newValue = currentValue.filter(v => v !== value);
        if (newValue.length === 0) {
          newValue = undefined;
        }
      } else {
        newValue = undefined;
      }

      const newFilters = { ...state.filters, [key]: newValue };

      const newActiveFilters: ActiveFilter[] = Object.entries(newFilters)
        .filter(
          ([key, value]) =>
            key !== 'sort_by' &&
            key !== 'sort_order' &&
            value !== undefined &&
            value !== '' &&
            key !== 'currency' &&
            !(Array.isArray(value) && value.length === 0)
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

  toggleCategoryFilter: (categoryId: string) =>
    set(state => {
      const currentCategories = state.filters.category_id || [];
      const newCategories = currentCategories.includes(categoryId)
        ? currentCategories.filter(id => id !== categoryId)
        : [...currentCategories, categoryId];

      const newFilters = {
        ...state.filters,
        category_id: newCategories.length > 0 ? newCategories : undefined,
      };

      const newActiveFilters: ActiveFilter[] = Object.entries(newFilters)
        .filter(
          ([key, value]) =>
            key !== 'sort_by' &&
            key !== 'sort_order' &&
            value !== undefined &&
            value !== '' &&
            key !== 'currency' &&
            !(Array.isArray(value) && value.length === 0)
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

  toggleBrandFilter: (brandId: string) =>
    set(state => {
      const currentBrands = state.filters.brand_id || [];
      const newBrands = currentBrands.includes(brandId)
        ? currentBrands.filter(id => id !== brandId)
        : [...currentBrands, brandId];

      const newFilters = {
        ...state.filters,
        brand_id: newBrands.length > 0 ? newBrands : undefined,
      };

      const newActiveFilters: ActiveFilter[] = Object.entries(newFilters)
        .filter(
          ([key, value]) =>
            key !== 'sort_by' &&
            key !== 'sort_order' &&
            value !== undefined &&
            value !== '' &&
            key !== 'currency' &&
            !(Array.isArray(value) && value.length === 0)
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
