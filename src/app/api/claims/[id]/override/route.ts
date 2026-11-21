import { NextRequest, NextResponse } from "next/server";
import { getClaimById, updateClaim } from "@/lib/db";
import { sendClaimReviewedEmail } from "@/lib/email";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const claim = getClaimById(id);
  if (!claim) return NextResponse.json({ error: "Claim not found" }, { status: 404 });

  const { action, reason, overriddenBy, payoutAmount } = await req.json();
  if (!action || !reason || !overriddenBy) {
    return NextResponse.json({ error: "action, reason, and overriddenBy are required" }, { status: 400 });
  }

  const statusMap: Record<string, "approved" | "denied" | "escalated"> = {
    approve: "approved",
    deny: "denied",
    escalate: "escalated",
  };

  const newStatus = statusMap[action] ?? claim.status;

  // 1. Dispatch notification email to customer
  let emailDispatched = false;
  let emailMode = "simulated";
  try {
    const emailResult = await sendClaimReviewedEmail({
      to: claim.customerEmail,
      customerName: claim.customerName,
      claimId: claim.id,
      orderNumber: claim.orderNumber,
      productName: claim.productName,
      status: newStatus,
      reason,
      reviewedBy: overriddenBy,
      payoutAmount: payoutAmount ? Number(payoutAmount) : undefined,
    });
    emailDispatched = emailResult.success;
    emailMode = emailResult.mode;
  } catch (err) {
    console.error("Error dispatching email:", err);
  }

  // 2. Update claim and record audit trail with email dispatch event
  const updated = updateClaim(claim.id, {
    status: newStatus,
    humanOverride: {
      action,
      reason,
      overriddenBy,
      overriddenAt: new Date().toISOString(),
    },
    auditTrail: [
      ...claim.auditTrail,
      {
        timestamp: new Date().toISOString(),
        actor: "admin",
        action: `Human Override: ${action.toUpperCase()}`,
        details: `${overriddenBy} updated status to ${action.toUpperCase()}. Reason: "${reason}"`,
      },
      {
        timestamp: new Date().toISOString(),
        actor: "system",
        action: `Email Notification Sent`,
        details: `Dispatched ${newStatus.toUpperCase()} notification email to ${claim.customerEmail} (${emailMode === "live" ? "Live SMTP" : "Simulated/Dev Mode"})`,
      },
    ],
  });

  return NextResponse.json({
    success: true,
    claim: updated,
    emailDispatched,
    emailMode,
    customerEmail: claim.customerEmail,
  });
}
