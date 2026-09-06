import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { CouponService } from "@/services/coupon.service";
import { CouponSchema } from "@/lib/validations";

export async function GET() {
  try {
    await requireAdmin();
    const coupons = await CouponService.getAllCoupons();
    return NextResponse.json({ coupons });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Forbidden" }, { status: 403 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const validated = CouponSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ error: validated.error.errors[0]?.message || "Invalid coupon data" }, { status: 400 });
    }

    const coupon = await CouponService.createCoupon({
      ...validated.data,
      expiresAt: new Date(validated.data.expiresAt),
    } as any);

    return NextResponse.json({ coupon, message: "Coupon created successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create coupon" }, { status: 500 });
  }
}
