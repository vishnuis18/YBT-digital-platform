import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { FAQService } from "@/services/faq.service";
import { FAQSchema } from "@/lib/validations";

export async function GET() {
  try {
    const faqs = await FAQService.getAllFAQs();
    return NextResponse.json({ faqs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load FAQs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const validated = FAQSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ error: validated.error.errors[0]?.message || "Invalid FAQ data" }, { status: 400 });
    }

    const faq = await FAQService.createFAQ(validated.data as any);
    return NextResponse.json({ faq, message: "FAQ item created successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create FAQ" }, { status: 500 });
  }
}
