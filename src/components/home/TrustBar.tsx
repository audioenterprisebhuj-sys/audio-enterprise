import React from 'react';
import { motion } from 'framer-motion';
import { WhatsAppIcon } from '../ui/WhatsAppIcon';
import {
  BadgeCheckIcon,
  HeadphonesIcon,
  ShieldCheckIcon,
  WrenchIcon,
  ZapIcon
} from 'lucide-react';

const FEATURES = [
  { Icon: BadgeCheckIcon, title: 'Professional Quality', text: 'Reliable equipment' },
  { Icon: HeadphonesIcon, title: 'Expert Support', text: 'Get product guidance' },
  { Icon: WhatsAppIcon, title: 'Fast Response', text: 'Quick WhatsApp inquiry' },
  { Icon: ShieldCheckIcon, title: 'Genuine Products', text: 'Quality assured' },
  { Icon: WrenchIcon, title: 'Installation Support', text: 'Professional assistance' },
  { Icon: ZapIcon, title: 'Warranty Support', text: 'After-sales service' }
];

export function TrustBar() {
  return (
    <section aria-label="Why buy from us" className="border-b border-zinc-200 bg-white">
      <div className="mx-auto w-full max-w-[1320px] px-4 py-6 sm:px-6 lg:px-8">
        <ul className="grid grid-cols-2 gap-x-4 gap-y-5 md:grid-cols-3 xl:grid-cols-6">
          {FEATURES.map(({ Icon, title, text }, i) => (
            <motion.li
              key={title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="flex items-center gap-3"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
                <Icon size={19} />
              </span>
              <span className="min-w-0">
                <span className="block text-[12px] sm:text-[13px] font-bold uppercase tracking-wide text-ink leading-tight">
                  {title}
                </span>
                <span className="block text-[11px] sm:text-xs text-zinc-500 leading-tight mt-0.5">
                  {text}
                </span>
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
