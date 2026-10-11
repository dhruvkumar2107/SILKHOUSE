/**
 * Geeta Silk House — catalog generator
 *
 * Produces:
 *   - public/sarees/gsh-001.svg ... gsh-100.svg   (unique illustrative product imagery)
 *   - public/atmosphere/*.svg                      (hero + editorial imagery)
 *   - src/data/products.ts                         (the 100-product data source)
 *
 * These images are ORIGINAL ILLUSTRATIVE artwork (not photographs of real
 * inventory). Every product's `image` field can be replaced with the store's
 * genuine catalog photograph without touching any other code.
 *
 * Run:  node scripts/generate-catalog.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const sareeDir = join(root, "public", "sarees");
const atmosphereDir = join(root, "public", "atmosphere");
const dataDir = join(root, "src", "data");

mkdirSync(sareeDir, { recursive: true });
mkdirSync(atmosphereDir, { recursive: true });
mkdirSync(dataDir, { recursive: true });

/* ------------------------------------------------------------------ */
/* deterministic randomness                                            */
/* ------------------------------------------------------------------ */
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ------------------------------------------------------------------ */
/* palettes                                                           */
/* ------------------------------------------------------------------ */
const PALETTES = [
  { name: "Ruby Crimson", base: "#8E1E2C", deep: "#3E0810", light: "#C64C5A", accent: "#D9B25B" },
  { name: "Royal Maroon", base: "#6B1220", deep: "#320810", light: "#A8384A", accent: "#CB9B4A" },
  { name: "Antique Gold", base: "#A9823C", deep: "#4F3812", light: "#E0C078", accent: "#6E4E17" },
  { name: "Emerald Forest", base: "#0F5A45", deep: "#05291F", light: "#3F9B7C", accent: "#D3B25E" },
  { name: "Peacock Teal", base: "#10556B", deep: "#062C38", light: "#3E93AC", accent: "#D9B65B" },
  { name: "Haldi Mustard", base: "#B07C12", deep: "#553A05", light: "#E1B44B", accent: "#6B3D0C" },
  { name: "Rani Magenta", base: "#9C2A5A", deep: "#4A0F2A", light: "#D06090", accent: "#D8B25C" },
  { name: "Aubergine Purple", base: "#4E2350", deep: "#220E24", light: "#855C87", accent: "#D3B160" },
  { name: "Terracotta Rust", base: "#A24A28", deep: "#4A1E0E", light: "#D07C55", accent: "#D8B25C" },
  { name: "Midnight Indigo", base: "#22335E", deep: "#0C1228", light: "#51689B", accent: "#CFAE5C" },
  { name: "Rosewood Wine", base: "#5E1C2A", deep: "#2A0A11", light: "#955060", accent: "#D0A85A" },
  { name: "Coral Blush", base: "#C05A50", deep: "#5E201B", light: "#E29188", accent: "#C79A4A" },
  { name: "Olive Bronze", base: "#6E6A24", deep: "#2E2C0C", light: "#A6A055", accent: "#D6B15C" },
  { name: "Copper Leaf", base: "#A6622B", deep: "#4C2A0F", light: "#D08F55", accent: "#E0C079" },
  { name: "Deep Teal Green", base: "#0E4A47", deep: "#042220", light: "#3C857F", accent: "#D2AF5C" },
  { name: "Saffron Flame", base: "#C06A0E", deep: "#5A2F03", light: "#E79C42", accent: "#7A3B08" },
  { name: "Plum Orchid", base: "#6A2B54", deep: "#2E0F24", light: "#A25E8B", accent: "#D3B160" },
  { name: "Sage Ivory", base: "#8A8A6A", deep: "#3E3E2E", light: "#BEBE9E", accent: "#C79A4A" },
  { name: "Marigold Orange", base: "#C47A18", deep: "#5C3506", light: "#E9A94E", accent: "#7A3F0C" },
  { name: "Onyx Black", base: "#2A2420", deep: "#0C0A08", light: "#5E534A", accent: "#C9A24E" },
];

