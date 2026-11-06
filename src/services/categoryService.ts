/**
 * Category data access layer with MongoDB Atlas synchronization and reactive hooks.
 */
import { useEffect, useState } from 'react';
import { brands, categories as defaultCategories, showcaseCategorySlugs } from '../data/categories';
import type { Category } from '../types';

const CATEGORIES_CACHE_KEY = 'jbl_live_categories_cache';

function getInitialCategories(): Category[] {
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(CATEGORIES_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const cleaned = parsed.map((c) => ({ ...c, image: '' }));
          return cleaned;
        }
      }
    } catch {
      // ignore
    }
  }
  return [...defaultCategories];
}

let liveCategories: Category[] = getInitialCategories();
const categoryListeners = new Set<() => void>();

function notifyCategories() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(CATEGORIES_CACHE_KEY, JSON.stringify(liveCategories));
    } catch {
      // ignore
    }
    window.dispatchEvent(new CustomEvent('jbl:categories_updated'));
  }
  categoryListeners.forEach((fn) => fn());
}

export function subscribeCategories(fn: () => void) {
  categoryListeners.add(fn);
  return () => {
    categoryListeners.delete(fn);
  };
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === CATEGORIES_CACHE_KEY && e.newValue) {
      try {
        const fresh = JSON.parse(e.newValue);
        if (Array.isArray(fresh) && fresh.length > 0) {
          liveCategories = fresh;
          categoryListeners.forEach((fn) => fn());
        }
      } catch {
        // ignore
      }
    }
  });

  window.addEventListener('jbl:categories_updated', () => {
    categoryListeners.forEach((fn) => fn());
  });
}

// Auto-hydrate from backend
export async function hydrateCategoriesFromBackend(): Promise<Category[]> {
  try {
    const res = await fetch('/api/categories');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const sanitized = data.map((c) => ({ ...c, image: '' }));
        liveCategories = sanitized;
        notifyCategories();
        return sanitized;
      }
    }
  } catch {
    // offline fallback
  }
  return liveCategories;
}

if (typeof window !== 'undefined') {
  hydrateCategoriesFromBackend();
}

export function getAllCategories(): Category[] {
  return liveCategories;
}

export function useLiveCategories(): Category[] {
  const [categories, setCategories] = useState<Category[]>(() => liveCategories);

  useEffect(() => {
    setCategories([...liveCategories]);
    const unsub = subscribeCategories(() => {
      setCategories([...liveCategories]);
    });
    hydrateCategoriesFromBackend().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setCategories([...data]);
      }
    });
    return unsub;
  }, []);

  return categories;
}

export function getMegaMenuCategories(): Category[] {
  return liveCategories;
}

export function getShowcaseCategories(): Category[] {
  const base = showcaseCategorySlugs
    .map((slug) => liveCategories.find((c) => c.slug === slug))
    .filter((c): c is Category => Boolean(c));

  const extra = liveCategories.filter(
    (c) => !defaultCategories.some((d) => d.slug === c.slug) && !base.some((b) => b.slug === c.slug)
  );

  return [...base, ...extra];
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return liveCategories.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
}

export function getCategoryNamesList(): string[] {
  return Array.from(new Set(liveCategories.map((c) => c.name))).sort();
}

export function getBrands(): string[] {
  return [...brands];
}

export async function createCategoryApi(data: {
  name: string;
  slug?: string;
  description?: string;
  image?: string;
}): Promise<Category> {
  const cleanName = data.name.trim();
  const slug =
    data.slug?.trim() ||
    cleanName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  const description = data.description?.trim() || `Professional audio equipment in ${cleanName}`;
  const image = data.image?.trim() || '';

  const payload = {
    name: cleanName,
    slug,
    description,
    image
  };

  try {
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create category on server');
    }

    const resData = await res.json();
    const created: Category = resData.category || {
      id: liveCategories.length > 0 ? Math.max(...liveCategories.map((c) => Number(c.id) || 0)) + 1 : 1,
      ...payload
    };

    const exists = liveCategories.findIndex((c) => c.id === created.id || c.slug === created.slug);
    if (exists !== -1) {
      liveCategories[exists] = created;
    } else {
      liveCategories.push(created);
    }
    notifyCategories();
    return created;
  } catch {
    const localId = liveCategories.length > 0 ? Math.max(...liveCategories.map((c) => Number(c.id) || 0)) + 1 : 1;
    const localCat: Category = {
      id: localId,
      name: cleanName,
      slug,
      description,
      image
    };
    liveCategories.push(localCat);
    notifyCategories();
    return localCat;
  }
}

export async function updateCategoryApi(
  id: number | string,
  data: Partial<Category>
): Promise<Category> {
  const payload = {
    name: data.name?.trim(),
    slug: data.slug?.trim(),
    description: data.description?.trim(),
    image: data.image?.trim()
  };

  try {
    const res = await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update category on server');
    }

    const resData = await res.json();
    const updated: Category = resData.category || { id, ...payload };
    const idx = liveCategories.findIndex((c) => c.id === id);
    if (idx !== -1) {
      liveCategories[idx] = { ...liveCategories[idx], ...updated };
    }
    notifyCategories();
    return updated;
  } catch (e) {
    const idx = liveCategories.findIndex((c) => c.id === id);
    if (idx !== -1) {
      liveCategories[idx] = { ...liveCategories[idx], ...payload } as Category;
      notifyCategories();
      return liveCategories[idx];
    }
    throw e;
  }
}

export async function deleteCategoryApi(id: number | string): Promise<boolean> {
  try {
    const res = await fetch(`/api/categories/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to delete category');
    }
  } catch {
    // offline fallback
  }
  liveCategories = liveCategories.filter((c) => c.id !== id);
  notifyCategories();
  return true;
}
