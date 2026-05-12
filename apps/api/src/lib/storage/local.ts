import { unlink, writeFile } from "fs/promises";
import { join } from "path";
import type { StorageProvider } from "./index";

const UPLOAD_DIR = join(process.cwd(), "public", "uploads");
const BASE_URL = process.env.API_BASE_URL ?? "http://localhost:3001";

// TODO: Cloudflare R2 に移行する場合は r2.ts を作成し以下を参考に実装
// import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
// const r2 = new S3Client({
//   region: "auto",
//   endpoint: process.env.R2_ENDPOINT,
//   credentials: {
//     accessKeyId: process.env.R2_ACCESS_KEY_ID!,
//     secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
//   },
// });

export const localStorageProvider: StorageProvider = {
  async upload(file: File, filename: string): Promise<string> {
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(join(UPLOAD_DIR, filename), buffer);
    return `${BASE_URL}/uploads/${filename}`;
  },

  async delete(url: string): Promise<void> {
    const filename = url.split("/uploads/").pop();
    if (!filename) return;
    try {
      await unlink(join(UPLOAD_DIR, filename));
    } catch {
      // ファイルが存在しない場合は無視
    }
  },
};
