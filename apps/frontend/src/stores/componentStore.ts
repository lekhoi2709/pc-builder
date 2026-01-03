import { create } from 'zustand';
import type { Brand, Category } from '../types/components';

interface ComponentStore {
  categories: Category[];
  brands: Brand[];

  setCategories: (categories?: Category[]) => void;
  setBrands: (brands?: Brand[]) => void;
  getCategoryById: (id: string) => Category | undefined;
  getBrandById: (id: string) => Brand | undefined;
}

export const useComponentStore = create<ComponentStore>((set, get) => ({
  categories: [],
  brands: [],

  setCategories: categories => set({ categories }),
  setBrands: brands => set({ brands }),
  getCategoryById: id => get().categories.find(cat => cat.id === id),
  getBrandById: id => get().brands.find(brand => brand.id === id),
}));
