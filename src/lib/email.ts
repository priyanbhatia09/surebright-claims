import nodemailer from "nodemailer";

export interface EmailResult {
  success: boolean;
  mode: "live" | "simulated";
  messageId?: string;
  error?: string;
}

export interface ClaimEmailPayload {
  to: string;
  customerName: string;
  claimId: string;
  orderNumber: string;
  productName: string;
  status: "approved" | "denied" | "escalated";
  reason: string;
  reviewedBy: string;
  payoutAmount?: number;
}

/**
 * Builds a responsive, branded HTML email for the customer
 */
function buildClaimReviewedHtml(payload: ClaimEmailPayload): string {
  const { customerName, claimId, orderNumber, productName, status, reason, reviewedBy, payoutAmount } = payload;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const claimUrl = `${baseUrl}/claims/${claimId}`;

  const statusConfig = {
    approved: {
      title: "Claim Approved",
      color: "#059669",
      bg: "#ecfdf5",
      border: "#10b981",
      badge: "APPROVED ✓",
      message: "Great news! Your warranty claim has been reviewed and approved by our claims operations team.",
    },
    denied: {
      title: "Claim Denied",
      color: "#dc2626",
      bg: "#fef2f2",
      border: "#ef4444",
      badge: "DENIED ✕",
      message: "We have reviewed your warranty claim against your policy guidelines. Unfortunately, this claim cannot be approved under your current coverage terms.",
    },
    escalated: {
      title: "Claim Escalated for Review",
      color: "#d97706",
      bg: "#fffbeb",
      border: "#f59e0b",
      badge: "ESCALATED ⚠",
      message: "Your claim has been reviewed and escalated to a senior warranty specialist. Additional documentation or physical inspection may be required.",
    },
  }[status];

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SureBright Claim Status Update - ${claimId}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          
          <!-- Header with SureBright + YC branding -->
          <tr>
            <td style="background: linear-gradient(135deg, #090f19 0%, #1e1b4b 100%); padding: 24px 32px; border-bottom: 3px solid #fb651e;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <div style="font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
                      Sure<span style="color: #0558ff;">Bright</span>
                      <span style="font-size: 10px; font-weight: 700; background-color: #fb651e; color: #ffffff; padding: 2px 6px; border-radius: 4px; margin-left: 6px; vertical-align: middle; text-transform: uppercase;">YC</span>
                    </div>
                    <div style="font-size: 12px; color: #94a3b8; margin-top: 4px;">AI-Native Warranty & Claims Protection</div>
                  </td>
                  <td align="right">
                    <span style="font-size: 11px; font-family: monospace; background-color: rgba(255,255,255,0.1); color: #cbd5e1; padding: 4px 8px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.15);">
                      ${claimId}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 32px;">
              <p style="font-size: 16px; margin: 0 0 16px 0;">Hello <strong>${customerName}</strong>,</p>
              
              <!-- Status Banner -->
              <div style="background-color: ${statusConfig.bg}; border: 1px solid ${statusConfig.border}; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
                <span style="font-size: 12px; font-weight: 800; letter-spacing: 1px; color: ${statusConfig.color}; background-color: #ffffff; padding: 4px 12px; border-radius: 9999px; border: 1px solid ${statusConfig.border}; display: inline-block; margin-bottom: 10px;">
                  ${statusConfig.badge}
                </span>
                <h2 style="margin: 0 0 8px 0; color: ${statusConfig.color}; font-size: 24px; font-weight: 800;">
                  ${statusConfig.title}
                </h2>
                <p style="margin: 0; font-size: 14px; color: #334155; line-height: 1.5;">
                  ${statusConfig.message}
                </p>
              </div>

              <!-- Reviewer Reason Box -->
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 24px;">
                <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
                  Reviewer Decision Notes (By ${reviewedBy})
                </div>
                <div style="font-size: 14px; color: #1e293b; font-style: italic; line-height: 1.5;">
                  "${reason}"
                </div>
                ${
                  payoutAmount
                    ? `<div style="margin-top: 12px; padding-top: 12px; border-top: 1px dashed #cbd5e1; font-size: 13px; color: #059669; font-weight: 700;">
                        Approved Reimbursement: $${payoutAmount.toFixed(2)} USD
                      </div>`
                    : ""
                }
              </div>

              <!-- Claim Summary Table -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; margin-bottom: 28px; font-size: 13px;">
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 10px 0; color: #64748b;">Claim Number:</td>
                  <td style="padding: 10px 0; text-align: right; font-weight: 700; font-family: monospace;">${claimId}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 10px 0; color: #64748b;">Retail Order #:</td>
                  <td style="padding: 10px 0; text-align: right; font-weight: 600;">${orderNumber}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 10px 0; color: #64748b;">Protected Product:</td>
                  <td style="padding: 10px 0; text-align: right; font-weight: 600;">${productName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #64748b;">Reviewed At:</td>
                  <td style="padding: 10px 0; text-align: right; color: #475569;">${new Date().toUTCString()}</td>
                </tr>
              </table>

              <!-- Call to Action Button -->
              <div style="text-align: center; margin: 32px 0 16px 0;">
                <a href="${claimUrl}" style="background: linear-gradient(135deg, #fb651e 0%, #ea580c 100%); color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; padding: 14px 28px; border-radius: 9999px; display: inline-block; box-shadow: 0 4px 12px rgba(251, 101, 30, 0.3);">
                  View Live Claim Status & Audit Trail →
                </a>
              </div>
              <p style="font-size: 11px; text-align: center; color: #94a3b8; margin: 0;">
                You can inspect the full AI decision breakdown, citations, and payment details anytime.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f1f5f9; padding: 20px 32px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #64748b; line-height: 1.5;">
              <p style="margin: 0 0 6px 0;">This is an automated notification from <strong>SureBright Claims Intelligence</strong>.</p>
              <p style="margin: 0;">If you have questions regarding this decision, reply to this email or visit our Help Center.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

/**
 * Sends the claim review status email to the customer
 */
export async function sendClaimReviewedEmail(payload: ClaimEmailPayload): Promise<EmailResult> {
  const { to, claimId, status } = payload;

  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpHost = process.env.SMTP_HOST || (smtpUser?.includes("@gmail.com") ? "smtp.gmail.com" : undefined);
  const smtpPort = Number(process.env.SMTP_PORT) || 465;
  const fromAddress = process.env.EMAIL_FROM || (smtpUser ? `"SureBright Claims" <${smtpUser}>` : `"SureBright Claims" <claims@surebright.com>`);

  const htmlContent = buildClaimReviewedHtml(payload);
  const subject = `SureBright Claim Update: [${claimId}] ${status.toUpperCase()} - ${payload.productName}`;

  // If real SMTP credentials are provided, send a live email!
  if (smtpUser && smtpPass && smtpHost) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465, // true for 465, false for 587
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const info = await transporter.sendMail({
        from: fromAddress,
        to,
        subject,
        html: htmlContent,
      });

      console.log(`[EMAIL DISPATCH - LIVE] Sent to ${to} (MessageId: ${info.messageId})`);
      return {
        success: true,
        mode: "live",
        messageId: info.messageId,
      };
    } catch (err: any) {
      console.error("[EMAIL DISPATCH - ERROR] Failed to send live email:", err);
      return {
        success: false,
        mode: "live",
        error: err?.message || "Failed to send email",
      };
    }
  }

  // Fallback: Simulated mode (clean developer preview when SMTP credentials aren't yet added to .env.local)
  console.log(`
================================================================================
📧 [SUREBRIGHT EMAIL NOTIFICATION DISPATCHED]
--------------------------------------------------------------------------------
To:        ${to}
Subject:   ${subject}
Claim:     ${claimId} (${status.toUpperCase()})
Reviewer:  ${payload.reviewedBy}
Reason:    ${payload.reason}
Mode:      Simulated (To send live emails to actual inboxes, add SMTP_USER & SMTP_PASS to .env.local)
================================================================================
  `);

  return {
    success: true,
    mode: "simulated",
  };
}
