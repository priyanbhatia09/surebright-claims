import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Shield, Zap, Eye, CheckCircle2, ArrowRight, Star } from "lucide-react";

const STATS = [
  { value: "2.3s", label: "Avg decision time", accent: "text-[#0558ff]" },
  { value: "89%", label: "Auto-adjudicated", accent: "text-[#fb651e]" },
  { value: "97%", label: "Customer satisfaction", accent: "text-[#16a34a]" },
  { value: "0", label: "Manual steps for clear cases", accent: "text-[#8006dc]" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Submit Your Claim",
    desc: "Describe the issue, upload photos, and enter your order details. Takes under 2 minutes.",
    icon: "📝",
    tagColor: "bg-blue-50 text-[#0558ff] border-blue-100",
  },
  {
    step: "02",
    title: "AI Analysis",
    desc: "Our AI reads your claim against your warranty policy and classifies the issue in seconds.",
    icon: "🤖",
    tagColor: "bg-purple-50 text-[#8006dc] border-purple-100",
  },
  {
    step: "03",
    title: "Instant Decision",
    desc: "Get an approve, deny, or escalate decision with full reasoning — no black boxes.",
    icon: "⚡",
    tagColor: "bg-orange-50 text-[#fb651e] border-orange-200",
  },
  {
    step: "04",
    title: "Resolution",
    desc: "Approved claims move to fulfillment immediately. Every decision is fully auditable.",
    icon: "✅",
    tagColor: "bg-green-50 text-[#16a34a] border-green-100",
  },
];

