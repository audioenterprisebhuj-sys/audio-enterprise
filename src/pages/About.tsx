import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  SparklesIcon,
  CpuIcon,
  ShieldCheckIcon,
  ActivityIcon,
  SlidersIcon,
  AwardIcon,
  CheckCircle2Icon
} from 'lucide-react';
import { HelpCTA } from '../components/home/HelpCTA';
import { WhyChooseUs } from '../components/home/WhyChooseUs';
import { SITE } from '../config/site';
import { IMG } from '../data/images';

const CORE_VALUES = [
  {
    Icon: CpuIcon,
    title: 'Acoustic Precision Engineering',
    desc: 'We obsess over every detail of transducer parameters—linear excursion, magnetic flux density, and thermal dissipation—to deliver authentic, undistorted sound at extreme volume levels.'
  },
  {
    Icon: ActivityIcon,
    title: '24-Hour Stress & Burn-In Testing',
    desc: 'Every amplifier module and speaker system is rigorously load-tested in our testing facility to guarantee rock-solid stability during marathons of live performance and festival events.'
  },
  {
    Icon: ShieldCheckIcon,
    title: 'Road-Ready Industrial Build',
    desc: 'Crafted with premium high-density birch enclosures, scratch-resistant polyurea coatings, and hardened steel grilles built to withstand heavy transport across all Indian road conditions.'
  },
  {
    Icon: SlidersIcon,
    title: 'Factory-Calibrated DSP & Presets',
    desc: 'Pre-calibrated phase curves, protective limiters, and crossover presets engineered directly into the hardware for optimal punch, vocal clarity, and sub-bass depth right out of the box.'
  }
];

const HIGHLIGHTS = [
  'Custom-engineered voice coils with pure copper wire and high-temperature Kapton formers',
  'Reinforced cast aluminum speaker chassis designed for maximum thermal heat sinking',
  'Precision titanium compression drivers for silky, non-fatiguing high-frequency dispersion',
  '100% factory acoustic sweep testing to ensure zero resonance or harmonic artifacts',
  'Wholesale equipment supply direct to sound operators, rental companies, and audio dealers'
];

export function About() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo({ top: 0 });
  }, [location]);

  return (
    <div className="bg-white">
      {/* Hero Header */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-ink via-zinc-950 to-zinc-900 border-b border-zinc-800">
        <img
          src={IMG.heroStage}
          alt="Audio Enterprise manufacturing and live sound"
          className="absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-luminosity"
        />
        
        <div className="relative mx-auto w-full max-w-[1320px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/15 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
              <SparklesIcon size={13} />
              Professional Audio Products Manufacturer
            </span>
            <h1 className="mt-4 font-display text-4xl font-extrabold uppercase leading-none tracking-tight text-white sm:text-6xl">
              Engineering The Sound of <span className="text-accent">Excellence</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-zinc-300">
              Headquartered in Bhuj, Gujarat, {SITE.brand} stands as a premier manufacturer of high-performance sound reinforcement systems. We unite passionate acoustic craftsmanship with modern engineering to craft audio gear that commands the stage.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Brand Story & Manufacturing Philosophy */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent">
                Our Story & Heritage
              </span>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-ink">
                Built by Sound Engineers, For Sound Professionals
              </h2>
              <div className="mt-6 space-y-4 text-sm sm:text-base leading-relaxed text-zinc-600">
                <p>
                  At {SITE.brand}, sound is not just equipment—it is our lifelong discipline. Founded with an uncompromising mission to build tour-grade pro audio gear right here in Gujarat, we have grown into one of western India's most trusted manufacturers for stage audio, festival sound rigs, DJs, and live event sound operators.
                </p>
                <p>
                  Every Indian sound environment is unique—from dusty outdoor festival grounds under scorching summer sun to high-decibel multi-day wedding celebrations. We design our enclosures, select our voice coils, and tune our crossover networks specifically to conquer these rigorous challenges without ever sacrificing acoustic warmth, intelligible vocals, or gut-punching low end.
                </p>
                <p>
                  When you invest in {SITE.brand} equipment, you deal directly with the engineers who build and stand behind every single unit. We provide direct technical guidance, custom system designs, and prompt after-sales support with genuine spare components always on hand.
                </p>
              </div>
            </div>

            {/* Quality Standard Highlights Box */}
            <div className="rounded-3xl border border-zinc-200 bg-surface p-8 sm:p-10 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-white shadow-md">
                  <AwardIcon size={24} />
                </div>
                <div>
                  <h3 className="font-display text-xl font-black uppercase tracking-tight text-ink">
                    Our Manufacturing Promise
                  </h3>
                  <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                    Uncompromising Quality & 100% Genuine Parts
                  </p>
                </div>
              </div>

              <ul className="mt-8 space-y-4">
                {HIGHLIGHTS.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-zinc-700">
                    <CheckCircle2Icon size={18} className="mt-0.5 shrink-0 text-accent" />
                    <span className="font-medium leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Core Engineering Pillars */}
      <section className="bg-zinc-50 py-16 sm:py-20 border-y border-zinc-200">
        <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent">
              Engineering Disciplines
            </span>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-ink">
              The Technology Behind The Punch
            </h2>
            <p className="mt-3 text-sm sm:text-base text-zinc-600">
              From raw component fabrication to acoustic chamber evaluation, our four core pillars deliver consistent tour-grade sound.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CORE_VALUES.map(({ Icon, title, desc }, idx) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.08 }}
                className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:border-accent/60 transition-all hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Icon size={22} />
                </div>
                <h3 className="mt-4 font-display text-base font-bold uppercase tracking-tight text-ink">
                  {title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-zinc-500">
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section (speaker photo removed, updated with industrial spec card) */}
      <WhyChooseUs />

      <HelpCTA />
    </div>
  );
}
