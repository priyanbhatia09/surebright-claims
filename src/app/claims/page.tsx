import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getAllClaims } from "@/lib/db";
import { formatDate } from "@/lib/date";
import { StatusBadge } from "@/components/StatusBadge";
import { ChevronRight, Clock, Package } from "lucide-react";

export const dynamic = "force-dynamic";

export default function MyClaimsPage() {
  const all = getAllClaims();
  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-[#151515] tracking-tight mb-2">My Claims</h1>
        <p className="text-[#525252] mb-8">Track all your warranty claim submissions.</p>
        <div className="space-y-3">
          {all.map((claim) => (
            <div key={claim.id} className="bg-white rounded-2xl border border-[#e5e7eb] p-5 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 bg-[#eff4ff] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-[#0558ff]" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-[#151515] truncate">{claim.productName}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-mono text-[#737373]">{claim.id}</span>
                    <span className="text-[#e5e7eb]">·</span>
                    <Clock className="w-3 h-3 text-[#9b9b9b]" />
                    <span className="text-xs text-[#737373]" suppressHydrationWarning>{formatDate(claim.createdAt)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <StatusBadge status={claim.status} />
                <Link href={`/claims/${claim.id}`} className="text-[#0558ff] hover:text-[#0046d6]">
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
