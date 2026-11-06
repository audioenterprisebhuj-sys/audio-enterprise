import React, { useState } from 'react';
import { AlertCircleIcon, CheckCircle2Icon, CheckIcon, Loader2Icon, SendIcon } from 'lucide-react';
import { WhatsAppIcon } from '../ui/WhatsAppIcon';
import { createInquiry } from '../../services/inquiryService';
import {
  generateContactInquiry,
  openWhatsApp
} from '../../utils/whatsapp';
import type { Product } from '../../types';

interface InquiryFormProps {
  product?: Product;
  title?: string;
}

type Status = 'idle' | 'submitting' | 'success' | 'error';

// ==========================================
// Strict Regex Limitation Rules
// ==========================================
// 1. Email Regex: Requires valid username, '@', valid domain, and 2+ char extension (e.g. name@domain.com)
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// 2. Phone Regex: Exactly 10 digits starting with Indian mobile prefixes (6, 7, 8, or 9)
export const PHONE_REGEX = /^[6-9]\d{9}$/;

// 3. Name Regex: Only letters, spaces, dots and apostrophes allowed (2 to 50 characters)
export const NAME_REGEX = /^[a-zA-Z\s'.]{2,50}$/;

export function validatePhone(phone: string): string | null {
  const trimmed = phone.trim();
  if (!trimmed) {
    return 'Contact number is required (10 digits)';
  }
  const digits = trimmed.replace(/\D/g, '');
  if (digits.length === 0) {
    return 'Only numeric digits allowed';
  }
  if (digits.length !== 10) {
    return `Enter exactly 10 digits (currently ${digits.length}/10)`;
  }
  if (!PHONE_REGEX.test(digits)) {
    return '10-digit number must start with 6, 7, 8, or 9';
  }
  return null;
}

export function validateEmail(email: string): string | null {
  const trimmed = email.trim();
  if (!trimmed) {
    return 'Email address is required';
  }
  if (/\s/.test(trimmed)) {
    return 'Email cannot contain spaces';
  }
  if (!trimmed.includes('@')) {
    return "Email must contain an '@' symbol (e.g. name@domain.com)";
  }
  const parts = trimmed.split('@');
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return 'Enter a complete email address before and after @';
  }
  if (!parts[1].includes('.')) {
    return 'Email domain must include an extension (e.g. .com, .in)';
  }
  const domainParts = parts[1].split('.');
  const tld = domainParts[domainParts.length - 1];
  if (!tld || tld.length < 2) {
    return 'Domain extension must be at least 2 characters (e.g. .com, .in)';
  }
  if (!EMAIL_REGEX.test(trimmed)) {
    return 'Please enter a valid email address (e.g. yourname@domain.com)';
  }
  return null;
}

export function validateName(name: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) {
    return 'Full name is required';
  }
  if (trimmed.length < 2) {
    return 'Full name must be at least 2 characters';
  }
  if (trimmed.length > 50) {
    return 'Full name cannot exceed 50 characters';
  }
  if (!NAME_REGEX.test(trimmed)) {
    return 'Name must contain only letters and spaces (no numbers or special symbols)';
  }
  return null;
}

export function validateMessage(message: string): string | null {
  const trimmed = message.trim();
  if (!trimmed) {
    return 'Requirement / Message is required';
  }
  if (trimmed.length < 5) {
    return 'Please describe your requirement (min 5 characters)';
  }
  if (trimmed.length > 1000) {
    return 'Message cannot exceed 1000 characters';
  }
  return null;
}

