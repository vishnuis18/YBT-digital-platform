import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/auth";
import { SettingsService } from "@/services/settings.service";

export async function GET() {
  try {
    await requireSuperAdmin();
    const settings = await SettingsService.getSettings();
    return NextResponse.json({ settings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Forbidden - Super Admin only" }, { status: 403 });
  }
}

export async function PUT(request: Request) {
  try {
    await requireSuperAdmin();
    const body = await request.json();

    const updated = await SettingsService.updateSettings(body);
    return NextResponse.json({
      settings: updated,
      message: "Store configuration updated successfully",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update settings" }, { status: 500 });
  }
}
