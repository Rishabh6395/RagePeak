// app/admin/orders/[id]/page.tsx
import prisma from "@/app/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import OrderStatusSelect from "./status-select";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true } },
      items: true,
      payment: true,
    },
  });

  if (!order) notFound();

  const address = order.address as Record<string, string> | null;

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4" /> Back to orders
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Order #{id.slice(-8).toUpperCase()}
          </h1>
          <p className="text-muted-foreground mt-1">
            {new Date(order.createdAt).toLocaleString("en-IN")}
          </p>
        </div>
        <OrderStatusSelect orderId={id} currentStatus={order.status} />
      </div>

      <div className="grid grid-cols-2 gap-5 mb-5">
        {/* Customer */}
        <div className="rounded-xl border bg-white dark:bg-slate-900 p-5">
          <h2 className="text-sm font-semibold mb-3">Customer</h2>
          <p className="text-sm font-medium">{order.user.name}</p>
          <p className="text-sm text-muted-foreground">{order.user.email}</p>
        </div>

        {/* Shipping address */}
        <div className="rounded-xl border bg-white dark:bg-slate-900 p-5">
          <h2 className="text-sm font-semibold mb-3">Shipping Address</h2>
          {address ? (
            <div className="text-sm text-muted-foreground space-y-0.5">
              <p>{address.line1}</p>
              {address.line2 && <p>{address.line2}</p>}
              <p>
                {address.city}, {address.state} {address.pincode}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No address recorded</p>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="rounded-xl border bg-white dark:bg-slate-900 mb-5">
        <h2 className="text-sm font-semibold px-5 py-4 border-b">Items</h2>
        <div className="divide-y">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 px-5 py-3">
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-12 w-12 rounded object-cover shrink-0"
                />
              ) : (
                <div className="h-12 w-12 rounded bg-slate-100 dark:bg-slate-800 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  ₹{item.price.toLocaleString("en-IN")} × {item.quantity}
                </p>
              </div>
              <p className="text-sm font-semibold shrink-0">
                ₹{(item.price * item.quantity).toLocaleString("en-IN")}
              </p>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="px-5 py-4 border-t space-y-1 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>₹{order.subtotal.toLocaleString("en-IN")}</span>
          </div>
          {order.tax > 0 && (
            <div className="flex justify-between text-muted-foreground">
              <span>Tax</span>
              <span>₹{order.tax.toLocaleString("en-IN")}</span>
            </div>
          )}
          {order.shipping > 0 && (
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span>₹{order.shipping.toLocaleString("en-IN")}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-base pt-2 border-t">
            <span>Total</span>
            <span>₹{order.total.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>

      {/* Payment */}
      {order.payment && (
        <div className="rounded-xl border bg-white dark:bg-slate-900 p-5">
          <h2 className="text-sm font-semibold mb-3">Payment</h2>
          <div className="text-sm space-y-2 text-muted-foreground">
            <div className="flex justify-between">
              <span>Provider</span>
              <span className="capitalize font-medium text-foreground">{order.payment.provider}</span>
            </div>
            <div className="flex justify-between">
              <span>Transaction ID</span>
              <span className="font-mono text-xs">{order.payment.providerIntentId}</span>
            </div>
            <div className="flex justify-between">
              <span>Amount</span>
              <span className="font-medium text-foreground">
                ₹{order.payment.amount.toLocaleString("en-IN")} {order.payment.currency}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Status</span>
              <span
                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                  order.payment.status === "SUCCEEDED"
                    ? "bg-green-100 text-green-700"
                    : order.payment.status === "FAILED"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {order.payment.status}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
