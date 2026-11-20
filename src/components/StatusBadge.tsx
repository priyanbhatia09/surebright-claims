import { Claim } from "@/lib/db";

type Status = Claim["status"];

const STATUS_CONFIG: Record<Status, { label: string; className: string }> = {
  pending:      { label: "Pending",      className: "bg-gray-100 text-gray-700" },
  under_review: { label: "Under Review", className: "bg-blue-50 text-blue-700" },
  approved:     { label: "Approved",     className: "bg-green-50 text-green-700" },
  denied:       { label: "Denied",       className: "bg-red-50 text-red-700" },
  escalated:    { label: "Escalated",    className: "bg-amber-50 text-amber-700" },
};

export function StatusBadge({ status }: { status: Status }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}
