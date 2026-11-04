import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon, HeadphonesIcon } from 'lucide-react';
import { useLiveCategories } from '../../services/categoryService';
import { generateGeneralInquiry } from '../../utils/whatsapp';

interface MegaMenuProps {
  onNavigate: () => void;
}

export function MegaMenu({ onNavigate }: MegaMenuProps) {
  const categories = useLiveCategories();

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="absolute inset-x-0 top-full z-40 hidden border-t border-zinc-200 bg-white shadow-lift lg:block"
    >
      <div className="mx-auto w-full max-w-[1320px] px-6 py-7 lg:px-8">
        <div className="grid grid-cols-[1fr_260px] gap-8">
          <div>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-lg font-extrabold uppercase tracking-tight text-ink">
                Shop by Category
              </h2>
              <Link
                to="/products"
                onClick={onNavigate}
                className="group inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent"
              >
                All Products
                <ArrowRightIcon
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </div>
            <ul className="grid grid-cols-3 gap-x-6 gap-y-1 xl:grid-cols-4">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    to={`/category/${category.slug}`}
                    onClick={onNavigate}
                    className="group flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-surface"
                  >
                    <img
                      src={category.image || '/amplifiers1.webp'}
                      alt={category.name}
                      loading="lazy"
                      className="h-11 w-11 shrink-0 rounded-md border border-zinc-200 bg-zinc-100 object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/amplifiers1.webp';
                      }}
                    />

                    <span className="min-w-0">
                      <span className="block truncate text-[13px] font-bold text-ink group-hover:text-accent">
                        {category.name}
                      </span>
                      <span className="block truncate text-[11px] leading-snug text-zinc-500">
                        {category.description}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <aside className="flex flex-col justify-between rounded-xl bg-ink p-6 text-white">
            <div>
              <HeadphonesIcon size={26} className="text-accent" />
              <h3 className="mt-4 font-display text-2xl font-extrabold uppercase leading-none">
                Not sure what you need?
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                Tell our audio engineers about your venue and we will spec the right
                system for you.
              </p>
            </div>
            <a
              href={generateGeneralInquiry()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-accent px-5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-ink"
            >
              Talk to an Expert
            </a>
          </aside>
        </div>
      </div>
    </motion.div>
  );
}
