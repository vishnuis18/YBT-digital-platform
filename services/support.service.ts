import connectDB from "@/lib/db";
import SupportTicket, { ISupportTicketDocument } from "@/models/SupportTicket";
import { ISupportTicket } from "@/types";

export class SupportService {
  static async getUserTickets(userId: string): Promise<ISupportTicket[]> {
    await connectDB();
    const tickets = await SupportTicket.find({ user: userId })
      .sort({ updatedAt: -1 })
      .lean();
    return JSON.parse(JSON.stringify(tickets));
  }

  static async getAllTickets(status?: string): Promise<ISupportTicket[]> {
    await connectDB();
    const query: any = {};
    if (status && status !== "all") {
      query.status = status;
    }
    const tickets = await SupportTicket.find(query)
      .populate("user", "name email")
      .sort({ updatedAt: -1 })
      .lean();
    return JSON.parse(JSON.stringify(tickets));
  }

  static async getTicketById(ticketId: string): Promise<ISupportTicket | null> {
    await connectDB();
    const ticket = (await SupportTicket.findById(ticketId)
      .populate("user", "name email")
      .lean()) as any;
    if (!ticket) return null;
    return JSON.parse(JSON.stringify(ticket));
  }

  static async createTicket(data: {
    userId: string;
    userName: string;
    subject: string;
    category: "Billing" | "Product Download" | "Technical" | "General";
    priority: "low" | "medium" | "high";
    message: string;
  }): Promise<ISupportTicket> {
    await connectDB();
    const ticketNumber = `TICK-${Date.now().toString().slice(-6)}`;

    const ticket = await SupportTicket.create({
      ticketNumber,
      user: data.userId,
      subject: data.subject,
      category: data.category,
      priority: data.priority,
      status: "open",
      messages: [
        {
          sender: data.userId,
          senderRole: "user",
          senderName: data.userName,
          message: data.message,
          createdAt: new Date(),
        },
      ],
    });

    return JSON.parse(JSON.stringify(ticket));
  }

  static async addMessage(
    ticketId: string,
    messageData: {
      senderId: string;
      senderRole: "user" | "admin";
      senderName: string;
      message: string;
    }
  ): Promise<ISupportTicket | null> {
    await connectDB();
    const updateData: any = {
      $push: {
        messages: {
          sender: messageData.senderId,
          senderRole: messageData.senderRole,
          senderName: messageData.senderName,
          message: messageData.message,
          createdAt: new Date(),
        },
      },
    };

    if (messageData.senderRole === "admin") {
      updateData.status = "in_progress";
    }

    const ticket = (await SupportTicket.findByIdAndUpdate(ticketId, updateData, { new: true })
      .populate("user", "name email")
      .lean()) as any;

    if (!ticket) return null;
    return JSON.parse(JSON.stringify(ticket));
  }

  static async updateStatus(ticketId: string, status: "open" | "in_progress" | "resolved" | "closed") {
    await connectDB();
    return SupportTicket.findByIdAndUpdate(ticketId, { status }, { new: true }).lean();
  }
}
