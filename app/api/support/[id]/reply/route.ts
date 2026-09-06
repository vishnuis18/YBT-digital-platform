import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { SupportService } from "@/services/support.service";
import { TicketReplySchema } from "@/lib/validations";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { message } = body;

    if (!message || message.trim() === "") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const senderRole = (session.role === "SUPER_ADMIN" || session.role === "EDITOR") ? "admin" : "user";

    const updated = await SupportService.addMessage(id, {
      senderId: session.id,
      senderRole,
      senderName: session.name,
      message: message.trim(),
    });

    if (!updated) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    return NextResponse.json({ ticket: updated, message: "Reply sent successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to send reply" }, { status: 500 });
  }
}
