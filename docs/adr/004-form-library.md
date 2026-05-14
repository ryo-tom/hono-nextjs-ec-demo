# ADR 004: フォームライブラリとして react-hook-form を採用

## Status

Accepted

## Date

2025-05-14

## Context

管理画面の商品・カテゴリフォームを実装するにあたり、フォーム状態管理ライブラリを選定する必要があった。

比較対象：

| ライブラリ | アプローチ | バンドルサイズ | Zod 連携 |
|---|---|---|---|
| **react-hook-form** | 非制御コンポーネント（ref ベース） | ~9 KB | `@hookform/resolvers` 経由 |
| **Formik** | 制御コンポーネント（state ベース） | ~15 KB | `yup` が主流、Zod は非公式 |
| **TanStack Form** | ヘッドレス・型ファーストな新世代 | ~8 KB | ネイティブ対応（v0.x 段階） |
| **素の useState** | 制御コンポーネント（手実装） | 0 KB | 自前実装 |

プロジェクトの要件として、商品フォームは入力項目が多く（名前・説明・価格・在庫・カテゴリ・公開フラグ・画像）、バリデーションエラー表示・送信中のローディング状態管理が必要。

## Decision

**react-hook-form** を採用する（`@hookform/resolvers` と合わせて導入）。

```ts
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productCreateSchema } from "api/src/routes/products"; // API スキーマを再利用
```

採用理由：

- **非制御コンポーネントによる再レンダリング抑制**: フォーム入力のたびに React ステートが更新されない設計のため、入力フィールドが多い商品フォームでもパフォーマンスへの影響が小さい
- **Zod との親和性**: `@hookform/resolvers/zod` で API 側の Zod スキーマをそのままバリデーターとして流用できる。スキーマの二重定義が不要
- **エコシステムの成熟度**: shadcn/ui の Form コンポーネントが react-hook-form をベースに設計されており、既存 UI コンポーネントとの統合がスムーズ
- **型安全なフォーム値**: `useForm<z.infer<typeof schema>>` でフォーム全体の型を1行で宣言できる

## Consequences

**メリット**
- `formState.errors` でフィールドごとのエラーを宣言的に表示できる
- `formState.isSubmitting` で送信中のローディング状態を自動管理できる
- `register` / `Controller` の使い分けで、ネイティブ input と shadcn コンポーネントの両方に対応
- Zod スキーマ変更が自動でフォームバリデーションに反映される

**デメリット・トレードオフ**
- `useController` / `Controller` の概念を把握するまで学習コストがかかる
- TanStack Form と比較すると型安全性がやや劣る場面がある（特に動的フィールド）
- Formik のように Provider ベースではないため、深くネストしたコンポーネントからフォームコンテキストを参照する場合は `useFormContext` を別途使う必要がある
