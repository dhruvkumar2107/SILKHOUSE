import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Saree } from "@/lib/types";
import { categories } from "@/lib/catalog";
import { Reveal } from "@/components/ui/reveal";

export function CategoryStrip({ products }: { products: Saree[] }) {
  return (
    <section className="border-y border-gold/15 bg-ivory-warm py-16 sm:py-20">
      <div className="container-lux">
        <Reveal className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow text-wine">Explore by weave</p>
            <h2 className="mt-4 font-display text-4xl text-ink sm:text-5xl">
              Ten traditions, one house
            </h2>
          </div>
          <Link
            href="/collection"
            className="text-sm uppercase tracking-[0.2em] text-wine link-underline"
          >
            All collections
          </Link>
        </Reveal>
      </div>

      <div className="mt-10 overflow-x-auto pb-4 no-scrollbar">
        <div className="container-lux flex min-w-max gap-4">
          {categories.map((c, i) => {
            const count = products.filter((p) => p.category === c.id).length;
            return (
              <Reveal key={c.id} delay={Math.min(i, 6) * 0.04}>
                <Link
                  href={`/collection?category=${c.id}`}
                  className="group flex w-64 shrink-0 flex-col justify-between rounded-lg border border-gold/25 bg-ivory p-6 transition hover:border-wine/50 hover:shadow-[0_16px_40px_rgba(20,16,13,0.1)] sm:w-72"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-accent text-xs tracking-[0.3em] text-gold-deep">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <ArrowUpRight
                        size={18}
                        className="text-ink/30 transition group-hover:text-wine"
                      />
                    </div>
                    <h3 className="mt-6 font-display text-2xl leading-snug text-ink">{c.short}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-ink/55">{c.blurb}</p>
                  </div>
                  <p className="mt-6 text-[11px] uppercase tracking-[0.24em] text-wine/70">
                    {count} sarees
                  </p>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
