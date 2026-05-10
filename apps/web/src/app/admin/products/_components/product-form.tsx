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
import { ImageOff, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CATEGORIES = [
  { value: "category_a", label: "カテゴリA" },
  { value: "category_b", label: "カテゴリB" },
  { value: "category_c", label: "カテゴリC" },
  { value: "category_d", label: "カテゴリD" },
];

type ProductFormValues = {
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
  published: boolean;
  image_url: string | null;
};

type ProductFormProps = {
  mode: "new" | "edit";
  defaultValues?: Partial<ProductFormValues>;
};

const DEFAULT: ProductFormValues = {
  name: "",
  description: "",
  price: "",
  stock: "",
  category: "",
  published: false,
  image_url: null,
};

export function ProductForm({ mode, defaultValues }: ProductFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<ProductFormValues>({
    ...DEFAULT,
    ...defaultValues,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormValues, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const set = <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const next: typeof errors = {};
    if (!values.name.trim()) next.name = "商品名は必須です";
    if (!values.price || isNaN(Number(values.price)) || Number(values.price) < 0)
      next.price = "正しい価格を入力してください";
    if (!values.stock || isNaN(Number(values.stock)) || Number(values.stock) < 0)
      next.stock = "正しい在庫数を入力してください";
    if (!values.category) next.category = "カテゴリを選択してください";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    // TODO: API接続後に差し替え
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    router.push("/admin/products");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* 画像アップロード */}
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
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-fit"
              onClick={() => {
                // TODO: ファイルアップロード実装
              }}
            >
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

        {/* 商品名 */}
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

        {/* 説明文 */}
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
          {/* 価格 */}
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

          {/* 在庫数 */}
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

        {/* カテゴリ */}
        <div className="space-y-1.5">
          <Label>
            カテゴリ <span className="text-destructive">*</span>
          </Label>
          <Select
            value={values.category}
            onValueChange={(v) => set("category", v)}
          >
            <SelectTrigger className={errors.category ? "border-destructive" : ""}>
              <SelectValue placeholder="カテゴリを選択" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-xs text-destructive">{errors.category}</p>
          )}
        </div>

        {/* 公開ステータス */}
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

      {/* フッターアクション */}
      <div className="flex items-center justify-end gap-3 border-t pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/products")}
        >
          キャンセル
        </Button>
        <Button onClick={handleSubmit} disabled={submitting}>
          {submitting
            ? "保存中..."
            : mode === "new"
            ? "商品を登録する"
            : "変更を保存する"}
        </Button>
      </div>
    </div>
  );
}
