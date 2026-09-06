import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import PasswordReset from "@/models/PasswordReset";
import { ResetPasswordSchema } from "@/lib/validations";
import { hashPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = ResetPasswordSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ error: validated.error.errors[0]?.message || "Invalid input" }, { status: 400 });
    }

    const { token, password } = validated.data;
    await connectDB();

    const resetDoc = await PasswordReset.findOne({
      token,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!resetDoc) {
      return NextResponse.json({ error: "Invalid or expired password reset link" }, { status: 400 });
    }

    const user = await User.findById(resetDoc.userId);
    if (!user) {
      return NextResponse.json({ error: "User account not found" }, { status: 404 });
    }

    const hashedPassword = await hashPassword(password);
    user.password = hashedPassword;
    await user.save();

    resetDoc.used = true;
    await resetDoc.save();

    return NextResponse.json({ message: "Password updated successfully. You may now sign in." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to reset password" }, { status: 500 });
  }
}
