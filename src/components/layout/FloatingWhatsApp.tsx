import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { WhatsAppIcon } from '../ui/WhatsAppIcon';
import { generateGeneralInquiry } from '../../utils/whatsapp';

export function FloatingWhatsApp() {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href={generateGeneralInquiry()}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6, duration: 0.3 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="fixed bottom-5 right-4 z-[60] flex items-center gap-2 rounded-full bg-[#25D366] p-3 text-white shadow-lift transition-all hover:bg-[#1faa54] hover:scale-105 sm:bottom-7 sm:right-6"
      aria-label="Chat with us on WhatsApp"
    >
      <WhatsAppIcon size={26} className="text-white" />
      <motion.span
        initial={false}
        animate={{ width: hovered ? 'auto' : 0, opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden whitespace-nowrap text-xs font-bold uppercase tracking-wider pr-1"
      >
        Chat With Us
      </motion.span>
    </motion.a>
  );
}
