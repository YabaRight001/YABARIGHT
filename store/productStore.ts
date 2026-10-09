import { create } from 'zustand';
import { Product } from '@/types';

interface ProductFilters {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  sort: 'newest' | 'oldest' | 'price-low' | 'price-high' | 'trending';
  condition?: string;
}

interface ProductState {
  products: Product[];
  filteredProducts: Product[];
  isLoading: boolean;
  error: string | null;
  filters: ProductFilters;
  currentPage: number;

  // Actions
  setProducts: (products: Product[]) => void;
  setFilters: (filters: Partial<ProductFilters>) => void;
  applyFilters: () => void;
  sortProducts: (sortBy: string) => void;
  setCurrentPage: (page: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearFilters: () => void;
}

const defaultFilters: ProductFilters = {
  search: '',
  category: '',
  minPrice: 0,
  maxPrice: 2000000,
  sort: 'newest',
};

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  filteredProducts: [],
  isLoading: false,
  error: null,
  filters: defaultFilters,
  currentPage: 1,

  setProducts: (products: Product[]) => {
    set({ products });
    get().applyFilters();
  },

  setFilters: (newFilters: Partial<ProductFilters>) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
    get().applyFilters();
  },

  applyFilters: () => {
    const { products, filters } = get();
    let filtered = [...products];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.brand?.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter((p) => p.category === filters.category);
    }

    // Price filter
    filtered = filtered.filter(
      (p) => p.price >= filters.minPrice && p.price <= filters.maxPrice
    );

    // Condition filter
    if (filters.condition) {
      filtered = filtered.filter((p) => p.condition === filters.condition);
    }

    // Sort
    get().sortProducts(filters.sort);

    set({ filteredProducts: filtered, currentPage: 1 });
  },

  sortProducts: (sortBy: string) => {
    const { filteredProducts } = get();
    let sorted = [...filteredProducts];

    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'oldest':
        sorted.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case 'trending':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
      default:
        sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    set({ filteredProducts: sorted });
  },

  setCurrentPage: (page: number) => set({ currentPage: page }),

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  setError: (error: string | null) => set({ error }),

  clearFilters: () => {
    set({ filters: defaultFilters, currentPage: 1 });
    get().applyFilters();
  },
}));
