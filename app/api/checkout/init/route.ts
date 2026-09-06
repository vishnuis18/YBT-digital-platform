import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { OrderService } from "@/services/order.service";
import { SettingsService } from "@/services/settings.service";
import Razorpay from "razorpay";
import Stripe from "stripe";

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session) {
      return NextResponse.json({ error: "Authentication required to checkout" }, { status: 401 });
    }

    const body = await request.json();
    const { items, paymentGateway, couponCode, notes } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    const settings = await SettingsService.getSettings();

    // 1. Create order server-side with verified calculations
    const order = await OrderService.createOrder({
      userId: session.id,
      items: items.map((i: any) => ({ productId: i.product._id || i.product, quantity: 1 })),
      paymentGateway,
      couponCode,
      notes,
    });

    let gatewayData: any = {};

    // 2. Gateway-specific initialization
    if (paymentGateway === "razorpay" && settings.payment.razorpay.keyId && settings.payment.razorpay.keySecret) {
      try {
        const instance = new Razorpay({
          key_id: settings.payment.razorpay.keyId,
          key_secret: settings.payment.razorpay.keySecret,
        });
        const rzpOrder = await instance.orders.create({
          amount: Math.round(order.totalAmount * 100), // in paise / cents
          currency: order.currency === "INR" ? "INR" : "USD",
          receipt: order.orderNumber,
        });
        gatewayData = {
          razorpayOrderId: rzpOrder.id,
          keyId: settings.payment.razorpay.keyId,
        };
      } catch (err: any) {
        console.warn("Razorpay init error:", err.message);
      }
    } else if (paymentGateway === "stripe" && settings.payment.stripe.secretKey) {
      try {
        const stripe = new Stripe(settings.payment.stripe.secretKey);
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(order.totalAmount * 100),
          currency: order.currency.toLowerCase(),
          metadata: { orderId: order._id.toString(), orderNumber: order.orderNumber },
        });
        gatewayData = {
          clientSecret: paymentIntent.client_secret,
          publishableKey: settings.payment.stripe.publishableKey,
        };
      } catch (err: any) {
        console.warn("Stripe init error:", err.message);
      }
    }

    return NextResponse.json({
      order,
      gatewayData,
      settings: {
        activeGateway: settings.payment.activeGateway,
        branding: settings.branding,
      },
    });
  } catch (error: any) {
    console.error("Checkout init error:", error);
    return NextResponse.json({ error: error.message || "Failed to initialize order" }, { status: 500 });
  }
}
