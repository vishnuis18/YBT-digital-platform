import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { AnalyticsService } from "@/services/analytics.service";

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const days = searchParams.get("days") ? Number(searchParams.get("days")) : 30;

    const [metrics, salesReport] = await Promise.all([
      AnalyticsService.getDashboardMetrics(),
      AnalyticsService.getSalesReport(days),
    ]);

    return NextResponse.json({
      metrics,
      salesReport,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Forbidden" }, { status: 403 });
  }
}
