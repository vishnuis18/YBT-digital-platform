import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { OrderService } from "@/services/order.service";
import { SettingsService } from "@/services/settings.service";
import { formatDate, formatPrice } from "@/lib/utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await getAuthSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = await params;
    const order = await OrderService.getOrderById(orderId);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Ensure authorization (either admin or order owner)
    const isOwner = (typeof order.user === "object" ? (order.user as any)._id.toString() : order.user.toString()) === session.id;
    const isAdmin = session.role === "SUPER_ADMIN" || session.role === "EDITOR";

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const settings = await SettingsService.getSettings();

    // Generate clean HTML printable invoice
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Invoice - ${order.invoiceNumber}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; margin: 0; padding: 40px; }
    .invoice-card { max-width: 800px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #f1f5f9; padding-bottom: 24px; margin-bottom: 30px; }
    .brand { font-size: 24px; font-weight: 800; color: #4f46e5; }
    .invoice-title { font-size: 20px; font-weight: 700; color: #0f172a; text-align: right; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; font-size: 14px; }
    .info-label { color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 4px; }
    .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 14px; }
    .table th { text-align: left; padding: 12px 16px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; color: #475569; font-weight: 600; }
    .table td { padding: 14px 16px; border-bottom: 1px solid #f1f5f9; }
    .totals { margin-left: auto; width: 280px; font-size: 14px; }
    .total-row { display: flex; justify-content: space-between; padding: 6px 0; color: #475569; }
    .grand-total { font-size: 18px; font-weight: 800; color: #0f172a; border-top: 2px solid #e2e8f0; padding-top: 10px; margin-top: 6px; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: 700; background: #dcfce7; color: #15803d; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #f1f5f9; text-align: center; font-size: 12px; color: #94a3b8; }
    @media print { body { padding: 0; } .invoice-card { border: none; box-shadow: none; } button { display: none; } }
  </style>
</head>
<body>
  <div class="invoice-card">
    <div style="text-align: right; margin-bottom: 15px;">
      <button onclick="window.print()" style="background: #4f46e5; color: white; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 600; cursor: pointer;">Print / Save PDF</button>
    </div>
    <div class="header">
      <div>
        <div class="brand">${settings.branding.siteName}</div>
        <div style="font-size: 13px; color: #64748b; margin-top: 4px;">${settings.branding.supportEmail}</div>
        <div style="font-size: 13px; color: #64748b;">${settings.branding.siteTagline}</div>
      </div>
      <div>
        <div class="invoice-title">RECEIPT / INVOICE</div>
        <div style="font-size: 13px; color: #64748b; text-align: right; margin-top: 4px;">Invoice #: <strong>${order.invoiceNumber}</strong></div>
        <div style="font-size: 13px; color: #64748b; text-align: right;">Date: ${formatDate(order.createdAt)}</div>
        <div style="text-align: right; margin-top: 6px;"><span class="badge">${order.paymentStatus.toUpperCase()}</span></div>
      </div>
    </div>

    <div class="info-grid">
      <div>
        <div class="info-label">Billed To</div>
        <div style="font-weight: 700; color: #0f172a;">${order.customerName}</div>
        <div style="color: #64748b;">${order.customerEmail}</div>
      </div>
      <div>
        <div class="info-label">Payment Information</div>
        <div>Gateway: <strong>${order.paymentGateway.toUpperCase()}</strong></div>
        <div>Transaction ID: <span style="font-family: monospace; font-size: 12px;">${order.transactionId || "N/A"}</span></div>
        <div>Order #: <strong>${order.orderNumber}</strong></div>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>Item Description</th>
          <th style="text-align: center;">Type</th>
          <th style="text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${order.items
          .map(
            (item: any) => `
          <tr>
            <td>
              <div style="font-weight: 600; color: #0f172a;">${item.title}</div>
              <div style="font-size: 12px; color: #64748b;">Digital Asset (${item.fileName})</div>
            </td>
            <td style="text-align: center; color: #64748b;">Instant Download</td>
            <td style="text-align: right; font-weight: 600;">$${item.price.toFixed(2)}</td>
          </tr>`
          )
          .join("")}
      </tbody>
    </table>

    <div class="totals">
      <div class="total-row">
        <span>Subtotal:</span>
        <span>$${order.subtotal.toFixed(2)}</span>
      </div>
      ${
        order.discountAmount > 0
          ? `<div class="total-row" style="color: #16a34a;">
              <span>Discount (${order.couponCode || "COUPON"}):</span>
              <span>-$${order.discountAmount.toFixed(2)}</span>
             </div>`
          : ""
      }
      ${
        order.taxAmount > 0
          ? `<div class="total-row">
              <span>Tax (${order.taxRate}% ${settings.tax.taxName}):</span>
              <span>+$${order.taxAmount.toFixed(2)}</span>
             </div>`
          : ""
      }
      <div class="total-row grand-total">
        <span>Total Paid:</span>
        <span>$${order.totalAmount.toFixed(2)} ${order.currency}</span>
      </div>
    </div>

    <div class="footer">
      <div>${settings.branding.footerText}</div>
      <div style="margin-top: 4px;">Thank you for your business! Need help? Contact ${settings.branding.supportEmail}</div>
    </div>
  </div>
</body>
</html>
`;

    return new NextResponse(html, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to generate invoice" }, { status: 500 });
  }
}
