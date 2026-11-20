"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Percent,
  Zap,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  BarChart3,
  DollarSign,
  Clock,
  Check,
} from "lucide-react";

export default function PartnersPage() {
  // Calculator state
  const [monthlyOrders, setMonthlyOrders] = useState<number>(3500);
  const [aov, setAov] = useState<number>(140);
  const [attachRate, setAttachRate] = useState<number>(22);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [storeUrl, setStoreUrl] = useState<string>("");
  const [merchantEmail, setMerchantEmail] = useState<string>("");

  // Calculations
  const warrantyUnits = Math.round(monthlyOrders * (attachRate / 100));
  const avgWarrantyPrice = Math.max(9.99, Math.round(aov * 0.11 * 100) / 100);
  const totalWarrantyGmv = Math.round(warrantyUnits * avgWarrantyPrice);
  const monthlyProfit = Math.round(totalWarrantyGmv * 0.20);
  const annualProfit = monthlyProfit * 12;
  const hoursSaved = Math.round(warrantyUnits * 0.35);

  return (
    <div className="min-h-screen bg-[#fafafc]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200/80 pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(#0558ff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-[#fb651e]/30 text-xs font-semibold text-[#fb651e] mb-6">
            <span className="w-2 h-2 rounded-full bg-[#fb651e] animate-pulse" />
            SureBright Partner Ecosystem • 20% Net Margin
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Turn Warranty Protection Into A{" "}
            <span className="bg-gradient-to-r from-[#0558ff] via-[#8006dc] to-[#fb651e] bg-clip-text text-transparent">
              High-Margin Profit Engine
            </span>
          </h1>
          <p className="mt-5 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Embed AI-native warranties and shipping protection directly into your checkout in 5 minutes. You keep 20% pure commission. SureBright handles 100% of claims and underwriting.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#calculator"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#fb651e] to-[#ff7e33] hover:opacity-95 text-white font-bold text-sm shadow-md flex items-center gap-2"
            >
              <DollarSign className="w-4 h-4" />
              Calculate Your Revenue
            </a>
            <Link
              href="/merchant"
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-sm flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Explore Merchant Portal
            </Link>
          </div>

          {/* Social Proof Stats */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80">
              <span className="block text-2xl font-black text-slate-900">20%</span>
              <span className="text-xs text-slate-500 font-medium">Net Commission on Every Policy</span>
            </div>
            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80">
              <span className="block text-2xl font-black text-[#0558ff]">60%</span>
              <span className="text-xs text-slate-500 font-medium">Fewer Customer Support Tickets</span>
            </div>
            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80">
              <span className="block text-2xl font-black text-[#fb651e]">24.8%</span>
              <span className="text-xs text-slate-500 font-medium">Average Cart Attach Rate</span>
            </div>
            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80">
              <span className="block text-2xl font-black text-emerald-600">$0</span>
              <span className="text-xs text-slate-500 font-medium">Integration Fee & Zero Liability</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive ROI Calculator */}
      <section id="calculator" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#fb651e]">Real-Time Financial Model</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Merchant Earnings & ROI Calculator</h2>
            <p className="text-sm text-slate-500 mt-2">
              Adjust your monthly order volume and average basket size to see your estimated net payout.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Sliders Form */}
            <div className="lg:col-span-7 space-y-8">
              {/* Slider 1: Monthly Orders */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-slate-800">Monthly Orders</label>
                  <span className="text-lg font-black text-[#0558ff]">{monthlyOrders.toLocaleString()} orders</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="25000"
                  step="250"
                  value={monthlyOrders}
                  onChange={(e) => setMonthlyOrders(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0558ff]"
                />
                <div className="flex justify-between text-xs text-slate-600 mt-1">
                  <span>500</span>
                  <span>5,000</span>
                  <span>15,000</span>
                  <span>25,000+</span>
                </div>
              </div>

              {/* Slider 2: Average Order Value */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-slate-800">Average Order Value (AOV)</label>
                  <span className="text-lg font-black text-[#8006dc]">${aov}</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="600"
                  step="10"
                  value={aov}
                  onChange={(e) => setAov(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#8006dc]"
                />
                <div className="flex justify-between text-xs text-slate-600 mt-1">
                  <span>$30</span>
                  <span>$150</span>
                  <span>$350</span>
                  <span>$600</span>
                </div>
              </div>

              {/* Slider 3: Attach Rate */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-slate-800">Projected Attach Rate</label>
                  <span className="text-lg font-black text-[#fb651e]">{attachRate}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="40"
                  step="1"
                  value={attachRate}
                  onChange={(e) => setAttachRate(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#fb651e]"
                />
                <div className="flex justify-between text-xs text-slate-600 mt-1">
                  <span>10% (Conservative)</span>
                  <span>22% (Average)</span>
                  <span>40% (Top Performer)</span>
                </div>
              </div>
            </div>

            {/* Results Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white rounded-2xl p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#fb651e]/20 rounded-full blur-2xl pointer-events-none" />

              <span className="text-xs font-bold uppercase tracking-wider text-[#fb651e]">Your Net Earnings</span>

              <div className="mt-4 mb-6 pb-6 border-b border-slate-800">
                <span className="text-xs text-slate-400 block font-medium">Estimated Annual Profit</span>
                <span className="text-4xl font-black text-emerald-400 mt-1 block">
                  ${annualProfit.toLocaleString()}
                </span>
                <span className="text-xs text-slate-400 mt-1 block">
                  or <strong>${monthlyProfit.toLocaleString()}</strong> every month in pure commission
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">Monthly Policies Sold:</span>
                  <span className="font-bold text-white">{warrantyUnits.toLocaleString()} units</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">Total Protection GMV:</span>
                  <span className="font-bold text-white">${totalWarrantyGmv.toLocaleString()}/mo</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">Support Hours Saved:</span>
                  <span className="font-bold text-amber-300">~{hoursSaved} hrs/mo</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400">Claims Liability:</span>
                  <span className="font-bold text-emerald-400">$0 (SureBright Underwritten)</span>
                </div>
              </div>

              <Link
                href="/merchant"
                className="mt-6 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#fb651e] to-[#ff7e33] text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-95 shadow-md"
              >
                Go to Live Merchant Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Brands Partner With SureBright */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900">Why Top Direct-to-Consumer Brands Choose SureBright</h2>
          <p className="text-sm text-slate-500 mt-2">
            An end-to-end infrastructure built for seamless customer experience and revenue growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200">
            <div className="w-12 h-12 bg-blue-50 text-[#0558ff] rounded-xl flex items-center justify-center mb-5">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">5-Minute Shopify Install</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Native theme app extension. Automatically maps warranty pricing based on SKU price bands with no code required.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200">
            <div className="w-12 h-12 bg-purple-50 text-[#8006dc] rounded-xl flex items-center justify-center mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">AI-First Claims Handling</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Customers file claims on our branded portal. Multimodal AI verifies order receipts, damages, and serials in seconds without bothering your team.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200">
            <div className="w-12 h-12 bg-orange-50 text-[#fb651e] rounded-xl flex items-center justify-center mb-5">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Automated Monthly Payouts</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Track real-time attach rates, gross protection sales, and receive direct ACH/Stripe deposits on the 1st of every month.
            </p>
          </div>
        </div>
      </section>

      {/* Lead Capture Form */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#fb651e]">Get Integrated</span>
            <h2 className="text-3xl font-extrabold mt-1">Ready to launch SureBright on your store?</h2>
            <p className="text-xs text-slate-300 mt-2">
              Request merchant sandbox access or schedule an API integration walkthrough.
            </p>
          </div>

          {isSubmitted ? (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center max-w-md mx-auto border border-white/20">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h4 className="text-lg font-bold text-white">Merchant Sandbox Access Granted!</h4>
              <p className="text-xs text-slate-300 mt-1">
                We’ve provisioned a demo store API key for <strong>{storeUrl || "your store"}</strong>.
              </p>
              <Link
                href="/merchant"
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#fb651e] text-white text-xs font-bold hover:opacity-90"
              >
                Open Merchant Dashboard <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsSubmitted(true);
              }}
              className="max-w-md mx-auto space-y-4"
            >
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Store Website / Shopify URL</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. mystore.myshopify.com"
                  value={storeUrl}
                  onChange={(e) => setStoreUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs focus:ring-2 focus:ring-[#fb651e] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  placeholder="founder@mystore.com"
                  value={merchantEmail}
                  onChange={(e) => setMerchantEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs focus:ring-2 focus:ring-[#fb651e] outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#fb651e] to-[#ff7e33] text-white font-bold text-xs uppercase tracking-wider hover:opacity-95 shadow-md transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                Claim 20% Commission Partner Access
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
