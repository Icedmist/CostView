import Link from "next/link";
import { MarketingNav } from "@/components/marketing/nav";
import { CheckCircle2, FileSpreadsheet, ShoppingCart, Building2, Users, HardHat, Zap, ArrowRight } from "lucide-react";

export const metadata = {
  title: "How It Works — CostView 360",
  description: "Import BOQ → Execute & Auto-Match → Close Out. Clear role gates and financial controls.",
};

const STEPS = [
  {
    n: "01",
    title: "Import BOQ & Lock Approved Baseline",
    desc: "Upload your bill of quantities via CSV or Excel. The system automatically structures your cost breakdown hierarchy, validates rates, and sets your approved ceiling. From that moment, any scope or price change requires a formal, auditable revision.",
    bullets: ["Hierarchical Cost Codes (Substructure, Superstructure, MEP)", "Item description, units, quantities, and tender rates", "Real-time ±5% variance trigger initialized", "Locked baseline protects against unapproved budget creep"],
  },
  {
    n: "02",
    title: "Automate Procurement & Continuous 3-Way Match",
    desc: "Site requisitions spawn multi-supplier RFQs and formal purchase orders. When deliveries arrive, storekeepers record actual physical goods received notes (GRN). Supplier invoices are auto-validated before accounting approves payment.",
    bullets: ["Requisition triage by priority (Standard / Critical)", "Side-by-side quote evaluation and lead-time tracking", "Physical GRN quantity vs billed quantity auto-reconciliation", "Discrepancies automatically hold payment disbursement"],
  },
  {
    n: "03",
    title: "Defend Close-Out & Protect Project Margin",
    desc: "Track daily labour muster rolls, material stock on-hand, and subcontractor valuations. Generate defensible interim payment certificates and final accounts without end-of-project contract disputes.",
    bullets: ["Continuous actual cost vs committed purchase orders", "Certified valuation certificates with automated retention holding", "Commercial mode tracks real-time development margin", "10 standardized branded PDF reports ready for client review"],
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f7ff]/40 via-white to-[#f8fafc] text-slate-900 font-sans">
      <MarketingNav />

      {/* Hero */}
      <header className="border-b border-slate-200/80 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,103,192,0.12),rgba(255,255,255,0))]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-14 md:py-20 text-center max-w-3xl">
          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-[#0067c0] border border-blue-200/80 px-4 py-1.5 rounded-full text-xs font-semibold mb-4 shadow-xs">
            End-to-End Workflow
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            One Unified Flow. <span className="bg-gradient-to-r from-[#0067c0] to-[#0284c7] bg-clip-text text-transparent">Not Six Disconnected Silos.</span>
          </h1>
          <p className="mt-4 text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            A single rate entered in the master budget flows automatically into purchase orders, site inventory, and subcontractor claims — eliminating double-entry errors.
          </p>
        </div>
      </header>

      {/* 3 Steps */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-14 md:py-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-8 shadow-card hover:shadow-glass-hover hover:border-blue-300 transition-all flex flex-col"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-[#0067c0] flex items-center justify-center font-mono font-extrabold text-lg mb-6 shadow-xs">
                {s.n}
              </div>
              <h3 className="font-bold text-lg text-slate-900">{s.title}</h3>
              <p className="text-xs text-slate-600 mt-3 leading-relaxed">{s.desc}</p>
              <ul className="mt-6 space-y-2.5 flex-1 border-t border-slate-100 pt-4">
                {s.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-[#0067c0] shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Role Segregation Strip */}
      <section className="bg-white/80 backdrop-blur-xl border-y border-slate-200/80 py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="max-w-3xl mb-10">
            <div className="inline-flex items-center gap-1.5 bg-blue-50 text-[#0067c0] border border-blue-200/80 px-3.5 py-1 rounded-full text-xs font-semibold">
              Governance &amp; Accountability
            </div>
            <h2 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
              Stakeholders See Exactly What Pertains to Their Function
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Role-Based Access Control and Row-Level Security guarantee that operational responsibilities are clean, audited, and tamper-proof.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-4 text-xs">
            {[
              ["Admin", "All system settings, user onboarding, and master configuration"],
              ["Project Manager", "Overall budget command, procurement approvals, progress studio"],
              ["Quantity Surveyor", "BOQ cost lines, rate revisions, interim valuations & final accounts"],
              ["Site Engineer", "Daily material receipts, labour headcount muster, shift diary"],
              ["Procurement Officer", "Vendor RFQ issuance, PO generation, and 3-way match reconciliations"],
              ["Accountant", "Supplier invoice audits, payment approvals, and bank accounts"],
              ["Storekeeper", "Physical stock issuance, warehouse bin counts, site transfers"],
              ["Architect", "Drawing packages, technical variation reviews, and snag logs"],
            ].map(([role, perms]) => (
              <div
                key={role}
                className="bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-5 shadow-card hover:border-blue-200 transition-all"
              >
                <div className="font-bold text-slate-900 text-sm mb-1">{role}</div>
                <div className="text-slate-500 leading-relaxed text-[11.5px]">{perms}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-14 md:py-20 text-center">
        <div className="smooth-pearl-hero p-8 md:p-12 text-slate-900 rounded-3xl relative overflow-hidden max-w-4xl mx-auto shadow-pearl border border-sky-200/80">
          <div className="pointer-events-none absolute -right-16 -bottom-16 w-64 h-64 bg-gradient-to-br from-sky-400/20 via-blue-500/10 to-indigo-500/10 rounded-full blur-3xl animate-float" />
          <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
            Ready to <span className="bg-gradient-to-r from-[#0067c0] to-[#0284c7] bg-clip-text text-transparent">streamline your site operations?</span>
          </h3>
          <p className="text-sm text-slate-600 mt-2 max-w-xl mx-auto">
            Get started in under two minutes with pre-loaded demo data or import your existing project BOQ directly.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-6 py-3 bg-gradient-to-r from-[#0067c0] to-[#0284c7] hover:from-[#005ba1] hover:to-[#0275b0] text-white rounded-xl font-bold text-xs shadow-md shadow-blue-600/25 transition-all active:scale-[0.98]"
            >
              Create Free Workspace
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 rounded-xl font-semibold text-xs shadow-xs backdrop-blur-sm transition-all"
            >
              Explore Demo Project →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
