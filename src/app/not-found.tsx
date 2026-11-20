import Link from "next/link";
import { Shield } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fcfcfc] flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8006dc] to-[#0558ff] flex items-center justify-center shadow-lg mb-6">
        <Shield className="w-8 h-8 text-white" />
      </div>
      <h1 className="text-6xl font-bold text-[#151515] tracking-tight mb-3">404</h1>
      <p className="text-xl text-[#525252] mb-2">Page not found</p>
      <p className="text-[#737373] text-sm mb-8 max-w-sm">
        The page you're looking for doesn't exist. It may have been moved or the claim ID is invalid.
      </p>
      <div className="flex gap-3">
        <Link
          href="/"
          className="px-6 py-2.5 rounded-full bg-[#0558ff] text-white font-semibold text-sm hover:bg-[#0046d6] transition"
        >
          Go Home
        </Link>
        <Link
          href="/admin"
          className="px-6 py-2.5 rounded-full border border-[#e5e7eb] text-[#151515] font-semibold text-sm hover:bg-[#f5f5ee] transition"
        >
          Admin Dashboard
        </Link>
      </div>
    </div>
  );
}
