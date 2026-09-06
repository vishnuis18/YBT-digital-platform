import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITicketMessageDoc {
  sender: Types.ObjectId | string;
  senderRole: "user" | "admin";
  senderName: string;
  message: string;
  attachments?: string[];
  createdAt: Date;
}

export interface ISupportTicketDocument extends Document {
  ticketNumber: string;
  user: Types.ObjectId;
  subject: string;
  category: "Billing" | "Product Download" | "Technical" | "General";
  priority: "low" | "medium" | "high";
  status: "open" | "in_progress" | "resolved" | "closed";
  messages: ITicketMessageDoc[];
  createdAt: Date;
  updatedAt: Date;
}

const TicketMessageSchema = new Schema<ITicketMessageDoc>(
  {
    sender: { type: Schema.Types.Mixed, required: true },
    senderRole: { type: String, enum: ["user", "admin"], required: true },
    senderName: { type: String, required: true },
    message: { type: String, required: true },
    attachments: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const SupportTicketSchema = new Schema<ISupportTicketDocument>(
  {
    ticketNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    category: {
      type: String,
      enum: ["Billing", "Product Download", "Technical", "General"],
      default: "General",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "closed"],
      default: "open",
      index: true,
    },
    messages: {
      type: [TicketMessageSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const SupportTicket = mongoose.models.SupportTicket || mongoose.model<ISupportTicketDocument>("SupportTicket", SupportTicketSchema);
export default SupportTicket;
