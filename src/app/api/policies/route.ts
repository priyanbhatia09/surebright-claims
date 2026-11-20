import { NextRequest, NextResponse } from "next/server";
import { getAllPolicies, createPolicy } from "@/lib/policies";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const policies = getAllPolicies();
    return NextResponse.json({ policies });
  } catch (error) {
    console.error("Failed to fetch policies:", error);
    return NextResponse.json({ error: "Failed to fetch policies" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, customerEmail, orderNumber, productName, productPrice, planTier, planName, planPrice } = body;

    if (!customerName || !customerEmail || !orderNumber || !productName || !productPrice || !planTier || !planName || !planPrice) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const policy = createPolicy({
      customerName,
      customerEmail,
      orderNumber,
      productName,
      productPrice: Number(productPrice),
      planTier,
      planName,
      planPrice: Number(planPrice),
    });

    return NextResponse.json({ success: true, policy }, { status: 201 });
  } catch (error) {
    console.error("Failed to create policy:", error);
    return NextResponse.json({ error: "Failed to create policy" }, { status: 500 });
  }
}
