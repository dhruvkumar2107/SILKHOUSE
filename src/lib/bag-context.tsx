"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface BagItem {
  id: string;
  slug: string;
  name: string;
  sku: string;
  price: number;
  categoryName: string;
  image: string;
}

interface BagContextValue {
  items: BagItem[];
  count: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (item: BagItem) => void;
  remove: (id: string) => void;
  toggle: (item: BagItem) => void;
  has: (id: string) => boolean;
  clear: () => void;
}

const BagContext = createContext<BagContextValue | null>(null);
const STORAGE_KEY = "gsh-enquiry-bag-v1";

export function BagProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BagItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) setItems(parsed as BagItem[]);
        }
      } catch {
        /* ignore malformed storage */
      }
      setHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage may be unavailable */
    }
  }, [items, hydrated]);

  const add = useCallback((item: BagItem) => {
    setItems((prev) => (prev.some((i) => i.id === item.id) ? prev : [...prev, item]));
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const toggle = useCallback((item: BagItem) => {
    setItems((prev) =>
      prev.some((i) => i.id === item.id) ? prev.filter((i) => i.id !== item.id) : [...prev, item]
    );
  }, []);

  const value = useMemo<BagContextValue>(
    () => ({
      items,
      count: items.length,
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      add,
      remove,
      toggle,
      has: (id: string) => items.some((i) => i.id === id),
      clear: () => setItems([]),
    }),
    [items, isOpen, add, remove, toggle]
  );

  return <BagContext.Provider value={value}>{children}</BagContext.Provider>;
}

export function useBag(): BagContextValue {
  const ctx = useContext(BagContext);
  if (!ctx) throw new Error("useBag must be used within BagProvider");
  return ctx;
}
