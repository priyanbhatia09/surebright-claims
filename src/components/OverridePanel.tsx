"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Claim } from "@/lib/db";
import { CheckCircle2, XCircle, AlertTriangle, Loader2, Mail, Send } from "lucide-react";

export default function OverridePanel({ claim }: { claim: Claim }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [action, setAction] = useState<"approve" | "deny" | "escalate">("approve");
  const [reason, setReason] = useState("");
  const [payoutAmount, setPayoutAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [adjudicating, setAdjudicating] = useState(false);
  const [done, setDone] = useState(false);
  const [emailInfo, setEmailInfo] = useState<{ sent: boolean; email: string; mode: string } | null>(null);

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
      const res = await fetch(`/api/claims/${claim.id}/override`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          reason,
          overriddenBy: "Claims Specialist",
          payoutAmount: payoutAmount ? Number(payoutAmount) : undefined,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setEmailInfo({
          sent: data.emailDispatched,
          email: data.customerEmail || claim.customerEmail,
          mode: data.emailMode || "simulated",
        });
        setDone(true);
        startTransition(() => router.refresh());
      }
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
        <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <p className="font-bold text-emerald-900 text-base">Review Decision Applied ✓</p>
        <p className="text-xs text-emerald-700">
          Status updated to <strong className="uppercase">{action}</strong>.
        </p>

        {emailInfo && (
          <div className="p-3 bg-white rounded-xl border border-emerald-200 text-xs text-slate-700 text-left space-y-1 mt-2">
            <div className="flex items-center gap-1.5 font-bold text-emerald-800">
              <Mail className="w-3.5 h-3.5" /> Notification Email Dispatched
            </div>
            <p className="text-[11px] text-slate-600">
              Recipient: <strong className="text-slate-900">{emailInfo.email}</strong>
            </p>
            <p className="text-[10px] text-slate-400">
              Delivery mode: {emailInfo.mode === "live" ? "Live SMTP Inbox Delivery" : "Simulated/Dev Mode"}
            </p>
          </div>
        )}

        <button
          onClick={() => {
            setDone(false);
            setReason("");
          }}
          className="text-xs text-emerald-800 font-semibold underline mt-2 block mx-auto"
        >
          Make Another Adjustment
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-[#f0efe7] flex items-center justify-between">
        <h3 className="font-semibold text-[#151515]">Admin Actions & Review</h3>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-[#0558ff] border border-blue-200">
          Email Connected
        </span>
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
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Running AI Analysis...
                </>
              ) : (
                "🤖 Run AI Adjudication"
              )}
            </button>
          </div>
        )}

        {/* Human Review & Decision */}
        <div>
          <p className="text-xs font-semibold text-[#525252] uppercase tracking-wide mb-3">
            Review Status Decision
          </p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {(["approve", "deny", "escalate"] as const).map((a) => {
              const cfg = {
                approve: {
                  icon: CheckCircle2,
                  label: "Approve",
                  active: "bg-green-50 border-green-500 text-green-800",
                  inactive: "border-[#e5e7eb] text-[#525252]",
                },
                deny: {
                  icon: XCircle,
                  label: "Deny",
                  active: "bg-red-50 border-red-500 text-red-800",
                  inactive: "border-[#e5e7eb] text-[#525252]",
                },
                escalate: {
                  icon: AlertTriangle,
                  label: "Escalate",
                  active: "bg-amber-50 border-amber-500 text-amber-800",
                  inactive: "border-[#e5e7eb] text-[#525252]",
                },
              }[a];
              const Icon = cfg.icon;
              return (
                <button
                  key={a}
                  onClick={() => setAction(a)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 text-xs font-semibold transition ${
                    action === a ? cfg.active : cfg.inactive
                  } hover:bg-[#f5f5ee]`}
                >
                  <Icon className="w-4 h-4" />
                  {cfg.label}
                </button>
              );
            })}
          </div>

          {action === "approve" && (
            <div className="mb-4">
              <label className="block text-xs font-semibold text-[#525252] uppercase tracking-wide mb-1">
                Approved Reimbursement Amount ($)
              </label>
              <input
                type="number"
                placeholder="e.g. 350.00"
                value={payoutAmount}
                onChange={(e) => setPayoutAmount(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#e5e7eb] text-xs focus:outline-none focus:ring-2 focus:ring-[#0558ff]/30 focus:border-[#0558ff]"
              />
            </div>
          )}

          <label className="block text-xs font-semibold text-[#525252] uppercase tracking-wide mb-1.5">
            Reviewer Decision Notes (Sent to Customer in Email) *
          </label>
          <textarea
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-[#e5e7eb] text-xs focus:outline-none focus:ring-2 focus:ring-[#0558ff]/30 focus:border-[#0558ff] resize-none transition"
            placeholder="Explain why this claim is approved, denied, or escalated. This text will be delivered directly in the customer's notification email..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />

          {/* Email Recipient Notice */}
          <div className="my-3 p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2.5 text-[11px] text-slate-600">
            <Mail className="w-4 h-4 text-[#fb651e] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900">Email will be sent to:</span>{" "}
              <span className="font-mono text-slate-800">{claim.customerEmail}</span>
              <p className="text-[10px] text-slate-400 mt-0.5">
                The customer will receive the decision badge, reviewer notes, and a live claim tracking link.
              </p>
            </div>
          </div>

          <button
            onClick={submitOverride}
            disabled={!reason.trim() || loading}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-[#fb651e] to-[#ea580c] hover:opacity-95 text-white font-semibold text-xs disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 shadow-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Finalizing & Dispatching Email...
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" /> Submit Review & Send Email
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
