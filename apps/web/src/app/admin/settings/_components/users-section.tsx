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
import { Loader2, Plus, Trash2, UserRound } from "lucide-react";
import { useEffect, useState } from "react";

type User = InferResponseType<
  (typeof client.api)["admin-users"]["$get"]
>[number];

export function UsersSection() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    name: string;
  } | null>(null);

  // 新規ユーザーフォーム
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<string, string>>>(
    {},
  );

  useEffect(() => {
    const load = async () => {
      try {
        const res = await client.api["admin-users"].$get();
        if (!res.ok) throw new Error("取得に失敗しました");
        setUsers(await res.json());
      } catch (e) {
        setError(e instanceof Error ? e.message : "エラーが発生しました");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const setField = (key: keyof typeof formValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
    setFormErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!formValues.name.trim()) next.name = "名前は必須です";
    if (!formValues.email.trim()) next.email = "メールアドレスは必須です";
    if (formValues.password.length < 8)
      next.password = "パスワードは8文字以上で入力してください";
    setFormErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleCreate = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await client.api["admin-users"].$post({
        json: formValues,
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(
          "error" in data && typeof data.error === "string"
            ? data.error
            : "登録に失敗しました",
        );
      }
      const created = await res.json();
      setUsers((prev) => [...prev, created]);
      setOpen(false);
      setFormValues({ name: "", email: "", password: "" });
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
      const res = await client.api["admin-users"][":id"].$delete({
        param: { id: deleteTarget.id.toString() },
      });
      if (!res.ok) throw new Error("削除に失敗しました");
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setDeleteTarget(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={24} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  return (
    <div className="space-y-4">
      {/* ツールバー */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{users.length} 名</p>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus size={14} className="mr-1.5" />
          管理者を追加
        </Button>
      </div>

      {/* ユーザーテーブル */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>名前</TableHead>
              <TableHead className="hidden md:table-cell">
                メールアドレス
              </TableHead>
              <TableHead className="hidden lg:table-cell">作成日</TableHead>
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted">
                      <UserRound size={14} className="text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground md:hidden">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                  {user.email}
                </TableCell>
                <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
                  {new Date(user.createdAt).toLocaleDateString("ja-JP")}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() =>
                        setDeleteTarget({ id: user.id, name: user.name })
                      }
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {users.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-12 text-center text-sm text-muted-foreground"
                >
                  管理者が登録されていません
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 追加ダイアログ */}
      <AlertDialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) {
            setFormValues({ name: "", email: "", password: "" });
            setFormErrors({});
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>管理者を追加</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="u-name">名前</Label>
              <Input
                id="u-name"
                value={formValues.name}
                onChange={(e) => setField("name", e.target.value)}
                className={formErrors.name ? "border-destructive" : ""}
              />
              {formErrors.name && (
                <p className="text-xs text-destructive">{formErrors.name}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="u-email">メールアドレス</Label>
              <Input
                id="u-email"
                type="email"
                value={formValues.email}
                onChange={(e) => setField("email", e.target.value)}
                className={formErrors.email ? "border-destructive" : ""}
              />
              {formErrors.email && (
                <p className="text-xs text-destructive">{formErrors.email}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="u-password">パスワード</Label>
              <Input
                id="u-password"
                type="password"
                value={formValues.password}
                onChange={(e) => setField("password", e.target.value)}
                className={formErrors.password ? "border-destructive" : ""}
              />
              {formErrors.password && (
                <p className="text-xs text-destructive">
                  {formErrors.password}
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
            <Button onClick={handleCreate} disabled={submitting}>
              {submitting && (
                <Loader2 size={14} className="mr-1.5 animate-spin" />
              )}
              追加する
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
            <AlertDialogTitle>管理者を削除しますか？</AlertDialogTitle>
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
    </div>
  );
}
