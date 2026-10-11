import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, readProducts } from "@/lib/product-store";
import { ProductDetail } from "@/components/product-detail";
import { formatINR } from "@/lib/catalog";

interface SareePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await readProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: SareePageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Saree not found" };
  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: {
      title: `${product.name} — Geeta Silk House`,
      description: `${product.categoryName} at ${formatINR(product.price)}.`,
      images: [{ url: product.image }],
    },
  };
}

export default async function SareePage({ params }: SareePageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const products = await readProducts();
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    description: product.description,
    image: product.image,
    category: product.categoryName,
    brand: { "@type": "Brand", name: "Geeta Silk House" },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "INR",
      availability:
        product.availability === "out-of-stock"
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
    },
  };

  return (
    <>
      <ProductDetail product={product} related={related} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
