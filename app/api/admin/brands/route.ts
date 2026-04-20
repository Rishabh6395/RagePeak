// app/api/admin/brands/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/db";
import { getAdminOrNull } from "@/app/lib/require-admin";

export async function GET() {
  const admin = await getAdminOrNull();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const brands = await prisma.brand.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true },
  });
  return NextResponse.json(brands);
}

export async function POST(req: Request) {
  const admin = await getAdminOrNull();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name, slug } = await req.json();
    if (!name || !slug) {
      return NextResponse.json({ error: "name and slug required" }, { status: 400 });
    }
    const brand = await prisma.brand.create({ data: { name, slug } });
    return NextResponse.json(brand, { status: 201 });
  } catch (err: any) {
    if (err.code === "P2002") {
      return NextResponse.json({ error: "Slug exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}