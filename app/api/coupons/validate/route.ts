import { NextResponse } from "next/server";
import { CouponService } from "@/services/coupon.service";

export async function POST(request: Request) {
  try {
    const { code, subtotal } = await request.json();

    if (!code || typeof subtotal !== "number") {
      return NextResponse.json({ valid: false, discountAmount: 0, message: "Invalid parameters" }, { status: 400 });
    }

    const result = await CouponService.validateCoupon(code, subtotal);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ valid: false, discountAmount: 0, message: error.message || "Failed to validate coupon" }, { status: 500 });
  }
}
