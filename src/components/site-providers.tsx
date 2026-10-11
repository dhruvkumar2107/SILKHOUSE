"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { BagProvider } from "@/lib/bag-context";
import { ToastProvider } from "@/components/toast";

export function SiteProviders({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ToastProvider>
        <BagProvider>{children}</BagProvider>
      </ToastProvider>
    </MotionConfig>
  );
}
