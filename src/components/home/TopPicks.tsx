import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
import { useLiveProducts } from '../../services/productService';
import type { Product } from '../../types';
import { ProductCard } from '../product/ProductCard';
import { SectionHeading } from '../ui/SectionHeading';

interface TopPicksProps {
  maxProducts?: number;
  productIds?: number[];
  title?: string;
  eyebrow?: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
}

export function TopPicks({
  maxProducts = 5,
  productIds,
  title = 'Top Picks For You',
  eyebrow = 'Curated Selection',
  subtitle = 'Handpicked gear our engineers recommend most often across all audio categories.',
  viewAllHref = '/products',
  viewAllLabel = 'View All Top Picks'
}: TopPicksProps) {
  const liveProducts = useLiveProducts();

  const products: Product[] = useMemo(() => {
    if (productIds && productIds.length > 0) {
      const selected = productIds
        .map((id) => liveProducts.find((p) => p.id === id))
        .filter(Boolean) as Product[];
      return selected.slice(0, maxProducts);
    }
    return [];
  }, [productIds, liveProducts, maxProducts]);

  // If no products are selected in the database, do not render phantom products
  if (products.length === 0) {
    return null;
  }

  const gridColsClass =
    products.length <= 3
      ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
      : products.length === 4
      ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
      : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';

  return (
    <section id="top-picks" aria-labelledby="top-picks-heading" className="bg-white py-12 sm:py-16">
      <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div id="top-picks-heading">
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            subtitle={subtitle}
            viewAllHref={viewAllHref}
            viewAllLabel={viewAllLabel}
          />
        </div>

        <div className={`grid ${gridColsClass} gap-4 sm:gap-6 mt-4 sm:mt-6`}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Prominent View More Button */}
        {viewAllHref && products.length > 0 && (
          <div className="mt-8 flex justify-center">
            <Link
              to={viewAllHref}
              className="group inline-flex items-center gap-2 rounded-lg bg-ink px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition-all duration-200 cursor-pointer shadow-sm hover:bg-accent hover:shadow-md"
            >
              <span>{viewAllLabel || 'View All Top Picks'}</span>
              <ArrowRightIcon
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
