import connectDB from "@/lib/db";
import User, { IUserDocument } from "@/models/User";
import Order from "@/models/Order";
import { IUser } from "@/types";

export class UserService {
  static async getAllUsers(options: { page?: number; limit?: number; search?: string } = {}) {
    await connectDB();
    const { page = 1, limit = 20, search } = options;
    const query: any = {};

    if (search && search.trim() !== "") {
      const regex = new RegExp(search.trim(), "i");
      query.$or = [{ name: regex }, { email: regex }];
    }

    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find(query)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(query),
    ]);

    return {
      users: JSON.parse(JSON.stringify(users)) as IUser[],
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  static async getUserById(id: string): Promise<IUser | null> {
    await connectDB();
    const user = (await User.findById(id).select("-password").lean()) as any;
    if (!user) return null;
    return JSON.parse(JSON.stringify(user));
  }

  static async toggleBlockUser(id: string): Promise<IUser | null> {
    await connectDB();
    const user = await User.findById(id);
    if (!user) return null;
    user.isBlocked = !user.isBlocked;
    await user.save();
    return JSON.parse(JSON.stringify(user));
  }

  static async getUserPurchaseHistory(userId: string) {
    await connectDB();
    const orders = await Order.find({ user: userId, paymentStatus: "paid" })
      .populate("items.product", "title thumbnailUrl slug")
      .sort({ createdAt: -1 })
      .lean();
    return JSON.parse(JSON.stringify(orders));
  }
}
