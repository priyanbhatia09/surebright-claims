import Link from "next/link";
import { Shield } from "lucide-react";

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
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8006dc] to-[#0558ff] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className={`font-bold text-lg tracking-tight ${isLight ? "text-[#151515]" : "text-white"}`}>
            Sure<span className="text-[#0558ff]">Bright</span>
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/claims" className={`text-sm font-medium transition-colors ${isLight ? "text-[#525252] hover:text-[#151515]" : "text-white/70 hover:text-white"}`}>My Claims</Link>
          {["Coverage", "Partners"].map((item) => (
            <span key={item} className={`text-sm font-medium cursor-pointer transition-colors ${isLight ? "text-[#525252] hover:text-[#151515]" : "text-white/70 hover:text-white"}`}>{item}</span>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className={`text-sm font-medium px-4 py-2 rounded-full border transition-colors ${
              isLight
                ? "border-[#e5e7eb] text-[#151515] hover:bg-[#f5f5ee]"
                : "border-white/20 text-white hover:bg-white/10"
            }`}
          >
            Admin
          </Link>
          <Link
            href="/claims/new"
            className="text-sm font-semibold px-5 py-2 rounded-full bg-[#0558ff] text-white hover:bg-[#0046d6] transition-colors shadow-sm"
          >
            File a Claim
          </Link>
        </div>
      </div>
    </nav>
  );
}
