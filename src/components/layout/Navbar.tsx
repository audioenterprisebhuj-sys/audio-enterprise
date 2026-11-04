import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDownIcon,
  MenuIcon,
  SearchIcon,
  ShieldCheckIcon,
  XIcon
} from 'lucide-react';
import { FaFacebookF } from 'react-icons/fa';
import { WhatsAppIcon } from '../ui/WhatsAppIcon';
import { IMG } from '../../data/images';
import { SITE } from '../../config/site';
import { useLiveCategories } from '../../services/categoryService';
import { generateGeneralInquiry } from '../../utils/whatsapp';
import { MegaMenu } from './MegaMenu';
import { SearchOverlay } from './SearchOverlay';

const NAV_LINKS = [
  { label: 'Products', to: '/products' },
  { label: 'New Arrivals', to: '/products?tag=new' },
  { label: 'Sale', to: '/products?tag=sale' },
  { label: 'Brands', to: '/brands' },
  { label: 'Our Brand', to: '/branches' },
  { label: 'About Us', to: '/about' },
  { label: 'Contact', to: '/contact' }
];

export function Navbar() {
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const categories = useLiveCategories();
  const location = useLocation();

  useEffect(() => {
    setMegaOpen(false);
    setMobileOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const isLinkActive = (to: string) => {
    const currentFull = location.pathname + location.search;
    if (to.includes('?')) {
      return currentFull === to;
    }
    return location.pathname === to && !location.search;
  };

  return (
    <>
      <header
        style={{ position: 'sticky', top: 0, zIndex: 50 }}
        className={`sticky top-0 z-50 w-full border-b bg-white transition-shadow duration-300 ${
          scrolled ? 'border-zinc-200 shadow-card' : 'border-transparent'
        }`}
        onMouseLeave={() => setMegaOpen(false)}
      >
        <div className="mx-auto flex w-full max-w-[1320px] items-center justify-between gap-2 px-4 py-2 sm:px-6 sm:py-2.5 lg:px-8">
          <Link to="/" className="group flex min-w-0 shrink-0 items-center">
            <img
              src={IMG.logo}
              alt={SITE.brand}
              width={140}
              height={48}
              className="w-[108px] sm:w-[120px] md:w-[132px] lg:w-[140px] h-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
            />
          </Link>

          <nav
            aria-label="Main navigation"
            className="ml-auto hidden items-center gap-0.5 xl:gap-1 lg:flex"
          >
            <button
              type="button"
              onClick={() => setMegaOpen((v) => !v)}
              onMouseEnter={() => setMegaOpen(true)}
              aria-expanded={megaOpen}
              style={{ fontWeight: 700 }}
              className={`group relative inline-flex items-center gap-1 rounded-md px-2 lg:px-2.5 xl:px-3 py-2 font-sans text-[12.5px] xl:text-[13px] font-bold uppercase tracking-wider transition-colors after:absolute after:inset-x-2 after:-bottom-0.5 after:h-0.5 after:origin-left after:transition-transform hover:text-accent hover:after:scale-x-100 ${
                megaOpen || location.pathname.startsWith('/category')
                  ? 'text-accent after:scale-x-100 after:bg-accent'
                  : 'text-ink after:scale-x-0 after:bg-accent'
              }`}
            >
              <span className="font-bold" style={{ fontWeight: 700 }}>Categories</span>
              <ChevronDownIcon
                size={13}
                strokeWidth={2.5}
                className={`transition-transform duration-200 ${
                  megaOpen ? 'rotate-180 text-accent' : 'text-current opacity-70 group-hover:opacity-100 group-hover:text-accent'
                }`}
              />
            </button>
            {NAV_LINKS.map((link) => {
              const active = isLinkActive(link.to);
              return (
                <NavLink
                  key={link.label}
                  to={link.to}
                  onMouseEnter={() => setMegaOpen(false)}
                  style={{ fontWeight: 700 }}
                  className={`group relative inline-flex items-center rounded-md px-2 lg:px-2.5 xl:px-3 py-2 font-sans text-[12.5px] xl:text-[13px] font-bold uppercase tracking-wider transition-colors after:absolute after:inset-x-2 after:-bottom-0.5 after:h-0.5 after:origin-left after:transition-transform hover:text-accent hover:after:scale-x-100 ${
                    active
                      ? 'text-accent after:scale-x-100 after:bg-accent'
                      : 'text-ink after:scale-x-0 after:bg-accent'
                  }`}
                >
                  <span className="font-bold" style={{ fontWeight: 700 }}>{link.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-1.5 lg:ml-4">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search products"
              className="flex h-9 w-9 items-center justify-center rounded-md text-ink transition-colors hover:bg-surface hover:text-accent"
            >
              <SearchIcon size={17} />
            </button>
            <a
              href={generateGeneralInquiry()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="flex h-9 w-9 items-center justify-center rounded-md text-ink transition-colors hover:bg-surface hover:text-[#25D366]"
            >
              <WhatsAppIcon size={18} />
            </a>
            <a
              href={SITE.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-md text-ink transition-colors hover:bg-surface hover:text-[#1877f2]"
            >
              <FaFacebookF size={15} />
            </a>
            <Link
              to="/admin"
              title="Admin Panel"
              aria-label="Admin Panel"
              className="hidden sm:inline-flex h-9 items-center gap-1.5 rounded-lg border border-zinc-200 px-3 text-xs font-bold uppercase tracking-wider text-ink transition-colors hover:border-accent hover:bg-accent/5 hover:text-accent"
            >
              <ShieldCheckIcon size={14} className="text-accent" />
              <span>Admin</span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="flex h-9 w-9 items-center justify-center rounded-md text-ink transition-colors hover:bg-surface lg:hidden"
            >
              <MenuIcon size={20} />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {megaOpen && <MegaMenu onNavigate={() => setMegaOpen(false)} />}
        </AnimatePresence>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-ink/50 lg:hidden"
            onClick={() => setMobileOpen(false)}
            role="presentation"
          >
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.28, ease: 'easeOut' }}
              className="ml-auto flex h-full w-[86%] max-w-sm flex-col bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              aria-label="Mobile navigation"
            >
              <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
                <div className="flex items-center gap-2">
                  <img
                    src={IMG.logo}
                    alt={SITE.brand}
                    width={105}
                    height={36}
                    className="w-[105px] h-auto object-contain"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="rounded-md p-2 text-zinc-500 hover:bg-surface hover:text-ink"
                >
                  <XIcon size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-4">
                <ul className="space-y-0.5">
                  {NAV_LINKS.map((link) => {
                    const active = isLinkActive(link.to);
                    return (
                      <li key={link.label}>
                        <Link
                          to={link.to}
                          className={`block rounded-md px-3 py-2.5 text-sm font-bold uppercase tracking-wide transition-colors ${
                            active
                              ? 'bg-accent/10 text-accent'
                              : 'text-ink hover:bg-surface'
                          }`}
                        >
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                  <li>
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-bold uppercase tracking-wide text-accent hover:bg-accent/10 transition-colors"
                    >
                      <ShieldCheckIcon size={16} />
                      <span>Admin Dashboard</span>
                    </Link>
                  </li>
                </ul>

                <p className="mb-2 mt-6 px-3 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Shop by Category
                </p>
                <ul className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <li key={category.id}>
                      <Link
                        to={`/category/${category.slug}`}
                        className="flex items-center gap-2 rounded-lg border border-zinc-200 p-2 hover:border-accent/50"
                      >
                        <img
                          src={category.image || '/amplifiers1.webp'}
                          alt={category.name}
                          loading="lazy"
                          className="h-8 w-8 rounded object-cover bg-zinc-100"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/amplifiers1.webp';
                          }}
                        />
                        <span className="min-w-0 truncate text-[12px] font-semibold text-ink">
                          {category.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-zinc-200 p-4">
                <a
                  href={generateGeneralInquiry()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#25D366] text-sm font-bold uppercase tracking-wider text-white hover:bg-[#1faa54] transition-colors shadow-sm"
                >
                  <WhatsAppIcon size={18} />
                  Chat on WhatsApp
                </a>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
