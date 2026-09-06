import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { OrderService } from "@/services/order.service";
import { PaymentService } from "@/services/payment.service";

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { orderId, paymentGateway, razorpayPaymentId, razorpayOrderId, razorpaySignature, stripePaymentIntentId, paypalOrderId } = body;

    const order = await OrderService.getOrderById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    let isVerified = false;
    let transactionId = "";

    if (paymentGateway === "demo") {
      const demoRes = await PaymentService.processDemoPayment(orderId, order.totalAmount);
      isVerified = demoRes.success;
      transactionId = demoRes.transactionId;
    } else if (paymentGateway === "razorpay") {
      if (razorpayPaymentId && razorpayOrderId && razorpaySignature) {
        isVerified = await PaymentService.verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
        transactionId = razorpayPaymentId;
      }
    } else if (paymentGateway === "stripe") {
      if (stripePaymentIntentId) {
        isVerified = true;
        transactionId = stripePaymentIntentId;
      }
    } else if (paymentGateway === "paypal") {
      if (paypalOrderId) {
        isVerified = true;
        transactionId = paypalOrderId;
      }
    }

    if (!isVerified) {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    // 1. Record payment
    await PaymentService.createPaymentRecord({
      orderId: order._id,
      gateway: paymentGateway,
      transactionId,
      amount: order.totalAmount,
      currency: order.currency,
      status: "paid",
      rawResponse: body,
    });

    // 2. Mark order as paid & auto-generate digital download tokens
    const updatedOrder = await OrderService.markOrderPaid(order._id, transactionId);

    return NextResponse.json({
      success: true,
      message: "Payment successfully verified and order completed!",
      order: updatedOrder,
    });
  } catch (error: any) {
    console.error("Payment verification error:", error);
    return NextResponse.json({ error: error.message || "Failed to process payment" }, { status: 500 });
  }
}
