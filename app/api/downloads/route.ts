import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { DownloadService } from "@/services/download.service";

export async function GET() {
  try {
    const session = await getAuthSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const downloads = await DownloadService.getUserDownloads(session.id);
    return NextResponse.json({ downloads });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch downloads" }, { status: 500 });
  }
}
