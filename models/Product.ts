import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProductDocument extends Document {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number;
  salePrice?: number;
  category: Types.ObjectId;
  tags: string[];
  thumbnailUrl: string;
  screenshots: string[];
  demoUrl?: string;
  features: string[];
  fileKey: string;
  fileName: string;
  fileSize: number;
  status: "active" | "inactive";
  salesCount: number;
  rating: number;
  reviewsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProductDocument>(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
      maxlength: 150,
      index: true,
    },
    slug: {
      type: String,
      required: [true, "Product slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    shortDescription: {
      type: String,
      required: [true, "Short description is required"],
      maxlength: 300,
    },
    description: {
      type: String,
      required: [true, "Full description is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
      index: true,
    },
    salePrice: {
      type: Number,
      min: [0, "Sale price cannot be negative"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
      index: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    thumbnailUrl: {
      type: String,
      required: [true, "Thumbnail image URL is required"],
    },
    screenshots: {
      type: [String],
      default: [],
    },
    demoUrl: {
      type: String,
      default: "",
    },
    features: {
      type: [String],
      default: [],
    },
    fileKey: {
      type: String,
      required: [true, "Digital asset key is required"],
    },
    fileName: {
      type: String,
      required: [true, "Digital asset filename is required"],
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      index: true,
    },
    salesCount: {
      type: Number,
      default: 0,
      index: true,
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 1,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

ProductSchema.index({ title: "text", shortDescription: "text", tags: "text" });

export const Product = mongoose.models.Product || mongoose.model<IProductDocument>("Product", ProductSchema);
export default Product;
