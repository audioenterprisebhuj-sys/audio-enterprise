import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { WhatsAppIcon } from '../ui/WhatsAppIcon';
import { heroSlides } from '../../data/heroSlides';
import { generateGeneralInquiry } from '../../utils/whatsapp';

const AUTOPLAY_MS = 6500;

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const slide = heroSlides[index];

  const go = useCallback((direction: 1 | -1) => {
    setIndex((prev) => (prev + direction + heroSlides.length) % heroSlides.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => go(1), AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [go, paused]);

  return (
    <section
      aria-label="Featured audio solutions"
      className="relative isolate overflow-hidden bg-ink"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative w-full h-[calc(100vh-85px)] sm:h-[calc(100vh-93px)] lg:h-[calc(100vh-98px)] [@supports(height:100dvh)]:h-[calc(100dvh-85px)] [@supports(height:100dvh)]:sm:h-[calc(100dvh-93px)] [@supports(height:100dvh)]:lg:h-[calc(100dvh-98px)] min-h-[480px] max-h-[850px]">
        <AnimatePresence mode="sync">
          <motion.img
            key={slide.id}
            src={slide.image}
            alt=""
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className={`absolute ${
              slide.imageClassName || 'inset-0 h-full w-full object-cover object-center'
            }`}
          />
        </AnimatePresence>
        <div
          className={`absolute inset-0 bg-gradient-to-r ${
            slide.id === 2
              ? 'from-ink via-ink/90 sm:via-ink/70 to-transparent'
              : 'from-ink via-ink/80 to-ink/20'
          }`}
          aria-hidden="true"
        />
        
        {slide.id !== 2 && (
          <div className="absolute inset-0 bg-ink/30" aria-hidden="true" />
        )}

        <div className="relative mx-auto flex h-full w-full max-w-[1320px] items-center px-4 pt-4 pb-20 sm:px-6 sm:pt-6 sm:pb-24 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="w-full max-w-[95%] sm:max-w-xl lg:max-w-2xl"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3.5 py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
                {slide.eyebrow}
              </span>
              <h1 className="mt-3 sm:mt-4 whitespace-pre-line font-display text-[1.85rem] sm:text-4xl md:text-5xl lg:text-[3.5rem] xl:text-[3.85rem] font-extrabold uppercase leading-[0.98] tracking-tight text-white">
                {slide.title}
              </h1>
              <p className="mt-3 sm:mt-4 max-w-xl text-sm sm:text-base leading-relaxed text-white/70 line-clamp-3 sm:line-clamp-none">
                {slide.subtitle}
              </p>
              <div className="mt-5 sm:mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
                <Link
                  to={slide.href}
                  className="group inline-flex h-11 sm:h-12 w-full items-center justify-center gap-2 rounded-md bg-accent px-5 sm:px-6 text-xs sm:text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-ink sm:w-auto"
                >
                  Explore Products
                  <ArrowRightIcon
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
                <a
                  href="https://chat.whatsapp.com/IPOJb87wI9z9WO0B9iGAVE?mode=gi_t"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 sm:h-12 w-full items-center justify-center gap-2 rounded-md border border-white/30 px-5 sm:px-6 text-xs sm:text-sm font-bold uppercase tracking-wider text-white backdrop-blur-sm transition-colors hover:border-[#25D366] hover:bg-[#25D366] hover:text-white sm:w-auto"
                >
                  <WhatsAppIcon size={16} />
                  Join WhatsApp Group
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="absolute bottom-4 sm:bottom-6 left-0 right-0">
          <div className="mx-auto flex w-full max-w-[1320px] items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2" role="tablist" aria-label="Hero slides">
              {heroSlides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={s.eyebrow}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index ? 'w-10 bg-accent' : 'w-4 bg-white/35 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous slide"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:border-accent hover:bg-accent"
              >
                <ChevronLeftIcon size={18} />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next slide"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:border-accent hover:bg-accent"
              >
                <ChevronRightIcon size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
