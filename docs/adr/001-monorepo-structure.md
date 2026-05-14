# ADR 001: モノレポ構成の採用

## Status

Accepted

## Date

2025-05-14

## Context

Hono（APIサーバー）と Next.js（Web フロントエンド）を同一プロジェクトとして管理する際、リポジトリをどう構成するかを決定する必要があった。

主な選択肢は以下の2つ：

**Option A: 単一リポジトリ（シングルレポ）**
- `api/` と `web/` をフラットに配置
- 共通の `package.json` に全依存を列挙
- ワークスペース機能なし

**Option B: モノレポ（Bun Workspaces）**
- `apps/api/`・`apps/web/` を独立したワークスペースとして管理
- ルートの `package.json` で `"workspaces": ["apps/*"]` を宣言
- 各アプリが独自の `package.json` と依存関係を持つ

プロジェクトの要件として「API と Web は独立して起動・開発できること」（[requirements.md](../requirements.md) §6）が定められており、ランタイムも Bun（API）と Node.js（Web）で異なる。

## Decision

**Option B（Bun Workspaces によるモノレポ）** を採用する。

ディレクトリ構成：

```
hono-nextjs-ec-demo/
├── apps/
│   ├── api/          # Hono + Bun
│   └── web/          # Next.js + Node.js
├── docs/
├── docker-compose.yml
└── package.json      # workspaces: ["apps/*"]
```

採用理由：

- **独立したランタイム管理**: API は Bun、Web は Node.js と実行環境が異なるため、各アプリの `package.json` で依存を分離できるモノレポが適切
- **型共有の実現**: Hono RPC の型（`AppType`）を `apps/api/src/index.ts` からインポートする際、モノレポ構成であれば相対パスで直接参照できる（`../../../api/src/index`）
- **単一コマンド起動**: `bun run --filter '*' dev` で全ワークスペースを一括起動できる
- **依存の明確な分離**: `react-hook-form` など UI 固有のパッケージが API に混入するリスクを抑えやすい

## Consequences

**メリット**
- API・Web それぞれを独立して `bun --filter <name> dev` で起動できる
- docker-compose でサービスを分けることで、本番構成を意識した開発ができる
- 型共有のためのパッケージ公開や複雑なシンボリックリンクが不要

**デメリット・トレードオフ**
- Bun Workspaces の挙動を把握していないと依存解決で混乱することがある（特に各アプリの `node_modules` の扱い）
- モノレポ専用のツール（Turborepo、Nx 等）は導入していないため、タスクのキャッシュや並列実行の恩恵は受けていない
- `apps/api/src/index.ts` への直接相対パス参照は、将来的にパスが変わると Web 側の import が壊れる
