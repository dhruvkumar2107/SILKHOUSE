import type { Metadata } from "next";
import { readProducts } from "@/lib/product-store";
import { CollectionExplorer } from "@/components/collection-explorer";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "The Collection",
  description:
    "Browse all 100 silk sarees — Kanjivaram, Banarasi, Mysore, soft silk, bridal, pattu, designer, temple border, festive and lightweight. Filter, search and enquire on WhatsApp.",
};

interface CollectionPageProps {
  searchParams: Promise<{ category?: string | string[] }>;
}

export default async function CollectionPage({ searchParams }: CollectionPageProps) {
  const params = await searchParams;
  const categoryParam = Array.isArray(params.category) ? params.category[0] : params.category;
  const products = await readProducts();

  return (
    <>
      <section className="relative overflow-hidden bg-ink pt-[68px] text-ivory sm:pt-[78px]">
        <div className="pointer-events-none absolute inset-0 silk-texture opacity-60" aria-hidden />
        <div className="container-lux relative py-16 text-center sm:py-20">
          <Reveal>
            <p className="eyebrow text-gold">One hundred sarees, endless occasions</p>
            <h1 className="mt-5 font-display text-5xl leading-tight sm:text-6xl lg:text-7xl">
              The Collection
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ivory/70">
              Browse our full house of silks. Filter by collection, colour and price, search by weave
              or occasion, and save the sarees you love to your enquiry list.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-ivory py-14 sm:py-20">
        <div className="container-lux">
          <CollectionExplorer products={products} initialCategory={categoryParam} />
        </div>
      </section>
    </>
  );
}
