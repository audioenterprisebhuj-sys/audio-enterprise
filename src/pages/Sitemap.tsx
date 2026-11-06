import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronRightIcon,
  SearchIcon,
  MapPinIcon,
  PhoneIcon,
  FolderTreeIcon,
  PackageIcon,
  TagIcon,
  SparklesIcon,
  ShieldCheckIcon,
  ExternalLinkIcon,
  LayersIcon,
  ArrowRightIcon,
  FileCode2Icon
} from 'lucide-react';
import { WhatsAppIcon } from '../components/ui/WhatsAppIcon';
import { useLiveCategories } from '../services/categoryService';
import { useLiveBrands } from '../services/brandService';
import { useLiveProducts } from '../services/productService';
import { SITE } from '../config/site';
import { formatPrice } from '../utils/format';
import { generateGeneralInquiry } from '../utils/whatsapp';

const MAIN_PAGES = [
  {
    title: 'Home',
    path: '/',
    description: 'Hero showcases, trust highlights, top recommendations, category previews and live deals.'
  },
  {
    title: 'All Products Catalogue',
    path: '/products',
    description: 'Complete browsable audio equipment database with price, category, tag, and brand filters.'
  },
  {
    title: 'Audio Brands Portfolio',
    path: '/brands',
    description: 'Official portfolio of all audio engineering brands, manufacturers, and components.'
  },
  {
    title: 'Showroom & Branches',
    path: '/branches',
    description: 'Locations, addresses, contact details, and facilities of our Bhuj Experience Center and Mumbai Hub.'
  },
  {
    title: 'About Audio Enterprise',
    path: '/about',
    description: 'Our history, dealership accreditations, systems engineering capabilities, and company profile.'
  },
  {
    title: 'Contact Us & Showroom',
    path: '/contact',
    description: 'Direct WhatsApp inquiry forms, phone support, showroom timings, and interactive Google Map.'
  }
];

const COLLECTIONS = [
  {
    title: '⭐ New Arrivals',
    path: '/products?tag=new',
    tag: 'new',
    description: 'Latest audio hardware, newly launched active speakers, amplifiers, and microphones.'
  },
  {
    title: '🔥 Sale & Live Offers',
    path: '/products?tag=sale',
    tag: 'sale',
    description: 'Special pricing, festival deals, and limited-time discounts on professional gear.'
  },
  {
    title: '🏆 Best Sellers',
    path: '/products?tag=bestseller',
    tag: 'bestseller',
    description: 'Top-demanded equipment consistently chosen by sound rental companies and event operators.'
  },
  {
    title: '⚡ Popular Gear',
    path: '/products?tag=popular',
    tag: 'popular',
    description: 'Frequently requested workhorse gear for touring rigs and DJ sound setups.'
  },
  {
    title: '✨ Featured Hardware',
    path: '/products?tag=featured',
    tag: 'featured',
    description: 'Flagship processors, line array drivers, and high-wattage power amplifiers.'
  },
  {
    title: '🎯 Professional Grade',
    path: '/products?tag=professional',
    tag: 'professional',
    description: 'Heavy-duty touring grade sound systems and stage equipment for demanding acoustics.'
  },
  {
    title: '💡 Budget Friendly',
    path: '/products?tag=budget',
    tag: 'budget',
    description: 'Cost-effective high-value audio hardware for live sound operators, DJs, and club setups.'
  }
];

