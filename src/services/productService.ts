/**
 * Product data access layer with MongoDB Atlas synchronization and reactive hooks.
 */
import { useEffect, useState } from 'react';
import { products as defaultProducts } from '../data/products';
import { getAllCategories, getCategoryBySlug } from './categoryService';
import { getAllBrands } from './brandService';
import type { Product, ProductTag } from '../types';

/** Category slugs that map onto more than one stored category name. */
const CATEGORY_ALIASES: Record<string, string[]> = {
  'power-amplifiers': ['Amplifiers'],
  amplifiers: ['Amplifiers'],
  microphones: ['Microphones'],
  'speakers-tweeters': ['Speakers & Tweeters', 'Subwoofers'],
  'active-speakers': ['Speakers & Tweeters'],
  'passive-speakers': ['Speakers & Tweeters'],
  subwoofers: ['Subwoofers'],
  mixers: ['Mixers'],
  processors: ['Processors'],
  'lighting-sfx': ['Lighting & SFX'],
  'wires-cables': ['Wires & Cables'],
  connectors: ['Connectors'],
  'speaker-box': ['Speaker Box'],
  'spare-parts': ['Spare Parts'],
  accessories: ['Accessories'],
  'stands-mounts': ['Accessories'],
  'pro-audio-accessories': ['Accessories'],
  'dj-equipment': ['DJ Equipment']
};

const CACHE_KEY = 'jbl_live_products_cache';

// Initialize in-memory cache: check localStorage first for instant freshness, then defaultProducts
function getInitialProducts(): Product[] {
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          let hasSoundForge = false;
          const cleaned = parsed.map((p) => {
            if (p.brand === 'SoundForge') {
              hasSoundForge = true;
              return {
                ...p,
                brand: p.category === 'Microphones' ? 'SHUPU' : p.category === 'Amplifiers' || p.category === 'Mixers' ? 'EM Audio' : 'SS Audio'
              };
            }
            return p;
          });
          if (hasSoundForge) {
            localStorage.setItem(CACHE_KEY, JSON.stringify(cleaned));
          }
          return cleaned;
        }
      }
    } catch {
      // ignore
    }
  }
  return [...defaultProducts];
}

let liveProducts: Product[] = getInitialProducts();
const listeners = new Set<() => void>();

function notify() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(liveProducts));
    } catch {
      // ignore
    }
    window.dispatchEvent(new CustomEvent('jbl:products_updated'));
  }
  listeners.forEach(fn => fn());
}

export function subscribeProducts(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

// Cross-tab synchronization
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === CACHE_KEY && e.newValue) {
      try {
        const fresh = JSON.parse(e.newValue);
        if (Array.isArray(fresh) && fresh.length > 0) {
          liveProducts = fresh;
          listeners.forEach(fn => fn());
        }
      } catch {
        // ignore
      }
    }
  });

  window.addEventListener('jbl:products_updated', () => {
    listeners.forEach(fn => fn());
  });
}

// Auto-hydrate from MongoDB on client load
export async function hydrateFromBackend(): Promise<Product[]> {
  try {
    const res = await fetch('/api/products');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        liveProducts = data;
        notify();
        return data;
      }
    }
  } catch {
    // Offline fallback: keep cache/defaults
  }
  return liveProducts;
}

if (typeof window !== 'undefined') {
  hydrateFromBackend();
}

export function getAllProducts(): Product[] {
  return liveProducts;
}

export function getProductBySlug(slug: string): Product | undefined {
  return liveProducts.find((p) => p.slug === slug);
}

export async function fetchProductBySlug(slug: string): Promise<Product | undefined> {
  // First check in-memory
  const local = getProductBySlug(slug);
  try {
    const res = await fetch(`/api/products/${encodeURIComponent(slug)}`);
    if (res.ok) {
      const product = await res.json();
      if (product && product.id) {
        const idx = liveProducts.findIndex(p => p.id === product.id || p.slug === slug);
        if (idx !== -1) {
          liveProducts[idx] = product;
        } else {
          liveProducts.push(product);
        }
        notify();
        return product;
      }
    }
  } catch {
    // ignore
  }
  return local;
}

/**
 * Reactive React hook: always returns the latest product, re-rendering when admin updates data.
 */
