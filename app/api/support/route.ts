import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { SupportService } from "@/services/support.service";
import { TicketCreateSchema } from "@/lib/validations";

export async function GET() {
  try {
    const session = await getAuthSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tickets = await SupportService.getUserTickets(session.id);
    return NextResponse.json({ tickets });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load tickets" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = TicketCreateSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ error: validated.error.errors[0]?.message || "Invalid ticket data" }, { status: 400 });
    }

    const ticket = await SupportService.createTicket({
      userId: session.id,
      userName: session.name,
      subject: validated.data.subject,
      category: validated.data.category,
      priority: validated.data.priority,
      message: validated.data.message,
    });

    return NextResponse.json({ ticket, message: "Support ticket created successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create support ticket" }, { status: 500 });
  }
}
