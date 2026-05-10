# Development Notes

## Introduction

Honoインストール（apps/で実行）

```bash
bun create hono@latest api --template bun --install --pm bun
```

Next.jsインストール（apps/で実行）

```bash
bun create next-app@latest web
```

Prisma関連パッケージ追加（apps/api/で実行）

```bash
bun add prisma @types/pg --dev
bun add @prisma/client @prisma/adapter-pg pg dotenv
```

ESMとの互換性のために`tsconfig.json`と`package.json`を更新する

Node.js型定義を追加する（apps/api/で実行）
（tsconfigの警告解消。`types: ["node"]`を追加した時点で`@types/node`も必要になる）

```bash
bun add -d @types/node
```

Prisma Schema ファイルを生成する（apps/api/で実行）

```bash
bunx --bun prisma init \
  --datasource-provider postgresql \
  --output ../src/generated/prisma
```

- `--output <path>` は `prisma/schema.prisma` の `generator client` の `output` に記載される
- `output` は後から `schema.prisma` を直接編集して変更できる
- Prisma Client は `output` で指定したパスに生成される
- generated code を `src` 配下に置くと import を整理しやすい

`prisma.config.ts`の環境変数を`apps/api/.env`ではなくルートの`.env`から読み込むようにする

```ts
import dotenv from "dotenv";  // 追加
import { defineConfig, env } from "prisma/config";

dotenv.config({ path: "../../.env" }); // 追加

// ...
```

`prisma/schema.prisma`にモデルを定義する。

次に、スキーマに基づいてデータベーステーブルを設定するための最初のマイグレーションを作成。

```bash
bunx --bun prisma migrate dev --name init
```

以下のコマンドでPrisma Clientを作成する（outputに指定したパスに生成される）

```bash
bunx --bun prisma generate
```

次に、`apps/api/src/lib/prisma.ts`を作りPrisma Clientの共通化をする。

```txt
apps/api/
├── src/
│   ├── generated/
│   ├── lib/
│   │   └── prisma.ts // 追加
│   └── index.ts
```



## Docker

PostgreSQL コンテナを起動する。

```bash
docker compose up -d
```

コンテナを停止する。

```bash
docker compose down
```

volume を含めて削除する。

```bash
docker compose down -v
```

コンテナ一覧を確認する。

```bash
docker compose ps
```

DB コンテナのログを確認する。

```bash
docker compose logs -f db
```

PostgreSQL へ接続する。

```bash
docker compose exec db psql -U <POSTGRES_USER> -d <POSTGRES_DB>
```

DB コンテナへ入る。

```bash
docker compose exec db sh
```

## Prisma

Prisma Client を生成する。

```bash
bun prisma generate
```

マイグレーションを作成・適用する。

```bash
bun prisma migrate dev
```

マイグレーション名を指定して作成・適用する。

```bash
bun prisma migrate dev --name <migration_name>
```

DB をリセットする。

```bash
bun prisma migrate reset
```

Prisma Studio を起動する。

```bash
bun prisma studio
```

schema をフォーマットする。

```bash
bun prisma format
```

## Bun

依存パッケージをインストールする。

```bash
bun install
```

全 workspace の開発サーバを起動する。

```bash
bun run --filter '*' dev
```

特定 workspace の開発サーバを起動する。

```bash
bun --filter <workspace_name> dev
```

依存パッケージを追加する。

```bash
bun add <package_name>
```

開発依存として追加する。

```bash
bun add -d <package_name>
```

依存パッケージを更新する。

```bash
bun update
```
