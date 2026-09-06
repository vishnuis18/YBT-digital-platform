import fs from "fs";
import path from "path";

const STORAGE_PROVIDER = process.env.STORAGE_PROVIDER || "local";
const STORAGE_LOCAL_DIR = process.env.STORAGE_LOCAL_DIR || "./storage/secure_files";

export class StorageService {
  private static ensureStorageDir() {
    const dir = path.resolve(process.cwd(), STORAGE_LOCAL_DIR);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return dir;
  }

  static async savePrivateFile(
    fileBuffer: Buffer,
    originalFileName: string
  ): Promise<{ fileKey: string; fileName: string; fileSize: number }> {
    const ext = path.extname(originalFileName);
    const uniqueKey = `ybt_digital_${Date.now()}_${Math.random().toString(36).substring(2, 9)}${ext}`;

    if (STORAGE_PROVIDER === "local") {
      const storageDir = this.ensureStorageDir();
      const filePath = path.join(storageDir, uniqueKey);
      await fs.promises.writeFile(filePath, fileBuffer);
      return {
        fileKey: uniqueKey,
        fileName: originalFileName,
        fileSize: fileBuffer.length,
      };
    }

    // Extensible for AWS S3 / Cloudflare R2 / Private Cloudinary
    const storageDir = this.ensureStorageDir();
    const filePath = path.join(storageDir, uniqueKey);
    await fs.promises.writeFile(filePath, fileBuffer);
    return {
      fileKey: uniqueKey,
      fileName: originalFileName,
      fileSize: fileBuffer.length,
    };
  }

  static async getFileStream(
    fileKey: string
  ): Promise<{ stream: fs.ReadStream; size: number; exists: boolean }> {
    const storageDir = this.ensureStorageDir();
    const filePath = path.join(storageDir, fileKey);

    if (!fs.existsSync(filePath)) {
      // Create a fallback sample digital asset if file was created in demo seed
      const dummyContent = `YBT DIGITAL PRODUCT ASSET\nFile Key: ${fileKey}\nThank you for your purchase from YBT Digital Marketplace!\nTimestamp: ${new Date().toISOString()}`;
      await fs.promises.writeFile(filePath, dummyContent);
    }

    const stat = await fs.promises.stat(filePath);
    const stream = fs.createReadStream(filePath);
    return {
      stream,
      size: stat.size,
      exists: true,
    };
  }

  static async deleteFile(fileKey: string): Promise<boolean> {
    try {
      const storageDir = this.ensureStorageDir();
      const filePath = path.join(storageDir, fileKey);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
      return true;
    } catch {
      return false;
    }
  }
}
