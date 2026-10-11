import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Pulls free high-resolution saree photos (Pexels License — free to use,
 * no attribution required) from images.pexels.com and saves them into
 * public/sarees/photos/ so the catalogue serves locally-hosted photos that
 * load instantly with the site. Idempotent: already-downloaded photos are
 * skipped, and photos not referenced by the catalogue are never fetched.
 *
 * Photos are REPRESENTATIVE stock imagery, not photographs of the store's
 * physical inventory — swap any image with a genuine catalog photo later.
 */

const ROOT = process.cwd();
const PRODUCTS_FILE = path.join(ROOT, "src", "data", "products.ts");
const OUT_DIR = path.join(ROOT, "public", "sarees", "photos");
const WIDTH = 1080;
const HEIGHT = 1440;
const CONCURRENCY = 6;
const MAX_ATTEMPTS = 3;

// Photo IDs discovered via Pexels search pages (https://www.pexels.com).
const SOURCES = [
  7920188, 28943474, 28405815, 14928074, 36311379, 14693247, 9880858, 9616714, 8483369, 10133278,
  39030338, 5598586, 6879815, 6633533, 5618175, 16049198, 30916976, 27719401, 17113983, 11629757,
  37054322, 39857905, 7920194, 28316406, 7326221, 7920055, 37054318, 30004204, 38969253, 28135787,
  20161456, 28058186, 38850343, 37880205, 34368242, 38998845, 14205210, 29743627, 30722459, 35902078,
  9936328, 9738983, 4048043, 35569902, 7515855, 28943579, 28517477, 33729216, 28943572, 28943520,
  38318411, 31699150, 28943543, 28943531, 28943465, 28943617, 29819597, 35808682, 33368823, 28943571,
  33729211, 34058551, 28517481, 6593898, 26998087, 28943670, 10153594, 35670065, 35108820, 28943484,
  9419023, 28943676, 28054616, 28943601, 28943602, 5913195, 27918892, 5447529, 27575104, 38966362,
  5704311, 29049398, 19764064, 38526712, 34955448, 28941551, 30825617, 15291907, 31750760, 32934714,
  37597723, 20507025, 38295676, 28428035, 37054310, 37602134, 37680843, 36120203, 37597733, 35680513,
  9333036, 37045290, 32235795, 30458510, 37054325, 30272196, 27500765, 19595399, 39322132, 37708266,
  17649814, 13454130, 30703870, 14664844, 29172765, 29172767, 6167463, 23964627, 39762863, 33711585,
  6786971, 29026116, 29480425, 29026115, 7853471, 16696857, 33078845, 34211598, 33711579, 28683994,
  9345930, 20957555, 12498401, 13204678, 8750030, 37054347, 4427080, 30004227, 38962494, 30703862,
  38379427, 37851044, 39342603, 24786278, 19261986, 39322149, 33306349, 32683751, 40154623, 33616291,
  17295909, 19594072, 10454182, 35069916, 39299440, 34867545, 37054351, 38866217, 31792684, 8229223,
  13293704, 3785644, 3916017, 27575174, 39322125, 29357482, 30458517, 33826398, 35059564, 8815290,
  29451035, 38281680, 34479838, 7710091, 32341972, 29820147, 5358108, 6248741, 806835, 18890524,
  35869868, 39559946, 7176438, 17876038, 7176430, 10156154, 31641867, 34964322, 19115366, 12567318,
  33328174, 32711516, 6231630, 15788298, 15835264, 15323736, 39334071, 33556315, 7850277, 34211603,
  17040892, 27139262, 6842754, 5915237, 8007352, 17734751, 7498815, 7641151, 7956629, 11585380,
  14440412, 14440420, 6634449, 30580212, 35596695, 14944285, 8465934, 8753304, 8007347, 17609847,
  7232398, 21926656, 36516572, 4814062, 8793885, 7956631, 8754108, 7956636, 19191099, 8030176,
  6461325, 5777056, 4938326, 7988395, 8793891, 8465943, 8007354, 8465939, 8793876, 36208816, 10153594,
];

const CATEGORY_ORDER = [
  "kanjivaram",
  "banarasi",
  "mysore",
  "soft-silk",
  "bridal",
  "pattu",
  "designer",
  "temple-border",
  "festive",
  "lightweight",
];

function photoFileName(id) {
  return `pexels-${id}.jpg`;
}

