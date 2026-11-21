import fs from "fs";
import path from "path";

export interface Policy {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  productPrice: number;
  planTier: "shipping" | "standard_1yr" | "premium_2yr";
  planName: string;
  planPrice: number;
  merchantCommission: number;
  purchaseDate: string;
  expiryDate: string;
  status: "active" | "expired" | "claim_filed";
}

const SEED_POLICIES: Policy[] = [
  {
    id: "POL-2024-0891",
    orderNumber: "SB-ORD-88821",
    customerName: "Arjun Sharma",
    customerEmail: "arjun@example.com",
    productName: "Samsung 65\" QLED 4K TV",
    productPrice: 1299,
    planTier: "shipping",
    planName: "30-Day SafeTransit Shipping Protection",
    planPrice: 9.99,
    merchantCommission: 2.00,
    purchaseDate: "2024-11-18T09:30:00Z",
    expiryDate: "2024-12-18T09:30:00Z",
    status: "claim_filed",
  },
  {
    id: "POL-2024-0742",
    orderNumber: "SB-ORD-77432",
    customerName: "Priya Nair",
    customerEmail: "priya@example.com",
    productName: "Dyson V15 Detect Vacuum",
    productPrice: 749,
    planTier: "standard_1yr",
    planName: "1-Year Extended Hardware Care",
    planPrice: 49.00,
    merchantCommission: 9.80,
    purchaseDate: "2024-11-17T14:20:00Z",
    expiryDate: "2025-11-17T14:20:00Z",
    status: "claim_filed",
  },
  {
    id: "POL-2024-0619",
    orderNumber: "SB-ORD-65109",
    customerName: "Rahul Mehta",
    customerEmail: "rahul@example.com",
    productName: "Apple MacBook Pro 14\" M3",
    productPrice: 1999,
    planTier: "premium_2yr",
    planName: "2-Year SureBright Care+ (Accidental & Liquid)",
    planPrice: 149.00,
    merchantCommission: 29.80,
    purchaseDate: "2024-11-16T11:05:00Z",
    expiryDate: "2026-11-16T11:05:00Z",
    status: "active",
  },
  {
    id: "POL-2024-0511",
    orderNumber: "SB-ORD-64210",
    customerName: "Ananya Iyer",
    customerEmail: "ananya@example.com",
    productName: "Sony Alpha a7 IV Mirrorless Camera",
    productPrice: 2498,
    planTier: "premium_2yr",
    planName: "2-Year SureBright Care+ (Accidental & Liquid)",
    planPrice: 189.00,
    merchantCommission: 37.80,
    purchaseDate: "2024-11-19T08:15:00Z",
    expiryDate: "2026-11-19T08:15:00Z",
    status: "active",
  },
  {
    id: "POL-2024-0482",
    orderNumber: "SB-ORD-63991",
    customerName: "Karan Johar",
    customerEmail: "karan@example.com",
    productName: "Bose QuietComfort Ultra Headphones",
    productPrice: 429,
    planTier: "standard_1yr",
    planName: "1-Year Extended Hardware Care",
    planPrice: 34.99,
    merchantCommission: 7.00,
    purchaseDate: "2024-11-19T13:40:00Z",
    expiryDate: "2025-11-19T13:40:00Z",
    status: "active",
  },
  {
    id: "POL-2024-0320",
    orderNumber: "SB-ORD-61205",
    customerName: "David Miller",
    customerEmail: "david@example.com",
    productName: "Breville Barista Touch Espresso Machine",
    productPrice: 999,
    planTier: "premium_2yr",
    planName: "2-Year SureBright Care+ (Accidental & Liquid)",
    planPrice: 89.00,
    merchantCommission: 17.80,
    purchaseDate: "2024-11-20T04:10:00Z",
    expiryDate: "2026-11-20T04:10:00Z",
    status: "active",
  },
];

function getPolicyFilePath(): string {
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
    return path.join(tmpDir, "policies.json");
  }

  const localDir = path.join(process.cwd(), "data");
  try {
    if (!fs.existsSync(localDir)) fs.mkdirSync(localDir, { recursive: true });
    fs.accessSync(localDir, fs.constants.W_OK);
    return path.join(localDir, "policies.json");
  } catch {
    const tmpDir = path.join("/tmp", "surebright");
    try {
      if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
    } catch {}
    return path.join(tmpDir, "policies.json");
  }
}

declare global {
  var __SUREBRIGHT_POLICIES__: Policy[] | undefined;
}

function readPolicies(): Policy[] {
  if (globalThis.__SUREBRIGHT_POLICIES__ && globalThis.__SUREBRIGHT_POLICIES__.length > 0) {
    return globalThis.__SUREBRIGHT_POLICIES__;
  }

  const filePath = getPolicyFilePath();
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(data) as Policy[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        globalThis.__SUREBRIGHT_POLICIES__ = parsed;
        return parsed;
      }
    }

    const bundledPath = path.join(process.cwd(), "data", "policies.json");
    if (fs.existsSync(bundledPath)) {
      try {
        const bundledData = fs.readFileSync(bundledPath, "utf-8");
        const parsed = JSON.parse(bundledData) as Policy[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          globalThis.__SUREBRIGHT_POLICIES__ = parsed;
          writePolicies(parsed);
          return parsed;
        }
      } catch {}
    }

    globalThis.__SUREBRIGHT_POLICIES__ = SEED_POLICIES;
    writePolicies(SEED_POLICIES);
    return SEED_POLICIES;
  } catch {
    globalThis.__SUREBRIGHT_POLICIES__ = SEED_POLICIES;
    return SEED_POLICIES;
  }
}

function writePolicies(policies: Policy[]): void {
  globalThis.__SUREBRIGHT_POLICIES__ = policies;
  try {
    const filePath = getPolicyFilePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(policies, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not write policies to disk (relying on memory cache):", err);
  }
}

export function getAllPolicies(): Policy[] {
  const policies = readPolicies();
  return [...policies].sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime());
}

export function createPolicy(data: Omit<Policy, "id" | "purchaseDate" | "expiryDate" | "status" | "merchantCommission">): Policy {
  const policies = readPolicies();
  const id = `POL-2024-${String(policies.length + 101).padStart(4, "0")}`;
  const now = new Date();
  
  const expiry = new Date(now);
  if (data.planTier === "shipping") {
    expiry.setDate(expiry.getDate() + 30);
  } else if (data.planTier === "standard_1yr") {
    expiry.setFullYear(expiry.getFullYear() + 1);
  } else {
    expiry.setFullYear(expiry.getFullYear() + 2);
  }

  const commission = Math.round(data.planPrice * 0.20 * 100) / 100;

  const newPolicy: Policy = {
    ...data,
    id,
    merchantCommission: commission,
    purchaseDate: now.toISOString(),
    expiryDate: expiry.toISOString(),
    status: "active",
  };

  const updated = [newPolicy, ...policies];
  writePolicies(updated);
  return newPolicy;
}
