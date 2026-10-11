"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Saree } from "@/lib/types";
import { formatINR } from "@/lib/catalog";
import { SareeImage } from "@/components/ui/saree-image";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Saree[]>([]);
  const [loaded, setLoaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 120);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open || loaded) return;
    let cancelled = false;
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && Array.isArray(data?.products)) setProducts(data.products);
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [open, loaded]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter((p) =>
        [p.name, p.categoryName, p.weave, p.fabric, ...(p.colors ?? [])]
          .join(" ")
          .toLowerCase()
          .includes(q)
      )
      .slice(0, 8);
  }, [query, products]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[95] bg-ink/95 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="Search the collection"
        >
          <div className="container-lux flex h-full flex-col py-8">
            <div className="flex items-center justify-between">
              <p className="eyebrow text-gold">Search the collection</p>
              <button
                onClick={onClose}
                aria-label="Close search"
                className="rounded-full p-2 text-ivory/70 transition hover:bg-white/10 hover:text-ivory"
              >
                <X size={22} />
              </button>
            </div>

            <div className="mt-10 flex items-center gap-4 border-b border-gold/40 pb-5">
              <Search className="text-gold" size={26} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search sarees, weaves, colours…"
                aria-label="Search sarees"
                className="w-full bg-transparent font-display text-3xl text-ivory placeholder:text-ivory/35 focus:outline-none sm:text-5xl"
              />
            </div>

            <div className="mt-8 flex-1 overflow-y-auto">
              {open && !loaded ? (
                <p className="text-ivory/50">Loading the collection…</p>
              ) : query.trim() === "" ? (
                <div className="flex flex-wrap gap-2">
                  {["Kanjivaram", "Bridal", "Banarasi", "Temple border", "Lightweight", "Gold"].map(
                    (s) => (
                      <button
                        key={s}
                        onClick={() => setQuery(s)}
                        className="rounded-full border border-gold/30 px-4 py-2 text-sm text-ivory/75 transition hover:border-gold hover:text-ivory"
                      >
                        {s}
                      </button>
                    )
                  )}
                </div>
              ) : results.length === 0 ? (
                <div className="max-w-md">
                  <p className="font-display text-2xl text-ivory">No sarees match “{query}”.</p>
                  <p className="mt-2 text-sm text-ivory/55">
                    Try a different weave, colour or occasion — or browse the full collection.
                  </p>
                  <Link
                    href="/collection"
                    onClick={onClose}
                    className="mt-5 inline-flex rounded-full bg-gold px-6 py-3 text-xs font-medium uppercase tracking-[0.24em] text-ink transition hover:bg-gold-light"
                  >
                    Browse all 100 sarees
                  </Link>
                </div>
              ) : (
                <ul className="grid gap-3 sm:grid-cols-2">
                  {results.map((p) => (
                    <li key={p.id}>
                      <Link
                        href={`/saree/${p.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-4 rounded-lg border border-white/5 p-3 transition hover:border-gold/40 hover:bg-white/5"
                      >
                        <SareeImage
                          src={p.image}
                          alt={p.name}
                          sizes="72px"
                          className="h-20 w-16 shrink-0 rounded"
                        />
                        <div className="min-w-0">
                          <p className="truncate font-display text-lg text-ivory">{p.name}</p>
                          <p className="text-xs uppercase tracking-[0.2em] text-ivory/45">
                            {p.categoryName}
                          </p>
                          <p className="mt-1 text-sm text-gold">{formatINR(p.price)}</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
