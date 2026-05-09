# 要件定義書

Hono + Next.js の学習用 EC サイトデモアプリ。  

## 1. プロジェクト概要

| 項目 | 内容 |
|---|---|
| アプリ名 | EC サイトデモアプリ |
| 目的 | Hono / Next.js の学習 |
| 対象ユーザー | 管理者（社内運用者） / 一般訪問者（購入者） |
| 認証 | 管理者のみ |
| 購入フロー | お問い合わせ型（カート・注文機能なし） |


## 2. 技術スタック
 
### Frontend
 
| 項目 | 選定理由 |
|---|---|
| Next.js | App Router / SSR による柔軟なレンダリング戦略。学習目的のメインフレームワーク |
| TypeScript | 型安全性の担保。Prisma・Hono との型連携が強力 |
| Tailwind CSS | ユーティリティファーストで高速なスタイリング |
| shadcn/ui | Tailwind ベースのコピーペーストUIコンポーネント。カスタマイズ性が高い |
 
### Backend
 
| 項目 | 選定理由 |
|---|---|
| Hono | Web Standards ベースの軽量APIフレームワーク。学習目的のメインフレームワーク |
| Prisma | 型安全なORM。PostgreSQL との相性が良くマイグレーション管理が容易 |
| PostgreSQL | 実績のあるRDB。BOOLEAN型など標準SQL準拠の型が使える |
| Zod | スキーマ定義とバリデーションを型安全に行える。Hono との親和性が高い |
 
### Runtime
 
| 項目 | 用途 |
|---|---|
| Node.js | Next.js の実行環境 |
| Bun | Hono の実行環境 |
 
### Infrastructure
 
| 項目 | 用途 |
|---|---|
| Docker | コンテナによる環境の再現性確保 |
| Docker Compose | PostgreSQL・API・Web を一括管理 |
 


## 3. 画面一覧

### 3-1. 一般訪問者向け（認証不要）

| 画面名 | パス | 説明 |
|---|---|---|
| ウェルカムページ | `/` | サイトの紹介・商品一覧への導線 |
| 商品一覧 | `/products` | 公開商品の一覧表示。カテゴリ絞り込み対応 |
| 商品詳細 | `/products/[id]` | 商品情報・画像・価格・在庫状況の表示 |

### 3-2. 管理者向け（要認証）

| 画面名 | パス | 説明 |
|---|---|---|
| ログイン | `/admin/login` | メールアドレス・パスワード認証 |
| ダッシュボード | `/admin` | 管理トップ（商品・カテゴリへのナビゲーション） |
| 商品一覧 | `/admin/products` | 商品の一覧・公開状態確認・削除 |
| 商品作成 | `/admin/products/new` | 商品の新規登録 |
| 商品編集 | `/admin/products/[id]/edit` | 商品情報の編集 |
| カテゴリ一覧 | `/admin/categories` | カテゴリの一覧・並び替え・削除 |
| カテゴリ作成 | `/admin/categories/new` | カテゴリの新規登録 |
| カテゴリ編集 | `/admin/categories/[id]/edit` | カテゴリ名・表示順の編集 |


## 4. 機能要件

### 4-1. 一般訪問者向け機能

#### ウェルカムページ
- サイトの説明・ブランドイメージの表示
- 商品一覧（`/products`）への導線ボタン・リンク

#### 商品一覧
- 公開中（`published = 1`）の商品のみ表示
- カテゴリによる絞り込み
- `sort_order` 昇順で表示
- 価格が NULL の商品は「お問い合わせ」と表示
- 在庫が NULL の商品は「在庫あり」、`0` の場合は「在庫なし」と表示

#### 商品詳細
- 商品名・説明・価格・在庫状況・画像（複数）を表示
- `sort_order` 順に画像を並べる

### 4-2. 管理者向け機能

#### 認証
- メールアドレス・パスワードでログイン
- パスワードはハッシュ化して保存（bcrypt）
- JWT or Cookie セッションでログイン状態を保持（学習用途のためどちらでも可）
- 未認証の場合は `/admin/login` へリダイレクト

#### 商品管理
- 商品の作成・編集・削除
- 公開 / 非公開の切り替え
- 画像の複数アップロード・並び替え・削除（保存先：ローカルファイルシステム）
- カテゴリの紐付け

#### カテゴリ管理
- カテゴリの作成・編集・削除
- 表示順（`sort_order`）の編集
- 商品が紐付いているカテゴリは削除不可（`ON DELETE RESTRICT`）


## 5. API 一覧

### 共通仕様
- エラーレスポンスは `{ error: string }` 形式で統一

### 一般向け API（認証不要）

| Method | Path | 説明 |
|---|---|---|
| GET | `/api/products` | 公開商品一覧取得（カテゴリ絞り込み対応） |
| GET | `/api/products/:id` | 商品詳細取得 |
| GET | `/api/categories` | カテゴリ一覧取得 |

### 管理者向け API（要認証）

| Method | Path | 説明 |
|---|---|---|
| POST | `/api/admin/auth/login` | ログイン |
| POST | `/api/admin/auth/logout` | ログアウト |
| GET | `/api/admin/products` | 商品一覧取得（非公開含む） |
| POST | `/api/admin/products` | 商品作成 |
| PUT | `/api/admin/products/:id` | 商品更新 |
| DELETE | `/api/admin/products/:id` | 商品削除 |
| POST | `/api/admin/products/:id/images` | 商品画像アップロード |
| DELETE | `/api/admin/products/:id/images/:imageId` | 商品画像削除 |
| GET | `/api/admin/categories` | カテゴリ一覧取得 |
| POST | `/api/admin/categories` | カテゴリ作成 |
| PUT | `/api/admin/categories/:id` | カテゴリ更新 |
| DELETE | `/api/admin/categories/:id` | カテゴリ削除 |


## 6. 非機能要件

| 項目 | 内容 |
|---|---|
| セキュリティ | 管理者パスワードは bcrypt でハッシュ化して保存 |
| セキュリティ | 未認証リクエストは `/admin/login` へリダイレクト |
| 保守性 | API・Web はモノレポで管理し、独立して起動・開発できること |
| 環境構築 | `docker compose up` 1コマンドで開発環境が起動できること |


## 7. データベース設計

詳細は [table-design.md](./table-design.md) を参照。

### テーブル一覧

| テーブル名 | 説明 |
|---|---|
| admin_users | 管理者アカウント |
| categories | 商品カテゴリ |
| products | 商品 |
| product_images | 商品画像 |


## 8. 対象外（スコープ外）

- 購入者アカウント管理
- カート機能
- 注文・決済機能
- 注文履歴
- メール送信
- 在庫の自動減算
- 管理者の権限区分（ロール）
