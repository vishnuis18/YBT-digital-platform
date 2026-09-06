import connectDB from "@/lib/db";
import Download, { IDownloadDocument } from "@/models/Download";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { generateDownloadToken } from "@/lib/utils";
import { IDownload } from "@/types";

export class DownloadService {
  static async createDownloadTokensForOrder(orderId: string, userId: string): Promise<IDownload[]> {
    await connectDB();
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");

    const tokens: IDownload[] = [];

    for (const item of order.items) {
      const token = generateDownloadToken();
      // 30 days expiration
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      const downloadDoc = await Download.create({
        orderId: order._id,
        userId: userId,
        productId: item.product,
        token: token,
        downloadCount: 0,
        maxDownloads: 10,
        expiresAt: expiresAt,
      });

      const populated = await Download.findById(downloadDoc._id)
        .populate("productId", "title thumbnailUrl fileKey fileName fileSize")
        .populate("orderId", "orderNumber createdAt")
        .lean();

      tokens.push(JSON.parse(JSON.stringify(populated)));
    }

    return tokens;
  }

  static async getUserDownloads(userId: string): Promise<IDownload[]> {
    await connectDB();
    const downloads = await Download.find({ userId })
      .populate("productId", "title thumbnailUrl fileKey fileName fileSize slug")
      .populate("orderId", "orderNumber createdAt paymentStatus")
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(downloads));
  }

  static async verifyAndConsumeToken(token: string): Promise<{
    valid: boolean;
    downloadDoc?: any;
    fileKey?: string;
    fileName?: string;
    message: string;
  }> {
    await connectDB();
    const download = await Download.findOne({ token })
      .populate("productId")
      .populate("orderId");

    if (!download) {
      return { valid: false, message: "Invalid or expired download link" };
    }

    if (download.orderId && download.orderId.paymentStatus !== "paid") {
      return { valid: false, message: "Order payment has not been verified" };
    }

    if (download.expiresAt && new Date(download.expiresAt) < new Date()) {
      return { valid: false, message: "This download link has expired" };
    }

    if (download.downloadCount >= download.maxDownloads) {
      return { valid: false, message: "Download limit exceeded for this purchase" };
    }

    // Increment download count
    download.downloadCount += 1;
    download.lastDownloadedAt = new Date();
    await download.save();

    const product = download.productId;

    return {
      valid: true,
      downloadDoc: download,
      fileKey: product.fileKey,
      fileName: product.fileName,
      message: "Authorization successful",
    };
  }
}
