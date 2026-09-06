import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { SupportService } from "@/services/support.service";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const { status } = await request.json();

    const updated = await SupportService.updateStatus(id, status);
    return NextResponse.json({ ticket: updated, message: "Ticket status updated" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Forbidden" }, { status: 403 });
  }
}
