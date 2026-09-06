export type Role = "user" | "SUPER_ADMIN" | "EDITOR";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: "user";
  isBlocked: boolean;
  avatarUrl?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface IAdmin {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: "SUPER_ADMIN" | "EDITOR";
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  isActive: boolean;
  productCount?: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface IProduct {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number;
  salePrice?: number;
  category: ICategory | string;
  tags: string[];
  thumbnailUrl: string;
  screenshots: string[];
  demoUrl?: string;
  features: string[];
  fileKey: string;
  fileName: string;
  fileSize: number;
  status: "active" | "inactive";
  salesCount: number;
  rating: number;
  reviewsCount: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ICartItem {
  product: IProduct;
  quantity: number;
  price: number;
}

export interface ICart {
  _id: string;
  user: string;
  items: {
    product: string | IProduct;
    quantity: number;
    price: number;
  }[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export type PaymentGatewayType = "razorpay" | "stripe" | "paypal" | "demo";
export type PaymentStatusType = "pending" | "paid" | "failed" | "refunded";

export interface IOrderItem {
  product: string | IProduct;
  title: string;
  price: number;
  fileKey: string;
  fileName: string;
  fileSize: number;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  user: IUser | string;
  items: IOrderItem[];
  subtotal: number;
  taxAmount: number;
  taxRate: number;
  discountAmount: number;
  couponCode?: string;
  totalAmount: number;
  currency: string;
  paymentGateway: PaymentGatewayType;
  paymentStatus: PaymentStatusType;
  transactionId?: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  notes?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface IPayment {
  _id: string;
  orderId: string | IOrder;
  gateway: PaymentGatewayType;
  transactionId: string;
  amount: number;
  currency: string;
  status: PaymentStatusType;
  rawResponse?: Record<string, unknown>;
  refundDetails?: {
    refundId?: string;
    amount?: number;
    reason?: string;
    refundedAt?: Date;
  };
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ICoupon {
  _id: string;
  code: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  maxUsage: number;
  usedCount: number;
  expiresAt: string | Date;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface IDownload {
  _id: string;
  orderId: string | IOrder;
  userId: string | IUser;
  productId: string | IProduct;
  token: string;
  downloadCount: number;
  maxDownloads: number;
  expiresAt?: string | Date;
  lastDownloadedAt?: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high";

export interface ITicketMessage {
  sender: string;
  senderRole: "user" | "admin";
  senderName: string;
  message: string;
  attachments?: string[];
  createdAt: string | Date;
}

export interface ISupportTicket {
  _id: string;
  ticketNumber: string;
  user: IUser | string;
  subject: string;
  category: "Billing" | "Product Download" | "Technical" | "General";
  priority: TicketPriority;
  status: TicketStatus;
  messages: ITicketMessage[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface IFAQ {
  _id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isPublished: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ISetting {
  _id: string;
  key: string;
  value: any;
  description?: string;
  updatedAt: string | Date;
}

export interface IAuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}
