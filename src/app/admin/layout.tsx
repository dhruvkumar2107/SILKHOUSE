import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Catalogue Admin",
  description: "Manage the Geeta Silk House saree catalogue.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col bg-ink/[0.02]">
      <header className="border-b border-gold/20 bg-ink text-ivory">
        <div className="container-lux flex h-[68px] items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full border border-gold/50 font-accent text-xs text-gold">
              GS
            </span>
            <div className="leading-none">
              <p className="font-accent text-[11px] tracking-[0.3em] text-gold">CATALOGUE</p>
              <p className="font-display text-lg tracking-[0.12em]">Admin Console</p>
            </div>
          </div>
          <Link
            href="/"
            className="text-xs uppercase tracking-[0.22em] text-ivory/70 transition hover:text-gold"
          >
            View site
          </Link>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
