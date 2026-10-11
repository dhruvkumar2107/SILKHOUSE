import Link from "next/link";
import { MessageCircle, Store } from "lucide-react";
import { generalEnquiryMessage, whatsappUrl } from "@/lib/catalog";
import { Reveal } from "@/components/ui/reveal";

export function HelpCta() {
  return (
    <section className="relative overflow-hidden bg-wine text-ivory">
      <div className="pointer-events-none absolute inset-0 silk-texture opacity-60" aria-hidden />
      <div className="container-lux relative py-20 sm:py-24">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow text-gold-light">Personal assistance</p>
          <h2 className="mt-5 font-display text-5xl leading-tight sm:text-6xl">
            Need Help Choosing Your Saree?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-ivory/75">
            Tell us the occasion, your preferred colours and your budget. Our team will curate a
            shortlist of sarees that suit the moment — no pressure, just guidance.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={whatsappUrl(generalEnquiryMessage())}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full bg-[#25D366] px-8 py-4 text-xs font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-[#1ebe5b]"
            >
              <MessageCircle size={17} /> Chat on WhatsApp
            </a>
            <Link
              href="/#location"
              className="inline-flex items-center gap-3 rounded-full border border-ivory/40 px-8 py-4 text-xs font-semibold uppercase tracking-[0.24em] text-ivory transition hover:border-gold hover:text-gold"
            >
              <Store size={17} /> Visit the store
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
