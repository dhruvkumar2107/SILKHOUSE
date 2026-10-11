import Link from "next/link";
import { Clock, Mail, MapPin, Navigation, Phone } from "lucide-react";
import {
  directionsUrl,
  mapEmbedUrl,
  storeConfig,
} from "@/lib/config";
import { Reveal } from "@/components/ui/reveal";

export function LocationSection() {
  const { address } = storeConfig;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    name: storeConfig.name,
    image: "/atmosphere/hero.svg",
    description:
      "Premium silk sarees — Kanjivaram, Banarasi, Mysore, bridal, designer and festive wear — in Vijayapura, Karnataka.",
    address: {
      "@type": "PostalAddress",
      streetAddress: `${address.line1}, ${address.line2}`,
      addressLocality: address.city,
      addressRegion: address.state,
      postalCode: address.postalCode,
      addressCountry: "IN",
    },
  };

  return (
    <section id="location" className="bg-ivory py-20 sm:py-28">
      <div className="container-lux">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow text-wine">Find us in Vijayapura</p>
            <h2 className="mt-5 font-display text-5xl leading-tight text-ink sm:text-6xl">
              Visit Geeta Silk House
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-ink/60">
              Step in to feel the silks in person, compare drapes side by side, and let our team help
              you find the right saree for your occasion.
            </p>

            <ul className="mt-9 space-y-5 text-sm">
              <li className="flex gap-4">
                <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gold/40 text-wine">
                  <MapPin size={18} />
                </span>
                <address className="not-italic leading-relaxed text-ink/75">
                  <span className="font-medium text-ink">{storeConfig.name}</span>
                  <br />
                  {address.line1}
                  <br />
                  {address.line2}
                  <br />
                  {address.city}, {address.state} {address.postalCode}, {address.country}
                </address>
              </li>

              {storeConfig.phone && (
                <li className="flex gap-4">
                  <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gold/40 text-wine">
                    <Phone size={18} />
                  </span>
                  <a
                    href={`tel:${storeConfig.phone.replace(/\s/g, "")}`}
                    className="self-center text-ink/75 hover:text-wine"
                  >
                    {storeConfig.phone}
                  </a>
                </li>
              )}

              {storeConfig.email && (
                <li className="flex gap-4">
                  <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gold/40 text-wine">
                    <Mail size={18} />
                  </span>
                  <a
                    href={`mailto:${storeConfig.email}`}
                    className="self-center text-ink/75 hover:text-wine"
                  >
                    {storeConfig.email}
                  </a>
                </li>
              )}

              <li className="flex gap-4">
                <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gold/40 text-wine">
                  <Clock size={18} />
                </span>
                <span className="self-center text-ink/60">
                  Store timings vary — please confirm by WhatsApp before visiting.
                </span>
              </li>
            </ul>

            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-full bg-wine px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.24em] text-ivory transition hover:bg-wine-deep"
              >
                <Navigation size={16} /> Get directions
              </a>
              <Link
                href="/collection"
                className="inline-flex items-center gap-3 rounded-full border border-ink/20 px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.24em] text-ink/70 transition hover:border-wine hover:text-wine"
              >
                Browse online first
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="overflow-hidden rounded-xl border border-gold/25 shadow-[0_20px_60px_rgba(20,16,13,0.12)]">
              <iframe
                title={`Map to ${storeConfig.name}`}
                src={mapEmbedUrl}
                width="100%"
                height="480"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block h-[22rem] w-full sm:h-[30rem]"
              />
            </div>
          </Reveal>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
