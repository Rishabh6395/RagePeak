// app/admin/users/page.tsx
import prisma from "@/app/lib/db";

export const dynamic = "force-dynamic";

const roleColors: Record<string, string> = {
  ADMIN: "bg-purple-100 text-purple-700",
  CUSTOMER: "bg-slate-100 text-slate-600",
};

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { orders: true } },
    },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground mt-1">{users.length} registered users</p>
      </div>

      <div className="rounded-lg border bg-white dark:bg-slate-900 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr className="text-left">
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium text-right">Orders</th>
              <th className="px-4 py-3 font-medium">Verified</th>
              <th className="px-4 py-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                  No users yet.
                </td>
              </tr>
            )}
            {users.map((u) => (
              <tr key={u.id} className="border-t hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {u.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={u.image}
                        alt={u.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold">
                        {u.name[0]?.toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      roleColors[u.role] ?? "bg-slate-100"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">{u._count.orders}</td>
                <td className="px-4 py-3">
                  {u.emailVerified ? (
                    <span className="text-green-600 text-xs font-medium">✓ Yes</span>
                  ) : (
                    <span className="text-muted-foreground text-xs">No</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {new Date(u.createdAt).toLocaleDateString("en-IN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
