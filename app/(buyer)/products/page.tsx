'use client';

import { Suspense, useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProductStore } from '@/store/productStore';
import { sampleProducts } from '@/lib/mockProducts';
import { useAffiliateStore } from '@/store/affiliateStore';
import { ProductCard } from '@/components/ProductCard';
import { 
  Filter, 
  X, 
  Search, 
  SlidersHorizontal, 
  RotateCcw,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';

const DEFAULT_CATEGORIES = [
  'All',
  'Phones',
  'Gadgets',
  'Laptops',
  'Combos',
  'Aso Ebi',
  'Gift Items',
  'Suits',
  'Shoes',
  'Sneakers',
  'Trainers',
  'Shirts',
  'Jeans',
  'Pant Trousers',
  'Ties',
  'Clothing',
  'Bags',
  'Trade',
  'Accessories'
];

const PRICE_PRESETS = [
  { label: 'All Prices', min: 0, max: 2000000 },
  { label: 'Under ₦25K', min: 0, max: 25000 },
  { label: 'Under ₦50K', min: 0, max: 50000 },
  { label: 'Under ₦100K', min: 0, max: 100000 },
  { label: 'Under ₦500K', min: 0, max: 500000 },
  { label: '₦500K - ₦2M', min: 500000, max: 2000000 },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const {
    filteredProducts,
    filters,
    setFilters,
    setProducts,
    setLoading,
    setError,
    isLoading,
    error,
  } = useProductStore();
  const { setActiveRef } = useAffiliateStore();

  const adminProducts = useAdminStore((s) => s.products);
  const fetchProducts = useAdminStore((s) => s.fetchProducts);
  const storedCategories = useAdminStore((s) => s.categories);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const categoriesList = useMemo(() => [
    'All',
    ...(storedCategories && storedCategories.length > 0 ? storedCategories : DEFAULT_CATEGORIES.slice(1))
  ], [storedCategories]);

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchInput, setSearchInput] = useState('');

  // Capture affiliate referral code from URL
  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      setActiveRef(ref.toUpperCase());
      if (typeof window !== 'undefined') {
        localStorage.setItem('yabaright_ref', ref.toUpperCase());
      }
    }
  }, [searchParams, setActiveRef]);

  // Sync search parameters and live products from adminStore on mount or URL change
  const searchParamsString = searchParams ? searchParams.toString() : '';

  useEffect(() => {
    const initialCategory = searchParams.get('category') || '';
    const initialSearch = searchParams.get('search') || '';
    const initialMaxPrice = searchParams.get('max_price') 
      ? Number(searchParams.get('max_price')) 
      : 2000000;
    const initialCondition = searchParams.get('condition') || '';

    // Match category
    const matchedCategory = categoriesList.find(
      (c) => c.toLowerCase() === initialCategory.toLowerCase()
    );
    if (matchedCategory) {
      setActiveCategory(matchedCategory);
    } else if (!initialCategory) {
      setActiveCategory('All');
    }

    setSearchInput(initialSearch);

    // Use live products from adminStore (with fallback to sampleProducts before store hydration)
    const productsSource = adminProducts !== undefined ? adminProducts : sampleProducts;
    setProducts(productsSource);

    setFilters({
      category: matchedCategory && matchedCategory !== 'All' ? matchedCategory : '',
      search: initialSearch,
      maxPrice: initialMaxPrice,
      condition: initialCondition,
      sort: 'newest',
    });
  }, [adminProducts, searchParamsString, categoriesList]);

  // Handle category pill click
  const handleCategorySelect = (cat: string) => {
    setActiveCategory(cat);
    setFilters({
      category: cat === 'All' ? '' : cat,
    });
  };

  // Handle search submit/change
  const handleSearchChange = (val: string) => {
    setSearchInput(val);
    setFilters({ search: val });
  };

  const clearSearch = () => {
    setSearchInput('');
    setFilters({ search: '' });
  };

  // Handle price preset
  const handlePricePreset = (min: number, max: number) => {
    setFilters({ minPrice: min, maxPrice: max });
  };

  // Count active filters
  const activeFiltersCount = [
    activeCategory !== 'All' ? 1 : 0,
    filters.search ? 1 : 0,
    (filters.minPrice > 0 || filters.maxPrice < 2000000) ? 1 : 0,
    filters.condition ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const resetAllFilters = () => {
    setActiveCategory('All');
    setSearchInput('');
    setFilters({
      search: '',
      category: '',
      minPrice: 0,
      maxPrice: 2000000,
      condition: undefined,
      sort: 'newest',
    });
  };

  return (
    <div className="container-custom py-6 sm:py-10">
      {/* Header Banner */}
      <div className="mb-6 rounded-[2rem] border border-[#FFD700]/25 bg-gradient-to-r from-[#0b0b0b] via-[#141414] to-[#0b0b0b] p-6 text-white sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFD700]/15 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#FFD700]">
              <Sparkles className="h-3 w-3" />
              Direct From Thrift Vendors
            </span>
            <h1 className="mt-2 text-2xl sm:text-4xl font-black tracking-tight text-white">
              Shop The YABARIGHT Catalog
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-gray-400">
              Verified thrift grades, brand-new releases, and pre-loved fashion gems.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold text-[#FFD700]">
              {filteredProducts.length} items found
            </span>
          </div>
        </div>
      </div>

      {/* Category Pills Strip */}
      <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categoriesList.map((cat) => {
          const isSelected = activeCategory.toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategorySelect(cat)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-black uppercase tracking-wider transition-all ${
                isSelected
                  ? 'bg-[#111111] text-[#FFD700] shadow-md ring-2 ring-[#FFD700]/50'
                  : 'border border-black/10 bg-white text-gray-700 hover:border-[#FFD700] hover:text-black'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Search & Sort Controls Bar */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Field */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search items, brands, materials..."
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-2.5 pl-10 pr-9 text-xs text-gray-900 outline-none transition focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/20 shadow-sm"
          />
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
          {searchInput && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Mobile Filter Toggle Button & Sort Dropdown */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="flex lg:hidden items-center gap-2 rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-xs font-bold text-gray-800 shadow-sm hover:border-[#FFD700]"
          >
            <SlidersHorizontal className="h-4 w-4 text-[#c88d00]" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#111111] text-[9px] font-black text-[#FFD700]">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Sort Selector */}
          <div className="relative flex items-center">
            <select
              value={filters.sort}
              onChange={(e) => setFilters({ sort: e.target.value as any })}
              className="appearance-none rounded-2xl border border-black/10 bg-white px-4 py-2.5 pr-8 text-xs font-bold text-gray-800 outline-none transition focus:border-[#FFD700] shadow-sm cursor-pointer"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="trending">Sort: Popular & Trending</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 h-3.5 w-3.5 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Main Content Layout (Desktop Sidebar + Grid) */}
      <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[1.75rem] border border-black/10 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-[#c88d00]" />
                <h2 className="text-base font-black text-gray-900">Filters</h2>
              </div>
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="flex items-center gap-1 text-[11px] font-bold text-red-600 hover:underline"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset All</span>
                </button>
              )}
            </div>

            <div className="space-y-6 text-sm">
              {/* Price Preset Chips */}
              <div>
                <label className="mb-2.5 block text-xs font-black uppercase tracking-wider text-gray-600">
                  Quick Price Range
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {PRICE_PRESETS.map((preset) => {
                    const isSelected =
                      filters.maxPrice === preset.max && filters.minPrice === preset.min;
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => handlePricePreset(preset.min, preset.max)}
                        className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                          isSelected
                            ? 'bg-[#111111] text-[#FFD700] shadow-sm'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Slider Range & Inputs */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-2">
                  <span>Max Price Range</span>
                  <span className="text-base font-black text-[#c88d00]">
                    ₦{filters.maxPrice.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="2000000"
                  step="10000"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ maxPrice: Number(e.target.value) })}
                  className="w-full accent-[#c88d00]"
                />
                
                {/* Min / Max Numeric Inputs */}
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Min Price (₦)</label>
                    <input
                      type="number"
                      min="0"
                      max={filters.maxPrice}
                      step="2500"
                      value={filters.minPrice === 0 ? '' : filters.minPrice}
                      placeholder="0"
                      onChange={(e) => setFilters({ minPrice: Math.max(0, Number(e.target.value)) })}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-900 outline-none focus:border-[#c88d00]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Max Price (₦)</label>
                    <input
                      type="number"
                      min={filters.minPrice}
                      max="10000000"
                      step="10000"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({ maxPrice: Math.max(filters.minPrice, Number(e.target.value)) })}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-900 outline-none focus:border-[#c88d00]"
                    />
                  </div>
                </div>
              </div>

              {/* Condition Filter */}
              <div className="border-t border-gray-100 pt-5">
                <label className="mb-2.5 block text-xs font-black uppercase tracking-wider text-gray-600">
                  Item Condition
                </label>
                <div className="space-y-2">
                  {[
                    { label: 'All Conditions', val: '' },
                    { label: 'Brand New', val: 'NEW' },
                    { label: 'Thrift Grade A (Like New)', val: 'LIKE_NEW' },
                    { label: 'Good Pre-Owned', val: 'GOOD' },
                  ].map((cond) => (
                    <label
                      key={cond.val}
                      className="flex items-center gap-2.5 text-xs font-semibold text-gray-700 cursor-pointer hover:text-black"
                    >
                      <input
                        type="radio"
                        name="condition"
                        checked={filters.condition === cond.val || (!filters.condition && cond.val === '')}
                        onChange={() => setFilters({ condition: cond.val || undefined })}
                        className="accent-[#c88d00]"
                      />
                      <span>{cond.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid Section */}
        <section className="min-w-0">
          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 animate-pulse rounded-[1.5rem] bg-gray-200" />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-[2rem] border border-black/10 bg-white p-12 text-center shadow-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-3xl">
                🔍
              </div>
              <h3 className="mt-4 text-xl font-black text-[#111111]">
                No items match your criteria
              </h3>
              <p className="mt-2 max-w-sm text-xs text-gray-500">
                We couldn&apos;t find any products matching your active filters. Try clearing your search or expanding the price range.
              </p>
              <button
                type="button"
                onClick={resetAllFilters}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#FFD700] px-6 py-2.5 text-xs font-black uppercase tracking-wider text-black transition hover:bg-[#ffcc00]"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}
        </section>
      </div>

      {/* Mobile Filters Drawer / Modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm lg:hidden animate-in fade-in duration-200">
          <div className="max-h-[85vh] overflow-y-auto rounded-t-[2rem] bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-black text-gray-900">Filter Products</h3>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 text-sm">
              {/* Price preset */}
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-wider text-gray-700">
                  Quick Price Preset
                </label>
                <div className="flex flex-wrap gap-2">
                  {PRICE_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => handlePricePreset(preset.min, preset.max)}
                      className={`rounded-xl px-3.5 py-2 text-xs font-bold ${
                        filters.maxPrice === preset.max && filters.minPrice === preset.min
                          ? 'bg-[#111111] text-[#FFD700]'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider & Inputs Mobile */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-2">
                  <span>Max Price</span>
                  <span className="text-base font-black text-[#c88d00]">
                    ₦{filters.maxPrice.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="2000000"
                  step="10000"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ maxPrice: Number(e.target.value) })}
                  className="w-full accent-[#c88d00]"
                />
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <input
                    type="number"
                    min="0"
                    placeholder="Min Price (₦)"
                    value={filters.minPrice === 0 ? '' : filters.minPrice}
                    onChange={(e) => setFilters({ minPrice: Math.max(0, Number(e.target.value)) })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-bold text-gray-900"
                  />
                  <input
                    type="number"
                    min={filters.minPrice}
                    placeholder="Max Price (₦)"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ maxPrice: Math.max(filters.minPrice, Number(e.target.value)) })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-bold text-gray-900"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="flex-1 rounded-2xl border border-gray-300 py-3 text-xs font-bold text-gray-700"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="flex-1 rounded-2xl bg-[#111111] py-3 text-xs font-black uppercase tracking-wider text-[#FFD700]"
                >
                  Show Results ({filteredProducts.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="container-custom py-12 text-center text-sm font-semibold text-gray-500">
        Loading YabaRight marketplace...
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