/* ------------------------------------------------------------------ */
/* categories                                                         */
/* ------------------------------------------------------------------ */
const CATEGORIES = [
  { id: "kanjivaram", name: "Kanjivaram Silk Sarees", short: "Kanjivaram", count: 14, min: 18000, max: 65000, weave: "Kanjivaram", fabric: "Pure Mulberry Silk", occasion: "Bridal & Festive", suffixes: ["Kanjivaram", "Zari Kanjivaram", "Temple Kanjivaram", "Palace Kanjivaram"] },
  { id: "banarasi", name: "Banarasi Silk Sarees", short: "Banarasi", count: 12, min: 12000, max: 48000, weave: "Banarasi", fabric: "Katan Silk", occasion: "Wedding & Festive", suffixes: ["Banarasi", "Brocade Banarasi", "Meenakari Banarasi", "Jangla Banarasi"] },
  { id: "mysore", name: "Mysore Silk Sarees", short: "Mysore", count: 10, min: 8000, max: 28000, weave: "Mysore", fabric: "Mysore Pure Silk", occasion: "Festive & Everyday", suffixes: ["Mysore Silk", "Crepe Mysore Silk", "Mysore Gold Tissue", "Mysore Georgette Silk"] },
  { id: "soft-silk", name: "Soft Silk Sarees", short: "Soft Silk", count: 12, min: 4500, max: 16000, weave: "Soft Silk", fabric: "Soft Silk Blend", occasion: "Everyday & Festive", suffixes: ["Soft Silk", "Soft Silk Weave", "Soft Kanchi Silk", "Feather Soft Silk"] },
  { id: "bridal", name: "Bridal Silk Sarees", short: "Bridal", count: 12, min: 35000, max: 120000, weave: "Handwoven Bridal", fabric: "Pure Mulberry Silk", occasion: "Bridal", suffixes: ["Bridal Silk", "Bridal Kanjivaram", "Wedding Silk", "Bridal Tissue Silk"] },
  { id: "pattu", name: "Traditional Pattu Sarees", short: "Pattu", count: 10, min: 9000, max: 38000, weave: "Pattu", fabric: "Pure Pattu Silk", occasion: "Temple & Traditional", suffixes: ["Pattu", "Pattu Silk", "Temple Pattu", "Pure Pattu"] },
  { id: "designer", name: "Designer Silk Sarees", short: "Designer", count: 10, min: 15000, max: 75000, weave: "Designer", fabric: "Pure Silk", occasion: "Cocktail & Reception", suffixes: ["Designer Silk", "Designer Weave", "Couture Silk", "Designer Brocade"] },
  { id: "temple-border", name: "Temple Border Sarees", short: "Temple Border", count: 8, min: 7500, max: 26000, weave: "Temple Border", fabric: "Pure Silk", occasion: "Temple & Festive", suffixes: ["Temple Border", "Temple Border Silk", "Gopuram Border", "Temple Zari"] },
  { id: "festive", name: "Festive Wear Sarees", short: "Festive", count: 8, min: 5500, max: 24000, weave: "Festive", fabric: "Art Silk", occasion: "Festive", suffixes: ["Festive Silk", "Utsav Silk", "Festive Weave", "Celebration Silk"] },
  { id: "lightweight", name: "Lightweight Silk Sarees", short: "Lightweight", count: 4, min: 3500, max: 9500, weave: "Lightweight", fabric: "Light Silk", occasion: "Everyday", suffixes: ["Lightweight Silk", "Airy Silk", "Featherlight Silk", "Everyday Silk"] },
];

const PREFIXES = [
  "Mayura", "Rajarani", "Aranya", "Kanchi", "Meenakshi", "Rajwada", "Sundari", "Vasundhara",
  "Chandrika", "Padmini", "Anantha", "Sitara", "Mrinalini", "Devika", "Kalyani", "Rukmini",
  "Yashodhara", "Lavanya", "Nandini", "Indira", "Madhavi", "Gowri", "Hema", "Vasanthi",
  "Charumathi", "Sonalika", "Bhairavi", "Manjari", "Ratri", "Ketaki", "Alakananda", "Sharadha",
  "Mythili", "Chitrangada", "Kaikeyi", "Urmila", "Subhadra", "Satyabhama", "Damayanti", "Savitri",
  "Shakuntala", "Urvashi", "Tilottama", "Ahalya", "Mandavi", "Shruti", "Smriti", "Rohini",
  "Tapasya", "Vaijayanti", "Yamuna", "Ganga", "Kaveri", "Narmada", "Sarayu", "Tamara",
  "Hiranya", "Kanakambari", "Ratnavali", "Padmavati", "Sulochana", "Kalavati", "Nirmala", "Shubha",
];

