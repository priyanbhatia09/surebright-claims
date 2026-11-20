"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Claim } from "@/lib/db";
import { CheckCircle2, XCircle, AlertTriangle, Loader2 } from "lucide-react";

export default function OverridePanel({ claim }: { claim: Claim }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [action, setAction] = useState<"approve" | "deny" | "escalate">("approve");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [adjudicating, setAdjudicating] = useState(false);
  const [done, setDone] = useState(false);

  async function triggerAI() {
    setAdjudicating(true);
    try {
      await fetch(`/api/claims/${claim.id}/adjudicate`, { method: "POST" });
      startTransition(() => router.refresh());
    } finally {
      setAdjudicating(false);
    }
  }

  async function submitOverride() {
    if (!reason.trim()) return;
    setLoading(true);
    try {
      await fetch(`/api/claims/${claim.id}/override`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reason, overriddenBy: "Claims Admin" }),
      });
      setDone(true);
      startTransition(() => router.refresh());
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
        <p className="font-semibold text-amber-900">Override Applied ✓</p>
        <p className="text-sm text-amber-700 mt-1">Decision updated. Refresh to see changes.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-[#f0efe7]">
        <h3 className="font-semibold text-[#151515]">Admin Actions</h3>
      </div>
      <div className="p-6 space-y-5">
        {/* Trigger AI if no decision yet */}
        {!claim.aiDecision && (
          <div>
            <p className="text-sm text-[#525252] mb-3">No AI decision yet. Run analysis now:</p>
            <button
              onClick={triggerAI}
              disabled={adjudicating || isPending}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0558ff] to-[#8006dc] text-white font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition flex items-center justify-center gap-2"
            >
              {adjudicating || isPending ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Running AI Analysis...</>
              ) : (
                "🤖 Run AI Adjudication"
              )}
            </button>
          </div>
        )}

        {/* Human Override */}
        <div>
          <p className="text-xs font-semibold text-[#525252] uppercase tracking-wide mb-3">Human Override Decision</p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {(["approve", "deny", "escalate"] as const).map((a) => {
              const cfg = {
                approve: { icon: CheckCircle2, label: "Approve", active: "bg-green-50 border-green-400 text-green-800", inactive: "border-[#e5e7eb] text-[#525252]" },
                deny: { icon: XCircle, label: "Deny", active: "bg-red-50 border-red-400 text-red-800", inactive: "border-[#e5e7eb] text-[#525252]" },
                escalate: { icon: AlertTriangle, label: "Escalate", active: "bg-amber-50 border-amber-400 text-amber-800", inactive: "border-[#e5e7eb] text-[#525252]" },
              }[a];
              const Icon = cfg.icon;
              return (
                <button
                  key={a}
                  onClick={() => setAction(a)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 text-xs font-semibold transition ${action === a ? cfg.active : cfg.inactive} hover:bg-[#f5f5ee]`}
                >
                  <Icon className="w-4 h-4" />
                  {cfg.label}
                </button>
              );
            })}
          </div>

          <label className="block text-xs font-semibold text-[#525252] uppercase tracking-wide mb-1.5">Override Reason *</label>
          <textarea
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-[#e5e7eb] text-sm focus:outline-none focus:ring-2 focus:ring-[#0558ff]/30 focus:border-[#0558ff] resize-none transition"
            placeholder="Explain why you're overriding the AI decision..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />

          <button
            onClick={submitOverride}
            disabled={!reason.trim() || loading}
            className="w-full mt-3 py-3 rounded-xl bg-[#151515] text-white font-semibold text-sm hover:bg-[#333] disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Applying...</> : "Apply Human Override"}
          </button>
        </div>
      </div>
    </div>
  );
}
