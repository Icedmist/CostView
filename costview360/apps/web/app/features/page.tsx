import Link from "next/link";
import { MarketingNav } from "@/components/marketing/nav";
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
  Zap,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export const metadata = {
  title: "Features — CostView 360",
  description: "All 10 reports, 7 operations modules and 18 commercial stages.",
};

const FEATURES = [
  { icon: Calculator, title: "BOQ & Budget Control", desc: "BOQ import, hierarchical cost codes, live variance ±5%, revision audit trail, final account.", bullets: ["CSV/Excel hierarchical import", "Unique BOQ code mapping", "Real-time On/Over/Under status", "Documented revision approval flow"] },
  { icon: BarChart3, title: "Forecast & Cost Control", desc: "Automatic forecast, EAC/ETC, confidence intervals and finish date vs planned targets.", bullets: ["Trend projection from actuals", "Daily burn-rate analytics", "Schedule ahead/behind indicators"] },
  { icon: ShoppingCart, title: "Procurement Pipeline", desc: "Requisition → Enquiry → PO → Delivery → Invoice → Disbursement.", bullets: ["Linked document chain", "Supplier quotes side-by-side", "Milestone payment terms management"] },
  { icon: ShieldCheck, title: "Three-Way Match", desc: "PO qty vs GRN receipts vs Invoice rate — automated gatekeeper holding unauthorized disbursements.", bullets: ["Delivery discrepancy auto-flag", "Real-time quantity variance display", "Automated payment locking"] },
  { icon: Boxes, title: "Materials & Inventory", desc: "Live stock gauges, physical GRN, storekeeper issues, inter-site transfers, consumption audits.", bullets: ["Healthy / Low / Out-of-stock indicators", "Store-to-site transfer pass verification", "Consumption tied directly to BOQ codes"] },
  { icon: Users, title: "Labour & Productivity", desc: "Daily muster roll, trade & gang attendance, overtime multipliers, productivity per BOQ item.", bullets: ["Daily present/absent headcount", "1.5x / 2.0x overtime automation", "Output measured in m³ & m² per man-hour"] },
  { icon: TrendingUp, title: "Progress, Quality & Safety", desc: "Digital site diary, weather stamps, shift logs, photos, snags/NCRs, safety scorecards.", bullets: ["Weather-stamped daily records", "Visual photo proof for snags", "Zero-incident safety tracking"] },
  { icon: Briefcase, title: "Subcontractors", desc: "Contracts, interim claims, valuation certificates, retention deductions, 4-factor performance grading.", bullets: ["Performance scoring matrix", "Automated retention holding ledger", "Self-reconciling claim ledger"] },
  { icon: FileSpreadsheet, title: "Variations & Claims", desc: "Architect instructions → Claims register → QS evaluation → PM approval → BOQ revision.", bullets: ["Financial threshold routing", "Instant cost impact charts", "Immutable revision links to BOQ"] },
  { icon: Building2, title: "Commercial Command", desc: "Feasibility, capital stack, developer debt drawdown, off-plan sales ledger, project margin.", bullets: ["18 full commercial lifecycle stages", "Developer vs Contractor views", "Continuous 35% margin tracker"] },
  { icon: FileText, title: "Reports Studio", desc: "10 branded executive PDF and CSV reports with live project picker and financial progress data.", bullets: ["Comprehensive budget vs actuals", "Cash position and liability forecasts", "Site execution metrics in numbers"] },
  { icon: DollarSign, title: "Project Margin Tracking", desc: "Live gross margin calculated continuously from committed POs vs certified actuals.", bullets: ["Revised budget ceiling guardrails", "Gross & net margin tracking", "Handover ledger reconciliation"] },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f7ff]/40 via-white to-[#f8fafc] text-slate-900 font-sans">
      <MarketingNav />

      {/* Radiant Glass Hero Header */}
      <header className="border-b border-slate-200/80 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,103,192,0.12),rgba(255,255,255,0))]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-14 md:py-20 text-center max-w-3xl">
          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-[#0067c0] border border-blue-200/80 px-4 py-1.5 rounded-full text-xs font-semibold mb-4 shadow-xs">
            Complete Platform Capabilities
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Every Module. <span className="bg-gradient-to-r from-[#0067c0] to-[#0284c7] bg-clip-text text-transparent">One Unified System.</span>
          </h1>
          <p className="mt-4 text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            7 operations modules, 10 executive reports, and 18 commercial lifecycle stages. Let the system calculate what it can so your team never has to re-type data across multiple spreadsheets.
          </p>
        </div>
      </header>

      {/* Grid of Modules in Glass Cards */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-14 md:py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-card p-6 hover:shadow-glass-hover hover:border-blue-300 hover:-translate-y-1 transition-all flex flex-col"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0067c0] to-[#0284c7] text-white flex items-center justify-center mb-4 shadow-md shadow-blue-500/20">
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">{f.title}</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{f.desc}</p>
              <ul className="mt-4 space-y-2 flex-1 border-t border-slate-100 pt-3">
                {f.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-xs text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-[#0067c0] shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section className="bg-white/80 backdrop-blur-xl border-y border-slate-200/80 py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 shadow-card">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0067c0] flex items-center justify-center mb-3">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-slate-900">Zero Redundancy</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Numbers entered once in Budget automatically cascade downstream to Procurement, Inventory, and Labour without duplicate manual entry.
              </p>
            </div>
            <div className="bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 shadow-card">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-slate-900">Continuous Gatekeeper</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Discrepancies between purchase orders, physical site delivery slips, and supplier invoices trigger automatic payment holds before accounting approves.
              </p>
            </div>
            <div className="bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 shadow-card">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                <Building2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-slate-900">Commercial Intelligence</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Executive leadership and commercial directors see live development margins, debt drawdowns, and receivables rather than raw unconnected expense logs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-14 md:py-20 text-center">
        <div className="glass-hero p-8 md:p-12 text-white rounded-3xl relative overflow-hidden max-w-4xl mx-auto shadow-glass">
          <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Experience the Complete Platform
          </h3>
          <p className="text-sm text-white/80 mt-2 max-w-xl mx-auto">
            Get instant access to all 7 operations and commercial modules on our live interactive demo workspace.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-white text-[#0067c0] hover:bg-slate-100 rounded-xl font-bold text-xs shadow-md transition-all active:scale-[0.98]"
            >
              Launch Live App Demo
            </Link>
            <Link
              href="/pricing"
              className="px-6 py-3 bg-white/15 hover:bg-white/25 text-white border border-white/30 rounded-xl font-semibold text-xs backdrop-blur-sm transition-all"
            >
              View Transparent Pricing →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
