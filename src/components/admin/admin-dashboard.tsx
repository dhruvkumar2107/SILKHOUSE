"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Check,
  Lock,
  LogOut,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";
import type { Availability, Saree } from "@/lib/types";
import { categories, formatINR } from "@/lib/catalog";
import { useToast } from "@/components/toast";
import { cn } from "@/lib/utils";

const TOKEN_KEY = "gsh-admin-token";
const AVAILABILITY: Availability[] = ["in-stock", "made-to-order", "limited", "out-of-stock"];

interface FormState {
  name: string;
  category: string;
  categoryName: string;
  price: string;
  description: string;
  image: string;
  colors: string;
  fabric: string;
  weave: string;
  occasion: string;
  availability: Availability;
  featured: boolean;
}

const emptyForm: FormState = {
  name: "",
  category: categories[0].id,
  categoryName: categories[0].name,
  price: "",
  description: "",
  image: "/sarees/gsh-001.svg",
  colors: "",
  fabric: "Pure Silk",
  weave: "Handwoven",
  occasion: "Festive",
  availability: "in-stock",
  featured: false,
};

function toForm(p: Saree): FormState {
  return {
    name: p.name,
    category: p.category,
    categoryName: p.categoryName,
    price: String(p.price),
    description: p.description,
    image: p.image,
    colors: (p.colors ?? []).join(", "),
    fabric: p.fabric,
    weave: p.weave,
    occasion: p.occasion,
    availability: p.availability,
    featured: p.featured,
  };
}

