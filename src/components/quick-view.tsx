"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Heart, MessageCircle, Minus, Plus, X } from "lucide-react";
import type { Saree } from "@/lib/types";
import { useBag } from "@/lib/bag-context";
import { useToast } from "@/components/toast";
import {
  availabilityLabel,
  colorSwatch,
  formatINR,
  productEnquiryMessage,
  whatsappUrl,
} from "@/lib/catalog";
import { SareeImage } from "@/components/ui/saree-image";
import { toBagItem } from "@/components/product-card";
import { cn } from "@/lib/utils";

interface QuickViewProps {
  product: Saree | null;
  onClose: () => void;
}

export function QuickView({ product, onClose }: QuickViewProps) {
  return (
    <AnimatePresence>
      {product && <QuickViewBody key={product.id} product={product} onClose={onClose} />}
    </AnimatePresence>
  );
}

function QuickViewBody({ product, onClose }: { product: Saree; onClose: () => void }) {
  const { has, toggle } = useBag();
  const { notify } = useToast();
  const [color, setColor] = useState<string | undefined>(
    product.palette?.name ?? product.colors?.[0]
  );
  const [qty, setQty] = useState(1);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const saved = has(product.id);

  return (
    <motion.div
      className="fixed inset-0 z-[92] flex items-end justify-center p-0 sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button
        aria-label="Close quick view"
        className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`${product.name} quick view`}
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.98 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative grid max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-t-2xl bg-ivory shadow-2xl sm:rounded-2xl md:grid-cols-2"
      >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-20 grid h-10 w-10 place-items-center rounded-full bg-ivory/90 text-ink shadow backdrop-blur transition hover:bg-ivory"
            >
              <X size={18} />
            </button>

            <SareeImage
              src={product.image}
              alt={`${product.name} — ${product.categoryName}`}
              className="h-64 w-full md:h-full"
              sizes="(max-width: 768px) 100vw, 45vw"
              priority
            />

            <div className="flex max-h-[92vh] flex-col overflow-y-auto p-7 sm:p-9">
              <p className="eyebrow text-wine">{product.categoryName}</p>
              <h2 className="mt-3 font-display text-3xl leading-tight text-ink sm:text-4xl">
                {product.name}
              </h2>
              <p className="mt-3 font-display text-2xl text-wine">{formatINR(product.price)}</p>

              <p className="mt-5 text-sm leading-relaxed text-ink/65">{product.description}</p>

              <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 border-y border-gold/20 py-5 text-sm">
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.2em] text-ink/45">Fabric</dt>
                  <dd className="mt-1 text-ink/80">{product.fabric}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.2em] text-ink/45">Weave</dt>
                  <dd className="mt-1 text-ink/80">{product.weave}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.2em] text-ink/45">Occasion</dt>
                  <dd className="mt-1 text-ink/80">{product.occasion}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.2em] text-ink/45">Status</dt>
                  <dd className="mt-1 text-ink/80">{availabilityLabel(product.availability)}</dd>
                </div>
              </dl>

              {product.colors.length > 0 && (
                <div className="mt-6">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-ink/45">
                    Colour options
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setColor(c)}
                        className={cn(
                          "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition",
                          color === c
                            ? "border-wine bg-wine/5 text-wine"
                            : "border-ink/15 text-ink/65 hover:border-wine/40"
                        )}
                      >
                        <span
                          className="h-3 w-3 rounded-full ring-1 ring-ink/15"
                          style={{ backgroundColor: colorSwatch(c) }}
                        />
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 flex items-center gap-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-ink/45">Quantity</p>
                <div className="flex items-center rounded-full border border-ink/15">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="grid h-9 w-9 place-items-center text-ink/70 hover:text-wine"
                  >
                    <Minus size={15} />
                  </button>
                  <span className="w-8 text-center text-sm">{qty}</span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    aria-label="Increase quantity"
                    className="grid h-9 w-9 place-items-center text-ink/70 hover:text-wine"
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  href={whatsappUrl(productEnquiryMessage(product, color))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-white transition hover:bg-[#1ebe5b]"
                >
                  <MessageCircle size={16} /> Enquire on WhatsApp
                </a>
                <button
                  onClick={() => {
                    toggle(toBagItem(product));
                    notify(
                      saved ? "Removed from your list." : `${product.name} saved to your list.`,
                      saved ? "default" : "success"
                    );
                  }}
                  aria-pressed={saved}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-full border px-6 py-3.5 text-xs font-medium uppercase tracking-[0.2em] transition",
                    saved
                      ? "border-wine bg-wine text-ivory"
                      : "border-ink/20 text-ink/75 hover:border-wine hover:text-wine"
                  )}
                >
                  <Heart size={16} fill={saved ? "currentColor" : "none"} />
                  {saved ? "Saved" : "Save"}
                </button>
              </div>

              <Link
                href={`/saree/${product.slug}`}
                onClick={onClose}
                className="mt-4 inline-flex items-center gap-2 self-start text-sm text-wine link-underline"
              >
                View full details <ArrowRight size={15} />
              </Link>
            </div>
          </motion.div>
        </motion.div>
  );
}
