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
  title: "Features — CostView",
  description: "All 10 reports, comprehensive operations modules, and site cost intelligence.",
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
  { icon: Building2, title: "Contracts & Governance", desc: "Contract packages, site instructions, architect notifications, and audit-ready governance.", bullets: ["Site instruction register", "Contract baseline tracking", "Continuous financial audit defense"] },
  { icon: FileText, title: "Reports Studio", desc: "10 branded executive PDF and CSV reports with live project picker and financial progress data.", bullets: ["Comprehensive budget vs actuals", "Cash position and liability forecasts", "Site execution metrics in numbers"] },
  { icon: DollarSign, title: "Project Margin Tracking", desc: "Live gross margin calculated continuously from committed POs vs certified actuals.", bullets: ["Revised budget ceiling guardrails", "Gross & net margin tracking", "Handover ledger reconciliation"] },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F5] text-slate-900 font-sans">
      <MarketingNav />

      {/* Hero Header */}
      <header className="border-b border-[#E5E5DE] bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-14 md:py-20 text-center max-w-3xl">
          <div className="inline-flex items-center gap-1.5 bg-[#0A2540]/10 text-[#0A2540] border border-[#0A2540]/20 px-4 py-1.5 rounded-full text-xs font-semibold mb-4 shadow-xs">
            Complete Platform Capabilities
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0A2540] leading-tight">
            Every Module. One Unified System.
          </h1>
          <p className="mt-4 text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Operational modules, 10 executive reports, and automated cost governance. Let the system calculate what it can so your team never has to re-type data across multiple spreadsheets.
          </p>
        </div>
      </header>

      {/* Grid of Modules in Glass Cards */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-14 md:py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-white border border-[#E5E5DE] rounded-2xl shadow-xs p-6 hover:border-[#0A2540] transition-all flex flex-col"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0A2540] text-white flex items-center justify-center mb-4 shadow-sm">
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#0A2540]">{f.title}</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{f.desc}</p>
              <ul className="mt-4 space-y-2 flex-1 border-t border-slate-100 pt-3">
                {f.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-xs text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-[#0A2540] shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section className="bg-white border-y border-[#E5E5DE] py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#FAF9F5] border border-[#E5E5DE] rounded-2xl p-6 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#0A2540]/10 text-[#0A2540] flex items-center justify-center mb-3">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-[#0A2540]">Zero Redundancy</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Numbers entered once in Budget automatically cascade downstream to Procurement, Inventory, and Labour without duplicate manual entry.
              </p>
            </div>
            <div className="bg-[#FAF9F5] border border-[#E5E5DE] rounded-2xl p-6 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-slate-900">Continuous Gatekeeper</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Discrepancies between purchase orders, physical site delivery slips, and supplier invoices trigger automatic payment holds before accounting approves.
              </p>
            </div>
            <div className="bg-[#FAF9F5] border border-[#E5E5DE] rounded-2xl p-6 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#0A2540]/10 text-[#0A2540] flex items-center justify-center mb-3">
                <Building2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-[#0A2540]">Cost Intelligence</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Executive leadership and project directors see real-time cost variance, cash liabilities, and committed forecasts rather than raw unconnected expense logs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-14 md:py-20 text-center">
        <div className="bg-[#0A2540] p-8 md:p-12 text-white rounded-3xl relative overflow-hidden max-w-4xl mx-auto shadow-xl">
          <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Experience the Complete Platform
          </h3>
          <p className="text-sm text-slate-200 mt-2 max-w-xl mx-auto">
            Get instant access to all operations modules on our live interactive demo workspace.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-white text-[#0A2540] hover:bg-slate-100 rounded-xl font-bold text-xs shadow-md transition-all active:scale-[0.98]"
            >
              Launch Live App Demo
            </Link>
            <Link
              href="/pricing"
              className="px-6 py-3 bg-transparent hover:bg-white/10 text-white border border-white/40 rounded-xl font-semibold text-xs shadow-xs transition-all"
            >
              View Transparent Pricing →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
