"use client";

import Image from "next/image";
import { Tilt3D } from "@/components/ui/tilt-3d";
import { GoldParticles } from "@/components/ui/gold-particles";

interface HeroShowcaseProps {
  image: string;
  name: string;
  label: string;
}

export function HeroShowcase({ image, name, label }: HeroShowcaseProps) {
  return (
    <div className="perspective-lux relative mx-auto hidden w-full max-w-md lg:block" aria-hidden>
      <Tilt3D max={14} scale={1.01} lift={42} className="preserve-3d">
        <div
          className="absolute inset-0 rounded-2xl border border-gold/35 bg-wine/20"
          style={{ transform: "translateZ(-46px) translate(20px, 20px)" }}
        />
        <div
          className="absolute inset-0 rounded-2xl border border-gold/25 bg-ivory/5"
          style={{ transform: "translateZ(-24px) translate(10px, 10px)" }}
        />

        <div className="absolute -inset-10 animate-spin-y-slow preserve-3d">
          <div
            className="absolute left-1/2 top-1/2 h-[112%] w-[112%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/30"
            style={{ transform: "translate(-50%, -50%) rotateX(75deg)" }}
          />
          <div
            className="absolute left-1/2 top-1/2 h-[140%] w-[140%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-gold/20"
            style={{ transform: "translate(-50%, -50%) rotateX(75deg)" }}
          />
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-gold/45 bg-ink shadow-[0_50px_120px_rgba(0,0,0,0.55)]">
          <div className="relative aspect-[3/4]">
            <Image
              src={image}
              alt=""
              fill
              unoptimized
              sizes="(max-width: 1024px) 0px, 26rem"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-7">
              <p className="eyebrow text-gold-light">{label}</p>
              <p className="mt-3 font-display text-3xl text-ivory">{name}</p>
            </div>
          </div>
        </div>

        <div className="absolute -right-5 -top-6 animate-float">
          <div
            className="grid h-24 w-24 place-items-center rounded-full border border-gold/60 bg-ink/95 font-accent text-xl text-gold shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur"
            style={{ transform: "translateZ(80px)" }}
          >
            GS
          </div>
        </div>

        <div className="absolute -bottom-5 -left-6" style={{ transform: "translateZ(60px)" }}>
          <div className="h-16 w-16 animate-spin-y-reverse preserve-3d">
            <div className="absolute inset-0 grid place-items-center rounded-full border border-gold/50 bg-wine/90 font-accent text-sm text-gold-light shadow-lg backface-hidden">
              Silk
            </div>
            <div className="absolute inset-0 grid rotate-y-180 place-items-center rounded-full border border-gold/50 bg-ivory font-accent text-[9px] uppercase tracking-[0.14em] text-wine backface-hidden">
              Vijayapura
            </div>
          </div>
        </div>

        <GoldParticles className="pointer-events-none absolute -inset-8" count={16} />
      </Tilt3D>
    </div>
  );
}