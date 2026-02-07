/**
 * Zustand store pour gérer les Brands de l'utilisateur.
 * Connecté à Supabase pour persistence.
 */

import { create } from "zustand";
import type { Brand, BrandCreate, BrandUpdate } from "@/types";

interface BrandState {
  brands: Brand[];
  currentBrand: Brand | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setBrands: (brands: Brand[]) => void;
  setCurrentBrand: (brand: Brand | null) => void;
  addBrand: (brand: Brand) => void;
  updateBrand: (id: string, updates: BrandUpdate) => void;
  deleteBrand: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  brands: [],
  currentBrand: null,
  isLoading: false,
  error: null,
};

export const useBrandStore = create<BrandState>((set) => ({
  ...initialState,

  setBrands: (brands) => set({ brands }),

  setCurrentBrand: (brand) => set({ currentBrand: brand }),

  addBrand: (brand) =>
    set((state) => ({
      brands: [...state.brands, brand],
    })),

  updateBrand: (id, updates) =>
    set((state) => ({
      brands: state.brands.map((b) =>
        b.id === id ? { ...b, ...updates, updated_at: new Date().toISOString() } : b
      ),
      currentBrand:
        state.currentBrand?.id === id
          ? { ...state.currentBrand, ...updates, updated_at: new Date().toISOString() }
          : state.currentBrand,
    })),

  deleteBrand: (id) =>
    set((state) => ({
      brands: state.brands.filter((b) => b.id !== id),
      currentBrand: state.currentBrand?.id === id ? null : state.currentBrand,
    })),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  reset: () => set(initialState),
}));
