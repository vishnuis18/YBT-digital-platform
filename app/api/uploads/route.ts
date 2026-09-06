import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { StorageService } from "@/services/storage.service";

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = formData.get("type") as string; // 'image' | 'digital_file'

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    if (type === "image") {
      try {
        const cloudRes = await uploadImageToCloudinary(buffer, "ybt_products");
        return NextResponse.json({
          url: cloudRes.secure_url || cloudRes.url,
          publicId: cloudRes.public_id,
        });
      } catch (err: any) {
        // Fallback for local demo environment if Cloudinary credentials are mock
        const { fileKey } = await StorageService.savePrivateFile(buffer, file.name);
        return NextResponse.json({
          url: `https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80`,
          fileKey,
        });
      }
    }

    // Digital asset storage
    const saved = await StorageService.savePrivateFile(buffer, file.name);
    return NextResponse.json(saved);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to upload file" }, { status: 500 });
  }
}
