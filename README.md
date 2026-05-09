# hono-nextjs-ec-demo

Hono + Next.js の学習を目的とした、お問い合わせ型ECサイトのデモアプリです。

Next.js App Router を用いたフロントエンド開発と、Hono + Prisma + PostgreSQL を用いた REST API 開発の体験。

## ✨ Features

一般訪問者:

- 商品一覧の閲覧（カテゴリ絞り込み対応）
- 商品詳細の閲覧

管理者（ログイン）:

- 商品の作成・編集・削除・公開管理
- 商品画像のアップロード・並び替え・削除
- カテゴリの作成・編集・削除

## 🏗 Tech Stack

### Frontend

- React 19
- Next.js 16.2.x（App Router）
- TypeScript 5.x
- Tailwind CSS 4.x
- shadcn/ui

### Backend

- Hono 4.x（REST API）
- Prisma 7.x（ORM）
- PostgreSQL 16
- Zod 4.x

### Runtime

- Node.js 24.x
- Bun 1.3.x

### Infrastructure

- Docker
- Docker Compose

## 📁 Directory Structure

```txt
/
├── apps/
│   ├── api/          # Hono（REST API）
│   └── web/          # Next.js（EC サイト + 管理画面）
├── .env.example
├── .gitignore
├── docker-compose.yml
├── package.json
└── README.md
```

## 📦 Prerequisites

以下をインストールしてください。

- Node.js 24.x
- Bun 1.3.x
- Docker
- Docker Compose

## 🚀 Getting Started

リポジトリを clone します。

依存パッケージをインストールします。

```bash
bun install
```

`.env.example` をコピーして `.env` を作成します。

```bash
cp .env.example .env
```

PostgreSQL コンテナを起動します。

```bash
docker compose up -d
```

Prisma マイグレーションを実行します。

```bash
cd apps/api

bun prisma migrate dev
```

開発サーバを起動します。

```bash
bun run --filter '*' dev
```

## 🌐 Local Development

開発サーバ起動後、以下URLへアクセスできます。

- Frontend: <http://localhost:3000>
- Backend API: <http://localhost:3001>

## 📝 Future Plans

- 認証機能
- 問い合わせ機能
- 画像アップロード機能
- ページネーション
- SEO 最適化
- OpenAPI 対応
- テスト導入

