export type Availability = "in-stock" | "made-to-order" | "limited" | "out-of-stock";

export interface SareePalette {
  name: string;
  base: string;
  deep: string;
  light: string;
  accent: string;
}

export interface Saree {
  id: string;
  sku: string;
  slug: string;
  name: string;
  category: string;
  categoryName: string;
  price: number;
  description: string;
  image: string;
  colors: string[];
  palette: SareePalette;
  fabric: string;
  weave: string;
  occasion: string;
  availability: Availability;
  featured: boolean;
}
