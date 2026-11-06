import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, ClockIcon, PackageSearchIcon, SparklesIcon } from 'lucide-react';
import type { Product } from '../../types';
import { ProductCard } from '../product/ProductCard';
import { SectionHeading } from '../ui/SectionHeading';
import { WhatsAppIcon } from '../ui/WhatsAppIcon';
import { generateCategoryInquiry } from '../../utils/whatsapp';

interface CategorySectionProps {
  id: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  products: Product[];
  layout?: 'rail' | 'grid';
  variant?: 'default' | 'spec';
  specKeys?: string[];
  ctaLabel?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  dark?: boolean;
  chips?: string[];
  footer?: React.ReactNode;
  className?: string;
}

export function CategorySection({
  id,
  eyebrow,
  title,
  subtitle,
  products,
  variant = 'default',
  specKeys,
  ctaLabel,
  viewAllHref,
  viewAllLabel,
  dark = false,
  chips,
  footer,
  className = ''
}: CategorySectionProps) {
  // Use responsive grid columns: 4 cols if 4 products, 5 cols if 5 products, etc.
  const gridColsClass =
    products.length <= 3
      ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
      : products.length === 4
      ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
      : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';

  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`${dark ? 'bg-ink' : ''} py-12 sm:py-16 ${className}`}
    >
      <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div id={`${id}-heading`}>
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            subtitle={subtitle}
            viewAllHref={viewAllHref}
            viewAllLabel={viewAllLabel}
            dark={dark}
          />
        </div>

        {chips && chips.length > 0 && (
          <ul className="no-scrollbar -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
            {chips.map((chip) => (
              <li key={chip}>
                <span
                  className={`inline-block whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-semibold ${
                    dark
                      ? 'border-white/15 bg-white/5 text-white/75'
                      : 'border-zinc-200 bg-white text-zinc-600'
                  }`}
                >
                  {chip}
                </span>
              </li>
            ))}
          </ul>
        )}

        {products.length === 0 ? (
          <div
            className={`flex flex-col items-center justify-center rounded-2xl border p-8 sm:p-12 text-center shadow-sm ${
              dark
                ? 'border-white/15 bg-white/5 text-white/80'
                : 'border-zinc-200 bg-white text-zinc-600 shadow-card'
            }`}
          >
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl mb-3 ring-8 ${
              dark ? 'bg-white/10 text-accent ring-white/5' : 'bg-amber-50 text-accent ring-amber-50/60'
            }`}>
              <SparklesIcon size={28} className="animate-pulse" />
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-accent mb-2">
              <ClockIcon size={12} />
              New Additions Arriving Soon
            </span>

            <h3 className={`font-display text-2xl font-extrabold uppercase tracking-tight ${dark ? 'text-white' : 'text-ink'}`}>
              Coming soon!!
            </h3>

            <p className="mt-2 max-w-md text-xs sm:text-sm leading-relaxed text-zinc-500">
              We are currently testing and adding premium models for <strong>{title}</strong>. Fresh verified inventory will be live in our catalog shortly!
            </p>

            <p className="mt-1 max-w-sm text-xs text-zinc-400">
              Need items in this category immediately? Message our sound technicians on WhatsApp for direct warehouse sourcing.
            </p>

            <a
              href={generateCategoryInquiry(title)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-[#25D366] px-5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#1faa54] transition-colors shadow-sm"
            >
              <WhatsAppIcon size={15} />
              Inquire About {title}
            </a>
          </div>
        ) : (
          <div className={`grid ${gridColsClass} gap-4 sm:gap-6`}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                variant={variant}
                specKeys={specKeys}
                ctaLabel={ctaLabel}
              />
            ))}
          </div>
        )}

        {/* View More / View All Button */}
        {viewAllHref && products.length > 0 && (
          <div className="mt-8 flex justify-center">
            <Link
              to={viewAllHref}
              className={`group inline-flex items-center gap-2 rounded-lg px-7 py-3.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md ${
                dark
                  ? 'bg-accent text-white hover:bg-white hover:text-ink'
                  : 'bg-ink text-white hover:bg-accent'
              }`}
            >
              <span>{viewAllLabel || `View More ${title}`}</span>
              <ArrowRightIcon
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        )}

        {footer && <div className="mt-8">{footer}</div>}
      </div>
    </section>
  );
}
