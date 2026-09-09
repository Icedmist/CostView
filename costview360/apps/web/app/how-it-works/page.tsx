import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { MarketingNav } from "@/components/marketing/nav";
import { CheckCircle2, FileSpreadsheet, ShoppingCart, Building2, Users, HardHat, Zap } from "lucide-react";

export const metadata = { title: "How It Works — CostView", description: "Import BOQ → Execute & Match → Close. Roles and thresholds." };

const STEPS = [
  { n: "01", title: "Import BOQ & Lock Baseline", desc: "Upload Excel/Word/PDF — AI parses to Item/Qty/Unit/Rate/Amount. You review, fix, then lock Approved Budget. From now every naira moved needs a reason.", bullets: ["Code · Description · Qty · Unit · Rate", "Category: Material / Labour / Plant / Subcon", "Threshold ±5% → On/Over/Under badge"] },
  { n: "02", title: "Execute & Auto-Match", desc: "Requisition (auto on low stock or manual) → RFQ side-by-side → PO with payment terms → GRN photo → Invoice. PO qty vs GRN vs Invoice rate — mismatch auto-locks payment.", bullets: ["Requisition triage High/Critical", "RFQ 3 suppliers, lead days", "Billed vs Delivered → HOLD"] },
  { n: "03", title: "Close With Confidence", desc: "Live variances, commercial GDV vs TDC, margin %, final account QS notes without blocking. Hand client a defensible close-out.", bullets: ["BOQ vs Actual with variance note", "Interim valuation cert", "Sales & receivables realized %"] },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#FFFDF0] text-navy-800 font-sans">
      <MarketingNav />

      <header className="border-b-[3px] border-navy-800 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-14">
          <div className="inline-block bg-navy-800 text-white border-[3px] border-navy-800 px-4 py-2 font-black uppercase text-sm">The Flow</div>
          <h1 className="mt-4 text-4xl md:text-5xl font-black tracking-tighter leading-none">One Flow.<br /><span className="bg-[#FFD23F] border-[3px] border-navy-800 px-2">Not Six Silos.</span></h1>
          <p className="mt-4 text-base font-bold text-navy-800/60 max-w-2xl">A number entered once in Budget automatically shows downstream in Procurement, Materials, Labour — no re-typing by three people into three spreadsheets.</p>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-14">
        <div className="grid lg:grid-cols-3 gap-6">
          {STEPS.map((s) => (
            <div key={s.n} className="bg-white border-[3px] border-navy-800 shadow-brutal p-6">
              <div className="w-14 h-14 bg-[#FFD23F] border-[3px] border-navy-800 flex items-center justify-center font-black text-lg">{s.n}</div>
              <h3 className="mt-4 font-black uppercase text-lg leading-none">{s.title}</h3>
              <p className="text-sm font-bold text-navy-800/60 mt-3 leading-relaxed">{s.desc}</p>
              <ul className="mt-4 space-y-1.5">
                {s.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-xs font-bold"><CheckCircle2 className="w-4 h-4 text-navy-800 shrink-0 mt-0.5" />{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-navy-800 text-white border-y-[3px] border-navy-800">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
          <h2 className="text-2xl md:text-3xl font-black tracking-tighter">Roles See Only What’s Theirs</h2>
          <p className="text-sm font-bold text-white/60 mt-2 max-w-2xl">Per PRD §4 — 8 roles, permission matrix editable by Admin. No wading through modules that aren’t yours.</p>
          <div className="mt-6 grid md:grid-cols-4 gap-4 text-sm">
            {[
              ["Admin", "All modules"],
              ["PM", "Budget · Procurement · Progress"],
              ["QS", "BOQ · Variations · Claims"],
              ["Site Engineer", "Materials · Labour · Diary"],
              ["Procurement Officer", "RFQ · PO · 3-Way Match"],
              ["Accountant", "Invoices · Payments"],
              ["Storekeeper", "Stock · Transfers"],
              ["Architect", "Drawings · Snags"],
            ].map(([role, perms]) => (
              <div key={role} className="bg-white text-navy-800 border-[3px] border-navy-800 p-4 shadow-brutal">
                <div className="font-black uppercase text-xs tracking-widest">{role}</div>
                <div className="text-xs font-bold text-navy-800/60 mt-1">{perms}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        <div className="bg-[#FFFDF0] border-[3px] border-navy-800 p-6 md:p-8 shadow-brutal">
          <h3 className="font-black uppercase text-lg flex items-center gap-2"><Zap className="w-6 h-6" /> Thresholds Decide, Not Phone Calls</h3>
          <p className="text-sm font-bold text-navy-800/60 mt-2">Variations and payments route by value: Draft → QS Valuation → PM Review → Approved. Budget status flips at ±5% (configurable). No “who do I send this to”.</p>
          <div className="mt-4 grid md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white border-2 border-navy-800 p-4"><div className="font-black">On Budget</div><div className="text-xs font-bold text-navy-800/60">Within 5% — green</div></div>
            <div className="bg-[#FFD23F] border-2 border-navy-800 p-4"><div className="font-black">Under Budget</div><div className="text-xs font-bold">More than 5% under — blue</div></div>
            <div className="bg-red-500 text-white border-2 border-navy-800 p-4"><div className="font-black">Over Budget</div><div className="text-xs font-bold text-white/80">More than 5% over — red</div></div>
          </div>
        </div>
      </section>

      <footer className="bg-[#FFFDF0] border-t-[3px] border-navy-800">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/"><Logo size="sm" /></Link>
          <div className="flex gap-4 text-sm font-black uppercase">
            <Link href="/features" className="hover:underline">Features</Link>
            <Link href="/pricing" className="hover:underline">Pricing</Link>
            <Link href="/contact" className="hover:underline">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
