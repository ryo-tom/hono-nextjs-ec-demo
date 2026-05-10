import { Hono } from "hono";
import { prisma } from "./lib/prisma";

const app = new Hono();

app.get("/", async (c) => {
  const categories = await prisma.category.findMany();

  return c.json(categories);
});

export default app;
