// app/admin/products/delete-button.tsx
"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Trash2 } from "lucide-react";

export default function DeleteProductButton({ id }: { id: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onDelete = async () => {
    if (!confirm("Hide this product? (It will be soft-deleted, not permanently removed.)")) return;

    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error ?? "Failed to delete");
      return;
    }
    startTransition(() => router.refresh());
  };

  return (
    <button
      onClick={onDelete}
      disabled={isPending}
      className="inline-flex items-center gap-1 rounded-md border border-red-200 text-red-600 px-2 py-1 text-xs hover:bg-red-50 disabled:opacity-50"
    >
      <Trash2 className="h-3 w-3" /> {isPending ? "..." : "Delete"}
    </button>
  );
}