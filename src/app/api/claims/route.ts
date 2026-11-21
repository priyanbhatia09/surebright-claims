import { NextResponse } from "next/server";
import { getAllClaims } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const claims = getAllClaims();
    return NextResponse.json({ claims });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch claims" }, { status: 500 });
  }
}
