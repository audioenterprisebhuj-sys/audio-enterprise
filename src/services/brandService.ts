import { useEffect, useState } from 'react';
import defaultBrands from '../data/defaultBrands.json';

export interface Brand {
  id: number | string;
  name: string;
  description?: string;
  logo?: string;
}

const BRANDS_CACHE_KEY = 'ae_live_brands_cache';

function getInitialBrands(): Brand[] {
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(BRANDS_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
  }
  return defaultBrands as Brand[];
}

let liveBrands: Brand[] = getInitialBrands();
const brandListeners = new Set<() => void>();

function notifyBrands() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(BRANDS_CACHE_KEY, JSON.stringify(liveBrands));
    } catch {
      // ignore
    }
    window.dispatchEvent(new CustomEvent('ae:brands_updated'));
  }
  brandListeners.forEach((fn) => fn());
}

export function subscribeBrands(fn: () => void) {
  brandListeners.add(fn);
  return () => {
    brandListeners.delete(fn);
  };
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === BRANDS_CACHE_KEY && e.newValue) {
      try {
        const fresh = JSON.parse(e.newValue);
        if (Array.isArray(fresh) && fresh.length > 0) {
          liveBrands = fresh;
          brandListeners.forEach((fn) => fn());
        }
      } catch {
        // ignore
      }
    }
  });

  window.addEventListener('ae:brands_updated', () => {
    brandListeners.forEach((fn) => fn());
  });
}

export async function hydrateBrandsFromBackend(): Promise<Brand[]> {
  try {
    const res = await fetch('/api/brands');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        liveBrands = data;
        notifyBrands();
        return data;
      }
    }
  } catch {
    // offline fallback
  }
  return liveBrands;
}

if (typeof window !== 'undefined') {
  hydrateBrandsFromBackend();
}

export function getAllBrands(): Brand[] {
  return liveBrands;
}

export function getBrandNamesList(): string[] {
  return liveBrands.map((b) => b.name).sort();
}

export function useLiveBrands(): Brand[] {
  const [brands, setBrands] = useState<Brand[]>(() => liveBrands);

  useEffect(() => {
    setBrands([...liveBrands]);
    const unsub = subscribeBrands(() => {
      setBrands([...liveBrands]);
    });
    hydrateBrandsFromBackend().then((data) => {
      setBrands([...data]);
    });
    return unsub;
  }, []);

  return brands;
}

export async function createBrandApi(data: { name: string; description?: string }): Promise<Brand> {
  const name = data.name.trim();
  const description = data.description?.trim() || `Professional audio gear by ${name}`;

  try {
    const res = await fetch('/api/brands', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create brand');
    }

    const resData = await res.json();
    const created: Brand = resData.brand || {
      id: liveBrands.length > 0 ? Math.max(...liveBrands.map((b) => Number(b.id) || 0)) + 1 : 1,
      name,
      description
    };

    liveBrands.push(created);
    notifyBrands();
    return created;
  } catch {
    const localBrand: Brand = {
      id: liveBrands.length > 0 ? Math.max(...liveBrands.map((b) => Number(b.id) || 0)) + 1 : 1,
      name,
      description
    };
    liveBrands.push(localBrand);
    notifyBrands();
    return localBrand;
  }
}

export async function updateBrandApi(
  id: number | string,
  data: { name: string; description?: string }
): Promise<Brand> {
  const name = data.name.trim();
  const description = data.description?.trim();

  try {
    const res = await fetch(`/api/brands/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update brand');
    }

    const resData = await res.json();
    const updated: Brand = resData.brand || { id, name, description };
    const idx = liveBrands.findIndex((b) => b.id === id);
    if (idx !== -1) {
      liveBrands[idx] = { ...liveBrands[idx], ...updated };
    }
    notifyBrands();
    return updated;
  } catch (e) {
    const idx = liveBrands.findIndex((b) => b.id === id);
    if (idx !== -1) {
      liveBrands[idx] = { ...liveBrands[idx], name, description: description || liveBrands[idx].description };
      notifyBrands();
      return liveBrands[idx];
    }
    throw e;
  }
}

export async function deleteBrandApi(id: number | string): Promise<boolean> {
  try {
    const res = await fetch(`/api/brands/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to delete brand');
    }
  } catch {
    // offline fallback
  }
  liveBrands = liveBrands.filter((b) => b.id !== id);
  notifyBrands();
  return true;
}
