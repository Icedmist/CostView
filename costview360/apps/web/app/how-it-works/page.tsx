import Link from "next/link";
import { MarketingNav } from "@/components/marketing/nav";
import { CheckCircle2, FileSpreadsheet, ShoppingCart, Building2, Users, HardHat, Zap, ArrowRight } from "lucide-react";

export const metadata = {
  title: "How It Works — CostView",
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
    bullets: ["Continuous actual cost vs committed purchase orders", "Certified valuation certificates with automated retention holding", "Live gross and net margin tracking", "10 standardized branded PDF reports ready for client review"],
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F5] text-slate-900 font-sans">
      <MarketingNav />

      {/* Hero */}
      <header className="border-b border-[#E5E5DE] bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-14 md:py-20 text-center max-w-3xl">
          <div className="inline-flex items-center gap-1.5 bg-[#0A2540]/10 text-[#0A2540] border border-[#0A2540]/20 px-4 py-1.5 rounded-full text-xs font-semibold mb-4 shadow-xs">
            End-to-End Workflow
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0A2540] leading-tight">
            One Unified Flow. Not Six Disconnected Silos.
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
              className="bg-white border border-[#E5E5DE] rounded-3xl p-8 shadow-xs hover:border-[#0A2540] transition-all flex flex-col"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#0A2540] text-white flex items-center justify-center font-mono font-extrabold text-lg mb-6 shadow-sm">
                {s.n}
              </div>
              <h3 className="font-bold text-lg text-[#0A2540]">{s.title}</h3>
              <p className="text-xs text-slate-600 mt-3 leading-relaxed">{s.desc}</p>
              <ul className="mt-6 space-y-2.5 flex-1 border-t border-slate-100 pt-4">
                {s.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-[#0A2540] shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Role Segregation Strip */}
      <section className="bg-white border-y border-[#E5E5DE] py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="max-w-3xl mb-10">
            <div className="inline-flex items-center gap-1.5 bg-[#0A2540]/10 text-[#0A2540] border border-[#0A2540]/20 px-3.5 py-1 rounded-full text-xs font-semibold">
              Governance &amp; Accountability
            </div>
            <h2 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight text-[#0A2540]">
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
                className="bg-[#FAF9F5] border border-[#E5E5DE] rounded-2xl p-5 shadow-xs hover:border-[#0A2540] transition-all"
              >
                <div className="font-bold text-[#0A2540] text-sm mb-1">{role}</div>
                <div className="text-slate-500 leading-relaxed text-[11.5px]">{perms}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-14 md:py-20 text-center">
        <div className="bg-[#0A2540] p-8 md:p-12 text-white rounded-3xl relative overflow-hidden max-w-4xl mx-auto shadow-xl">
          <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Ready to streamline your site operations?
          </h3>
          <p className="text-sm text-slate-200 mt-2 max-w-xl mx-auto">
            Get started in under two minutes with pre-loaded demo data or import your existing project BOQ directly.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-6 py-3 bg-white text-[#0A2540] hover:bg-slate-100 rounded-xl font-bold text-xs shadow-md transition-all active:scale-[0.98]"
            >
              Create Free Workspace
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-transparent hover:bg-white/10 text-white border border-white/40 rounded-xl font-semibold text-xs shadow-xs transition-all"
            >
              Explore Demo Project →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
