import { NextRequest, NextResponse } from "next/server";
import { getClaimById, updateClaim } from "@/lib/db";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const claim = getClaimById(id);
  if (!claim) return NextResponse.json({ error: "Claim not found" }, { status: 404 });

  const { action, reason, overriddenBy } = await req.json();
  if (!action || !reason || !overriddenBy) {
    return NextResponse.json({ error: "action, reason, and overriddenBy are required" }, { status: 400 });
  }

  const statusMap: Record<string, "approved" | "denied" | "escalated"> = {
    approve: "approved",
    deny: "denied",
    escalate: "escalated",
  };

  const updated = updateClaim(claim.id, {
    status: statusMap[action] ?? claim.status,
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
        details: `${overriddenBy} overrode AI decision. Reason: "${reason}"`,
      },
    ],
  });

  return NextResponse.json({ success: true, claim: updated });
}
