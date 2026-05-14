# ADR 003: Zod スキーマの共有戦略

## Status

Accepted

## Date

2025-05-14

## Context

API バリデーションとフロントエンドのフォームバリデーションに同じスキーマを使いたい。共有方法として以下を検討した。

**Option A: API ルート内にスキーマを定義し、型のみ RPC で共有**
- Zod スキーマは `apps/api/src/routes/` 内に定義
- Web 側は `hono/client` の `InferRequestType` / `InferResponseType` で型を取得
- スキーマ実体は API 側のみ。Web では型推論のみ活用

**Option B: `packages/shared` を作り両アプリからインポート**
- モノレポに第3のワークスペース `packages/shared` を追加
- Zod スキーマをここに集約し、API・Web 両方が依存

**Option C: Web と API にスキーマをコピーして個別管理**
- 重複になるが依存関係がシンプル

現状のコードベースでは Zod は `apps/api` のみに依存しており、Web 側はフォームバリデーションに Zod を使っていない。

## Decision

**Option A（API ルート内でスキーマを定義し、Hono RPC の型推論を通じて共有）** を現時点の方針とする。

スキーマは各ルートファイルに `export` して、必要に応じて Web 側から型インポートできる状態を保つ：

```ts
// apps/api/src/routes/products.ts
export const productCreateSchema = z.object({
  name:        z.string().min(1, "商品名は必須です"),
  price:       z.number().int().min(0).optional(),
  category_id: z.number().int().positive("カテゴリを選択してください"),
  published:   z.boolean().default(false),
  // ...
});
```

Web 側では `InferRequestType` で API 入力型を取得するか、スキーマ自体を直接 import してフォームバリデーターに流す。

採用理由：

- **`packages/shared` は現時点でオーバーエンジニアリング**: 共有が必要なスキーマは商品・カテゴリ程度と少なく、ワークスペースを増やすコストに見合わない
- **Hono RPC でレスポンス型は既に解決済み**: レスポンスは `InferResponseType` で Web 側に流れており、リクエスト型の共有も同じ仕組みで対応できる
- **段階的な移行が可能**: 将来スキーマ共有が複雑化した時点で `packages/shared` に切り出せる。`export` を維持しておくことで移行コストを下げる

## Consequences

**メリット**
- Zod を `apps/web` に追加しなくていい（依存が増えない）
- API ルートとバリデーションが1ファイルにまとまり見通しが良い
- RPC 型推論と組み合わせることで型の二重管理が発生しない

**デメリット・トレードオフ**
- Web 側でスキーマ実体を使いたい場合（zodResolver との連携など）、API パッケージへの直接 import が必要になる
- `packages/shared` がないため、将来 API 以外のサービスを追加した際に共有が煩雑になる可能性がある
- スキーマをフロントで再利用するには Web 側にも `zod` を追加することになり、バンドルサイズへの影響を考慮する必要がある
