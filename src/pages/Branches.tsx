import React from 'react';
import { motion } from 'framer-motion';
import { MapPinIcon, PhoneIcon, ShieldCheckIcon, RadioIcon, WrenchIcon, LayersIcon } from 'lucide-react';
import { WhatsAppIcon } from '../components/ui/WhatsAppIcon';
import { IMG } from '../data/images';
import { SITE } from '../config/site';
import { generateGeneralInquiry } from '../utils/whatsapp';
import { SectionHeading } from '../components/ui/SectionHeading';
import { HelpCTA } from '../components/home/HelpCTA';

export function Branches() {
  return (
    <div className="bg-white">
      {/* Brand Hero */}
      <section className="relative isolate overflow-hidden bg-ink py-16 sm:py-24 text-white">
        <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
                Our In-House Flagship Brand
              </span>
              <h1 className="mt-4 font-display text-4xl font-extrabold uppercase leading-none tracking-tight sm:text-6xl text-white">
                EM Audio.
                <br />
                <span className="text-accent">Engineered For Power.</span>
              </h1>
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/70 sm:text-base">
                Exclusively developed, manufactured, and distributed by <strong>{SITE.brand}</strong>, 
                EM Audio delivers tour-grade line array cabinets, high-output compression drivers, 
                and heavy-duty amplification designed to endure demanding live concert conditions.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href={generateGeneralInquiry()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center gap-2 rounded-md bg-[#25D366] px-6 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#1faa54] shadow-sm"
                >
                  <WhatsAppIcon size={18} />
                  Inquire About EM Audio
                </a>
                <a
                  href={SITE.phoneHref}
                  className="inline-flex h-12 items-center gap-2 rounded-md border border-white/20 bg-white/5 px-6 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-ink"
                >
                  <PhoneIcon size={16} />
                  Contact Sales Team
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex justify-center lg:justify-end"
            >
              <div className="relative rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm sm:p-12 text-center">
                <img
                  src={IMG.emAudio}
                  alt="EM Audio Brand Logo"
                  className="mx-auto h-auto w-[220px] rounded-xl bg-white p-4 object-contain shadow-2xl sm:w-[260px]"
                />
                <p className="mt-4 text-xs font-bold uppercase tracking-widest text-accent">
                  Official Trademark of Audio Enterprise
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Brand Strengths */}
      <section className="border-b border-zinc-200 bg-surface py-12 sm:py-16">
        <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Why EM Audio"
            title="Built For Extreme Road & Stage Demands"
            subtitle="Precision acoustics combined with rugged birch enclosures and proprietary magnetic assemblies."
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: LayersIcon,
                title: 'Baltic Birch Cabinets',
                text: 'High-density multi-ply birch plywood coated in weather-resistant polyurea texture finish.'
              },
              {
                icon: RadioIcon,
                title: 'High-Power Voice Coils',
                text: 'Imported high-temp copper-clad aluminum voice coils for extreme thermal dissipation.'
              },
              {
                icon: WrenchIcon,
                title: 'Local Service & Spares',
                text: 'All original diaphragms, recone kits, and replacement parts readily in stock at our warehouse.'
              },
              {
                icon: ShieldCheckIcon,
                title: 'Engineered in India',
                text: 'Designed specifically to withstand voltage fluctuations and rigorous festival sound requirements.'
              }
            ].map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-accent hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Icon size={22} />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold uppercase tracking-tight text-ink">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Showrooms & Branches */}
      <section id="branches" className="py-14 sm:py-20">
        <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Our Presence"
            title="Experience Centers & Showrooms"
            subtitle="Visit our live audio testing studios to listen, audition, and configure your sound systems."
          />

          <div className="grid gap-8 lg:grid-cols-2">
            {SITE.branches.map((b) => (
              <div
                key={b.name}
                className="flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-card transition-all hover:border-accent/60"
              >
                <div>
                  <div className="inline-block rounded-md bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
                    {b.type}
                  </div>
                  <h3 className="mt-3 font-display text-2xl font-extrabold uppercase tracking-tight text-ink sm:text-3xl">
                    {b.name}
                  </h3>
                  <div className="mt-6 space-y-4 text-sm text-zinc-600">
                    <div className="flex items-start gap-3">
                      <MapPinIcon size={18} className="mt-0.5 shrink-0 text-accent" />
                      <div>
                        <span className="font-semibold text-ink">{b.city}</span>
                        <p>{b.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <PhoneIcon size={18} className="shrink-0 text-accent" />
                      <a href={`tel:${b.phone}`} className="font-semibold text-ink hover:text-accent">
                        {b.phone}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3 border-t border-zinc-100 pt-6">
                  <a
                    href={`https://wa.me/${SITE.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello, I would like to schedule a visit to the ${b.name}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center gap-2 rounded-md bg-[#25D366] px-5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#1faa54] transition-colors shadow-sm"
                  >
                    <WhatsAppIcon size={17} />
                    Schedule Demo
                  </a>
                  <a
                    href={SITE.phoneHref}
                    className="inline-flex h-11 items-center gap-2 rounded-md border border-zinc-300 px-5 text-xs font-bold uppercase tracking-wider text-ink hover:border-ink transition-colors"
                  >
                    <PhoneIcon size={15} />
                    Call Branch
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HelpCTA />
    </div>
  );
}
