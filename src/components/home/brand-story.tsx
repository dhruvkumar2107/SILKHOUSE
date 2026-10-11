import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { GoldParticles } from "@/components/ui/gold-particles";
import { Reveal } from "@/components/ui/reveal";

export function BrandStory() {
  return (
    <section id="story" className="relative overflow-hidden bg-ink text-ivory">
      <div className="pointer-events-none absolute inset-0 silk-texture opacity-70" aria-hidden />
      <div className="relative grid lg:grid-cols-2">
        <div className="relative min-h-[26rem] overflow-hidden lg:min-h-[46rem]">
          <Image
            src="/atmosphere/story.svg"
            alt="Silk yarn and drape, an illustration of the weaving craft"
            fill
            unoptimized
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/30 lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-ink/70" />
          <GoldParticles className="pointer-events-none absolute inset-0" count={18} />
          <div
            className="perspective-lux absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 sm:h-48 sm:w-48"
            aria-hidden
          >
            <div className="h-full w-full animate-spin-y preserve-3d">
              <div className="absolute inset-0 grid place-items-center rounded-full border border-gold/60 bg-ink/85 font-accent text-2xl tracking-wide text-gold shadow-[0_0_50px_rgba(198,161,91,0.35)] backdrop-blur backface-hidden sm:text-3xl">
                GS
              </div>
              <div className="absolute inset-0 grid rotate-y-180 place-items-center rounded-full border border-gold/50 bg-gold font-accent text-lg uppercase tracking-[0.16em] text-ink backface-hidden sm:text-xl">
                Geeta
              </div>
            </div>
          </div>
        </div>

        <div className="relative flex items-center px-6 py-20 sm:px-12 lg:px-16 xl:px-24">
          <Reveal className="max-w-xl">
            <p className="eyebrow flex items-center text-gold">
              <span className="mr-4 inline-block h-px w-10 bg-gold/70" />
              Our Philosophy
            </p>
            <h2 className="mt-6 font-display text-5xl leading-[1.02] sm:text-6xl">
              A Legacy Woven
              <br />
              <span className="italic text-gold-light">in Silk</span>
            </h2>

            <div className="mt-8 space-y-5 text-base leading-relaxed text-ivory/70">
              <p>
                For generations, a silk saree has carried more than thread. It holds the patience of
                the loom, the eye of the weaver, and the memory of every celebration it has been
                draped for — a wedding, a first festival, a quiet family blessing.
              </p>
              <p>
                Geeta Silk House is built around that idea: that an heirloom begins the moment you
                choose it. Our collections bring together the depth of Indian weaving traditions and a
                modern, considered eye for colour, drape and detail — so the saree you choose feels
                as personal as the story you are about to make.
              </p>
              <p className="text-ivory/55">
                This is our brand philosophy, presented as positioning rather than a claim about our
                origins. When you visit, we would love to tell you the story of each weave in person.
              </p>
            </div>

            <div className="mt-9 flex items-center gap-6">
              <Link
                href="/collection"
                className="group inline-flex items-center gap-3 rounded-full bg-gold px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.24em] text-ink transition hover:bg-gold-light"
              >
                Discover the collection
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <span className="hidden h-px w-24 bg-gradient-to-r from-gold/70 to-transparent sm:block" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
