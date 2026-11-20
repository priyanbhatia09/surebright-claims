import { getAllClaims } from "@/lib/db";
import { formatDate } from "@/lib/date";
import Navbar from "@/components/Navbar";
import { StatusBadge } from "@/components/StatusBadge";
import Link from "next/link";
import { BarChart3, CheckCircle2, XCircle, AlertTriangle, Clock, ChevronRight, Brain } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AdminDashboard() {
  const claims = getAllClaims();

  const stats = {
    total: claims.length,
    approved: claims.filter((c) => c.status === "approved").length,
    denied: claims.filter((c) => c.status === "denied").length,
    escalated: claims.filter((c) => c.status === "escalated").length,
    pending: claims.filter((c) => c.status === "pending").length,
    aiDecided: claims.filter((c) => c.aiDecision !== null).length,
  };

  const approvalRate = stats.aiDecided > 0 ? Math.round((stats.approved / stats.aiDecided) * 100) : 0;
  const autoRate = stats.total > 0 ? Math.round((stats.aiDecided / stats.total) * 100) : 0;
  const avgConfidence =
    claims.filter((c) => c.aiDecision).length > 0
      ? Math.round(
          (claims.filter((c) => c.aiDecision).reduce((sum, c) => sum + (c.aiDecision?.confidence ?? 0), 0) /
            claims.filter((c) => c.aiDecision).length) *
            100
        )
      : 0;

  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-[#151515] tracking-tight">Claims Dashboard</h1>
            <p className="text-[#525252] mt-1">AI-powered adjudication overview</p>
          </div>
          <Link
            href="/claims/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#fb651e] hover:bg-[#ea580c] text-white text-sm font-semibold transition shadow-xs hover:shadow-orange-500/20"
          >
            + New Claim
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Claims", value: stats.total, icon: BarChart3, color: "text-[#0558ff]", bg: "bg-[#eff4ff]" },
            { label: "Approved", value: stats.approved, icon: CheckCircle2, color: "text-[#16a34a]", bg: "bg-green-50" },
            { label: "Denied", value: stats.denied, icon: XCircle, color: "text-[#dc2626]", bg: "bg-red-50" },
            { label: "Escalated", value: stats.escalated, icon: AlertTriangle, color: "text-[#d97706]", bg: "bg-amber-50" },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white rounded-2xl border border-[#e5e7eb] p-5 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${s.color}`} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-[#151515]">{s.value}</div>
                <div className="text-sm text-[#737373] mt-0.5">{s.label}</div>
              </div>
            );
          })}
        </div>

        {/* AI Metrics */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Approval Rate", value: `${approvalRate}%`, sub: "Of AI-decided claims", icon: "✅" },
            { label: "Auto-adjudicated", value: `${autoRate}%`, sub: "No human needed", icon: "🤖" },
            { label: "Avg AI Confidence", value: `${avgConfidence}%`, sub: "Across all decisions", icon: "🎯" },
          ].map((m) => (
            <div key={m.label} className="bg-white rounded-2xl border border-[#e5e7eb] p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#0558ff]/10 to-[#8006dc]/10 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                {m.icon}
              </div>
              <div>
                <div className="text-2xl font-bold text-[#151515]">{m.value}</div>
                <div className="text-sm text-[#737373]">{m.label}</div>
                <div className="text-xs text-[#9b9b9b]">{m.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Claims Table */}
        <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#f0efe7] flex items-center gap-2">
            <Brain className="w-5 h-5 text-[#737373]" />
            <h2 className="font-semibold text-[#151515]">All Claims</h2>
            <span className="ml-auto text-xs text-[#737373]">{claims.length} total</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#fafaf8] border-b border-[#f0efe7]">
                  {["Claim ID", "Customer", "Product", "Status", "AI Decision", "Confidence", "Filed", ""].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-[#737373] uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {claims.map((claim) => (
                  <tr key={claim.id} className="border-b border-[#f5f5ee] hover:bg-[#fafaf8] transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-[#525252] font-semibold">{claim.id}</td>
                    <td className="px-5 py-4">
                      <div className="font-medium text-[#151515]">{claim.customerName}</div>
                      <div className="text-xs text-[#737373]">{claim.customerEmail}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-[#151515] font-medium max-w-[160px] truncate">{claim.productName}</div>
                      <div className="text-xs text-[#737373]">{claim.productCategory}</div>
                    </td>
                    <td className="px-5 py-4"><StatusBadge status={claim.status} /></td>
                    <td className="px-5 py-4">
                      {claim.aiDecision ? (
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-semibold uppercase ${
                            claim.aiDecision.recommendedAction === "approve"
                              ? "text-[#16a34a]"
                              : claim.aiDecision.recommendedAction === "deny"
                              ? "text-[#dc2626]"
                              : "text-[#d97706]"
                          }`}
                        >
                          {claim.aiDecision.recommendedAction === "approve" ? "✓" : claim.aiDecision.recommendedAction === "deny" ? "✗" : "⚠"}
                          {claim.aiDecision.recommendedAction}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-[#9b9b9b]">
                          <Clock className="w-3 h-3" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {claim.aiDecision ? (
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-[#f0efe7] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${Math.round(claim.aiDecision.confidence * 100)}%`,
                                backgroundColor:
                                  claim.aiDecision.confidence >= 0.8
                                    ? "#16a34a"
                                    : claim.aiDecision.confidence >= 0.65
                                    ? "#d97706"
                                    : "#dc2626",
                              }}
                            />
                          </div>
                          <span className="text-xs font-medium text-[#525252]">
                            {Math.round(claim.aiDecision.confidence * 100)}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-[#9b9b9b]">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-xs text-[#737373] whitespace-nowrap" suppressHydrationWarning>
                      {formatDate(claim.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/claims/${claim.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#0558ff] hover:text-[#0046d6] transition-colors"
                      >
                        Review <ChevronRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
