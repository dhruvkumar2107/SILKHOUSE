import { promises as fs } from "node:fs";
import path from "node:path";
import { seedProducts } from "@/data/products";
import type { Availability, Saree } from "@/lib/types";

/**
 * Server-side product persistence.
 *
 * The catalog is seeded from `src/data/products.ts` and, once an admin performs
 * any CRUD operation, persisted to `data/products.json` at the project root.
 *
 * NOTE: this file-backed store is ideal for a single-server / self-hosted
 * deployment and for local previewing. To run on a serverless host or with
 * multiple instances, swap the four exported mutators below for calls to a real
 * database — the rest of the application only depends on this module's API.
 */

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "products.json");

let cache: Saree[] | null = null;
let writeChain: Promise<unknown> = Promise.resolve();

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = writeChain.then(fn, fn);
  writeChain = run.then(
    () => undefined,
    () => undefined
  );
  return run;
}

export async function readProducts(): Promise<Saree[]> {
  if (cache) return cache;
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    cache = Array.isArray(parsed) ? (parsed as Saree[]) : clone(seedProducts);
  } catch {
    cache = clone(seedProducts);
  }
  return cache;
}

async function persist(products: Saree[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = `${DATA_FILE}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(products, null, 2), "utf8");
  await fs.rename(tmp, DATA_FILE);
  cache = products;
}

export async function getProductById(id: string): Promise<Saree | undefined> {
  return (await readProducts()).find((p) => p.id === id);
}

export async function getProductBySlug(slug: string): Promise<Saree | undefined> {
  return (await readProducts()).find((p) => p.slug === slug);
}

const AVAILABILITY: Availability[] = ["in-stock", "made-to-order", "limited", "out-of-stock"];

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

export interface ProductInput {
  name?: string;
  category?: string;
  categoryName?: string;
  price?: number | string;
  description?: string;
  image?: string;
  colors?: string[];
  fabric?: string;
  weave?: string;
  occasion?: string;
  availability?: Availability;
  featured?: boolean;
}

function normalize(input: ProductInput, base: Partial<Saree> = {}): Partial<Saree> {
  const out: Partial<Saree> = { ...base };
  if (input.name !== undefined) out.name = String(input.name).trim();
  if (input.category !== undefined) out.category = slugify(String(input.category)) || "designer";
  if (input.categoryName !== undefined) out.categoryName = String(input.categoryName).trim();
  if (input.price !== undefined) {
    const n = Number(String(input.price).replace(/[^\d.]/g, ""));
    out.price = Number.isFinite(n) ? Math.max(0, Math.round(n)) : 0;
  }
  if (input.description !== undefined) out.description = String(input.description).trim();
  if (input.image !== undefined) out.image = String(input.image).trim();
  if (input.colors !== undefined) {
    const list = Array.isArray(input.colors)
      ? input.colors
      : String(input.colors)
          .split(",")
          .map((c) => c.trim());
    out.colors = list.map(String).filter(Boolean).slice(0, 8);
  }
  if (input.fabric !== undefined) out.fabric = String(input.fabric).trim();
  if (input.weave !== undefined) out.weave = String(input.weave).trim();
  if (input.occasion !== undefined) out.occasion = String(input.occasion).trim();
  if (input.availability !== undefined && AVAILABILITY.includes(input.availability)) {
    out.availability = input.availability;
  }
  if (input.featured !== undefined) out.featured = Boolean(input.featured);
  return out;
}

function fallbackPalette() {
  return { name: "Antique Gold", base: "#A9823C", deep: "#4F3812", light: "#E0C078", accent: "#6E4E17" };
}

export function validateProduct(input: ProductInput): string[] {
  const errors: string[] = [];
  if (!input.name || !String(input.name).trim()) errors.push("Name is required.");
  if (input.price === undefined || Number.isNaN(Number(input.price))) errors.push("Price is required.");
  return errors;
}

export function createProduct(input: ProductInput): Promise<Saree> {
  return withLock(async () => {
    const products = await readProducts();
    const normalized = normalize(input);
    const name = normalized.name ?? "Untitled Saree";

    const baseSlug = slugify(name) || "saree";
    let slug = baseSlug;
    let i = 2;
    const taken = new Set(products.map((p) => p.slug));
    while (taken.has(slug)) slug = `${baseSlug}-${i++}`;

    const maxNum = products.reduce((max, p) => {
      const n = Number(p.sku?.replace(/[^\d]/g, ""));
      return Number.isFinite(n) ? Math.max(max, n) : max;
    }, 0);
    const num = String(maxNum + 1).padStart(3, "0");

    const product: Saree = {
      id: `gsh-${num}-${Date.now().toString(36)}`,
      sku: `GSH-${num}`,
      slug,
      name,
      category: normalized.category ?? "designer",
      categoryName: normalized.categoryName ?? normalized.category ?? "Designer Silk Sarees",
      price: normalized.price ?? 0,
      description: normalized.description ?? "",
      image: normalized.image || "/atmosphere/texture.svg",
      colors: normalized.colors ?? [],
      palette: fallbackPalette(),
      fabric: normalized.fabric ?? "Pure Silk",
      weave: normalized.weave ?? "Handwoven",
      occasion: normalized.occasion ?? "Festive",
      availability: normalized.availability ?? "in-stock",
      featured: normalized.featured ?? false,
    };

    await persist([...products, product]);
    return product;
  });
}

export function updateProduct(id: string, input: ProductInput): Promise<Saree | null> {
  return withLock(async () => {
    const products = await readProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    const merged = { ...products[index], ...normalize(input, products[index]) } as Saree;
    if (input.name !== undefined) {
      const baseSlug = slugify(merged.name) || products[index].slug;
      const others = new Set(products.filter((p) => p.id !== id).map((p) => p.slug));
      let slug = baseSlug;
      let i = 2;
      while (others.has(slug)) slug = `${baseSlug}-${i++}`;
      merged.slug = slug;
    }
    const next = [...products];
    next[index] = merged;
    await persist(next);
    return merged;
  });
}

export function deleteProduct(id: string): Promise<boolean> {
  return withLock(async () => {
    const products = await readProducts();
    const next = products.filter((p) => p.id !== id);
    if (next.length === products.length) return false;
    await persist(next);
    return true;
  });
}

export function resetProducts(): Promise<Saree[]> {
  return withLock(async () => {
    const fresh = clone(seedProducts);
    await persist(fresh);
    return fresh;
  });
}
