import mongoose, { Schema, Document, Types } from "mongoose";

export interface ICartItemDocument {
  product: Types.ObjectId;
  quantity: number;
  price: number;
}

export interface ICartDocument extends Document {
  user: Types.ObjectId;
  items: ICartItemDocument[];
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItemDocument>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const CartSchema = new Schema<ICartDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    items: {
      type: [CartItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Cart = mongoose.models.Cart || mongoose.model<ICartDocument>("Cart", CartSchema);
export default Cart;
