"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="relative flex min-h-[80vh] items-center bg-ink text-ivory">
      <div className="container-lux py-24 text-center">
        <p className="eyebrow text-gold">Something went wrong</p>
        <h1 className="mt-6 font-display text-5xl sm:text-6xl">A thread came loose</h1>
        <p className="mx-auto mt-5 max-w-md text-base text-ivory/70">
          We could not load this section just now. Please try again — or reach us directly on
          WhatsApp.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={reset}
            className="rounded-full bg-gold px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.24em] text-ink transition hover:bg-gold-light"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-full border border-ivory/35 px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.24em] text-ivory transition hover:border-gold hover:text-gold"
          >
            Return home
          </Link>
        </div>
      </div>
    </section>
  );
}
