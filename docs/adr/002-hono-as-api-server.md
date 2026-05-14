# ADR 002: Hono を独立した API サーバーとして運用する

## Status

Accepted

## Date

2025-05-14

## Context

Next.js アプリケーションに API を持たせる方法として、主に2つのアプローチがある。

**Option A: Next.js API Routes に同居**
- `apps/web/app/api/` に Route Handlers を定義
- Next.js サーバーが Web と API を一体で処理
- 追加サーバー不要・デプロイが単純

**Option B: Hono を独立サーバーとして分離**
- `apps/api/` に Hono サーバーを立て、ポート 3001 で待ち受け
- Next.js（ポート 3000）とは別プロセスで稼働
- Bun ランタイムで Hono を実行

本プロジェクトは「Hono / Next.js の学習」が主目的（[requirements.md](../requirements.md) §1）であり、Hono の機能を本格的に使う場面を確保したい。

## Decision

**Option B（Hono を独立 API サーバーとして分離）** を採用する。

- Hono サーバーは `apps/api/` に配置し、Bun で起動（ポート 3001）
- Next.js は `apps/web/` に配置し、Node.js で起動（ポート 3000）
- Web → API 通信は Hono RPC クライアント（`hono/client`）を利用

```ts
// apps/web/src/lib/api-client.ts
import { hc } from "hono/client";
import type { AppType } from "../../../api/src/index";

export const client = hc<AppType>(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001");
```

採用理由：

- **Hono RPC による End-to-End 型安全**: `AppType` を Web 側でインポートすることで、API レスポンスの型を手書きせずに保てる。Next.js API Routes では同等の仕組みを自前で構築する必要がある
- **ランタイム特性の活用**: Hono + Bun の組み合わせは起動が速く、Bun ネイティブの機能（ホットリロード `--hot`）をそのまま使える
- **関心の分離**: データアクセス（Prisma）・バリデーション（Zod）・ビジネスロジックを Web 層から完全に切り離せる
- **学習目的との整合**: Hono のルーティング・ミドルウェア・バリデーター等の機能を独立したサーバーとして本格的に触れる

## Consequences

**メリット**
- `InferResponseType` / `InferRequestType` で API 型が自動導出され、型のズレによるバグを防げる
- API サーバーを将来別ランタイム（Cloudflare Workers 等）に移しやすい
- CORS 設定（現在 `http://localhost:3000` を許可）によりアクセス制御が明確

**デメリット・トレードオフ**
- 開発時に2プロセス（Bun + Node.js）を同時に起動する必要がある
- CORS 設定が必要で、環境ごとにオリジンを変える運用が発生する
- Next.js の Server Actions・Route Handlers では得られる SSR との緊密な統合が犠牲になる
- `apps/api/src/index.ts` の型を Web 側が直接インポートするため、API のビルド状態に依存する場面がある
