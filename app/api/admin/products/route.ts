// app/api/admin/products/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/db";
import { getAdminOrNull } from "@/app/lib/require-admin";

export async function GET(req: Request) {
  const admin = await getAdminOrNull();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";

  const products = await prisma.product.findMany({
    where: q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { slug: { contains: q, mode: "insensitive" } },
            { category: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    include: { brand: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const admin = await getAdminOrNull();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const {
      name, slug, description, price, stock,
      image, images, category, brandId, isActive,
    } = body;

    // Minimal validation
    if (!name || !slug || price == null || !category || !brandId) {
      return NextResponse.json(
        { error: "name, slug, price, category, brandId are required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description: description ?? null,
        price: Number(price),
        stock: Number(stock ?? 0),
        image: image ?? null,
        images: Array.isArray(images) ? images : [],
        category,
        brandId,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (err: any) {
    if (err.code === "P2002") {
      return NextResponse.json(
        { error: "A product with that slug already exists" },
        { status: 409 }
      );
    }
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}