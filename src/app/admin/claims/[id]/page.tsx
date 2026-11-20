import { notFound } from "next/navigation";
import { getClaimById } from "@/lib/db";
import Navbar from "@/components/Navbar";
import AiDecisionCard from "@/components/AiDecisionCard";
import AuditTrail from "@/components/AuditTrail";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDate, formatDateTime } from "@/lib/date";
import OverridePanel from "@/components/OverridePanel";
import Link from "next/link";
import { ChevronRight, Package, Mail, Hash, Calendar, FileText } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminClaimDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const claim = getClaimById(decodeURIComponent(id));
  if (!claim) notFound();

  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#737373] mb-8">
          <Link href="/admin" className="hover:text-[#151515] transition-colors">Dashboard</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#151515] font-medium">{claim.id}</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold text-[#151515] tracking-tight font-mono">{claim.id}</h1>
              <StatusBadge status={claim.status} />
            </div>
            <p className="text-[#525252]">{claim.productName} · {claim.customerName}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Sidebar */}
          <div className="space-y-5">
            {/* Claim Info */}
            <div className="bg-white rounded-2xl border border-[#e5e7eb] p-6 shadow-sm">
              <h3 className="font-semibold text-[#151515] mb-4">Claim Information</h3>
              <div className="space-y-3">
                {[
                  { icon: Package, label: "Product", value: claim.productName },
                  { icon: Hash, label: "Order #", value: claim.orderNumber },
                  { icon: Mail, label: "Email", value: claim.customerEmail },
                  { icon: Calendar, label: "Filed", value: formatDate(claim.createdAt) },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex gap-3">
                    <Icon className="w-4 h-4 text-[#737373] flex-shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-xs text-[#737373]">{label}</p>
                      <p className="text-sm font-medium text-[#151515] break-all">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Issue */}
            <div className="bg-white rounded-2xl border border-[#e5e7eb] p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-[#737373]" />
                <h3 className="font-semibold text-[#151515]">Issue Description</h3>
              </div>
              <p className="text-sm text-[#525252] leading-relaxed bg-[#f5f5ee] p-4 rounded-xl">{claim.issueDescription}</p>
            </div>

            {/* Photos */}
            {claim.photos && claim.photos.length > 0 && (
              <div className="bg-white rounded-2xl border border-[#e5e7eb] p-6 shadow-sm">
                <h3 className="font-semibold text-[#151515] mb-3">Uploaded Photos ({claim.photos.length})</h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {claim.photos.map((photo, idx) => (
                    <div key={idx} className="rounded-xl overflow-hidden border border-[#e5e7eb] aspect-square bg-[#f5f5ee]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photo} alt={`Claim photo ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Override */}
            <OverridePanel claim={claim} />
          </div>

          {/* Right: AI + Audit */}
          <div className="md:col-span-2 space-y-6">
            {claim.aiDecision ? (
              <AiDecisionCard decision={claim.aiDecision} />
            ) : (
              <div className="bg-white rounded-2xl border border-[#e5e7eb] p-10 text-center shadow-sm">
                <div className="text-4xl mb-4">🤖</div>
                <h3 className="font-semibold text-[#151515]">Awaiting AI Analysis</h3>
                <p className="text-sm text-[#525252] mt-2">Use the Admin Actions panel to trigger AI adjudication.</p>
              </div>
            )}

            {claim.humanOverride && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                <h3 className="font-bold text-amber-900 mb-2">⚡ Human Override Applied</h3>
                <p className="text-sm text-amber-800">
                  <strong>{claim.humanOverride.overriddenBy}</strong> overrode AI decision →{" "}
                  <strong className="uppercase">{claim.humanOverride.action}</strong> on{" "}
                  <span suppressHydrationWarning>{formatDateTime(claim.humanOverride.overriddenAt)}</span>
                </p>
                <div className="mt-3 bg-white/60 rounded-xl px-4 py-3">
                  <p className="text-xs text-[#737373] font-semibold uppercase tracking-wide mb-1">Override Reason</p>
                  <p className="text-sm text-amber-800 italic">"{claim.humanOverride.reason}"</p>
                </div>
              </div>
            )}

            <AuditTrail entries={claim.auditTrail} />
          </div>
        </div>
      </div>
    </div>
  );
}
