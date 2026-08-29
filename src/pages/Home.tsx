import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, MessageCircleIcon } from 'lucide-react';
import { CategoryShowcase } from '../components/home/CategoryShowcase';
import { HelpCTA } from '../components/home/HelpCTA';
import { HeroCarousel } from '../components/home/HeroCarousel';
import { TopPicks } from '../components/home/TopPicks';
import { TrustBar } from '../components/home/TrustBar';
import { WhyChooseUs } from '../components/home/WhyChooseUs';
import { ContactSection } from '../components/contact/ContactSection';
import { CategorySection } from '../components/sections/CategorySection';
import { saleProducts } from '../data/products';
import { getProductsByCategoryName, getProductsByCategorySlug, getProductsBySubcategory } from '../services/productService';
import { generateCategoryInquiry } from '../utils/whatsapp';

export function Home() {
  return (
    <>
      <HeroCarousel />
      <TrustBar />

      <CategorySection
        id="sale"
        eyebrow="Limited period pricing"
        title="Sale Is Live"
        subtitle="Live offers across amplifiers, speakers, mixers, microphones and stage lighting."
        products={saleProducts}
        viewAllHref="/products?tag=sale"
        className="bg-surface" />
      

      <TopPicks />
      <CategoryShowcase />

      <CategorySection
        id="amplifiers"
        eyebrow="Category"
        title="Amplifiers"
        subtitle="Power your sound with reliable professional amplification."
        products={getProductsByCategoryName('Amplifiers')}
        variant="spec"
        specKeys={['Power', 'Channels']}
        showAvailability
        viewAllHref="/category/amplifiers"
        className="bg-white" />
      

      <CategorySection
        id="speakers"
        eyebrow="Category"
        title="Speakers & Tweeters"
        subtitle="Active and passive enclosures, subwoofers, woofer drivers, tweeters and compression drivers."
        products={getProductsByCategorySlug('speakers-tweeters')}
        variant="spec"
        specKeys={['Power', 'Frequency']}
        chips={[
        'Active Speakers',
        'Passive Speakers',
        'Subwoofers',
        'Tweeters',
        'Woofer Drivers',
        'Compression Drivers']
        }
        viewAllHref="/category/speakers-tweeters"
        className="bg-surface" />
      

      <CategorySection
        id="microphones"
        eyebrow="Category"
        title="Wired Microphones"
        subtitle="Professional wired microphones with the latest models and complete details."
        products={getProductsBySubcategory('Wired')}
        chips={[
        'Wired']
        }
        viewAllHref="/category/microphones"
        className="bg-white" />

      <CategorySection
        id="wireless-microphones"
        eyebrow="Category"
        title="Wireless Microphones"
        subtitle="Wireless microphone photos and products will be added soon."
        products={getProductsBySubcategory('Wireless')}
        chips={['Wireless']}
        viewAllHref="/category/microphones"
        className="bg-surface" />
      

      <CategorySection
        id="mixers"
        eyebrow="Category"
        title="Professional Mixers"
        subtitle="From compact 4-channel desks to 24-channel digital consoles."
        products={getProductsByCategoryName('Mixers')}
        variant="spec"
        specKeys={['Channels', 'Effects', 'USB', 'Bluetooth']}
        ctaLabel="Get Price on WhatsApp"
        viewAllHref="/category/mixers"
        className="bg-surface" />
      

      <CategorySection
        id="processors"
        eyebrow="Category"
        title="Audio Processors"
        subtitle="Signal processing, equalisation, crossovers and loudspeaker management."
        products={getProductsByCategoryName('Processors')}
        variant="spec"
        specKeys={['Inputs', 'Outputs', 'Bands', 'Channels']}
        viewAllHref="/category/processors"
        className="bg-white" />
      

      <CategorySection
        id="lighting"
        eyebrow="Category"
        title="Lighting & SFX"
        subtitle="Moving heads, LED PARs, lasers, strobes and atmospheric effects for unforgettable stages."
        products={getProductsByCategoryName('Lighting & SFX')}
        dark
        viewAllHref="/category/lighting-sfx"
        viewAllLabel="Explore Lighting"
        footer={
        <Link
          to="/category/lighting-sfx"
          className="group inline-flex h-12 items-center gap-2 rounded-md bg-accent px-6 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-ink">
          
            Explore Lighting
            <ArrowRightIcon size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        } />
      

      <CategorySection
        id="cables"
        eyebrow="Category"
        title="Wires & Cables"
        subtitle="Speaker, microphone, XLR, DMX, instrument and power cabling built for the road."
        products={getProductsByCategoryName('Wires & Cables')}
        variant="spec"
        specKeys={['Cable Type', 'Length', 'Connector']}
        ctaLabel="Send Inquiry"
        viewAllHref="/category/wires-cables"
        className="bg-white" />
      

      <CategorySection
        id="connectors"
        eyebrow="Category"
        title="Connectors & Adapters"
        subtitle="XLR, jack, Speakon, RCA, banana plugs and adapter kits."
        products={getProductsByCategoryName('Connectors')}
        layout="grid"
        variant="spec"
        specKeys={['Type', 'Quantity']}
        ctaLabel="Send Inquiry"
        viewAllHref="/category/connectors"
        className="bg-surface" />
      

      <CategorySection
        id="speaker-boxes"
        eyebrow="Category"
        title="Speaker Boxes"
        subtitle="Tour-grade empty cabinets ready for your drivers and horns."
        products={getProductsByCategoryName('Speaker Box')}
        variant="spec"
        specKeys={['Size', 'Material']}
        viewAllHref="/category/speaker-box"
        className="bg-white" />
      

      <CategorySection
        id="spare-parts"
        eyebrow="Category"
        title="Spare Parts"
        subtitle="Diaphragms, voice coils, recone kits and driver components."
        products={getProductsByCategoryName('Spare Parts')}
        viewAllHref="/category/spare-parts"
        className="bg-surface"
        footer={
        <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-zinc-200 bg-white p-6 sm:flex-row sm:items-center">
            <div>
              <h3 className="font-display text-xl font-extrabold uppercase tracking-tight text-ink">
                Need Help Finding a Part?
              </h3>
              <p className="mt-1 text-sm text-zinc-500">
                Send us the model number or a photo — we will identify the right component.
              </p>
            </div>
            <a
            href={generateCategoryInquiry('spare parts')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 shrink-0 items-center gap-2 rounded-md bg-[#1faa54] px-6 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#178c45]">
            
              <MessageCircleIcon size={16} />
              Talk to Expert on WhatsApp
            </a>
          </div>
        } />
      

      <CategorySection
        id="accessories"
        eyebrow="Category"
        title="Audio Accessories"
        subtitle="Stands, mounts, racks, power distribution and transport cases."
        products={getProductsByCategoryName('Accessories')}
        viewAllHref="/category/accessories"
        className="bg-white" />
      

      <WhyChooseUs />
      <HelpCTA />
      <ContactSection />
    </>);

}