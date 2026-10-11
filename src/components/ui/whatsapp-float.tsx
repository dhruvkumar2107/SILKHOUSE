"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { generalEnquiryMessage, whatsappUrl } from "@/lib/catalog";
import { storeConfig } from "@/lib/config";

export function WhatsAppFloat() {
  return (
    <motion.a
      href={whatsappUrl(generalEnquiryMessage())}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with ${storeConfig.name} on WhatsApp`}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group fixed bottom-5 right-5 z-[80] flex items-center gap-3 rounded-full bg-[#25D366] py-3 pl-3 pr-4 text-white shadow-[0_10px_40px_rgba(37,211,102,0.45)] transition hover:bg-[#1ebe5b] sm:bottom-7 sm:right-7"
    >
      <span className="relative grid h-8 w-8 place-items-center rounded-full bg-white/15">
        <span className="absolute inset-0 animate-ping rounded-full bg-white/25" />
        <MessageCircle size={19} />
      </span>
      <span className="hidden text-xs font-medium uppercase tracking-[0.2em] sm:block">
        Enquire
      </span>
    </motion.a>
  );
}
