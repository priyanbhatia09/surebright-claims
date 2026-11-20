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

const POLICIES_FILE = path.join(process.cwd(), "data", "policies.json");

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

function readPolicies(): Policy[] {
  try {
    if (!fs.existsSync(POLICIES_FILE)) {
      const dir = path.dirname(POLICIES_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(POLICIES_FILE, JSON.stringify(SEED_POLICIES, null, 2), "utf-8");
      return SEED_POLICIES;
    }
    const data = fs.readFileSync(POLICIES_FILE, "utf-8");
    return JSON.parse(data) as Policy[];
  } catch {
    return SEED_POLICIES;
  }
}

function writePolicies(policies: Policy[]): void {
  try {
    const dir = path.dirname(POLICIES_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(POLICIES_FILE, JSON.stringify(policies, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing policies:", err);
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
  
  // Calculate expiration based on tier
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
