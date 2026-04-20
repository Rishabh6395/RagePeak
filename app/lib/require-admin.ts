// app/lib/require-admin.ts
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/app/lib/auth";
import prisma from "@/app/lib/db";

/**
 * Use in server components/pages that must be admin-only.
 * Redirects non-admins. Returns the admin user if allowed.
 */
export async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/sign-in?callbackUrl=/admin");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true, name: true, email: true, image: true },
  });

  if (!user || user.role !== "ADMIN") {
    redirect("/");
  }

  return user;
}

/**
 * For API route handlers. Returns null if not admin
 * (so you can return a proper JSON 401/403 response).
 */
export async function getAdminOrNull() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true, name: true, email: true },
  });

  if (!user || user.role !== "ADMIN") return null;
  return user;
}