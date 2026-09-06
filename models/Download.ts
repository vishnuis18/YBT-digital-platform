import mongoose, { Schema, Document, Types } from "mongoose";

export interface IDownloadDocument extends Document {
  orderId: Types.ObjectId;
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  token: string;
  downloadCount: number;
  maxDownloads: number;
  expiresAt?: Date;
  lastDownloadedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const DownloadSchema = new Schema<IDownloadDocument>(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    maxDownloads: {
      type: Number,
      default: 10,
    },
    expiresAt: {
      type: Date,
    },
    lastDownloadedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const Download = mongoose.models.Download || mongoose.model<IDownloadDocument>("Download", DownloadSchema);
export default Download;
