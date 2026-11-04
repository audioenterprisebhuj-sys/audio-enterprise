import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { SearchIcon, SparklesIcon, TagIcon } from 'lucide-react';
import { useLiveBrands, type Brand } from '../services/brandService';
import { useLiveProducts } from '../services/productService';
import { SITE } from '../config/site';
import { HelpCTA } from '../components/home/HelpCTA';

export function Brands() {
  const liveBrands = useLiveBrands();
  const liveProducts = useLiveProducts();
  const [searchQuery, setSearchQuery] = useState('');

  // Combined and deduplicated list of brands from DB and products
  const brandsList = useMemo(() => {
    const brandMap = new Map<string, Brand>();

    // Start with liveBrands from DB
    liveBrands.forEach((b) => {
      brandMap.set(b.name.toLowerCase(), b);
    });

    // Also include any brands found in existing products not yet explicitly in liveBrands
    liveProducts.forEach((p) => {
      const key = p.brand.toLowerCase();
      if (!brandMap.has(key)) {
        brandMap.set(key, {
          id: p.brand,
          name: p.brand,
          description: `Professional sound systems and equipment by ${p.brand}.`
        });
      }
    });

    return Array.from(brandMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [liveBrands, liveProducts]);

  // Filtered list
  const filteredBrands = useMemo(() => {
    if (!searchQuery.trim()) return brandsList;
    const q = searchQuery.toLowerCase();
    return brandsList.filter((brand) => {
      return (
        brand.name.toLowerCase().includes(q) ||
        (brand.description && brand.description.toLowerCase().includes(q))
      );
    });
  }, [brandsList, searchQuery]);

  return (
    <div className="bg-surface min-h-screen">
      {/* Brands Hero */}
      <section className="relative isolate overflow-hidden bg-ink py-14 sm:py-20 text-white">
        <div className="mx-auto w-full max-w-[1100px] px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="max-w-2xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/15 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
              <SparklesIcon size={13} />
              Audio Brands Portfolio
            </span>
            <h1 className="mt-4 font-display text-4xl font-extrabold uppercase leading-none tracking-tight sm:text-5xl text-white">
              Brands Sold by <span className="text-accent">{SITE.brandShort}</span>
            </h1>
            <p className="mt-4 text-base leading-relaxed text-zinc-300">
              A comprehensive list of official audio engineering brands, manufacturers, and sound equipment available at {SITE.brand}.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Brands List Container */}
      <div className="mx-auto w-full max-w-[1100px] px-4 py-10 sm:px-6 lg:px-8">
        {/* Search Bar & Counter */}
        <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-xl font-extrabold uppercase tracking-tight text-ink">
              Audio Brands
            </h2>
            <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-bold text-zinc-600">
              {filteredBrands.length} Total
            </span>
          </div>

          <div className="relative w-full sm:w-72">
            <SearchIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter brand names..."
              className="h-10 w-full rounded-lg border border-zinc-300 bg-white pl-9 pr-3 text-xs text-ink outline-none focus:border-accent transition-colors"
            />
          </div>
        </div>

        {/* Brand Names List */}
        <div className="mt-6 divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
          {filteredBrands.map((brand, idx) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.02 }}
              className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 sm:gap-6 p-5 sm:p-6 hover:bg-zinc-50/80 transition-colors"
            >
              <div className="sm:w-1/3 shrink-0">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <TagIcon size={14} />
                  </span>
                  <h3 className="font-display text-lg sm:text-xl font-bold uppercase tracking-tight text-ink">
                    {brand.name}
                  </h3>
                </div>
              </div>

              <div className="sm:w-2/3">
                <p className="text-sm text-zinc-600 leading-relaxed">
                  {brand.description ||
                    `Professional touring, stage, and installation sound equipment manufactured by ${brand.name}.`}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredBrands.length === 0 && (
          <div className="mt-8 rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center">
            <p className="text-sm text-zinc-500">
              No brands found matching "{searchQuery}".
            </p>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="mt-3 text-xs font-bold uppercase text-accent hover:underline cursor-pointer"
            >
              Clear filter
            </button>
          </div>
        )}
      </div>

      <HelpCTA />
    </div>
  );
}
