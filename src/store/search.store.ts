import { create } from 'zustand';
import type { HallSearchParams } from '@/types/api';

interface SearchState {
  filters: HallSearchParams;
  setFilter: <K extends keyof HallSearchParams>(
    key: K,
    value: HallSearchParams[K]
  ) => void;
  setFilters: (filters: Partial<HallSearchParams>) => void;
  resetFilters: () => void;
}

const initialFilters: HallSearchParams = {
  city: undefined,
  minPrice: undefined,
  maxPrice: undefined,
  minCapacity: undefined,
  hasAc: undefined,
  hasParking: undefined,
  page: 0,
  size: 12,
  sortBy: 'createdAt',
  direction: 'desc',
};

export const useSearchStore = create<SearchState>()((set) => ({
  filters: initialFilters,
  setFilter: (key, value) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: value,
        page: key === 'page' ? (value as number) : 0, // Reset to page 0 when filters change
      },
    })),
  setFilters: (newFilters) =>
    set((state) => ({
      filters: {
        ...state.filters,
        ...newFilters,
        page: newFilters.page !== undefined ? newFilters.page : 0,
      },
    })),
  resetFilters: () => set({ filters: initialFilters }),
}));