function urlFor(id) {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${WIDTH}&h=${HEIGHT}&fit=crop`;
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function download(photoName, id) {
  const dest = path.join(OUT_DIR, photoName);
  try {
    const existing = await fs.stat(dest);
    if (existing.size > 10_000) return { name: photoName, status: "cached", bytes: existing.size };
  } catch {
    /* not present yet */
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 60_000);
  try {
    const res = await fetch(urlFor(id), { signal: controller.signal });
    if (!res.ok)
      throw new Error(`HTTP ${res.status} for photo ${id}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await fs.writeFile(dest, buf);
    return { name: photoName, status: "downloaded", bytes: buf.length };
  } finally {
    clearTimeout(timer);
  }
}

async function mapPool(products) {
  const perCategory = new Map();
  return products.map((p) => {
    const catIdx = Math.max(0, CATEGORY_ORDER.indexOf(p.category));
    const within = perCategory.get(p.category) ?? 0;
    perCategory.set(p.category, within + 1);
    const idx = (catIdx * 17 + within * 7) % SOURCES.length;
    return { ...p, photo: photoFileName(SOURCES[idx]) };
  });
}

async function main() {
  const lines = (await fs.readFile(PRODUCTS_FILE, "utf8")).split("\n");
  const raw = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/"id": "gsh-/.test(line)) raw.push({ category: null, imageLine: -1, line: i + 1 });
    const catMatch = line.match(/"category": "([^"]+)"/);
    if (catMatch && raw.length) raw[raw.length - 1].category = catMatch[1];
    if (/^\s*"image": /.test(line) && raw.length) raw[raw.length - 1].imageLine = i;
  }
  const products = raw.filter((p) => p.category !== null && p.imageLine !== -1);
  if (products.length === 0) {
    console.error("No products matched in", PRODUCTS_FILE);
    process.exit(1);
  }
  console.log(`Parsed ${products.length} products; assigning photos…`);
  const mapped = await mapPool(products);

  const assignments = new Map(products.map((p, i) => [p.imageLine, mapped[i].photo]));
  await fs.mkdir(OUT_DIR, { recursive: true });

  const needed = new Set(mapped.map((m) => m.photo));
  console.log(`Downloading ${needed.size} photos to ${OUT_DIR} (concurrency ${CONCURRENCY})…`);
  const queue = [...needed];
  let active = 0;
  let cursor = 0;
  let ok = 0;
  let failed = 0;
  const results = [];
  const okSet = new Set();
  await new Promise((resolve) => {
    function pump() {
      while (active < CONCURRENCY && cursor < queue.length) {
        const photoName = queue[cursor++];
        active++;
        const id = photoName.replace(/[^0-9]/g, "");
        let attempt = 1;
        (async function run() {
          while (true) {
            try {
              const r = await download(photoName, id);
              if (r.status === "downloaded" || r.status === "cached") {
                ok++;
                okSet.add(photoName);
              }
              results.push(r);
              break;
            } catch (err) {
              if (attempt >= MAX_ATTEMPTS) {
                console.error(`FAILED ${photoName}: ${err.message}`);
                failed++;
                break;
              }
              attempt++;
              await sleep(800 * attempt);
            }
          }
        })().finally(() => {
          active--;
          if (active === 0 && cursor >= queue.length) resolve();
          else pump();
        });
      }
    }
    pump();
  });

  if (failed > 0) {
    console.warn(`${failed} photo(s) could not be downloaded — those products keep their old image.`);
  }

  const replace = new Map();
  for (const [lineNo, photo] of assignments) {
    if (okSet.has(photo)) replace.set(lineNo, photo);
  }
  const out = lines.map((line, i) => {
    if (replace.has(i)) {
      const indent = line.match(/^\s*/)[0];
      return `${indent}"image": "/sarees/photos/${replace.get(i)}",`;
    }
    return line;
  });

  const header = [
    "// AUTO-GENERATED by scripts/attach-product-photos.mjs — safe to edit, but re-running the",
    "// script will overwrite this file. Product images point at locally-served HD photos in",
    "// /public/sarees/photos/* (free-to-use Pexels stock imagery, representative — NOT",
    "// photographs of real inventory). Replace any `image` value with the store's genuine",
    "// catalog photograph when available.",
    "",
  ];
  const importIdx = out.findIndex((l) => l.startsWith("import"));
  const final = [...header, ...out.slice(importIdx)].join("\n");
  await fs.writeFile(PRODUCTS_FILE, final, "utf8");

  const totalBytes = results.reduce((s, r) => s + (r.bytes || 0), 0);
  console.log(
    `Done. ok=${ok} failed=${failed} photosOnDisk≈${(totalBytes / 1048576).toFixed(1)} MB; updated ${PRODUCTS_FILE}`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});