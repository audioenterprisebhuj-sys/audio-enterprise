/**
 * Product data access layer.
 *
 * Every component reads products through this service, never from the mock file
 * directly. To connect a real backend later, replace the bodies of these
 * functions with `fetch('/api/products...')` calls — signatures stay the same.
 */
import { products } from '../data/products';
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

export function getAllProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getCategoryNames(): string[] {
  return Array.from(new Set(products.map((p) => p.category))).sort();
}

export function getBrandNames(): string[] {
  return Array.from(new Set(products.map((p) => p.brand))).sort();
}

export function getProductsByCategorySlug(slug: string): Product[] {
  const names = CATEGORY_ALIASES[slug];
  if (!names) return [];
  return products.filter((p) => names.includes(p.category));
}

export function getProductsByCategoryName(name: string, limit?: number): Product[] {
  const list = products.filter((p) => p.category === name);
  return typeof limit === 'number' ? list.slice(0, limit) : list;
}

export function getProductsBySubcategory(subcategory: Product['subcategory']): Product[] {
  return products.filter((p) => p.subcategory === subcategory);
}

export function getProductsByTag(tag: ProductTag, limit?: number): Product[] {
  const list = products.filter((p) => p.tags.includes(tag));
  return typeof limit === 'number' ? list.slice(0, limit) : list;
}

export function getRelatedProducts(product: Product, limit = 6): Product[] {
  return products.
  filter((p) => p.category === product.category && p.id !== product.id).
  slice(0, limit);
}

export function searchProducts(query: string, limit = 8): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return products.
  filter((p) =>
  [p.name, p.model, p.category, p.brand, p.feature].
  join(' ').
  toLowerCase().
  includes(q)
  ).
  slice(0, limit);
}

export type SortKey = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'popular';

export interface ProductFilters {
  query?: string;
  categories?: string[];
  brands?: string[];
  maxPrice?: number;
  availability?: string[];
  sort?: SortKey;
}

export function filterProducts(filters: ProductFilters): Product[] {
  const { query, categories, brands, maxPrice, availability, sort = 'featured' } = filters;
  let list = [...products];

  if (query && query.trim()) {
    const q = query.trim().toLowerCase();
    list = list.filter((p) =>
    [p.name, p.model, p.category, p.brand, p.feature].
    join(' ').
    toLowerCase().
    includes(q)
    );
  }
  if (categories && categories.length) {
    list = list.filter((p) => categories.includes(p.category));
  }
  if (brands && brands.length) {
    list = list.filter((p) => brands.includes(p.brand));
  }
  if (typeof maxPrice === 'number') {
    list = list.filter((p) => p.price <= maxPrice);
  }
  if (availability && availability.length) {
    list = list.filter((p) => availability.includes(p.availability));
  }

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