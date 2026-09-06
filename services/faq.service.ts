import connectDB from "@/lib/db";
import FAQ, { IFAQDocument } from "@/models/FAQ";
import { IFAQ } from "@/types";
import { SAMPLE_FAQS } from "@/lib/mock-data";

export class FAQService {
  static async getPublicFAQs(): Promise<IFAQ[]> {
    try {
      await connectDB();
      const faqs = await FAQ.find({ isPublished: true }).sort({ order: 1, createdAt: 1 }).lean();
      if (faqs && faqs.length > 0) {
        return JSON.parse(JSON.stringify(faqs));
      }
    } catch (e) {
      // fallback
    }
    return JSON.parse(JSON.stringify(SAMPLE_FAQS));
  }

  static async getAllFAQs(): Promise<IFAQ[]> {
    try {
      await connectDB();
      const faqs = await FAQ.find().sort({ order: 1, createdAt: 1 }).lean();
      if (faqs && faqs.length > 0) {
        return JSON.parse(JSON.stringify(faqs));
      }
    } catch (e) {
      // fallback
    }
    return JSON.parse(JSON.stringify(SAMPLE_FAQS));
  }

  static async createFAQ(data: Partial<IFAQDocument>): Promise<IFAQ> {
    await connectDB();
    const faq = await FAQ.create(data);
    return JSON.parse(JSON.stringify(faq));
  }

  static async updateFAQ(id: string, updates: Partial<IFAQDocument>): Promise<IFAQ | null> {
    await connectDB();
    const faq = await FAQ.findByIdAndUpdate(id, updates, { new: true }).lean();
    if (!faq) return null;
    return JSON.parse(JSON.stringify(faq));
  }

  static async deleteFAQ(id: string): Promise<boolean> {
    await connectDB();
    const res = await FAQ.findByIdAndDelete(id);
    return !!res;
  }
}
