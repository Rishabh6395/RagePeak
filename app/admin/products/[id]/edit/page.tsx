// app/admin/products/[id]/edit/page.tsx
import prisma from "@/app/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProductForm from "../../product-form";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  return (
    <div>
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4" /> Back to products
      </Link>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Edit product</h1>
      <ProductForm
        mode="edit"
        initial={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description ?? "",
          price: product.price,
          stock: product.stock,
          image: product.image ?? "",
          category: product.category,
          brandId: product.brandId,
          isActive: product.isActive,
        }}
      />
    </div>
  );
}