import { notFound } from "next/navigation";
import { getClaimById } from "@/lib/db";
import Navbar from "@/components/Navbar";
import AiDecisionCard from "@/components/AiDecisionCard";
import AuditTrail from "@/components/AuditTrail";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDate, formatDateTime } from "@/lib/date";
import { Package, Mail, Hash, Calendar, ChevronRight } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ClaimStatusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const claim = getClaimById(decodeURIComponent(id));
  if (!claim) notFound();

  const statusStep = {
    pending: 0,
    under_review: 1,
    approved: 3,
    denied: 3,
    escalated: 2,
  }[claim.status] ?? 0;

  const timelineSteps = [
    { label: "Submitted", done: true },
    { label: "AI Analysis", done: statusStep >= 1 },
    { label: "Under Review", done: statusStep >= 2 },
    { label: "Decision", done: statusStep >= 3 },
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#737373] mb-8">
          <Link href="/" className="hover:text-[#151515] transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#151515] font-medium">Claim {claim.id}</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-[#151515] tracking-tight">{claim.id}</h1>
            <p className="text-[#525252] mt-1">{claim.productName}</p>
          </div>
          <StatusBadge status={claim.status} />
        </div>

        {/* Progress Timeline */}
        <div className="bg-white rounded-2xl border border-[#e5e7eb] p-6 mb-6 shadow-sm">
          <div className="flex items-center">
            {timelineSteps.map((s, i) => (
              <div key={s.label} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      s.done ? "bg-[#0558ff] text-white" : "bg-[#f0efe7] text-[#9b9b9b]"
                    }`}
                  >
                    {s.done ? "✓" : i + 1}
                  </div>
                  <span className={`text-xs whitespace-nowrap ${s.done ? "text-[#151515] font-medium" : "text-[#9b9b9b]"}`}>
                    {s.label}
                  </span>
                </div>
                {i < timelineSteps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 mb-5 ${s.done && timelineSteps[i + 1].done ? "bg-[#0558ff]" : "bg-[#e5e7eb]"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left: Claim Details */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl border border-[#e5e7eb] p-6 shadow-sm space-y-4">
              <h3 className="font-semibold text-[#151515]">Claim Details</h3>
              <div className="space-y-3">
                {[
                  { icon: Package, label: "Product", value: claim.productName },
                  { icon: Hash, label: "Order #", value: claim.orderNumber },
                  { icon: Mail, label: "Customer", value: claim.customerName },
                  { icon: Calendar, label: "Filed", value: formatDate(claim.createdAt) },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex gap-3">
                    <Icon className="w-4 h-4 text-[#737373] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-[#737373]">{label}</p>
                      <p className="text-sm font-medium text-[#151515]">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Issue Description */}
            <div className="bg-white rounded-2xl border border-[#e5e7eb] p-6 shadow-sm">
              <h3 className="font-semibold text-[#151515] mb-3">Issue Description</h3>
              <p className="text-sm text-[#525252] leading-relaxed">{claim.issueDescription}</p>
            </div>

            {/* Photos */}
            {claim.photos && claim.photos.length > 0 && (
              <div className="bg-white rounded-2xl border border-[#e5e7eb] p-6 shadow-sm">
                <h3 className="font-semibold text-[#151515] mb-3">Uploaded Photos ({claim.photos.length})</h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {claim.photos.map((photo, idx) => (
                    <div key={idx} className="rounded-xl overflow-hidden border border-[#e5e7eb] aspect-square bg-[#f5f5ee]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photo} alt={`Damage photo ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: AI Decision + Audit */}
          <div className="md:col-span-2 space-y-6">
            {claim.aiDecision ? (
              <AiDecisionCard decision={claim.aiDecision} />
            ) : (
              <div className="bg-white rounded-2xl border border-[#e5e7eb] p-8 text-center shadow-sm">
                <div className="w-14 h-14 bg-[#eff4ff] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤖</span>
                </div>
                <h3 className="font-semibold text-[#151515]">AI Analysis Pending</h3>
                <p className="text-sm text-[#525252] mt-2">Your claim is queued for AI adjudication.</p>
              </div>
            )}

            {claim.humanOverride && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                <h3 className="font-semibold text-amber-900 mb-2">Human Override Applied</h3>
                <p className="text-sm text-amber-800">
                  <strong>{claim.humanOverride.overriddenBy}</strong> overrode the AI decision to{" "}
                  <strong className="uppercase">{claim.humanOverride.action}</strong> on{" "}
                  <span suppressHydrationWarning>{formatDateTime(claim.humanOverride.overriddenAt)}</span>.
                </p>
                <p className="text-sm text-amber-700 mt-2 italic">"{claim.humanOverride.reason}"</p>
              </div>
            )}

            <AuditTrail entries={claim.auditTrail} />
          </div>
        </div>
      </div>
    </div>
  );
}
