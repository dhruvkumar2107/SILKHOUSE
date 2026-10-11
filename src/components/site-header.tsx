"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Menu, MessageCircle, Search, X } from "lucide-react";
import { navLinks } from "@/lib/config";
import { generalEnquiryMessage, whatsappUrl } from "@/lib/catalog";
import { useBag } from "@/lib/bag-context";
import { cn } from "@/lib/utils";
import { SearchOverlay } from "@/components/search-overlay";

function Wordmark({ light }: { light: boolean }) {
  return (
    <Link href="/" aria-label="Geeta Silk House — home" className="group flex items-center gap-3">
      <span
        className={cn(
          "grid h-10 w-10 place-items-center rounded-full border transition",
          light ? "border-gold/60 text-gold" : "border-wine/40 text-wine"
        )}
      >
        <span className="font-accent text-sm">GS</span>
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-accent text-[15px] font-semibold tracking-[0.34em]",
            light ? "text-ivory" : "text-ink"
          )}
        >
          GEETA
        </span>
        <span
          className={cn(
            "font-display text-[15px] tracking-[0.2em]",
            light ? "text-gold-light" : "text-wine"
          )}
        >
          SILK HOUSE
        </span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { count, open: openBag } = useBag();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const locked = menuOpen || searchOpen;
    document.body.style.overflow = locked ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, searchOpen]);

  const solid = scrolled || !isHome || menuOpen;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[70] transition-[background-color,box-shadow,backdrop-filter] duration-500",
          solid
            ? "border-b border-gold/20 bg-ivory/95 shadow-[0_6px_30px_rgba(20,16,13,0.06)] backdrop-blur-xl"
            : "border-b border-transparent bg-gradient-to-b from-ink/70 to-transparent"
        )}
      >
        <div className="container-lux flex h-[68px] items-center justify-between gap-4 sm:h-[78px]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className={cn(
                "rounded-full p-2 lg:hidden",
                solid ? "text-ink hover:bg-ink/5" : "text-ivory hover:bg-white/10"
              )}
            >
              <Menu size={22} />
            </button>
            <Wordmark light={!solid} />
          </div>

          <nav aria-label="Primary" className="hidden items-center gap-9 lg:flex">
            {navLinks.map((link) => {
              const base = link.href.split("#")[0] || "/";
              const isHash = link.href.includes("#");
              const active =
                !isHash && (base === "/" ? pathname === "/" : pathname === base || pathname.startsWith(`${base}/`));
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  data-active={active}
                  className={cn(
                    "link-underline text-[13px] uppercase tracking-[0.26em] transition",
                    solid ? "text-ink/75 hover:text-wine" : "text-ivory/85 hover:text-ivory"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search sarees"
              className={cn(
                "rounded-full p-2.5 transition",
                solid ? "text-ink/75 hover:bg-ink/5 hover:text-wine" : "text-ivory/90 hover:bg-white/10"
              )}
            >
              <Search size={20} />
            </button>
            <button
              onClick={openBag}
              aria-label={`Open enquiry list, ${count} items`}
              className={cn(
                "relative rounded-full p-2.5 transition",
                solid ? "text-ink/75 hover:bg-ink/5 hover:text-wine" : "text-ivory/90 hover:bg-white/10"
              )}
            >
              <Heart size={20} />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full bg-wine text-[10px] font-semibold text-ivory ring-2 ring-ivory">
                  {count}
                </span>
              )}
            </button>
            <a
              href={whatsappUrl(generalEnquiryMessage())}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 hidden items-center gap-2 rounded-full bg-wine px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.24em] text-ivory transition hover:bg-wine-deep sm:inline-flex"
            >
              <MessageCircle size={15} />
              Enquire
            </a>
          </div>
        </div>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[85] bg-ink/95 backdrop-blur-xl lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="container-lux flex h-full flex-col py-6">
              <div className="flex items-center justify-between">
                <Wordmark light />
                <button
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="rounded-full p-2 text-ivory/75 hover:bg-white/10"
                >
                  <X size={24} />
                </button>
              </div>
              <nav aria-label="Mobile" className="mt-14 flex flex-col gap-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 * i, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="block border-b border-white/5 py-5 font-display text-4xl text-ivory transition hover:text-gold"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <div className="mt-auto space-y-3">
                <a
                  href={whatsappUrl(generalEnquiryMessage())}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 rounded-full bg-[#25D366] px-6 py-4 text-sm font-medium uppercase tracking-[0.24em] text-white"
                >
                  <MessageCircle size={18} />
                  Enquire on WhatsApp
                </a>
                <Link
                  href="/admin"
                  className="block text-center text-[11px] uppercase tracking-[0.28em] text-ivory/40 hover:text-gold"
                >
                  Store Admin
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