export function Sitemap() {
  const [search, setSearch] = useState('');
  const categories = useLiveCategories();
  const brands = useLiveBrands();
  const products = useLiveProducts();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const q = search.trim().toLowerCase();

  // Filtered Main Pages
  const filteredMainPages = useMemo(() => {
    if (!q) return MAIN_PAGES;
    return MAIN_PAGES.filter(
      (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }, [q]);

  // Filtered Collections
  const filteredCollections = useMemo(() => {
    if (!q) return COLLECTIONS;
    return COLLECTIONS.filter(
      (c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
    );
  }, [q]);

  // Filtered Categories
  const filteredCategories = useMemo(() => {
    if (!q) return categories;
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q))
    );
  }, [categories, q]);

  // Filtered Brands
  const filteredBrands = useMemo(() => {
    if (!q) return brands;
    return brands.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        (b.description && b.description.toLowerCase().includes(q))
    );
  }, [brands, q]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.model.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
    );
  }, [products, q]);

  const totalIndexedUrls =
    MAIN_PAGES.length + COLLECTIONS.length + categories.length + products.length;

  return (
    <div className="bg-surface min-h-screen">
      {/* Header Banner */}
      <header className="relative isolate overflow-hidden bg-ink py-12 sm:py-16 text-white">
        <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-1.5 text-xs font-semibold text-white/60">
              <li>
                <Link to="/" className="hover:text-accent transition-colors">
                  Home
                </Link>
              </li>
              <ChevronRightIcon size={13} aria-hidden="true" />
              <li className="text-white">Sitemap</li>
            </ol>
          </nav>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="max-w-2xl"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
                <FolderTreeIcon size={13} />
                Website Architecture
              </span>
              <h1 className="mt-3 font-display text-3xl font-extrabold uppercase leading-tight sm:text-5xl text-white">
                Audio Enterprise <span className="text-accent">Site Map</span>
              </h1>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-zinc-300">
                A complete navigable index of all pages, product categories, audio brands, and verified models available across our catalog.
              </p>
            </motion.div>

            {/* XML Feed Card */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-white/10 border border-white/20 px-4 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/20 hover:border-white transition-all shadow-sm"
              >
                <FileCode2Icon size={16} className="text-accent" />
                Raw sitemap.xml
                <ExternalLinkIcon size={12} className="opacity-70" />
              </a>

              <a
                href={generateGeneralInquiry()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#25D366] px-5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#1faa54] transition-all shadow-sm"
              >
                <WhatsAppIcon size={16} />
                Quick Assistance
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="mx-auto w-full max-w-[1320px] px-4 py-8 sm:px-6 lg:px-8 sm:py-12">
        {/* Search & Quick Stats */}
        <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 font-bold text-accent">
              <LayersIcon size={18} />
            </span>
            <div>
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-ink">
                Directory Overview
              </h2>
              <p className="text-xs text-zinc-500">
                {totalIndexedUrls} Total Catalog Entries indexed
              </p>
            </div>
          </div>

          <div className="relative w-full sm:w-80">
            <SearchIcon
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter sitemap links & products..."
              className="h-10 w-full rounded-lg border border-zinc-300 bg-white pl-9 pr-3 text-xs text-ink outline-none focus:border-accent transition-colors"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400 hover:text-ink cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="space-y-12">
          {/* Section 1: Main Pages */}
          <section aria-labelledby="main-pages-heading">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3 mb-5">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/10 text-accent font-bold text-xs">
                  01
                </span>
                <h2
                  id="main-pages-heading"
                  className="font-display text-xl font-extrabold uppercase tracking-tight text-ink"
                >
                  Primary Website Pages
                </h2>
              </div>
              <span className="text-xs font-bold text-zinc-400">
                {filteredMainPages.length} links
              </span>
            </div>

            <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredMainPages.map((page) => (
                <Link
                  key={page.path}
                  to={page.path}
                  className="group rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:shadow-card flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-base font-bold uppercase text-ink group-hover:text-accent transition-colors">
                        {page.title}
                      </h3>
                      <ArrowRightIcon
                        size={15}
                        className="text-zinc-400 transition-transform group-hover:translate-x-1 group-hover:text-accent"
                      />
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">
                      {page.description}
                    </p>
                  </div>
                  <span className="mt-3 text-[11px] font-mono text-zinc-400 group-hover:text-accent">
                    {page.path}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* Section 2: Product Collections & Tags */}
          <section aria-labelledby="collections-heading">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3 mb-5">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/10 text-accent font-bold text-xs">
                  02
                </span>
                <h2
                  id="collections-heading"
                  className="font-display text-xl font-extrabold uppercase tracking-tight text-ink"
                >
                  Curated Collections &amp; Tags
                </h2>
              </div>
              <span className="text-xs font-bold text-zinc-400">
                {filteredCollections.length} collections
              </span>
            </div>

            <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredCollections.map((col) => (
                <Link
                  key={col.path}
                  to={col.path}
                  className="group rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:shadow-card flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-sm sm:text-base font-bold uppercase text-ink group-hover:text-accent transition-colors">
                        {col.title}
                      </h3>
                      <TagIcon size={14} className="text-zinc-400 group-hover:text-accent" />
                    </div>
                    <p className="mt-1.5 text-xs text-zinc-500 leading-relaxed">
                      {col.description}
                    </p>
                  </div>
                  <span className="mt-3 text-[11px] font-mono text-zinc-400 group-hover:text-accent truncate">
                    {col.path}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* Section 3: Product Categories Directory */}
          <section aria-labelledby="categories-heading">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3 mb-5">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/10 text-accent font-bold text-xs">
                  03
                </span>
                <h2
                  id="categories-heading"
                  className="font-display text-xl font-extrabold uppercase tracking-tight text-ink"
                >
                  Product Categories ({categories.length} Families)
                </h2>
              </div>
              <span className="text-xs font-bold text-zinc-400">
                {filteredCategories.length} categories
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredCategories.map((cat) => {
                const catProductsCount = products.filter(
                  (p) => p.category.toLowerCase() === cat.name.toLowerCase()
                ).length;

                return (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.slug}`}
                    className="group flex items-start gap-3 rounded-xl border border-zinc-200 bg-white p-3.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:shadow-card"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 font-display text-sm font-black text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                      {cat.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="font-display text-sm font-bold uppercase text-ink truncate group-hover:text-accent transition-colors">
                          {cat.name}
                        </h3>
                        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-600 shrink-0">
                          {catProductsCount}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-[11px] text-zinc-500 leading-normal">
                        {cat.description || `Explore ${cat.name} sound equipment.`}
                      </p>
                      <span className="mt-1.5 block font-mono text-[10px] text-zinc-400 truncate">
                        /category/{cat.slug}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Section 4: Audio Brands */}
          <section aria-labelledby="brands-heading">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3 mb-5">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/10 text-accent font-bold text-xs">
                  04
                </span>
                <h2
                  id="brands-heading"
                  className="font-display text-xl font-extrabold uppercase tracking-tight text-ink"
                >
                  Featured Audio Brands
                </h2>
              </div>
              <span className="text-xs font-bold text-zinc-400">
                {filteredBrands.length} brands
              </span>
            </div>

            <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredBrands.map((brand) => {
                const brandProductsCount = products.filter(
                  (p) => p.brand.toLowerCase() === brand.name.toLowerCase()
                ).length;

                return (
                  <div
                    key={brand.id}
                    className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="font-display text-base font-bold uppercase text-ink">
                          {brand.name}
                        </h3>
                        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-600">
                          {brandProductsCount} products
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs text-zinc-500 line-clamp-2">
                        {brand.description || `Audio systems and electronics by ${brand.name}`}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-zinc-100 flex items-center justify-between">
                      <Link
                        to="/brands"
                        className="text-xs font-bold text-accent hover:underline cursor-pointer"
                      >
                        Brand Profile →
                      </Link>
                      <Link
                        to={`/products?brand=${encodeURIComponent(brand.name)}`}
                        className="text-[11px] font-semibold text-zinc-500 hover:text-ink cursor-pointer"
                      >
                        View Gear ({brandProductsCount})
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Section 5: Direct Product Index */}
          <section aria-labelledby="products-index-heading">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3 mb-5">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/10 text-accent font-bold text-xs">
                  05
                </span>
                <h2
                  id="products-index-heading"
                  className="font-display text-xl font-extrabold uppercase tracking-tight text-ink"
                >
                  Direct Product Catalog Index
                </h2>
              </div>
              <span className="text-xs font-bold text-zinc-400">
                {filteredProducts.length} models
              </span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="p-8 text-center text-sm text-zinc-500 rounded-xl border border-dashed border-zinc-300 bg-white">
                No products match "{search}".
              </div>
            ) : (
              <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((p) => (
                  <Link
                    key={p.id}
                    to={`/product/${p.slug}`}
                    className="group flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-2.5 shadow-sm hover:border-accent hover:shadow-card transition-all"
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-11 w-11 shrink-0 rounded-md border border-zinc-200 bg-zinc-50 object-contain p-1"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/amplifiers1.webp';
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-accent truncate">
                          {p.model}
                        </span>
                        <span className="text-[10px] text-zinc-400">#{p.id}</span>
                      </div>
                      <h4
                        className="text-xs font-bold text-ink truncate group-hover:text-accent transition-colors"
                        title={p.name}
                      >
                        {p.name}
                      </h4>
                      <div className="flex items-center justify-between text-[11px] text-zinc-500 mt-0.5">
                        <span className="truncate">{p.category}</span>
                        <span className="font-extrabold text-ink">{formatPrice(p.price)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Section 6: Customer Care & Branches */}
          <section aria-labelledby="support-heading">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3 mb-5">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/10 text-accent font-bold text-xs">
                  06
                </span>
                <h2
                  id="support-heading"
                  className="font-display text-xl font-extrabold uppercase tracking-tight text-ink"
                >
                  Customer Service, Branches &amp; Technical Support
                </h2>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <MapPinIcon size={16} className="text-accent" />
                  <h3 className="font-display text-base font-bold uppercase text-ink">
                    Showroom &amp; Warehouses
                  </h3>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-zinc-600">
                  {SITE.address}
                </p>
                <div className="mt-3 flex gap-2">
                  <Link
                    to="/branches"
                    className="text-xs font-bold text-accent hover:underline"
                  >
                    View All Branches →
                  </Link>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <PhoneIcon size={16} className="text-accent" />
                  <h3 className="font-display text-base font-bold uppercase text-ink">
                    Direct Phone Support
                  </h3>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-zinc-600">
                  Call our technical sound engineers for pricing, dispatch tracking, and system setups.
                </p>
                <div className="mt-3">
                  <a
                    href={SITE.phoneHref}
                    className="text-xs font-bold text-accent hover:underline"
                  >
                    {SITE.phone}
                  </a>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-2">
                  <WhatsAppIcon size={16} />
                  <h3 className="font-display text-base font-bold uppercase text-ink">
                    Instant WhatsApp Quotes
                  </h3>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-zinc-600">
                  Get real-time catalog quotations and warehouse product updates sent directly to WhatsApp.
                </p>
                <div className="mt-3">
                  <a
                    href={generateGeneralInquiry()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-[#25D366] hover:underline"
                  >
                    Open WhatsApp Chat →
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
