import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UPLOADS_DIR = path.join(process.cwd(), "data", "uploads");
const MAX_BYTES = 10 * 1024 * 1024;

const ALLOWED: Record<string, { ext: string; magic: number[] }> = {
  "image/jpeg": { ext: "jpg", magic: [0xff, 0xd8, 0xff] },
  "image/png": { ext: "png", magic: [0x89, 0x50, 0x4e, 0x47] },
  "image/webp": { ext: "webp", magic: [0x52, 0x49, 0x46, 0x46] },
};

export async function POST(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload body." }, { status: 400 });
  }

  const entry = form.get("file");
  if (!entry || typeof entry === "string") {
    return NextResponse.json({ error: "Missing file." }, { status: 400 });
  }
  const file = entry as File;

  const props = ALLOWED[file.type] ?? null;
  if (!props) {
    return NextResponse.json(
      { error: "Only JPG, PNG or WebP images are allowed." },
      { status: 415 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image must be under 10 MB." }, { status: 413 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const matchesMagic = props.magic.every((byte, i) => buffer[i] === byte);
  if (!matchesMagic) {
    return NextResponse.json(
      { error: "File content does not match its declared type." },
      { status: 415 }
    );
  }

  const name = `gsh-upload-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}.${props.ext}`;
  await mkdir(UPLOADS_DIR, { recursive: true });
  await writeFile(path.join(UPLOADS_DIR, name), buffer);

  return NextResponse.json({ path: `/api/uploads/${name}` });
}