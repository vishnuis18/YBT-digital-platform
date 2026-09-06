import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { ProductService } from "@/services/product.service";
import { ProductSchema } from "@/lib/validations";

export async function GET() {
  try {
    await requireAdmin();
    const data = await ProductService.getProducts({ status: "all", limit: 100 });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Forbidden" }, { status: 403 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const validated = ProductSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ error: validated.error.errors[0]?.message || "Invalid product data" }, { status: 400 });
    }

    const slug = validated.data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") + "-" + Math.random().toString(36).substring(2, 6);

    const product = await ProductService.createProduct({
      ...validated.data,
      slug,
    } as any);

    return NextResponse.json({ product, message: "Product created successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create product" }, { status: 500 });
  }
}
