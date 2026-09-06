import { NextResponse } from "next/server";
import { getAuthSession, removeAuthCookie } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Admin from "@/models/Admin";

export async function GET() {
  try {
    const session = await getAuthSession();
    if (!session) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    await connectDB();

    if (session.role === "SUPER_ADMIN" || session.role === "EDITOR") {
      const admin = (await Admin.findById(session.id).select("-password").lean()) as any;
      if (!admin || !admin.isActive) {
        await removeAuthCookie();
        return NextResponse.json({ user: null }, { status: 200 });
      }
      return NextResponse.json({
        user: {
          id: admin._id.toString(),
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      });
    }

    const user = (await User.findById(session.id).select("-password").lean()) as any;
    if (!user || user.isBlocked) {
      await removeAuthCookie();
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
