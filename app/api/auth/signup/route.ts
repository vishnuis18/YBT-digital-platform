import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { SignupSchema } from "@/lib/validations";
import { hashPassword, signToken, setAuthCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = SignupSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.errors[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { name, email, password } = validated.data;
    await connectDB();

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email address already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "user",
      isBlocked: false,
    });

    const token = signToken({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: "user",
    });

    await setAuthCookie(token);

    return NextResponse.json({
      message: "Account created successfully",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Signup error:", error);
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
      { error: error.message || "Failed to create account" },
      { status: 500 }
    );
  }
}
