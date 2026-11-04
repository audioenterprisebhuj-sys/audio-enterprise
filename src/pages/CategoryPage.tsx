import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRightIcon, ChevronRightIcon, ClockIcon, PackageSearchIcon, SparklesIcon } from 'lucide-react';
import { ProductCard } from '../components/product/ProductCard';
import { WhatsAppIcon } from '../components/ui/WhatsAppIcon';
import { getCategoryBySlug } from '../services/categoryService';
import { getProductsByCategorySlug, useLiveProducts } from '../services/productService';
import { generateCategoryInquiry } from '../utils/whatsapp';

export function CategoryPage() {
  const { slug = '' } = useParams();
  const _live = useLiveProducts();
  const category = getCategoryBySlug(slug);
  const products = getProductsByCategorySlug(slug);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [slug]);

  if (!category) {
    return (
      <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-4 px-4 py-28 text-center">
        <PackageSearchIcon size={34} className="text-zinc-400" />
        <h1 className="font-display text-3xl font-extrabold uppercase text-ink">
          Category not found
        </h1>
        <Link
          to="/products"
          className="rounded-md bg-ink px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-accent"
        >
          Browse All Products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-surface">
      <header className="relative isolate overflow-hidden bg-ink">
        <img
          src={category.image || '/amplifiers1.webp'}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-25"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/amplifiers1.webp';
          }}
        />
        
        <div className="relative mx-auto w-full max-w-[1320px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-1.5 text-xs font-semibold text-white/60">
              <li>
                <Link to="/" className="hover:text-accent">
                  Home
                </Link>
              </li>
              <ChevronRightIcon size={13} aria-hidden="true" />
              <li className="text-white">{category.name}</li>
            </ol>
          </nav>
          <h1 className="font-display text-4xl font-extrabold uppercase leading-none tracking-tight text-white sm:text-5xl">
            {category.name}
          </h1>
          <p className="mt-3 max-w-xl text-[15px] text-white/65">{category.description}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <a
              href={generateCategoryInquiry(category.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-md bg-[#25D366] px-5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#1faa54]"
            >
              <WhatsAppIcon size={16} />
              Inquire About {category.name}
            </a>
            {products.length === 0 ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-300">
                <SparklesIcon size={13} className="text-amber-400" />
                Coming Soon!!
              </span>
            ) : (
              <span className="text-xs font-semibold uppercase tracking-wider text-white/50">
                {products.length} products
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1320px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        {products.length === 0 ? (
          <div className="mx-auto flex max-w-2xl flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-white p-8 sm:p-14 text-center shadow-card">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-accent mb-4 ring-8 ring-amber-50/60">
              <SparklesIcon size={32} className="text-accent animate-pulse" />
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-accent mb-3">
              <ClockIcon size={13} />
              Inventory Update In Progress
            </span>

            <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-ink">
              Coming soon!!
            </h2>

            <p className="mt-3 max-w-lg text-sm sm:text-base leading-relaxed text-zinc-600">
              We are currently testing and curating premium <strong>{category.name}</strong> for our verified catalog. High-performance models and fresh stock are arriving very soon!
            </p>

            <div className="mt-4 rounded-xl border border-zinc-100 bg-zinc-50 p-4 text-xs sm:text-sm text-zinc-600 max-w-md">
              <p className="font-semibold text-ink">Need equipment in this category right away?</p>
              <p className="mt-1 text-zinc-500">
                Our audio engineering team can arrange direct warehouse sourcing, bulk supplies, or custom installations upon request.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href={generateCategoryInquiry(category.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#25D366] px-5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-[#1faa54]"
              >
                <WhatsAppIcon size={16} />
                Ask Us on WhatsApp
              </a>
              <Link
                to="/products"
                className="inline-flex h-11 items-center gap-2 rounded-lg border border-zinc-300 bg-white px-5 text-xs font-bold uppercase tracking-wider text-ink transition-all hover:border-accent hover:text-accent"
              >
                Browse Other Products
                <ArrowRightIcon size={14} />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                ctaLabel="Send Inquiry"
                showAvailability
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
