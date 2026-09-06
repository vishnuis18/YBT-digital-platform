import connectDB from "@/lib/db";
import Order, { IOrderDocument } from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import { SettingsService } from "./settings.service";
import { CouponService } from "./coupon.service";
import { DownloadService } from "./download.service";
import { generateOrderNumber } from "@/lib/utils";
import { IOrder, PaymentGatewayType } from "@/types";

export class OrderService {
  static async createOrder(data: {
    userId: string;
    items: { productId: string; quantity: number }[];
    paymentGateway: PaymentGatewayType;
    couponCode?: string;
    notes?: string;
  }): Promise<IOrder> {
    await connectDB();
    const user = await User.findById(data.userId);
    if (!user) throw new Error("User not found");

    if (!data.items || data.items.length === 0) {
      throw new Error("No items in order");
    }

    const settings = await SettingsService.getSettings();

    // Verify products server-side
    let subtotal = 0;
    const orderItems = [];

    for (const item of data.items) {
      const product = await Product.findById(item.productId);
      if (!product || product.status !== "active") {
        throw new Error(`Product ${item.productId} is unavailable`);
      }
      const price = product.salePrice ?? product.price;
      subtotal += price * (item.quantity || 1);

      orderItems.push({
        product: product._id,
        title: product.title,
        price,
        fileKey: product.fileKey,
        fileName: product.fileName,
        fileSize: product.fileSize,
      });
    }

    // Apply Coupon server-side
    let discountAmount = 0;
    let validatedCouponCode = "";
    if (data.couponCode) {
      const couponRes = await CouponService.validateCoupon(data.couponCode, subtotal);
      if (couponRes.valid) {
        discountAmount = couponRes.discountAmount;
        validatedCouponCode = data.couponCode.toUpperCase();
      }
    }

    const discountedSubtotal = Math.max(0, subtotal - discountAmount);

    // Calculate Tax server-side
    let taxAmount = 0;
    const taxRate = settings.tax.enabled ? settings.tax.taxRate : 0;
    if (settings.tax.enabled && taxRate > 0) {
      taxAmount = Math.round(((discountedSubtotal * taxRate) / 100) * 100) / 100;
    }

    const totalAmount = Math.round((discountedSubtotal + taxAmount) * 100) / 100;
    const orderNumber = generateOrderNumber();
    const invoiceNumber = `INV-${orderNumber.replace("YBT-", "")}`;

    const order = await Order.create({
      orderNumber,
      user: user._id,
      items: orderItems,
      subtotal,
      discountAmount,
      couponCode: validatedCouponCode,
      taxRate,
      taxAmount,
      totalAmount,
      currency: settings.branding.currency || "USD",
      paymentGateway: data.paymentGateway,
      paymentStatus: "pending",
      invoiceNumber,
      customerName: user.name,
      customerEmail: user.email,
      notes: data.notes || "",
    });

    return JSON.parse(JSON.stringify(order));
  }

  static async markOrderPaid(orderId: string, transactionId: string): Promise<IOrder> {
    await connectDB();
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");

    if (order.paymentStatus !== "paid") {
      order.paymentStatus = "paid";
      order.transactionId = transactionId;
      await order.save();

      // Increment product sales count
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, { $inc: { salesCount: 1 } });
      }

      // Record coupon usage
      if (order.couponCode) {
        await CouponService.recordCouponUsage(order.couponCode);
      }

      // Generate download tokens for digital products
      await DownloadService.createDownloadTokensForOrder(order._id.toString(), order.user.toString());
    }

    return JSON.parse(JSON.stringify(order));
  }

  static async getUserOrders(userId: string): Promise<IOrder[]> {
    await connectDB();
    const orders = await Order.find({ user: userId })
      .populate("items.product", "title thumbnailUrl slug")
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(orders));
  }

  static async getOrderById(orderId: string): Promise<IOrder | null> {
    await connectDB();
    const order = (await Order.findById(orderId)
      .populate("user", "name email")
      .populate("items.product", "title thumbnailUrl slug")
      .lean()) as any;

    if (!order) return null;
    return JSON.parse(JSON.stringify(order));
  }

  static async getAllOrders(options: { page?: number; limit?: number; status?: string } = {}) {
    await connectDB();
    const { page = 1, limit = 20, status } = options;
    const query: any = {};
    if (status && status !== "all") {
      query.paymentStatus = status;
    }

    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(query),
    ]);

    return {
      orders: JSON.parse(JSON.stringify(orders)) as IOrder[],
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }
}
