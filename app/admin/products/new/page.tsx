// app/admin/products/new/page.tsx
import ProductForm from "../product-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewProductPage() {
  return (
    <div>
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4" /> Back to products
      </Link>
      <h1 className="text-3xl font-bold tracking-tight mb-6">New product</h1>
      <ProductForm mode="create" />
    </div>
  );
}