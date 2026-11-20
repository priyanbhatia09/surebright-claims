import Link from "next/link";
import { Shield, Sparkles } from "lucide-react";

export default function Navbar({ variant = "light" }: { variant?: "light" | "dark" }) {
  const isLight = variant === "light";
  return (
    <nav
      className={`sticky top-0 z-50 border-b backdrop-blur-md ${
        isLight
          ? "bg-white/90 border-[#e5e7eb]"
          : "bg-[#090f19]/90 border-white/10"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo with YC + SureBright blend */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8006dc] via-[#0558ff] to-[#fb651e] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`font-bold text-lg tracking-tight ${isLight ? "text-[#151515]" : "text-white"}`}>
              Sure<span className="text-[#0558ff]">Bright</span>
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#fb651e] text-white tracking-wider uppercase shadow-xs">
              YC
            </span>
          </div>
        </Link>

        {/* Nav Links */}
        <div className="hidden lg:flex items-center gap-6">
          <Link
            href="/claims"
            className={`text-sm font-medium transition-colors ${
              isLight ? "text-slate-600 hover:text-slate-900" : "text-white/70 hover:text-white"
            }`}
          >
            My Claims
          </Link>
          <Link
            href="/coverage"
            className={`text-sm font-medium transition-colors ${
              isLight ? "text-slate-600 hover:text-[#0558ff]" : "text-white/70 hover:text-white"
            }`}
          >
            Coverage Plans
          </Link>
          <Link
            href="/partners"
            className={`text-sm font-medium transition-colors ${
              isLight ? "text-slate-600 hover:text-[#fb651e]" : "text-white/70 hover:text-white"
            }`}
          >
            For Partners
          </Link>
          <Link
            href="/merchant"
            className={`text-sm font-semibold transition-colors flex items-center gap-1 px-2.5 py-1 rounded-lg ${
              isLight
                ? "text-[#0558ff] bg-blue-50/80 hover:bg-blue-100/80"
                : "text-blue-400 bg-blue-900/30 hover:bg-blue-900/50"
            }`}
          >
            <Sparkles className="w-3 h-3 text-[#fb651e]" />
            Merchant Portal
          </Link>
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <Link
            href="/admin"
            className={`text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-full border transition-colors ${
              isLight
                ? "border-[#e5e7eb] text-[#151515] hover:bg-[#f5f5ee]"
                : "border-white/20 text-white hover:bg-white/10"
            }`}
          >
            Admin
          </Link>
          <Link
            href="/claims/new"
            className="text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2 rounded-full bg-[#fb651e] hover:bg-[#ea580c] text-white transition-all shadow-sm hover:shadow-orange-500/20"
          >
            File a Claim
          </Link>
        </div>
      </div>
    </nav>
  );
}
