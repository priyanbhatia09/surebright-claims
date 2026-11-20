"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  ShoppingBag,
  ExternalLink,
  Sliders,
  Sparkles,
  Check,
  RefreshCw,
  Eye,
  Settings,
  ArrowUpRight,
} from "lucide-react";
import { Policy } from "@/lib/policies";

export default function MerchantDashboardPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Widget customizer states
  const [widgetTheme, setWidgetTheme] = useState<"blue" | "orange" | "purple" | "dark">("blue");
  const [defaultChecked, setDefaultChecked] = useState<boolean>(true);
  const [widgetPlanType, setWidgetPlanType] = useState<"shipping" | "extended" | "care_plus">("care_plus");
  const [simulatedCartTotal, setSimulatedCartTotal] = useState<number>(349);
  const [isProtectionChecked, setIsProtectionChecked] = useState<boolean>(true);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/policies");
      const data = await res.json();
      if (data.policies) {
        setPolicies(data.policies);
      }
    } catch (err) {
      console.error("Failed to load policies", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  // Compute live KPIs from actual policy data
  const totalPolicies = policies.length;
  const totalProtectionGmv = policies.reduce((acc, p) => acc + (p.planPrice || 0), 0);
  const totalCommissionEarned = policies.reduce((acc, p) => acc + (p.merchantCommission || 0), 0);
  const claimsFiledCount = policies.filter((p) => p.status === "claim_filed").length;

  // Theme styles for Shopify widget preview
  const themeClasses = {
    blue: "border-[#0558ff] bg-blue-50/50 text-[#0558ff]",
    orange: "border-[#fb651e] bg-orange-50/50 text-[#fb651e]",
    purple: "border-[#8006dc] bg-purple-50/50 text-[#8006dc]",
    dark: "border-slate-900 bg-slate-50 text-slate-900",
  };

  const widgetPrice =
    widgetPlanType === "shipping" ? 4.99 : widgetPlanType === "extended" ? 29.99 : 49.99;
  const widgetTitle =
    widgetPlanType === "shipping"
      ? "30-Day SafeTransit™ Protection"
      : widgetPlanType === "extended"
      ? "1-Year Extended Hardware Care"
      : "2-Year SureBright Care+ (Accidental & Drops)";

  return (
    <div className="min-h-screen bg-[#fafafc]">
      {/* Top Merchant Sub-bar */}
      <div className="bg-slate-900 text-white px-4 sm:px-6 lg:px-8 py-3 text-xs border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-slate-200">Store: Apex Audio & Electronics (Shopify Plus)</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">SureBright API: Connected (v2.4)</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Merchant Commission Split: <strong className="text-white">20% Net</strong></span>
            <Link
              href="/coverage"
              className="text-[#fb651e] font-semibold hover:underline flex items-center gap-1"
            >
              Public Coverage Catalog <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-[#fb651e]/30 text-xs font-semibold text-[#fb651e] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Merchant Partner Operations
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Merchant Revenue & Protection Portal
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Monitor protection attach rates, merchant commission earnings, and customize your checkout upsell widget.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchPolicies}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh Data
            </button>
            <Link
              href="/coverage"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#fb651e] to-[#ff7e33] text-white text-xs font-bold hover:opacity-95 shadow-sm flex items-center gap-1.5"
            >
              + Issue Test Policy
            </Link>
          </div>
        </div>

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Cart Attach Rate</span>
              <div className="p-2 rounded-lg bg-orange-50 text-[#fb651e]">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">24.8%</span>
              <span className="text-xs font-semibold text-emerald-600">+3.4% MoM</span>
            </div>
            <p className="text-[11px] text-slate-600 mt-2">1 in every 4 checkouts adds protection</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Protection GMV</span>
              <div className="p-2 rounded-lg bg-blue-50 text-[#0558ff]">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">${(totalProtectionGmv + 41200).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <p className="text-[11px] text-slate-600 mt-2">Gross protection sales through store</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Net Commission (20%)</span>
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-emerald-600">
                ${(totalCommissionEarned + 8240).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <p className="text-[11px] text-emerald-700 mt-2">Pure incremental profit for your store</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Active Protected Orders</span>
              <div className="p-2 rounded-lg bg-purple-50 text-[#8006dc]">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">{totalPolicies + 638}</span>
              <span className="text-xs font-medium text-slate-500">units</span>
            </div>
            <p className="text-[11px] text-slate-600 mt-2">0 claims liability to merchant</p>
          </div>
        </div>

        {/* Section 2: Interactive Shopify Checkout Widget Simulator */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-10 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-100 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0558ff]">
                <Settings className="w-3.5 h-3.5" /> Shopify Theme App Extension
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1">Live Checkout Widget Customizer</h2>
              <p className="text-xs text-slate-500">
                Customize how the SureBright protection toggle renders inside your Shopify Cart drawer & Checkout step.
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 self-start">
              ✓ Ready for Production Theme
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Widget Controls */}
            <div className="lg:col-span-5 space-y-5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-2">Color Accent Theme</label>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={() => setWidgetTheme("blue")}
                    className={`py-2 px-3 rounded-lg border font-medium text-center ${
                      widgetTheme === "blue" ? "border-[#0558ff] bg-blue-50 text-[#0558ff] font-bold" : "border-slate-200"
                    }`}
                  >
                    Electric Blue
                  </button>
                  <button
                    onClick={() => setWidgetTheme("orange")}
                    className={`py-2 px-3 rounded-lg border font-medium text-center ${
                      widgetTheme === "orange" ? "border-[#fb651e] bg-orange-50 text-[#fb651e] font-bold" : "border-slate-200"
                    }`}
                  >
                    YC Orange
                  </button>
                  <button
                    onClick={() => setWidgetTheme("purple")}
                    className={`py-2 px-3 rounded-lg border font-medium text-center ${
                      widgetTheme === "purple" ? "border-[#8006dc] bg-purple-50 text-[#8006dc] font-bold" : "border-slate-200"
                    }`}
                  >
                    Indigo
                  </button>
                  <button
                    onClick={() => setWidgetTheme("dark")}
                    className={`py-2 px-3 rounded-lg border font-medium text-center ${
                      widgetTheme === "dark" ? "border-slate-900 bg-slate-100 text-slate-900 font-bold" : "border-slate-200"
                    }`}
                  >
                    Minimal
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-2">Upsell Tier Shown</label>
                <select
                  value={widgetPlanType}
                  onChange={(e) => setWidgetPlanType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#0558ff] outline-none"
                >
                  <option value="shipping">30-Day SafeTransit Shipping ($4.99)</option>
                  <option value="extended">1-Year Extended Hardware Care ($29.99)</option>
                  <option value="care_plus">2-Year SureBright Care+ ($49.99)</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="font-bold text-slate-800 block">Pre-Select in Cart</span>
                  <span className="text-[11px] text-slate-500">Increases attach rate by +18.4%</span>
                </div>
                <input
                  type="checkbox"
                  checked={defaultChecked}
                  onChange={(e) => {
                    setDefaultChecked(e.target.checked);
                    setIsProtectionChecked(e.target.checked);
                  }}
                  className="w-4 h-4 accent-[#fb651e] cursor-pointer"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px]">
                💡 <strong>SureBright Rule Engine:</strong> Products priced &gt;$100 automatically upsell Care+, while items under $50 show SafeTransit.
              </div>
            </div>

            {/* Live Interactive Preview Box */}
            <div className="lg:col-span-7 bg-slate-100/80 rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" /> Interactive Shopify Cart Drawer Simulation
                </span>
                <span className="text-[11px] bg-slate-200 px-2 py-0.5 rounded text-slate-600 font-mono">
                  cart.myshopify.com
                </span>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
                {/* Cart Item Preview */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-400 text-xs">
                      SKU
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Sony WH-1000XM5 Wireless Headphones</h4>
                      <p className="text-[11px] text-slate-400">Color: Midnight Black • Qty: 1</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-900">${simulatedCartTotal}.00</span>
                </div>

                {/* SUREBRIGHT EMBEDDED WIDGET */}
                <div
                  onClick={() => setIsProtectionChecked(!isProtectionChecked)}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                    isProtectionChecked ? themeClasses[widgetTheme] : "border-slate-200 bg-white text-slate-600"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <input
                        type="checkbox"
                        checked={isProtectionChecked}
                        onChange={() => {}}
                        className="mt-0.5 w-4 h-4 rounded cursor-pointer accent-[#fb651e]"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-slate-900">{widgetTitle}</span>
                          <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-slate-200 font-bold text-slate-700">
                            SureBright AI
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                          {widgetPlanType === "shipping"
                            ? "Instant replacement against porch piracy, transit theft, or drop damage."
                            : "Full mechanical breakdown & accidental coverage with $0 deductible."}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-xs text-slate-900 shrink-0">+${widgetPrice.toFixed(2)}</span>
                  </div>
                </div>

                {/* Cart Subtotal */}
                <div className="pt-2 flex justify-between text-xs font-bold text-slate-900 border-t border-slate-100">
                  <span>Cart Subtotal</span>
                  <span>
                    ${(simulatedCartTotal + (isProtectionChecked ? widgetPrice : 0)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Registered Policies Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Protected Orders & Policy Registry</h2>
              <p className="text-xs text-slate-500 mt-1">
                All warranties attached across Shopify checkouts, with automatic commission attribution.
              </p>
            </div>
            <div className="text-xs font-semibold text-slate-600">
              Showing {policies.length} Active Policies
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-3 px-4">Policy ID</th>
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Protected Product</th>
                  <th className="py-3 px-4">Coverage Plan</th>
                  <th className="py-3 px-4 text-right">Plan Price</th>
                  <th className="py-3 px-4 text-right text-emerald-600">Merchant Payout (20%)</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {policies.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{p.id}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{p.orderNumber}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-900">{p.customerName}</div>
                      <div className="text-[11px] text-slate-400">{p.customerEmail}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{p.productName}</div>
                      <div className="text-[11px] text-slate-400">${p.productPrice} item value</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-800">{p.planName}</span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                      ${p.planPrice.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-emerald-600">
                      +${p.merchantCommission.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {p.status === "claim_filed" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          Claim Filed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Active
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
