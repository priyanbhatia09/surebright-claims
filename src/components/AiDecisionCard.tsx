"use client";

import { AiDecision } from "@/lib/db";
import { formatDateTime } from "@/lib/date";
import { CheckCircle2, XCircle, AlertTriangle, Brain, ShieldCheck, AlertOctagon } from "lucide-react";

function ConfidenceBar({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const color = pct >= 80 ? "#16a34a" : pct >= 65 ? "#d97706" : "#dc2626";
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs text-[#525252] font-medium">AI Confidence</span>
        <span className="text-sm font-bold" style={{ color }}>{pct}%</span>
      </div>
      <div className="h-2 bg-[#f0efe7] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

const ACTION_CONFIG = {
  approve: {
    icon: CheckCircle2,
    label: "AI Recommends: APPROVE",
    bgClass: "bg-green-50 border-green-200",
    iconClass: "text-green-600",
    labelClass: "text-green-800",
  },
  deny: {
    icon: XCircle,
    label: "AI Recommends: DENY",
    bgClass: "bg-red-50 border-red-200",
    iconClass: "text-red-600",
    labelClass: "text-red-800",
  },
  escalate: {
    icon: AlertTriangle,
    label: "AI Recommends: ESCALATE",
    bgClass: "bg-amber-50 border-amber-200",
    iconClass: "text-amber-600",
    labelClass: "text-amber-800",
  },
};

export default function AiDecisionCard({ decision }: { decision: AiDecision }) {
  const cfg = ACTION_CONFIG[decision.recommendedAction];
  const Icon = cfg.icon;

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#e5e7eb] flex items-center gap-2">
        <Brain className="w-5 h-5 text-[#0558ff]" />
        <h3 className="font-semibold text-[#151515]">AI Adjudication Result</h3>
        <span className="ml-auto text-xs text-[#737373]" suppressHydrationWarning>
          {formatDateTime(decision.decidedAt)}
        </span>
      </div>

      <div className="p-6 space-y-5">
        {/* Decision Banner */}
        <div className={`flex items-center gap-3 p-4 rounded-xl border ${cfg.bgClass}`}>
          <Icon className={`w-6 h-6 flex-shrink-0 ${cfg.iconClass}`} />
          <div>
            <p className={`font-bold text-sm ${cfg.labelClass}`}>{cfg.label}</p>
            <p className="text-xs text-[#525252] mt-0.5">
              {decision.claimType.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} · Severity: {decision.severity.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Confidence Bar */}
        <ConfidenceBar value={decision.confidence} />

        {/* Reasoning */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Brain className="w-3.5 h-3.5 text-[#737373]" />
            <span className="text-xs font-semibold text-[#525252] uppercase tracking-wide">AI Reasoning</span>
          </div>
          <p className="text-sm text-[#151515] leading-relaxed bg-[#f5f5ee] p-4 rounded-xl">
            {decision.reasoning}
          </p>
        </div>

        {/* Policy Reference */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#737373]" />
            <span className="text-xs font-semibold text-[#525252] uppercase tracking-wide">Policy Reference</span>
          </div>
          <p className="text-sm text-[#0558ff] font-medium bg-[#eff4ff] px-4 py-2.5 rounded-xl">
            {decision.policyReference}
          </p>
        </div>

        {/* Red Flags */}
        {decision.redFlags.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <AlertOctagon className="w-3.5 h-3.5 text-[#dc2626]" />
              <span className="text-xs font-semibold text-[#525252] uppercase tracking-wide">Red Flags Detected</span>
            </div>
            <ul className="space-y-1.5">
              {decision.redFlags.map((flag, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#dc2626] bg-red-50 px-3 py-2 rounded-lg">
                  <span className="mt-0.5">⚠</span>
                  <span>{flag}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
