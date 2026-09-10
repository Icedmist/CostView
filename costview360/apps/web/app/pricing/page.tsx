import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { MarketingNav } from "@/components/marketing/nav";
import { CheckCircle2, X, Zap, ShieldCheck, Building2 } from "lucide-react";

export const metadata = { title: "Pricing — CostView", description: "Naira-friendly pricing for Nigerian construction teams." };

const TIERS = [
  { name: "Starter", price: "Free", sub: "For pilot teams", feats: ["1 Project live", "BOQ + Procurement", "3 Users + RBAC", "Community Support", "Cloud hosted"], cta: "Start Free", href: "/register", dark: false },
  { name: "Growth", price: "₦45k", sub: "/ month per project", feats: ["Unlimited Projects", "All 7 Ops Modules", "Unlimited Users", "RBAC + Audit Log", "Priority Support", "CSV + PDF Reports"], cta: "Start 14-Day Trial", href: "/register", dark: true, badge: "Most Popular" },
  { name: "Enterprise", price: "Custom", sub: "For developers & groups", feats: ["18 Commercial Modules", "Valuation & Claims", "Sales & Receivables", "Dedicated Success", "SLA & On-Prem", "Naira / USD billing"], cta: "Talk to Founders", href: "/contact", dark: false },
];

const COMPARISON = [
  ["Projects", "1", "Unlimited", "Unlimited"],
  ["Users", "3", "Unlimited", "Unlimited"],
  ["BOQ & Budget", "✓", "✓", "✓"],
  ["Procurement & 3-Way Match", "✓", "✓", "✓"],
  ["Materials & Labour", "—", "✓", "✓"],
  ["Progress & Subcontractors", "—", "✓", "✓"],
  ["Commercial Mode", "—", "—", "✓"],
  ["Reports (10) + PDF/CSV", "—", "✓", "✓"],
  ["Audit Log", "—", "✓", "✓"],
  ["Support", "Community", "Priority", "Dedicated"],
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#fbfbfb] text-[#1b1b1b] font-sans">
      <MarketingNav />

      <header className="border-b border-[#e5e5e5] bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-14 text-center">
          <div className="inline-block bg-blue-50 text-[#0067c0] border-blue-200 border border-[#e5e5e5] px-4 py-2 font-semibold text-sm shadow-xs">Naira Friendly</div>
          <h1 className="mt-4 text-4xl md:text-5xl font-black tracking-tighter">Start Free. Scale When You Win.</h1>
          <p className="mt-3 text-base font-bold text-[#5c5c5c] max-w-2xl mx-auto">One workspace per company. Unlimited projects on Growth. Pricing that respects Nigerian margins — ₦ default, USD/GBP/EUR optional.</p>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {TIERS.map((t) => (
            <div key={t.name} className={`${t.dark ? "bg-navy-800 text-white" : "bg-white"} border border-[#e5e5e5] shadow-card p-8 relative flex flex-col`}>
              {t.badge && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-50 text-[#0067c0] border-blue-200 text-[#1b1b1b] border border-[#e5e5e5] px-4 py-1.5 font-semibold text-xs whitespace-nowrap">{t.badge}</div>}
              <h3 className="font-semibold text-lg">{t.name}</h3>
              <div className={`mt-2 text-4xl font-black font-mono ${t.dark ? "text-[#0067c0]" : "text-[#1b1b1b]"}`}>{t.price}</div>
              <div className={`text-sm font-bold uppercase ${t.dark ? "text-white/60" : "text-[#5c5c5c]"}`}>{t.sub}</div>
              <ul className="mt-6 space-y-3 flex-1">
                {t.feats.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm font-bold">
                    <span className={`w-6 h-6 border border-[#e5e5e5] flex items-center justify-center shrink-0 ${t.dark ? "bg-blue-50 text-[#0067c0] border-blue-200 text-[#1b1b1b]" : "bg-navy-800 text-white"}`}><CheckCircle2 className="w-4 h-4" /></span>{f}
                  </li>
                ))}
              </ul>
              <Link href={t.href} className={`mt-8 text-center py-4 border border-[#e5e5e5] font-semibold text-sm shadow-xs ${t.dark ? "bg-blue-50 text-[#0067c0] border-blue-200 text-[#1b1b1b]" : "bg-white text-[#1b1b1b]"}`}>{t.cta}</Link>
            </div>
          ))}
        </div>

        <div className="mt-12 max-w-5xl mx-auto bg-white/90 backdrop-blur-md border border-[#e5e5e5] rounded-xl shadow-card overflow-hidden">
          <div className="p-6 border-b border-[#e5e5e5] bg-[#fbfbfb]">
            <h3 className="font-semibold tracking-tight">Compare Plans</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-navy-800 text-white uppercase text-xs font-black">
                <tr><th className="py-3 px-4">Feature</th><th className="py-3 px-4 text-center">Starter</th><th className="py-3 px-4 text-center">Growth</th><th className="py-3 px-4 text-center">Enterprise</th></tr>
              </thead>
              <tbody className="divide-y-2 divide-navy-800/10">
                {COMPARISON.map((row) => (
                  <tr key={row[0]} className="hover:bg-[#fbfbfb]">
                    <td className="py-3 px-4 font-black">{row[0]}</td>
                    <td className="py-3 px-4 text-center font-bold">{row[1] === "✓" ? <CheckCircle2 className="w-5 h-5 text-[#1b1b1b] mx-auto" /> : row[1] === "—" ? <X className="w-5 h-5 text-[#8b8b8b] mx-auto" /> : row[1]}</td>
                    <td className="py-3 px-4 text-center font-bold">{row[2] === "✓" ? <CheckCircle2 className="w-5 h-5 text-[#1b1b1b] mx-auto" /> : row[2] === "—" ? <X className="w-5 h-5 text-[#8b8b8b] mx-auto" /> : row[2]}</td>
                    <td className="py-3 px-4 text-center font-bold">{row[3] === "✓" ? <CheckCircle2 className="w-5 h-5 text-[#1b1b1b] mx-auto" /> : row[3] === "—" ? <X className="w-5 h-5 text-[#8b8b8b] mx-auto" /> : row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="bg-white border-y border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 grid md:grid-cols-3 gap-6">
          <div className="bg-[#fbfbfb] border border-[#e5e5e5] p-6 shadow-card"><Zap className="w-8 h-8 mb-3" /><h4 className="font-semibold">Monthly, No Lock-in</h4><p className="text-sm font-bold text-[#5c5c5c] mt-2">Cancel anytime. Invoices in ₦, card or bank transfer.</p></div>
          <div className="bg-blue-50 text-[#0067c0] border-blue-200 border border-[#e5e5e5] p-6 shadow-card"><ShieldCheck className="w-8 h-8 mb-3" /><h4 className="font-semibold">RLS & Audit</h4><p className="text-sm font-bold mt-2">All tiers get Row-Level Security. Growth+ gets full audit export.</p></div>
          <div className="glass-hero text-white rounded-xl p-6 shadow-card"><Building2 className="w-8 h-8 mb-3 text-[#0067c0]" /><h4 className="font-semibold">Priority Support</h4><p className="text-sm font-bold text-white/70 mt-2">Priority on Growth, dedicated on Enterprise — same timezone — remote & on-site.</p></div>
        </div>
      </section>

      <footer className="bg-[#fbfbfb] border-t border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/"><Logo size="sm" /></Link>
          <div className="flex gap-4 text-sm font-semibold">
            <Link href="/features" className="hover:underline">Features</Link>
            <Link href="/contact" className="hover:underline">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