export function useProduct(slug: string) {
  const [product, setProduct] = useState<Product | undefined>(() => getProductBySlug(slug));

  useEffect(() => {
    setProduct(getProductBySlug(slug));

    // Ensure we fetch freshest data from backend
    fetchProductBySlug(slug).then(p => {
      if (p) setProduct(p);
    });

    const unsubscribe = subscribeProducts(() => {
      setProduct(getProductBySlug(slug));
    });

    return unsubscribe;
  }, [slug]);

  return product;
}

/**
 * Reactive React hook: returns live product list, automatically re-rendering when changes occur.
 */
export function useLiveProducts(): Product[] {
  const [products, setProducts] = useState<Product[]>(() => liveProducts);

  useEffect(() => {
    setProducts([...liveProducts]);
    const unsubscribe = subscribeProducts(() => {
      setProducts([...liveProducts]);
    });
    return unsubscribe;
  }, []);

  return products;
}

export function searchProducts(query: string, limit = 8): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return liveProducts
    .filter((p) => {
      return (
        p.name.toLowerCase().includes(q) ||
        p.model.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.feature.toLowerCase().includes(q)
      );
    })
    .slice(0, limit);
}

export function getCategoryNames(): string[] {
  const fromProducts = liveProducts.map((p) => p.category);
  const fromCategories = getAllCategories().map((c) => c.name);
  return Array.from(new Set([...fromCategories, ...fromProducts])).sort();
}

export function getBrandNames(): string[] {
  const fromProducts = liveProducts.map((p) => p.brand);
  const fromBrands = getAllBrands().map((b) => b.name);
  return Array.from(new Set([...fromBrands, ...fromProducts])).filter(Boolean).sort();
}

export function getProductsByCategorySlug(slug: string, sourceList = liveProducts): Product[] {
  const names = CATEGORY_ALIASES[slug];
  if (names && names.length > 0) {
    return sourceList.filter((p) => names.includes(p.category));
  }
  const cat = getCategoryBySlug(slug);
  if (cat) {
    return sourceList.filter((p) => p.category.toLowerCase() === cat.name.toLowerCase());
  }
  return sourceList.filter((p) => p.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug);
}

export function getProductsByCategoryName(name: string, limit?: number, sourceList = liveProducts): Product[] {
  const list = sourceList.filter((p) => p.category.toLowerCase() === name.toLowerCase());
  return typeof limit === 'number' ? list.slice(0, limit) : list;
}

export function getProductsBySubcategory(subcategory: Product['subcategory'], sourceList = liveProducts): Product[] {
  return sourceList.filter((p) => p.subcategory === subcategory);
}

export function getProductsByTag(tag: string, limit?: number, sourceList = liveProducts): Product[] {
  const normTag = tag.toLowerCase().trim();
  const list = sourceList.filter((p) => {
    if (!Array.isArray(p.tags)) return false;
    return p.tags.some((t) => {
      const normT = String(t).toLowerCase().trim();
      if (normT === normTag) return true;
      if (normTag === 'new' && (normT === 'new arrival' || normT === 'new arrivals' || normT === 'new-arrival')) return true;
      if (normTag === 'sale' && (normT === 'on sale' || normT === 'discount' || normT === 'deal' || normT === 'deals')) return true;
      return false;
    });
  });
  return typeof limit === 'number' ? list.slice(0, limit) : list;
}

export function getRelatedProducts(product: Product, limit = 6): Product[] {
  return liveProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit);
}

export type SortKey = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'popular';

export interface FilterParams {
  query?: string;
  categories?: string[];
  brands?: string[];
  maxPrice?: number;
  sort?: SortKey;
}

export function filterProducts(params: FilterParams, sourceList = liveProducts): Product[] {
  const {
    query = '',
    categories = [],
    brands = [],
    maxPrice = PRICE_CEILING,
    sort = 'featured'
  } = params;

  const list = sourceList.filter((p) => {
    if (query) {
      const q = query.toLowerCase();
      const inName = p.name.toLowerCase().includes(q);
      const inModel = p.model.toLowerCase().includes(q);
      const inBrand = p.brand.toLowerCase().includes(q);
      const inCat = p.category.toLowerCase().includes(q);
      const inFeature = p.feature.toLowerCase().includes(q);
      if (!inName && !inModel && !inBrand && !inCat && !inFeature) return false;
    }

    if (categories.length > 0) {
      const normCats = categories.map((c) => c.toLowerCase().trim());
      if (!normCats.includes(p.category.toLowerCase().trim())) return false;
    }
    if (brands.length > 0) {
      const normBrands = brands.map((b) => b.toLowerCase().trim());
      if (!normBrands.includes(p.brand.toLowerCase().trim())) return false;
    }
    if (p.price > maxPrice) return false;

    return true;
  });

  switch (sort) {
    case 'price-asc':
      list.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      list.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      list.sort((a, b) => Number(b.tags.includes('new')) - Number(a.tags.includes('new')) || b.id - a.id);
      break;
    case 'popular':
      list.sort((a, b) => b.reviews - a.reviews);
      break;
    default:
      list.sort((a, b) => b.rating - a.rating);
  }
  return list;
}

