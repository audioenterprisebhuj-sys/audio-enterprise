import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SparklesIcon,
  CpuIcon,
  SlidersIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  Volume2Icon,
  ZapIcon,
  CheckCircle2Icon
} from 'lucide-react';
import { WhatsAppIcon } from '../ui/WhatsAppIcon';
import { WHATSAPP_NUMBER } from '../../config/site';

interface InnovationPillar {
  id: string;
  icon: React.ElementType;
  title: string;
  shortDesc: string;
  tagline: string;
  spec: string;
  badge: string;
  highlights: string[];
  visualMetric: string;
  metricLabel: string;
}

const PILLARS: InnovationPillar[] = [
  {
    id: 'transducers',
    icon: CpuIcon,
    title: 'Transducer & Voice Coil Engineering',
    tagline: 'High-Temperature Endurance Under Relentless Tour Power',
    shortDesc: 'Designed from the molecular level with high-grade copper wire and heat-resistant Kapton formers to prevent thermal compression during 12+ hour concerts.',
    spec: '250°C Max Thermal Threshold',
    badge: 'Thermal Resilience',
    highlights: [
      'Reinforced cast aluminum baskets for continuous heat conduction',
      'High-energy neodymium & double-magnet ferrite topologies',
      'Ultra-linear long-throw suspension for distortion-free bass excursion'
    ],
    visualMetric: '0.04%',
    metricLabel: 'Total Harmonic Distortion at High Output'
  },
  {
    id: 'dispersion',
    icon: Volume2Icon,
    title: 'Precision Acoustic Waveguide',
    tagline: 'Phase-Aligned Sound That Covers Every Seat in the Arena',
    shortDesc: 'Mathematically modeled constant-directivity horn geometries ensure laser-focused sound projection with zero phase cancellation between adjacent drivers.',
    spec: '90° × 60° Uniform Horizontal Dispersion',
    badge: 'Coherent Acoustics',
    highlights: [
      'True phase-aligned titanium compression diaphragms',
      'Consistent frequency curve from front barricade to rear bleachers',
      'Eliminates acoustic harshness and high-frequency beam narrowing'
    ],
    visualMetric: '136 dB',
    metricLabel: 'Continuous Clean Sound Pressure Level'
  },
  {
    id: 'enclosures',
    icon: ShieldCheckIcon,
    title: 'Tour-Grade Baltic Birch Architecture',
    tagline: 'Acoustically Dead Enclosures Built for Rigorous Indian Roads',
    shortDesc: 'Crafted using multi-ply high-density Baltic birch plywood with internal matrix bracing and coated in military-grade polyurea texture paint.',
    spec: '18mm Multi-Ply Birch + Weatherproof Polyurea',
    badge: 'Structural Armor',
    highlights: [
      'Internal acoustic baffling eliminates unwanted cabinet resonance',
      'Impact-resistant, scratch-proof, and water-repellent finish',
      'Ergonomic recessed steel handles and heavy-gauge steel grilles'
    ],
    visualMetric: '100%',
    metricLabel: 'Acoustically Sweep-Tested Enclosures'
  },
  {
    id: 'tuning',
    icon: SlidersIcon,
    title: 'Built-In DSP & Acoustic Calibration',
    tagline: 'High Dynamic Headroom & Factory-Tuned Linear Response',
    shortDesc: 'Every power amplifier, processor, and active enclosure is pre-programmed with precision crossover slopes, thermal protection limiters, and harmonic balancing for maximum clarity and punch right out of the box.',
    spec: 'Sub-millisecond Internal Processing & Limiting',
    badge: 'Precision DSP',
    highlights: [
      'Factory pre-tuned crossover points for seamless speaker & subwoofer matching',
      'Extended bass reflex port engineering for deep low-end without distortion',
      'Optimized vocal presence curves built directly into our drivers & consoles'
    ],
    visualMetric: '24-bit',
    metricLabel: 'Studio-Grade Signal Processing Precision'
  }
];

