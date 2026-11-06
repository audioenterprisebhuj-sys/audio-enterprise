import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PhoneIcon } from 'lucide-react';
import { WhatsAppIcon } from '../ui/WhatsAppIcon';
import { SITE } from '../../config/site';
import { generateGeneralInquiry } from '../../utils/whatsapp';

export function HelpCTA() {
  return (
    <section aria-labelledby="help-heading" className="bg-surface pb-12 pt-4 sm:pb-16">
      <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.45 }}
          className="relative overflow-hidden rounded-2xl bg-ink px-6 py-12 sm:px-12 sm:py-14"
        >
          <span
            className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/15 blur-2xl"
            aria-hidden="true"
          />
          
          <div className="relative max-w-3xl">
            <h2
              id="help-heading"
              className="font-display text-3xl font-extrabold uppercase leading-none tracking-tight text-white sm:text-[2.75rem]"
            >
              Need Help Choosing the Right Equipment?
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/65">
              Our audio equipment specialists can assist you in selecting the exact products,
              power ratings, and matching hardware for your live sound needs.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={generateGeneralInquiry()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-md bg-[#25D366] px-6 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#1faa54] sm:text-sm shadow-sm"
              >
                <WhatsAppIcon size={18} />
                WhatsApp Us
              </a>
              <a
                href={SITE.phoneHref}
                className="inline-flex h-12 items-center gap-2 rounded-md border border-white/25 px-6 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:border-white hover:bg-white hover:text-ink sm:text-sm"
              >
                <PhoneIcon size={16} />
                Call Us
              </a>
              <Link
                to="/contact"
                className="inline-flex h-12 items-center gap-2 rounded-md bg-accent px-6 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-ink sm:text-sm"
              >
                Send Inquiry
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
