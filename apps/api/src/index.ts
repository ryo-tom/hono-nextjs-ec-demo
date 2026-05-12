import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { cors } from "hono/cors";
import adminUsers from "./routes/admin-users";
import categories from "./routes/categories";
import productImages from "./routes/product-images";
import products from "./routes/products";

const app = new Hono();
const apiApp = new Hono();

// Static file serving
app.use("/uploads/*", serveStatic({ root: "./public" }));

// Middleware
apiApp.use(cors({ origin: "http://localhost:3000" }));

// Routes
const apiRoutes = apiApp
  .route("/categories", categories)
  .route("/products", products)
  .route("/products/:productId/images", productImages)
  .route("/admin-users", adminUsers);

// Mount
const routes = app.route("/api", apiRoutes);

export type AppType = typeof routes;

export default {
  port: 3001,
  fetch: app.fetch,
};
