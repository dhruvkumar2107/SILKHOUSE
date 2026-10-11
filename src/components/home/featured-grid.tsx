"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Saree } from "@/lib/types";
import { ProductCard } from "@/components/product-card";
import { QuickView } from "@/components/quick-view";

interface FeaturedGridProps {
  products: Saree[];
  columns?: 3 | 4;
}

export function FeaturedGrid({ products, columns = 4 }: FeaturedGridProps) {
  const [quickView, setQuickView] = useState<Saree | null>(null);

  return (
    <div>
      <div
        className={
          columns === 4
            ? "grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-7 lg:grid-cols-4"
            : "grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-7 lg:grid-cols-3"
        }
      >
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} onQuickView={setQuickView} />
        ))}
      </div>
      <div className="mt-12 flex justify-center">
        <Link
          href="/collection"
          className="group inline-flex items-center gap-3 rounded-full border border-wine/40 px-8 py-4 text-xs font-semibold uppercase tracking-[0.24em] text-wine transition hover:bg-wine hover:text-ivory"
        >
          View all 100 sarees
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
      <QuickView product={quickView} onClose={() => setQuickView(null)} />
    </div>
  );
}
