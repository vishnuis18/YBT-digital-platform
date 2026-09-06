import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import PasswordReset from "@/models/PasswordReset";
import { ForgotPasswordSchema } from "@/lib/validations";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = ForgotPasswordSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const { email } = validated.data;
    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Return success even if not found to prevent user enumeration
      return NextResponse.json({
        message: "If an account exists with this email, a reset token has been generated.",
      });
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await PasswordReset.create({
      userId: user._id,
      token,
      expiresAt,
      used: false,
    });

    // In a production app this would send an email. For seamless development & demonstration:
    return NextResponse.json({
      message: "Password reset link generated successfully",
      demoResetToken: token,
      resetUrl: `/reset-password?token=${token}`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to process request" }, { status: 500 });
  }
}
