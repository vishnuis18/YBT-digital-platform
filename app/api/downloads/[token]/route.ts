import { NextRequest, NextResponse } from "next/server";
import { DownloadService } from "@/services/download.service";
import { StorageService } from "@/services/storage.service";
import fs from "fs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    if (!token) {
      return NextResponse.json({ error: "Download token is missing" }, { status: 400 });
    }

    const verification = await DownloadService.verifyAndConsumeToken(token);
    if (!verification.valid || !verification.fileKey) {
      return NextResponse.json({ error: verification.message }, { status: 403 });
    }

    const { stream, size, exists } = await StorageService.getFileStream(verification.fileKey);
    if (!exists) {
      return NextResponse.json({ error: "Physical file could not be located" }, { status: 404 });
    }

    // Convert Node ReadStream to Web ReadableStream
    const readableStream = new ReadableStream({
      start(controller) {
        stream.on("data", (chunk) => controller.enqueue(chunk));
        stream.on("end", () => controller.close());
        stream.on("error", (err) => controller.error(err));
      },
    });

    const fileName = verification.fileName || "digital-product-asset.zip";
    const headers = new Headers();
    headers.set("Content-Type", "application/octet-stream");
    headers.set("Content-Disposition", `attachment; filename="${encodeURIComponent(fileName)}"`);
    headers.set("Content-Length", size.toString());
    headers.set("Cache-Control", "no-store, no-cache, must-revalidate, private");

    return new NextResponse(readableStream, {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.error("Download stream error:", error);
    return NextResponse.json({ error: error.message || "Failed to download file" }, { status: 500 });
  }
}
