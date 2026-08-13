import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FilterIcon, PackageSearchIcon, SearchIcon, XIcon } from 'lucide-react';
import { ProductCard, ProductCardSkeleton } from '../components/product/ProductCard';
import {
  PRICE_CEILING,
  filterProducts,
  getBrandNames,
  getCategoryNames,
  getProductsByTag } from
'../services/productService';
import type { Product, ProductTag } from '../types';
import { formatPrice } from '../utils/format';
import type { SortKey } from '../services/productService';

const SORT_OPTIONS: {value: SortKey;label: string;}[] = [
{ value: 'featured', label: 'Featured' },
{ value: 'newest', label: 'Newest' },
{ value: 'price-asc', label: 'Price: Low to High' },
{ value: 'price-desc', label: 'Price: High to Low' },
{ value: 'popular', label: 'Popular' }];


const AVAILABILITY = ['In Stock', 'Limited Stock', 'Made To Order'];

export function AllProducts() {
  const [params, setParams] = useSearchParams();
  const tag = params.get('tag') as ProductTag | null;
  const initialQuery = params.get('q') ?? '';
  const initialCategory = params.get('category');

  const [query, setQuery] = useState(initialQuery);
  const [categories, setCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  const [brands, setBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(PRICE_CEILING);
  const [availability, setAvailability] = useState<string[]>([]);
  const [sort, setSort] = useState<SortKey>('featured');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setQuery(params.get('q') ?? '');
  }, [params]);

  const results: Product[] = useMemo(() => {
    const base = filterProducts({ query, categories, brands, maxPrice, availability, sort });
    if (!tag) return base;
    const tagged = new Set(getProductsByTag(tag).map((p) => p.id));
    return base.filter((p) => tagged.has(p.id));
  }, [query, categories, brands, maxPrice, availability, sort, tag]);

  useEffect(() => {
    setLoading(true);
    const timer = window.setTimeout(() => setLoading(false), 260);
    return () => window.clearTimeout(timer);
  }, [query, categories, brands, maxPrice, availability, sort, tag]);

  const toggle = (
  value: string,
  list: string[],
  setList: (next: string[]) => void) =>
  {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  const clearAll = () => {
    setQuery('');
    setCategories([]);
    setBrands([]);
    setMaxPrice(PRICE_CEILING);
    setAvailability([]);
    setSort('featured');
    setParams({});
  };

  const activeCount =
  categories.length +
  brands.length +
  availability.length + (
  maxPrice < PRICE_CEILING ? 1 : 0) + (
  query ? 1 : 0) + (
  tag ? 1 : 0);

  const heading = tag === 'new' ? 'New Arrivals' : tag === 'sale' ? 'Sale' : 'All Products';

  const filterPanel =
  <div className="space-y-6">
      <FilterGroup title="Category">
        <div className="max-h-56 space-y-1.5 overflow-y-auto pr-1 thin-scrollbar">
          {getCategoryNames().map((name) =>
        <Check
          key={name}
          label={name}
          checked={categories.includes(name)}
          onChange={() => toggle(name, categories, setCategories)} />

        )}
        </div>
      </FilterGroup>

      <FilterGroup title="Brand">
        <div className="space-y-1.5">
          {getBrandNames().map((name) =>
        <Check
          key={name}
          label={name}
          checked={brands.includes(name)}
          onChange={() => toggle(name, brands, setBrands)} />

        )}
        </div>
      </FilterGroup>

      <FilterGroup title="Max Price">
        <input
        type="range"
        min={1000}
        max={PRICE_CEILING}
        step={1000}
        value={maxPrice}
        onChange={(e) => setMaxPrice(Number(e.target.value))}
        className="w-full accent-[#ff6a00]"
        aria-label="Maximum price" />
      
        <p className="mt-1 text-xs font-semibold text-zinc-600">
          Up to {formatPrice(maxPrice)}
        </p>
      </FilterGroup>

      <FilterGroup title="Availability">
        <div className="space-y-1.5">
          {AVAILABILITY.map((name) =>
        <Check
          key={name}
          label={name}
          checked={availability.includes(name)}
          onChange={() => toggle(name, availability, setAvailability)} />

        )}
        </div>
      </FilterGroup>

      <button
      type="button"
      onClick={clearAll}
      className="w-full rounded-md border border-zinc-300 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-600 transition-colors hover:border-ink hover:text-ink">
      
        Clear Filters
      </button>
    </div>;


  return (
    <div className="bg-surface">
      <div className="mx-auto w-full max-w-[1320px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <header className="mb-6">
          <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl">
            {heading}
          </h1>
          <p className="mt-1.5 text-sm text-zinc-600">
            {results.length} product{results.length === 1 ? '' : 's'} available for inquiry
          </p>
        </header>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <SearchIcon
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search speakers, mixers, microphones..."
              className="h-12 w-full rounded-md border border-zinc-300 bg-white pl-11 pr-4 text-sm text-ink outline-none transition-colors placeholder:text-zinc-400 focus:border-accent"
              aria-label="Search products" />
            
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white px-4 text-xs font-bold uppercase tracking-wider text-ink lg:hidden">
              
              <FilterIcon size={15} />
              Filters{activeCount > 0 ? ` (${activeCount})` : ''}
            </button>
            <label className="flex h-12 items-center gap-2 rounded-md border border-zinc-300 bg-white px-3">
              <span className="hidden text-[11px] font-bold uppercase tracking-wider text-zinc-400 sm:block">
                Sort
              </span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="bg-transparent text-sm font-semibold text-ink outline-none"
                aria-label="Sort products">
                
                {SORT_OPTIONS.map((option) =>
                <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                )}
              </select>
            </label>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[248px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-xl border border-zinc-200 bg-white p-5">
              {filterPanel}
            </div>
          </aside>

          <div>
            {loading ?
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) =>
              <ProductCardSkeleton key={i} />
              )}
              </div> :
            results.length === 0 ?
            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-zinc-300 bg-white px-6 py-20 text-center">
                <PackageSearchIcon size={30} className="text-zinc-400" />
                <h2 className="font-display text-xl font-bold uppercase text-ink">
                  No products found
                </h2>
                <p className="max-w-sm text-sm text-zinc-500">
                  Try removing a filter or searching for a different keyword.
                </p>
                <button
                type="button"
                onClick={clearAll}
                className="mt-1 rounded-md bg-ink px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-accent">
                
                  Clear Filters
                </button>
              </div> :

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {results.map((product) =>
              <ProductCard
                key={product.id}
                product={product}
                ctaLabel="Send Inquiry"
                showAvailability />

              )}
              </div>
            }
          </div>
        </div>
      </div>

      {filtersOpen &&
      <div
        className="fixed inset-0 z-[75] bg-ink/50 lg:hidden"
        onClick={() => setFiltersOpen(false)}
        role="presentation">
        
          <div
          className="ml-auto flex h-full w-[86%] max-w-xs flex-col bg-white"
          onClick={(e) => e.stopPropagation()}>
          
            <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
              <span className="font-display text-lg font-extrabold uppercase text-ink">
                Filters
              </span>
              <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              aria-label="Close filters"
              className="rounded-md p-2 text-zinc-500 hover:bg-surface">
              
                <XIcon size={19} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">{filterPanel}</div>
            <div className="border-t border-zinc-200 p-4">
              <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="h-12 w-full rounded-md bg-ink text-xs font-bold uppercase tracking-wider text-white">
              
                Show {results.length} Products
              </button>
            </div>
          </div>
        </div>
      }
    </div>);

}

function FilterGroup({ title, children }: {title: string;children: React.ReactNode;}) {
  return (
    <div>
      <h3 className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
        {title}
      </h3>
      {children}
    </div>);

}

function Check({
  label,
  checked,
  onChange




}: {label: string;checked: boolean;onChange: () => void;}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-zinc-600 hover:text-ink">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-zinc-300 accent-[#ff6a00]" />
      
      <span className="font-medium">{label}</span>
    </label>);

}