export function AdminDashboard() {
  const { notify } = useToast();
  const [ready, setReady] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [products, setProducts] = useState<Saree[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [editing, setEditing] = useState<Saree | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Saree | null>(null);

  useEffect(() => {
    try {
      const stored = window.sessionStorage.getItem(TOKEN_KEY);
      Promise.resolve().then(() => {
        setToken(stored);
        setReady(true);
      });
    } catch {
      Promise.resolve().then(() => setReady(true));
    }
  }, []);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products", { cache: "no-store" });
      const data = await res.json();
      setProducts(Array.isArray(data?.products) ? data.products : []);
    } catch {
      notify("Could not load the catalogue.");
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) void loadProducts();
    });
    return () => {
      cancelled = true;
    };
  }, [token, loadProducts]);

  function logout() {
    setToken(null);
    try {
      window.sessionStorage.removeItem(TOKEN_KEY);
    } catch {
      /* noop */
    }
  }

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data?.error ?? "Login failed.");
        return;
      }
      setToken(data.token);
      window.sessionStorage.setItem(TOKEN_KEY, data.token);
      setPassword("");
      notify("Welcome back.", "success");
    } catch {
      setLoginError("Network error. Please try again.");
    } finally {
      setLoggingIn(false);
    }
  }

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setFormOpen(true);
  }

  function openEdit(p: Saree) {
    setEditing(p);
    setForm(toForm(p));
    setFormOpen(true);
  }

  async function submitForm(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || form.price === "") {
      notify("Name and price are required.");
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name,
      category: form.category,
      categoryName: form.categoryName,
      price: form.price,
      description: form.description,
      image: form.image,
      colors: form.colors
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
      fabric: form.fabric,
      weave: form.weave,
      occasion: form.occasion,
      availability: form.availability,
      featured: form.featured,
    };

    try {
      const url = editing ? `/api/products/${editing.id}` : "/api/products";
      const res = await fetch(url, {
        method: editing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (res.status === 401) {
        logout();
        notify("Session expired. Please sign in again.");
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        notify(data?.error ?? "Could not save the saree.");
        return;
      }
      notify(editing ? "Saree updated." : "Saree created.", "success");
      setFormOpen(false);
      setEditing(null);
      await loadProducts();
    } catch {
      notify("Network error while saving.");
    } finally {
      setSaving(false);
    }
  }

  async function handleImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !token) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/uploads", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (res.status === 401) {
        logout();
        notify("Session expired. Please sign in again.");
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        notify(data?.error ?? "Upload failed.");
        return;
      }
      setForm({ ...form, image: data.path });
      notify("Photo uploaded and stored locally.", "success");
    } catch {
      notify("Network error while uploading.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/products/${deleteTarget.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        logout();
        notify("Session expired. Please sign in again.");
        return;
      }
      if (!res.ok) {
        notify("Could not delete the saree.");
        return;
      }
      notify("Saree deleted.", "success");
      setDeleteTarget(null);
      await loadProducts();
    } catch {
      notify("Network error while deleting.");
    }
  }

  async function resetCatalogue() {
    if (!window.confirm("Reset the catalogue to the original 100 seeded sarees? This replaces all changes.")) {
      return;
    }
    try {
      const res = await fetch("/api/admin/reset", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        logout();
        notify("Session expired. Please sign in again.");
        return;
      }
      if (!res.ok) {
        notify("Could not reset the catalogue.");
        return;
      }
      notify("Catalogue reset to seed data.", "success");
      await loadProducts();
    } catch {
      notify("Network error while resetting.");
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
      if (!q) return true;
      return [p.name, p.sku, p.categoryName, p.weave].join(" ").toLowerCase().includes(q);
    });
  }, [products, query, categoryFilter]);

  const stats = useMemo(() => {
    const byCategory = new Map<string, number>();
    products.forEach((p) => byCategory.set(p.category, (byCategory.get(p.category) ?? 0) + 1));
    return {
      total: products.length,
      featured: products.filter((p) => p.featured).length,
      categories: byCategory.size,
      value: products.reduce((s, p) => s + p.price, 0),
    };
  }, [products]);

  if (!ready) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center text-ink/50">Loading…</div>
    );
  }

  if (!token) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-5">
        <motion.form
          onSubmit={login}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm rounded-2xl border border-gold/25 bg-ivory p-8 shadow-xl"
        >
          <span className="grid h-12 w-12 place-items-center rounded-full bg-wine text-ivory">
            <Lock size={20} />
          </span>
          <h1 className="mt-5 font-display text-3xl text-ink">Admin sign in</h1>
          <p className="mt-2 text-sm text-ink/55">
            Enter the store password to manage the catalogue.
          </p>
          <label className="mt-6 block text-xs uppercase tracking-[0.2em] text-ink/50">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            className="mt-2 w-full rounded-lg border border-ink/20 bg-white px-4 py-3 text-sm focus:border-wine focus:outline-none"
            placeholder="••••••••"
          />
          {loginError && <p className="mt-3 text-sm text-wine">{loginError}</p>}
          <button
            type="submit"
            disabled={loggingIn}
            className="mt-6 w-full rounded-full bg-wine px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.22em] text-ivory transition hover:bg-wine-deep disabled:opacity-60"
          >
            {loggingIn ? "Signing in…" : "Sign in"}
          </button>
          <p className="mt-4 text-center text-[11px] leading-relaxed text-ink/40">
            Configure the password with the ADMIN_PASSWORD environment variable.
          </p>
        </motion.form>
      </div>
    );
  }

  return (
    <div className="container-lux py-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow text-wine">Catalogue management</p>
          <h1 className="mt-3 font-display text-4xl text-ink">Sarees</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={resetCatalogue}
            className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-3 text-xs uppercase tracking-[0.18em] text-ink/60 transition hover:border-wine hover:text-wine"
          >
            <RefreshCw size={15} /> Reset seed
          </button>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-3 text-xs uppercase tracking-[0.18em] text-ink/60 transition hover:border-wine hover:text-wine"
          >
            <LogOut size={15} /> Sign out
          </button>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-full bg-wine px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-ivory transition hover:bg-wine-deep"
          >
            <Plus size={16} /> Add saree
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total sarees", value: stats.total },
          { label: "Featured", value: stats.featured },
          { label: "Collections", value: stats.categories },
          { label: "Catalogue value", value: formatINR(stats.value) },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-gold/20 bg-ivory p-5">
            <p className="text-[11px] uppercase tracking-[0.2em] text-ink/45">{s.label}</p>
            <p className="mt-2 font-display text-2xl text-ink">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            size={17}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/40"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, SKU, weave…"
            className="w-full rounded-full border border-ink/15 bg-white/70 py-3 pl-11 pr-4 text-sm focus:border-wine focus:outline-none"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-full border border-ink/15 bg-white/70 px-4 py-3 text-xs uppercase tracking-[0.16em] text-ink/70 focus:border-wine focus:outline-none"
        >
          <option value="all">All collections</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.short}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-gold/20 bg-ivory">
        <div className="hidden grid-cols-[3.5rem_1fr_10rem_8rem_6rem_7rem] items-center gap-3 border-b border-gold/15 bg-ivory-warm px-5 py-3 text-[11px] uppercase tracking-[0.16em] text-ink/45 md:grid">
          <span>Image</span>
          <span>Name</span>
          <span>Collection</span>
          <span>Price</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>

        {loading ? (
          <p className="px-5 py-12 text-center text-ink/50">Loading catalogue…</p>
        ) : filtered.length === 0 ? (
          <p className="px-5 py-12 text-center text-ink/50">No sarees match your search.</p>
        ) : (
          <ul className="divide-y divide-gold/10">
            {filtered.map((p) => (
              <li
                key={p.id}
                className="grid grid-cols-1 gap-3 px-5 py-4 md:grid-cols-[3.5rem_1fr_10rem_8rem_6rem_7rem] md:items-center"
              >
                <div className="flex items-center gap-3 md:block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt={p.name}
                    width={40}
                    height={53}
                    className="h-14 w-11 rounded object-cover ring-1 ring-ink/10"
                  />
                  <span className="text-sm text-ink/60 md:hidden">{p.sku}</span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium text-ink">{p.name}</p>
                    {p.featured && <Star size={13} className="shrink-0 text-gold-deep" fill="currentColor" />}
                  </div>
                  <p className="truncate text-xs text-ink/45">
                    {p.sku} · {p.weave} · {p.fabric}
                  </p>
                </div>
                <p className="text-sm text-ink/70">{p.categoryName.replace(" Sarees", "")}</p>
                <p className="text-sm text-wine">{formatINR(p.price)}</p>
                <p className="text-xs uppercase tracking-[0.14em] text-ink/50">{p.availability}</p>
                <div className="flex items-center gap-2 md:justify-end">
                  <button
                    onClick={() => openEdit(p)}
                    aria-label={`Edit ${p.name}`}
                    className="grid h-9 w-9 place-items-center rounded-full border border-ink/15 text-ink/60 transition hover:border-wine hover:text-wine"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(p)}
                    aria-label={`Delete ${p.name}`}
                    className="grid h-9 w-9 place-items-center rounded-full border border-ink/15 text-ink/60 transition hover:border-wine hover:text-wine"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Form modal */}
      <AnimatePresence>
        {formOpen && (
          <motion.div
            className="fixed inset-0 z-[95] flex items-start justify-center overflow-y-auto bg-ink/60 p-4 backdrop-blur-sm sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.form
              onSubmit={submitForm}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-2xl rounded-2xl bg-ivory p-7 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-display text-3xl text-ink">
                  {editing ? "Edit saree" : "Add a saree"}
                </h2>
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  aria-label="Close"
                  className="rounded-full p-2 text-ink/50 hover:bg-ink/5"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Field label="Name" className="sm:col-span-2">
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputClass}
                    placeholder="e.g. Mayura Palace Kanjivaram"
                  />
                </Field>

                <Field label="Collection">
                  <select
                    value={form.category}
                    onChange={(e) => {
                      const c = categories.find((x) => x.id === e.target.value)!;
                      setForm({ ...form, category: c.id, categoryName: c.name });
                    }}
                    className={inputClass}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Price (₹)">
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className={inputClass}
                    placeholder="25000"
                  />
                </Field>

                <Field label="Product photo" className="sm:col-span-2">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                    <div className="flex flex-1 flex-col gap-2">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        disabled={uploading}
                        onChange={handleImageFile}
                        className="block w-full cursor-pointer text-sm text-ink/60 file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-wine file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-ivory file:transition hover:file:bg-wine-deep disabled:opacity-60"
                      />
                      <p className="text-xs leading-relaxed text-ink/45">
                        {uploading
                          ? "Uploading…"
                          : "Choose a JPG, PNG or WebP from your computer (max 10 MB). It is stored on the site and served from /api/uploads/."}
                      </p>
                    </div>
                    {form.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={form.image}
                        alt=""
                        className="h-20 w-16 rounded-md border border-ink/10 object-cover"
                      />
                    )}
                  </div>
                </Field>

                <Field label="Or use an image URL or path" className="sm:col-span-2">
                  <input
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    className={inputClass}
                    placeholder="/sarees/gsh-001.svg or https://…"
                  />
                </Field>

                <Field label="Description" className="sm:col-span-2">
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={3}
                    className={cn(inputClass, "resize-y")}
                  />
                </Field>

                <Field label="Colours (comma separated)">
                  <input
                    value={form.colors}
                    onChange={(e) => setForm({ ...form, colors: e.target.value })}
                    className={inputClass}
                    placeholder="Ruby Crimson, Antique Gold"
                  />
                </Field>

                <Field label="Fabric">
                  <input
                    value={form.fabric}
                    onChange={(e) => setForm({ ...form, fabric: e.target.value })}
                    className={inputClass}
                  />
                </Field>

                <Field label="Weave">
                  <input
                    value={form.weave}
                    onChange={(e) => setForm({ ...form, weave: e.target.value })}
                    className={inputClass}
                  />
                </Field>

                <Field label="Occasion">
                  <input
                    value={form.occasion}
                    onChange={(e) => setForm({ ...form, occasion: e.target.value })}
                    className={inputClass}
                  />
                </Field>

                <Field label="Availability">
                  <select
                    value={form.availability}
                    onChange={(e) =>
                      setForm({ ...form, availability: e.target.value as Availability })
                    }
                    className={inputClass}
                  >
                    {AVAILABILITY.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </Field>

                <label className="flex items-center gap-3 self-end pb-3">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="h-5 w-5 accent-[#6b1220]"
                  />
                  <span className="text-sm text-ink/70">Feature on homepage</span>
                </label>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="rounded-full border border-ink/15 px-6 py-3 text-xs uppercase tracking-[0.2em] text-ink/60 transition hover:border-wine hover:text-wine"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-wine px-7 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-ivory transition hover:bg-wine-deep disabled:opacity-60"
                >
                  <Check size={15} /> {saving ? "Saving…" : editing ? "Save changes" : "Create saree"}
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            className="fixed inset-0 z-[96] flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="w-full max-w-sm rounded-2xl bg-ivory p-7 text-center shadow-2xl"
            >
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-wine/10 text-wine">
                <AlertTriangle size={22} />
              </span>
              <h2 className="mt-4 font-display text-2xl text-ink">Delete this saree?</h2>
              <p className="mt-2 text-sm text-ink/60">
                {deleteTarget.name} will be removed from the catalogue. This cannot be undone.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 rounded-full border border-ink/15 px-5 py-3 text-xs uppercase tracking-[0.2em] text-ink/60"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 rounded-full bg-wine px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-ivory"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-ink/20 bg-white px-4 py-2.5 text-sm text-ink focus:border-wine focus:outline-none";

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-[11px] uppercase tracking-[0.18em] text-ink/50">
        {label}
      </span>
      {children}
    </label>
  );
}
