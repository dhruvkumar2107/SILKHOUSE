"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface Tilt3DProps {
  children: ReactNode;
  className?: string;
  max?: number;
  scale?: number;
  glare?: boolean;
  lift?: number;
}

/**
 * Pointer-driven 3D tilt. The element rotates in perspective toward the cursor
 * with a spring (rotating back when the pointer leaves). Optionally lifts its
 * content on the Z axis for depth. Reduced-motion and touch-safe handlers.
 */
export function Tilt3D({
  children,
  className,
  max = 9,
  scale = 1.015,
  glare = true,
  lift = 0,
}: Tilt3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useRef(false);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glareOpacity = useMotionValue(0);

  const springCfg = { stiffness: 150, damping: 17, mass: 0.5 };
  const sRotateX = useSpring(rotateX, springCfg);
  const sRotateY = useSpring(rotateY, springCfg);
  const sGlareX = useSpring(glareX, { stiffness: 120, damping: 22 });
  const sGlareY = useSpring(glareY, { stiffness: 120, damping: 22 });
  const glareBg = useMotionTemplate`radial-gradient(circle at ${sGlareX}% ${sGlareY}%, rgba(255,255,255,0.4), rgba(255,255,255,0) 46%)`;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduce.current = mq.matches;
    const onChange = () => {
      reduce.current = mq.matches;
    };
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el || reduce.current) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    rotateY.set((px - 0.5) * 2 * max);
    rotateX.set((0.5 - py) * 2 * max);
    glareX.set(px * 100);
    glareY.set(py * 100);
  }

  function handleEnter() {
    if (!reduce.current) glareOpacity.set(1);
  }

  function handleLeave() {
    rotateX.set(0);
    rotateY.set(0);
    glareX.set(50);
    glareY.set(50);
    glareOpacity.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        rotateX: sRotateX,
        rotateY: sRotateY,
        transformPerspective: 1100,
        transformStyle: "preserve-3d",
      }}
      whileHover={{ scale }}
      transition={springCfg}
      className={cn("relative", className)}
    >
      <div
        className={cn(lift > 0 && "preserve-3d")}
        style={lift > 0 ? { transform: `translateZ(${lift}px)` } : undefined}
      >
        {children}
      </div>
      {glare && (
        <motion.span
          aria-hidden
          style={{ background: glareBg, opacity: glareOpacity }}
          className="pointer-events-none absolute inset-0 z-30 rounded-[inherit] mix-blend-screen"
        />
      )}
    </motion.div>
  );
}