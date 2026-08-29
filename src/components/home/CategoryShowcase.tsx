import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from 'lucide-react';
import { getShowcaseCategories } from '../../services/categoryService';
import { SectionHeading } from '../ui/SectionHeading';

export function CategoryShowcase() {
  const categories = getShowcaseCategories();

  return (
    <section
      id="categories"
      aria-labelledby="categories-heading"
      className="bg-surface py-12 sm:py-16">
      
      <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div id="categories-heading">
          <SectionHeading
            eyebrow="Browse the catalogue"
            title="Explore Our Categories"
            subtitle="Eighteen product families covering everything from drivers and cabinets to stage lighting and spares."
            viewAllHref="/products"
            viewAllLabel="All Products" />
          
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {categories.map((category, i) =>
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: i % 4 * 0.05 }}>
            
              <Link
              to={`/category/${category.slug}`}
              className="group relative block h-full overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-lift">
              
                <div className="overflow-hidden bg-zinc-100">
                  <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110" />
                
                  <span
                  className="pointer-events-none absolute inset-x-0 top-0 aspect-[4/3] bg-ink/0 transition-colors duration-300 group-hover:bg-ink/25"
                  aria-hidden="true" />
                
                </div>
                {category.name === 'Microphones' &&
                <p className="px-4 pt-2 text-[10px] font-bold uppercase tracking-wider text-accent">
                    Wired / Wireless
                  </p>}
                <div className="p-4">
                  <h3 className="font-display text-[19px] font-bold uppercase leading-tight tracking-tight text-ink">
                    {category.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-zinc-500">
                    {category.description}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-accent">
                    Explore Products
                    <ArrowRightIcon
                    size={13}
                    className="transition-transform duration-300 group-hover:translate-x-1.5" />
                  
                  </span>
                </div>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </section>);

}