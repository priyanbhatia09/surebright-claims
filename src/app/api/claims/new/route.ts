import { NextRequest, NextResponse } from "next/server";
import { createClaim, updateClaim } from "@/lib/db";
import { analyzeClaimWithAI } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, customerEmail, orderNumber, productName, productCategory, issueDescription, photos } = body;

    if (!customerName || !customerEmail || !orderNumber || !productName || !productCategory || !issueDescription) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Create the claim
    const claim = createClaim({
      customerName,
      customerEmail,
      orderNumber,
      productName,
      productCategory,
      issueDescription,
      photos: Array.isArray(photos) ? photos : [],
    });

    // Kick off AI adjudication immediately
    try {
      const aiResult = await analyzeClaimWithAI(productName, productCategory, issueDescription, orderNumber);

      const statusMap: Record<string, "approved" | "denied" | "escalated"> = {
        approve: "approved",
        deny: "denied",
        escalate: "escalated",
      };

      updateClaim(claim.id, {
        claimType: aiResult.claimType,
        severity: aiResult.severity,
        status: statusMap[aiResult.recommendedAction] ?? "under_review",
        aiDecision: {
          ...aiResult,
          decidedAt: new Date().toISOString(),
        },
        auditTrail: [
          ...claim.auditTrail,
          {
            timestamp: new Date().toISOString(),
            actor: "ai",
            action: `AI Classification`,
            details: `Classified as ${aiResult.claimType.replace(/_/g, " ")}, Severity: ${aiResult.severity}, Confidence: ${Math.round(aiResult.confidence * 100)}%`,
          },
          {
            timestamp: new Date().toISOString(),
            actor: "ai",
            action: `AI Decision: ${aiResult.recommendedAction.toUpperCase()}`,
            details: `Confidence ${Math.round(aiResult.confidence * 100)}%. ${aiResult.policyReference}. ${aiResult.redFlags.length > 0 ? `${aiResult.redFlags.length} red flag(s) detected.` : "No red flags."}`,
          },
        ],
      });
    } catch (aiErr) {
      console.error("AI analysis failed:", aiErr);
      // Claim still created, just without AI decision
    }

    return NextResponse.json({ claimId: claim.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
