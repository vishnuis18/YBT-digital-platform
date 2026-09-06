import connectDB from "@/lib/db";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import { ICart, ICartItem, IProduct } from "@/types";

export class CartService {
  static async getCart(userId: string): Promise<ICartItem[]> {
    await connectDB();
    const cart = (await Cart.findOne({ user: userId }).populate("items.product").lean()) as any;
    if (!cart || !cart.items) return [];

    const validItems: ICartItem[] = [];
    for (const item of cart.items) {
      if (item.product && typeof item.product === "object") {
        validItems.push({
          product: JSON.parse(JSON.stringify(item.product)) as IProduct,
          quantity: item.quantity || 1,
          price: item.product.salePrice ?? item.product.price,
        });
      }
    }
    return validItems;
  }

  static async addToCart(userId: string, productId: string, quantity = 1): Promise<ICartItem[]> {
    await connectDB();
    const product = await Product.findById(productId);
    if (!product || product.status !== "active") {
      throw new Error("Product not available");
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const existingIndex = cart.items.findIndex(
      (i: any) => i.product.toString() === productId
    );

    const price = product.salePrice ?? product.price;

    if (existingIndex > -1) {
      // Digital products typically have quantity 1, but we allow increment or clamp
      cart.items[existingIndex].quantity = 1;
      cart.items[existingIndex].price = price;
    } else {
      cart.items.push({
        product: productId as any,
        quantity: Math.max(1, quantity),
        price,
      });
    }

    await cart.save();
    return this.getCart(userId);
  }

  static async removeFromCart(userId: string, productId: string): Promise<ICartItem[]> {
    await connectDB();
    await Cart.findOneAndUpdate(
      { user: userId },
      { $pull: { items: { product: productId } } }
    );
    return this.getCart(userId);
  }

  static async clearCart(userId: string): Promise<void> {
    await connectDB();
    await Cart.findOneAndUpdate({ user: userId }, { $set: { items: [] } });
  }

  static async syncLocalCart(userId: string, localProductIds: string[]): Promise<ICartItem[]> {
    await connectDB();
    for (const prodId of localProductIds) {
      try {
        await this.addToCart(userId, prodId, 1);
      } catch {
        // Skip invalid products
      }
    }
    return this.getCart(userId);
  }
}