const FEATURES = [
  {
    icon: Zap,
    title: "Instant Adjudication",
    desc: "AI reads your policy and decides in seconds. No waiting days for a human to review a clear-cut claim.",
    accent: "text-[#fb651e]",
    bg: "bg-orange-500/10",
  },
  {
    icon: Eye,
    title: "Full Transparency",
    desc: "Every decision comes with the AI's reasoning chain, policy reference, and confidence score. No black boxes.",
    accent: "text-[#0558ff]",
    bg: "bg-[#0558ff]/10",
  },
  {
    icon: Shield,
    title: "Smart Guardrails",
    desc: "Low-confidence decisions auto-escalate to human review. AI handles certainty, humans handle nuance.",
    accent: "text-[#8006dc]",
    bg: "bg-[#8006dc]/10",
  },
  {
    icon: CheckCircle2,
    title: "Complete Audit Trail",
    desc: "Every action — submission, AI decision, human override — is logged with timestamps for full compliance.",
    accent: "text-[#16a34a]",
    bg: "bg-[#16a34a]/10",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">
          {/* YC + AI Badge */}
          <div className="inline-flex items-center gap-2 bg-[#fff7ed] border border-[#ffedd5] rounded-full px-4 py-1.5 text-sm text-[#9a3412] mb-8 shadow-xs">
            <span className="w-2 h-2 bg-[#fb651e] rounded-full animate-pulse" />
            <span className="font-bold text-[10px] tracking-wider uppercase bg-[#fb651e] text-white px-1.5 py-0.5 rounded">
              YC Alum
            </span>
            <span className="text-xs font-medium text-[#c2410c]">
              AI-native claims platform — decisions in seconds
            </span>
          </div>

          {/* Headline with SureBright Blue + Purple + YC Orange Gradient */}
          <h1 className="text-5xl md:text-7xl font-extrabold text-[#151515] tracking-tight leading-[1.08] max-w-4xl mx-auto">
            Warranty claims that are{" "}
            <span className="bg-gradient-to-r from-[#0558ff] via-[#8006dc] to-[#fb651e] bg-clip-text text-transparent">
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
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#fb651e] hover:bg-[#ea580c] text-white font-semibold text-base transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-500/35 hover:-translate-y-0.5"
            >
              File a Claim
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/coverage"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-[#0558ff] text-[#0558ff] hover:bg-blue-50 font-semibold text-base transition-all"
            >
              View Coverage Plans
            </Link>
            <Link
              href="/merchant"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-[#e5e7eb] hover:border-[#fb651e] text-[#151515] hover:text-[#fb651e] font-semibold text-base hover:bg-[#fff7ed]/50 transition-all"
            >
              Merchant Portal
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-3xl mx-auto">
            {STATS.map((s) => (
              <div key={s.label} className="bg-white rounded-2xl border border-[#e5e7eb] hover:border-[#fed7aa] p-5 shadow-xs hover:shadow-sm transition-all text-center">
                <div className={`text-3xl font-extrabold ${s.accent}`}>{s.value}</div>
                <div className="text-xs text-[#737373] mt-1 leading-tight">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works (YC Editorial Parchment Style) */}
      <section className="py-24 bg-[#f5f5ee] border-y border-[#e6e4dc]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-[#fb651e] uppercase tracking-widest bg-[#ffedd5] px-3 py-1 rounded-full border border-[#fed7aa]">
              Process
            </span>
            <h2 className="text-4xl font-bold text-[#151515] mt-3 tracking-tight">How it works</h2>
            <p className="text-[#525252] mt-3 text-lg">From submission to resolution in minutes, not days.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className="bg-white rounded-2xl p-6 border border-[#e6e4dc] hover:border-[#fed7aa] shadow-xs hover:shadow-sm transition-all relative">
                <div className="text-3xl mb-3">{step.icon}</div>
                <span className={`text-[11px] font-bold tracking-widest uppercase px-2 py-0.5 rounded border ${step.tagColor}`}>
                  Step {step.step}
                </span>
                <h3 className="font-bold text-[#151515] text-lg mt-3 mb-2">{step.title}</h3>
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
            <span className="text-xs font-bold text-[#0558ff] uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Why SureBright
            </span>
            <h2 className="text-4xl font-bold text-[#151515] mt-3 tracking-tight">Built different</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="bg-white rounded-2xl p-7 border border-[#e5e7eb] hover:border-[#fed7aa] hover:shadow-md transition-all flex gap-5">
                  <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-6 h-6 ${f.accent}`} />
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
      <section className="py-20 bg-[#f5f5ee] border-t border-[#e6e4dc]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { quote: "Got my TV replacement approved in literally 4 seconds. I've never had a claim go this smoothly.", name: "Arjun S.", product: "Samsung QLED TV" },
              { quote: "The AI explained exactly why my claim was approved and cited the policy section. Total transparency.", name: "Meera P.", product: "LG Refrigerator" },
              { quote: "Even when it escalated, I knew exactly what more info was needed. No mysterious black boxes.", name: "Priya N.", product: "Dyson Vacuum" },
            ].map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 border border-[#e6e4dc] hover:border-[#fed7aa] shadow-xs hover:shadow-sm transition-all">
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

      {/* Bottom CTA Banner (SureBright Blue to YC Orange Gradient) */}
      <section className="py-24 bg-[#090f19] relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#fb651e]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#0558ff]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Ready to file your claim?
          </h2>
          <p className="text-white/70 mt-4 text-lg">
            AI decision in seconds. Full transparency. No surprises.
          </p>
          <Link
            href="/claims/new"
            className="inline-flex items-center gap-2 mt-8 px-8 py-4 rounded-full bg-gradient-to-r from-[#fb651e] via-[#ea580c] to-[#0558ff] text-white font-semibold text-base hover:opacity-95 transition-all shadow-xl shadow-orange-500/20 hover:scale-[1.02]"
          >
            File a Claim Now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#090f19] border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#8006dc] via-[#0558ff] to-[#fb651e] flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-white tracking-tight">
              Sure<span className="text-[#0558ff]">Bright</span>
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#fb651e] text-white tracking-wider uppercase ml-1">
              YC
            </span>
          </div>
          <p className="text-white/40 text-sm">© 2024 SureBright. AI-native warranty platform.</p>
          <div className="flex flex-wrap gap-5 text-white/60 text-sm">
            <Link href="/coverage" className="hover:text-white transition-colors">Coverage Plans</Link>
            <Link href="/partners" className="hover:text-white transition-colors">For Partners</Link>
            <Link href="/merchant" className="hover:text-white transition-colors">Merchant Portal</Link>
            <Link href="/admin" className="hover:text-white transition-colors">Admin Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
