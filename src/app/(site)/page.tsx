import type { Metadata } from "next";
import { readProducts } from "@/lib/product-store";
import { Hero } from "@/components/home/hero";
import { CategoryStrip } from "@/components/home/category-strip";
import { SignatureSection } from "@/components/home/signature-section";
import { BrandStory } from "@/components/home/brand-story";
import { WhyChoose } from "@/components/home/why-choose";
import { HelpCta } from "@/components/home/help-cta";
import { LocationSection } from "@/components/home/location";

export const metadata: Metadata = {
  title: "Geeta Silk House — Timeless Silk. Eternal Elegance.",
  description:
    "Discover exquisite Kanjivaram, Banarasi, Mysore, bridal and designer silk sarees at Geeta Silk House, Vijayapura, Karnataka. Where every weave tells a royal story.",
};

export default async function HomePage() {
  const products = await readProducts();
  const featured = products.filter((p) => p.featured).slice(0, 8);
  const curated = featured.length >= 4 ? featured : products.slice(0, 8);

  return (
    <>
      <Hero
        showcase={
          curated[0]
            ? {
                image: curated[0].image,
                name: curated[0].name,
                label: curated[0].categoryName,
              }
            : null
        }
      />
      <CategoryStrip products={products} />
      <SignatureSection featured={curated} />
      <BrandStory />
      <WhyChoose />
      <HelpCta />
      <LocationSection />
    </>
  );
}
