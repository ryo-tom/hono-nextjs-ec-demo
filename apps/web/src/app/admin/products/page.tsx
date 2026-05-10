"use client";

import { Header } from "@/app/admin/_components/header";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { client } from "@/lib/api-client";
import type { InferResponseType } from "hono/client";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ImageOff,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type Product = InferResponseType<typeof client.api.products[":id"]["$get"], 200>;
type SortKey = "name" | "price" | "stock" | "createdAt";
type SortDir = "asc" | "desc";

function SortIcon({
  columnKey,
  sortKey,
  sortDir,
}: {
  columnKey: SortKey;
  sortKey: SortKey;
  sortDir: SortDir;
}) {
  if (sortKey !== columnKey)
    return <ArrowUpDown size={12} className="ml-1 opacity-40" />;
  return sortDir === "asc" ? (
    <ArrowUp size={12} className="ml-1" />
  ) : (
    <ArrowDown size={12} className="ml-1" />
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    name: string;
  } | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await client.api.products.$get();
        if (!res.ok) throw new Error("取得に失敗しました");
        setProducts(await res.json());
      } catch (e) {
        setError(e instanceof Error ? e.message : "エラーが発生しました");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sorted = [...products].sort((a, b) => {
    const av = a[sortKey] ?? "";
    const bv = b[sortKey] ?? "";
    const cmp = av < bv ? -1 : av > bv ? 1 : 0;
    return sortDir === "asc" ? cmp : -cmp;
  });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await client.api.products[":id"].$delete({
        param: { id: deleteTarget.id.toString() },
      });
      if (!res.ok) throw new Error("削除に失敗しました");
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setDeleteTarget(null);
    }
  };

  if (loading) {
    return (
      <>
        <Header title="商品管理" />
        <main className="flex flex-1 items-center justify-center">
          <Loader2 size={24} className="animate-spin text-muted-foreground" />
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header title="商品管理" />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-sm text-destructive">{error}</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Header title="商品管理" />
      <main className="flex-1 overflow-y-auto p-6">
        {/* ツールバー */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{products.length} 件</p>
          <Button size="sm" asChild>
            <Link href="/admin/products/new">
              <Plus size={14} className="mr-1.5" />
              商品を追加
            </Link>
          </Button>
        </div>

        {/* テーブル */}
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">画像</TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort("name")}
                    className="flex items-center text-xs font-medium hover:text-foreground"
                  >
                    商品名
                    <SortIcon
                      columnKey="name"
                      sortKey={sortKey}
                      sortDir={sortDir}
                    />
                  </button>
                </TableHead>
                <TableHead className="hidden md:table-cell">カテゴリ</TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort("price")}
                    className="flex items-center text-xs font-medium hover:text-foreground"
                  >
                    価格
                    <SortIcon
                      columnKey="price"
                      sortKey={sortKey}
                      sortDir={sortDir}
                    />
                  </button>
                </TableHead>
                <TableHead className="hidden lg:table-cell">
                  <button
                    onClick={() => handleSort("stock")}
                    className="flex items-center text-xs font-medium hover:text-foreground"
                  >
                    在庫
                    <SortIcon
                      columnKey="stock"
                      sortKey={sortKey}
                      sortDir={sortDir}
                    />
                  </button>
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  ステータス
                </TableHead>
                <TableHead className="hidden lg:table-cell">
                  <button
                    onClick={() => handleSort("createdAt")}
                    className="flex items-center text-xs font-medium hover:text-foreground"
                  >
                    作成日
                    <SortIcon
                      columnKey="createdAt"
                      sortKey={sortKey}
                      sortDir={sortDir}
                    />
                  </button>
                </TableHead>
                <TableHead className="w-20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((product) => {
                const image = product.images?.[0] ?? null;
                const createdAt = new Date(
                  product.createdAt,
                ).toLocaleDateString("ja-JP");

                return (
                  <TableRow key={product.id}>
                    {/* 画像 */}
                    <TableCell>
                      <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-muted">
                        {image ? (
                          <img
                            src={image.imageUrl}
                            alt={image.altText ?? product.name}
                            className="h-10 w-10 rounded-md object-cover"
                          />
                        ) : (
                          <ImageOff
                            size={14}
                            className="text-muted-foreground"
                          />
                        )}
                      </div>
                    </TableCell>

                    {/* 商品名 */}
                    <TableCell className="text-sm font-medium">
                      {product.name}
                      <div className="mt-0.5 flex items-center gap-2 md:hidden">
                        <span className="text-xs text-muted-foreground">
                          {product.category.name}
                        </span>
                        <Badge
                          variant={product.published ? "default" : "secondary"}
                          className="text-[10px]"
                        >
                          {product.published ? "公開" : "非公開"}
                        </Badge>
                      </div>
                    </TableCell>

                    {/* カテゴリ */}
                    <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                      {product.category.name}
                    </TableCell>

                    {/* 価格 */}
                    <TableCell className="text-sm">
                      {product.price != null
                        ? `¥${product.price.toLocaleString()}`
                        : "-"}
                    </TableCell>

                    {/* 在庫 */}
                    <TableCell className="hidden text-sm lg:table-cell">
                      <span
                        className={
                          product.stock === 0
                            ? "font-medium text-destructive"
                            : ""
                        }
                      >
                        {product.stock ?? "-"}
                      </span>
                    </TableCell>

                    {/* ステータス */}
                    <TableCell className="hidden md:table-cell">
                      <Badge
                        variant={product.published ? "default" : "secondary"}
                        className="text-[10px]"
                      >
                        {product.published ? "公開" : "非公開"}
                      </Badge>
                    </TableCell>

                    {/* 作成日 */}
                    <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
                      {createdAt}
                    </TableCell>

                    {/* アクション */}
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          asChild
                        >
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <Pencil size={14} />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() =>
                            setDeleteTarget({
                              id: product.id,
                              name: product.name,
                            })
                          }
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}

              {sorted.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-12 text-center text-sm text-muted-foreground"
                  >
                    商品がありません
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </main>

      {/* 削除確認ダイアログ */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>商品を削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              「{deleteTarget?.name}」を削除します。この操作は取り消せません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              削除する
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
