import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  RadioIcon,
  MusicIcon,
  Mic2Icon,
  SparklesIcon,
  TruckIcon,
  ArrowRightIcon,
  Volume2Icon
} from 'lucide-react';
import { WhatsAppIcon } from '../ui/WhatsAppIcon';
import { WHATSAPP_NUMBER } from '../../config/site';

interface ApplicationItem {
  id: string;
  icon: React.ElementType;
  title: string;
  category: string;
  description: string;
  keyFeature: string;
  recommendedCategory: string;
  recommendedSlug: string;
  gradient: string;
}

const APPLICATIONS: ApplicationItem[] = [
  {
    id: 'concerts',
    icon: RadioIcon,
    category: 'Stadium & Outdoor Stages',
    title: 'Live Concerts & Festivals',
    description:
      'High-impact vertical line arrays, dual-18" subwoofers, and high-power tour amplifiers designed to project clear vocals and chest-thumping bass across crowds of 10,000+ without distortion.',
    keyFeature: 'Up to 138 dB Peak SPL • 120m Throw',
    recommendedCategory: 'Power Amplifiers & Subwoofers',
    recommendedSlug: 'power-amplifiers',
    gradient: 'from-orange-500/10 via-orange-500/5 to-transparent'
  },
  {
    id: 'clubs',
    icon: MusicIcon,
    category: 'High-Energy Dancefloors',
    title: 'Clubs, Lounges & DJ Booths',
    description:
      'Engineered for relentless basslines and rapid transients. High-damping factor mixers and precision DSP processors keep the energy explosive from opening set to early morning.',
    keyFeature: 'Sub-bass down to 28 Hz • Zero Clip DSP',
    recommendedCategory: 'Mixers & Processors',
    recommendedSlug: 'mixers',
    gradient: 'from-amber-500/10 via-amber-500/5 to-transparent'
  },
  {
    id: 'auditoriums',
    icon: Mic2Icon,
    category: 'Theatres & Performing Arts',
    title: 'Auditoriums & Corporate Halls',
    description:
      'Acoustically linear stage monitors and point-source cabinets that prioritize vocal intelligibility, smooth off-axis response, and natural acoustic warmth for speech and live instrumentation.',
    keyFeature: '90°×60° Constant Directivity • Flat Response',
    recommendedCategory: 'Microphones & Speakers',
    recommendedSlug: 'microphones',
    gradient: 'from-blue-500/10 via-blue-500/5 to-transparent'
  },
  {
    id: 'worship',
    icon: SparklesIcon,
    category: 'Community & Devotional Arenas',
    title: 'Houses of Worship & Celebrations',
    description:
      'Custom-engineered column arrays, long-throw horn drivers, and feedback-resistant wireless microphones that carry sacred chants, prayers, and live music with crystal transparency.',
    keyFeature: 'Feedback Suppression • Wide Acoustic Throw',
    recommendedCategory: 'Speakers & Tweeters',
    recommendedSlug: 'speakers-tweeters',
    gradient: 'from-purple-500/10 via-purple-500/5 to-transparent'
  },
  {
    id: 'touring',
    icon: TruckIcon,
    category: 'Hire & Production Fleets',
    title: 'Touring Hire & Sound Engineers',
    description:
      'Ruggedized tour flight-cases, quick-lock rigging hardware, heavy-duty snakes, and genuine factory replacement parts engineered for fast loading and dependable nightly road performance.',
    keyFeature: 'Quick-Lock Rigging • Polyurea Protective Armor',
    recommendedCategory: 'Accessories & Spare Parts',
    recommendedSlug: 'accessories',
    gradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent'
  }
];

export function CreativeApplications() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    'Hello Audio Enterprise, I would like to inquire about purchasing professional audio products and equipment packages.'
  )}`;

  return (
    <section className="bg-surface py-16 sm:py-24 border-t border-b border-zinc-200">
      <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-[0.2em] text-accent">
              <Volume2Icon size={14} />
              Professional Audio Products In Action
            </span>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-ink">
              Crafted For <span className="text-accent">Every Stage</span>
            </h2>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-zinc-600">
              From high-output stadium festivals to indoor performance halls, our specialized audio equipment is engineered to deliver high-SPL acoustic power and reliability for every live setup.
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-[#25D366] px-5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-transform hover:scale-[1.02] hover:bg-[#1faa54]"
          >
            <WhatsAppIcon size={16} />
            Inquire on WhatsApp
          </a>
        </div>

        {/* Application Cards Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {APPLICATIONS.map((app, index) => {
            const Icon = app.icon;
            return (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-card bg-gradient-to-b ${app.gradient}`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                      <Icon size={22} />
                    </div>
                    <span className="rounded-full bg-zinc-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                      {app.category}
                    </span>
                  </div>

                  <h3 className="mt-5 font-display text-2xl font-extrabold uppercase tracking-tight text-ink group-hover:text-accent transition-colors">
                    {app.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-zinc-600">
                    {app.description}
                  </p>
                </div>

                <div className="mt-6 border-t border-zinc-100 pt-4">
                  <div className="text-[11px] font-bold uppercase tracking-wide text-zinc-400">
                    Performance Benchmark
                  </div>
                  <div className="mt-0.5 text-xs font-extrabold text-ink">
                    {app.keyFeature}
                  </div>

                  <Link
                    to={`/category/${app.recommendedSlug}`}
                    className="mt-3.5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent transition-all group-hover:gap-2.5"
                  >
                    <span>Explore {app.recommendedCategory}</span>
                    <ArrowRightIcon size={14} />
                  </Link>
                </div>
              </motion.div>
            );
          })}

          {/* 6th Card: Complete Audio Equipment Packages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="flex flex-col justify-between rounded-2xl border border-dashed border-accent/50 bg-gradient-to-br from-accent/10 via-orange-50 to-white p-6 shadow-sm"
          >
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-white shadow-md shadow-accent/20">
                <SparklesIcon size={22} />
              </div>

              <span className="mt-4 inline-block text-[10px] font-extrabold uppercase tracking-widest text-accent">
                Factory Direct Supply
              </span>

              <h3 className="mt-1 font-display text-2xl font-extrabold uppercase tracking-tight text-ink">
                Complete Stage Packages
              </h3>

              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-zinc-600">
                Purchase complete matched audio hardware sets — pairing high-output line arrays, dual subwoofers, touring amplifiers, mixers, and stage cabling at direct factory wholesale rates.
              </p>
            </div>

            <div className="mt-6 border-t border-orange-100 pt-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-accent shadow-sm"
              >
                <WhatsAppIcon size={16} />
                Inquire on WhatsApp
              </a>
            </div>
          </motion.div>
        </div>

        {/* Inspirational Ethos Banner */}
        <div className="mt-14 rounded-2xl bg-gradient-to-r from-ink via-zinc-900 to-charcoal p-8 sm:p-10 text-white shadow-card">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-2xl">
              <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-accent">
                Our Acoustic Commitment
              </span>
              <p className="mt-2 font-display text-xl sm:text-2xl font-bold uppercase tracking-tight text-white leading-snug">
                “Sound is not merely heard — it is felt. We manufacture instruments of acoustic power so performers, sound operators, and audiences experience pure audio clarity.”
              </p>
              <p className="mt-2 text-xs text-zinc-400">
                Audio Enterprise & SS Audio — Bhuj, Gujarat • Professional Audio Products Manufacturer
              </p>
            </div>

            <div className="shrink-0 flex flex-wrap gap-3">
              <Link
                to="/about"
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-accent px-6 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-accent/25 hover:bg-accent-dark transition-all"
              >
                Read Our Story
                <ArrowRightIcon size={15} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
