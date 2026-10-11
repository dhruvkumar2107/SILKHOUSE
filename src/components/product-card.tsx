"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, Heart, MessageCircle } from "lucide-react";
import type { Saree } from "@/lib/types";
import type { BagItem } from "@/lib/bag-context";
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
import { Tilt3D } from "@/components/ui/tilt-3d";
import { cn } from "@/lib/utils";

export function toBagItem(product: Saree): BagItem {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    sku: product.sku,
    price: product.price,
    categoryName: product.categoryName,
    image: product.image,
  };
}

interface ProductCardProps {
  product: Saree;
  index?: number;
  onQuickView: (product: Saree) => void;
  priority?: boolean;
}

export function ProductCard({ product, index = 0, onQuickView, priority = false }: ProductCardProps) {
  const { has, toggle } = useBag();
  const { notify } = useToast();
  const saved = has(product.id);

  function onToggleWishlist() {
    toggle(toBagItem(product));
    notify(
      saved ? `Removed ${product.name} from your list.` : `${product.name} saved to your enquiry list.`,
      saved ? "default" : "success"
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: Math.min(index, 8) * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col"
    >
      <Tilt3D max={7} scale={1.02} className="rounded-md">
        <div className="relative aspect-[3/4] overflow-hidden rounded-md border border-gold/20 bg-ivory-warm shadow-[0_2px_20px_rgba(20,16,13,0.05)] transition-shadow duration-500 group-hover:shadow-[0_20px_60px_rgba(20,16,13,0.16)]">
        <Link
          href={`/saree/${product.slug}`}
          aria-label={`View ${product.name}`}
          className="absolute inset-0 z-10"
        >
          <span className="sr-only">View {product.name}</span>
        </Link>

        <SareeImage
          src={product.image}
          alt={`${product.name} — ${product.categoryName} with ${product.weave} weave`}
          priority={priority}
          zoomOnHover
          className="h-full w-full"
          sizes="(max-width: 640px) 70vw, (max-width: 1024px) 40vw, 25vw"
        />

        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between p-3">
          <span className="rounded-full bg-ivory/92 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-wine backdrop-blur">
            {product.categoryName.replace(" Sarees", "")}
          </span>
          <button
            onClick={onToggleWishlist}
            aria-label={saved ? `Remove ${product.name} from list` : `Save ${product.name} to list`}
            aria-pressed={saved}
            className={cn(
              "pointer-events-auto grid h-9 w-9 place-items-center rounded-full backdrop-blur transition",
              saved
                ? "bg-wine text-ivory"
                : "bg-ivory/90 text-ink/70 hover:bg-ivory hover:text-wine"
            )}
          >
            <Heart size={16} fill={saved ? "currentColor" : "none"} />
          </button>
        </div>

        {product.availability !== "in-stock" && (
          <span className="absolute bottom-3 left-3 z-20 rounded-full bg-ink/80 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-gold-light">
            {availabilityLabel(product.availability)}
          </span>
        )}

        <div className="absolute inset-x-0 bottom-0 z-20 flex translate-y-3 items-center gap-2 p-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            onClick={() => onQuickView(product)}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-ivory/95 px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-ink backdrop-blur transition hover:bg-ivory"
          >
            <Eye size={14} /> Quick View
          </button>
          <a
            href={whatsappUrl(productEnquiryMessage(product))}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Enquire about ${product.name} on WhatsApp`}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#25D366] text-white transition hover:bg-[#1ebe5b]"
          >
            <MessageCircle size={16} />
          </a>
        </div>
      </div>
      </Tilt3D>

      <div className="mt-4 flex flex-1 flex-col">
        <p className="text-[11px] uppercase tracking-[0.22em] text-ink/45">{product.weave}</p>
        <h3 className="mt-1 font-display text-xl leading-snug text-ink">
          <Link href={`/saree/${product.slug}`} className="transition hover:text-wine">
            {product.name}
          </Link>
        </h3>
        <div className="mt-2 flex items-center justify-between gap-3">
          <p className="font-display text-lg text-wine">{formatINR(product.price)}</p>
          <div className="flex items-center gap-1.5" aria-label="Available colours">
            {(product.colors ?? []).slice(0, 3).map((c) => (
              <span
                key={c}
                title={c}
                className="h-3.5 w-3.5 rounded-full ring-1 ring-ink/15"
                style={{ backgroundColor: colorSwatch(c) }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