const MOTIFS = ["kalka", "lotus", "temple", "rosette", "peacock", "buti"];
const BORDER_STYLES = ["zari", "temple", "korvai", "contrast"];
const FILLS = ["plain", "buti", "checks", "stripes", "jaal"];

/* ------------------------------------------------------------------ */
/* SVG building blocks                                                */
/* ------------------------------------------------------------------ */
function motifShape(kind, color, accent, size = 1) {
  const s = size;
  switch (kind) {
    case "buti":
      return `<g transform="scale(${s})">
        <circle r="9" fill="${color}"/>
        <g fill="${accent}">
          <ellipse cx="0" cy="-16" rx="4" ry="9"/>
          <ellipse cx="0" cy="16" rx="4" ry="9"/>
          <ellipse cx="-16" cy="0" rx="9" ry="4"/>
          <ellipse cx="16" cy="0" rx="9" ry="4"/>
        </g>
        <circle r="4" fill="${accent}"/>
      </g>`;
    case "lotus":
      return `<g transform="scale(${s})" fill="${color}">
        <path d="M0 -30 C10 -14 10 -4 0 0 C-10 -4 -10 -14 0 -30Z"/>
        <path d="M0 -30 C10 -14 10 -4 0 0 C-10 -4 -10 -14 0 -30Z" transform="rotate(60)"/>
        <path d="M0 -30 C10 -14 10 -4 0 0 C-10 -4 -10 -14 0 -30Z" transform="rotate(120)"/>
        <path d="M0 -30 C10 -14 10 -4 0 0 C-10 -4 -10 -14 0 -30Z" transform="rotate(180)"/>
        <path d="M0 -30 C10 -14 10 -4 0 0 C-10 -4 -10 -14 0 -30Z" transform="rotate(240)"/>
        <path d="M0 -30 C10 -14 10 -4 0 0 C-10 -4 -10 -14 0 -30Z" transform="rotate(300)"/>
        <circle r="6" fill="${accent}"/>
      </g>`;
    case "temple":
      return `<g transform="scale(${s})" fill="${color}">
        <path d="M0 -30 L8 -12 L-8 -12Z"/>
        <path d="M0 -16 L12 8 L-12 8Z"/>
        <rect x="-16" y="8" width="32" height="8" rx="2"/>
        <circle cy="-24" r="3" fill="${accent}"/>
      </g>`;
    case "rosette":
      return `<g transform="scale(${s})" fill="${color}">
        <path d="M0 -26 C8 -16 8 -6 0 0 C-8 -6 -8 -16 0 -26Z" transform="rotate(0)"/>
        <path d="M0 -26 C8 -16 8 -6 0 0 C-8 -6 -8 -16 0 -26Z" transform="rotate(45)"/>
        <path d="M0 -26 C8 -16 8 -6 0 0 C-8 -6 -8 -16 0 -26Z" transform="rotate(90)"/>
        <path d="M0 -26 C8 -16 8 -6 0 0 C-8 -6 -8 -16 0 -26Z" transform="rotate(135)"/>
        <path d="M0 -26 C8 -16 8 -6 0 0 C-8 -6 -8 -16 0 -26Z" transform="rotate(180)"/>
        <path d="M0 -26 C8 -16 8 -6 0 0 C-8 -6 -8 -16 0 -26Z" transform="rotate(225)"/>
        <path d="M0 -26 C8 -16 8 -6 0 0 C-8 -6 -8 -16 0 -26Z" transform="rotate(270)"/>
        <path d="M0 -26 C8 -16 8 -6 0 0 C-8 -6 -8 -16 0 -26Z" transform="rotate(315)"/>
        <circle r="7" fill="${accent}"/>
      </g>`;
    case "peacock":
      return `<g transform="scale(${s})">
        <path d="M0 -34 C22 -20 22 10 0 26 C-22 10 -22 -20 0 -34Z" fill="${color}"/>
        <ellipse cy="-4" rx="10" ry="16" fill="${accent}"/>
        <circle cy="-4" r="5" fill="${color}"/>
        <path d="M0 26 L0 40" stroke="${accent}" stroke-width="3"/>
      </g>`;
    case "kalka":
    default:
      return `<g transform="scale(${s})">
        <path d="M0 30 C-26 12 -26 -14 0 -34 C26 -14 26 12 0 30Z" fill="${color}"/>
        <path d="M0 22 C-16 8 -16 -10 0 -22 C16 -10 16 8 0 22Z" fill="${accent}" opacity="0.85"/>
        <path d="M0 14 C-8 6 -8 -4 0 -10 C8 -4 8 6 0 14Z" fill="${color}"/>
      </g>`;
  }
}

