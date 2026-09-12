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
  {
    icon: Calculator,
    title: "BOQ & Budget Control",
    desc: "BOQ import, hierarchical cost codes, live variance ±5%, revision audit trail, and final account reconciliation.",
    bullets: [
      "CSV/Excel hierarchical import with automatic mapping",
      "Unique BOQ code tagging per trade package",
      "Real-time On/Over/Under variance alert system",
      "Documented revision approval workflow with audit justification",
    ],
  },
  {
    icon: BarChart3,
    title: "Forecast & Cost Control",
    desc: "Automatic forecast, EAC/ETC projections, confidence intervals, and finish date vs planned targets.",
    bullets: [
      "Statistical trend projection from certified actuals",
      "Daily burn-rate and cash drawdown analytics",
      "Real-time schedule ahead/behind indicators",
    ],
  },
  {
    icon: ShoppingCart,
    title: "Procurement Pipeline",
    desc: "Seamless requisition to enquiry to PO to delivery to invoice to disbursement workflow.",
    bullets: [
      "Fully linked document and approval chain",
      "Side-by-side vendor quotes evaluation",
      "Milestone payment terms management and tracking",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Three-Way Match Gate",
    desc: "PO qty vs GRN receipts vs Invoice rate — automated gatekeeper holding unauthorized disbursements.",
    bullets: [
      "Site delivery quantity discrepancy auto-locking",
      "Real-time quantity and rate variance calculation",
      "Automated accounting payment hold triggers",
    ],
  },
  {
    icon: Boxes,
    title: "Materials & Inventory",
    desc: "Live stock gauges, physical GRN, storekeeper issues, inter-site transfers, and consumption audits.",
    bullets: [
      "Healthy / Low / Out-of-stock inventory indicators",
      "Store-to-site transfer pass verification",
      "Consumption ledger tied directly to BOQ codes",
    ],
  },
  {
    icon: Users,
    title: "Labour & Productivity",
    desc: "Daily muster roll, trade & gang attendance, overtime multipliers, and productivity per BOQ item.",
    bullets: [
      "Daily present/absent headcount and shift rosters",
      "1.5x / 2.0x overtime calculation automation",
      "Output measured in m³ & m² per man-hour",
    ],
  },
  {
    icon: TrendingUp,
    title: "Progress, Quality & Safety",
    desc: "Digital site diary, weather stamps, shift logs, photo proof, snags/NCRs, and HSE scorecards.",
    bullets: [
      "Weather-stamped daily site shift execution records",
      "Visual photo proof for snags and inspection NCRs",
      "Zero-incident HSE safety observation tracking",
    ],
  },
  {
    icon: Briefcase,
    title: "Subcontractors & Retention",
    desc: "Contracts, interim claims, valuation certificates, retention deductions, and 4-factor grading.",
    bullets: [
      "Subcontractor trade performance scoring matrix",
      "Automated 10% retention holding escrow ledger",
      "Self-reconciling claim and certificate register",
    ],
  },
  {
    icon: FileSpreadsheet,
    title: "Variations & Claims",
    desc: "Site instructions to claims register to QS evaluation to PM approval to BOQ baseline revision.",
    bullets: [
      "Financial threshold approval routing",
      "Instant cost impact charts and revised baselines",
      "Immutable revision links directly to master BOQ",
    ],
  },
  {
    icon: Building2,
    title: "Contracts & Governance",
    desc: "Contract packages, site instructions, architect notifications, and audit-ready governance.",
    bullets: [
      "Formal site instruction register with photo logs",
      "Contract baseline variation governance",
      "Continuous financial audit defense and trail",
    ],
  },
  {
    icon: FileText,
    title: "Reports Studio",
    desc: "10 branded executive PDF and CSV reports with live project picker and financial progress data.",
    bullets: [
      "Comprehensive budget vs committed vs actuals",
      "Cash position and future liability forecasts",
      "Site execution metrics in verified numbers",
    ],
  },
  {
    icon: DollarSign,
    title: "Project Margin Tracking",
    desc: "Live gross margin calculated continuously from committed POs vs certified actual drawdowns.",
    bullets: [
      "Revised budget ceiling guardrails",
      "Gross & net margin tracking per package",
      "Handover ledger reconciliation to final account",
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F5] text-slate-900 font-sans selection:bg-[#0A2540] selection:text-white">
      <MarketingNav />

      {/* Hero Header */}
      <header className="border-b-2 border-[#E5E5DE] bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-[#FAF9F5] text-[#0A2540] border-2 border-[#E5E5DE] px-5 py-2 rounded-full text-sm font-black tracking-wide mb-6 shadow-xs">
            Complete Platform Capabilities
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#0A2540] leading-tight">
            Every Module. One Unified System.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-[#0A2540]/80 leading-relaxed max-w-2xl mx-auto font-normal">
            Operational modules, 10 executive reports, and automated cost governance. Let the system calculate what it can so your team never has to re-type data across multiple spreadsheets.
          </p>
        </div>
      </header>

      {/* Grid of Modules in Scaled Neo-Brutalist Cards */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-white border-2 border-[#E5E5DE] rounded-3xl shadow-xs p-7 md:p-8 hover:border-[#0A2540] hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#0A2540] text-white flex items-center justify-center mb-6 shadow-md">
                  <f.icon className="w-7 h-7 text-white" />
                </div>
                <h2 className="font-black text-xl md:text-2xl text-[#0A2540]">{f.title}</h2>
                <p className="text-base text-[#0A2540]/80 mt-3 leading-relaxed font-normal">{f.desc}</p>
              </div>

              <ul className="mt-6 space-y-3 flex-1 border-t-2 border-[#E5E5DE] pt-5">
                {f.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-sm md:text-base font-semibold text-[#0A2540]/85">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section className="bg-white border-y-2 border-[#E5E5DE] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#FAF9F5] border-2 border-[#E5E5DE] rounded-2xl p-8 shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-[#0A2540] text-white flex items-center justify-center mb-5 shadow-sm">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-black text-xl text-[#0A2540]">Zero Redundancy</h3>
              <p className="text-base text-[#0A2540]/80 mt-3 leading-relaxed font-normal">
                Numbers entered once in Budget automatically cascade downstream to Procurement, Inventory, and Labour without duplicate manual entry.
              </p>
            </div>
            <div className="bg-[#FAF9F5] border-2 border-[#E5E5DE] rounded-2xl p-8 shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-[#0A2540] text-white flex items-center justify-center mb-5 shadow-sm">
                <ShieldCheck className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-black text-xl text-[#0A2540]">Continuous Gatekeeper</h3>
              <p className="text-base text-[#0A2540]/80 mt-3 leading-relaxed font-normal">
                Discrepancies between purchase orders, physical site delivery slips, and supplier invoices trigger automatic payment holds before accounting approves.
              </p>
            </div>
            <div className="bg-[#FAF9F5] border-2 border-[#E5E5DE] rounded-2xl p-8 shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-[#0A2540] text-white flex items-center justify-center mb-5 shadow-sm">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-black text-xl text-[#0A2540]">Cost Intelligence</h3>
              <p className="text-base text-[#0A2540]/80 mt-3 leading-relaxed font-normal">
                Executive leadership and project directors see real-time cost variance, cash liabilities, and committed forecasts rather than raw unconnected expense logs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 text-center">
        <div className="bg-[#0A2540] p-8 md:p-14 text-white rounded-3xl relative overflow-hidden max-w-4xl mx-auto shadow-2xl border-2 border-[#0A2540]">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Experience the Complete Platform
          </h2>
          <p className="text-base md:text-lg text-white/80 mt-3.5 max-w-xl mx-auto font-normal">
            Get instant access to all operations modules on our live interactive demo workspace.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="min-h-[52px] px-8 py-4 bg-white text-[#0A2540] hover:bg-slate-100 rounded-xl font-black text-base shadow-lg transition-all active:scale-[0.98] flex items-center gap-2"
            >
              <span>Launch Live App Demo</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/pricing"
              className="min-h-[52px] px-8 py-4 bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 rounded-xl font-black text-base shadow-xs transition-all flex items-center"
            >
              View Pricing Plans
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
