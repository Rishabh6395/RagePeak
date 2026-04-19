import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/db"; 
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) return NextResponse.json({ products: [], brands: [] });

  const [products, brands] = await Promise.all([
    prisma.product.findMany({
      where: { name: { contains: q, mode: "insensitive" } },
      take: 6,
      select: { id: true, name: true, slug: true, category: true, price: true, image: true },
    }),
    prisma.brand.findMany({
      where: { name: { contains: q, mode: "insensitive" } },
      take: 3,
      select: { id: true, name: true, slug: true },
    }),
  ]);

  return NextResponse.json({ products, brands });
}
