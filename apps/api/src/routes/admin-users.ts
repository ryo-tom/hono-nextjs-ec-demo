import { zValidator } from "@hono/zod-validator";
import bcrypt from "bcryptjs";
import { Hono } from "hono";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export const adminUserCreateSchema = z.object({
  email: z.email({ message: "正しいメールアドレスを入力してください" }),
  password: z.string().min(8, "パスワードは8文字以上で入力してください"),
  name: z.string().min(1, "名前は必須です"),
});

const adminUsers = new Hono()

  // 一覧取得
  .get("/", async (c) => {
    const users = await prisma.adminUser.findMany({
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return c.json(users, 200);
  })

  // 登録
  .post("/", zValidator("json", adminUserCreateSchema), async (c) => {
    const { email, password, name } = c.req.valid("json");

    const exists = await prisma.adminUser.findUnique({ where: { email } });
    if (exists) {
      return c.json({ error: "このメールアドレスは既に使用されています" }, 409);
    }

    const hashed = await bcrypt.hash(password, 12);

    const user = await prisma.adminUser.create({
      data: { email, password: hashed, name },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return c.json(user, 201);
  })

  // 削除
  .delete("/:id", async (c) => {
    const id = Number(c.req.param("id"));

    const count = await prisma.adminUser.count();
    if (count <= 1) {
      return c.json({ error: "最後の管理者は削除できません" }, 400);
    }

    await prisma.adminUser.delete({ where: { id } });
    return c.json({ success: true }, 200);
  });

export default adminUsers;
