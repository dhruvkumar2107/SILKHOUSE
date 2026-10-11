import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { resetProducts } from "@/lib/product-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const products = await resetProducts();
  return NextResponse.json({ products, total: products.length });
}
