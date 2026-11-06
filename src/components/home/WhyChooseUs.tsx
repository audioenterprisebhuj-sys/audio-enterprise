import React from 'react';
import { motion } from 'framer-motion';
import {
  BoxesIcon,
  ClipboardCheckIcon,
  HeadphonesIcon,
  TruckIcon,
  UsersIcon,
  ShieldCheckIcon,
  ActivityIcon,
  CpuIcon,
  SlidersIcon
} from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { SITE } from '../../config/site';

const REASONS = [
  {
    Icon: ClipboardCheckIcon,
    title: 'Acoustic Engineering',
    text: 'Every enclosure and component is engineered for linear frequency response, high SPL, and maximum acoustic efficiency.'
  },
  {
    Icon: ActivityIcon,
    title: 'Rigorous Stress Testing',
    text: '100% full-power burn-in tests and acoustic calibration ensure stability through grueling live concerts and tour conditions.'
  },
  {
    Icon: BoxesIcon,
    title: 'Direct Manufacturing',
    text: 'High-output transducers, amplifiers, mixers, wired stage microphones, and touring spare parts ready for rapid dispatch.'
  },
  {
    Icon: SlidersIcon,
    title: 'Factory-Tuned Components',
    text: 'Factory-calibrated crossover presets and precision driver matching so your speakers and amplifiers deliver peak headroom right out of the box.'
  },
  {
    Icon: TruckIcon,
    title: 'Pan-India Dispatch',
    text: 'Heavy-duty flight case packaging and safe logistics to any district or city across the country.'
  },
  {
    Icon: UsersIcon,
    title: 'Direct Factory Pricing',
    text: 'Manufacturer-direct rates and wholesale equipment access for rental companies, sound operators, DJs, and live sound buyers.'
  }
];

const STATS = [
  { value: '14+', label: 'Years Sound Heritage' },
  { value: '100%', label: 'Factory Tested' },
  { value: '1,500+', label: 'Live Stages Powered' },
  { value: '24/7', label: 'Engineering Support' }
];

const MANUFACTURING_PILLARS = [
  {
    Icon: ShieldCheckIcon,
    title: 'Heavy-Duty Tour Reliability',
    desc: 'Crafted with premium cast aluminum baskets, copper voice coils, and robust heat-sink designs.'
  },
  {
    Icon: CpuIcon,
    title: 'Precision Component Matching',
    desc: 'Tight phase alignment and zero-compromise crossover design for crystal-clear vocals and punchy sub-bass.'
  }
];

export function WhyChooseUs() {
  return (
    <section id="why-us" aria-labelledby="why-us-heading" className="bg-white py-14 sm:py-20 border-t border-zinc-200">
      <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div id="why-us-heading">
          <SectionHeading
            eyebrow="Manufacturer Heritage"
            title="Why Choose Audio Enterprise"
            subtitle="Professional audio products manufacturer and sound engineering specialists delivering road-tested acoustic precision for India's demanding live stages."
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          {/* 6 Reasons Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {REASONS.map(({ Icon, title, text }, i) => (
              <motion.article
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: (i % 2) * 0.06 }}
                className="rounded-2xl border border-zinc-200 bg-white p-5 transition-all hover:border-accent/60 hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Icon size={20} />
                </div>
                <h3 className="mt-3.5 font-display text-base font-bold uppercase tracking-tight text-ink">
                  {title}
                </h3>
                <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-zinc-500">{text}</p>
              </motion.article>
            ))}
          </div>

          {/* High-Impact Manufacturing Spec & Stats Card (No speaker photo) */}
          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-ink via-zinc-950 to-zinc-900 p-6 sm:p-8 text-white shadow-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              Engineered & Manufactured In India
            </span>

            <h3 className="mt-4 font-display text-2xl font-black uppercase tracking-tight text-white sm:text-3xl leading-snug">
              Built for Relentless <span className="text-accent">Live Performance</span>
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-zinc-300">
              At {SITE.brand}, we design, assemble, and test professional audio equipment that withstands severe weather, extreme voltage swings, and continuous high-SPL demands of Indian live events.
            </p>

            {/* Manufacturing Highlights */}
            <div className="mt-6 space-y-4 border-t border-white/10 pt-6">
              {MANUFACTURING_PILLARS.map(({ Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-3.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-accent">
                    <Icon size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-100">
                      {title}
                    </h4>
                    <p className="mt-0.5 text-xs text-zinc-400 leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats Grid */}
            <dl className="mt-8 grid grid-cols-2 gap-3 border-t border-white/10 pt-6">
              {STATS.map((stat) => (
                <div key={stat.label} className="rounded-xl bg-white/5 p-3.5 text-center border border-white/5">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="block font-display text-2xl font-extrabold text-accent">
                      {stat.value}
                    </span>
                    <span className="mt-1 block text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      {stat.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
