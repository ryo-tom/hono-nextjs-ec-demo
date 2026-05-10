import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 10);

  const adminUser = await prisma.adminUser.upsert({
    where: {
      email: "admin@example.com",
    },
    update: {},
    create: {
      email: "admin@example.com",
      password: hashedPassword,
      name: "Admin User",
    },
  });

  const category = await prisma.category.upsert({
    where: {
      name: "Sample Category",
    },
    update: {},
    create: {
      name: "Sample Category",
      sortOrder: 1,
    },
  });

  const product = await prisma.product.create({
    data: {
      categoryId: category.id,
      name: "Sample Product",
      description: "This is a sample product description.",
      price: 1000,
      stock: 10,
      published: true,
      sortOrder: 1,
    },
  });

  await prisma.productImage.create({
    data: {
      productId: product.id,
      imageUrl: "/images/sample-product.jpg",
      altText: "Sample product image",
      sortOrder: 1,
    },
  });

  console.log("Seed completed");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