function bodyPattern(fill, palette, seed) {
  const { light, accent } = palette;
  const rand = mulberry32(seed * 31 + 7);
  if (fill === "plain") {
    return `<rect width="900" height="1200" fill="url(#body)"/>`;
  }
  if (fill === "checks") {
    return `
      <rect width="900" height="1200" fill="url(#body)"/>
      <g stroke="${accent}" stroke-opacity="0.28" stroke-width="2">
        ${Array.from({ length: 10 }, (_, i) => `<line x1="${i * 90 + 45}" y1="0" x2="${i * 90 + 45}" y2="1200"/>`).join("")}
        ${Array.from({ length: 14 }, (_, i) => `<line x1="0" y1="${i * 85 + 42}" x2="900" y2="${i * 85 + 42}"/>`).join("")}
      </g>`;
  }
  if (fill === "stripes") {
    return `
      <rect width="900" height="1200" fill="url(#body)"/>
      <g stroke="${light}" stroke-opacity="0.18" stroke-width="6">
        ${Array.from({ length: 22 }, (_, i) => `<line x1="${i * 42}" y1="0" x2="${i * 42}" y2="1200"/>`).join("")}
      </g>`;
  }
  if (fill === "jaal") {
    let out = `<rect width="900" height="1200" fill="url(#body)"/><g opacity="0.5">`;
    for (let y = 70; y < 1200; y += 150) {
      for (let x = 70; x < 900; x += 150) {
        const off = (Math.round(y / 150) % 2) * 75;
        out += `<g transform="translate(${x + off},${y})">${motifShape("rosette", light, accent, 0.55)}</g>`;
      }
    }
    return out + `</g>`;
  }
  // buti
  let out = `<rect width="900" height="1200" fill="url(#body)"/><g opacity="0.62">`;
  for (let y = 80; y < 1200; y += 160) {
    for (let x = 80; x < 900; x += 160) {
      const off = (Math.round(y / 160) % 2) * 80;
      const k = rand();
      const motif = k > 0.5 ? "buti" : "kalka";
      out += `<g transform="translate(${x + off},${y})">${motifShape(motif, light, accent, 0.62)}</g>`;
    }
  }
  return out + `</g>`;
}

