import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const categorySchema = z.object({
  name: z.string().min(1, { message: "カテゴリ名は必須です" }),
  sortOrder: z.number().int().min(0).default(0),
});

const categories = new Hono()

  // 一覧取得
  .get("/", async (c) => {
    const rows = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
    return c.json(rows, 200);
  })

  // 登録
  .post("/", zValidator("json", categorySchema), async (c) => {
    const data = c.req.valid("json");
    const exists = await prisma.category.findUnique({
      where: { name: data.name },
    });
    if (exists)
      return c.json({ error: "このカテゴリ名は既に使用されています" }, 409);
    const category = await prisma.category.create({ data });
    return c.json(category, 201);
  })

  // 更新
  .patch("/:id", zValidator("json", categorySchema.partial()), async (c) => {
    const id = Number(c.req.param("id"));
    const data = c.req.valid("json");
    const category = await prisma.category.update({ where: { id }, data });
    return c.json(category, 200);
  })

  // 削除
  .delete("/:id", async (c) => {
    const id = Number(c.req.param("id"));
    const count = await prisma.product.count({ where: { categoryId: id } });
    if (count > 0)
      return c.json({ error: "商品が紐づいているため削除できません" }, 409);
    await prisma.category.delete({ where: { id } });
    return c.json({ success: true }, 200);
  });

export default categories;
