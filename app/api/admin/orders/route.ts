// app/api/admin/orders/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/db";
import { getAdminOrNull } from "@/app/lib/require-admin";

export async function GET(req: Request) {
  const admin = await getAdminOrNull();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const orders = await prisma.order.findMany({
    where: status ? { status: status as any } : undefined,
    include: {
      user: { select: { name: true, email: true } },
      items: { select: { quantity: true, name: true, price: true } },
      payment: { select: { status: true, provider: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}
