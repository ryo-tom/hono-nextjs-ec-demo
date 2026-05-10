"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { client } from "@/lib/api-client";
import type { InferResponseType } from "hono/client";
import { ImageOff, Loader2, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type ProductDetail = InferResponseType<
  (typeof client.api.products)[":id"]["$get"],
  200
>;
type CategoryList = InferResponseType<(typeof client.api.categories)["$get"]>;

type ProductFormProps =
  | { mode: "new" }
  | { mode: "edit"; product: ProductDetail };

export function ProductForm(props: ProductFormProps) {
  const router = useRouter();

  const defaultValues =
    props.mode === "edit"
      ? {
          name: props.product.name,
          description: props.product.description ?? "",
          price: props.product.price?.toString() ?? "",
          stock: props.product.stock?.toString() ?? "",
          category_id: props.product.categoryId.toString(),
          published: props.product.published,
          image_url: props.product.images?.[0]?.imageUrl ?? null,
        }
      : {
          name: "",
          description: "",
          price: "",
          stock: "",
          category_id: "",
          published: false,
          image_url: null as string | null,
        };

  const [values, setValues] = useState(defaultValues);
  const [categories, setCategories] = useState<CategoryList>([]);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  // カテゴリ一覧取得
  useEffect(() => {
    const load = async () => {
      const res = await client.api.categories.$get();
      if (res.ok) setCategories(await res.json());
    };
    load();
  }, []);

  const set = <K extends keyof typeof values>(
    key: K,
    value: (typeof values)[K],
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!values.name.trim()) next.name = "商品名は必須です";
    if (
      !values.price ||
      isNaN(Number(values.price)) ||
      Number(values.price) < 0
    )
      next.price = "正しい価格を入力してください";
    if (
      !values.stock ||
      isNaN(Number(values.stock)) ||
      Number(values.stock) < 0
    )
      next.stock = "正しい在庫数を入力してください";
    if (!values.category_id) next.category_id = "カテゴリを選択してください";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);

    try {
      const body = {
        name: values.name,
        description: values.description || undefined,
        price: Number(values.price),
        stock: Number(values.stock),
        category_id: Number(values.category_id),
        published: values.published,
      };

      if (props.mode === "new") {
        const res = await client.api.products.$post({ json: body });
        if (!res.ok) throw new Error("登録に失敗しました");
      } else {
        const res = await client.api.products[":id"].$patch({
          param: { id: props.product.id.toString() },
          json: body,
        });
        if (!res.ok) throw new Error("更新に失敗しました");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (e) {
      setErrors({
        submit: e instanceof Error ? e.message : "エラーが発生しました",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* 画像 */}
      <section>
        <Label className="mb-2 block text-sm font-medium">商品画像</Label>
        <div className="flex items-start gap-4">
          <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-lg border bg-muted">
            {values.image_url ? (
              <img
                src={values.image_url}
                alt="プレビュー"
                className="h-28 w-28 rounded-lg object-cover"
              />
            ) : (
              <ImageOff size={24} className="text-muted-foreground" />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Button type="button" variant="outline" size="sm" className="w-fit">
              <Upload size={14} className="mr-1.5" />
              画像を選択
            </Button>
            {values.image_url && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-fit text-destructive hover:text-destructive"
                onClick={() => set("image_url", null)}
              >
                <X size={14} className="mr-1.5" />
                削除
              </Button>
            )}
            <p className="text-xs text-muted-foreground">
              推奨: 800×800px、JPG / PNG、5MB以内
            </p>
          </div>
        </div>
      </section>

      {/* 基本情報 */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold">基本情報</h2>

        <div className="space-y-1.5">
          <Label htmlFor="name">
            商品名 <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            placeholder="例: サンプル商品 α"
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description">説明文</Label>
          <Textarea
            id="description"
            placeholder="商品の説明を入力してください"
            rows={4}
            value={values.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </div>
      </section>

      {/* 価格・在庫 */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold">価格・在庫</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="price">
              価格（円） <span className="text-destructive">*</span>
            </Label>
            <Input
              id="price"
              type="number"
              min={0}
              placeholder="0"
              value={values.price}
              onChange={(e) => set("price", e.target.value)}
              className={errors.price ? "border-destructive" : ""}
            />
            {errors.price && (
              <p className="text-xs text-destructive">{errors.price}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="stock">
              在庫数 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="stock"
              type="number"
              min={0}
              placeholder="0"
              value={values.stock}
              onChange={(e) => set("stock", e.target.value)}
              className={errors.stock ? "border-destructive" : ""}
            />
            {errors.stock && (
              <p className="text-xs text-destructive">{errors.stock}</p>
            )}
          </div>
        </div>
      </section>

      {/* カテゴリ・ステータス */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold">カテゴリ・公開設定</h2>

        <div className="space-y-1.5">
          <Label>
            カテゴリ <span className="text-destructive">*</span>
          </Label>
          <Select
            value={values.category_id}
            onValueChange={(v) => set("category_id", v)}
          >
            <SelectTrigger
              className={errors.category_id ? "border-destructive" : ""}
            >
              <SelectValue placeholder="カテゴリを選択" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id.toString()}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category_id && (
            <p className="text-xs text-destructive">{errors.category_id}</p>
          )}
        </div>

        <div className="flex items-center justify-between rounded-lg border px-4 py-3">
          <div>
            <p className="text-sm font-medium">公開する</p>
            <p className="text-xs text-muted-foreground">
              オンにするとショップに表示されます
            </p>
          </div>
          <Switch
            checked={values.published}
            onCheckedChange={(v) => set("published", v)}
          />
        </div>
      </section>

      {/* エラー */}
      {errors.submit && (
        <p className="text-sm text-destructive">{errors.submit}</p>
      )}

      {/* フッターアクション */}
      <div className="flex items-center justify-end gap-3 border-t pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/products")}
          disabled={submitting}
        >
          キャンセル
        </Button>
        <Button onClick={handleSubmit} disabled={submitting}>
          {submitting && <Loader2 size={14} className="mr-1.5 animate-spin" />}
          {props.mode === "new" ? "商品を登録する" : "変更を保存する"}
        </Button>
      </div>
    </div>
  );
}
