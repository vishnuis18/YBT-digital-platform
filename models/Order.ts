import mongoose, { Schema, Document, Types } from "mongoose";

export interface IOrderItemDocument {
  product: Types.ObjectId;
  title: string;
  price: number;
  fileKey: string;
  fileName: string;
  fileSize: number;
}

export interface IOrderDocument extends Document {
  orderNumber: string;
  user: Types.ObjectId;
  items: IOrderItemDocument[];
  subtotal: number;
  taxAmount: number;
  taxRate: number;
  discountAmount: number;
  couponCode?: string;
  totalAmount: number;
  currency: string;
  paymentGateway: "razorpay" | "stripe" | "paypal" | "demo";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  transactionId?: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItemDocument>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    fileKey: { type: String, required: true },
    fileName: { type: String, required: true },
    fileSize: { type: Number, default: 0 },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrderDocument>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    items: {
      type: [OrderItemSchema],
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    taxAmount: {
      type: Number,
      default: 0,
    },
    taxRate: {
      type: Number,
      default: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    couponCode: {
      type: String,
      default: "",
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "USD",
    },
    paymentGateway: {
      type: String,
      enum: ["razorpay", "stripe", "paypal", "demo"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      index: true,
    },
    transactionId: {
      type: String,
      index: true,
    },
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    customerEmail: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.models.Order || mongoose.model<IOrderDocument>("Order", OrderSchema);
export default Order;
