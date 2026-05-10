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

ESMとの互換性のために`tsconfig.json`を更新

Node.js型定義を追加する
（tsconfigの警告解消。`types: ["node"]`を追加した時点で`@types/node`も必要になる）

```bash
bun add -d @types/node
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
