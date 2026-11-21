import fs from "fs";
import path from "path";

export interface Claim {
  id: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  productName: string;
  productCategory: string;
  issueDescription: string;
  claimType: string | null;
  severity: string | null;
  status: "pending" | "under_review" | "approved" | "denied" | "escalated";
  aiDecision: AiDecision | null;
  humanOverride: HumanOverride | null;
  auditTrail: AuditEntry[];
  photos: string[];
}

export interface AiDecision {
  recommendedAction: "approve" | "deny" | "escalate";
  confidence: number;
  claimType: string;
  severity: "low" | "medium" | "high";
  reasoning: string;
  policyReference: string;
  redFlags: string[];
  decidedAt: string;
}

export interface HumanOverride {
  action: "approve" | "deny" | "escalate";
  reason: string;
  overriddenBy: string;
  overriddenAt: string;
}

export interface AuditEntry {
  timestamp: string;
  actor: "customer" | "ai" | "admin" | "system";
  action: string;
  details: string;
}

const SEED_CLAIMS: Claim[] = [
  {
    id: "CLM-2024-001",
    createdAt: "2024-11-18T09:30:00Z",
    customerName: "Arjun Sharma",
    customerEmail: "arjun@example.com",
    orderNumber: "SB-ORD-88821",
    productName: "Samsung 65\" QLED TV",
    productCategory: "Electronics",
    issueDescription: "Screen has a large crack after delivery. TV was placed on a stand and the screen cracked overnight without any physical impact from my side.",
    claimType: "shipping_damage",
    severity: "high",
    status: "approved",
    photos: [],
    aiDecision: {
      recommendedAction: "approve",
      confidence: 0.94,
      claimType: "shipping_damage",
      severity: "high",
      reasoning: "Shipping damage reported within 48 hours of delivery. Screen crack matches impact patterns from transit handling. Full replacement approved under Section 4.1.",
      policyReference: "Section 4.1 — Transit Damage Protection",
      redFlags: [],
      decidedAt: "2024-11-18T09:30:14Z",
    },
    humanOverride: null,
    auditTrail: [
      { timestamp: "2024-11-18T09:30:00Z", actor: "customer", action: "Claim Submitted", details: "Customer submitted claim for Samsung 65\" QLED TV" },
      { timestamp: "2024-11-18T09:30:14Z", actor: "ai", action: "AI Classification", details: "Classified as shipping damage, Severity: High, Confidence: 94%" },
      { timestamp: "2024-11-18T09:30:14Z", actor: "ai", action: "AI Decision: APPROVED", details: "Confidence 94%. Section 4.1 — Transit Damage Protection. No red flags." },
    ],
  },
  {
    id: "CLM-2024-002",
    createdAt: "2024-11-17T14:20:00Z",
    customerName: "Priya Nair",
    customerEmail: "priya@example.com",
    orderNumber: "SB-ORD-77432",
    productName: "Dyson V15 Detect Vacuum",
    productCategory: "Home Appliances",
    issueDescription: "Motor started smoking after 3 weeks of normal use. Smells like burnt plastic. Device no longer powers on at all.",
    claimType: "defective_part",
    severity: "high",
    status: "approved",
    photos: [],
    aiDecision: {
      recommendedAction: "approve",
      confidence: 0.96,
      claimType: "defective_part",
      severity: "high",
      reasoning: "Electrical motor failure within 30 days of purchase is fully covered under manufacturer defect warranty. Fast replacement approved.",
      policyReference: "Section 2.1 — Hardware Defect Warranty",
      redFlags: [],
      decidedAt: "2024-11-17T14:20:08Z",
    },
    humanOverride: null,
    auditTrail: [
      { timestamp: "2024-11-17T14:20:00Z", actor: "customer", action: "Claim Submitted", details: "Customer submitted claim for Dyson V15 Vacuum" },
      { timestamp: "2024-11-17T14:20:08Z", actor: "ai", action: "AI Classification", details: "Classified as defective part, Severity: High, Confidence: 96%" },
      { timestamp: "2024-11-17T14:20:08Z", actor: "ai", action: "AI Decision: APPROVED", details: "Confidence 96%. Section 2.1 — Hardware Defect Warranty. No red flags." },
    ],
  },
  {
    id: "CLM-2024-003",
    createdAt: "2024-11-16T11:05:00Z",
    customerName: "Rahul Mehta",
    customerEmail: "rahul@example.com",
    orderNumber: "SB-ORD-65109",
    productName: "Sony WH-1000XM5 Headphones",
    productCategory: "Audio",
    issueDescription: "Accidentally dropped them in a puddle while running in the rain. Left ear cup completely stopped working and has crackling sound.",
    claimType: "liquid_damage",
    severity: "medium",
    status: "denied",
    photos: [],
    aiDecision: {
      recommendedAction: "deny",
      confidence: 0.89,
      claimType: "liquid_damage",
      severity: "medium",
      reasoning: "Standard warranty explicitly excludes water/liquid immersion. Customer chose standard plan without accidental damage protection (Care+).",
      policyReference: "Section 7.3 — Exclusions: Liquid Damage",
      redFlags: ["Customer admits puddle submersion", "Standard warranty tier does not cover liquid damage"],
      decidedAt: "2024-11-16T11:05:12Z",
    },
    humanOverride: null,
    auditTrail: [
      { timestamp: "2024-11-16T11:05:00Z", actor: "customer", action: "Claim Submitted", details: "Customer submitted claim for Sony WH-1000XM5" },
      { timestamp: "2024-11-16T11:05:12Z", actor: "ai", action: "AI Classification", details: "Classified as liquid damage, Severity: Medium, Confidence: 89%" },
      { timestamp: "2024-11-16T11:05:12Z", actor: "ai", action: "AI Decision: DENIED", details: "Confidence 89%. Section 7.3 — Exclusions: Liquid Damage. 2 red flags detected." },
    ],
  },
  {
    id: "CLM-2024-004",
    createdAt: "2024-11-15T16:40:00Z",
    customerName: "Ananya Iyer",
    customerEmail: "ananya@example.com",
    orderNumber: "SB-ORD-54233",
    productName: "LG French Door Refrigerator",
    productCategory: "Home Appliances",
    issueDescription: "Refrigerator suddenly stopped cooling. All food spoiled. It's only 14 months old. Compressor seems to have failed.",
    claimType: null,
    severity: null,
    status: "pending",
    photos: [],
    aiDecision: null,
    humanOverride: null,
    auditTrail: [
      { timestamp: "2024-11-15T16:40:00Z", actor: "customer", action: "Claim Submitted", details: "Customer submitted claim for LG refrigerator cooling failure" },
    ],
  },
];

