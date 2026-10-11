import { storeConfig } from "@/lib/config";
import type { Availability, Saree } from "@/lib/types";

export interface CategoryMeta {
  id: string;
  name: string;
  short: string;
  blurb: string;
}

export const categories: CategoryMeta[] = [
  { id: "kanjivaram", name: "Kanjivaram Silk Sarees", short: "Kanjivaram", blurb: "Temple-town weaves with lustrous zari and contrast korvai borders." },
  { id: "banarasi", name: "Banarasi Silk Sarees", short: "Banarasi", blurb: "Brocade artistry from the ghats, rich with meenakari motifs." },
  { id: "mysore", name: "Mysore Silk Sarees", short: "Mysore", blurb: "Understated, feather-light silk with a gentle royal sheen." },
  { id: "soft-silk", name: "Soft Silk Sarees", short: "Soft Silk", blurb: "Easy drapes that look festive and feel effortless." },
  { id: "bridal", name: "Bridal Silk Sarees", short: "Bridal", blurb: "Couture heirlooms for the most photographed day of your life." },
  { id: "pattu", name: "Traditional Pattu Sarees", short: "Pattu", blurb: "Pure pattu classics for weddings, temples and family rituals." },
  { id: "designer", name: "Designer Silk Sarees", short: "Designer", blurb: "Contemporary silhouettes and modern zari geometry." },
  { id: "temple-border", name: "Temple Border Sarees", short: "Temple Border", blurb: "Gopuram borders and motifs drawn from South Indian temples." },
  { id: "festive", name: "Festive Wear Sarees", short: "Festive", blurb: "Bright, celebratory drapes for haldi, Diwali and pujas." },
  { id: "lightweight", name: "Lightweight Silk Sarees", short: "Lightweight", blurb: "Airy silks made for long days and easy travel." },
];

export const categoryById = new Map(categories.map((c) => [c.id, c]));

export function formatINR(value: number): string {
  return `₹${value.toLocaleString("en-IN")}`;
}

export const COLOR_HEX: Record<string, string> = {
  "Ruby Crimson": "#8E1E2C",
  "Royal Maroon": "#6B1220",
  "Antique Gold": "#A9823C",
  "Emerald Forest": "#0F5A45",
  "Peacock Teal": "#10556B",
  "Haldi Mustard": "#B07C12",
  "Rani Magenta": "#9C2A5A",
  "Aubergine Purple": "#4E2350",
  "Terracotta Rust": "#A24A28",
  "Midnight Indigo": "#22335E",
  "Rosewood Wine": "#5E1C2A",
  "Coral Blush": "#C05A50",
  "Olive Bronze": "#6E6A24",
  "Copper Leaf": "#A6622B",
  "Deep Teal Green": "#0E4A47",
  "Saffron Flame": "#C06A0E",
  "Plum Orchid": "#6A2B54",
  "Sage Ivory": "#8A8A6A",
  "Marigold Orange": "#C47A18",
  "Onyx Black": "#2A2420",
};

export function colorSwatch(name: string): string {
  return COLOR_HEX[name] ?? "#C6A15B";
}

export interface SortOption {
  id: string;
  label: string;
}

export const sortOptions: SortOption[] = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "name-asc", label: "Name: A to Z" },
];

export function availabilityLabel(a: Availability): string {
  switch (a) {
    case "in-stock":
      return "In Stock";
    case "made-to-order":
      return "Made to Order";
    case "limited":
      return "Limited Pieces";
    case "out-of-stock":
      return "Enquire";
  }
}

export function priceBounds(products: Saree[]): [number, number] {
  if (products.length === 0) return [0, 100000];
  let min = Infinity;
  let max = 0;
  for (const p of products) {
    if (p.price < min) min = p.price;
    if (p.price > max) max = p.price;
  }
  return [min, max];
}

export interface EnquiryItem {
  name: string;
  sku: string;
  price: number;
  categoryName?: string;
  color?: string;
}

export function whatsappUrl(message: string): string {
  const text = encodeURIComponent(message);
  const number = storeConfig.whatsappNumber.replace(/[^\d]/g, "");
  return number
    ? `https://wa.me/${number}?text=${text}`
    : `https://wa.me/?text=${text}`;
}

export function productEnquiryMessage(product: Saree, selectedColor?: string): string {
  const lines = [
    `Namaste ${storeConfig.name}, I would like to enquire about this saree:`,
    "",
    `• ${product.name}`,
    `• SKU: ${product.sku}`,
    `• Collection: ${product.categoryName}`,
    `• Price: ${formatINR(product.price)}`,
  ];
  const color = selectedColor ?? product.palette?.name;
  if (color) lines.push(`• Colour: ${color}`);
  lines.push("", "Could you please share availability and more details?");
  return lines.join("\n");
}

export function bagEnquiryMessage(items: EnquiryItem[]): string {
  const lines = [
    `Namaste ${storeConfig.name}, I would like to enquire about these sarees:`,
    "",
    ...items.map(
      (i, idx) =>
        `${idx + 1}. ${i.name} (${i.sku}) — ${formatINR(i.price)}${i.color ? ` · ${i.color}` : ""}`
    ),
    "",
    "Please share availability, pricing and details.",
  ];
  return lines.join("\n");
}

export function generalEnquiryMessage(): string {
  return `Namaste ${storeConfig.name}, I would like help choosing a silk saree. Could you assist me?`;
}

export const signatureEdits = [
  {
    id: "wedding",
    title: "Wedding Royalty",
    copy: "Heirloom Kanjivaram and bridal silks with opulent zari for the muhurtham.",
    image: "/atmosphere/edit-wedding.svg",
    filterCategory: "bridal",
    accent: "#C6A15B",
  },
  {
    id: "festive",
    title: "Festive Elegance",
    copy: "Colour-rich drapes for haldi, Diwali and every celebration in between.",
    image: "/atmosphere/edit-festive.svg",
    filterCategory: "festive",
    accent: "#E0B04A",
  },
  {
    id: "heritage",
    title: "Heritage Weaves",
    copy: "Temple borders and classic motifs carried across generations.",
    image: "/atmosphere/edit-heritage.svg",
    filterCategory: "temple-border",
    accent: "#D3B160",
  },
  {
    id: "everyday",
    title: "Everyday Luxury",
    copy: "Lightweight and soft silks that make ordinary days feel considered.",
    image: "/atmosphere/edit-everyday.svg",
    filterCategory: "lightweight",
    accent: "#9FB59A",
  },
];
