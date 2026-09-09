import Link from "next/link";
import { Logo } from "@/components/brand/logo";
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
    <div className="min-h-screen bg-cream-100 text-navy-800 font-sans">
      <nav className="sticky top-0 z-50 bg-white border-b-[3px] border-navy-800">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-[76px] flex items-center justify-between gap-4">
          <Link href="/"><Logo size="md" /></Link>
          <div className="hidden lg:flex items-center gap-6 font-black uppercase text-sm tracking-widest">
            <Link href="/features" className="hover:underline">Features</Link>
            <Link href="/how-it-works" className="hover:underline">How it Works</Link>
            <Link href="/pricing" className="underline decoration-[4px]">Pricing</Link>
            <Link href="/about" className="hover:underline">About</Link>
            <Link href="/contact" className="hover:underline">Contact</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden sm:inline-flex px-5 py-3 bg-white border-[3px] border-navy-800 font-black uppercase text-sm">Sign In</Link>
            <Link href="/dashboard" className="px-6 py-3 bg-mustard-400 border-[3px] border-navy-800 font-black uppercase text-sm shadow-brutal-sm">Launch App →</Link>
          </div>
        </div>
      </nav>

      <header className="border-b-[3px] border-navy-800 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-14 text-center">
          <div className="inline-block bg-mustard-400 border-[3px] border-navy-800 px-4 py-2 font-black uppercase text-sm shadow-brutal-sm">Naira Friendly</div>
          <h1 className="mt-4 text-4xl md:text-5xl font-black tracking-tighter">Start Free. Scale When You Win.</h1>
          <p className="mt-3 text-base font-bold text-navy-800/60 max-w-2xl mx-auto">One workspace per company. Unlimited projects on Growth. Pricing that respects Nigerian margins — ₦ default, USD/GBP/EUR optional.</p>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {TIERS.map((t) => (
            <div key={t.name} className={`${t.dark ? "bg-navy-800 text-white" : "bg-white"} border-[3px] border-navy-800 shadow-brutal p-8 relative flex flex-col`}>
              {t.badge && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-mustard-400 text-navy-800 border-[3px] border-navy-800 px-4 py-1.5 font-black uppercase text-xs whitespace-nowrap">{t.badge}</div>}
              <h3 className="font-black uppercase text-lg">{t.name}</h3>
              <div className={`mt-2 text-4xl font-black font-mono ${t.dark ? "text-mustard-400" : "text-navy-800"}`}>{t.price}</div>
              <div className={`text-sm font-bold uppercase ${t.dark ? "text-white/60" : "text-navy-800/60"}`}>{t.sub}</div>
              <ul className="mt-6 space-y-3 flex-1">
                {t.feats.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm font-bold">
                    <span className={`w-6 h-6 border-2 border-navy-800 flex items-center justify-center shrink-0 ${t.dark ? "bg-mustard-400 text-navy-800" : "bg-navy-800 text-white"}`}><CheckCircle2 className="w-4 h-4" /></span>{f}
                  </li>
                ))}
              </ul>
              <Link href={t.href} className={`mt-8 text-center py-4 border-[3px] border-navy-800 font-black uppercase text-sm shadow-brutal-sm ${t.dark ? "bg-mustard-400 text-navy-800" : "bg-white text-navy-800"}`}>{t.cta}</Link>
            </div>
          ))}
        </div>

        <div className="mt-12 max-w-5xl mx-auto bg-white border-[3px] border-navy-800 shadow-brutal overflow-hidden">
          <div className="p-6 border-b-[3px] border-navy-800 bg-cream-100">
            <h3 className="font-black uppercase tracking-tight">Compare Plans</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-navy-800 text-white uppercase text-xs font-black">
                <tr><th className="py-3 px-4">Feature</th><th className="py-3 px-4 text-center">Starter</th><th className="py-3 px-4 text-center">Growth</th><th className="py-3 px-4 text-center">Enterprise</th></tr>
              </thead>
              <tbody className="divide-y-2 divide-navy-800/10">
                {COMPARISON.map((row) => (
                  <tr key={row[0]} className="hover:bg-cream-100">
                    <td className="py-3 px-4 font-black">{row[0]}</td>
                    <td className="py-3 px-4 text-center font-bold">{row[1] === "✓" ? <CheckCircle2 className="w-5 h-5 text-navy-800 mx-auto" /> : row[1] === "—" ? <X className="w-5 h-5 text-navy-800/40 mx-auto" /> : row[1]}</td>
                    <td className="py-3 px-4 text-center font-bold">{row[2] === "✓" ? <CheckCircle2 className="w-5 h-5 text-navy-800 mx-auto" /> : row[2] === "—" ? <X className="w-5 h-5 text-navy-800/40 mx-auto" /> : row[2]}</td>
                    <td className="py-3 px-4 text-center font-bold">{row[3] === "✓" ? <CheckCircle2 className="w-5 h-5 text-navy-800 mx-auto" /> : row[3] === "—" ? <X className="w-5 h-5 text-navy-800/40 mx-auto" /> : row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="bg-white border-y-[3px] border-navy-800">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 grid md:grid-cols-3 gap-6">
          <div className="bg-cream-100 border-[3px] border-navy-800 p-6 shadow-brutal"><Zap className="w-8 h-8 mb-3" /><h4 className="font-black uppercase">Monthly, No Lock-in</h4><p className="text-sm font-bold text-navy-800/60 mt-2">Cancel anytime. Invoices in ₦, card or bank transfer.</p></div>
          <div className="bg-mustard-400 border-[3px] border-navy-800 p-6 shadow-brutal"><ShieldCheck className="w-8 h-8 mb-3" /><h4 className="font-black uppercase">RLS & Audit</h4><p className="text-sm font-bold mt-2">All tiers get Row-Level Security. Growth+ gets full audit export.</p></div>
          <div className="bg-navy-800 text-white border-[3px] border-navy-800 p-6 shadow-brutal"><Building2 className="w-8 h-8 mb-3 text-mustard-400" /><h4 className="font-black uppercase">Lagos Support</h4><p className="text-sm font-bold text-white/70 mt-2">Priority on Growth, dedicated on Enterprise — same timezone.</p></div>
        </div>
      </section>

      <footer className="bg-cream-100 border-t-[3px] border-navy-800">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/"><Logo size="sm" /></Link>
          <div className="flex gap-4 text-sm font-black uppercase">
            <Link href="/features" className="hover:underline">Features</Link>
            <Link href="/contact" className="hover:underline">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
