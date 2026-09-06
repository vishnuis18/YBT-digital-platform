import connectDB from "@/lib/db";
import Payment, { IPaymentDocument } from "@/models/Payment";
import { SettingsService } from "./settings.service";
import crypto from "crypto";
import { IPayment, PaymentGatewayType } from "@/types";

export class PaymentService {
  static async createPaymentRecord(data: {
    orderId: string;
    gateway: PaymentGatewayType;
    transactionId: string;
    amount: number;
    currency: string;
    status: "pending" | "paid" | "failed" | "refunded";
    rawResponse?: any;
  }): Promise<IPayment> {
    await connectDB();
    const payment = await Payment.create(data);
    return JSON.parse(JSON.stringify(payment));
  }

  static async verifyRazorpaySignature(
    orderId: string,
    paymentId: string,
    signature: string
  ): Promise<boolean> {
    const settings = await SettingsService.getSettings();
    const secret = settings.payment.razorpay.keySecret || process.env.RAZORPAY_KEY_SECRET || "";
    if (!secret) return false;

    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    return generatedSignature === signature;
  }

  static async processDemoPayment(orderId: string, totalAmount: number): Promise<{
    success: boolean;
    transactionId: string;
  }> {
    const transactionId = `DEMO_TXN_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
    return {
      success: true,
      transactionId,
    };
  }

  static async processRefund(paymentId: string, reason: string): Promise<{ success: boolean; message: string }> {
    await connectDB();
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return { success: false, message: "Payment record not found" };
    }

    if (payment.status === "refunded") {
      return { success: false, message: "Payment already refunded" };
    }

    // Mark as refunded
    payment.status = "refunded";
    payment.refundDetails = {
      refundId: `REF_${Date.now()}`,
      amount: payment.amount,
      reason,
      refundedAt: new Date(),
    };
    await payment.save();

    return { success: true, message: "Refund processed successfully" };
  }
}
