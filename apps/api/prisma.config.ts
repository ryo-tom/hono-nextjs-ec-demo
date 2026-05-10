import dotenv from "dotenv";
import { defineConfig, env } from "prisma/config";

// ルートの.envを読み込むため
dotenv.config({ path: "../../.env" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "bun prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
