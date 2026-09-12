import Link from "next/link";
import { MarketingNav } from "@/components/marketing/nav";
import { CheckCircle2, X, Sparkles, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Pricing — CostView",
  description: "Naira-friendly pricing designed for Nigerian construction and development teams.",
};

const TIERS = [
  {
    name: "Starter",
    price: "Free",
    sub: "For pilot site teams",
    desc: "Essential budget tracking and procurement controls for one active project.",
    feats: ["1 Active Project live", "BOQ Master & Variance Control", "Procurement & 3-Way Match", "3 User Accounts + RBAC", "Community Support", "Secure Cloud Hosting"],
    cta: "Start Free Pilot",
    href: "/register",
    popular: false,
  },
  {
    name: "Growth",
    price: "₦45k",
    sub: "/ month per active project",
    desc: "Full continuous operations suite for mid-size general contractors and PM firms.",
    feats: ["Unlimited Concurrent Projects", "Operations Suite (Budget, Procurement, Site Ops)", "Unlimited Users & Stakeholders", "Complete RBAC & RLS Audit Log", "Priority WhatsApp & Phone Support", "10 Executive PDF & CSV Reports", "Subcontractor Claim Tracking"],
    cta: "Start 14-Day Free Trial",
    href: "/register",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    sub: "For property developers & holding groups",
    desc: "Turnkey cost governance, retention holding ledgers, and dedicated advisory success.",
    feats: ["Contracts & Retention Escrow Studio", "Valuation & Claims Entitlements", "Executive Reports & Audit Defense", "Dedicated Account Architect", "Custom SLA & On-Prem Options", "Naira / USD Dual Currency Billing"],
    cta: "Talk to Our Team",
    href: "/contact",
    popular: false,
  },
];

const COMPARISON = [
  ["Active Projects Included", "1", "Unlimited", "Unlimited"],
  ["Authorized Team Members", "3", "Unlimited", "Unlimited"],
  ["BOQ & Budget Control", "✓", "✓", "✓"],
  ["Procurement & 3-Way Match", "✓", "✓", "✓"],
  ["Materials, Stock & Inventory", "—", "✓", "✓"],
  ["Labour Attendance & Muster Roll", "—", "✓", "✓"],
  ["Progress Diary & Photo Snags", "—", "✓", "✓"],
  ["Contracts & Margin Control", "—", "—", "✓"],
  ["Reports Studio (10 Branded PDFs)", "—", "✓", "✓"],
  ["Immutable Actor Audit Logs", "—", "✓", "✓"],
  ["Support SLA", "Community", "Priority 24/7", "Dedicated Partner"],
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F5] text-slate-900 font-sans">
      <MarketingNav />

      {/* Header */}
      <header className="border-b border-[#E5E5DE] bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-14 md:py-20 text-center max-w-3xl">
          <div className="inline-flex items-center gap-1.5 bg-[#0A2540]/10 text-[#0A2540] border border-[#0A2540]/20 px-4 py-1.5 rounded-full text-xs font-semibold mb-4 shadow-xs">
            Naira-Native Transparent Pricing
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0A2540] leading-tight">
            Start Free. Scale As You Build.
          </h1>
          <p className="mt-4 text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            One workspace per construction firm. Pricing engineered around Nigerian project realities — Naira by default, USD/GBP/EUR optional.
          </p>
        </div>
      </header>

      {/* Pricing Cards */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-14 md:py-20">
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
          {TIERS.map((t) => (
            <div
              key={t.name}
              className={`bg-white rounded-3xl p-8 relative flex flex-col transition-all ${
                t.popular
                  ? "border-2 border-[#0A2540] shadow-md ring-2 ring-[#0A2540]/20"
                  : "border border-[#E5E5DE] shadow-xs hover:border-[#0A2540]"
              }`}
            >
              {t.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#0A2540] text-white px-4 py-1 rounded-full text-xs font-bold tracking-wide flex items-center gap-1.5 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-white" /> Most Popular
                </div>
              )}
              <h3 className="font-bold text-lg text-[#0A2540]">{t.name}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{t.desc}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold font-mono text-[#0A2540]">{t.price}</span>
                <span className="text-xs font-medium text-slate-500">{t.sub}</span>
              </div>
              <ul className="mt-8 space-y-3 flex-1 border-t border-slate-100 pt-6">
                {t.feats.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-xs text-slate-700 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-[#0A2540] shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={t.href}
                className={`mt-8 text-center py-3.5 rounded-xl font-bold text-xs transition-all active:scale-[0.98] ${
                  t.popular
                    ? "bg-[#0A2540] hover:bg-[#003366] text-white shadow-md"
                    : "bg-[#FAF9F5] hover:bg-slate-100 text-slate-800 border border-[#E5E5DE]"
                }`}
              >
                {t.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="mt-16 max-w-5xl mx-auto bg-white border border-[#E5E5DE] rounded-3xl shadow-xs overflow-hidden">
          <div className="p-6 border-b border-[#E5E5DE] bg-[#FAF9F5]">
            <h3 className="font-bold text-base text-[#0A2540]">Detailed Feature Comparison</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F5] text-slate-700 uppercase tracking-wider font-bold border-b border-[#E5E5DE]">
                <tr>
                  <th className="py-3.5 px-5">Core Feature</th>
                  <th className="py-3.5 px-5 text-center">Starter</th>
                  <th className="py-3.5 px-5 text-center bg-[#0A2540]/10 text-[#0A2540]">Growth</th>
                  <th className="py-3.5 px-5 text-center">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5DE]">
                {COMPARISON.map((row) => (
                  <tr key={row[0]} className="hover:bg-[#FAF9F5]/60 transition-colors">
                    <td className="py-3.5 px-5 font-semibold text-slate-800">{row[0]}</td>
                    <td className="py-3.5 px-5 text-center font-medium text-slate-600">
                      {row[1] === "✓" ? <CheckCircle2 className="w-4 h-4 text-[#0A2540] mx-auto" /> : row[1] === "—" ? <X className="w-4 h-4 text-slate-300 mx-auto" /> : row[1]}
                    </td>
                    <td className="py-3.5 px-5 text-center font-bold text-[#0A2540] bg-[#0A2540]/5">
                      {row[2] === "✓" ? <CheckCircle2 className="w-4 h-4 text-[#0A2540] mx-auto" /> : row[2] === "—" ? <X className="w-4 h-4 text-slate-300 mx-auto" /> : row[2]}
                    </td>
                    <td className="py-3.5 px-5 text-center font-semibold text-slate-800">
                      {row[3] === "✓" ? <CheckCircle2 className="w-4 h-4 text-[#0A2540] mx-auto" /> : row[3] === "—" ? <X className="w-4 h-4 text-slate-300 mx-auto" /> : row[3]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
