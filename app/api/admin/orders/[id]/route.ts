// app/api/admin/orders/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/db";
import { getAdminOrNull } from "@/app/lib/require-admin";

const VALID_STATUSES = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminOrNull();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true } },
      items: true,
      payment: true,
    },
  });

  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(order);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminOrNull();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { status } = body;

  if (!status || !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
}
