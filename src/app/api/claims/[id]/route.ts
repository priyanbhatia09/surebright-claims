import { NextRequest, NextResponse } from "next/server";
import { getClaimById } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const claim = getClaimById(decodeURIComponent(id));
    if (!claim) {
      return NextResponse.json({ error: "Claim not found" }, { status: 404 });
    }
    return NextResponse.json({ claim });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch claim" }, { status: 500 });
  }
}
