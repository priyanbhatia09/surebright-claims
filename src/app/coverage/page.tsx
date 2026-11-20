"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Shield, Check, Zap, Sparkles, ArrowRight, CheckCircle2, AlertCircle, ShoppingCart } from "lucide-react";

export default function CoveragePage() {
  const [productPrice, setProductPrice] = useState<number>(750);
  const [selectedPlan, setSelectedPlan] = useState<"shipping" | "standard_1yr" | "premium_2yr" | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdPolicy, setCreatedPolicy] = useState<{ id: string; planName: string; expiryDate: string } | null>(null);

  // Form fields for purchase
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [productName, setProductName] = useState("");
  const [orderNumber, setOrderNumber] = useState("");

  // Dynamic pricing calculation
  const shippingPrice = Math.max(2.99, Math.min(29.99, Math.round(productPrice * 0.015 * 100) / 100));
  const standardPrice = Math.max(19.99, Math.round(productPrice * 0.075 * 100) / 100);
  const premiumPrice = Math.max(39.99, Math.round(productPrice * 0.135 * 100) / 100);

  const plans = [
    {
      id: "shipping" as const,
      name: "30-Day SafeTransit",
      tagline: "Essential shipping, porch piracy & delivery guarantee",
      badge: "Fastest Resolution",
      price: shippingPrice,
      duration: "30 Days from order delivery",
      accentColor: "border-slate-200 hover:border-slate-300",
      btnColor: "bg-slate-900 hover:bg-slate-800 text-white",
      features: [
        "100% Porch Piracy & theft protection",
        "Carrier transit damage coverage",
        "Lost in transit full reimbursement",
        "Instant re-order within 4 hours",
        "$0 deductible",
      ],
      notCovered: ["Post-delivery accidental drops", "Mechanical breakdown after 30 days"],
    },
    {
      id: "standard_1yr" as const,
      name: "1-Year Extended Care",
      tagline: "Total peace of mind against mechanical & electrical breakdown",
      badge: "Most Popular",
      isPopular: true,
      price: standardPrice,
      duration: "1 Year extended warranty",
      accentColor: "border-[#0558ff] ring-2 ring-[#0558ff]/30 shadow-lg shadow-blue-500/10",
      btnColor: "bg-[#0558ff] hover:bg-blue-700 text-white",
      features: [
        "Everything in SafeTransit for 30 days",
        "100% Mechanical & electrical failure coverage",
        "Internal power surge & capacitor failure",
        "Free prepaid roundtrip repair shipping",
        "Authorized OEM genuine parts only",
        "$0 deductible, unlimited repairs up to item value",
      ],
      notCovered: ["Cracked screens from drops", "Full water submersion"],
    },
    {
      id: "premium_2yr" as const,
      name: "2-Year SureBright Care+",
      tagline: "Ultimate accidental drops, liquid spills & hardware protection",
      badge: "Complete Shield",
      price: premiumPrice,
      duration: "2 Full Years of comprehensive protection",
      accentColor: "border-[#fb651e] ring-2 ring-[#fb651e]/30 shadow-lg shadow-orange-500/10",
      btnColor: "bg-gradient-to-r from-[#fb651e] to-[#ff7e33] hover:opacity-95 text-white",
      features: [
        "All 1-Year Extended Care benefits",
        "Accidental drops & cracked screens",
        "Liquid spills & accidental submersion",
        "Express replacement shipped in 24 hours",
        "Transferable if gifted or sold",
        "Priority 24/7 AI Adjudication & VIP Human Agent",
        "$0 deductible, up to 3 claims per policy",
      ],
      notCovered: ["Intentional damage or loss"],
    },
  ];

  const handleOpenPurchase = (planId: "shipping" | "standard_1yr" | "premium_2yr") => {
    setSelectedPlan(planId);
    setCreatedPolicy(null);
    setIsModalOpen(true);
  };

  const handlePurchaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    setIsSubmitting(true);
    const planObj = plans.find((p) => p.id === selectedPlan);
    if (!planObj) return;

    try {
      const res = await fetch("/api/policies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail,
          orderNumber: orderNumber || `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
          productName: productName || "Consumer Electronics Device",
          productPrice,
          planTier: selectedPlan,
          planName: planObj.name,
          planPrice: planObj.price,
        }),
      });

      const data = await res.json();
      if (res.ok && data.policy) {
        setCreatedPolicy({
          id: data.policy.id,
          planName: data.policy.planName,
          expiryDate: new Date(data.policy.expiryDate).toLocaleDateString(),
        });
      }
    } catch (err) {
      console.error(err);
      alert("Failed to create policy. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafc]">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200/80 pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(#0558ff0d_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 border border-[#fb651e]/30 text-xs font-semibold text-[#fb651e] mb-6">
            <span className="w-2 h-2 rounded-full bg-[#fb651e] animate-pulse" />
            AI-Native Warranty & Transit Protection
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Transparent Protection Plans,{" "}
            <span className="bg-gradient-to-r from-[#0558ff] via-[#8006dc] to-[#fb651e] bg-clip-text text-transparent">
              Zero Hidden Clauses
            </span>
          </h1>
          <p className="mt-5 text-lg text-slate-600 max-w-2xl mx-auto">
            Choose tailored coverage for your electronic devices, home appliances, and online purchases. Instant AI-powered claims approval in seconds.
          </p>

          {/* Dynamic Price Slider */}
          <div className="mt-12 bg-white rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-slate-700">Estimated Product Value</span>
              <span className="text-2xl font-black text-slate-900">${productPrice.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="50"
              max="2500"
              step="25"
              value={productPrice}
              onChange={(e) => setProductPrice(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#fb651e]"
            />
            <div className="flex justify-between text-xs text-slate-600 font-medium mt-2">
              <span>$50</span>
              <span>$500</span>
              <span>$1,000</span>
              <span>$1,750</span>
              <span>$2,500+</span>
            </div>
            <p className="mt-3 text-xs text-slate-600">
              Move the slider to dynamically view accurate pricing for your item value.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl p-8 border transition-all duration-300 flex flex-col justify-between ${plan.accentColor}`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#0558ff] to-[#8006dc] text-white text-xs font-bold py-1 px-4 rounded-full shadow-md uppercase tracking-wider">
                  Recommended
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    {plan.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-6 min-h-[32px]">{plan.tagline}</p>

                <div className="mb-6 pb-6 border-b border-slate-100">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-slate-900">${plan.price.toFixed(2)}</span>
                    <span className="text-xs text-slate-500 font-medium">/ one-time</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 font-medium">{plan.duration}</p>
                </div>

                <div className="space-y-3 mb-8">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-600">What’s covered:</p>
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <button
                  onClick={() => handleOpenPurchase(plan.id)}
                  className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-sm ${plan.btnColor}`}
                >
                  <Shield className="w-4 h-4" />
                  Get Protection Plan
                </button>
                <p className="text-center text-[11px] text-slate-600 mt-2">
                  Instant activation • Digital policy certificate
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Matrix */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-6 sm:p-8 border-b border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900">Side-by-Side Coverage Matrix</h2>
            <p className="text-sm text-slate-500 mt-1">
              Compare coverage details across all SureBright plans.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-xs font-semibold text-slate-600">
                  <th className="py-4 px-6">Coverage Feature</th>
                  <th className="py-4 px-6 text-center">SafeTransit</th>
                  <th className="py-4 px-6 text-center text-[#0558ff]">1-Yr Extended</th>
                  <th className="py-4 px-6 text-center text-[#fb651e]">2-Yr Care+</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                <tr>
                  <td className="py-4 px-6 font-medium text-slate-900">Porch Piracy & Theft</td>
                  <td className="py-4 px-6 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                  <td className="py-4 px-6 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                  <td className="py-4 px-6 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-slate-900">Courier Shipping Damage</td>
                  <td className="py-4 px-6 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                  <td className="py-4 px-6 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                  <td className="py-4 px-6 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-slate-900">Mechanical & Electrical Breakdown</td>
                  <td className="py-4 px-6 text-center text-slate-300">—</td>
                  <td className="py-4 px-6 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                  <td className="py-4 px-6 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-slate-900">Power Surge Protection</td>
                  <td className="py-4 px-6 text-center text-slate-300">—</td>
                  <td className="py-4 px-6 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                  <td className="py-4 px-6 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-slate-900">Accidental Drops & Screen Shatter</td>
                  <td className="py-4 px-6 text-center text-slate-300">—</td>
                  <td className="py-4 px-6 text-center text-slate-300">—</td>
                  <td className="py-4 px-6 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-slate-900">Liquid Spills & Submersion</td>
                  <td className="py-4 px-6 text-center text-slate-300">—</td>
                  <td className="py-4 px-6 text-center text-slate-300">—</td>
                  <td className="py-4 px-6 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-slate-900">Deductible</td>
                  <td className="py-4 px-6 text-center font-bold text-slate-900">$0</td>
                  <td className="py-4 px-6 text-center font-bold text-slate-900">$0</td>
                  <td className="py-4 px-6 text-center font-bold text-slate-900">$0</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-slate-900">Adjudication Speed</td>
                  <td className="py-4 px-6 text-center font-medium text-[#0558ff]">Under 30s</td>
                  <td className="py-4 px-6 text-center font-medium text-[#0558ff]">Under 45s</td>
                  <td className="py-4 px-6 text-center font-medium text-[#fb651e]">Instant Priority</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Purchase Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 text-lg font-bold"
            >
              ✕
            </button>

            {createdPolicy ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Protection Activated!</h3>
                <p className="text-sm text-slate-600 mt-2">
                  Your policy has been issued and stored in the SureBright registry.
                </p>

                <div className="my-6 p-4 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Policy Number:</span>
                    <span className="font-mono font-bold text-slate-900">{createdPolicy.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Plan:</span>
                    <span className="font-semibold text-slate-900">{createdPolicy.planName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Coverage Valid Until:</span>
                    <span className="font-semibold text-slate-900">{createdPolicy.expiryDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Status:</span>
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                  <Link
                    href={`/claims/new`}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#0558ff] to-[#8006dc] text-white font-semibold text-sm hover:opacity-95"
                  >
                    File a Claim with this Policy
                  </Link>
                  <Link
                    href="/merchant"
                    className="w-full py-2 px-4 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200"
                  >
                    View in Merchant Registry
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-2 text-[#fb651e] font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" /> SureBright Direct Warranty
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Activate {plans.find((p) => p.id === selectedPlan)?.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 mb-6">
                  One-time price of{" "}
                  <strong className="text-slate-900 text-sm">
                    ${plans.find((p) => p.id === selectedPlan)?.price.toFixed(2)}
                  </strong>{" "}
                  for your ${productPrice.toLocaleString()} product.
                </p>

                <form onSubmit={handlePurchaseSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0558ff] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="alex@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0558ff] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Product Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Apple Watch Ultra 2"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0558ff] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Retail Order #</label>
                      <input
                        type="text"
                        placeholder="e.g. ORD-98124"
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0558ff] outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#fb651e] to-[#ff7e33] hover:opacity-95 text-white font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>Issuing Policy...</>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4" />
                          Complete Purchase & Activate Policy
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-center text-slate-600 mt-2">
                      Instant coverage starts immediately. 30-day money-back guarantee.
                    </p>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
