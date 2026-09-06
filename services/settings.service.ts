import connectDB from "@/lib/db";
import Setting from "@/models/Setting";

export interface IGlobalSettings {
  payment: {
    activeGateway: "razorpay" | "stripe" | "paypal" | "demo";
    enableDemo: boolean;
    razorpay: {
      keyId: string;
      keySecret: string;
      enabled: boolean;
    };
    stripe: {
      publishableKey: string;
      secretKey: string;
      webhookSecret: string;
      enabled: boolean;
    };
    paypal: {
      clientId: string;
      clientSecret: string;
      mode: "sandbox" | "live";
      enabled: boolean;
    };
  };
  tax: {
    enabled: boolean;
    taxName: string; // e.g. "GST", "VAT"
    taxRate: number; // e.g. 18 for 18%
    includedInPrice: boolean;
  };
  branding: {
    siteName: string;
    siteTagline: string;
    logoUrl: string;
    footerText: string;
    supportEmail: string;
    supportPhone: string;
    currency: string;
    currencySymbol: string;
  };
  email: {
    orderConfirmation: boolean;
    failedPayment: boolean;
    ticketReply: boolean;
    fromEmail: string;
  };
}

export const defaultSettings: IGlobalSettings = {
  payment: {
    activeGateway: "demo",
    enableDemo: true,
    razorpay: {
      keyId: process.env.RAZORPAY_KEY_ID || "",
      keySecret: process.env.RAZORPAY_KEY_SECRET || "",
      enabled: false,
    },
    stripe: {
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || "",
      secretKey: process.env.STRIPE_SECRET_KEY || "",
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
      enabled: false,
    },
    paypal: {
      clientId: process.env.PAYPAL_CLIENT_ID || "",
      clientSecret: process.env.PAYPAL_CLIENT_SECRET || "",
      mode: "sandbox",
      enabled: false,
    },
  },
  tax: {
    enabled: true,
    taxName: "GST / VAT",
    taxRate: 18,
    includedInPrice: false,
  },
  branding: {
    siteName: "YBT Digital",
    siteTagline: "Premium Digital Products, Templates & Software Assets",
    logoUrl: "/images/logo.png",
    footerText: "© 2026 YBT Digital. All rights reserved. Built for modern developers and creators.",
    supportEmail: "support@ybtdigital.com",
    supportPhone: "+1 (555) 019-2834",
    currency: "USD",
    currencySymbol: "$",
  },
  email: {
    orderConfirmation: true,
    failedPayment: true,
    ticketReply: true,
    fromEmail: "notifications@ybtdigital.com",
  },
};

export class SettingsService {
  static async getSettings(): Promise<IGlobalSettings> {
    await connectDB();
    const settingDoc = (await Setting.findOne({ key: "global_settings" }).lean()) as any;
    if (!settingDoc || !settingDoc.value) {
      return defaultSettings;
    }
    return {
      ...defaultSettings,
      ...settingDoc.value,
      payment: { ...defaultSettings.payment, ...(settingDoc.value.payment || {}) },
      tax: { ...defaultSettings.tax, ...(settingDoc.value.tax || {}) },
      branding: { ...defaultSettings.branding, ...(settingDoc.value.branding || {}) },
      email: { ...defaultSettings.email, ...(settingDoc.value.email || {}) },
    };
  }

  static async updateSettings(updates: Partial<IGlobalSettings>): Promise<IGlobalSettings> {
    await connectDB();
    const current = await this.getSettings();
    const merged: IGlobalSettings = {
      ...current,
      ...updates,
      payment: { ...current.payment, ...(updates.payment || {}) },
      tax: { ...current.tax, ...(updates.tax || {}) },
      branding: { ...current.branding, ...(updates.branding || {}) },
      email: { ...current.email, ...(updates.email || {}) },
    };

    await Setting.findOneAndUpdate(
      { key: "global_settings" },
      { key: "global_settings", value: merged, description: "Global Store Configuration" },
      { upsert: true, new: true }
    );

    return merged;
  }
}
