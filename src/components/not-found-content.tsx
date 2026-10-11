import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export function NotFoundContent() {
  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-ink text-ivory">
      <div className="pointer-events-none absolute inset-0 silk-texture opacity-70" aria-hidden />
      <div className="container-lux relative py-24 text-center">
        <p className="eyebrow text-gold">Page not found</p>
        <h1 className="mt-6 font-display text-6xl leading-none sm:text-8xl">404</h1>
        <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-ivory/70">
          This thread seems to have slipped away. Let us guide you back to the collection — there are
          a hundred sarees waiting.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center gap-3 rounded-full bg-gold px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.24em] text-ink transition hover:bg-gold-light"
          >
            <Home size={16} /> Home
          </Link>
          <Link
            href="/collection"
            className="inline-flex items-center gap-3 rounded-full border border-ivory/35 px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.24em] text-ivory transition hover:border-gold hover:text-gold"
          >
            <ArrowLeft size={16} /> Back to collection
          </Link>
        </div>
      </div>
    </section>
  );
}
