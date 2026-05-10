import { Header } from "@/app/admin/_components/header";
import { ProductForm } from "@/app/admin/products/_components/product-form";
import { client } from "@/lib/api-client";

export default async function ProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await client.api.products[":id"].$get({
    param: { id },
  });

  if (!res.ok) {
    return (
      <>
        <Header title="商品編集" />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-sm text-destructive">商品が見つかりません</p>
        </main>
      </>
    );
  }

  const product = await res.json();

  return (
    <>
      <Header title="商品編集" />
      <main className="flex-1 overflow-y-auto p-6">
        <ProductForm mode="edit" product={product} />
      </main>
    </>
  );
}
