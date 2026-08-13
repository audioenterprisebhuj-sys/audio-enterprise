import React from 'react';
import { PackageSearchIcon } from 'lucide-react';
import type { Product } from '../../types';
import { ProductCard } from '../product/ProductCard';
import { ProductRail } from '../product/ProductRail';
import { SectionHeading } from '../ui/SectionHeading';

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
  showAvailability?: boolean;
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
  layout = 'rail',
  variant = 'default',
  specKeys,
  ctaLabel,
  showAvailability,
  viewAllHref,
  viewAllLabel,
  dark = false,
  chips,
  footer,
  className = ''
}: CategorySectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`${dark ? 'bg-ink' : ''} py-12 sm:py-16 ${className}`}>
      
      <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div id={`${id}-heading`}>
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            subtitle={subtitle}
            viewAllHref={viewAllHref}
            viewAllLabel={viewAllLabel}
            dark={dark} />
          
        </div>

        {chips && chips.length > 0 &&
        <ul className="no-scrollbar -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
            {chips.map((chip) =>
          <li key={chip}>
                <span
              className={`inline-block whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-semibold ${
              dark ?
              'border-white/15 bg-white/5 text-white/75' :
              'border-zinc-200 bg-white text-zinc-600'}`
              }>
              
                  {chip}
                </span>
              </li>
          )}
          </ul>
        }

        {products.length === 0 ?
        <div
          className={`flex flex-col items-center gap-2 rounded-xl border border-dashed px-6 py-14 text-center ${
          dark ? 'border-white/15 text-white/60' : 'border-zinc-300 text-zinc-500'}`
          }>
          
            <PackageSearchIcon size={26} />
            <p className="text-sm font-medium">No products listed here yet.</p>
          </div> :
        layout === 'rail' ?
        <ProductRail ariaLabel={title} dark={dark}>
            {products.map((product) =>
          <ProductCard
            key={product.id}
            product={product}
            variant={variant}
            specKeys={specKeys}
            ctaLabel={ctaLabel}
            showAvailability={showAvailability} />

          )}
          </ProductRail> :

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {products.map((product) =>
          <ProductCard
            key={product.id}
            product={product}
            variant={variant}
            specKeys={specKeys}
            ctaLabel={ctaLabel}
            showAvailability={showAvailability} />

          )}
          </div>
        }

        {footer && <div className="mt-8">{footer}</div>}
      </div>
    </section>);

}