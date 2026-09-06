import { z } from "zod";

export const SignupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(60),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const ResetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const ProfileUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(60),
  email: z.string().email("Invalid email address"),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, "New password must be at least 6 characters").optional().or(z.literal("")),
});

export const ProductSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(150),
  shortDescription: z.string().min(10, "Short description must be at least 10 characters").max(300),
  description: z.string().min(20, "Full description must be at least 20 characters"),
  price: z.number().min(0, "Price must be >= 0"),
  salePrice: z.number().min(0).optional().nullable(),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).default([]),
  thumbnailUrl: z.string().url("Valid thumbnail URL required"),
  screenshots: z.array(z.string().url()).default([]),
  demoUrl: z.string().url().optional().or(z.literal("")),
  features: z.array(z.string()).default([]),
  fileKey: z.string().min(1, "File key is required"),
  fileName: z.string().min(1, "File name is required"),
  fileSize: z.number().default(0),
  status: z.enum(["active", "inactive"]).default("active"),
});

export const CategorySchema = z.object({
  name: z.string().min(2).max(80),
  description: z.string().optional(),
  icon: z.string().default("Layers"),
  isActive: z.boolean().default(true),
});

export const CouponSchema = z.object({
  code: z.string().min(3).max(20).toUpperCase(),
  discountType: z.enum(["percentage", "flat"]),
  discountValue: z.number().positive("Discount value must be positive"),
  minOrderAmount: z.number().min(0).default(0),
  maxDiscountAmount: z.number().positive().optional().nullable(),
  maxUsage: z.number().int().min(1).default(100),
  expiresAt: z.string().or(z.date()),
  isActive: z.boolean().default(true),
});

export const TicketCreateSchema = z.object({
  subject: z.string().min(5).max(150),
  category: z.enum(["Billing", "Product Download", "Technical", "General"]),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const TicketReplySchema = z.object({
  ticketId: z.string().min(1),
  message: z.string().min(2),
});

export const FAQSchema = z.object({
  question: z.string().min(5),
  answer: z.string().min(10),
  category: z.string().default("General"),
  order: z.number().default(0),
  isPublished: z.boolean().default(true),
});

export const CheckoutInitSchema = z.object({
  paymentGateway: z.enum(["razorpay", "stripe", "paypal", "demo"]),
  couponCode: z.string().optional(),
  notes: z.string().optional(),
});
