import mongoose, { Schema, Document } from "mongoose";

export interface IFAQDocument extends Document {
  question: string;
  answer: string;
  category: string;
  order: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FAQSchema = new Schema<IFAQDocument>(
  {
    question: {
      type: String,
      required: [true, "FAQ question is required"],
      trim: true,
    },
    answer: {
      type: String,
      required: [true, "FAQ answer is required"],
      trim: true,
    },
    category: {
      type: String,
      default: "General",
      index: true,
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const FAQ = mongoose.models.FAQ || mongoose.model<IFAQDocument>("FAQ", FAQSchema);
export default FAQ;
