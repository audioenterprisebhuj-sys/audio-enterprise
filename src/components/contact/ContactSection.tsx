import React from 'react';
import { ClockIcon, MailIcon, MapPinIcon, PhoneIcon, ExternalLinkIcon } from 'lucide-react';
import { WhatsAppIcon } from '../ui/WhatsAppIcon';
import { SITE } from '../../config/site';
import { generateGeneralInquiry } from '../../utils/whatsapp';
import { SectionHeading } from '../ui/SectionHeading';
import { InquiryForm } from './InquiryForm';

export function ContactSection() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="bg-white py-12 sm:py-16">
      <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div id="contact-heading">
          <SectionHeading
            eyebrow="Get in touch"
            title="Contact Our Team"
            subtitle="Connect with our sound engineers and sales team in Bhuj, or send an inquiry directly via WhatsApp."
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr]">
          <div className="space-y-4">
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <li className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                <PhoneIcon size={18} className="mt-0.5 shrink-0 text-accent" />
                <span>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    Phone & Support
                  </span>
                  <a href={SITE.phoneHref} className="text-sm font-bold text-ink hover:text-accent transition-colors">
                    +91 {SITE.phoneRaw}
                  </a>
                </span>
              </li>

              <li className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                <WhatsAppIcon size={18} className="mt-0.5 shrink-0 text-[#25D366]" />
                <span>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    WhatsApp Chat
                  </span>
                  <a
                    href={generateGeneralInquiry()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-bold text-ink hover:text-[#25D366] transition-colors"
                  >
                    Chat with an Audio Engineer
                  </a>
                </span>
              </li>

              <li className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                <MailIcon size={18} className="mt-0.5 shrink-0 text-accent" />
                <span>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    Official Email
                  </span>
                  <a href={`mailto:${SITE.email}`} className="text-sm font-semibold text-ink hover:text-accent transition-colors">
                    {SITE.email}
                  </a>
                </span>
              </li>

              <li className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                <MapPinIcon size={18} className="mt-0.5 shrink-0 text-accent" />
                <span className="min-w-0">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    Manufacturing & Experience Center Address
                  </span>
                  <span className="text-sm font-medium leading-relaxed text-zinc-700 block">
                    {SITE.address}
                  </span>
                  <a
                    href={SITE.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent hover:underline"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLinkIcon size={13} />
                  </a>
                </span>
              </li>

              <li className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:col-span-2 lg:col-span-1">
                <ClockIcon size={18} className="mt-0.5 shrink-0 text-accent" />
                <span>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    Working Hours
                  </span>
                  {SITE.hours.map((h) => (
                    <span key={h.day} className="block text-sm font-medium text-zinc-600">
                      {h.day}: <span className="font-semibold text-ink">{h.time}</span>
                    </span>
                  ))}
                </span>
              </li>
            </ul>

            {/* Embedded Location Map */}
            <div id="location" className="overflow-hidden rounded-2xl border border-zinc-200 shadow-sm bg-zinc-50">
              <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <MapPinIcon size={15} className="text-accent" />
                  <span className="text-xs font-bold uppercase tracking-wider text-ink">
                    Factory & Experience Rig Location
                  </span>
                </div>
                <a
                  href={SITE.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[11px] font-bold text-accent hover:underline"
                >
                  Direct Link
                  <ExternalLinkIcon size={11} />
                </a>
              </div>
              <iframe
                title="Audio Enterprise Bhuj Location Map"
                src={SITE.mapEmbed}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                className="h-64 w-full border-0"
              />
            </div>
          </div>

          {/* Inquiry Form */}
          <InquiryForm title="Inquiry Form" />
        </div>
      </div>
    </section>
  );
}
