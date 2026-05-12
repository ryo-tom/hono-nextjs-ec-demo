// TODO: Cloudflare R2 または AWS S3 に移行する場合は
//       StorageProvider を実装した r2.ts / s3.ts を作成し
//       このファイルの export を差し替えるだけで移行できます

export interface StorageProvider {
  upload(file: File, filename: string): Promise<string>; // 保存先URLを返す
  delete(url: string): Promise<void>;
}

export { localStorageProvider as storageProvider } from "./local";
// TODO: R2に切り替える場合は上記を以下に変更
// export { r2StorageProvider as storageProvider } from "./r2";
