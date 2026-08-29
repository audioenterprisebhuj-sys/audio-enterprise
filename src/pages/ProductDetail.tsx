import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle2Icon,
  ChevronRightIcon,
  ClockIcon,
  FileTextIcon,
  MessageCircleIcon,
  PackageSearchIcon,
  PhoneIcon,
  ShieldCheckIcon,
  TruckIcon,
  WrenchIcon } from
'lucide-react';
import { InquiryForm } from '../components/contact/InquiryForm';
import { ProductCard } from '../components/product/ProductCard';
import { ProductRail } from '../components/product/ProductRail';
import { Rating } from '../components/ui/Rating';
import { SectionHeading } from '../components/ui/SectionHeading';
import { SITE } from '../config/site';
import { getProductBySlug, getRelatedProducts } from '../services/productService';
import { discountPercent, formatPrice } from '../utils/format';
import { generateWhatsAppInquiry } from '../utils/whatsapp';

const availabilityIcon = {
  'In Stock': CheckCircle2Icon,
  'Limited Stock': ClockIcon,
  'Made To Order': WrenchIcon
};

export function ProductDetail() {
  const { slug = '' } = useParams();
  const product = getProductBySlug(slug);
  const [activeImage, setActiveImage] = useState(0);
  const activeImageSource = product ? product.images[activeImage] ?? product.image : '';
  const isActiveEmoji = activeImageSource.startsWith('emoji:');

  useEffect(() => {
    setActiveImage(0);
    window.scrollTo({ top: 0 });
  }, [slug]);

  if (!product) {
    return (
      <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-4 px-4 py-28 text-center">
        <PackageSearchIcon size={34} className="text-zinc-400" />
        <h1 className="font-display text-3xl font-extrabold uppercase text-ink">
          Product not found
        </h1>
        <p className="text-sm text-zinc-500">
          The product you are looking for may have been renamed or removed.
        </p>
        <Link
          to="/products"
          className="rounded-md bg-ink px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-accent">
          
          Browse All Products
        </Link>
      </div>);

  }

  const off = discountPercent(product.price, product.oldPrice);
  const related = getRelatedProducts(product);
  const AvailabilityIcon = availabilityIcon[product.availability];
  const whatsappHref = generateWhatsAppInquiry(product);

  return (
    <div className="bg-surface">
      <div className="mx-auto w-full max-w-[1320px] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <nav aria-label="Breadcrumb" className="mb-5">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-zinc-500">
            <li>
              <Link to="/" className="hover:text-accent">
                Home
              </Link>
            </li>
            <ChevronRightIcon size={13} aria-hidden="true" />
            <li>
              <Link to="/products" className="hover:text-accent">
                Products
              </Link>
            </li>
            <ChevronRightIcon size={13} aria-hidden="true" />
            <li className="text-ink">{product.name}</li>
          </ol>
        </nav>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_1fr]">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <motion.div
              key={activeImage}
              initial={{ opacity: 0.4 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="relative overflow-hidden rounded-xl border border-zinc-200 bg-white">
              
              {product.badge &&
              <span className="absolute left-3 top-3 z-10 rounded bg-accent px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white">
                  {product.badge}
                </span>
              }
              {!activeImageSource ?
              <div className="flex aspect-square w-full items-center justify-center bg-zinc-50 text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Photo Coming Soon
                </div> : isActiveEmoji ?
              <div className="flex aspect-square w-full items-center justify-center bg-zinc-50 text-[120px]" aria-label={product.name}>
                  {activeImageSource.slice(6)}
                </div> :
              <img
                src={activeImageSource}
                alt={product.name}
                className="aspect-square w-full object-cover" />
              }
              
            </motion.div>
            {product.images.length > 1 &&
            <div className="mt-3 flex gap-3">
                {product.images.map((image, i) =>
              <button
                key={image + i}
                type="button"
                onClick={() => setActiveImage(i)}
                aria-label={`View image ${i + 1}`}
                className={`overflow-hidden rounded-lg border-2 bg-white transition-colors ${
                i === activeImage ? 'border-accent' : 'border-zinc-200 hover:border-zinc-400'}`
                }>
                
                    {image.startsWith('emoji:') ?
                    <span className="flex h-20 w-20 items-center justify-center bg-zinc-50 text-4xl sm:h-24 sm:w-24" aria-hidden="true">
                        {image.slice(6)}
                      </span> :
                    <img
                      src={image}
                      alt=""
                      loading="lazy"
                      className="h-20 w-20 object-cover sm:h-24 sm:w-24" />
                    }
                
                  </button>
              )}
              </div>
            }
          </div>

          <div>
            <div className="rounded-xl border border-zinc-200 bg-white p-5 sm:p-7">
              <p className="text-[11px] font-bold uppercase tracking-wider text-accent">
                {product.category}
              </p>
              <h1 className="mt-1.5 font-display text-3xl font-extrabold uppercase leading-none tracking-tight text-ink sm:text-4xl">
                {product.name}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
                <Rating value={product.rating} reviews={product.reviews} size="md" />
                <span className="text-xs font-semibold text-zinc-500">
                  Brand: <span className="text-ink">{product.brand}</span>
                </span>
                <span className="text-xs font-semibold text-zinc-500">
                  Model: <span className="text-ink">{product.model}</span>
                </span>
              </div>

              <div className="mt-5 flex flex-wrap items-end gap-3">
                <span className="font-display text-4xl font-extrabold tracking-tight text-ink">
                  {formatPrice(product.price)}
                </span>
                {product.oldPrice &&
                <span className="pb-1 text-base font-medium text-zinc-400 line-through">
                    {formatPrice(product.oldPrice)}
                  </span>
                }
                {off !== null &&
                <span className="mb-1 rounded bg-accent/10 px-2 py-1 text-xs font-extrabold uppercase text-accent">
                    {off}% Off
                  </span>
                }
              </div>

              <p
                className={`mt-2 inline-flex items-center gap-1.5 text-sm font-semibold ${
                product.availability === 'In Stock' ?
                'text-emerald-600' :
                product.availability === 'Limited Stock' ?
                'text-amber-600' :
                'text-zinc-500'}`
                }>
                
                <AvailabilityIcon size={15} />
                {product.availability}
              </p>

              <p className="mt-4 text-[15px] leading-relaxed text-zinc-600">
                {product.description}
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-md bg-[#1faa54] px-6 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#178c45] sm:text-sm">
                  
                  <MessageCircleIcon size={17} />
                  Send Inquiry on WhatsApp
                </a>
                <a
                  href="#request-quote"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-ink px-6 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-accent sm:text-sm">
                  
                  <FileTextIcon size={16} />
                  Request a Quote
                </a>
                <a
                  href={SITE.phoneHref}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-zinc-300 px-6 text-xs font-bold uppercase tracking-wider text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white sm:text-sm">
                  
                  <PhoneIcon size={16} />
                  Call Now
                </a>
              </div>

              <ul className="mt-6 grid gap-3 border-t border-zinc-200 pt-5 sm:grid-cols-3">
                {[
                { Icon: ShieldCheckIcon, text: 'Genuine product' },
                { Icon: TruckIcon, text: 'Pan-India dispatch' },
                { Icon: WrenchIcon, text: 'Installation support' }].
                map(({ Icon, text }) =>
                <li key={text} className="flex items-center gap-2 text-xs font-semibold text-zinc-600">
                    <Icon size={15} className="text-accent" />
                    {text}
                  </li>
                )}
              </ul>
            </div>

            <section
              aria-labelledby="specs-heading"
              className="mt-5 rounded-xl border border-zinc-200 bg-white p-5 sm:p-7">
              
              <h2
                id="specs-heading"
                className="font-display text-2xl font-extrabold uppercase tracking-tight text-ink">
                
                Specifications
              </h2>
              <dl className="mt-4 divide-y divide-zinc-100">
                {Object.entries(product.specifications).map(([key, value]) =>
                <div key={key} className="flex items-baseline justify-between gap-6 py-2.5">
                    <dt className="text-sm font-medium text-zinc-500">{key}</dt>
                    <dd className="text-right text-sm font-bold text-ink">{value}</dd>
                  </div>
                )}
              </dl>
            </section>

            <div id="request-quote" className="mt-5 scroll-mt-24">
              <InquiryForm product={product} title="Request a Quote" />
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 &&
      <section
        aria-labelledby="related-heading"
        className="border-t border-zinc-200 bg-white py-12">
        
          <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
            <div id="related-heading">
              <SectionHeading
              eyebrow="You may also need"
              title="Related Products"
              viewAllHref="/products" />
            
            </div>
            <ProductRail ariaLabel="Related products">
              {related.map((item) =>
            <ProductCard key={item.id} product={item} />
            )}
            </ProductRail>
          </div>
        </section>
      }
    </div>);

}