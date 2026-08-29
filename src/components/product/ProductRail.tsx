import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

interface ProductRailProps {
  children: React.ReactNode;
  dark?: boolean;
  itemClassName?: string;
  ariaLabel: string;
}

/**
 * Horizontally scrolling product rail with snap points and desktop arrows.
 * Falls back to native touch scrolling on mobile.
 */
export function ProductRail({
  children,
  dark = false,
  itemClassName = 'w-[82vw] sm:w-[300px] lg:w-[272px]',
  ariaLabel
}: ProductRailProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    update();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [update]);

  const scrollBy = (direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.82, behavior: 'smooth' });
  };

  const arrowBase = `hidden h-10 w-10 items-center justify-center rounded-full border transition-all duration-200 md:flex ${
  dark ?
  'border-white/20 bg-white/10 text-white hover:bg-accent hover:border-accent' :
  'border-zinc-300 bg-white text-ink hover:border-ink hover:bg-ink hover:text-white'} disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-current`;


  const items = React.Children.toArray(children);

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        role="region"
        aria-label={ariaLabel}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-2 sm:mx-0 sm:px-0">
        
        {items.map((child, i) =>
        <div key={i} className={`shrink-0 snap-start ${itemClassName}`}>
            {child}
          </div>
        )}
      </div>

      <div className="mt-4 hidden items-center justify-end gap-2 md:flex">
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          disabled={atStart}
          aria-label="Scroll left"
          className={arrowBase}>
          
          <ChevronLeftIcon size={18} />
        </button>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          disabled={atEnd}
          aria-label="Scroll right"
          className={arrowBase}>
          
          <ChevronRightIcon size={18} />
        </button>
      </div>
    </div>);

}