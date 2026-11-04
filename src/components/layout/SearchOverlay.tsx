import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { SearchIcon, XIcon } from 'lucide-react';
import { searchProducts } from '../../services/productService';
import type { Product } from '../../types';
import { formatPrice } from '../../utils/format';

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

const QUICK_TERMS = ['Amplifier', 'Mixer', 'Wireless Microphone', 'Subwoofer', 'LED PAR'];

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const results = useMemo(() => searchProducts(query), [query]);

  useEffect(() => {
    if (open) {
      setQuery('');
      window.setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/products?q=${encodeURIComponent(query.trim())}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[70] bg-ink/60 backdrop-blur-sm"
          onClick={onClose}
          role="presentation"
        >
          <motion.div
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -24, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="mx-auto mt-[8vh] w-[92%] max-w-2xl overflow-hidden rounded-xl bg-white shadow-lift"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Search products"
          >
            <form onSubmit={submit} className="flex items-center gap-3 border-b border-zinc-200 px-4">
              <SearchIcon size={18} className="shrink-0 text-zinc-400" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search speakers, mixers, microphones..."
                className="h-14 w-full bg-transparent text-[15px] font-medium text-ink outline-none placeholder:text-zinc-400"
                aria-label="Search products"
              />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close search"
                className="shrink-0 rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-surface hover:text-ink"
              >
                <XIcon size={18} />
              </button>
            </form>

            <div className="max-h-[54vh] overflow-y-auto">
              {!query.trim() && (
                <div className="p-4">
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    Popular searches
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_TERMS.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => setQuery(term)}
                        className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-600 transition-colors hover:border-ink hover:text-ink"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {query.trim() && results.length === 0 && (
                <p className="px-4 py-10 text-center text-sm text-zinc-500">
                  No products match “{query}”. Try a different keyword.
                </p>
              )}

              {results.length > 0 && (
                <ul className="divide-y divide-zinc-100">
                  {results.map((product: Product) => (
                    <li key={product.id}>
                      <button
                        type="button"
                        onClick={() => {
                          navigate(`/product/${product.slug}`);
                          onClose();
                        }}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface"
                      >
                        <img
                          src={product.image}
                          alt=""
                          loading="lazy"
                          className="h-11 w-11 rounded-md border border-zinc-200 object-cover"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-bold text-ink">
                            {product.name}
                          </span>
                          <span className="block truncate text-xs text-zinc-500">
                            {product.category} • {product.model}
                          </span>
                        </span>
                        <span className="shrink-0 text-sm font-bold text-ink">
                          {formatPrice(product.price)}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
