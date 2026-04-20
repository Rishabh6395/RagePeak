// app/admin/page.tsx
import prisma from "@/app/lib/db";
import { ShoppingBag, Users, Package, TrendingUp } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PAID: "bg-green-100 text-green-700",
  SHIPPED: "bg-blue-100 text-blue-700",
  DELIVERED: "bg-slate-100 text-slate-700",
  CANCELLED: "bg-red-100 text-red-700",
  REFUNDED: "bg-orange-100 text-orange-700",
};

export default async function AdminOverview() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalOrders,
    totalUsers,
    totalProducts,
    revenueData,
    monthRevenue,
    recentOrders,
    ordersByStatus,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.user.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { in: ["PAID", "DELIVERED", "SHIPPED"] } },
    }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: {
        status: { in: ["PAID", "DELIVERED", "SHIPPED"] },
        createdAt: { gte: startOfMonth },
      },
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
    }),
    prisma.order.groupBy({
      by: ["status"],
      _count: { id: true },
    }),
  ]);

  const totalRevenue = revenueData._sum.total ?? 0;
  const thisMonthRevenue = monthRevenue._sum.total ?? 0;

  const stats = [
    {
      label: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString("en-IN")}`,
      sub: `₹${thisMonthRevenue.toLocaleString("en-IN")} this month`,
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-50 dark:bg-green-950",
    },
    {
      label: "Total Orders",
      value: totalOrders,
      sub: "All time",
      icon: ShoppingBag,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-950",
    },
    {
      label: "Active Products",
      value: totalProducts,
      sub: "In catalog",
      icon: Package,
      color: "text-purple-600",
      bg: "bg-purple-50 dark:bg-purple-950",
    },
    {
      label: "Total Users",
      value: totalUsers,
      sub: "Registered",
      icon: Users,
      color: "text-orange-600",
      bg: "bg-orange-50 dark:bg-orange-950",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground mt-1">Welcome back to RagePeak Admin</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border bg-white dark:bg-slate-900 p-5">
            <div className={`inline-flex rounded-lg p-2 ${s.bg} mb-3`}>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-0.5">{s.label}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Recent orders */}
        <div className="xl:col-span-2 rounded-xl border bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <h2 className="font-semibold">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs text-muted-foreground hover:text-foreground">
              View all →
            </Link>
          </div>
          <div className="divide-y">
            {recentOrders.length === 0 && (
              <p className="px-5 py-8 text-sm text-muted-foreground text-center">No orders yet.</p>
            )}
            {recentOrders.map((o) => (
              <Link
                key={o.id}
                href={`/admin/orders/${o.id}`}
                className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/30"
              >
                <div>
                  <p className="text-sm font-medium">{o.user.name}</p>
                  <p className="text-xs text-muted-foreground">{o.user.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">₹{o.total.toLocaleString("en-IN")}</p>
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      statusColors[o.status] ?? "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {o.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Orders by status */}
        <div className="rounded-xl border bg-white dark:bg-slate-900">
          <div className="px-5 py-4 border-b">
            <h2 className="font-semibold">Orders by Status</h2>
          </div>
          <div className="p-5 space-y-3">
            {ordersByStatus.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No data yet</p>
            )}
            {ordersByStatus.map((s) => (
              <div key={s.status}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">{s.status}</span>
                  <span className="font-medium">{s._count.id}</span>
                </div>
                <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full">
                  <div
                    className="h-1.5 bg-slate-800 dark:bg-slate-200 rounded-full"
                    style={{
                      width: `${totalOrders > 0 ? (s._count.id / totalOrders) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
