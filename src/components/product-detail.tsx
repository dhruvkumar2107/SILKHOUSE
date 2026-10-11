"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, MessageCircle, Minus, Plus, ShieldCheck, Truck } from "lucide-react";
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
import { toBagItem, ProductCard } from "@/components/product-card";
import { QuickView } from "@/components/quick-view";
import { cn } from "@/lib/utils";

export function ProductDetail({ product, related }: { product: Saree; related: Saree[] }) {
  const { has, toggle } = useBag();
  const { notify } = useToast();
  const [color, setColor] = useState(product.palette?.name ?? product.colors?.[0]);
  const [qty, setQty] = useState(1);
  const [quickView, setQuickView] = useState<Saree | null>(null);
  const saved = has(product.id);

  return (
    <div className="bg-ivory">
      <div className="container-lux pt-28 pb-16 sm:pt-32">
        <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-[0.2em] text-ink/45">
          <Link href="/" className="hover:text-wine">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/collection" className="hover:text-wine">
            Collection
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/collection?category=${product.category}`} className="hover:text-wine">
            {product.categoryName.replace(" Sarees", "")}
          </Link>
        </nav>

        <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SareeImage
              src={product.image}
              alt={`${product.name} — ${product.fabric} silk saree with ${product.weave} weave`}
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="aspect-[3/4] w-full rounded-xl border border-gold/20"
            />
            <p className="mt-4 text-xs leading-relaxed text-ink/45">
              High-resolution representative photo. Visit the store to view the actual saree, weave
              and zari detail in person.
            </p>
          </div>

          <div className="lg:pt-4">
            <p className="eyebrow text-wine">{product.categoryName}</p>
            <h1 className="mt-4 font-display text-4xl leading-tight text-ink sm:text-5xl">
              {product.name}
            </h1>
            <p className="mt-3 text-xs uppercase tracking-[0.2em] text-ink/45">
              SKU {product.sku} · {availabilityLabel(product.availability)}
            </p>
            <p className="mt-5 font-display text-3xl text-wine">{formatINR(product.price)}</p>

            <p className="mt-6 text-base leading-relaxed text-ink/65">{product.description}</p>

            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-gold/20 py-6 text-sm">
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
                <dt className="text-[11px] uppercase tracking-[0.2em] text-ink/45">Colour shown</dt>
                <dd className="mt-1 text-ink/80">{product.palette?.name}</dd>
              </div>
            </dl>

            {product.colors.length > 0 && (
              <div className="mt-7">
                <p className="text-[11px] uppercase tracking-[0.2em] text-ink/45">
                  Colour options
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={cn(
                        "flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs transition",
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

            <div className="mt-7 flex items-center gap-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-ink/45">Quantity</p>
              <div className="flex items-center rounded-full border border-ink/15">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="grid h-10 w-10 place-items-center text-ink/70 hover:text-wine"
                >
                  <Minus size={16} />
                </button>
                <span className="w-10 text-center">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="grid h-10 w-10 place-items-center text-ink/70 hover:text-wine"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappUrl(productEnquiryMessage(product, color))}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-3 rounded-full bg-[#25D366] px-7 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-[#1ebe5b]"
              >
                <MessageCircle size={17} /> Enquire on WhatsApp
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
                  "flex items-center justify-center gap-3 rounded-full border px-7 py-4 text-xs font-semibold uppercase tracking-[0.22em] transition",
                  saved
                    ? "border-wine bg-wine text-ivory"
                    : "border-ink/20 text-ink/75 hover:border-wine hover:text-wine"
                )}
              >
                <Heart size={16} fill={saved ? "currentColor" : "none"} />
                {saved ? "Saved" : "Save"}
              </button>
            </div>

            <div className="mt-8 grid gap-3 text-sm text-ink/60 sm:grid-cols-2">
              <p className="flex items-center gap-3">
                <ShieldCheck size={18} className="text-wine" /> Guidance you can trust — ask us
                anything.
              </p>
              <p className="flex items-center gap-3">
                <Truck size={18} className="text-wine" /> Shipping options confirmed on enquiry.
              </p>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-ink/45">
              Enquiries open a WhatsApp chat with our team. No order is placed until availability and
              pricing are confirmed with you.
            </p>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-24">
            <div className="flex items-end justify-between">
              <h2 className="font-display text-3xl text-ink sm:text-4xl">
                More from {product.categoryName.replace(" Sarees", "")}
              </h2>
              <Link
                href={`/collection?category=${product.category}`}
                className="text-sm uppercase tracking-[0.2em] text-wine link-underline"
              >
                View all
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-7 lg:grid-cols-4">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} onQuickView={setQuickView} />
              ))}
            </div>
          </section>
        )}
      </div>

      <QuickView product={quickView} onClose={() => setQuickView(null)} />
    </div>
  );
}
