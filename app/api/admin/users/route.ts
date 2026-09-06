import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/auth";
import { UserService } from "@/services/user.service";

export async function GET(request: Request) {
  try {
    await requireSuperAdmin();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 50;

    const data = await UserService.getAllUsers({ search, page, limit });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Forbidden - Super Admin only" }, { status: 403 });
  }
}
