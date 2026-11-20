import { NextRequest, NextResponse } from "next/server";
import { getClaimById, updateClaim } from "@/lib/db";
import { analyzeClaimWithAI } from "@/lib/ai";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const claim = getClaimById(id);
  if (!claim) return NextResponse.json({ error: "Claim not found" }, { status: 404 });

  try {
    const aiResult = await analyzeClaimWithAI(
      claim.productName,
      claim.productCategory,
      claim.issueDescription,
      claim.orderNumber
    );

    const statusMap: Record<string, "approved" | "denied" | "escalated"> = {
      approve: "approved",
      deny: "denied",
      escalate: "escalated",
    };

    const updated = updateClaim(claim.id, {
      claimType: aiResult.claimType,
      severity: aiResult.severity,
      status: statusMap[aiResult.recommendedAction] ?? "under_review",
      aiDecision: { ...aiResult, decidedAt: new Date().toISOString() },
      auditTrail: [
        ...claim.auditTrail,
        {
          timestamp: new Date().toISOString(),
          actor: "ai",
          action: "AI Classification (Manual Trigger)",
          details: `Classified as ${aiResult.claimType.replace(/_/g, " ")}, Severity: ${aiResult.severity}, Confidence: ${Math.round(aiResult.confidence * 100)}%`,
        },
        {
          timestamp: new Date().toISOString(),
          actor: "ai",
          action: `AI Decision: ${aiResult.recommendedAction.toUpperCase()}`,
          details: `Confidence ${Math.round(aiResult.confidence * 100)}%. ${aiResult.policyReference}`,
        },
      ],
    });

    return NextResponse.json({ success: true, claim: updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "AI analysis failed" }, { status: 500 });
  }
}
