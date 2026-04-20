// app/admin/products/product-form.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Brand = { id: string; name: string };

export type ProductFormValues = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  category: string;
  brandId: string;
  isActive: boolean;
};

const emptyValues: ProductFormValues = {
  name: "",
  slug: "",
  description: "",
  price: 0,
  stock: 0,
  image: "",
  category: "",
  brandId: "",
  isActive: true,
};

export default function ProductForm({
  initial,
  mode,
}: {
  initial?: Partial<ProductFormValues>;
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const [values, setValues] = useState<ProductFormValues>({ ...emptyValues, ...initial });
  const [brands, setBrands] = useState<Brand[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/brands")
      .then((r) => r.json())
      .then((data) => setBrands(Array.isArray(data) ? data : []));
  }, []);

  const update = <K extends keyof ProductFormValues>(key: K, v: ProductFormValues[K]) =>
    setValues((s) => ({ ...s, [key]: v }));

  // Auto-generate slug from name on create
  const onNameBlur = () => {
    if (mode === "create" && !values.slug && values.name) {
      const slug = values.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      update("slug", slug);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const url =
      mode === "create"
        ? "/api/admin/products"
        : `/api/admin/products/${values.id}`;
    const method = mode === "create" ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong");
      return;
    }

    router.push("/admin/products");
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-5">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <Field label="Name" required>
        <input
          required
          value={values.name}
          onChange={(e) => update("name", e.target.value)}
          onBlur={onNameBlur}
          className={inputCls}
        />
      </Field>

      <Field label="Slug" required hint="URL-friendly, e.g. red-hoodie">
        <input
          required
          value={values.slug}
          onChange={(e) => update("slug", e.target.value)}
          className={inputCls}
        />
      </Field>

      <Field label="Description">
        <textarea
          rows={4}
          value={values.description}
          onChange={(e) => update("description", e.target.value)}
          className={inputCls}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Price (₹)" required>
          <input
            required
            type="number"
            step="0.01"
            min="0"
            value={values.price}
            onChange={(e) => update("price", Number(e.target.value))}
            className={inputCls}
          />
        </Field>
        <Field label="Stock" required>
          <input
            required
            type="number"
            min="0"
            value={values.stock}
            onChange={(e) => update("stock", Number(e.target.value))}
            className={inputCls}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Category" required hint="e.g. men, women, accessories">
          <input
            required
            value={values.category}
            onChange={(e) => update("category", e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Brand" required>
          <select
            required
            value={values.brandId}
            onChange={(e) => update("brandId", e.target.value)}
            className={inputCls}
          >
            <option value="">Select brand...</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Image URL" hint="Paste any image URL for now. We'll wire up file uploads later.">
        <input
          type="url"
          placeholder="https://..."
          value={values.image}
          onChange={(e) => update("image", e.target.value)}
          className={inputCls}
        />
        {values.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={values.image} alt="" className="mt-2 h-24 w-24 rounded object-cover border" />
        )}
      </Field>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={values.isActive}
          onChange={(e) => update("isActive", e.target.checked)}
        />
        Active (visible to customers)
      </label>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-5 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "Saving..." : mode === "create" ? "Create product" : "Save changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="rounded-md border px-5 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

const inputCls =
  "w-full rounded-md border bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400";

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}