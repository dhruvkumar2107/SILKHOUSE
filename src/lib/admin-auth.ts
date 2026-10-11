import crypto from "node:crypto";

/**
 * Lightweight admin authentication for the catalog dashboard.
 *
 * Set ADMIN_PASSWORD (and optionally ADMIN_SECRET) in .env.local before going
 * live. The token is an HMAC-signed, time-limited value stored in the browser.
 */

const PASSWORD = process.env.ADMIN_PASSWORD ?? "geeta-admin";
const SECRET = process.env.ADMIN_SECRET ?? "geeta-silk-house-dev-secret-change-me";
const MAX_AGE_MS = 12 * 60 * 60 * 1000;

function sign(iat: number): string {
  return crypto.createHmac("sha256", SECRET).update(String(iat)).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function verifyPassword(password: string): boolean {
  return safeEqual(password, PASSWORD);
}

export function makeToken(): string {
  const iat = Date.now();
  return Buffer.from(`${iat}.${sign(iat)}`).toString("base64url");
}

export function verifyToken(token: string | null | undefined): boolean {
  if (!token) return false;
  try {
    const raw = Buffer.from(token, "base64url").toString("utf8");
    const idx = raw.lastIndexOf(".");
    if (idx === -1) return false;
    const iat = raw.slice(0, idx);
    const sig = raw.slice(idx + 1);
    const expected = sign(Number(iat));
    if (!safeEqual(sig, expected)) return false;
    return Date.now() - Number(iat) <= MAX_AGE_MS;
  } catch {
    return false;
  }
}

export function isAdminRequest(request: Request): boolean {
  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  return verifyToken(token);
}
