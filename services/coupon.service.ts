import connectDB from "@/lib/db";
import Coupon, { ICouponDocument } from "@/models/Coupon";
import { ICoupon } from "@/types";

export class CouponService {
  static async validateCoupon(code: string, subtotal: number): Promise<{
    valid: boolean;
    discountAmount: number;
    coupon?: ICoupon;
    message: string;
  }> {
    if (!code || code.trim() === "") {
      return { valid: false, discountAmount: 0, message: "Coupon code is empty" };
    }

    await connectDB();
    const coupon = (await Coupon.findOne({
      code: code.trim().toUpperCase(),
      isActive: true,
    }).lean()) as any;

    if (!coupon) {
      return { valid: false, discountAmount: 0, message: "Invalid or inactive coupon code" };
    }

    if (new Date(coupon.expiresAt) < new Date()) {
      return { valid: false, discountAmount: 0, message: "This coupon code has expired" };
    }

    if (coupon.usedCount >= coupon.maxUsage) {
      return { valid: false, discountAmount: 0, message: "Coupon usage limit has been reached" };
    }

    if (subtotal < coupon.minOrderAmount) {
      return {
        valid: false,
        discountAmount: 0,
        message: `Minimum order amount of $${coupon.minOrderAmount} required for this coupon`,
      };
    }

    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = (subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
        discount = coupon.maxDiscountAmount;
      }
    } else {
      discount = coupon.discountValue;
    }

    discount = Math.min(discount, subtotal);
    discount = Math.round(discount * 100) / 100;

    return {
      valid: true,
      discountAmount: discount,
      coupon: JSON.parse(JSON.stringify(coupon)) as ICoupon,
      message: `Coupon '${coupon.code}' applied successfully!`,
    };
  }

  static async recordCouponUsage(code: string): Promise<void> {
    await connectDB();
    await Coupon.findOneAndUpdate(
      { code: code.toUpperCase() },
      { $inc: { usedCount: 1 } }
    );
  }

  static async getAllCoupons(): Promise<ICoupon[]> {
    await connectDB();
    const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(coupons));
  }

  static async createCoupon(data: Partial<ICouponDocument>): Promise<ICoupon> {
    await connectDB();
    const coupon = await Coupon.create({
      ...data,
      code: data.code?.toUpperCase(),
    });
    return JSON.parse(JSON.stringify(coupon));
  }

  static async updateCoupon(id: string, updates: Partial<ICouponDocument>): Promise<ICoupon | null> {
    await connectDB();
    if (updates.code) {
      updates.code = updates.code.toUpperCase();
    }
    const coupon = await Coupon.findByIdAndUpdate(id, updates, { new: true }).lean();
    if (!coupon) return null;
    return JSON.parse(JSON.stringify(coupon));
  }

  static async deleteCoupon(id: string): Promise<boolean> {
    await connectDB();
    const res = await Coupon.findByIdAndDelete(id);
    return !!res;
  }
}
