import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { prisma } from "../lib/prisma";

// ── スキーマ定義 ──────────────────────────────────────
export const productCreateSchema = z.object({
  name:        z.string().min(1, "商品名は必須です"),
  description: z.string().optional(),
  price:       z.number().int().min(0).optional(),
  stock:       z.number().int().min(0).optional(),
  category_id: z.number().int().positive("カテゴリを選択してください"),
  published:   z.boolean().default(false),
});

export const productUpdateSchema = productCreateSchema.partial().extend({
  name: z.string().min(1, "商品名は必須です").optional(),
});

// ── ルート定義 ────────────────────────────────────────
const products = new Hono()

  // 一覧取得
  .get("/", async (c) => {
    const rows = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { id: true, name: true } },
        images:   { orderBy: { sortOrder: "asc" }, take: 1 },
      },
    });
    return c.json(rows);
  })

  // 1件取得
  .get("/:id", async (c) => {
    const id = Number(c.req.param("id"));
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, name: true } },
        images:   { orderBy: { sortOrder: "asc" } },
      },
    });
    if (!product) return c.json({ error: "Not found" }, 404);
    return c.json(product, 200);
  })

  // 登録
  .post("/", zValidator("json", productCreateSchema), async (c) => {
    const data = c.req.valid("json");
    const product = await prisma.product.create({
      data: {
        name:        data.name,
        description: data.description,
        price:       data.price,
        stock:       data.stock,
        published:   data.published,
        categoryId:  data.category_id,
      },
    });
    return c.json(product, 201);
  })

  // 更新
  .patch("/:id", zValidator("json", productUpdateSchema), async (c) => {
    const id   = Number(c.req.param("id"));
    const data = c.req.valid("json");
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(data.name        !== undefined && { name:        data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.price       !== undefined && { price:       data.price }),
        ...(data.stock       !== undefined && { stock:       data.stock }),
        ...(data.published   !== undefined && { published:   data.published }),
        ...(data.category_id !== undefined && { categoryId:  data.category_id }),
      },
    });
    return c.json(product);
  })

  // 削除
  .delete("/:id", async (c) => {
    const id = Number(c.req.param("id"));
    await prisma.product.delete({ where: { id } });
    return c.json({ success: true });
  });

export default products;