/**
 * Returns a writable file path that works both locally and on AWS Lambda / Amplify / Serverless
 */
function getDataFilePath(): string {
  // Check if running on AWS Lambda or Serverless environment
  const isServerless = Boolean(
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.AWS_EXECUTION_ENV ||
    process.env.VERCEL
  );

  if (isServerless) {
    const tmpDir = path.join("/tmp", "surebright");
    try {
      if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
    } catch {}
    return path.join(tmpDir, "claims.json");
  }

  // Local filesystem
  const localDir = path.join(process.cwd(), "data");
  try {
    if (!fs.existsSync(localDir)) fs.mkdirSync(localDir, { recursive: true });
    fs.accessSync(localDir, fs.constants.W_OK);
    return path.join(localDir, "claims.json");
  } catch {
    // Fallback to /tmp if local directory is read-only
    const tmpDir = path.join("/tmp", "surebright");
    try {
      if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
    } catch {}
    return path.join(tmpDir, "claims.json");
  }
}

// In-memory global store to share across warm serverless requests
declare global {
  var __SUREBRIGHT_CLAIMS__: Claim[] | undefined;
}

function readClaims(): Claim[] {
  if (globalThis.__SUREBRIGHT_CLAIMS__ && globalThis.__SUREBRIGHT_CLAIMS__.length > 0) {
    return globalThis.__SUREBRIGHT_CLAIMS__;
  }

  const filePath = getDataFilePath();
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(data) as Claim[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        globalThis.__SUREBRIGHT_CLAIMS__ = parsed;
        return parsed;
      }
    }

    // Try reading bundled data/claims.json if available
    const bundledPath = path.join(process.cwd(), "data", "claims.json");
    if (fs.existsSync(bundledPath)) {
      try {
        const bundledData = fs.readFileSync(bundledPath, "utf-8");
        const parsedBundled = JSON.parse(bundledData) as Claim[];
        if (Array.isArray(parsedBundled) && parsedBundled.length > 0) {
          globalThis.__SUREBRIGHT_CLAIMS__ = parsedBundled;
          writeClaims(parsedBundled);
          return parsedBundled;
        }
      } catch {}
    }

    globalThis.__SUREBRIGHT_CLAIMS__ = SEED_CLAIMS;
    writeClaims(SEED_CLAIMS);
    return SEED_CLAIMS;
  } catch (err) {
    console.error("Error reading claims:", err);
    globalThis.__SUREBRIGHT_CLAIMS__ = SEED_CLAIMS;
    return SEED_CLAIMS;
  }
}

function writeClaims(claims: Claim[]): void {
  globalThis.__SUREBRIGHT_CLAIMS__ = claims;
  try {
    const filePath = getDataFilePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(claims, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not write claims to disk (relying on memory cache):", err);
  }
}

export function getAllClaims(): Claim[] {
  const claims = readClaims();
  return [...claims].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getClaimById(id: string): Claim | undefined {
  const claims = readClaims();
  const cleanId = id.trim().toLowerCase();
  return claims.find((c) => c.id.toLowerCase() === cleanId);
}

export function createClaim(data: Omit<Claim, "id" | "createdAt" | "aiDecision" | "humanOverride" | "auditTrail" | "claimType" | "severity" | "status">): Claim {
  const claims = readClaims();
  const id = `CLM-2024-${String(claims.length + 1).padStart(3, "0")}`;
  const newClaim: Claim = {
    ...data,
    id,
    createdAt: new Date().toISOString(),
    claimType: null,
    severity: null,
    status: "pending",
    aiDecision: null,
    humanOverride: null,
    auditTrail: [
      {
        timestamp: new Date().toISOString(),
        actor: "customer",
        action: "Claim Submitted",
        details: `Customer submitted claim for ${data.productName} (${data.productCategory})`,
      },
    ],
  };
  const updated = [newClaim, ...claims];
  writeClaims(updated);
  return newClaim;
}

export function updateClaim(id: string, updates: Partial<Claim>): Claim | null {
  const claims = readClaims();
  const index = claims.findIndex((c) => c.id.toLowerCase() === id.toLowerCase());
  if (index === -1) return null;
  claims[index] = { ...claims[index], ...updates };
  writeClaims(claims);
  return claims[index];
}
