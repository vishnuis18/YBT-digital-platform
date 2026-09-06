import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Admin from "@/models/Admin";
import { LoginSchema } from "@/lib/validations";
import { comparePassword, signToken, setAuthCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = LoginSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.errors[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { email, password } = validated.data;
    await connectDB();

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return NextResponse.json(
        { error: "Invalid admin credentials" },
        { status: 401 }
      );
    }

    if (!admin.isActive) {
      return NextResponse.json(
        { error: "This administrator account is disabled" },
        { status: 403 }
      );
    }

    const isMatch = await comparePassword(password, admin.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid admin credentials" },
        { status: 401 }
      );
    }

    const token = signToken({
      id: admin._id.toString(),
      name: admin.name,
      email: admin.email,
      role: admin.role,
    });

    await setAuthCookie(token);

    return NextResponse.json({
      message: "Admin authentication successful",
      user: {
        id: admin._id.toString(),
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error: any) {
    console.error("Admin login error:", error);
    if (error.name === "MongooseServerSelectionError" || error.message?.includes("ECONNREFUSED")) {
      return NextResponse.json(
        {
          error:
            "Database not connected. Please start your local MongoDB service or set your MongoDB Atlas connection string in .env.local.",
        },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to authenticate administrator" },
      { status: 500 }
    );
  }
}
