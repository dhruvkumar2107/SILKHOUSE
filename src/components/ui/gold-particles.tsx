"use client";

import { useMemo } from "react";

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

interface GoldParticlesProps {
  count?: number;
  className?: string;
}

/**
 * Subtle floating gold motes. Positions are deterministic so server and client
 * render identically (no hydration mismatch). Disabled for reduced-motion users
 * via the global media query.
 */
export function GoldParticles({ count = 26, className }: GoldParticlesProps) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const left = pseudoRandom(i + 1) * 100;
        const top = pseudoRandom(i + 40) * 100;
        const size = 1.5 + pseudoRandom(i + 80) * 3.5;
        const duration = 6 + pseudoRandom(i + 120) * 10;
        const delay = pseudoRandom(i + 160) * 8;
        const opacity = 0.25 + pseudoRandom(i + 200) * 0.55;
        return { left, top, size, duration, delay, opacity, key: i };
      }),
    [count]
  );

  return (
    <div aria-hidden className={className}>
      {particles.map((p) => (
        <span
          key={p.key}
          className="absolute rounded-full bg-gold-light"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            boxShadow: "0 0 8px rgba(228,201,138,0.8)",
            animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite, pulseSoft ${p.duration * 0.6}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
