import { WHATSAPP_NUMBER } from '../config/site';
import type { Product } from '../types';
import { formatPrice } from './format';

function buildUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function productUrl(product: Product): string {
  if (typeof window === 'undefined') return `https://ssaudio.in/product/${product.slug}`;
  return `${window.location.origin}/product/${product.slug}`;
}

/** Pre-filled WhatsApp inquiry for a specific product. */
export function generateWhatsAppInquiry(product: Product): string {
  const message = [
    'Hello, I am interested in:',
    '',
    `Product: ${product.name}`,
    `Model: ${product.model}`,
    `Category: ${product.category}`,
    `Price: ${formatPrice(product.price)}`,
    `Link: ${productUrl(product)}`,
    '',
    'Please share availability, specifications and best price.'
  ].join('\n');
  return buildUrl(message);
}

/** Pre-filled WhatsApp message for a category or section level inquiry. */
export function generateCategoryInquiry(category: string): string {
  return buildUrl(
    `Hello, I would like to know more about your ${category} range. Please share the catalogue, availability and best price.`
  );
}

/** Pre-filled WhatsApp message for a brand inquiry. */
export function generateBrandInquiry(brandName: string): string {
  return buildUrl(
    `Hello Audio Enterprise, I would like to know more about products from ${brandName}. Please share catalogue, availability and best price.`
  );
}

/** Generic "chat with us" message used by the floating button and page CTAs. */
export function generateGeneralInquiry(): string {
  return buildUrl(
    'Hello, I would like to know more about your professional audio products.'
  );
}

export interface ContactInquiryData {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  product?: Product;
}

/** Formats all contact inquiry fields into clean WhatsApp message text with structured layout */
export function formatContactInquiryMessage(data: ContactInquiryData): string {
  const cleanPhone = (data.phone || '').trim().replace(/\D/g, '');
  const formattedPhone = cleanPhone.length === 10 ? `+91 ${cleanPhone}` : data.phone.trim();

  const parts: string[] = [
    'Hello Audio Enterprise, I would like to make an inquiry:',
    '',
    '📋 *NEW CUSTOMER INQUIRY*',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    `👤 *Full Name:* ${data.name.trim()}`,
    `📞 *Contact Number:* ${formattedPhone}`
  ];

  if (data.email && data.email.trim()) {
    parts.push(`✉️ *Email Address:* ${data.email.trim()}`);
  }

  if (data.product) {
    parts.push(
      '',
      '📦 *PRODUCT DETAILS*',
      `*Product:* ${data.product.name} (${data.product.model})`,
      `*Category:* ${data.product.category}`,
      `*Price:* ${formatPrice(data.product.price)}`,
      `*Product Link:* ${productUrl(data.product)}`
    );
  }

  if (data.message && data.message.trim()) {
    parts.push(
      '',
      '📝 *Requirement / Message:*',
      data.message.trim()
    );
  }

  parts.push(
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    'Please share quotation, availability, and technical details. Thank you!'
  );

  return parts.join('\n');
}

/** Pre-filled WhatsApp inquiry formatted with all fields submitted in the contact form */
export function generateContactInquiry(data: ContactInquiryData): string {
  return buildUrl(formatContactInquiryMessage(data));
}

export function openWhatsApp(url: string): Window | null {
  if (typeof window === 'undefined') return null;
  return window.open(url, '_blank', 'noopener,noreferrer');
}
