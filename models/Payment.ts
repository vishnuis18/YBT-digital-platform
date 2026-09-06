import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPaymentDocument extends Document {
  orderId: Types.ObjectId;
  gateway: "razorpay" | "stripe" | "paypal" | "demo";
  transactionId: string;
  amount: number;
  currency: string;
  status: "pending" | "paid" | "failed" | "refunded";
  rawResponse?: Record<string, unknown>;
  refundDetails?: {
    refundId?: string;
    amount?: number;
    reason?: string;
    refundedAt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPaymentDocument>(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },
    gateway: {
      type: String,
      enum: ["razorpay", "stripe", "paypal", "demo"],
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "USD",
    },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      index: true,
    },
    rawResponse: {
      type: Schema.Types.Mixed,
      default: {},
    },
    refundDetails: {
      refundId: String,
      amount: Number,
      reason: String,
      refundedAt: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const Payment = mongoose.models.Payment || mongoose.model<IPaymentDocument>("Payment", PaymentSchema);
export default Payment;
