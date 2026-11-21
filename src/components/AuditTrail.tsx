"use client";

import { AuditEntry } from "@/lib/db";
import { formatDateTime } from "@/lib/date";
import { User, Bot, Shield, Clock, Mail } from "lucide-react";

const ACTOR_CONFIG = {
  customer: { icon: User, label: "Customer", color: "text-[#0558ff]", bg: "bg-[#eff4ff]" },
  ai: { icon: Bot, label: "AI", color: "text-[#8006dc]", bg: "bg-purple-50" },
  admin: { icon: Shield, label: "Admin", color: "text-[#d97706]", bg: "bg-amber-50" },
  system: { icon: Mail, label: "System Notification", color: "text-emerald-600", bg: "bg-emerald-50" },
};

export default function AuditTrail({ entries }: { entries: AuditEntry[] }) {
  return (
    <div className="bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-[#e5e7eb] flex items-center gap-2">
        <Clock className="w-5 h-5 text-[#737373]" />
        <h3 className="font-semibold text-[#151515]">Audit Trail</h3>
        <span className="ml-auto text-xs text-[#737373]">{entries.length} events</span>
      </div>
      <div className="divide-y divide-[#f0efe7]">
        {entries.map((entry, i) => {
          const cfg = ACTOR_CONFIG[entry.actor];
          const Icon = cfg.icon;
          return (
            <div key={i} className="px-6 py-4 flex gap-4 hover:bg-[#fafaf8] transition-colors">
              <div className={`w-8 h-8 rounded-full ${cfg.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                <Icon className={`w-4 h-4 ${cfg.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs font-semibold uppercase tracking-wide ${cfg.color}`}>{cfg.label}</span>
                  <span className="text-sm font-medium text-[#151515]">{entry.action}</span>
                </div>
                <p className="text-sm text-[#525252] mt-0.5 leading-relaxed">{entry.details}</p>
                <p className="text-xs text-[#9b9b9b] mt-1" suppressHydrationWarning>{formatDateTime(entry.timestamp)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
