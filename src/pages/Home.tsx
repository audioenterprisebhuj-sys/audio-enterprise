import React from 'react';
import { CategoryShowcase } from '../components/home/CategoryShowcase';
import { HelpCTA } from '../components/home/HelpCTA';
import { HeroCarousel } from '../components/home/HeroCarousel';
import { TopPicks } from '../components/home/TopPicks';
import { TrustBar } from '../components/home/TrustBar';
import { WhyChooseUs } from '../components/home/WhyChooseUs';
import { ContactSection } from '../components/contact/ContactSection';
import { CategorySection } from '../components/sections/CategorySection';
import { WhatsAppIcon } from '../components/ui/WhatsAppIcon';
import {
  getProductsByCategoryName,
  getProductsByCategorySlug,
  getProductsByTag,
  useLiveProducts
} from '../services/productService';
import { useLiveHomeSections } from '../services/homeSectionService';
import { generateCategoryInquiry } from '../utils/whatsapp';
import type { Product, ProductTag } from '../types';

export function Home() {
  const liveProducts = useLiveProducts();
  const homeSections = useLiveHomeSections();

  // Helper to resolve products for a given section strictly from database selection
  const getSectionProducts = (section: (typeof homeSections)[0]): Product[] => {
    const limit = section.maxProducts || 5;

    // 1. If product IDs are explicitly managed in database, use them
    if (Array.isArray(section.productIds)) {
      if (section.productIds.length === 0) {
        return [];
      }
      const selected = section.productIds
        .map((id) => liveProducts.find((p) => p.id === id))
        .filter(Boolean) as Product[];
      return selected.slice(0, limit);
    }

    // 2. Otherwise auto-select products from database based on section type
    if (section.type === 'tag') {
      return getProductsByTag((section.filterValue || 'sale') as ProductTag, limit, liveProducts);
    }

    if (section.type === 'category') {
      const catVal = section.filterValue || section.title;
      const byName = getProductsByCategoryName(catVal, limit, liveProducts);
      if (byName.length > 0) return byName;
      // try slug fallback
      const slug = catVal.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return getProductsByCategorySlug(slug, liveProducts).slice(0, limit);
    }

    // Default fallback
    return liveProducts.slice(0, limit);
  };

  const enabledSections = [...homeSections]
    .filter((s) => s.enabled !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const hasTopPicks = enabledSections.some((s) => s.id === 'top-picks' || s.type === 'top-picks');

  return (
    <>
      <HeroCarousel />
      <TrustBar />

      {enabledSections.map((section, idx) => {
        // If this is the Top Picks section
        if (section.id === 'top-picks' || section.type === 'top-picks') {
          return (
            <React.Fragment key={section.id}>
              <TopPicks
                maxProducts={section.maxProducts || 5}
                productIds={section.productIds}
                title={section.title}
                eyebrow={section.eyebrow}
                subtitle={section.subtitle}
                viewAllHref={section.viewAllHref}
                viewAllLabel={section.viewAllLabel}
              />
              <CategoryShowcase />
            </React.Fragment>
          );
        }

        const products = getSectionProducts(section);
        if (products.length === 0) return null;

        // Special custom footer for spare-parts section
        const customFooter =
          section.id === 'spare-parts' ? (
            <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-zinc-200 bg-white p-6 sm:flex-row sm:items-center">
              <div>
                <h3 className="font-display text-xl font-extrabold uppercase tracking-tight text-ink">
                  Need Help Finding a Part?
                </h3>
                <p className="mt-1 text-sm text-zinc-500">
                  Send us the model number or a photo — we will identify the right component.
                </p>
              </div>
              <a
                href={generateCategoryInquiry('spare parts')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 shrink-0 items-center gap-2 rounded-md bg-[#25D366] px-6 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#1faa54] shadow-sm cursor-pointer"
              >
                <WhatsAppIcon size={18} />
                Talk to Expert on WhatsApp
              </a>
            </div>
          ) : undefined;

        // Background alternating class
        const bgClass = section.dark
          ? 'bg-ink'
          : idx % 2 === 0
          ? 'bg-surface'
          : 'bg-white';

        return (
          <React.Fragment key={section.id}>
            <CategorySection
              id={section.id}
              eyebrow={section.eyebrow || 'Category'}
              title={section.title}
              subtitle={section.subtitle}
              products={products}
              variant={section.variant || 'default'}
              specKeys={section.specKeys}
              viewAllHref={section.viewAllHref}
              viewAllLabel={section.viewAllLabel}
              dark={Boolean(section.dark)}
              className={bgClass}
              footer={customFooter}
            />
            {/* If CategoryShowcase wasn't rendered by top-picks */}
            {!hasTopPicks && idx === 1 && <CategoryShowcase />}
          </React.Fragment>
        );
      })}

      <WhyChooseUs />
      <HelpCTA />
      <ContactSection />
    </>
  );
}
