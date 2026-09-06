import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";

export class AnalyticsService {
  static async getDashboardMetrics() {
    await connectDB();

    const [totalUsers, totalProducts, paidOrders] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.find({ paymentStatus: "paid" }).lean(),
    ]);

    const totalRevenue = paidOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const totalTaxCollected = paidOrders.reduce((sum, order) => sum + (order.taxAmount || 0), 0);
    const totalDiscounts = paidOrders.reduce((sum, order) => sum + (order.discountAmount || 0), 0);

    const recentOrders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    const topSellingProducts = await Product.find({ status: "active" })
      .populate("category", "name slug")
      .sort({ salesCount: -1 })
      .limit(5)
      .lean();

    return {
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalOrders: paidOrders.length,
      totalUsers,
      totalProducts,
      totalTaxCollected: Math.round(totalTaxCollected * 100) / 100,
      totalDiscounts: Math.round(totalDiscounts * 100) / 100,
      recentOrders: JSON.parse(JSON.stringify(recentOrders)),
      topSellingProducts: JSON.parse(JSON.stringify(topSellingProducts)),
    };
  }

  static async getSalesReport(days = 30) {
    await connectDB();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const paidOrders = await Order.find({
      paymentStatus: "paid",
      createdAt: { $gte: startDate },
    }).sort({ createdAt: 1 }).lean();

    const dailyMap: Record<string, { date: string; sales: number; revenue: number; tax: number }> = {};

    for (let i = 0; i <= days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (days - i));
      const key = d.toISOString().slice(0, 10);
      dailyMap[key] = { date: key, sales: 0, revenue: 0, tax: 0 };
    }

    for (const order of paidOrders) {
      const key = new Date(order.createdAt).toISOString().slice(0, 10);
      if (dailyMap[key]) {
        dailyMap[key].sales += 1;
        dailyMap[key].revenue += order.totalAmount || 0;
        dailyMap[key].tax += order.taxAmount || 0;
      }
    }

    return Object.values(dailyMap);
  }
}
