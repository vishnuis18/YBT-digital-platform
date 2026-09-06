import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Payment from "@/models/Payment";
import { PaymentService } from "@/services/payment.service";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const reason = body.reason || "Customer requested refund";

    await connectDB();
    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.paymentStatus === "refunded") {
      return NextResponse.json({ error: "Order is already refunded" }, { status: 400 });
    }

    // Find payment record
    const payment = await Payment.findOne({ orderId: order._id });
    if (payment) {
      await PaymentService.processRefund(payment._id.toString(), reason);
    }

    order.paymentStatus = "refunded";
    await order.save();

    return NextResponse.json({ message: "Order refund processed successfully", order });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Forbidden" }, { status: 403 });
  }
}
