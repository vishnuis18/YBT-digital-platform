import mongoose, { Schema, Document } from "mongoose";

export interface ISettingDocument extends Document {
  key: string;
  value: any;
  description?: string;
  updatedAt: Date;
}

const SettingSchema = new Schema<ISettingDocument>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    value: {
      type: Schema.Types.Mixed,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const Setting = mongoose.models.Setting || mongoose.model<ISettingDocument>("Setting", SettingSchema);
export default Setting;
