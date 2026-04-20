// app/admin/payments/page.tsx
import prisma from "@/app/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  SUCCEEDED: "bg-green-100 text-green-700",
  FAILED: "bg-red-100 text-red-700",
  REFUNDED: "bg-orange-100 text-orange-700",
};

export default async function PaymentsPage() {
  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      order: {
        include: { user: { select: { name: true, email: true } } },
      },
    },
  });

  const totalRevenue = payments
    .filter((p) => p.status === "SUCCEEDED")
    .reduce((sum, p) => sum + p.amount, 0);

  const failed = payments.filter((p) => p.status === "FAILED").length;
  const pending = payments.filter((p) => p.status === "PENDING").length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground mt-1">
          {payments.length} transactions · ₹{totalRevenue.toLocaleString("en-IN")} collected
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border bg-white dark:bg-slate-900 p-4">
          <p className="text-xl font-bold text-green-600">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Collected (succeeded)</p>
        </div>
        <div className="rounded-xl border bg-white dark:bg-slate-900 p-4">
          <p className="text-xl font-bold text-yellow-600">{pending}</p>
          <p className="text-xs text-muted-foreground mt-1">Pending</p>
        </div>
        <div className="rounded-xl border bg-white dark:bg-slate-900 p-4">
          <p className="text-xl font-bold text-red-600">{failed}</p>
          <p className="text-xs text-muted-foreground mt-1">Failed</p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-white dark:bg-slate-900 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr className="text-left">
              <th className="px-4 py-3 font-medium">Transaction ID</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Provider</th>
              <th className="px-4 py-3 font-medium text-right">Amount</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                  No payments yet.
                </td>
              </tr>
            )}
            {payments.map((p) => (
              <tr key={p.id} className="border-t hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground max-w-[160px] truncate">
                  {p.providerIntentId}
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium">{p.order.user.name}</p>
                  <p className="text-xs text-muted-foreground">{p.order.user.email}</p>
                </td>
                <td className="px-4 py-3 capitalize">{p.provider}</td>
                <td className="px-4 py-3 text-right font-semibold">
                  ₹{p.amount.toLocaleString("en-IN")}
                  <span className="text-xs text-muted-foreground ml-1">{p.currency}</span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      statusColors[p.status] ?? "bg-slate-100"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {new Date(p.createdAt).toLocaleDateString("en-IN")}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/orders/${p.orderId}`}
                    className="text-xs underline text-muted-foreground hover:text-foreground"
                  >
                    Order
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
