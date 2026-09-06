import { NextResponse } from "next/server";
import { getAuthSession, hashPassword, comparePassword } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { ProfileUpdateSchema } from "@/lib/validations";

export async function PUT(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = ProfileUpdateSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ error: validated.error.errors[0]?.message || "Invalid inputs" }, { status: 400 });
    }

    const { name, email, currentPassword, newPassword } = validated.data;
    await connectDB();

    const user = await User.findById(session.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if new email is taken by someone else
    if (email.toLowerCase() !== user.email) {
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
        return NextResponse.json({ error: "Email is already taken by another account" }, { status: 409 });
      }
      user.email = email.toLowerCase();
    }

    user.name = name;

    // Handle password change if provided
    if (newPassword && newPassword.trim() !== "") {
      if (!currentPassword) {
        return NextResponse.json({ error: "Current password is required to change password" }, { status: 400 });
      }
      const isMatch = await comparePassword(currentPassword, user.password);
      if (!isMatch) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
      }
      user.password = await hashPassword(newPassword);
    }

    await user.save();

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update profile" }, { status: 500 });
  }
}
