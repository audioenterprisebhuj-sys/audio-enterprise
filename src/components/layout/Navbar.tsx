import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDownIcon,
  ExternalLinkIcon,
  LogOutIcon,
  MenuIcon,
  SearchIcon,
  XIcon,
  Instagram,
  Youtube
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
  { label: 'Brands', to: '/brands' },
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
  const isAdmin = location.pathname.toLowerCase().startsWith('/admin');

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return Boolean(
        sessionStorage.getItem('ae_admin_auth_token') ||
        localStorage.getItem('ae_admin_auth_token')
      );
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const handleAuthChange = () => {
      try {
        setIsAdminLoggedIn(Boolean(
          sessionStorage.getItem('ae_admin_auth_token') ||
          localStorage.getItem('ae_admin_auth_token')
        ));
      } catch {
        setIsAdminLoggedIn(false);
      }
    };
    handleAuthChange();
    window.addEventListener('admin_auth_changed', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    return () => {
      window.removeEventListener('admin_auth_changed', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, [location.pathname]);

  const handleAdminLogout = () => {
    try {
      sessionStorage.removeItem('ae_admin_auth_token');
      localStorage.removeItem('ae_admin_auth_token');
    } catch {
      // ignore
    }
    setIsAdminLoggedIn(false);
    window.dispatchEvent(new Event('admin_auth_changed'));
  };

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
    const toPath = to.split('?')[0];
    if (to.includes('?')) {
      return location.pathname + location.search === to;
    }
    return location.pathname === toPath;
  };

  return (
    <>
      <header
        style={{ position: 'sticky', top: 0, zIndex: 50 }}
        className={`sticky top-0 z-50 w-full shrink-0 border-b bg-white transition-shadow duration-300 ${
          scrolled ? 'border-zinc-200 shadow-card' : 'border-transparent'
        }`}
        onMouseLeave={() => setMegaOpen(false)}
      >
        <div className="mx-auto flex w-full max-w-[1320px] items-center justify-between gap-2 px-4 py-2 sm:px-6 sm:py-2.5 lg:px-8">
          <div className="flex flex-1 items-center justify-start shrink-0">
            <Link
              to="/"
              style={{ height: '42px', display: 'flex', alignItems: 'center' }}
              className="group flex shrink-0 items-center overflow-hidden"
            >
              <img
                src={IMG.logo}
                alt="SS Audio"
                height={42}
                style={{ height: '42px', maxHeight: '42px', width: 'auto', display: 'block' }}
                className="h-10 max-h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
              />
            </Link>
          </div>

          {!isAdmin && (
            <nav
              aria-label="Main navigation"
              className="hidden lg:flex items-center justify-center gap-1 xl:gap-2.5 shrink-0"
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
          )}

          {isAdmin ? (
            <div className="flex flex-1 items-center justify-end gap-2.5 shrink-0">
              <Link
                to="/"
                target="_blank"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-600 hover:bg-zinc-100 hover:text-ink transition-colors"
                title="View Public Store in new tab"
              >
                <span>View Site</span>
                <ExternalLinkIcon size={12} />
              </Link>
              {isAdminLoggedIn && (
                <button
                  type="button"
                  onClick={handleAdminLogout}
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 text-xs font-bold uppercase tracking-wider text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm cursor-pointer"
                >
                  <LogOutIcon size={14} />
                  <span>Logout</span>
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-end gap-1 sm:gap-1.5 shrink-0">
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
                title="Chat on WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-md text-ink transition-colors hover:bg-surface hover:text-[#25D366]"
              >
                <WhatsAppIcon size={18} />
              </a>
              <a
                href={SITE.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                title="Follow us on Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-md text-ink transition-colors hover:bg-surface hover:text-[#E4405F]"
              >
                <Instagram size={17} />
              </a>
              <a
                href={SITE.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                title="Subscribe on YouTube"
                className="flex h-9 w-9 items-center justify-center rounded-md text-ink transition-colors hover:bg-surface hover:text-[#FF0000]"
              >
                <Youtube size={18} />
              </a>
              <a
                href={SITE.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                title="Follow us on Facebook"
                className="hidden sm:flex h-9 w-9 items-center justify-center rounded-md text-ink transition-colors hover:bg-surface hover:text-[#1877f2]"
              >
                <FaFacebookF size={15} />
              </a>
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                className="flex h-9 w-9 items-center justify-center rounded-md text-ink transition-colors hover:bg-surface lg:hidden"
              >
                <MenuIcon size={20} />
              </button>
            </div>
          )}
        </div>

        <AnimatePresence>
          {!isAdmin && megaOpen && <MegaMenu onNavigate={() => setMegaOpen(false)} />}
        </AnimatePresence>
      </header>

      {!isAdmin && <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />}

      <AnimatePresence>
        {!isAdmin && mobileOpen && (
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
                <div
                  style={{ height: '36px', display: 'flex', alignItems: 'center' }}
                  className="flex items-center gap-2"
                >
                  <img
                    src={IMG.logo}
                    alt="SS Audio"
                    height={36}
                    style={{ height: '36px', maxHeight: '36px', width: 'auto', display: 'block' }}
                    className="h-9 max-h-9 w-auto object-contain"
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
                </ul>

                <p className="mb-2 mt-6 px-3 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Shop by Category
                </p>
                <ul className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <li key={category.id}>
                      <Link
                        to={`/category/${category.slug}`}
                        className="flex flex-col justify-center rounded-lg border border-zinc-200 bg-zinc-50/50 p-2.5 transition-colors hover:border-accent hover:bg-white"
                      >
                        <span className="min-w-0 truncate text-[12px] font-bold text-ink">
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
