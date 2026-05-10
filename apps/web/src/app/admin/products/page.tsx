"use client";

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
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ImageOff,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Header } from "../_components/header";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  published: boolean;
  created_at: string;
  image_url: string | null;
};

type SortKey = keyof Pick<Product, "name" | "price" | "stock" | "created_at">;
type SortDir = "asc" | "desc";

const DUMMY: Product[] = [
  {
    id: 1,
    name: "サンプル商品 α",
    category: "カテゴリA",
    price: 12800,
    stock: 42,
    published: true,
    created_at: "2025-04-01",
    image_url: null,
  },
  {
    id: 2,
    name: "サンプル商品 β",
    category: "カテゴリB",
    price: 5400,
    stock: 8,
    published: true,
    created_at: "2025-04-05",
    image_url: null,
  },
  {
    id: 3,
    name: "サンプル商品 γ",
    category: "カテゴリA",
    price: 32000,
    stock: 0,
    published: false,
    created_at: "2025-04-10",
    image_url: null,
  },
  {
    id: 4,
    name: "サンプル商品 δ",
    category: "カテゴリC",
    price: 9800,
    stock: 15,
    published: true,
    created_at: "2025-04-18",
    image_url: null,
  },
  {
    id: 5,
    name: "サンプル商品 ε",
    category: "カテゴリD",
    price: 2200,
    stock: 99,
    published: false,
    created_at: "2025-04-22",
    image_url: null,
  },
];

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
  const [products, setProducts] = useState<Product[]>(DUMMY);
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sorted = [...products].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    const cmp = av < bv ? -1 : av > bv ? 1 : 0;
    return sortDir === "asc" ? cmp : -cmp;
  });

  const handleDelete = () => {
    if (!deleteTarget) return;
    setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

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
                    onClick={() => handleSort("created_at")}
                    className="flex items-center text-xs font-medium hover:text-foreground"
                  >
                    作成日
                    <SortIcon
                      columnKey="created_at"
                      sortKey={sortKey}
                      sortDir={sortDir}
                    />
                  </button>
                </TableHead>
                <TableHead className="w-20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((product) => (
                <TableRow key={product.id}>
                  {/* 画像 */}
                  <TableCell>
                    <div className="h-10 w-10 rounded-md border bg-muted flex items-center justify-center">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="h-10 w-10 rounded-md object-cover"
                        />
                      ) : (
                        <ImageOff size={14} className="text-muted-foreground" />
                      )}
                    </div>
                  </TableCell>

                  {/* 商品名 */}
                  <TableCell className="font-medium text-sm">
                    {product.name}
                    {/* モバイルでカテゴリ・ステータスを補完 */}
                    <div className="mt-0.5 flex items-center gap-2 md:hidden">
                      <span className="text-xs text-muted-foreground">
                        {product.category}
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
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {product.category}
                  </TableCell>

                  {/* 価格 */}
                  <TableCell className="text-sm">
                    ¥{product.price.toLocaleString()}
                  </TableCell>

                  {/* 在庫 */}
                  <TableCell className="hidden lg:table-cell text-sm">
                    <span
                      className={
                        product.stock === 0
                          ? "text-destructive font-medium"
                          : ""
                      }
                    >
                      {product.stock}
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
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                    {product.created_at}
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
                        onClick={() => setDeleteTarget(product)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

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
