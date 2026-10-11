"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Search, SlidersHorizontal, X } from "lucide-react";
import type { Saree } from "@/lib/types";
import {
  categories,
  colorSwatch,
  formatINR,
  priceBounds,
  sortOptions,
} from "@/lib/catalog";
import { ProductCard } from "@/components/product-card";
import { QuickView } from "@/components/quick-view";
import { cn } from "@/lib/utils";

interface CollectionExplorerProps {
  products: Saree[];
  initialCategory?: string;
}

const PAGE_SIZE = 12;

export function CollectionExplorer({ products, initialCategory }: CollectionExplorerProps) {
  const [query, setQuery] = useState("");
  const [activeCategories, setActiveCategories] = useState<Set<string>>(
    () => new Set(initialCategory ? [initialCategory] : [])
  );
  const [activeColors, setActiveColors] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState("featured");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [quickView, setQuickView] = useState<Saree | null>(null);

  const [minPrice, maxPrice] = useMemo(() => priceBounds(products), [products]);
  const [priceCeiling, setPriceCeiling] = useState(maxPrice);

  const allColors = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.colors?.forEach((c) => set.add(c)));
    return [...set].sort();
  }, [products]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const ceiling = Math.max(priceCeiling, minPrice);
    const list = products.filter((p) => {
      if (activeCategories.size > 0 && !activeCategories.has(p.category)) return false;
      if (p.price > ceiling) return false;
      if (activeColors.size > 0 && !(p.colors ?? []).some((c) => activeColors.has(c))) return false;
      if (q) {
        const hay = [p.name, p.categoryName, p.weave, p.fabric, p.occasion, ...(p.colors ?? [])]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    switch (sort) {
      case "price-asc":
        return [...list].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...list].sort((a, b) => b.price - a.price);
      case "name-asc":
        return [...list].sort((a, b) => a.name.localeCompare(b.name));
      default:
        return [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
    }
  }, [products, query, activeCategories, activeColors, priceCeiling, minPrice, sort]);

  const visibleProducts = filtered.slice(0, visible);
  const activeFilterCount =
    activeCategories.size + activeColors.size + (priceCeiling < maxPrice ? 1 : 0) + (query ? 1 : 0);

  function toggleSet(
    setter: React.Dispatch<React.SetStateAction<Set<string>>>,
    value: string
  ) {
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
    setVisible(PAGE_SIZE);
  }

  function clearAll() {
    setQuery("");
    setActiveCategories(new Set());
    setActiveColors(new Set());
    setPriceCeiling(maxPrice);
    setVisible(PAGE_SIZE);
  }

  const filterPanel = (
    <div className="space-y-8">
      <div>
        <h3 className="eyebrow text-wine">Collection</h3>
        <ul className="mt-4 space-y-1.5">
          {categories.map((c) => {
            const active = activeCategories.has(c.id);
            const count = products.filter((p) => p.category === c.id).length;
            return (
              <li key={c.id}>
                <button
                  onClick={() => toggleSet(setActiveCategories, c.id)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition",
                    active ? "bg-wine/8 text-wine" : "text-ink/70 hover:bg-ink/5"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={cn(
                        "grid h-4 w-4 place-items-center rounded border",
                        active ? "border-wine bg-wine text-ivory" : "border-ink/25"
                      )}
                    >
                      {active && <Check size={11} />}
                    </span>
                    {c.short}
                  </span>
                  <span className="text-xs text-ink/40">{count}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <h3 className="eyebrow text-wine">Max price</h3>
        <p className="mt-3 font-display text-xl text-ink">{formatINR(priceCeiling)}</p>
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          step={500}
          value={priceCeiling}
          onChange={(e) => {
            setPriceCeiling(Number(e.target.value));
            setVisible(PAGE_SIZE);
          }}
          aria-label="Maximum price"
          className="mt-3 w-full accent-[#6b1220]"
        />
        <div className="mt-1 flex justify-between text-[11px] text-ink/45">
          <span>{formatINR(minPrice)}</span>
          <span>{formatINR(maxPrice)}</span>
        </div>
      </div>

      <div>
        <h3 className="eyebrow text-wine">Colour</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {allColors.map((c) => {
            const active = activeColors.has(c);
            return (
              <button
                key={c}
                onClick={() => toggleSet(setActiveColors, c)}
                title={c}
                aria-pressed={active}
                className={cn(
                  "grid h-8 w-8 place-items-center rounded-full ring-2 transition",
                  active ? "ring-wine" : "ring-transparent hover:ring-ink/20"
                )}
                style={{ backgroundColor: colorSwatch(c) }}
              >
                {active && <Check size={13} className="text-white drop-shadow" />}
                <span className="sr-only">{c}</span>
              </button>
            );
          })}
        </div>
      </div>

      {activeFilterCount > 0 && (
        <button
          onClick={clearAll}
          className="w-full rounded-full border border-ink/15 px-5 py-2.5 text-xs uppercase tracking-[0.22em] text-ink/60 transition hover:border-wine hover:text-wine"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[16rem_1fr] xl:grid-cols-[18rem_1fr]">
      <aside className="hidden lg:block">
        <div className="sticky top-28">{filterPanel}</div>
      </aside>

      <div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/40"
            />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisible(PAGE_SIZE);
              }}
              placeholder="Search within the collection…"
              aria-label="Search within the collection"
              className="w-full rounded-full border border-ink/15 bg-white/60 py-3 pl-11 pr-4 text-sm text-ink placeholder:text-ink/40 focus:border-gold focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFiltersOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-3 text-xs uppercase tracking-[0.18em] text-ink/70 transition hover:border-wine hover:text-wine lg:hidden"
            >
              <SlidersHorizontal size={15} /> Filters
              {activeFilterCount > 0 && (
                <span className="grid h-5 w-5 place-items-center rounded-full bg-wine text-[10px] text-ivory">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <label className="sr-only" htmlFor="sort">
              Sort by
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-full border border-ink/15 bg-white/60 px-4 py-3 text-xs uppercase tracking-[0.18em] text-ink/75 focus:border-gold focus:outline-none"
            >
              {sortOptions.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="mt-5 text-sm text-ink/50">
          Showing{" "}
          <span className="font-medium text-ink">{visibleProducts.length}</span> of{" "}
          <span className="font-medium text-ink">{filtered.length}</span> sarees
          {activeCategories.size > 0 && " · filtered"}
        </p>

        {filtered.length === 0 ? (
          <div className="mt-16 flex flex-col items-center rounded-xl border border-dashed border-gold/40 px-8 py-20 text-center">
            <p className="font-display text-3xl text-ink">No sarees match your search</p>
            <p className="mt-3 max-w-md text-sm text-ink/55">
              Try removing a filter, widening your price range, or searching by weave, colour or
              occasion instead.
            </p>
            <button
              onClick={clearAll}
              className="mt-6 rounded-full bg-wine px-6 py-3 text-xs uppercase tracking-[0.22em] text-ivory transition hover:bg-wine-deep"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <>
            <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-7 md:grid-cols-3">
              {visibleProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} onQuickView={setQuickView} />
              ))}
            </div>
            {visible < filtered.length && (
              <div className="mt-14 flex justify-center">
                <button
                  onClick={() => setVisible((v) => v + PAGE_SIZE)}
                  className="rounded-full border border-wine/40 px-8 py-3.5 text-xs uppercase tracking-[0.24em] text-wine transition hover:bg-wine hover:text-ivory"
                >
                  Load more sarees ({filtered.length - visible} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            className="fixed inset-0 z-[88] flex justify-start lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              aria-label="Close filters"
              className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
              onClick={() => setFiltersOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative h-full w-[85%] max-w-sm overflow-y-auto bg-ivory p-6 shadow-2xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <p className="font-display text-2xl text-ink">Refine</p>
                <button
                  onClick={() => setFiltersOpen(false)}
                  aria-label="Close filters"
                  className="rounded-full p-2 text-ink/60 hover:bg-ink/5"
                >
                  <X size={20} />
                </button>
              </div>
              {filterPanel}
              <button
                onClick={() => setFiltersOpen(false)}
                className="mt-8 w-full rounded-full bg-wine px-6 py-3.5 text-xs uppercase tracking-[0.22em] text-ivory"
              >
                Show {filtered.length} sarees
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <QuickView product={quickView} onClose={() => setQuickView(null)} />
    </div>
  );
}
