import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UPLOADS_DIR = path.join(process.cwd(), "data", "uploads");

const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

type Ctx = { params: Promise<{ file: string }> };

export async function GET(_request: Request, { params }: Ctx) {
  const { file } = await params;
  const normalized = path.basename(file);
  if (normalized !== file || !/^[a-zA-Z0-9._-]+$/.test(normalized)) {
    return new NextResponse("Not found.", { status: 404 });
  }

  const ext = normalized.split(".").pop()?.toLowerCase() ?? "";
  const contentType = MIME[ext];
  if (!contentType) {
    return new NextResponse("Not found.", { status: 404 });
  }

  const fullPath = path.join(UPLOADS_DIR, normalized);
  try {
    await stat(fullPath);
  } catch {
    return new NextResponse("Not found.", { status: 404 });
  }

  const stream = Readable.toWeb(createReadStream(fullPath)) as ReadableStream;
  return new NextResponse(stream, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Disposition": "inline",
    },
  });
}