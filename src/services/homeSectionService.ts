import { useEffect, useState } from 'react';
import type { HomeSection } from '../types';
import defaultSections from '../data/defaultHomeSections.json';
import { getAllProducts } from './productService';

const CACHE_KEY = 'ae_homepage_sections_cache_v2';

function sanitizeSections(sections: HomeSection[]): HomeSection[] {
  try {
    const prods = getAllProducts();
    if (Array.isArray(prods) && prods.length > 0) {
      const prodIds = new Set(prods.map((p) => p.id));
      return sections.map((s) => ({
        ...s,
        productIds: Array.isArray(s.productIds)
          ? s.productIds.filter((id) => prodIds.has(id))
          : []
      }));
    }
  } catch {
    // ignore
  }
  return sections;
}

function getInitialSections(): HomeSection[] {
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return sanitizeSections(parsed);
        }
      }
    } catch {
      // ignore
    }
  }
  return sanitizeSections(defaultSections as HomeSection[]);
}

let liveSections: HomeSection[] = getInitialSections();
const listeners = new Set<() => void>();

function notify() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(liveSections));
    } catch {
      // ignore
    }
    window.dispatchEvent(new CustomEvent('ae:sections_updated'));
  }
  listeners.forEach((fn) => fn());
}

export function subscribeHomeSections(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === CACHE_KEY && e.newValue) {
      try {
        const fresh = JSON.parse(e.newValue);
        if (Array.isArray(fresh) && fresh.length > 0) {
          liveSections = fresh;
          listeners.forEach((fn) => fn());
        }
      } catch {
        // ignore
      }
    }
  });

  window.addEventListener('ae:sections_updated', () => {
    listeners.forEach((fn) => fn());
  });
}

export async function hydrateHomeSectionsFromBackend(): Promise<HomeSection[]> {
  try {
    const res = await fetch('/api/homepage-sections');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        liveSections = sanitizeSections(data);
        notify();
        return liveSections;
      }
    }
  } catch {
    // Offline fallback
  }
  return liveSections;
}

if (typeof window !== 'undefined') {
  hydrateHomeSectionsFromBackend();
}

export function getAllHomeSections(): HomeSection[] {
  return liveSections;
}

export function getHomeSectionById(id: string): HomeSection | undefined {
  return liveSections.find((s) => s.id === id);
}

export function useLiveHomeSections(): HomeSection[] {
  const [sections, setSections] = useState<HomeSection[]>(() => liveSections);

  useEffect(() => {
    setSections([...liveSections]);
    const unsub = subscribeHomeSections(() => {
      setSections([...liveSections]);
    });
    hydrateHomeSectionsFromBackend().then((data) => {
      setSections([...data]);
    });
    return unsub;
  }, []);

  return sections;
}

export async function saveAllHomeSectionsApi(sections: HomeSection[]): Promise<HomeSection[]> {
  liveSections = sections;
  notify();

  try {
    const res = await fetch('/api/homepage-sections', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sections })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.sections && Array.isArray(data.sections)) {
        liveSections = data.sections;
        notify();
        return data.sections;
      }
    } else {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to save homepage sections to database');
    }
  } catch (err: unknown) {
    console.warn('[HomeSectionService] Backend sync error:', err);
    throw err;
  }
  return liveSections;
}

export async function resetHomeSectionsApi(): Promise<HomeSection[]> {
  try {
    const res = await fetch('/api/homepage-sections/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (res.ok) {
      const data = await res.json();
      if (data.sections && Array.isArray(data.sections)) {
        liveSections = data.sections;
        notify();
        return data.sections;
      }
    }
  } catch (err) {
    console.warn('[HomeSectionService] Reset error:', err);
  }
  liveSections = defaultSections as HomeSection[];
  notify();
  return liveSections;
}
