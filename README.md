# Geeta Silk House — Website

A luxury silk saree catalogue and enquiry site for **Geeta Silk House**, Vijayapura, Karnataka.
Built with Next.js (App Router), TypeScript, Tailwind CSS v4 and Framer Motion.

Tagline: _Where Every Weave Tells a Royal Story._

## What's included

- Cinematic editorial home page (hero, signature edits, featured grid, brand story, why-choose, visit-us).
- A filterable, searchable, sortable **collection** of 100 sarees across 10 categories.
- Per-saree **detail pages** with colour, weave, fabric and availability, plus related pieces and Product JSON-LD.
- **WhatsApp enquiry** flow: per-saree enquiry, an "enquiry list" (saved sarees), and a floating WhatsApp button.
- A password-protected **admin dashboard** at `/admin` with full create / edit / delete / reset.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in real values
npm run dev
```

Open http://localhost:3000. The catalogue seeds itself from `src/data/products.ts` on first run.

### Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | ESLint |
| `node scripts/generate-catalog.mjs` | Regenerate the 100 product SVGs, atmosphere art and `src/data/products.ts` |
| `node scripts/attach-product-photos.mjs` | Download free HD saree photos (Pexels License) into `public/sarees/photos/` and point every product at them. Re-run after regenerating the catalog |

> On Windows, PowerShell may block `npm.ps1`. If so run scripts via `cmd /c "npm run build"`.

### Styling

Tailwind CSS v4 is wired through its Turbopack loader (`@tailwindcss/turbopack`) via `turbopack.rules["*.css"]` in `next.config.ts`. Design tokens (colours, fonts, animations) are declared with `@theme` in `src/app/globals.css`. If you upgrade Tailwind or Next, keep this rule in place or utilities will not be generated.

## Configuration (please review before launch)

Everything below is intentionally configurable. Set values in `.env.local` (see `.env.example`).

| Variable | Purpose | Default |
| --- | --- | --- |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Store WhatsApp number, digits only (e.g. `919876543210`). **Empty by default** → enquiry buttons open WhatsApp with a pre-filled message and no fixed recipient. | empty |
| `NEXT_PUBLIC_STORE_PHONE` | Optional phone shown in the footer. Blank hides it. | empty |
| `NEXT_PUBLIC_STORE_EMAIL` | Optional email shown in the footer. Blank hides it. | empty |
| `NEXT_PUBLIC_INSTAGRAM_URL` / `NEXT_PUBLIC_FACEBOOK_URL` / `NEXT_PUBLIC_YOUTUBE_URL` | Optional social links. Blank hides them. | empty |
| `ADMIN_PASSWORD` | Password for `/admin`. **Fail-closed: no fallback — if unset, the dashboard rejects every login.** | *none (login disabled)* |
| `ADMIN_SECRET` | Secret used to sign admin session tokens. Use a long random string. | *none (ephemeral per-process, sessions reset on restart)* |

Store details (name, address, tagline) live in `src/lib/config.ts`.

### Content that still needs real details

To stay honest, the site does **not** invent facts. These are deliberately left out until the store supplies them:

- Real product photography. The catalogue ships with **high-resolution photos** downloaded into `public/sarees/photos/` by `scripts/attach-product-photos.mjs`, so they are served locally and load instantly with the site. These are **representative stock photos (free-to-use Pexels License), not photographs of the store's physical inventory**. Replace the `image` field per saree (via the admin dashboard or `products.ts`) with genuine catalog photos when available.
- Shipping, returns and exchange policies. Placeholders note this on `/terms`; add the real policy before launch.
- Reviews, certifications and store history — not shown because none were provided.

## Admin dashboard

Visit `/admin` and sign in with `ADMIN_PASSWORD` (set it in `.env.local` — until you do, login is locked out by design). From there you can add, edit and delete sarees and reset the catalogue to the original seed.

### Data persistence

Catalogue changes are written to **`data/products.json`** (created on first mutation) via `src/lib/product-store.ts`. This file-backed store is ideal for local use and a single always-on server. **On serverless platforms with an ephemeral or read-only filesystem (e.g. Vercel), replace the storage layer in `src/lib/product-store.ts` with a database or object store** — the rest of the app only talks to that module.

## Project structure

```
src/
  app/
    (site)/            # public site: home, collection, saree/[slug], privacy, terms
    admin/             # admin dashboard
    api/               # products CRUD + admin auth routes
  components/          # UI: header, footer, cards, drawers, home sections, admin/
  data/products.ts     # 100-product seed (generated)
  lib/                 # config, catalog helpers, types, product store, admin auth, bag context
public/
  sarees/              # per-saree illustrative SVGs
  atmosphere/          # hero/story/edit background SVGs
scripts/generate-catalog.mjs
```
