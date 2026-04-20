// app/admin/analytics/page.tsx
import prisma from "@/app/lib/db";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOf7Days = new Date(now);
  startOf7Days.setDate(now.getDate() - 7);
  const startOf30Days = new Date(now);
  startOf30Days.setDate(now.getDate() - 30);

  const [
    allTimeRevenue,
    monthRevenue,
    weekOrders,
    topProducts,
    recentOrdersForTrend,
    ordersByStatus,
  ] = await Promise.all([
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
    prisma.order.count({ where: { createdAt: { gte: startOf7Days } } }),
    prisma.orderItem.groupBy({
      by: ["name"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 8,
    }),
    prisma.order.findMany({
      where: { createdAt: { gte: startOf30Days } },
      select: { createdAt: true, total: true, status: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.order.groupBy({
      by: ["status"],
      _count: { id: true },
      _sum: { total: true },
    }),
  ]);

  // Group orders by day
  const dailyMap: Record<string, { count: number; revenue: number }> = {};
  recentOrdersForTrend.forEach((o) => {
    const day = o.createdAt.toISOString().slice(0, 10);
    if (!dailyMap[day]) dailyMap[day] = { count: 0, revenue: 0 };
    dailyMap[day].count++;
    if (["PAID", "DELIVERED", "SHIPPED"].includes(o.status)) {
      dailyMap[day].revenue += o.total;
    }
  });

  const daily = Object.entries(dailyMap).slice(-14);
  const maxRevenue = Math.max(...daily.map(([, v]) => v.revenue), 1);
  const maxTopQty = Math.max(...topProducts.map((p) => p._sum.quantity ?? 0), 1);
  const totalAllOrders = ordersByStatus.reduce((s, o) => s + o._count.id, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-1">Sales overview and trends</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-5">
        {[
          {
            label: "All-time Revenue",
            value: `₹${(allTimeRevenue._sum.total ?? 0).toLocaleString("en-IN")}`,
          },
          {
            label: "This Month",
            value: `₹${(monthRevenue._sum.total ?? 0).toLocaleString("en-IN")}`,
          },
          { label: "Orders (last 7 days)", value: weekOrders },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border bg-white dark:bg-slate-900 p-5">
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Revenue bar chart (last 14 days) */}
        <div className="rounded-xl border bg-white dark:bg-slate-900 p-5">
          <h2 className="font-semibold mb-5">Revenue — Last 14 Days</h2>
          {daily.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No data yet</p>
          ) : (
            <div className="flex items-end gap-1.5 h-40 pb-6 relative">
              {daily.map(([day, { revenue }]) => (
                <div key={day} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <span className="text-[9px] text-muted-foreground">
                    ₹{revenue > 0 ? (revenue / 1000).toFixed(0) + "k" : "0"}
                  </span>
                  <div
                    className="w-full bg-slate-800 dark:bg-slate-300 rounded-t-sm min-h-[2px] transition-all"
                    style={{ height: `${Math.max((revenue / maxRevenue) * 80, revenue > 0 ? 4 : 2)}%` }}
                    title={`₹${revenue.toLocaleString("en-IN")}`}
                  />
                  <span className="text-[9px] text-muted-foreground">{day.slice(5)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top products */}
        <div className="rounded-xl border bg-white dark:bg-slate-900 p-5">
          <h2 className="font-semibold mb-5">Top Products by Units Sold</h2>
          {topProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No order data yet</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((p) => {
                const qty = p._sum.quantity ?? 0;
                return (
                  <div key={p.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium truncate">{p.name}</span>
                      <span className="text-muted-foreground ml-2 shrink-0">{qty} units</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full">
                      <div
                        className="h-1.5 bg-slate-800 dark:bg-slate-200 rounded-full"
                        style={{ width: `${(qty / maxTopQty) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Orders by status breakdown */}
      <div className="rounded-xl border bg-white dark:bg-slate-900 p-5">
        <h2 className="font-semibold mb-5">Order Status Breakdown</h2>
        {ordersByStatus.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No data yet</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {ordersByStatus.map((s) => (
              <div
                key={s.status}
                className="rounded-lg border p-4 text-center"
              >
                <p className="text-xl font-bold">{s._count.id}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.status}</p>
                <p className="text-xs font-medium mt-1">
                  {totalAllOrders > 0
                    ? ((s._count.id / totalAllOrders) * 100).toFixed(0)
                    : 0}
                  %
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
