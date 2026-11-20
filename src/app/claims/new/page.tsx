"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Upload, ChevronRight, Package, AlertCircle, Loader2, X, Image as ImageIcon } from "lucide-react";

const CATEGORIES = [
  "Electronics", "Home Appliances", "Furniture", "Sporting Goods",
  "Tools & Hardware", "Musical Instruments", "Jewelry & Watches", "Other",
];

const STEPS = ["Product Info", "Issue Details", "Review & Submit"];

export default function NewClaimPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    orderNumber: "",
    productName: "",
    productCategory: "",
    issueDescription: "",
    photos: [] as string[],
  });

  const set = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const remainingSlots = Math.max(0, 5 - form.photos.length);
    if (remainingSlots === 0) return;

    Array.from(files).slice(0, remainingSlots).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result && typeof e.target.result === "string") {
          setForm((prev) => {
            if (prev.photos.length >= 5) return prev;
            return {
              ...prev,
              photos: [...prev.photos, e.target!.result as string],
            };
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setForm((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const isStep0Valid = form.customerName && form.customerEmail && form.orderNumber && form.productName && form.productCategory;
  const isStep1Valid = form.issueDescription.length >= 20;

  async function submit() {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/claims/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit");
      router.push(`/claims/${data.claimId}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-[#151515] tracking-tight">File a Warranty Claim</h1>
          <p className="text-[#525252] mt-2">AI decision in seconds. Full transparency guaranteed.</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-0 mb-10">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    i < step
                      ? "bg-[#0558ff] text-white"
                      : i === step
                      ? "bg-[#0558ff] text-white ring-4 ring-blue-100"
                      : "bg-[#f0efe7] text-[#9b9b9b]"
                  }`}
                >
                  {i < step ? "✓" : i + 1}
                </div>
                <span className={`text-xs font-medium whitespace-nowrap ${i === step ? "text-[#151515]" : "text-[#9b9b9b]"}`}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 mb-5 ${i < step ? "bg-[#0558ff]" : "bg-[#e5e7eb]"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm overflow-hidden">
          {/* Step 0: Product Info */}
          {step === 0 && (
            <div className="p-8 space-y-5">
              <div className="flex items-center gap-2 pb-4 border-b border-[#f0efe7]">
                <Package className="w-5 h-5 text-[#0558ff]" />
                <h2 className="font-semibold text-[#151515]">Product & Order Information</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#525252] uppercase tracking-wide mb-1.5">Your Name *</label>
                  <input
                    className="w-full px-4 py-2.5 rounded-xl border border-[#e5e7eb] text-sm focus:outline-none focus:ring-2 focus:ring-[#0558ff]/30 focus:border-[#0558ff] transition"
                    placeholder="Arjun Sharma"
                    value={form.customerName}
                    onChange={(e) => set("customerName", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#525252] uppercase tracking-wide mb-1.5">Email *</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#e5e7eb] text-sm focus:outline-none focus:ring-2 focus:ring-[#0558ff]/30 focus:border-[#0558ff] transition"
                    placeholder="arjun@example.com"
                    value={form.customerEmail}
                    onChange={(e) => set("customerEmail", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#525252] uppercase tracking-wide mb-1.5">Order Number *</label>
                <input
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e5e7eb] text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#0558ff]/30 focus:border-[#0558ff] transition"
                  placeholder="SB-ORD-12345"
                  value={form.orderNumber}
                  onChange={(e) => set("orderNumber", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#525252] uppercase tracking-wide mb-1.5">Product Name *</label>
                <input
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e5e7eb] text-sm focus:outline-none focus:ring-2 focus:ring-[#0558ff]/30 focus:border-[#0558ff] transition"
                  placeholder="e.g. Samsung 65in QLED TV"
                  value={form.productName}
                  onChange={(e) => set("productName", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#525252] uppercase tracking-wide mb-1.5">Product Category *</label>
                <select
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e5e7eb] text-sm focus:outline-none focus:ring-2 focus:ring-[#0558ff]/30 focus:border-[#0558ff] transition bg-white appearance-none"
                  value={form.productCategory}
                  onChange={(e) => set("productCategory", e.target.value)}
                >
                  <option value="">Select a category...</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* Step 1: Issue Details */}
          {step === 1 && (
            <div className="p-8 space-y-5">
              <div className="flex items-center gap-2 pb-4 border-b border-[#f0efe7]">
                <AlertCircle className="w-5 h-5 text-[#0558ff]" />
                <h2 className="font-semibold text-[#151515]">Describe the Issue</h2>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#525252] uppercase tracking-wide mb-1.5">
                  What happened? *
                </label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-[#e5e7eb] text-sm focus:outline-none focus:ring-2 focus:ring-[#0558ff]/30 focus:border-[#0558ff] transition resize-none leading-relaxed"
                  placeholder="Describe what happened in as much detail as possible. When did it occur? Was there any physical impact, liquid exposure, or power event? What have you already tried?"
                  value={form.issueDescription}
                  onChange={(e) => set("issueDescription", e.target.value)}
                />
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-[#9b9b9b]">More detail = faster AI decision</p>
                  <p className={`text-xs font-medium ${form.issueDescription.length < 20 ? "text-[#dc2626]" : "text-[#16a34a]"}`}>
                    {form.issueDescription.length} / 20 min chars
                  </p>
                </div>
              </div>

              {/* Functional Photo Upload */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#525252] uppercase tracking-wide">
                    Photos (optional — helps AI accuracy)
                  </label>
                  <span className="text-xs text-[#9b9b9b]">{form.photos.length}/5 uploaded</span>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  multiple
                  onChange={(e) => {
                    handleFiles(e.target.files);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    handleFiles(e.dataTransfer.files);
                  }}
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer select-none ${
                    isDragging
                      ? "border-[#0558ff] bg-[#eff4ff]"
                      : "border-[#0558ff] hover:bg-[#eff4ff]/30 bg-[#eff4ff]/10"
                  }`}
                >
                  <Upload className={`w-8 h-8 mx-auto mb-2 ${isDragging ? "text-[#0558ff]" : "text-[#0558ff]"}`} />
                  <p className="text-sm text-[#151515] font-semibold">
                    {isDragging ? "Drop your photos here" : "Click to select or drag & drop photos"}
                  </p>
                  <p className="text-xs text-[#737373] mt-1">PNG, JPG, WEBP (up to 5 images)</p>
                </div>

                {/* Previews */}
                {form.photos.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                    {form.photos.map((photo, i) => (
                      <div key={i} className="relative group rounded-xl overflow-hidden border border-[#e5e7eb] aspect-square bg-[#f5f5ee] shadow-xs">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={photo} alt={`Upload ${i + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removePhoto(i);
                          }}
                          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/75 hover:bg-black text-white flex items-center justify-center text-xs transition"
                          title="Remove photo"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* AI tip */}
              <div className="bg-[#eff4ff] rounded-xl p-4 text-sm text-[#0558ff] flex gap-3">
                <span className="text-lg">🤖</span>
                <div>
                  <p className="font-semibold">AI Tip</p>
                  <p className="text-[#525252] mt-0.5">Our AI will analyze your description and photos against your warranty policy to verify damage patterns and speed up approval.</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Review */}
          {step === 2 && (
            <div className="p-8 space-y-5">
              <div className="pb-4 border-b border-[#f0efe7]">
                <h2 className="font-semibold text-[#151515]">Review Your Claim</h2>
                <p className="text-sm text-[#525252] mt-1">Please confirm all details before submission.</p>
              </div>

              <div className="space-y-3">
                {[
                  { label: "Name", value: form.customerName },
                  { label: "Email", value: form.customerEmail },
                  { label: "Order #", value: form.orderNumber },
                  { label: "Product", value: form.productName },
                  { label: "Category", value: form.productCategory },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between py-2 border-b border-[#f5f5ee]">
                    <span className="text-sm text-[#737373]">{label}</span>
                    <span className="text-sm font-medium text-[#151515] text-right max-w-[60%]">{value}</span>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-sm text-[#737373] mb-2">Issue Description</p>
                <p className="text-sm text-[#151515] bg-[#f5f5ee] p-4 rounded-xl leading-relaxed">{form.issueDescription}</p>
              </div>

              {/* Attached Photos Review */}
              {form.photos.length > 0 && (
                <div>
                  <p className="text-sm text-[#737373] mb-2 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#0558ff]" />
                    Attached Photos ({form.photos.length})
                  </p>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
                    {form.photos.map((photo, i) => (
                      <div key={i} className="rounded-lg overflow-hidden border border-[#e5e7eb] aspect-square bg-[#f5f5ee]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={photo} alt={`Attached ${i + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-[#dc2626] flex gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              <div className="bg-[#f5f5ee] rounded-xl p-4 text-sm text-[#525252]">
                🤖 After submission, our AI will analyze your claim and return a decision with full reasoning — typically within 2–3 seconds.
              </div>
            </div>
          )}

          {/* Footer Nav */}
          <div className="px-8 py-5 bg-[#fafaf8] border-t border-[#f0efe7] flex justify-between items-center">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="px-5 py-2.5 rounded-xl border border-[#e5e7eb] text-sm font-medium text-[#525252] hover:bg-[#f5f5ee] disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Back
            </button>

            {step < 2 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={step === 0 ? !isStep0Valid : !isStep1Valid}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0558ff] text-white text-sm font-semibold hover:bg-[#0046d6] disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={submit}
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0558ff] text-white text-sm font-semibold hover:bg-[#0046d6] disabled:opacity-50 transition"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting & Analyzing...
                  </>
                ) : (
                  <>
                    Submit Claim
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
