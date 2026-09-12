import Link from "next/link";
import { MarketingNav } from "@/components/marketing/nav";
import { CheckCircle2, Sparkles, ArrowRight } from "lucide-react";

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
    feats: [
      "1 Active Project live",
      "BOQ Master & Variance Control (±5%)",
      "Procurement & 3-Way Match Gate",
      "3 User Accounts + RBAC Roles",
      "Community Support & Forum",
      "Secure Cloud Hosting with RLS",
    ],
    cta: "Start Free Pilot",
    href: "/register",
    popular: false,
  },
  {
    name: "Growth",
    price: "₦45k",
    sub: "/ month per active project",
    desc: "Full continuous operations suite for mid-size general contractors and PM firms.",
    feats: [
      "Unlimited Concurrent Projects",
      "Complete Suite (Budget, Procurement, Site Ops)",
      "Unlimited Users & Field Stakeholders",
      "Immutable Audit Log & Postgres RLS",
      "Priority WhatsApp & Direct Phone Line",
      "10 Executive PDF & CSV Reports",
      "Subcontractor Claim Tracking & Retention",
    ],
    cta: "Start 14-Day Free Trial",
    href: "/register",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    sub: "For property developers & holding groups",
    desc: "Turnkey cost governance, retention holding ledgers, and dedicated advisory success.",
    feats: [
      "Contracts & Retention Escrow Studio",
      "Valuation & Claims Entitlements",
      "Executive Reports & Audit Defense",
      "Dedicated Account Architect",
      "Custom SLA & On-Prem Deployment Options",
      "Naira / USD Dual Currency Billing",
    ],
    cta: "Talk to Our Team",
    href: "/contact",
    popular: false,
  },
];