export function BrandInnovation() {
  const [activeTab, setActiveTab] = useState(PILLARS[0].id);
  const activePillar = PILLARS.find((p) => p.id === activeTab) || PILLARS[0];
  const ActiveIcon = activePillar.icon;

  const whatsappInquiryUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    'Hello Audio Enterprise, I would like to inquire about purchasing professional audio products and equipment packages.'
  )}`;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-ink via-zinc-950 to-charcoal py-16 sm:py-24 text-white">
      {/* Background ambient lighting glows */}
      <div className="pointer-events-none absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-accent/15 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 right-1/4 h-96 w-96 rounded-full bg-orange-600/10 blur-[130px]" />

      <div className="relative mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/15 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] text-accent shadow-sm"
          >
            <SparklesIcon size={14} className="animate-pulse" />
            Brand Innovation & Sonic Craftsmanship
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 font-display text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-tight"
          >
            Engineering Pure{' '}
            <span className="bg-gradient-to-r from-accent via-orange-400 to-amber-300 bg-clip-text text-transparent">
              Sonic Power
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-sm sm:text-base leading-relaxed text-zinc-300"
          >
            Behind every stage performance, live concert, and auditorium installation is our obsession with acoustic physics. We don’t just assemble parts — we craft acoustic instruments designed to deliver pristine sound at staggering SPL.
          </motion.p>
        </div>

        {/* Tab Buttons Strip */}
        <div className="mt-10 sm:mt-14 flex flex-wrap justify-center gap-2 sm:gap-3">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            const isActive = pillar.id === activeTab;
            return (
              <button
                key={pillar.id}
                type="button"
                onClick={() => setActiveTab(pillar.id)}
                className={`group flex items-center gap-2 rounded-xl px-4 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-accent text-white shadow-lg shadow-accent/30 scale-105'
                    : 'bg-zinc-900/90 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-white' : 'text-accent group-hover:text-accent'} />
                <span>{pillar.title.split('&')[0].trim()}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Interactive Feature Showcase Card */}
        <div className="mt-8 rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900/90 via-zinc-900/60 to-zinc-950 p-6 sm:p-10 lg:p-12 shadow-2xl backdrop-blur-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePillar.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="grid gap-8 lg:grid-cols-12 lg:items-center"
            >
              {/* Left Column: Detailed Story */}
              <div className="lg:col-span-7">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/20 px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest text-accent border border-accent/30">
                    <ZapIcon size={13} />
                    {activePillar.badge}
                  </span>
                  <span className="rounded-full bg-zinc-800 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-zinc-300 border border-zinc-700">
                    {activePillar.spec}
                  </span>
                </div>

                <h3 className="mt-4 font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-tight text-white">
                  {activePillar.title}
                </h3>

                <p className="mt-2 text-sm sm:text-base font-semibold text-accent/90">
                  {activePillar.tagline}
                </p>

                <p className="mt-3 text-sm sm:text-[15px] leading-relaxed text-zinc-300">
                  {activePillar.shortDesc}
                </p>

                {/* Key Highlights */}
                <div className="mt-6 space-y-2.5">
                  {activePillar.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <div className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent">
                        <CheckCircle2Icon size={12} />
                      </div>
                      <span className="text-xs sm:text-sm text-zinc-300 font-medium">{h}</span>
                    </div>
                  ))}
                </div>

                {/* CTAs */}
                <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
                  <a
                    href={whatsappInquiryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#25D366] px-6 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white shadow-lg transition-transform hover:scale-[1.02] hover:bg-[#1faa54] active:scale-95"
                  >
                    <WhatsAppIcon size={18} />
                    Get Product Quotation
                  </a>

                  <Link
                    to="/products"
                    className="inline-flex h-12 items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/80 px-6 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white transition-all hover:border-accent hover:text-accent hover:bg-zinc-800"
                  >
                    Browse Equipment Catalogue
                    <ArrowRightIcon size={15} />
                  </Link>
                </div>
              </div>

              {/* Right Column: High-Impact Visual Card */}
              <div className="lg:col-span-5">
                <div className="relative overflow-hidden rounded-2xl border border-zinc-700/80 bg-zinc-950 p-6 sm:p-8 shadow-inner">
                  {/* Decorative glowing gradient circle */}
                  <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-accent/20 blur-[60px]" />

                  {/* Header in card */}
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 border border-accent/30 text-accent">
                        <ActiveIcon size={20} />
                      </div>
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                          LABORATORY BENCHMARK
                        </div>
                        <div className="font-display text-sm font-extrabold uppercase text-white">
                          Acoustic Verification
                        </div>
                      </div>
                    </div>
                    <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 border border-emerald-500/20">
                      PASSED QC
                    </span>
                  </div>

                  {/* Primary Big Metric */}
                  <div className="mt-6">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                      Engineering Rating
                    </span>
                    <div className="mt-1 font-display text-4xl sm:text-5xl font-black text-accent tracking-tight">
                      {activePillar.visualMetric}
                    </div>
                    <p className="mt-1 text-xs text-zinc-400 font-medium">
                      {activePillar.metricLabel}
                    </p>
                  </div>

                  {/* Simulated Audio Spectrum Waveform Bars */}
                  <div className="mt-6 border-t border-zinc-800/80 pt-5">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-3">
                      <span>Live Response Curve</span>
                      <span>20 Hz – 20 kHz Flat</span>
                    </div>

                    <div className="flex items-end justify-between gap-1.5 h-16 px-1">
                      {[42, 65, 88, 95, 76, 85, 92, 100, 84, 90, 72, 80, 95, 88, 70, 82, 60, 75].map((h, idx) => (
                        <div
                          key={idx}
                          className="w-full rounded-t bg-gradient-to-t from-accent/50 to-accent transition-all duration-500 hover:from-orange-400 hover:to-amber-300"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Trust footer note */}
                  <div className="mt-6 rounded-xl bg-zinc-900/80 border border-zinc-800 p-3 text-[11px] leading-relaxed text-zinc-400">
                    <span className="font-bold text-zinc-200">Stage Guarantee:</span> Every system is calibrated for minimum thermal creep and consistent phase alignment before final dispatch from our facility.
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Quick Innovation Stats Ribbon */}
        <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { value: '15+ Years', label: 'Pro Audio Craftsmanship', sub: 'Dedicated Stage Sound Engineering' },
            { value: '10,000+', label: 'Concert & Arena Stages', sub: 'Powered by Our Systems Across India' },
            { value: '100% Sweep', label: 'Factory Stress Tested', sub: 'Full Load & Burn-In Benchmarks' },
            { value: 'Direct Factory', label: 'Wholesale & Spares Access', sub: 'Original Recone Kits & Diaphragms' }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 text-center backdrop-blur-sm"
            >
              <div className="font-display text-2xl sm:text-3xl font-black text-accent tracking-tight">
                {stat.value}
              </div>
              <div className="mt-1 font-display text-sm font-bold uppercase tracking-tight text-white">
                {stat.label}
              </div>
              <div className="mt-0.5 text-[11px] text-zinc-400">{stat.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
