// app/admin/orders/page.tsx
import prisma from "@/app/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

const STATUS_OPTIONS = ["ALL", "PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PAID: "bg-green-100 text-green-700",
  SHIPPED: "bg-blue-100 text-blue-700",
  DELIVERED: "bg-slate-100 text-slate-700",
  CANCELLED: "bg-red-100 text-red-700",
  REFUNDED: "bg-orange-100 text-orange-700",
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status = "ALL" } = await searchParams;

  const orders = await prisma.order.findMany({
    where: status !== "ALL" ? { status: status as any } : undefined,
    include: {
      user: { select: { name: true, email: true } },
      items: { select: { quantity: true } },
      payment: { select: { status: true, provider: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground mt-1">{orders.length} orders</p>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 flex-wrap mb-5">
        {STATUS_OPTIONS.map((s) => (
          <Link
            key={s}
            href={s === "ALL" ? "/admin/orders" : `/admin/orders?status=${s}`}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              status === s || (s === "ALL" && !status)
                ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-transparent"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-400"
            }`}
          >
            {s}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-white dark:bg-slate-900 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr className="text-left">
              <th className="px-4 py-3 font-medium">Order ID</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Items</th>
              <th className="px-4 py-3 font-medium text-right">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Payment</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                  No orders found.
                </td>
              </tr>
            )}
            {orders.map((o) => (
              <tr key={o.id} className="border-t hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                  #{o.id.slice(-8).toUpperCase()}
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium">{o.user.name}</p>
                  <p className="text-xs text-muted-foreground">{o.user.email}</p>
                </td>
                <td className="px-4 py-3">
                  {o.items.reduce((sum, i) => sum + i.quantity, 0)} items
                </td>
                <td className="px-4 py-3 text-right font-semibold">
                  ₹{o.total.toLocaleString("en-IN")}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      statusColors[o.status] ?? "bg-slate-100"
                    }`}
                  >
                    {o.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {o.payment ? (
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        o.payment.status === "SUCCEEDED"
                          ? "bg-green-100 text-green-700"
                          : o.payment.status === "FAILED"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {o.payment.status}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {new Date(o.createdAt).toLocaleDateString("en-IN")}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="text-xs underline text-muted-foreground hover:text-foreground"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
