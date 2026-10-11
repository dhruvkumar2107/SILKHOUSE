import Link from "next/link";
import { MapPin, MessageCircle } from "lucide-react";
import { categories } from "@/lib/catalog";
import { directionsUrl, storeConfig } from "@/lib/config";
import { generalEnquiryMessage, whatsappUrl } from "@/lib/catalog";

function InstagramGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden>
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.31-1.46.72-2.13 1.38C1.35 2.68.94 3.35.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.79.72 1.46 1.38 2.13.67.66 1.34 1.07 2.13 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.79-.31 1.46-.72 2.13-1.38.66-.67 1.07-1.34 1.38-2.13.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.9 5.9 0 0 0-1.38-2.13A5.9 5.9 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.41-10.41a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
    </svg>
  );
}

function FacebookGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden>
      <path d="M24 12.07C24 5.44 18.63.07 12 .07S0 5.44 0 12.07c0 5.99 4.39 10.95 10.13 11.85v-8.38H7.08v-3.47h3.05V9.43c0-3.01 1.79-4.67 4.53-4.67 1.31 0 2.69.24 2.69.24v2.95h-1.51c-1.49 0-1.96.93-1.96 1.87v2.25h3.33l-.53 3.47h-2.8v8.38C19.61 23.02 24 18.06 24 12.07z" />
    </svg>
  );
}

function YoutubeGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden>
      <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z" />
    </svg>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();
  const { social } = storeConfig;

  return (
    <footer className="relative overflow-hidden bg-ink text-ivory">
      <div className="pointer-events-none absolute inset-0 silk-texture opacity-60" aria-hidden />
      <div className="relative container-lux py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
          <div>
            <p className="font-accent text-sm tracking-[0.34em] text-gold">GEETA</p>
            <p className="font-display text-3xl tracking-[0.14em]">SILK HOUSE</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ivory/60">
              {storeConfig.tagline} Discover silk sarees woven with tradition and chosen for the
              moments that matter.
            </p>
            <div className="mt-6 flex gap-3">
              {social.instagram && (
                <a
                  href={social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-ivory/70 transition hover:border-gold hover:text-gold"
                >
                  <InstagramGlyph />
                </a>
              )}
              {social.facebook && (
                <a
                  href={social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-ivory/70 transition hover:border-gold hover:text-gold"
                >
                  <FacebookGlyph />
                </a>
              )}
              {social.youtube && (
                <a
                  href={social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-ivory/70 transition hover:border-gold hover:text-gold"
                >
                  <YoutubeGlyph />
                </a>
              )}
            </div>
          </div>

          <div>
            <h2 className="eyebrow text-gold">Collections</h2>
            <ul className="mt-5 space-y-3 text-sm text-ivory/65">
              {categories.slice(0, 6).map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/collection?category=${c.id}`}
                    className="transition hover:text-gold"
                  >
                    {c.short}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/collection" className="font-medium text-gold/90 hover:text-gold">
                  View all 100 sarees →
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="eyebrow text-gold">Explore</h2>
            <ul className="mt-5 space-y-3 text-sm text-ivory/65">
              <li>
                <Link href="/#signature" className="transition hover:text-gold">
                  The Signature Edit
                </Link>
              </li>
              <li>
                <Link href="/#story" className="transition hover:text-gold">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/#location" className="transition hover:text-gold">
                  Visit Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="transition hover:text-gold">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition hover:text-gold">
                  Terms &amp; Conditions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="eyebrow text-gold">Visit the store</h2>
            <address className="mt-5 space-y-1 text-sm not-italic leading-relaxed text-ivory/65">
              <p>{storeConfig.address.line1}</p>
              <p>{storeConfig.address.line2}</p>
              <p>
                {storeConfig.address.city}, {storeConfig.address.state}{" "}
                {storeConfig.address.postalCode}
              </p>
            </address>
            <div className="mt-6 flex flex-col gap-3">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-ivory/75 transition hover:text-gold"
              >
                <MapPin size={16} /> Get directions
              </a>
              <a
                href={whatsappUrl(generalEnquiryMessage())}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-ivory/75 transition hover:text-gold"
              >
                <MessageCircle size={16} /> WhatsApp enquiries
              </a>
              {storeConfig.phone && (
                <a
                  href={`tel:${storeConfig.phone.replace(/\s/g, "")}`}
                  className="text-sm text-ivory/75 transition hover:text-gold"
                >
                  {storeConfig.phone}
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="hairline my-12" />

        <div className="flex flex-col items-center justify-between gap-4 text-center text-xs text-ivory/45 sm:flex-row sm:text-left">
          <p>
            © {year} {storeConfig.name}. All rights reserved.
          </p>
          <p>
            Product imagery is representative stock photography — please visit the store to view the
            actual inventory in person.
          </p>
        </div>
      </div>
    </footer>
  );
}
