import { GoogleGenerativeAI } from "@google/generative-ai";

export interface AiAnalysisResult {
  claimType: string;
  severity: "low" | "medium" | "high";
  recommendedAction: "approve" | "deny" | "escalate";
  confidence: number;
  reasoning: string;
  policyReference: string;
  redFlags: string[];
}

const MOCK_POLICY = `
SureBright Extended Warranty & Shipping Protection — Policy v2.1

COVERED:
- Section 2.1 Electrical Failure: Sudden electrical failure not caused by user misuse
- Section 2.2 Mechanical Failure: Motor, gear, or structural failure during normal use
- Section 3.1 Accidental Damage: Drops, spills, screen cracks from physical impact
- Section 3.2 Shipping Damage: Structural damage occurring within 30 days of delivery
- Section 5.1 Power Surge: Damage from electrical surges or lightning
- Section 5.2 Liquid Damage: If customer has Premium tier coverage only

EXCLUSIONS (NOT COVERED):
- Section 1.3 Cosmetic Damage: Scratches, dents, discoloration not affecting function
- Section 1.4 User Misuse: Damage from improper use or unauthorized modification
- Section 1.5 Normal Wear: Battery capacity degradation, gradual performance decline
- Section 1.6 Software Issues: Software bugs, viruses, OS or firmware problems
- Section 4.1 Pre-existing: Damage present before warranty activation

DECISION THRESHOLDS:
- APPROVE: Clear coverage match, confidence ≥ 80%, no red flags
- ESCALATE: Confidence < 70%, multiple red flags, or borderline coverage
- DENY: Clear exclusion match, confidence ≥ 85%
`;

function getMockAnalysis(description: string): AiAnalysisResult {
  const d = description.toLowerCase();

  if (d.includes("scratch") || d.includes("dent") || d.includes("cosmetic") || d.includes("discolor")) {
    return {
      claimType: "cosmetic_damage", severity: "low", recommendedAction: "deny", confidence: 0.96,
      reasoning: "The described issue is cosmetic in nature. Cosmetic damage that does not affect product functionality is explicitly excluded from all SureBright warranty tiers per Section 1.3.",
      policyReference: "Section 1.3 — Exclusions: Cosmetic damage (scratches, dents, discoloration) not affecting function is not covered.",
      redFlags: ["Cosmetic-only claim — explicitly excluded under Section 1.3"],
    };
  }
  if (d.includes("delivery") || d.includes("shipping") || d.includes("arrived broken") || d.includes("cracked") || d.includes("broke in transit")) {
    return {
      claimType: "shipping_damage", severity: "high", recommendedAction: "approve", confidence: 0.89,
      reasoning: "The described damage is consistent with shipping-related structural damage occurring post-delivery. This falls within the 30-day shipping protection window with no indicators of intentional damage.",
      policyReference: "Section 3.2 — Shipping Damage: Structural damage within 30 days of delivery qualifies for replacement.",
      redFlags: [],
    };
  }
  if (d.includes("water") || d.includes("liquid") || d.includes("spill") || d.includes("wet") || d.includes("dropped in")) {
    return {
      claimType: "liquid_damage", severity: "high", recommendedAction: "escalate", confidence: 0.68,
      reasoning: "Liquid damage is covered under Premium tier policies only. Coverage determination requires verification of the customer's warranty tier before proceeding with adjudication.",
      policyReference: "Section 5.2 — Liquid Damage: Covered for Premium tier customers only. Tier verification required.",
      redFlags: ["Coverage tier must be verified before decision"],
    };
  }
  if (d.includes("stop") || d.includes("not working") || d.includes("dead") || d.includes("fail") || d.includes("broken") || d.includes("won't turn on") || d.includes("compressor")) {
    return {
      claimType: "functional_failure", severity: "medium", recommendedAction: "escalate", confidence: 0.65,
      reasoning: "The described functional failure may be covered under mechanical or electrical failure provisions. Additional diagnostic information is required to confirm root cause and rule out user-caused issues before automated adjudication.",
      policyReference: "Section 2.2 — Mechanical Failure: Motor, gear, or structural failure during normal use is covered. Diagnostic confirmation required.",
      redFlags: ["Insufficient diagnostic evidence", "Cannot rule out user misuse without documentation"],
    };
  }
  if (d.includes("surge") || d.includes("lightning") || d.includes("power outage") || d.includes("electric")) {
    return {
      claimType: "power_surge", severity: "high", recommendedAction: "approve", confidence: 0.84,
      reasoning: "Power surge damage from electrical events is a covered peril under Section 5.1. The described circumstances are consistent with surge damage. Approving subject to claim documentation.",
      policyReference: "Section 5.1 — Power Surge: Damage from electrical surges or lightning events is fully covered.",
      redFlags: [],
    };
  }
  return {
    claimType: "unknown", severity: "medium", recommendedAction: "escalate", confidence: 0.52,
    reasoning: "The claim description does not clearly match a specific covered or excluded category. Human review by a claims specialist is required to properly classify and adjudicate this claim.",
    policyReference: "General Policy — Unclear claims require manual review by a certified claims specialist.",
    redFlags: ["Insufficient information for automated classification", "Manual specialist review required"],
  };
}

export async function analyzeClaimWithAI(
  productName: string,
  productCategory: string,
  issueDescription: string,
  orderNumber: string
): Promise<AiAnalysisResult> {
  if (!process.env.GEMINI_API_KEY) {
    // Simulate processing delay
    await new Promise((r) => setTimeout(r, 1200));
    return getMockAnalysis(issueDescription);
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are SureBright's AI claims adjudicator. Analyze this warranty claim and return ONLY a valid JSON object.

POLICY DOCUMENT:
${MOCK_POLICY}

CLAIM DETAILS:
- Product: ${productName} (${productCategory})
- Order Number: ${orderNumber}
- Customer Issue Description: "${issueDescription}"

Return ONLY this JSON (no markdown, no extra text):
{
  "claimType": "one of: shipping_damage|functional_failure|accidental_damage|cosmetic_damage|liquid_damage|power_surge|software_issue|unknown",
  "severity": "low|medium|high",
  "recommendedAction": "approve|deny|escalate",
  "confidence": <number 0.0-1.0>,
  "reasoning": "<2-3 sentences referencing the specific policy section>",
  "policyReference": "<Cite the exact section, e.g. Section 3.2 — Shipping Damage Coverage>",
  "redFlags": ["<array of concerns, empty if none>"]
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim().replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(text) as AiAnalysisResult;
  } catch {
    return getMockAnalysis(issueDescription);
  }
}
