// app/admin/layout.tsx
import { requireAdmin } from "@/app/lib/require-admin";
import AdminSidebar from "./nav-link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <AdminSidebar email={admin.email} />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}