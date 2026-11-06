import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SearchIcon, SparklesIcon, ArrowRightIcon, LayersIcon } from 'lucide-react';
import { useLiveBrands, type Brand } from '../services/brandService';
import { useLiveProducts } from '../services/productService';
import { SITE } from '../config/site';
import { HelpCTA } from '../components/home/HelpCTA';

const BRAND_LOGO_FALLBACKS: Record<string, string> = {
  'em audio': '/brands/em-audio.webp',
  'ss audio': '/brands/ss-audio.webp',
  'shupu': '/brands/shupu.webp',
  'al electronic': '/brands/al-electronic.webp'
};

export function Brands() {
  const navigate = useNavigate();
  const liveBrands = useLiveBrands();
  const liveProducts = useLiveProducts();
  const [searchQuery, setSearchQuery] = useState('');

  // Combined and deduplicated list of brands from DB and products
  const brandsList = useMemo(() => {
    const brandMap = new Map<string, Brand>();

    // Start with liveBrands from DB
    liveBrands.forEach((b) => {
      const key = b.name.toLowerCase().trim();
      const logo = b.logo || BRAND_LOGO_FALLBACKS[key];
      brandMap.set(key, { ...b, logo });
    });

    // Also include any brands found in existing products not yet explicitly in liveBrands
    liveProducts.forEach((p) => {
      const key = p.brand.toLowerCase().trim();
      if (!brandMap.has(key)) {
        brandMap.set(key, {
          id: p.brand,
          name: p.brand,
          description: `Professional sound systems and acoustic equipment by ${p.brand}.`,
          logo: BRAND_LOGO_FALLBACKS[key]
        });
      }
    });

    return Array.from(brandMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [liveBrands, liveProducts]);

  // Filtered list
  const filteredBrands = useMemo(() => {
    if (!searchQuery.trim()) return brandsList;
    const q = searchQuery.toLowerCase().trim();
    return brandsList.filter((brand) => {
      return (
        brand.name.toLowerCase().includes(q) ||
        (brand.description && brand.description.toLowerCase().includes(q))
      );
    });
  }, [brandsList, searchQuery]);

  const handleBrandClick = (brandName: string) => {
    navigate(`/products?brand=${encodeURIComponent(brandName)}`);
  };

  return (
    <div className="bg-surface min-h-screen">
      {/* Brands Hero */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-ink via-zinc-950 to-zinc-900 py-16 sm:py-20 text-white border-b border-zinc-800">
        <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/15 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
              <SparklesIcon size={13} />
              Audio Engineering Brands
            </span>
            <h1 className="mt-4 font-display text-4xl font-extrabold uppercase leading-none tracking-tight sm:text-5xl text-white">
              Official Brands & <span className="text-accent">Partners</span>
            </h1>
            <p className="mt-4 text-base leading-relaxed text-zinc-300">
              Explore the dedicated audio engineering lines manufactured and distributed by {SITE.brand}. Click any brand below to view all tested models, specifications, and live inventory.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Brands Container */}
      <div className="mx-auto w-full max-w-[1320px] px-4 py-10 sm:px-6 lg:px-8">
        {/* Search Bar & Counter */}
        <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <h2 className="font-display text-xl font-extrabold uppercase tracking-tight text-ink">
              Audio Brands Portfolio
            </h2>
            <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-bold text-accent">
              {filteredBrands.length} Brands
            </span>
          </div>

          <div className="relative w-full sm:w-72">
            <SearchIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search brand by name..."
              className="h-10 w-full rounded-lg border border-zinc-300 bg-white pl-9 pr-3 text-xs text-ink outline-none focus:border-accent transition-colors"
            />
          </div>
        </div>

        {/* Brand Grid with High-Contrast Logos */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBrands.map((brand, idx) => {
            const productCount = liveProducts.filter(
              (p) => p.brand.toLowerCase() === brand.name.toLowerCase()
            ).length;
            const logoSrc = brand.logo || BRAND_LOGO_FALLBACKS[brand.name.toLowerCase().trim()];

            return (
              <motion.div
                key={brand.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.05 }}
                onClick={() => handleBrandClick(brand.name)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-accent hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  {/* Brand Header: Logo Box + Name */}
                  <div className="flex items-center gap-5">
                    {/* Logo Box */}
                    <div className="flex h-20 w-36 shrink-0 items-center justify-center rounded-xl border border-zinc-100 bg-zinc-50/80 p-3 shadow-inner transition-transform duration-300 group-hover:scale-105">
                      {logoSrc ? (
                        <img
                          src={logoSrc}
                          alt={brand.name}
                          className="max-h-full max-w-full object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <span className="font-display text-lg font-black tracking-tight text-ink">
                          {brand.name}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-accent">
                        Audio Engineering Line
                      </span>
                      <h3 className="font-display text-2xl font-black uppercase tracking-tight text-ink group-hover:text-accent transition-colors">
                        {brand.name}
                      </h3>
                      <div className="mt-1 flex items-center gap-2 text-xs font-semibold text-zinc-500">
                        <LayersIcon size={13} className="text-zinc-400" />
                        <span>{productCount > 0 ? `${productCount} Products` : 'Official Partner Range'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Brand Description */}
                  <p className="mt-4 text-sm leading-relaxed text-zinc-600 line-clamp-3">
                    {brand.description ||
                      `High-performance audio equipment and stage sound engineering systems developed under ${brand.name}.`}
                  </p>
                </div>

                {/* Card Action Link */}
                <div className="mt-6 flex items-center justify-between border-t border-zinc-100 pt-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-accent group-hover:text-ink transition-colors">
                    Explore {brand.name} Products
                  </span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-all">
                    <ArrowRightIcon size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </motion.div>
            );
          })}
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
