import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronRightIcon,
  FileTextIcon,
  PackageSearchIcon,
  PhoneIcon,
  ShieldCheckIcon,
  TruckIcon,
  WrenchIcon
} from 'lucide-react';
import { InquiryForm } from '../components/contact/InquiryForm';
import { ProductCard } from '../components/product/ProductCard';
import { ProductRail } from '../components/product/ProductRail';
import { Rating } from '../components/ui/Rating';
import { SectionHeading } from '../components/ui/SectionHeading';
import { WhatsAppIcon } from '../components/ui/WhatsAppIcon';
import { SITE } from '../config/site';
import { getRelatedProducts, useProduct } from '../services/productService';
import { discountPercent, formatPrice } from '../utils/format';
import { generateWhatsAppInquiry } from '../utils/whatsapp';


export function ProductDetail() {
  const { slug = '' } = useParams();
  const product = useProduct(slug);
  const [activeImage, setActiveImage] = useState(0);
  const activeImageSource = product ? ((product.images && product.images[activeImage]) ?? product.image) : '';

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
          className="rounded-md bg-ink px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-accent"
        >
          Browse All Products
        </Link>
      </div>
    );
  }

  const off = discountPercent(product.price, product.oldPrice);
  const related = getRelatedProducts(product);
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
              className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-card"
            >
              {product.badge && (
                <span className="absolute left-3 top-3 z-10 rounded bg-accent px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-sm">
                  {product.badge}
                </span>
              )}
              {!activeImageSource ? (
                <div className="flex h-[300px] sm:h-[360px] lg:h-[400px] xl:h-[420px] w-full items-center justify-center bg-zinc-50 text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Photo Coming Soon
                </div>
              ) : (
                <div className="flex h-[300px] sm:h-[360px] lg:h-[400px] xl:h-[420px] w-full items-center justify-center bg-[radial-gradient(circle_at_center,_rgba(255,255,255,1),_rgba(244,244,245,0.7))] p-4 sm:p-6 lg:p-8">
                  <img
                    src={activeImageSource}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain object-center transition-transform duration-300 hover:scale-105"
                  />
                </div>
              )}
            </motion.div>
            {Array.isArray(product.images) && product.images.length > 1 && (
              <div className="mt-3 flex gap-2.5 overflow-x-auto thin-scrollbar pb-1">
                {product.images.map((image, i) => (
                  <button
                    key={image + i}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    aria-label={`View image ${i + 1}`}
                    className={`flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 bg-white p-1 transition-all cursor-pointer ${
                      i === activeImage
                        ? 'border-accent shadow-sm ring-2 ring-accent/20'
                        : 'border-zinc-200 hover:border-zinc-400'
                    }`}
                  >
                    <img
                      src={image}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-contain object-center"
                    />
                  </button>
                ))}
              </div>
            )}
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
                {product.oldPrice && (
                  <span className="pb-1 text-base font-medium text-zinc-400 line-through">
                    {formatPrice(product.oldPrice)}
                  </span>
                )}
                {off !== null && (
                  <span className="mb-1 rounded bg-accent/10 px-2 py-1 text-xs font-extrabold uppercase text-accent">
                    {off}% Off
                  </span>
                )}
              </div>

              

              <p className="mt-4 text-[15px] leading-relaxed text-zinc-600">
                {product.description}
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-md bg-[#25D366] px-6 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#1faa54] sm:text-sm shadow-sm"
                >
                  <WhatsAppIcon size={19} />
                  Send Inquiry on WhatsApp
                </a>
                <a
                  href="#inquiry"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-ink px-6 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-accent sm:text-sm"
                >
                  <FileTextIcon size={16} />
                  Inquire
                </a>
                <a
                  href={SITE.phoneHref}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-zinc-300 px-6 text-xs font-bold uppercase tracking-wider text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white sm:text-sm"
                >
                  <PhoneIcon size={16} />
                  Call Now
                </a>
              </div>

              <ul className="mt-6 grid gap-3 border-t border-zinc-200 pt-5 sm:grid-cols-3">
                {[
                  { Icon: ShieldCheckIcon, text: 'Genuine product' },
                  { Icon: TruckIcon, text: 'Pan-India dispatch' },
                  { Icon: WrenchIcon, text: 'Installation support' }
                ].map(({ Icon, text }) => (
                  <li key={text} className="flex items-center gap-2 text-xs font-semibold text-zinc-600">
                    <Icon size={15} className="text-accent" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>

            <section
              aria-labelledby="specs-heading"
              className="mt-5 rounded-xl border border-zinc-200 bg-white p-5 sm:p-7"
            >
              <h2
                id="specs-heading"
                className="font-display text-2xl font-extrabold uppercase tracking-tight text-ink"
              >
                Specifications
              </h2>
              <dl className="mt-4 divide-y divide-zinc-100">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex items-baseline justify-between gap-6 py-2.5">
                    <dt className="text-sm font-medium text-zinc-500">{key}</dt>
                    <dd className="text-right text-sm font-bold text-ink">{value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <div id="inquiry" className="mt-5 scroll-mt-24">
              <InquiryForm product={product} title="Product Inquiry" />
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section
          aria-labelledby="related-heading"
          className="border-t border-zinc-200 bg-white py-12"
        >
          <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
            <div id="related-heading">
              <SectionHeading
                eyebrow="You may also need"
                title="Related Products"
                viewAllHref="/products"
              />
            </div>
            <ProductRail ariaLabel="Related products">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </ProductRail>
          </div>
        </section>
      )}
    </div>
  );
}
