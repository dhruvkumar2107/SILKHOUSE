import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost, Cinzel } from "next/font/google";
import "./globals.css";
import { SiteProviders } from "@/components/site-providers";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://geetasilkhouse.example"),
  title: {
    default: "Geeta Silk House — Timeless Silk. Eternal Elegance.",
    template: "%s · Geeta Silk House",
  },
  description:
    "Discover exquisite Kanjivaram, Banarasi, Mysore, bridal and designer silk sarees at Geeta Silk House, Vijayapura, Karnataka. Where every weave tells a royal story.",
  keywords: [
    "silk sarees",
    "Kanjivaram saree",
    "Banarasi saree",
    "bridal silk saree",
    "Geeta Silk House",
    "Vijayapura saree shop",
    "Karnataka silk sarees",
  ],
  openGraph: {
    title: "Geeta Silk House — Timeless Silk. Eternal Elegance.",
    description:
      "Premium silk sarees for weddings, festivals and everyday elegance, curated in Vijayapura, Karnataka.",
    type: "website",
    siteName: "Geeta Silk House",
  },
  twitter: {
    card: "summary_large_image",
    title: "Geeta Silk House — Timeless Silk. Eternal Elegance.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#6b1220",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${cormorant.variable} ${jost.variable} ${cinzel.variable} h-full`}
    >
      <body className="min-h-full bg-ivory text-ink antialiased">
        <SiteProviders>{children}</SiteProviders>
      </body>
    </html>
  );
}
