import React from 'react';
import { MailIcon, PhoneIcon, Instagram, Youtube } from 'lucide-react';
import { WhatsAppIcon } from '../ui/WhatsAppIcon';
import { ANNOUNCEMENTS, SITE } from '../../config/site';

export function AnnouncementBar() {
  return (
    <div className="bg-ink border-b border-white/10 text-white text-[11px]">
      <div className="mx-auto flex w-full max-w-[1320px] items-center justify-between gap-4 px-4 py-2 sm:px-6 lg:px-8">
        {/* Left: Manufacturing & Announcements */}
        <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap no-scrollbar font-medium tracking-wide text-zinc-300">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/20 border border-accent/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            {ANNOUNCEMENTS[0]}
          </span>
          <span className="hidden md:inline text-white/20">|</span>
          <span className="hidden md:inline text-zinc-400">{ANNOUNCEMENTS[1]}</span>
        </div>

        {/* Right: Contact & Social Links */}
        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          {/* Email */}
          <a
            href={`mailto:${SITE.email}`}
            className="hidden lg:flex items-center gap-1.5 text-zinc-300 transition-colors hover:text-accent"
            title="Email us"
          >
            <MailIcon size={12} className="text-accent" />
            <span>{SITE.email}</span>
          </a>

          <span className="hidden lg:inline text-white/20">|</span>

          {/* Phone */}
          <a
            href={SITE.phoneHref}
            className="flex items-center gap-1.5 font-semibold text-zinc-200 transition-colors hover:text-accent"
            title="Call sales & engineering"
          >
            <PhoneIcon size={12} className="text-accent" />
            <span>+91 {SITE.phoneRaw}</span>
          </a>

          <span className="hidden sm:inline text-white/20">|</span>

          {/* WhatsApp Group Link */}
          <a
            href={SITE.whatsappGroup}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 rounded-md bg-[#25D366]/20 hover:bg-[#25D366]/35 border border-[#25D366]/60 px-2.5 py-0.5 font-bold text-[#25D366] transition-colors animate-pulse shadow-[0_0_12px_rgba(37,211,102,0.4)]"
            title="Join Official WhatsApp Group"
          >
            <WhatsAppIcon size={12} />
            <span>WhatsApp Group</span>
          </a>

          {/* Social Icons */}
          <div className="flex items-center gap-2 pl-1 border-l border-white/10 sm:border-0 sm:pl-0">
            <a
              href={SITE.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-[#E4405F] transition-colors p-0.5"
              aria-label="Instagram"
              title="Follow us on Instagram"
            >
              <Instagram size={13} />
            </a>
            <a
              href={SITE.social.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-[#FF0000] transition-colors p-0.5"
              aria-label="YouTube"
              title="Subscribe on YouTube"
            >
              <Youtube size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