export function InquiryForm({ product, title = 'Inquiry Form' }: InquiryFormProps) {
  const [status, setStatus] = useState<Status>('idle');

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: product ? `I would like a quote for ${product.name} (${product.model}).` : ''
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleBlur = (field: 'name' | 'phone' | 'email' | 'message') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    let err: string | null = null;
    if (field === 'name') err = validateName(form.name);
    else if (field === 'phone') err = validatePhone(form.phone);
    else if (field === 'email') err = validateEmail(form.email);
    else if (field === 'message') err = validateMessage(form.message);
    setErrors((prev) => ({ ...prev, [field]: err || '' }));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.slice(0, 50);
    setForm((prev) => ({ ...prev, name: val }));
    if (touched.name) {
      setErrors((prev) => ({ ...prev, name: validateName(val) || '' }));
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only permit digits, auto-clean prefixes like +91 or leading 0, and limit strictly to 10 digits
    let digits = e.target.value.replace(/\D/g, '');
    if (digits.length === 12 && digits.startsWith('91')) {
      digits = digits.slice(2);
    } else if (digits.length === 11 && digits.startsWith('0')) {
      digits = digits.slice(1);
    }
    const val = digits.slice(0, 10);
    setForm((prev) => ({ ...prev, phone: val }));
    if (touched.phone) {
      setErrors((prev) => ({ ...prev, phone: validatePhone(val) || '' }));
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setForm((prev) => ({ ...prev, email: val }));
    if (touched.email) {
      setErrors((prev) => ({ ...prev, email: validateEmail(val) || '' }));
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value.slice(0, 1000);
    setForm((prev) => ({ ...prev, message: val }));
    if (touched.message) {
      setErrors((prev) => ({ ...prev, message: validateMessage(val) || '' }));
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all required fields as touched
    setTouched({ name: true, phone: true, email: true, message: true });

    const nameErr = validateName(form.name);
    const phoneErr = validatePhone(form.phone);
    const emailErr = validateEmail(form.email);
    const messageErr = validateMessage(form.message);

    const newErrors = {
      name: nameErr || '',
      phone: phoneErr || '',
      email: emailErr || '',
      message: messageErr || ''
    };
    setErrors(newErrors);

    if (nameErr || phoneErr || emailErr || messageErr) {
      setStatus('error');
      // Automatically focus first invalid input field
      const firstInvalidId = nameErr
        ? 'inquiry-name'
        : phoneErr
        ? 'inquiry-phone'
        : emailErr
        ? 'inquiry-email'
        : 'inquiry-message';
      document.getElementById(firstInvalidId)?.focus();
      return;
    }

    setStatus('submitting');

    // 1. Build the pre-filled WhatsApp deep-link
    const inquiryData = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
      product
    };

    const whatsappUrl = generateContactInquiry(inquiryData);

    // 2. Open WhatsApp immediately with the pre-filled formatted message
    openWhatsApp(whatsappUrl);

    // 3. Persist inquiry locally in leads storage
    try {
      createInquiry(inquiryData);
    } catch {
      // ignore
    }

    // 4. Reset form fields for subsequent inquiry
    setForm({
      name: '',
      phone: '',
      email: '',
      message: product ? `I would like a quote for ${product.name} (${product.model}).` : ''
    });
    setTouched({});
    setErrors({});
    setStatus('success');

    // Return to idle state after 4 seconds
    setTimeout(() => {
      setStatus('idle');
    }, 4000);
  };

  const getFieldClass = (field: 'name' | 'phone' | 'email' | 'message') => {
    const base =
      'h-11 w-full rounded-md border bg-white px-3.5 text-sm text-ink outline-none transition-colors placeholder:text-zinc-400';
    if (touched[field]) {
      if (errors[field]) {
        return `${base} border-red-500 bg-red-50/20 focus:border-red-600`;
      }
      return `${base} border-emerald-500 focus:border-emerald-600`;
    }
    return `${base} border-zinc-300 focus:border-accent`;
  };

  // ==========================================
  // Form UI
  // ==========================================
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-7 shadow-sm"
      noValidate
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-display text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-ink">
            {title}
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-zinc-500">
            Fill in your details below. We format your request and open WhatsApp directly so you only have to press Enter!
          </p>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700 shrink-0">
          <WhatsAppIcon size={14} className="text-[#25D366]" />
          Instant WhatsApp
        </span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {/* Full Name */}
        <label className="block">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-600">
              Full Name <span className="text-red-500">*</span>
            </span>
            {touched.name && !errors.name && (
              <span className="flex items-center gap-0.5 text-[11px] font-bold text-emerald-600">
                <CheckIcon size={12} /> Valid
              </span>
            )}
          </div>
          <input
            id="inquiry-name"
            required
            value={form.name}
            onChange={handleNameChange}
            onBlur={() => handleBlur('name')}
            className={getFieldClass('name')}
            placeholder="e.g. Rahul Sharma"
            autoComplete="name"
            maxLength={50}
          />
          {touched.name && errors.name ? (
            <span className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-red-600">
              <AlertCircleIcon size={12} className="shrink-0" />
              {errors.name}
            </span>
          ) : (
            <span className="mt-1 block text-[10px] text-zinc-400">
              Letters and spaces only (2–50 characters)
            </span>
          )}
        </label>

        {/* Contact No (Strictly 10 digits) */}
        <label className="block">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-600">
              Contact No. (10 digits) <span className="text-red-500">*</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-zinc-400">
                {form.phone.length}/10 digits
              </span>
              {touched.phone && !errors.phone && (
                <span className="flex items-center gap-0.5 text-[11px] font-bold text-emerald-600">
                  <CheckIcon size={12} /> Valid
                </span>
              )}
            </div>
          </div>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-xs font-bold text-zinc-400 select-none">
              +91
            </span>
            <input
              id="inquiry-phone"
              required
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={form.phone}
              onChange={handlePhoneChange}
              onBlur={() => handleBlur('phone')}
              className={`${getFieldClass('phone')} pl-11 font-mono tracking-wider`}
              placeholder="9876543210"
              autoComplete="tel"
            />
          </div>
          {touched.phone && errors.phone ? (
            <span className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-red-600">
              <AlertCircleIcon size={12} className="shrink-0" />
              {errors.phone}
            </span>
          ) : (
            <span className="mt-1 block text-[10px] text-zinc-400">
              Only 10 digits allowed (starts with 6, 7, 8, or 9)
            </span>
          )}
        </label>

        {/* Email Address */}
        <label className="block sm:col-span-2">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-600">
              Email Address <span className="text-red-500">*</span>
            </span>
            {touched.email && !errors.email && (
              <span className="flex items-center gap-0.5 text-[11px] font-bold text-emerald-600">
                <CheckIcon size={12} /> Valid
              </span>
            )}
          </div>
          <input
            id="inquiry-email"
            required
            type="email"
            inputMode="email"
            value={form.email}
            onChange={handleEmailChange}
            onBlur={() => handleBlur('email')}
            className={getFieldClass('email')}
            placeholder="e.g. rahul@example.com"
            autoComplete="email"
            maxLength={80}
          />
          {touched.email && errors.email ? (
            <span className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-red-600">
              <AlertCircleIcon size={12} className="shrink-0" />
              {errors.email}
            </span>
          ) : (
            <span className="mt-1 block text-[10px] text-zinc-400">
              Must look like a valid email (e.g. name@domain.com)
            </span>
          )}
        </label>

        {/* Requirement / Message */}
        <label className="block sm:col-span-2">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-600">
              Requirement / Message <span className="text-red-500">*</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-zinc-400">
                {form.message.length} chars
              </span>
              {touched.message && !errors.message && (
                <span className="flex items-center gap-0.5 text-[11px] font-bold text-emerald-600">
                  <CheckIcon size={12} /> Valid
                </span>
              )}
            </div>
          </div>
          <textarea
            id="inquiry-message"
            required
            rows={4}
            value={form.message}
            onChange={handleMessageChange}
            onBlur={() => handleBlur('message')}
            className={`w-full rounded-md border p-3.5 text-sm text-ink outline-none transition-colors placeholder:text-zinc-400 ${
              touched.message
                ? errors.message
                  ? 'border-red-500 bg-red-50/20 focus:border-red-600'
                  : 'border-emerald-500 focus:border-emerald-600'
                : 'border-zinc-300 focus:border-accent'
            }`}
            placeholder="Tell us about your audio equipment requirements, desired quantities, or specific models."
          />
          {touched.message && errors.message ? (
            <span className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-red-600">
              <AlertCircleIcon size={12} className="shrink-0" />
              {errors.message}
            </span>
          ) : (
            <span className="mt-1 block text-[10px] text-zinc-400">
              Minimum 5 characters required describing your inquiry
            </span>
          )}
        </label>
      </div>

      {status === 'error' && (
        <div className="mt-5 flex items-center gap-2 rounded-xl bg-red-50 p-3.5 text-xs font-semibold text-red-700 border border-red-200">
          <AlertCircleIcon size={16} className="shrink-0 text-red-600" />
          <span>Please fix the highlighted required fields above to proceed with WhatsApp inquiry.</span>
        </div>
      )}

      {status === 'success' && (
        <div className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-50 p-3.5 text-xs font-semibold text-emerald-800 border border-emerald-200">
          <CheckCircle2Icon size={16} className="shrink-0 text-emerald-600" />
          <span>WhatsApp opened with your inquiry! Press Send in WhatsApp.</span>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-8 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-[#1faa54] hover:shadow-md disabled:opacity-60 sm:w-auto shadow-sm cursor-pointer"
        >
          {status === 'submitting' ? (
            <Loader2Icon size={16} className="animate-spin" />
          ) : (
            <WhatsAppIcon size={18} />
          )}
          {status === 'submitting' ? 'Opening WhatsApp...' : 'Send Inquiry on WhatsApp'}
        </button>

        <p className="text-[11px] text-zinc-500 flex items-center gap-1">
          <SendIcon size={12} className="text-emerald-600" />
          WhatsApp opens with message ready — just press Enter to send!
        </p>
      </div>
    </form>
  );
}
