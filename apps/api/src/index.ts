import { Hono } from "hono";
import { cors } from "hono/cors";
import { prisma } from "./lib/prisma";
import adminUsers from "./routes/admin-users";
import products from "./routes/products";

const app = new Hono().basePath("/api");

app.use(cors({ origin: "http://localhost:3000" }));

// 既存ルート
app.get("/", async (c) => {
  const categories = await prisma.category.findMany();
  return c.json(categories);
});

// 商品ルート
const routes = app
  .get("/categories", async (c) => {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return c.json(categories);
  })
  .route("/products", products)
  .route("/admin-users", adminUsers);


// RPC用に型をエクスポート
export type AppType = typeof routes;

export default {
  port: 3001,
  fetch: app.fetch,
};