export const PRICE_CEILING = 80000;

// API functions for Admin Panel
export async function fetchProductsApi(): Promise<Product[]> {
  const res = await fetch('/api/products');
  if (!res.ok) throw new Error('Failed to fetch products');
  const data = await res.json();
  liveProducts = data;
  notify();
  return data;
}

export async function createProductApi(newProduct: Partial<Product>): Promise<Product> {
  // 1. Assign local ID if not present
  const maxId = liveProducts.reduce((max, p) => (typeof p.id === 'number' && p.id > max ? p.id : max), 0);
  const assignedId = newProduct.id || (maxId + 1);
  const created: Product = {
    ...newProduct,
    id: assignedId,
    images: Array.isArray(newProduct.images) && newProduct.images.length > 0
      ? newProduct.images
      : (newProduct.image ? [newProduct.image] : ['/amplifiers1.webp']),
    image: newProduct.image || newProduct.images?.[0] || '/amplifiers1.webp'
  } as Product;

  // Optimistic update so UI reflects the new product immediately
  liveProducts.unshift(created);
  notify();

  // 2. Sync to backend API
  try {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(created)
    });
    if (res.ok) {
      const result = await res.json();
      if (result && result.product) {
        const idx = liveProducts.findIndex(p => p.id === assignedId || p.slug === created.slug);
        if (idx !== -1) {
          liveProducts[idx] = result.product;
        }
        notify();
        return result.product;
      }
    } else {
      const err = await res.json().catch(() => ({}));
      console.warn('[productService] Backend POST returned non-ok:', err);
    }
  } catch (err) {
    console.warn('[productService] Backend POST failed, kept local created product:', err);
  }

  return created;
}

export async function updateProductApi(id: number | string, updates: Partial<Product>): Promise<Product> {
  const numericId = typeof id === 'string' && !isNaN(parseInt(id, 10)) ? parseInt(id, 10) : id;

  // 1. Immediately update local in-memory cache & notify so changes appear instantly on site
  const idx = liveProducts.findIndex(p => p.id === numericId || p.id === id || (updates.slug && p.slug === updates.slug));
  let updatedProduct: Product;

  if (idx !== -1) {
    updatedProduct = {
      ...liveProducts[idx],
      ...updates,
      id: liveProducts[idx].id
    };
    liveProducts[idx] = updatedProduct;
  } else {
    updatedProduct = { ...updates, id: typeof numericId === 'number' ? numericId : Date.now() } as Product;
    liveProducts.push(updatedProduct);
  }
  notify();

  // 2. Persist update to database
  try {
    const res = await fetch(`/api/products/${numericId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (res.ok) {
      const result = await res.json();
      if (result && result.product) {
        const freshIdx = liveProducts.findIndex(p => p.id === numericId || p.id === id);
        if (freshIdx !== -1) {
          liveProducts[freshIdx] = result.product;
        }
        notify();
        return result.product;
      }
    } else {
      const err = await res.json().catch(() => ({}));
      console.warn('[productService] Backend PUT returned non-ok:', err);
    }
  } catch (err) {
    console.warn('[productService] Backend PUT failed, kept local updated product:', err);
  }

  return updatedProduct;
}

export async function deleteProductApi(id: number | string): Promise<void> {
  const numericId = typeof id === 'string' && !isNaN(parseInt(id, 10)) ? parseInt(id, 10) : id;
  liveProducts = liveProducts.filter(p => p.id !== numericId && p.id !== id);
  notify();

  try {
    const res = await fetch(`/api/products/${numericId}`, {
      method: 'DELETE'
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.warn('[productService] Backend DELETE returned non-ok:', err);
    }
  } catch (err) {
    console.warn('[productService] Backend DELETE failed, kept local removal:', err);
  }
}

export async function seedProductsApi(): Promise<void> {
  const res = await fetch('/api/products/seed', {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Failed to seed catalog');
  await fetchProductsApi();
}
