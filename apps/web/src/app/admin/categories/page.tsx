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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

type Category = InferResponseType<typeof client.api.categories.$get>[number];

type FormValues = { name: string; sortOrder: string };
const FORM_DEFAULT: FormValues = { name: "", sortOrder: "0" };

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    name: string;
  } | null>(null);

  // 追加・編集ダイアログ
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [formValues, setFormValues] = useState<FormValues>(FORM_DEFAULT);
  const [formErrors, setFormErrors] = useState<Partial<Record<string, string>>>(
    {},
  );
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await client.api.categories.$get();
      if (!res.ok) throw new Error("取得に失敗しました");
      setCategories(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreate = () => {
    setEditTarget(null);
    setFormValues(FORM_DEFAULT);
    setDialogOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditTarget(category);
    setFormValues({
      name: category.name,
      sortOrder: category.sortOrder.toString(),
    });
    setDialogOpen(true);
  };

  const setField = (key: keyof FormValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
    setFormErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!formValues.name.trim()) next.name = "カテゴリ名は必須です";
    if (isNaN(Number(formValues.sortOrder)))
      next.sortOrder = "数値を入力してください";
    setFormErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    const body = {
      name: formValues.name,
      sortOrder: Number(formValues.sortOrder),
    };
    try {
      if (editTarget) {
        const res = await client.api.categories[":id"].$patch({
          param: { id: editTarget.id.toString() },
          json: body,
        });
        if (!res.ok) throw new Error("更新に失敗しました");
      } else {
        const res = await client.api.categories.$post({ json: body });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(
            "error" in data && typeof data.error === "string"
              ? data.error
              : "登録に失敗しました",
          );
        }
      }
      await fetchCategories();
      setDialogOpen(false);
    } catch (e) {
      setFormErrors({
        submit: e instanceof Error ? e.message : "エラーが発生しました",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await client.api.categories[":id"].$delete({
        param: { id: deleteTarget.id.toString() },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(
          "error" in data && typeof data.error === "string"
            ? data.error
            : "削除に失敗しました",
        );
      }
      await fetchCategories();
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setDeleteTarget(null);
    }
  };

  if (loading) {
    return (
      <>
        <Header title="カテゴリ管理" />
        <main className="flex flex-1 items-center justify-center">
          <Loader2 size={24} className="animate-spin text-muted-foreground" />
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header title="カテゴリ管理" />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-sm text-destructive">{error}</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Header title="カテゴリ管理" />
      <main className="flex-1 overflow-y-auto p-6">
        {/* ツールバー */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {categories.length} 件
          </p>
          <Button size="sm" onClick={openCreate}>
            <Plus size={14} className="mr-1.5" />
            カテゴリを追加
          </Button>
        </div>

        {/* テーブル */}
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>カテゴリ名</TableHead>
                <TableHead className="hidden md:table-cell">商品数</TableHead>
                <TableHead>表示順</TableHead>
                <TableHead className="w-20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="text-sm font-medium">
                    {category.name}
                  </TableCell>
                  <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                    {category._count.products}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-[10px]">
                      {category.sortOrder}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEdit(category)}
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() =>
                          setDeleteTarget({
                            id: category.id,
                            name: category.name,
                          })
                        }
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {categories.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-12 text-center text-sm text-muted-foreground"
                  >
                    カテゴリがありません
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </main>

      {/* 追加・編集ダイアログ */}
      <AlertDialog
        open={dialogOpen}
        onOpenChange={(isOpen) => {
          setDialogOpen(isOpen);
          if (!isOpen) {
            setFormValues(FORM_DEFAULT);
            setFormErrors({});
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {editTarget ? "カテゴリを編集" : "カテゴリを追加"}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="c-name">カテゴリ名</Label>
              <Input
                id="c-name"
                value={formValues.name}
                onChange={(e) => setField("name", e.target.value)}
                className={formErrors.name ? "border-destructive" : ""}
              />
              {formErrors.name && (
                <p className="text-xs text-destructive">{formErrors.name}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-sort">表示順</Label>
              <Input
                id="c-sort"
                type="number"
                min={0}
                value={formValues.sortOrder}
                onChange={(e) => setField("sortOrder", e.target.value)}
                className={formErrors.sortOrder ? "border-destructive" : ""}
              />
              {formErrors.sortOrder && (
                <p className="text-xs text-destructive">
                  {formErrors.sortOrder}
                </p>
              )}
            </div>
            {formErrors.submit && (
              <p className="text-sm text-destructive">{formErrors.submit}</p>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>
              キャンセル
            </AlertDialogCancel>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting && (
                <Loader2 size={14} className="mr-1.5 animate-spin" />
              )}
              {editTarget ? "変更を保存する" : "追加する"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 削除確認ダイアログ */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>カテゴリを削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              「{deleteTarget?.name}
              」を削除します。商品が紐づいている場合は削除できません。
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
