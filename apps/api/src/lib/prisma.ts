import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
import { PrismaClient } from "../generated/prisma/client";

// ルートの.envを読み込む
dotenv.config({ path: "../../.env" });

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

export { prisma };
