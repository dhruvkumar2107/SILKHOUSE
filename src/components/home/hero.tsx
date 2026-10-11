"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { GoldParticles } from "@/components/ui/gold-particles";
import { HeroShowcase } from "@/components/home/hero-showcase";

interface HeroShowcaseData {
  image: string;
  name: string;
  label: string;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.2 } },
};
const item = {
  hidden: { opacity: 0, y: 34 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const } },
};

export function Hero({ showcase }: { showcase?: HeroShowcaseData | null }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-ink"
    >
      <motion.div style={{ y: bgY }} className="absolute inset-0 -top-24 h-[125%]">
        <Image
          src="/atmosphere/hero.svg"
          alt=""
          aria-hidden
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/45 to-ink/95" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-transparent to-ink/40" />
      <GoldParticles className="pointer-events-none absolute inset-0" count={30} />

<motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="container-lux relative z-10 pt-28 pb-24"
        >
          <div className="grid items-center gap-20 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl">
          <motion.p variants={item} className="eyebrow flex items-center text-gold">
            <span className="mr-4 inline-block h-px w-12 bg-gold/70" />
            The Art of Indian Heritage
          </motion.p>

          <motion.h1
            variants={item}
            className="mt-6 font-display text-[3.1rem] font-medium leading-[0.95] tracking-[-0.01em] text-ivory sm:text-7xl lg:text-8xl xl:text-[7.25rem]"
          >
            Timeless Silk.
            <br />
            <span className="gold-text">Eternal Elegance.</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-8 max-w-xl text-base leading-relaxed text-ivory/75 sm:text-lg"
          >
            Discover exquisite silk sarees woven with tradition, crafted with love, and made for your
            most unforgettable moments.
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/collection"
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-gold px-8 py-4 text-xs font-semibold uppercase tracking-[0.24em] text-ink transition hover:bg-gold-light"
            >
              Explore the Collection
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/#story"
              className="inline-flex items-center justify-center gap-3 rounded-full border border-ivory/35 px-8 py-4 text-xs font-semibold uppercase tracking-[0.24em] text-ivory transition hover:border-gold hover:text-gold"
            >
              Discover Our Story
            </Link>
          </motion.div>
            </motion.div>

            {showcase && <HeroShowcase image={showcase.image} name={showcase.name} label={showcase.label} />}
          </div>
        </motion.div>

      <motion.a
        href="#signature"
        aria-label="Scroll to the signature edit"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-ivory/70 transition hover:text-gold"
      >
        <span className="text-[10px] uppercase tracking-[0.4em]">Scroll</span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={20} />
        </motion.span>
      </motion.a>
    </section>
  );
}