const COMPARISON = [
  ["Active Projects Included", "1", "Unlimited", "Unlimited"],
  ["Authorized Team Members", "3", "Unlimited", "Unlimited"],
  ["BOQ & Budget Control (±5% Variance)", "✓", "✓", "✓"],
  ["Procurement & 3-Way Match Gate", "✓", "✓", "✓"],
  ["Materials, Stock & Inventory Gauges", "—", "✓", "✓"],
  ["Labour Attendance & Muster Roll", "—", "✓", "✓"],
  ["Daily Site Diary & Photo Snags", "—", "✓", "✓"],
  ["Contracts & 10% Retention Escrow", "—", "—", "✓"],
  ["Reports Studio (10 Branded Executive PDFs)", "—", "✓", "✓"],
  ["Immutable Actor Audit Logs & RLS", "—", "✓", "✓"],
  ["Support SLA", "Community", "Priority 24/7", "Dedicated Partner"],
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F5] text-slate-900 font-sans selection:bg-[#0A2540] selection:text-white">
      <MarketingNav />

      {/* Header */}
      <header className="border-b-2 border-[#E5E5DE] bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-[#FAF9F5] text-[#0A2540] border-2 border-[#E5E5DE] px-5 py-2 rounded-full text-sm font-black tracking-wide mb-6 shadow-xs">
            Naira-Native Transparent Pricing
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#0A2540] leading-tight">
            Start Free. Scale As You Build.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-[#0A2540]/80 leading-relaxed max-w-2xl mx-auto font-normal">
            One workspace per construction firm. Pricing engineered around Nigerian project realities — Naira by default, USD/GBP/EUR optional.
          </p>
        </div>
      </header>

      {/* Pricing Cards */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {TIERS.map((t) => (
            <div
              key={t.name}
              className={`bg-white rounded-3xl p-8 md:p-10 relative flex flex-col justify-between transition-all ${
                t.popular
                  ? "border-2 border-[#0A2540] shadow-xl ring-4 ring-[#0A2540]/15"
                  : "border-2 border-[#E5E5DE] shadow-xs hover:border-[#0A2540] hover:shadow-md"
              }`}
            >
              {t.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#0A2540] text-white px-5 py-1.5 rounded-full text-xs font-black tracking-wider uppercase flex items-center gap-2 shadow-md">
                  <Sparkles className="w-4 h-4 text-white" /> Most Popular
                </div>
              )}
              <div>
                <h2 className="font-black text-2xl md:text-3xl text-[#0A2540]">{t.name}</h2>
                <p className="text-base text-[#0A2540]/75 mt-2 leading-relaxed font-normal">{t.desc}</p>
                <div className="mt-8 flex items-baseline gap-2">
                  <span className="text-5xl font-black font-mono text-[#0A2540]">{t.price}</span>
                  <span className="text-sm font-bold text-[#0A2540]/60">{t.sub}</span>
                </div>
              </div>

              <ul className="mt-10 space-y-4 flex-1 border-t-2 border-[#E5E5DE] pt-8">
                {t.feats.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm md:text-base font-semibold text-[#0A2540]/85">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={t.href}
                className={`mt-10 min-h-[50px] flex items-center justify-center py-4 rounded-xl font-black text-base transition-all active:scale-[0.98] ${
                  t.popular
                    ? "bg-[#0A2540] hover:bg-[#003366] text-white shadow-lg shadow-[#0A2540]/25"
                    : "bg-[#FAF9F5] hover:bg-white text-[#0A2540] border-2 border-[#E5E5DE] hover:border-[#0A2540]"
                }`}
              >
                {t.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="mt-20 max-w-5xl mx-auto bg-white border-2 border-[#E5E5DE] rounded-3xl shadow-sm overflow-hidden">
          <div className="p-7 border-b-2 border-[#E5E5DE] bg-[#FAF9F5]">
            <h3 className="font-black text-xl md:text-2xl text-[#0A2540]">Detailed Feature Comparison</h3>
            <p className="text-sm font-semibold text-[#0A2540]/70 mt-1">Cross-tier technical entitlement matrix</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm md:text-base">
              <thead className="bg-[#FAF9F5] text-[#0A2540] uppercase tracking-wider font-black border-b-2 border-[#E5E5DE] text-xs">
                <tr>
                  <th className="py-4 px-6">Core Feature</th>
                  <th className="py-4 px-6 text-center">Starter</th>
                  <th className="py-4 px-6 text-center bg-[#0A2540]/10 text-[#0A2540]">Growth</th>
                  <th className="py-4 px-6 text-center">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-[#E5E5DE]">
                {COMPARISON.map((row) => (
                  <tr key={row[0]} className="hover:bg-[#FAF9F5]/70 transition-colors">
                    <td className="py-4 px-6 font-bold text-[#0A2540]">{row[0]}</td>
                    <td className="py-4 px-6 text-center font-bold text-[#0A2540]/70">{row[1]}</td>
                    <td className="py-4 px-6 text-center font-black bg-[#0A2540]/5 text-[#0A2540]">{row[2]}</td>
                    <td className="py-4 px-6 text-center font-bold text-[#0A2540]/70">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 text-center">
        <div className="bg-[#0A2540] p-8 md:p-14 text-white rounded-3xl relative overflow-hidden max-w-4xl mx-auto shadow-2xl border-2 border-[#0A2540]">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Need a custom enterprise agreement?
          </h2>
          <p className="text-base md:text-lg text-white/80 mt-3.5 max-w-xl mx-auto font-normal">
            For major property portfolios, multi-consortium joint ventures, or on-premise deployments, speak with our technical team.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="min-h-[52px] px-8 py-4 bg-white text-[#0A2540] hover:bg-slate-100 rounded-xl font-black text-base shadow-lg transition-all active:scale-[0.98] flex items-center gap-2"
            >
              <span>Contact Enterprise Sales</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/dashboard"
              className="min-h-[52px] px-8 py-4 bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 rounded-xl font-black text-base shadow-xs transition-all flex items-center"
            >
              Explore Live Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
