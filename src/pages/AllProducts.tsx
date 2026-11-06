import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ChevronDownIcon,
  ClockIcon,
  FilterIcon,
  PackageSearchIcon,
  SearchIcon,
  SparklesIcon,
  TagIcon,
  XIcon
} from 'lucide-react';
import { ProductCard, ProductCardSkeleton } from '../components/product/ProductCard';
import { WhatsAppIcon } from '../components/ui/WhatsAppIcon';
import {
  PRICE_CEILING,
  filterProducts,
  getBrandNames,
  getCategoryNames,
  getProductsByTag,
  useLiveProducts
} from '../services/productService';
import { useLiveBrands } from '../services/brandService';
import type { Product } from '../types';
import { formatPrice } from '../utils/format';
import { generateCategoryInquiry } from '../utils/whatsapp';
import type { SortKey } from '../services/productService';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Popular' }
];

const POPULAR_TAGS = [
  { id: 'new', label: 'New Arrivals' },
  { id: 'sale', label: 'Sale & Offers' },
  { id: 'bestseller', label: 'Best Sellers' },
  { id: 'popular', label: 'Popular' },
  { id: 'featured', label: 'Featured' },
  { id: 'professional', label: 'Professional Grade' },
  { id: 'budget', label: 'Budget Friendly' }
];


