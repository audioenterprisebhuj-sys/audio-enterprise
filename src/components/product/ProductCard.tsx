import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2Icon, ClockIcon, WrenchIcon } from 'lucide-react';
import type { Product } from '../../types';
import { discountPercent, formatPrice } from '../../utils/format';
import { generateWhatsAppInquiry } from '../../utils/whatsapp';
import { Rating } from '../ui/Rating';
import { WhatsAppButton } from '../ui/WhatsAppButton';

interface ProductCardProps {
  product: Product;
  /** 'default' shows price + rating, 'spec' adds a specification strip. */
  variant?: 'default' | 'spec';
  specKeys?: string[];
  ctaLabel?: string;
  showAvailability?: boolean;
}

const badgeStyles: Record<string, string> = {
  SALE: 'bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-sm',
  BESTSELLER: 'bg-gradient-to-r from-zinc-900 to-zinc-700 text-white',
  NEW: 'bg-gradient-to-r from-amber-300 to-yellow-200 text-zinc-900',
  'LIMITED OFFER': 'bg-gradient-to-r from-red-600 to-red-500 text-white',
  POPULAR: 'bg-gradient-to-r from-zinc-700 to-zinc-600 text-white'
};

const availabilityIcon = {
  'In Stock': CheckCircle2Icon,
  'Limited Stock': ClockIcon,
  'Made To Order': WrenchIcon
};

export function ProductCard({
  product,
  variant = 'default',
  specKeys,
  ctaLabel = 'WhatsApp Inquiry',
  showAvailability = false
}: ProductCardProps) {
  const off = discountPercent(product.price, product.oldPrice);
  const specs = (specKeys ?? []).
  map((key) => ({ key, value: product.specifications[key] })).
  filter((s) => Boolean(s.value));
  const AvailabilityIcon = availabilityIcon[product.availability];

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white/90 shadow-[0_12px_30px_rgba(15,23,42,0.06)] ring-1 ring-zinc-100 transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_24px_50px_rgba(255,106,0,0.12)]">
      
      <Link
        to={`/product/${product.slug}`}
        className="relative block overflow-hidden bg-gradient-to-br from-zinc-100 via-zinc-50 to-zinc-100"
        aria-label={product.name}>
        
        <div className="absolute left-2.5 top-2.5 z-10 flex flex-col items-start gap-1.5">
          {product.badge &&
          <span
            className={`rounded-md px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider shadow-sm ${
            badgeStyles[product.badge] ?? 'bg-ink text-white'}`
            }>
            
              {product.badge}
            </span>
          }
          {off !== null &&
          <span className="rounded-md bg-white/95 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-accent shadow-sm ring-1 ring-orange-100">
              {off}% Off
            </span>
          }
        </div>
        <div className="flex h-[180px] items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.9),_rgba(245,245,245,1)_40%,_rgba(229,231,235,1))] sm:h-[210px] md:h-[220px] lg:h-[240px]">
          {product.image ? <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={640}
            height={640}
            className="h-full w-full object-contain object-center transition-transform duration-500 ease-out group-hover:scale-[1.08]" /> :
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Photo Coming Soon</span>}
        </div>
        
        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-r from-zinc-900 to-zinc-800 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
          {product.feature}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-3.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
          {product.subcategory ?? product.category}
        </p>
        <h3 className="mt-0.5 font-display text-[15px] font-bold uppercase leading-tight tracking-tight text-zinc-900 sm:text-[16px] lg:text-[17px]">
          <Link to={`/product/${product.slug}`} className="transition-colors duration-200 hover:text-accent">
            {product.name}
          </Link>
        </h3>
        <p className="mt-0.5 text-xs font-medium text-zinc-500">
          Model: {product.model}
        </p>

        {variant === 'spec' && specs.length > 0 &&
        <dl className="mt-2.5 space-y-1 rounded-md bg-surface px-2.5 py-2">
            {specs.map((s) =>
          <div key={s.key} className="flex items-baseline justify-between gap-3">
                <dt className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                  {s.key}
                </dt>
                <dd className="truncate text-[11px] font-bold text-ink">{s.value}</dd>
              </div>
          )}
          </dl>
        }

        <div className="mt-2.5 flex items-end gap-2">
          <span className="font-display text-xl font-extrabold tracking-tight text-zinc-900">
            {formatPrice(product.price)}
          </span>
          {product.oldPrice &&
          <span className="pb-0.5 text-xs font-medium text-zinc-400 line-through">
              {formatPrice(product.oldPrice)}
            </span>
          }
        </div>

        <div className="mt-1.5 flex items-center justify-between gap-2">
          <Rating value={product.rating} reviews={product.reviews} />
          {showAvailability &&
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
            product.availability === 'In Stock' ?
            'text-emerald-600' :
            product.availability === 'Limited Stock' ?
            'text-amber-600' :
            'text-zinc-500'}`
            }>
            
              <AvailabilityIcon size={12} />
              {product.availability}
            </span>
          }
        </div>

        <div className="mt-3 flex-1" />
        <div className="rounded-xl bg-gradient-to-r from-orange-500 via-orange-500 to-amber-400 p-[1px] shadow-sm">
          <WhatsAppButton
            href={generateWhatsAppInquiry(product)}
            label={ctaLabel}
            size="sm"
            fullWidth />
        </div>
        
      </div>
    </motion.article>);

}

export function ProductCardSkeleton() {
  return (
    <div className="h-full animate-pulse overflow-hidden rounded-xl border border-zinc-200 bg-white">
      <div className="aspect-square w-full bg-zinc-200" />
      <div className="space-y-2 p-3.5">
        <div className="h-2.5 w-1/3 rounded bg-zinc-200" />
        <div className="h-4 w-4/5 rounded bg-zinc-200" />
        <div className="h-3 w-1/2 rounded bg-zinc-200" />
        <div className="h-5 w-2/5 rounded bg-zinc-200" />
        <div className="h-9 w-full rounded bg-zinc-200" />
      </div>
    </div>);

}