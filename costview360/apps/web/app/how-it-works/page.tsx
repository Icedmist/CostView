import Link from "next/link";
import { MarketingNav } from "@/components/marketing/nav";
import {
  CheckCircle2,
  FileSpreadsheet,
  ShoppingCart,
  Building2,
  Users,
  HardHat,
  Zap,
  ArrowRight,
} from "lucide-react";

export const metadata = {
  title: "How It Works — CostView",
  description: "Import BOQ → Execute & Auto-Match → Close Out. Clear role gates and financial controls.",
};

const STEPS = [
  {
    n: "01",
    title: "Import BOQ & Lock Approved Baseline",
    desc: "Upload your bill of quantities via CSV or Excel. The system automatically structures your cost breakdown hierarchy, validates rates, and sets your approved ceiling. From that moment, any scope or price change requires a formal, auditable revision.",
    bullets: [
      "Hierarchical Cost Codes (Substructure, Superstructure, MEP)",
      "Item descriptions, units, quantities, and tender rates",
      "Real-time ±5% variance trigger initialized automatically",
      "Locked baseline protects against unapproved budget creep",
    ],
  },
  {
    n: "02",
    title: "Automate Procurement & Continuous 3-Way Match",
    desc: "Site requisitions spawn multi-supplier RFQs and formal purchase orders. When deliveries arrive, storekeepers record actual physical goods received notes (GRN). Supplier invoices are auto-validated before accounting approves payment.",
    bullets: [
      "Requisition triage by priority (Standard / Critical)",
      "Side-by-side quote evaluation and lead-time tracking",
      "Physical GRN quantity vs billed quantity auto-reconciliation",
      "Discrepancies automatically hold payment disbursement",
    ],
  },
  {
    n: "03",
    title: "Defend Close-Out & Protect Project Margin",
    desc: "Track daily labour muster rolls, material stock on-hand, and subcontractor valuations. Generate defensible interim payment certificates and final accounts without end-of-project contract disputes.",
    bullets: [
      "Continuous actual cost vs committed purchase orders",
      "Certified valuation certificates with automated retention holding",
      "Live gross and net margin tracking per package",
      "10 standardized branded PDF reports ready for client review",
    ],
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F5] text-slate-900 font-sans selection:bg-[#0A2540] selection:text-white">
      <MarketingNav />

      {/* Hero */}
      <header className="border-b-2 border-[#E5E5DE] bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-[#FAF9F5] text-[#0A2540] border-2 border-[#E5E5DE] px-5 py-2 rounded-full text-sm font-black tracking-wide mb-6 shadow-xs">
            End-to-End Workflow
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#0A2540] leading-tight">
            One Unified Flow. Not Six Disconnected Silos.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-[#0A2540]/80 leading-relaxed max-w-2xl mx-auto font-normal">
            A single rate entered in the master budget flows automatically into purchase orders, site inventory, and subcontractor claims — eliminating double-entry errors.
          </p>
        </div>
      </header>

      {/* 3 Steps */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="grid lg:grid-cols-3 gap-8">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="bg-white border-2 border-[#E5E5DE] rounded-3xl p-8 md:p-10 shadow-xs hover:border-[#0A2540] hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#0A2540] text-white flex items-center justify-center font-mono font-black text-xl mb-6 shadow-md">
                  {s.n}
                </div>
                <h2 className="font-black text-xl md:text-2xl text-[#0A2540]">{s.title}</h2>
                <p className="text-base text-[#0A2540]/80 mt-3.5 leading-relaxed font-normal">{s.desc}</p>
              </div>

              <ul className="mt-8 space-y-3.5 flex-1 border-t-2 border-[#E5E5DE] pt-6">
                {s.bullets.map((b) => (
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

      {/* Role Segregation Strip */}
      <section className="bg-white border-y-2 border-[#E5E5DE] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 bg-[#FAF9F5] text-[#0A2540] border-2 border-[#E5E5DE] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
              Governance &amp; Accountability
            </div>
            <h2 className="mt-5 text-3xl md:text-5xl font-black tracking-tight text-[#0A2540] leading-tight">
              Stakeholders See Exactly What Pertains to Their Function
            </h2>
            <p className="text-base md:text-lg text-[#0A2540]/80 mt-3 leading-relaxed font-normal">
              Role-Based Access Control and Row-Level Security guarantee that operational responsibilities are clean, audited, and tamper-proof.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                className="bg-[#FAF9F5] border-2 border-[#E5E5DE] rounded-2xl p-6 shadow-xs hover:border-[#0A2540] hover:bg-white transition-all"
              >
                <div className="font-black text-[#0A2540] text-base md:text-lg mb-1.5">{role}</div>
                <div className="text-sm font-semibold text-[#0A2540]/75 leading-relaxed">{perms}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 text-center">
        <div className="bg-[#0A2540] p-8 md:p-14 text-white rounded-3xl relative overflow-hidden max-w-4xl mx-auto shadow-2xl border-2 border-[#0A2540]">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Ready to streamline your site operations?
          </h2>
          <p className="text-base md:text-lg text-white/80 mt-3.5 max-w-xl mx-auto font-normal">
            Get started in under two minutes with pre-loaded demo data or import your existing project BOQ directly.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="min-h-[52px] px-8 py-4 bg-white text-[#0A2540] hover:bg-slate-100 rounded-xl font-black text-base shadow-lg transition-all active:scale-[0.98] flex items-center gap-2"
            >
              <span>Create Free Workspace</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/dashboard"
              className="min-h-[52px] px-8 py-4 bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 rounded-xl font-black text-base shadow-xs transition-all flex items-center"
            >
              Explore Demo Project →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