function makeSareeSvg({ palette, motif, border, fill, seed }) {
  const rand = mulberry32(seed);
  const { base, deep, light, accent } = palette;
  const foldCount = 4 + Math.floor(rand() * 3);
  const folds = [];
  for (let i = 0; i < foldCount; i++) {
    const x = 120 + (i + 0.5) * (660 / foldCount) + rand() * 20;
    const w = 14 + rand() * 30;
    const op = 0.05 + rand() * 0.12;
    folds.push(`<rect x="${x}" y="0" width="${w}" height="1200" fill="${i % 2 ? "#000" : "#fff"}" opacity="${op}"/>`);
  }

  // pallu (draped end) top-right
  const palluMotifs = [];
  for (let y = 120; y < 520; y += 90) {
    for (let x = 520; x < 840; x += 90) {
      palluMotifs.push(`<g transform="translate(${x},${y})">${motifShape(motif, accent, deep, 0.7)}</g>`);
    }
  }

  const borderMotifs = [];
  if (border === "temple") {
    for (let x = 40; x < 900; x += 44) {
      borderMotifs.push(`<g transform="translate(${x},1136) scale(0.5)">${motifShape("temple", deep, accent, 0.7)}</g>`);
    }
  } else if (border === "zari") {
    for (let x = 40; x < 900; x += 60) {
      borderMotifs.push(`<g transform="translate(${x},1148) scale(0.32)">${motifShape("rosette", deep, accent, 1)}</g>`);
    }
  } else if (border === "korvai") {
    for (let x = 40; x < 900; x += 52) {
      borderMotifs.push(`<g transform="translate(${x},1146) scale(0.34)">${motifShape("kalka", deep, accent, 1)}</g>`);
    }
  } else {
    for (let x = 40; x < 900; x += 56) {
      borderMotifs.push(`<g transform="translate(${x},1148) scale(0.3)">${motifShape("buti", deep, accent, 1)}</g>`);
    }
  }

  const sideMotifs = [];
  for (let y = 60; y < 1080; y += 96) {
    sideMotifs.push(`<g transform="translate(46,${y}) scale(0.34)">${motifShape(motif, accent, deep, 1)}</g>`);
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 1200" width="900" height="1200" role="img">
  <defs>
    <linearGradient id="body" x1="0" y1="0" x2="0.35" y2="1">
      <stop offset="0" stop-color="${light}"/>
      <stop offset="0.45" stop-color="${base}"/>
      <stop offset="1" stop-color="${deep}"/>
    </linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#F6E4AE"/>
      <stop offset="0.5" stop-color="${accent}"/>
      <stop offset="1" stop-color="#7A5A1C"/>
    </linearGradient>
    <linearGradient id="pallu" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${deep}"/>
      <stop offset="1" stop-color="${base}"/>
    </linearGradient>
    <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="0.6">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="0.45" stop-color="#ffffff" stop-opacity="0.16"/>
      <stop offset="0.62" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0.22"/>
    </linearGradient>
    <radialGradient id="vignette" cx="0.5" cy="0.4" r="0.85">
      <stop offset="0.55" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity="0.42"/>
    </radialGradient>
    <pattern id="weave" width="6" height="6" patternUnits="userSpaceOnUse">
      <rect width="6" height="6" fill="none"/>
      <path d="M0 0 L6 6 M6 0 L0 6" stroke="#ffffff" stroke-opacity="0.05" stroke-width="0.6"/>
    </pattern>
  </defs>

  <rect width="900" height="1200" fill="${deep}"/>
  ${bodyPattern(fill, palette, seed)}
  <rect width="900" height="1200" fill="url(#weave)"/>
  ${folds.join("")}

  <!-- pallu -->
  <g opacity="0.96">
    <rect x="500" y="70" width="360" height="470" rx="6" fill="url(#pallu)"/>
    <rect x="500" y="70" width="360" height="470" rx="6" fill="none" stroke="url(#gold)" stroke-width="6"/>
    <rect x="516" y="86" width="328" height="438" rx="4" fill="none" stroke="url(#gold)" stroke-width="1.4" stroke-opacity="0.85"/>
    ${palluMotifs.join("")}
    <path d="M500 540 L860 540" stroke="url(#gold)" stroke-width="8"/>
  </g>

  <!-- side zari band -->
  <rect x="0" y="0" width="86" height="1200" fill="url(#gold)" opacity="0.92"/>
  <rect x="86" y="0" width="6" height="1200" fill="${deep}" opacity="0.5"/>
  ${sideMotifs.join("")}

  <!-- bottom zari border -->
  <rect x="0" y="1080" width="900" height="120" fill="url(#gold)"/>
  <rect x="0" y="1080" width="900" height="6" fill="${deep}" opacity="0.5"/>
  <rect x="0" y="1096" width="900" height="2" fill="${deep}" opacity="0.4"/>
  ${borderMotifs.join("")}

  <rect width="900" height="1200" fill="url(#sheen)"/>
  <rect width="900" height="1200" fill="url(#vignette)"/>
</svg>`;
}

/* ------------------------------------------------------------------ */
/* atmosphere artwork                                                 */
/* ------------------------------------------------------------------ */
function atmosphereSvg({ w, h, palette, seed, variant }) {
  const rand = mulberry32(seed);
  const { base, deep, light, accent } = palette;
  const folds = [];
  const n = 7;
  for (let i = 0; i < n; i++) {
    const x = (i + 0.5) * (w / n) + (rand() - 0.5) * 60;
    const cw = w / n * (1.4 + rand());
    folds.push(`<path d="M${x} 0 C${x + 40} ${h * 0.4} ${x - 40} ${h * 0.6} ${x + 20} ${h} L${x + cw} ${h} C${x + cw - 40} ${h * 0.6} ${x + cw + 40} ${h * 0.4} ${x + cw - 20} 0 Z" fill="${i % 2 ? "#000000" : "#ffffff"}" opacity="${0.04 + rand() * 0.08}"/>`);
  }
  const particles = [];
  for (let i = 0; i < 60; i++) {
    particles.push(`<circle cx="${rand() * w}" cy="${rand() * h}" r="${0.6 + rand() * 2.4}" fill="${accent}" opacity="${0.15 + rand() * 0.5}"/>`);
  }
  const motif = MOTIFS[Math.floor(rand() * MOTIFS.length)];
  const bigMotifs = [];
  for (let i = 0; i < 5; i++) {
    bigMotifs.push(`<g transform="translate(${rand() * w},${rand() * h}) scale(${1.5 + rand() * 2})" opacity="0.08">${motifShape(motif, accent, accent, 1)}</g>`);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img">
  <defs>
    <linearGradient id="abg" x1="0" y1="0" x2="0.7" y2="1">
      <stop offset="0" stop-color="${variant === "gold" ? accent : light}"/>
      <stop offset="0.5" stop-color="${base}"/>
      <stop offset="1" stop-color="${deep}"/>
    </linearGradient>
    <radialGradient id="aglow" cx="0.35" cy="0.3" r="0.8">
      <stop offset="0" stop-color="${accent}" stop-opacity="0.5"/>
      <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="avig" cx="0.5" cy="0.5" r="0.75">
      <stop offset="0.5" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity="0.6"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#abg)"/>
  <rect width="${w}" height="${h}" fill="url(#aglow)"/>
  ${folds.join("")}
  ${bigMotifs.join("")}
  ${particles.join("")}
  <rect width="${w}" height="${h}" fill="url(#avig)"/>
</svg>`;
}

/* ------------------------------------------------------------------ */
/* build catalog                                                      */
/* ------------------------------------------------------------------ */
function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function pickColors(rand, primaryName) {
  const pool = PALETTES.map((p) => p.name).filter((n) => n !== primaryName);
  const shuffled = pool.sort(() => rand() - 0.5);
  const set = new Set([primaryName, ...shuffled.slice(0, 2)]);
  return [...set].slice(0, 3);
}

const products = [];
let globalIndex = 0;
const usedNames = new Set();

for (const cat of CATEGORIES) {
  for (let i = 0; i < cat.count; i++) {
    globalIndex += 1;
    const num = String(globalIndex).padStart(3, "0");
    const id = `gsh-${num}`;
    const seed = globalIndex * 7919 + cat.id.length * 13;
    const rand = mulberry32(seed);
    const palette = PALETTES[(globalIndex * 5 + i * 3) % PALETTES.length];
    let prefix = PREFIXES[(globalIndex * 7 + i * 11) % PREFIXES.length];
    let suffix = cat.suffixes[i % cat.suffixes.length];
    let name = `${prefix} ${suffix}`;
    let guard = 0;
    while (usedNames.has(name) && guard < 50) {
      prefix = PREFIXES[(PREFIXES.indexOf(prefix) + 1) % PREFIXES.length];
      name = `${prefix} ${suffix}`;
      guard++;
    }
    if (usedNames.has(name)) name = `${name} ${num}`;
    usedNames.add(name);

    const span = cat.max - cat.min;
    const raw = cat.min + Math.pow(rand(), 0.8) * span;
    const price = Math.max(cat.min, Math.round(raw / 100) * 100 - 1);

    const motif = MOTIFS[(globalIndex + i) % MOTIFS.length];
    const border = BORDER_STYLES[(globalIndex * 2 + i) % BORDER_STYLES.length];
    const fill = FILLS[(globalIndex * 3 + i) % FILLS.length];

    const svg = makeSareeSvg({ palette, motif, border, fill, seed });
    writeFileSync(join(sareeDir, `${id}.svg`), svg, "utf8");

    const availability =
      globalIndex % 17 === 0 ? "made-to-order" : globalIndex % 29 === 0 ? "limited" : "in-stock";
    const featured = [3, 12, 25, 38, 47, 60, 71, 88].includes(globalIndex);

    const description =
      `${name} — a ${cat.fabric.toLowerCase()} drape from our ${cat.short} collection, ` +
      `woven with a ${motif} motif throughout the body and finished with a ${border} zari border. ` +
      `Ideal for ${cat.occasion.toLowerCase()} occasions, it carries a soft sheen, a graceful fall and a ` +
      `pallu that catches the light. Colour shown: ${palette.name}.`;

    products.push({
      id,
      sku: `GSH-${num}`,
      slug: slugify(name),
      name,
      category: cat.id,
      categoryName: cat.name,
      price,
      description,
      image: `/sarees/${id}.svg`,
      colors: pickColors(rand, palette.name),
      palette: { base: palette.base, deep: palette.deep, light: palette.light, accent: palette.accent, name: palette.name },
      fabric: cat.fabric,
      weave: cat.weave,
      occasion: cat.occasion,
      availability,
      featured,
    });
  }
}

/* ------------------------------------------------------------------ */
/* atmosphere files                                                   */
/* ------------------------------------------------------------------ */
writeFileSync(join(atmosphereDir, "hero.svg"), atmosphereSvg({ w: 1800, h: 1200, palette: PALETTES[0], seed: 11, variant: "dark" }), "utf8");
writeFileSync(join(atmosphereDir, "story.svg"), atmosphereSvg({ w: 1200, h: 1500, palette: PALETTES[4], seed: 23, variant: "dark" }), "utf8");
writeFileSync(join(atmosphereDir, "texture.svg"), atmosphereSvg({ w: 1200, h: 800, palette: PALETTES[2], seed: 31, variant: "gold" }), "utf8");
const editDefs = [
  ["edit-wedding.svg", PALETTES[0], 41],
  ["edit-festive.svg", PALETTES[8], 43],
  ["edit-heritage.svg", PALETTES[2], 47],
  ["edit-everyday.svg", PALETTES[4], 53],
];
for (const [file, pal, seed] of editDefs) {
  writeFileSync(join(atmosphereDir, file), atmosphereSvg({ w: 1200, h: 1500, palette: pal, seed, variant: "dark" }), "utf8");
}

/* ------------------------------------------------------------------ */
/* emit TypeScript data source                                        */
/* ------------------------------------------------------------------ */
const ts = `// AUTO-GENERATED by scripts/generate-catalog.mjs — safe to edit, but re-running the
// script will overwrite this file. Product images point at /public/sarees/*.svg and
// are ORIGINAL ILLUSTRATIVE ARTWORK, not photographs of real inventory. Replace any
// \`image\` value with the store's genuine catalog photograph when available.
import type { Saree } from "@/lib/types";

export const seedProducts: Saree[] = ${JSON.stringify(products, null, 2)};
`;

writeFileSync(join(dataDir, "products.ts"), ts, "utf8");

console.log(`Generated ${products.length} products, ${products.length} saree images, 7 atmosphere images.`);
console.log(`Categories: ${CATEGORIES.map((c) => `${c.short}:${c.count}`).join(", ")}`);
