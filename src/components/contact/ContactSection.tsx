import React from 'react';
import { ClockIcon, MailIcon, MapPinIcon, PhoneIcon } from 'lucide-react';
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
            subtitle="Visit the showroom, call us, or send a WhatsApp message — we respond during business hours."
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr]">
          <div className="space-y-4">
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <li className="flex items-start gap-3 rounded-xl border border-zinc-200 p-4">
                <PhoneIcon size={18} className="mt-0.5 shrink-0 text-accent" />
                <span>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    Phone
                  </span>
                  <a href={SITE.phoneHref} className="text-sm font-semibold text-ink hover:text-accent">
                    {SITE.phone}
                  </a>
                </span>
              </li>
              <li className="flex items-start gap-3 rounded-xl border border-zinc-200 p-4">
                <WhatsAppIcon size={18} className="mt-0.5 shrink-0 text-[#25D366]" />
                <span>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    WhatsApp
                  </span>
                  <a
                    href={generateGeneralInquiry()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-ink hover:text-[#25D366]"
                  >
                    Chat with us now
                  </a>
                </span>
              </li>
              <li className="flex items-start gap-3 rounded-xl border border-zinc-200 p-4">
                <MailIcon size={18} className="mt-0.5 shrink-0 text-accent" />
                <span>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    Email
                  </span>
                  <a href={`mailto:${SITE.email}`} className="text-sm font-semibold text-ink hover:text-accent">
                    {SITE.email}
                  </a>
                </span>
              </li>
              <li className="flex items-start gap-3 rounded-xl border border-zinc-200 p-4">
                <MapPinIcon size={18} className="mt-0.5 shrink-0 text-accent" />
                <span>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    Address
                  </span>
                  <span className="text-sm font-medium text-zinc-600">{SITE.address}</span>
                </span>
              </li>
              <li className="flex items-start gap-3 rounded-xl border border-zinc-200 p-4 sm:col-span-2 lg:col-span-1">
                <ClockIcon size={18} className="mt-0.5 shrink-0 text-accent" />
                <span>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    Business Hours
                  </span>
                  {SITE.hours.map((h) => (
                    <span key={h.day} className="block text-sm font-medium text-zinc-600">
                      {h.day}: <span className="text-ink">{h.time}</span>
                    </span>
                  ))}
                </span>
              </li>
            </ul>

            <div id="location" className="overflow-hidden rounded-xl border border-zinc-200">
              <iframe
                title="Showroom location map"
                src={SITE.mapEmbed}
                loading="lazy"
                className="h-56 w-full border-0"
              />
            </div>
          </div>

          <InquiryForm title="Request a Quote" />
        </div>
      </div>
    </section>
  );
}
