"use client";

import Image from "next/image";
import { useState } from "react";
import { cn, isSvg } from "@/lib/utils";

const FALLBACK_SRC = "/atmosphere/texture.svg";

interface SareeImageProps {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  zoomOnHover?: boolean;
}

/**
 * Responsive, lazy-loaded image wrapper for product and editorial imagery.
 * SVG artwork is served unoptimized (it is already vector-crisp).
 */
export function SareeImage({
  src,
  alt,
  sizes = "(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw",
  priority = false,
  className,
  imageClassName,
  zoomOnHover = false,
}: SareeImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cn("relative overflow-hidden bg-ivory-warm", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        unoptimized={isSvg(src)}
        loading={priority ? undefined : "lazy"}
        onLoad={() => setLoaded(true)}
        onError={(e) => {
          const img = e.currentTarget;
          if (!img.src.endsWith(FALLBACK_SRC)) img.src = FALLBACK_SRC;
        }}
        className={cn(
          "object-cover transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
          loaded ? "opacity-100" : "opacity-0",
          zoomOnHover && "group-hover:scale-[1.06]",
          imageClassName
        )}
      />
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/10 via-transparent to-transparent transition-opacity duration-700",
          loaded ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
}
