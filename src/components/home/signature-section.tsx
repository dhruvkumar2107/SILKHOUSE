import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Saree } from "@/lib/types";
import { signatureEdits } from "@/lib/catalog";
import { Reveal } from "@/components/ui/reveal";
import { Tilt3D } from "@/components/ui/tilt-3d";
import { SareeImage } from "@/components/ui/saree-image";
import { FeaturedGrid } from "@/components/home/featured-grid";

const spans = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-5", "lg:col-span-7"];

export function SignatureSection({ featured }: { featured: Saree[] }) {
  return (
    <section id="signature" className="relative bg-ivory py-16 sm:py-20">
      <div className="container-lux">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow text-wine">Curated by Geeta Silk House</p>
          <h2 className="mt-5 font-display text-5xl leading-[1.02] text-ink sm:text-6xl lg:text-7xl">
            The Signature <span className="italic text-wine">Silk Edit</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-ink/60">
            Four moods, one obsession — silk with presence. Explore the edits our stylists reach for
            when the occasion deserves nothing less than extraordinary.
          </p>
        </Reveal>

        <div className="mt-8 grid gap-5 lg:grid-cols-12">
          {signatureEdits.map((edit, i) => (
            <Reveal key={edit.id} delay={i * 0.06} className={spans[i]}>
              <Tilt3D
                max={5}
                scale={1.01}
                className="h-[24rem] rounded-lg sm:h-[30rem] lg:h-[34rem]"
              >
                <Link
                  href={`/collection?category=${edit.filterCategory}`}
                  className="group relative block h-full w-full overflow-hidden rounded-lg border border-gold/20"
                >
                <SareeImage
                  src={edit.image}
                  alt={edit.title}
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="h-full w-full"
                  zoomOnHover
                />
                <span className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 p-7 sm:p-9">
                  <span
                    className="eyebrow block"
                    style={{ color: edit.accent }}
                  >
                    0{i + 1} — Edit
                  </span>
                  <span className="mt-3 flex items-center gap-3 font-display text-4xl text-ivory sm:text-5xl">
                    {edit.title}
                  </span>
                  <span className="mt-3 block max-w-sm text-sm leading-relaxed text-ivory/70">
                    {edit.copy}
                  </span>
                  <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-gold">
                    Shop the edit
                    <ArrowUpRight
                      size={15}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </span>
              </Link>
              </Tilt3D>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 text-center">
          <p className="eyebrow text-wine">Featured this season</p>
          <h3 className="mt-4 font-display text-4xl text-ink sm:text-5xl">Signature Sarees</h3>
        </Reveal>

        <div className="mt-10">
          <FeaturedGrid products={featured} />
        </div>
      </div>
    </section>
  );
}
