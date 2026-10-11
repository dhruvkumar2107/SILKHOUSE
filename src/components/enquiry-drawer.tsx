"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Heart, MessageCircle, Trash2, X } from "lucide-react";
import { bagEnquiryMessage, formatINR, whatsappUrl } from "@/lib/catalog";
import { useBag } from "@/lib/bag-context";
import { useToast } from "@/components/toast";
import { SareeImage } from "@/components/ui/saree-image";

export function EnquiryDrawer() {
  const { items, isOpen, close, remove, clear } = useBag();
  const { notify } = useToast();

  const total = items.reduce((sum, i) => sum + i.price, 0);

  function sendEnquiry() {
    if (items.length === 0) {
      notify("Your enquiry list is empty. Add a saree first.");
      return;
    }
    window.open(whatsappUrl(bagEnquiryMessage(items)), "_blank", "noopener,noreferrer");
    notify("Opening WhatsApp with your enquiry list…", "success");
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[90] flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            aria-label="Close enquiry list"
            className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
            onClick={close}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Your enquiry list"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex h-full w-full max-w-md flex-col border-l border-gold/25 bg-ivory shadow-2xl"
          >
            <header className="flex items-center justify-between border-b border-gold/20 px-6 py-5">
              <div className="flex items-center gap-3">
                <Heart size={18} className="text-wine" />
                <div>
                  <p className="font-display text-xl text-ink">Enquiry List</p>
                  <p className="text-xs uppercase tracking-[0.28em] text-ink/45">
                    {items.length} {items.length === 1 ? "saree" : "sarees"}
                  </p>
                </div>
              </div>
              <button
                onClick={close}
                aria-label="Close"
                className="rounded-full p-2 text-ink/60 transition hover:bg-ink/5 hover:text-ink"
              >
                <X size={20} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <Heart size={34} className="text-gold/60" />
                  <p className="font-display text-2xl text-ink">Nothing saved yet</p>
                  <p className="max-w-xs text-sm text-ink/55">
                    Tap the heart on a saree to shortlist it. You can then send the whole list to
                    us on WhatsApp in one message.
                  </p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-4">
                      <SareeImage
                        src={item.image}
                        alt={item.name}
                        className="h-28 w-20 shrink-0 rounded-md"
                        sizes="80px"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-display text-lg leading-tight text-ink">
                          {item.name}
                        </p>
                        <p className="text-xs uppercase tracking-[0.2em] text-ink/45">
                          {item.sku} · {item.categoryName}
                        </p>
                        <p className="mt-2 text-sm font-medium text-wine">
                          {formatINR(item.price)}
                        </p>
                      </div>
                      <button
                        onClick={() => remove(item.id)}
                        aria-label={`Remove ${item.name}`}
                        className="self-start rounded-full p-2 text-ink/40 transition hover:bg-wine/10 hover:text-wine"
                      >
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <footer className="border-t border-gold/20 px-6 py-5">
              {items.length > 0 && (
                <div className="mb-4 flex items-center justify-between text-sm">
                  <span className="uppercase tracking-[0.24em] text-ink/55">Indicative total</span>
                  <span className="font-display text-xl text-ink">{formatINR(total)}</span>
                </div>
              )}
              <button
                onClick={sendEnquiry}
                className="flex w-full items-center justify-center gap-3 rounded-full bg-[#1f8a4c] px-6 py-3.5 text-sm font-medium uppercase tracking-[0.24em] text-white transition hover:bg-[#177040]"
              >
                <MessageCircle size={17} />
                Enquire on WhatsApp
              </button>
              {items.length > 0 && (
                <button
                  onClick={clear}
                  className="mt-3 w-full rounded-full border border-ink/15 px-6 py-3 text-xs uppercase tracking-[0.24em] text-ink/60 transition hover:border-wine/40 hover:text-wine"
                >
                  Clear list
                </button>
              )}
              <p className="mt-3 text-center text-[11px] leading-relaxed text-ink/45">
                Sending this opens a WhatsApp message with your shortlist. No order is placed until
                our team confirms availability with you.
              </p>
            </footer>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
