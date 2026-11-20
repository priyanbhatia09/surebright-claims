import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Shield, Zap, Eye, CheckCircle2, ArrowRight, Star } from "lucide-react";

const STATS = [
  { value: "2.3s", label: "Avg decision time" },
  { value: "89%", label: "Auto-adjudicated" },
  { value: "97%", label: "Customer satisfaction" },
  { value: "0", label: "Manual reviews needed for clear cases" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Submit Your Claim",
    desc: "Describe the issue, upload photos, and enter your order details. Takes under 2 minutes.",
    icon: "📝",
  },
  {
    step: "02",
    title: "AI Analysis",
    desc: "Our AI reads your claim against your warranty policy and classifies the issue in seconds.",
    icon: "🤖",
  },
  {
    step: "03",
    title: "Instant Decision",
    desc: "Get an approve, deny, or escalate decision with full reasoning — no black boxes.",
    icon: "⚡",
  },
  {
    step: "04",
    title: "Resolution",
    desc: "Approved claims move to fulfillment immediately. Every decision is fully auditable.",
    icon: "✅",
  },
];

const FEATURES = [
  {
    icon: Zap,
    title: "Instant Adjudication",
    desc: "AI reads your policy and decides in seconds. No waiting days for a human to review a clear-cut claim.",
  },
  {
    icon: Eye,
    title: "Full Transparency",
    desc: "Every decision comes with the AI's reasoning chain, policy reference, and confidence score. No black boxes.",
  },
  {
    icon: Shield,
    title: "Smart Guardrails",
    desc: "Low-confidence decisions auto-escalate to human review. AI handles certainty, humans handle nuance.",
  },
  {
    icon: CheckCircle2,
    title: "Complete Audit Trail",
    desc: "Every action — submission, AI decision, human override — is logged with timestamps for full compliance.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6 py-28 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white border border-[#e5e7eb] rounded-full px-4 py-1.5 text-sm text-[#525252] mb-8 shadow-sm">
            <span className="w-2 h-2 bg-[#16a34a] rounded-full animate-pulse" />
            AI-native claims platform — decisions in seconds
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-[#151515] tracking-tight leading-[1.08] max-w-4xl mx-auto">
            Warranty claims that are{" "}
            <span className="bg-gradient-to-r from-[#0558ff] to-[#8006dc] bg-clip-text text-transparent">
              fast, fair, and transparent
            </span>
          </h1>

          <p className="mt-6 text-xl text-[#525252] max-w-2xl mx-auto leading-relaxed">
            SureBright's AI reads your warranty policy and decides your claim in seconds — with full reasoning,
            policy citations, and an audit trail you can trust.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link
              href="/claims/new"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#0558ff] text-white font-semibold text-base hover:bg-[#0046d6] transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5"
            >
              File a Claim
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-[#e5e7eb] text-[#151515] font-semibold text-base hover:bg-[#f5f5ee] transition-all"
            >
              View Admin Dashboard
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-3xl mx-auto">
            {STATS.map((s) => (
              <div key={s.label} className="bg-white rounded-2xl border border-[#e5e7eb] p-5 shadow-sm text-center">
                <div className="text-3xl font-bold text-[#151515]">{s.value}</div>
                <div className="text-xs text-[#737373] mt-1 leading-tight">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-[#f5f5ee]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold text-[#0558ff] uppercase tracking-widest">Process</span>
            <h2 className="text-4xl font-bold text-[#151515] mt-2 tracking-tight">How it works</h2>
            <p className="text-[#525252] mt-3 text-lg">From submission to resolution in minutes, not days.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className="bg-white rounded-2xl p-6 border border-[#e6e4dc] shadow-sm relative">
                <div className="text-3xl mb-3">{step.icon}</div>
                <span className="text-xs font-bold text-[#b0aaa0] tracking-widest">{step.step}</span>
                <h3 className="font-bold text-[#151515] text-lg mt-1 mb-2">{step.title}</h3>
                <p className="text-sm text-[#525252] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-[#fcfcfc]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold text-[#fb651e] uppercase tracking-widest">Why SureBright</span>
            <h2 className="text-4xl font-bold text-[#151515] mt-2 tracking-tight">Built different</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="bg-white rounded-2xl p-7 border border-[#e5e7eb] hover:shadow-md transition-shadow flex gap-5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0558ff]/10 to-[#8006dc]/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-[#0558ff]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#151515] text-lg mb-1">{f.title}</h3>
                    <p className="text-[#525252] leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-[#f5f5ee]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { quote: "Got my TV replacement approved in literally 4 seconds. I've never had a claim go this smoothly.", name: "Arjun S.", product: "Samsung QLED TV" },
              { quote: "The AI explained exactly why my claim was approved and cited the policy section. Total transparency.", name: "Meera P.", product: "LG Refrigerator" },
              { quote: "Even when it escalated, I knew exactly what more info was needed. No mysterious black boxes.", name: "Priya N.", product: "Dyson Vacuum" },
            ].map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 border border-[#e6e4dc] shadow-sm">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-[#fb651e] text-[#fb651e]" />)}
                </div>
                <p className="text-[#151515] text-sm leading-relaxed mb-4">"{t.quote}"</p>
                <div>
                  <p className="font-semibold text-[#151515] text-sm">{t.name}</p>
                  <p className="text-xs text-[#737373]">{t.product}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#090f19]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white tracking-tight">Ready to file your claim?</h2>
          <p className="text-white/60 mt-4 text-lg">AI decision in seconds. Full transparency. No surprises.</p>
          <Link
            href="/claims/new"
            className="inline-flex items-center gap-2 mt-8 px-8 py-4 rounded-full bg-[#0558ff] text-white font-semibold text-base hover:bg-[#0046d6] transition-all shadow-lg shadow-blue-900/50"
          >
            File a Claim Now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#090f19] border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#8006dc] to-[#0558ff] flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-white">Sure<span className="text-[#0558ff]">Bright</span></span>
          </div>
          <p className="text-white/40 text-sm">© 2024 SureBright. AI-native warranty platform.</p>
          <div className="flex gap-4 text-white/40 text-sm">
            <span className="hover:text-white/70 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-white/70 cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-white/70 cursor-pointer transition-colors">Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
