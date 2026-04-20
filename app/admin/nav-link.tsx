"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  CreditCard,
  BarChart3,
  Home,
} from "lucide-react";

const nav = [
  { href: "/admin",           label: "Overview",  icon: LayoutDashboard },
  { href: "/admin/products",  label: "Products",  icon: Package },
  { href: "/admin/orders",    label: "Orders",    icon: ShoppingBag },
  { href: "/admin/users",     label: "Users",     icon: Users },
  { href: "/admin/payments",  label: "Payments",  icon: CreditCard },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export default function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-white dark:bg-slate-900 flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-lg font-bold tracking-tight">RagePeak Admin</h1>
        <p className="text-xs text-muted-foreground mt-1 truncate">{email}</p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Home className="h-4 w-4" />
          Back to store
        </Link>
      </div>
    </aside>
  );
}
