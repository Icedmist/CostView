import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import {
  Calculator,
  ShoppingCart,
  Boxes,
  Users,
  TrendingUp,
  Briefcase,
  FileSpreadsheet,
  ShieldCheck,
  Building2,
  DollarSign,
  FileText,
  BarChart3,
  Layers,
  HardHat,
  Eye,
  Zap,
  CheckCircle2,
} from "lucide-react";

export const metadata = {
  title: "Features — CostView",
  description: "All 10 reports and 7 operations modules plus commercial — per PRD §5.",
};

const FEATURES = [
  { icon: Calculator, title: "BOQ & Budget Control", desc: "BOQ import, hierarchical cost codes, live variance ±5%, revision trail, final account.", bullets: ["Excel/Word/PDF AI import", "Unique BOQ codes", "On/Over/Under status", "Revision approval flow"] },
  { icon: BarChart3, title: "Forecast & Cost Control", desc: "Automatic forecast, EAC/ETC, confidence and finish date vs planned.", bullets: ["Trend from actuals", "Burn-rate analysis", "Ahead/behind indicator"] },
  { icon: ShoppingCart, title: "Procurement Pipeline", desc: "Requisition → Enquiry → PO → Delivery → Invoice → Payment.", bullets: ["Linked documents", "Supplier compare side-by-side", "Payment terms (pre/post/partial)"] },
  { icon: ShieldCheck, title: "Three-Way Match", desc: "PO qty vs GRN vs Invoice rate — auto-flag, payment lock.", bullets: ["190 delivered vs 200 invoiced flagged", "Exact variance shown", "Holds payment automatically"] },
  { icon: Boxes, title: "Materials & Inventory", desc: "Live stock gauges, GRN, consumption, returns, transfers, stock count.", bullets: ["Healthy/Low/Out", "Store-to-store Kanban", "Variance logging"] },
  { icon: Users, title: "Labour & Productivity", desc: "Crew roster, attendance grid, payroll multipliers, productivity per BOQ.", bullets: ["Daily present/absent", "Overtime 1.5x", "Blocks per man-hour"] },
  { icon: TrendingUp, title: "Progress, Quality & Safety", desc: "Digital diary, photos, inspections, snags/NCRs, safety scorecards.", bullets: ["Weather-stamped logs", "Kanban for snags", "Days without incident"] },
  { icon: Briefcase, title: "Subcontractors", desc: "Contracts, claims (Submitted→Paid), certificates, retention, performance grading.", bullets: ["4-factor grading", "Retention held", "Ledger builds itself"] },
  { icon: FileSpreadsheet, title: "Variations", desc: "Instructions → Register → Approval (QS→PM) → Cost Impact → auto Revision.", bullets: ["Threshold routing", "Cost chart auto", "Links to BOQ"] },
  { icon: Building2, title: "Commercial Mode", desc: "Feasibility, capital stack, tender, valuation, claims, sales, project margin, handover.", bullets: ["18 stages", "Developer/Contractor toggle", "Live margin"] },
  { icon: FileText, title: "Reports Studio", desc: "10 branded PDFs + CSV, project picker, financial & site progress numbers.", bullets: ["Budget vs actual", "Cash position", "Site progress with numbers"] },
  { icon: DollarSign, title: "Project Margin", desc: "Live margin from committed vs actual, developer ultimate dashboard.", bullets: ["Revised budget ceiling", "Margin %", "Handover ledger"] },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#FFFDF0] text-navy-800 font-sans">
      <nav className="sticky top-0 z-50 bg-white border-b-[3px] border-navy-800">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-[76px] flex items-center justify-between gap-4">
          <Link href="/"><Logo size="md" /></Link>
          <div className="hidden lg:flex items-center gap-6 font-black uppercase text-sm tracking-widest">
            <Link href="/features" className="underline decoration-[4px] underline-offset-4">Features</Link>
            <Link href="/how-it-works" className="hover:underline decoration-[4px] underline-offset-4">How it Works</Link>
            <Link href="/pricing" className="hover:underline decoration-[4px] underline-offset-4">Pricing</Link>
            <Link href="/about" className="hover:underline decoration-[4px] underline-offset-4">About</Link>
            <Link href="/contact" className="hover:underline decoration-[4px] underline-offset-4">Contact</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden sm:inline-flex px-5 py-3 bg-white border-[3px] border-navy-800 font-black uppercase text-sm">Sign In</Link>
            <Link href="/dashboard" className="px-6 py-3 bg-[#FFD23F] border-[3px] border-navy-800 font-black uppercase text-sm shadow-brutal-sm">Launch App →</Link>
          </div>
        </div>
      </nav>

      <header className="border-b-[3px] border-navy-800 bg-navy-800 text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-14">
          <div className="inline-block bg-[#FFD23F] text-navy-800 border-[3px] border-navy-800 px-4 py-2 font-black uppercase text-sm shadow-brutal-sm">Platform</div>
          <h1 className="mt-4 text-4xl md:text-5xl font-black tracking-tighter leading-none">Every Module.<br /><span className="text-mustard-400">One System.</span></h1>
          <p className="mt-4 text-base font-bold text-white/70 max-w-2xl">Per PRD §5 — 7 operations modules, 10 reports, 18 commercial stages. Let the system calculate what it can; people only type what it can’t know.</p>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-14">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-white border-[3px] border-navy-800 shadow-brutal p-6">
              <div className="w-14 h-14 bg-navy-800 border-[3px] border-navy-800 flex items-center justify-center text-white mb-4"><f.icon className="w-7 h-7" /></div>
              <h3 className="font-black uppercase tracking-tight text-lg">{f.title}</h3>
              <p className="text-sm font-bold text-navy-800/60 mt-2 leading-relaxed">{f.desc}</p>
              <ul className="mt-4 space-y-1.5">
                {f.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-xs font-bold"><CheckCircle2 className="w-4 h-4 text-navy-800 shrink-0 mt-0.5" />{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border-y-[3px] border-navy-800">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#FFFDF0] border-[3px] border-navy-800 p-6 shadow-brutal">
              <Zap className="w-8 h-8 mb-3" />
              <h4 className="font-black uppercase">Fast</h4>
              <p className="text-sm font-bold text-navy-800/60 mt-2">Less typing — numbers entered once in Budget automatically show downstream in Procurement, Materials, Labour.</p>
            </div>
            <div className="bg-[#FFD23F] border-[3px] border-navy-800 p-6 shadow-brutal">
              <Eye className="w-8 h-8 mb-3" />
              <h4 className="font-black uppercase">Efficient</h4>
              <p className="text-sm font-bold mt-2">Right person, right module, right time — role views + threshold approvals, no chasing.</p>
            </div>
            <div className="bg-navy-800 text-white border-[3px] border-navy-800 p-6 shadow-brutal">
              <ShieldCheck className="w-8 h-8 mb-3 text-mustard-400" />
              <h4 className="font-black uppercase">Auditable</h4>
              <p className="text-sm font-bold text-white/70 mt-2">Every approval (revision, PO, claim, variation) logged with actor + timestamp per PRD §7.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#FFFDF0] border-t-[3px] border-navy-800">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/"><Logo size="sm" /></Link>
          <div className="flex gap-4 text-sm font-black uppercase">
            <Link href="/how-it-works" className="hover:underline">How it Works</Link>
            <Link href="/pricing" className="hover:underline">Pricing</Link>
            <Link href="/contact" className="hover:underline">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
