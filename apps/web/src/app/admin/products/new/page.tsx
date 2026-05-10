

import { Header } from "@/app/admin/_components/header";
import { ProductForm } from "@/app/admin/products/_components/product-form";

export default function ProductNewPage() {
  return (
    <>
      <Header title="商品登録" />
      <main className="flex-1 overflow-y-auto p-6">
        <ProductForm mode="new" />
      </main>
    </>
  );
}
