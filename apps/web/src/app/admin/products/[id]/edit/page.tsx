
import { Header } from "@/app/admin/_components/header";
import { ProductForm } from "@/app/admin/products/_components/product-form";

// TODO: ステップ5以降でAPIからデータ取得に差し替え
const DUMMY_PRODUCT = {
  name: "サンプル商品 α",
  description: "これはサンプル商品の説明文です。",
  price: "12800",
  stock: "42",
  category: "category_a",
  published: true,
  image_url: null,
};

export default function ProductEditPage() {
  return (
    <>
      <Header title="商品編集" />
      <main className="flex-1 overflow-y-auto p-6">
        <ProductForm mode="edit" defaultValues={DUMMY_PRODUCT} />
      </main>
    </>
  );
}
