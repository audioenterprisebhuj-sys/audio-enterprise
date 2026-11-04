import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FacebookIcon,
  InstagramIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  XIcon,
  YoutubeIcon
} from 'lucide-react';
import { WhatsAppIcon } from '../ui/WhatsAppIcon';
import { IMG } from '../../data/images';
import { SITE } from '../../config/site';
import { generateGeneralInquiry } from '../../utils/whatsapp';

const COLUMNS = [
  {
    title: 'Products',
    links: [
      { label: 'Amplifiers', to: '/category/amplifiers' },
      { label: 'Speakers', to: '/category/speakers-tweeters' },
      { label: 'Microphones', to: '/category/microphones' },
      { label: 'Mixers', to: '/category/mixers' },
      { label: 'Processors', to: '/category/processors' },
      { label: 'Lighting', to: '/category/lighting-sfx' }
    ]
  },
  {
    title: 'Support',
    links: [
      { label: 'Contact', to: '/contact' },
      { label: 'Warranty & Service', to: '/contact' },
      { label: 'Spare Parts', to: '/category/spare-parts' },
      { label: 'Product Support', to: '/contact' }
    ]
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Services', to: '/about#services' },
      { label: 'Our Brands', to: '/brands' },
      { label: 'Showroom & Branches', to: '/branches' }
    ]
  },
  {
    title: 'Quick Links',
    links: [
      { label: 'New Arrivals', to: '/products?tag=new' },
      { label: 'Sale', to: '/products?tag=sale' },
      { label: 'All Products', to: '/products' },
      { label: 'Sitemap', to: '/sitemap' },
      { label: 'Inquiry', to: '/contact' }
    ]
  }
];

export function Footer() {
  const [modalContent, setModalContent] = useState<'privacy' | 'terms' | null>(null);

  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto w-full max-w-[1320px] px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-1">
            <Link to="/" className="inline-block group">
              <div className="inline-flex items-center rounded-lg bg-white px-3.5 py-2 shadow-sm transition-transform group-hover:scale-[1.02]">
                <img
                  src={IMG.logo}
                  alt={SITE.brand}
                  className="h-10 w-auto object-contain"
                />
              </div>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
              Authorised dealer of professional audio equipment, JBL Audio Pro, EM Audio,
              touring sound systems, and commercial installation support across India.
            </p>
            <ul className="mt-5 space-y-2.5 text-sm text-white/65">
              <li className="flex items-start gap-2.5">
                <MapPinIcon size={15} className="mt-0.5 shrink-0 text-accent" />
                <span>{SITE.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <PhoneIcon size={15} className="shrink-0 text-accent" />
                <a href={SITE.phoneHref} className="hover:text-white transition-colors">
                  {SITE.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MailIcon size={15} className="shrink-0 text-accent" />
                <a href={`mailto:${SITE.email}`} className="hover:text-white transition-colors">
                  {SITE.email}
                </a>
              </li>
            </ul>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h3 className="font-display text-sm font-extrabold uppercase tracking-widest text-white">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-white/60 transition-colors hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col-reverse items-center justify-between gap-5 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-white/40">
            © 2026 {SITE.brand}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <Link
              to="/admin"
              className="text-xs text-accent font-bold uppercase tracking-wider hover:text-white transition-colors underline-offset-2 hover:underline"
            >
              Admin Portal
            </Link>
            <button
              type="button"
              onClick={() => setModalContent('privacy')}
              className="text-xs text-white/50 hover:text-white transition-colors underline-offset-2 hover:underline"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => setModalContent('terms')}
              className="text-xs text-white/50 hover:text-white transition-colors underline-offset-2 hover:underline"
            >
              Terms &amp; Conditions
            </button>
            <Link
              to="/sitemap"
              className="text-xs text-white/50 hover:text-white transition-colors underline-offset-2 hover:underline"
            >
              Sitemap
            </Link>
            <div className="flex items-center gap-2">
              {[
                { Icon: InstagramIcon, href: SITE.social.instagram, label: 'Instagram' },
                { Icon: FacebookIcon, href: SITE.social.facebook, label: 'Facebook' },
                { Icon: YoutubeIcon, href: SITE.social.youtube, label: 'YouTube' },
                { Icon: WhatsAppIcon, href: generateGeneralInquiry(), label: 'WhatsApp' }
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-white/15 text-white/60 transition-colors hover:border-[#25D366] hover:bg-[#25D366] hover:text-white"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {modalContent && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setModalContent(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 text-ink shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
              <h3 className="font-display text-xl font-bold uppercase tracking-tight text-ink">
                {modalContent === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
              </h3>
              <button
                type="button"
                onClick={() => setModalContent(null)}
                className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-ink"
              >
                <XIcon size={18} />
              </button>
            </div>
            <div className="mt-4 max-h-[60vh] space-y-3 overflow-y-auto text-sm text-zinc-600 pr-1">
              {modalContent === 'privacy' ? (
                <>
                  <p>
                    <strong>Audio Enterprise</strong> respects your privacy. When you request a quotation or contact us via WhatsApp, phone, or our inquiry forms, we collect only the necessary information (name, phone number, email, and requirements) to provide you with product specifications, pricing, and dispatch assistance.
                  </p>
                  <p>
                    We never sell, rent, or distribute your personal contact information to third parties. All lead inquiries are maintained securely and used exclusively for direct customer service.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <strong>Audio Enterprise Quotations & Equipment Terms:</strong> All product prices, specifications, and availability displayed on this catalogue are indicative dealer estimates. Formal quotations with final invoice totals, GST rates, and logistics freight will be confirmed directly upon WhatsApp/phone consultation.
                  </p>
                  <p>
                    Manufacturer warranties (JBL, EM Audio, SoundForge, etc.) apply as specified on genuine brand warranty cards provided with dispatch.
                  </p>
                </>
              )}
            </div>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setModalContent(null)}
                className="rounded-md bg-ink px-5 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-accent transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
