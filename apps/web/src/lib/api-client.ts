import { hc } from "hono/client";
import type { AppType } from "../../../api/src/index";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export const client = hc<AppType>(API_BASE);