export function AllProducts() {
  const [params, setParams] = useSearchParams();
  const rawTag = params.get('tag');
  const initialQuery = params.get('q') ?? '';
  const initialCategory = params.get('category');
  const initialBrand = params.get('brand');

  const [query, setQuery] = useState(initialQuery);
  const [categories, setCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  const [brands, setBrands] = useState<string[]>(
    initialBrand ? [initialBrand] : []
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(rawTag ? [rawTag] : []);
  const [maxPrice, setMaxPrice] = useState(PRICE_CEILING);
  const [sort, setSort] = useState<SortKey>('featured');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(true);
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(true);
  const liveProducts = useLiveProducts();
  const liveBrands = useLiveBrands();

  // Combined list of all brands from database + existing products
  const allAvailableBrands = useMemo(() => {
    const fromDb = liveBrands.map((b) => b.name);
    const fromProducts = liveProducts.map((p) => p.brand);
    const brandMap = new Map<string, string>();
    [...fromDb, ...fromProducts].forEach((b) => {
      if (b && !brandMap.has(b.toLowerCase().trim())) {
        brandMap.set(b.toLowerCase().trim(), b.trim());
      }
    });
    return Array.from(brandMap.values()).sort((a, b) => a.localeCompare(b));
  }, [liveBrands, liveProducts]);

  useEffect(() => {
    setQuery(params.get('q') ?? '');
    const c = params.get('category');
    if (c) {
      setCategories([c]);
      setCategoryDropdownOpen(true);
    }
    const t = params.get('tag');
    if (t) {
      setSelectedTags([t]);
    }
    const b = params.get('brand');
    if (b) {
      const matched = allAvailableBrands.find(
        (brandName) => brandName.toLowerCase().trim() === b.toLowerCase().trim()
      ) || b;
      setBrands([matched]);
      setBrandDropdownOpen(true);
    }
  }, [params, allAvailableBrands]);

  const results: Product[] = useMemo(() => {
    let base = filterProducts(
      { query, categories, brands, maxPrice, sort },
      liveProducts
    );

    if (selectedTags.length > 0) {
      base = base.filter((p) => {
        if (!Array.isArray(p.tags)) return false;
        return selectedTags.some((st) => {
          const normSt = st.toLowerCase().trim();
          return p.tags.some((t) => {
            const normT = String(t).toLowerCase().trim();
            if (normT === normSt) return true;
            if (normSt === 'new' && (normT === 'new arrival' || normT === 'new arrivals' || normT === 'new-arrival')) return true;
            if (normSt === 'sale' && (normT === 'on sale' || normT === 'discount' || normT === 'deal' || normT === 'deals')) return true;
            return false;
          });
        });
      });
    }

    return base;
  }, [liveProducts, query, categories, brands, maxPrice, sort, selectedTags]);

  useEffect(() => {
    setLoading(true);
    const timer = window.setTimeout(() => setLoading(false), 220);
    return () => window.clearTimeout(timer);
  }, [query, categories, brands, maxPrice, sort, selectedTags]);

  const toggle = (value: string, list: string[], setList: (next: string[]) => void) => {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  const toggleCategory = (name: string) => {
    const isSelected = categories.some((c) => c.toLowerCase().trim() === name.toLowerCase().trim());
    const next = isSelected
      ? categories.filter((c) => c.toLowerCase().trim() !== name.toLowerCase().trim())
      : [...categories, name];
    setCategories(next);

    const newParams = new URLSearchParams(params);
    if (next.length === 1) {
      newParams.set('category', next[0]);
    } else {
      newParams.delete('category');
    }
    setParams(newParams, { replace: true });
  };

  const toggleBrand = (name: string) => {
    const isSelected = brands.some((b) => b.toLowerCase().trim() === name.toLowerCase().trim());
    const next = isSelected
      ? brands.filter((b) => b.toLowerCase().trim() !== name.toLowerCase().trim())
      : [...brands, name];
    setBrands(next);

    const newParams = new URLSearchParams(params);
    if (next.length === 1) {
      newParams.set('brand', next[0]);
    } else {
      newParams.delete('brand');
    }
    setParams(newParams, { replace: true });
  };

  const clearAll = () => {
    setQuery('');
    setCategories([]);
    setBrands([]);
    setSelectedTags([]);
    setMaxPrice(PRICE_CEILING);
    setSort('featured');
    setParams({});
  };

  const activeCount =
    categories.length +
    brands.length +
    (maxPrice < PRICE_CEILING ? 1 : 0) +
    (query ? 1 : 0);

  const heading =
    brands.length === 1 && !selectedTags.length && !categories.length
      ? `${brands[0]} Products`
      : categories.length === 1 && !selectedTags.length && !brands.length
      ? `${categories[0]}`
      : selectedTags.length === 1 && selectedTags[0] === 'new'
      ? 'New Arrivals'
      : selectedTags.length === 1 && selectedTags[0] === 'sale'
      ? 'Sale & Special Offers'
      : selectedTags.length === 1
      ? `Products Tagged "${selectedTags[0]}"`
      : 'All Products';

  const filterPanel = (
    <div className="space-y-4">
      {/* Categories Dropdown */}
      <CollapsibleFilterDropdown
        title="Category"
        isOpen={categoryDropdownOpen}
        onToggle={() => setCategoryDropdownOpen((prev) => !prev)}
        activeCount={categories.length}
      >
        <div className="max-h-56 space-y-1 overflow-y-auto pr-1 thin-scrollbar">
          {getCategoryNames().map((name) => {
            const count = liveProducts.filter(
              (p) => p.category.toLowerCase().trim() === name.toLowerCase().trim()
            ).length;
            const isChecked = categories.some(
              (c) => c.toLowerCase().trim() === name.toLowerCase().trim()
            );
            return (
              <label
                key={name}
                className={`flex items-center justify-between text-xs cursor-pointer select-none py-1.5 px-2 rounded-lg transition-colors ${
                  isChecked ? 'bg-accent/10 text-accent font-bold' : 'text-zinc-700 hover:bg-zinc-50 hover:text-ink font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleCategory(name)}
                    className="h-4 w-4 rounded border-zinc-300 accent-[#ff6a00] cursor-pointer"
                  />
                  <span className="truncate">{name}</span>
                </div>
                <span className={`text-[10px] shrink-0 font-semibold ${isChecked ? 'text-accent' : 'text-zinc-400'}`}>
                  ({count})
                </span>
              </label>
            );
          })}
        </div>
      </CollapsibleFilterDropdown>

      {/* Brands Dropdown */}
      <CollapsibleFilterDropdown
        title="Brand"
        isOpen={brandDropdownOpen}
        onToggle={() => setBrandDropdownOpen((prev) => !prev)}
        activeCount={brands.length}
      >
        <div className="max-h-56 space-y-1 overflow-y-auto pr-1 thin-scrollbar">
          {allAvailableBrands.map((name) => {
            const count = liveProducts.filter(
              (p) => p.brand.toLowerCase().trim() === name.toLowerCase().trim()
            ).length;
            const isChecked = brands.some(
              (b) => b.toLowerCase().trim() === name.toLowerCase().trim()
            );
            return (
              <label
                key={name}
                className={`flex items-center justify-between text-xs cursor-pointer select-none py-1.5 px-2 rounded-lg transition-colors ${
                  isChecked ? 'bg-accent/10 text-accent font-bold' : 'text-zinc-700 hover:bg-zinc-50 hover:text-ink font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleBrand(name)}
                    className="h-4 w-4 rounded border-zinc-300 accent-[#ff6a00] cursor-pointer"
                  />
                  <span className="truncate">{name}</span>
                </div>
                <span className={`text-[10px] shrink-0 font-semibold ${isChecked ? 'text-accent' : 'text-zinc-400'}`}>
                  ({count})
                </span>
              </label>
            );
          })}
        </div>
      </CollapsibleFilterDropdown>

      {/* Max Price */}
      <div className="rounded-xl border border-zinc-200/90 bg-white p-3.5 shadow-xs">
        <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
          Max Price
        </h3>
        <input
          type="range"
          min={1000}
          max={PRICE_CEILING}
          step={1000}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-[#ff6a00] cursor-pointer"
          aria-label="Maximum price"
        />
        <p className="mt-1 text-xs font-semibold text-zinc-600">
          Up to {formatPrice(maxPrice)}
        </p>
      </div>

      <button
        type="button"
        onClick={clearAll}
        className="w-full rounded-lg border border-zinc-300 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-600 transition-colors hover:border-ink hover:text-ink cursor-pointer"
      >
        Clear All Filters
      </button>
    </div>
  );

  return (
    <div className="bg-surface">
      <div className="mx-auto w-full max-w-[1320px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <header className="mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl">
              {heading}
            </h1>
            {selectedTags.length > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-3 py-1 text-xs font-bold uppercase text-accent">
                <TagIcon size={12} />
                Filter Active
              </span>
            )}
          </div>
          <p className="mt-1.5 text-sm text-zinc-600">
            {results.length} product{results.length === 1 ? '' : 's'} available for inquiry
          </p>

          {/* Active Filters pills */}
          {(brands.length > 0 || categories.length > 0 || selectedTags.length > 0) && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Active Filters:
              </span>
              {brands.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => toggleBrand(b)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-bold text-accent hover:bg-accent hover:text-white transition-colors cursor-pointer"
                >
                  <span>Brand: {b}</span>
                  <XIcon size={13} />
                </button>
              ))}
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleCategory(c)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-zinc-300 bg-zinc-100 px-3 py-1 text-xs font-bold text-ink hover:bg-accent hover:text-white hover:border-accent transition-colors cursor-pointer"
                >
                  <span>Category: {c}</span>
                  <XIcon size={13} />
                </button>
              ))}
              {selectedTags.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggle(t, selectedTags, setSelectedTags)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-zinc-300 bg-zinc-100 px-3 py-1 text-xs font-bold text-ink hover:bg-accent hover:text-white hover:border-accent transition-colors cursor-pointer"
                >
                  <span>Tag: {t === 'new' ? 'New Arrivals' : t === 'sale' ? 'Sale & Offers' : t}</span>
                  <XIcon size={13} />
                </button>
              ))}
              <button
                type="button"
                onClick={clearAll}
                className="text-xs text-zinc-500 hover:text-accent font-semibold underline ml-1 cursor-pointer"
              >
                Clear All
              </button>
            </div>
          )}
        </header>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <SearchIcon
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search speakers, mixers, microphones..."
              className="h-12 w-full rounded-md border border-zinc-300 bg-white pl-11 pr-4 text-sm text-ink outline-none transition-colors placeholder:text-zinc-400 focus:border-accent"
              aria-label="Search products"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white px-4 text-xs font-bold uppercase tracking-wider text-ink lg:hidden cursor-pointer"
            >
              <FilterIcon size={15} />
              Filters{activeCount > 0 ? ` (${activeCount})` : ''}
            </button>
            <label className="flex h-12 items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 cursor-pointer">
              <span className="hidden text-[11px] font-bold uppercase tracking-wider text-zinc-400 sm:block">
                Sort
              </span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="bg-transparent text-sm font-semibold text-ink outline-none cursor-pointer"
                aria-label="Sort products"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[248px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto thin-scrollbar rounded-xl border border-zinc-200 bg-white p-5">
              {filterPanel}
            </div>
          </aside>

          <div>
            {loading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : results.length === 0 ? (
              categories.length > 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-white p-8 sm:p-14 text-center shadow-card">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-accent mb-4 ring-8 ring-amber-50/60">
                    <SparklesIcon size={32} className="text-accent animate-pulse" />
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-accent mb-3">
                    <ClockIcon size={13} />
                    Inventory In Progress
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-ink">
                    Coming soon!!
                  </h2>
                  <p className="mt-3 max-w-lg text-sm sm:text-base leading-relaxed text-zinc-600">
                    We are currently curating, testing, and adding verified products for <strong>{categories.join(', ')}</strong>. New models and additions will be available here very soon!
                  </p>
                  <p className="mt-2 max-w-md text-xs sm:text-sm text-zinc-500">
                    Need equipment from this category immediately? Message our sound engineers on WhatsApp for custom orders and instant quotations.
                  </p>
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <a
                      href={generateCategoryInquiry(categories.join(', '))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#25D366] px-5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-[#1faa54]"
                    >
                      <WhatsAppIcon size={16} />
                      Inquire on WhatsApp
                    </a>
                    <button
                      type="button"
                      onClick={() => setCategories([])}
                      className="inline-flex h-11 items-center gap-2 rounded-lg border border-zinc-300 bg-white px-5 text-xs font-bold uppercase tracking-wider text-ink transition-all hover:border-accent hover:text-accent cursor-pointer"
                    >
                      Clear Category Filter
                    </button>
                    <button
                      type="button"
                      onClick={clearAll}
                      className="inline-flex h-11 items-center gap-2 rounded-lg bg-ink px-5 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-accent cursor-pointer"
                    >
                      View All Products
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-zinc-300 bg-white px-6 py-20 text-center">
                  <PackageSearchIcon size={30} className="text-zinc-400" />
                  <h2 className="font-display text-xl font-bold uppercase text-ink">
                    No products found
                  </h2>
                  <p className="max-w-sm text-sm text-zinc-500">
                    Try removing a tag or filter, or searching for a different keyword.
                  </p>
                  <button
                    type="button"
                    onClick={clearAll}
                    className="mt-1 rounded-md bg-ink px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-accent cursor-pointer"
                  >
                    Clear Filters
                  </button>
                </div>
              )
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {results.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    ctaLabel="Send Inquiry"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {filtersOpen && (
        <div
          className="fixed inset-0 z-[75] bg-ink/50 lg:hidden"
          onClick={() => setFiltersOpen(false)}
          role="presentation"
        >
          <div
            className="ml-auto flex h-full w-[86%] max-w-xs flex-col bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
              <span className="font-display text-lg font-extrabold uppercase text-ink">
                Filters
              </span>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                aria-label="Close filters"
                className="rounded-md p-2 text-zinc-500 hover:bg-surface cursor-pointer"
              >
                <XIcon size={19} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">{filterPanel}</div>
            <div className="border-t border-zinc-200 p-4">
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="h-12 w-full rounded-md bg-ink text-xs font-bold uppercase tracking-wider text-white cursor-pointer"
              >
                Show {results.length} Products
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CollapsibleFilterDropdown({
  title,
  isOpen,
  onToggle,
  activeCount = 0,
  children
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  activeCount?: number;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-zinc-200/90 bg-white p-3.5 shadow-xs transition-colors hover:border-zinc-300">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between text-left group cursor-pointer focus:outline-none"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <span className="font-display text-xs font-extrabold uppercase tracking-wider text-ink group-hover:text-accent transition-colors">
            {title}
          </span>
          {activeCount > 0 && (
            <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent px-1.5 text-[10px] font-black text-white">
              {activeCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-zinc-400 group-hover:text-accent transition-colors">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 group-hover:text-accent">
            {isOpen ? 'Close' : 'Open'}
          </span>
          <ChevronDownIcon
            size={16}
            strokeWidth={2.5}
            className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-accent' : ''}`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="mt-3 border-t border-zinc-100 pt-3">
          {children}
        </div>
      )}
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Check({
  label,
  checked,
  onChange
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-zinc-600 hover:text-ink">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-zinc-300 accent-[#ff6a00] cursor-pointer"
      />
      <span className="font-medium">{label}</span>
    </label>
  );
}
