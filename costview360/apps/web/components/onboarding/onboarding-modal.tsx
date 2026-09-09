"use client";

import React, { useState } from "react";
import {
  X,
  BookOpen,
  FileText,
  CheckCircle2,
  AlertTriangle,
  GitPullRequest,
  Download,
  ExternalLink,
  ShieldCheck,
  Layers,
  ArrowRight,
  HardHat,
  Receipt,
  FileSpreadsheet,
  Boxes
} from "lucide-react";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "workflows" | "contributing" | "pdf">("overview");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/75 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-cream-50 border-[3px] border-navy-800 shadow-brutal max-w-4xl w-full max-h-[90vh] flex flex-col my-auto overflow-hidden">
        {/* Modal Top Banner */}
        <div className="bg-navy-800 text-white px-5 py-4 flex items-center justify-between border-b-[3px] border-navy-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-mustard-400 border-2 border-white flex items-center justify-center text-navy-800 shadow-brutal-sm shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base md:text-lg font-black tracking-tight uppercase">
                  CostView 360 · User Guide & Onboarding Hub
                </h2>
                <span className="text-xs bg-mustard-400 text-navy-800 px-2 py-0.5 border border-navy-800 font-mono font-bold hidden sm:inline-block">
                  v2.0 Manual
                </span>
              </div>
              <p className="text-xs text-cream-200">
                Commercial construction intelligence, field operations & workflow governance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white border-2 border-navy-800 text-navy-800 hover:bg-mustard-400 flex items-center justify-center shadow-brutal-sm transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-cream-100 border-b-2 border-navy-800 px-4 py-2 flex flex-wrap gap-2 shrink-0">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-3 py-1.5 text-xs font-black uppercase tracking-wide border-2 border-navy-800 transition-all ${
              activeTab === "overview"
                ? "bg-navy-800 text-white shadow-brutal-sm"
                : "bg-white text-navy-800 hover:bg-cream-200"
            }`}
          >
            1. App Functions & Tenets
          </button>
          <button
            onClick={() => setActiveTab("workflows")}
            className={`px-3 py-1.5 text-xs font-black uppercase tracking-wide border-2 border-navy-800 transition-all ${
              activeTab === "workflows"
                ? "bg-navy-800 text-white shadow-brutal-sm"
                : "bg-white text-navy-800 hover:bg-cream-200"
            }`}
          >
            2. "What To Do" Operational Guide
          </button>
          <button
            onClick={() => setActiveTab("contributing")}
            className={`px-3 py-1.5 text-xs font-black uppercase tracking-wide border-2 border-navy-800 transition-all ${
              activeTab === "contributing"
                ? "bg-navy-800 text-white shadow-brutal-sm"
                : "bg-white text-navy-800 hover:bg-cream-200"
            }`}
          >
            3. Contributing & AGENTS.md
          </button>
          <button
            onClick={() => setActiveTab("pdf")}
            className={`px-3 py-1.5 text-xs font-black uppercase tracking-wide border-2 border-navy-800 transition-all flex items-center gap-1.5 ${
              activeTab === "pdf"
                ? "bg-mustard-400 text-navy-800 shadow-brutal-sm"
                : "bg-white text-navy-800 hover:bg-cream-200"
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Branded PDF</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-navy-800 flex-1">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-4">
              <div className="bg-white border-2 border-navy-800 p-4 shadow-brutal-sm">
                <h3 className="text-sm font-black text-navy-800 uppercase tracking-wide flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Why CostView 360 Exists: Eliminating Commercial Construction Leakage
                </h3>
                <p className="text-xs text-navy-800/80 mt-1 leading-relaxed">
                  Commercial building projects routinely lose 15% to 30% of their total budget due to untracked verbal
                  site instructions, duplicate material invoicing, ghost worker muster fraud, and unverified interim
                  subcontractor claims. CostView 360 unifies field operations with financial control to ensure every
                  Naira (₦) committed on site is auditable, verified, and locked against unauthorized cost overruns.
                </p>
              </div>

              {/* The 4 Pillars Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white border-2 border-navy-800 p-3 shadow-brutal-sm">
                  <div className="text-xs font-black text-navy-800 uppercase flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 bg-mustard-400 border border-navy-800" />
                    ₦ NGN Native + Dual Currency
                  </div>
                  <p className="text-xs text-navy-800/70">
                    Engineered from day 1 for Nigerian construction accounting with live conversion into USD, GBP, and EUR
                    for imported MEP plant, elevators, and foreign contract packages.
                  </p>
                </div>

                <div className="bg-white border-2 border-navy-800 p-3 shadow-brutal-sm">
                  <div className="text-xs font-black text-navy-800 uppercase flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 bg-emerald-500 border border-navy-800" />
                    Strict 3-Way Invoicing Match
                  </div>
                  <p className="text-xs text-navy-800/70">
                    Matches Purchase Orders (PO) against physical Goods Received Notes (GRN) from site stores and vendor
                    invoices before payment approval. Zero tolerance for unreceived goods.
                  </p>
                </div>

                <div className="bg-white border-2 border-navy-800 p-3 shadow-brutal-sm">
                  <div className="text-xs font-black text-navy-800 uppercase flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 bg-amber-500 border border-navy-800" />
                    10% Statutory Retention Protection
                  </div>
                  <p className="text-xs text-navy-800/70">
                    Automatic 10% retention fund withholding on every certified subcontractor claim, safeguarding defects
                    liability funds until practical completion and final snag closeout.
                  </p>
                </div>

                <div className="bg-white border-2 border-navy-800 p-3 shadow-brutal-sm">
                  <div className="text-xs font-black text-navy-800 uppercase flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 bg-blue-500 border border-navy-800" />
                    Immutable PostgreSQL Audit Ledger
                  </div>
                  <p className="text-xs text-navy-800/70">
                    Every budget baseline revision, variation order advancement, and payment voucher is permanently stamped
                    with actor identity, timestamp, and delta changes for full regulatory compliance.
                  </p>
                </div>
              </div>

              {/* 10 Modules List */}
              <div className="bg-white border-2 border-navy-800 p-4 shadow-brutal-sm">
                <h4 className="text-xs font-black text-navy-800 uppercase mb-2 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-navy-800" />
                  The 10 Core Functional Subsystems in CostView 360
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-start gap-2">
                    <span className="font-mono font-bold text-navy-800 bg-cream-100 border border-navy-800 px-1 py-0.5">01</span>
                    <span><strong>Commercial Command Center:</strong> KPI dashboard, CPI/SPI, cashflow velocity.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-mono font-bold text-navy-800 bg-cream-100 border border-navy-800 px-1 py-0.5">02</span>
                    <span><strong>BOQ & Baseline Engine:</strong> Excel/CSV parser, locked baseline, 5% contingency.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-mono font-bold text-navy-800 bg-cream-100 border border-navy-800 px-1 py-0.5">03</span>
                    <span><strong>3-Way Procurement Match:</strong> PO vs GRN vs Invoice reconciliation matrix.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-mono font-bold text-navy-800 bg-cream-100 border border-navy-800 px-1 py-0.5">04</span>
                    <span><strong>Materials & Site Stores:</strong> Real-time warehouse gauges, transfers, daily usage.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-mono font-bold text-navy-800 bg-cream-100 border border-navy-800 px-1 py-0.5">05</span>
                    <span><strong>Labour Muster & Payroll:</strong> Daily craftsman attendance, overtime, weekly payroll.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-mono font-bold text-navy-800 bg-cream-100 border border-navy-800 px-1 py-0.5">06</span>
                    <span><strong>Site Diary & Inspections:</strong> Cloud shift journals, weather logs, photo snags/NCRs.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-mono font-bold text-navy-800 bg-cream-100 border border-navy-800 px-1 py-0.5">07</span>
                    <span><strong>Subcontractor Packages:</strong> Certified claims, 10% retention, 4-factor grading.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-mono font-bold text-navy-800 bg-cream-100 border border-navy-800 px-1 py-0.5">08</span>
                    <span><strong>Site Instructions & VOs:</strong> Architect SIs, 4-stage VO approval workflow.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-mono font-bold text-navy-800 bg-cream-100 border border-navy-800 px-1 py-0.5">09</span>
                    <span><strong>Branded Reports Studio:</strong> Cost-to-complete, final account reconciliations.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-mono font-bold text-navy-800 bg-cream-100 border border-navy-800 px-1 py-0.5">10</span>
                    <span><strong>Enterprise RBAC & Audit:</strong> 8 seeded role profiles, immutable event journal.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WORKFLOWS */}
          {activeTab === "workflows" && (
            <div className="space-y-4">
              <div className="bg-white border-2 border-navy-800 p-4 shadow-brutal-sm">
                <h3 className="text-sm font-black text-navy-800 uppercase tracking-wide flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Step-by-Step "What To Do" Operational Guide
                </h3>
                <p className="text-xs text-navy-800/70 mt-1">
                  Follow these step-by-step procedures to maintain financial and operational rigor throughout the project lifecycle.
                </p>
              </div>

              {/* Step 1 */}
              <div className="bg-white border-2 border-navy-800 p-4 shadow-brutal-sm space-y-2">
                <div className="flex items-center gap-2">
                  <span className="bg-navy-800 text-white font-mono font-bold px-2 py-0.5 text-xs">PHASE 1</span>
                  <h4 className="text-xs font-black uppercase text-navy-800">Day 1: BOQ Setup & Budget Baseline Lock</h4>
                </div>
                <ul className="text-xs text-navy-800/80 space-y-1 list-disc list-inside">
                  <li>Navigate to <strong>BOQ & Budget Baseline</strong>.</li>
                  <li>Click <strong>Import Excel / CSV BOQ</strong> to populate cost codes (SUB, CON, FIN, MEP).</li>
                  <li>Review baseline cost estimates and confirm the <strong>5.0% Contingency Reserve</strong>.</li>
                  <li>Once signed off by the Client and PM, click <strong>Lock Baseline</strong> to freeze the reference budget.</li>
                </ul>
              </div>

              {/* Step 2 */}
              <div className="bg-white border-2 border-navy-800 p-4 shadow-brutal-sm space-y-2">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-700 text-white font-mono font-bold px-2 py-0.5 text-xs">PHASE 2</span>
                  <h4 className="text-xs font-black uppercase text-navy-800">Daily Field Operations Routine</h4>
                </div>
                <ul className="text-xs text-navy-800/80 space-y-1 list-disc list-inside">
                  <li><strong>07:30 Muster:</strong> Open <strong>Labour Muster</strong> and mark daily attendance for artisans.</li>
                  <li><strong>10:00 Diary:</strong> Open <strong>Site Diary</strong>, check auto-stamped weather, and log shift accomplishments.</li>
                  <li><strong>13:00 Stores:</strong> In <strong>Materials & Stock</strong>, record physical deliveries and log material issues to work grids.</li>
                  <li><strong>16:00 QA/QC:</strong> Log inspection scopes. Failed inspections automatically generate defect Snags/NCRs.</li>
                </ul>
              </div>

              {/* Step 3 */}
              <div className="bg-white border-2 border-navy-800 p-4 shadow-brutal-sm space-y-2">
                <div className="flex items-center gap-2">
                  <span className="bg-amber-700 text-white font-mono font-bold px-2 py-0.5 text-xs">PHASE 3</span>
                  <h4 className="text-xs font-black uppercase text-navy-800">Monthly Subcontractor Claims & 10% Retention</h4>
                </div>
                <ul className="text-xs text-navy-800/80 space-y-1 list-disc list-inside">
                  <li>Subcontractor submits Interim Claim in <strong>Packages & Retention &gt; 6.2 Interim Claims</strong>.</li>
                  <li>Quantity Surveyor validates site measurements and clicks <strong>Certify & Apply 10%</strong>.</li>
                  <li>The system withholds 10% into the statutory retention holding account and certifies net payment.</li>
                  <li>Grade the subcontractor across the 4 key metrics (Quality, Schedule, Safety, Responsiveness).</li>
                </ul>
              </div>

              {/* Step 4 */}
              <div className="bg-white border-2 border-navy-800 p-4 shadow-brutal-sm space-y-2">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-700 text-white font-mono font-bold px-2 py-0.5 text-xs">PHASE 4</span>
                  <h4 className="text-xs font-black uppercase text-navy-800">Procurement & 3-Way Invoice Matching</h4>
                </div>
                <ul className="text-xs text-navy-800/80 space-y-1 list-disc list-inside">
                  <li>When supplier invoices arrive, open <strong>Procurement &gt; Three-Way Match</strong>.</li>
                  <li>System compares PO unit prices and quantities against physical Site GRNs and Vendor Invoices.</li>
                  <li>Any variance delta triggers a <strong>Discrepancy Flag</strong>, blocking unapproved cash disbursement.</li>
                </ul>
              </div>

              {/* Step 5 */}
              <div className="bg-white border-2 border-navy-800 p-4 shadow-brutal-sm space-y-2">
                <div className="flex items-center gap-2">
                  <span className="bg-purple-700 text-white font-mono font-bold px-2 py-0.5 text-xs">PHASE 5</span>
                  <h4 className="text-xs font-black uppercase text-navy-800">Site Instructions & 4-Stage Variation Orders</h4>
                </div>
                <ul className="text-xs text-navy-800/80 space-y-1 list-disc list-inside">
                  <li>Architect or Consultant logs formal instruction under <strong>7.1 Site Instructions</strong>.</li>
                  <li>QS raises a Variation Order (VO) linked to the instruction, estimating cost and time delta.</li>
                  <li>VO moves through: <strong>Draft &rarr; QS Valuation &rarr; PM Review &rarr; Approved</strong>.</li>
                  <li>Upon approval, the system automatically commits funds and updates the master budget forecast.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: CONTRIBUTING & AGENTS.MD */}
          {activeTab === "contributing" && (
            <div className="space-y-4">
              <div className="bg-white border-2 border-navy-800 p-4 shadow-brutal-sm">
                <h3 className="text-sm font-black text-navy-800 uppercase tracking-wide flex items-center gap-2">
                  <GitPullRequest className="w-4 h-4 text-navy-800" />
                  Contributing Guidelines & AGENTS.md Developer Protocol
                </h3>
                <p className="text-xs text-red-600 font-bold mt-1">
                  CRITICAL RULE: No direct pushes to main. Every change = Issue &rarr; Branch &rarr; PR &rarr; Merge.
                </p>
              </div>

              {/* Step-by-Step Developer Protocol */}
              <div className="bg-white border-2 border-navy-800 p-4 shadow-brutal-sm space-y-2">
                <h4 className="text-xs font-black text-navy-800 uppercase">The 5-Step Pull Request Protocol</h4>
                <div className="space-y-2 text-xs">
                  <div className="bg-cream-100 border border-navy-800 p-2 font-mono text-[11px]">
                    <span className="text-emerald-700 font-bold">1. Create Issue:</span><br />
                    gh issue create --title "&lt;scope&gt;: &lt;short&gt;" --body "Closes via PR" --label enhancement
                  </div>
                  <div className="bg-cream-100 border border-navy-800 p-2 font-mono text-[11px]">
                    <span className="text-emerald-700 font-bold">2. Checkout Branch:</span><br />
                    git checkout main &amp;&amp; git pull<br />
                    git checkout -b feat/issue-&lt;n&gt;-&lt;slug&gt; # or fix/
                  </div>
                  <div className="bg-cream-100 border border-navy-800 p-2 font-mono text-[11px]">
                    <span className="text-emerald-700 font-bold">3. Conventional Commit:</span><br />
                    git commit -m "feat(scope): ... (#&lt;n&gt;)" -m "Closes #&lt;n&gt;"
                  </div>
                  <div className="bg-cream-100 border border-navy-800 p-2 font-mono text-[11px]">
                    <span className="text-emerald-700 font-bold">4. Push &amp; Open PR:</span><br />
                    git push -u origin feat/issue-&lt;n&gt;-&lt;slug&gt;<br />
                    gh pr create --title "feat: ... (#&lt;n&gt;)" --body "Closes #&lt;n&gt;" --base main
                  </div>
                  <div className="bg-cream-100 border border-navy-800 p-2 font-mono text-[11px]">
                    <span className="text-emerald-700 font-bold">5. Squash Merge &amp; Deploy:</span><br />
                    gh pr merge --squash --delete-branch # Auto-deploys to Vercel
                  </div>
                </div>
              </div>

              {/* Pre-Seeded Demo Accounts */}
              <div className="bg-white border-2 border-navy-800 p-4 shadow-brutal-sm">
                <h4 className="text-xs font-black text-navy-800 uppercase mb-2">Pre-Seeded Enterprise Demo Credentials</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-navy-800">
                    <thead className="bg-navy-800 text-white font-mono">
                      <tr>
                        <th className="p-2 border border-navy-800">Role</th>
                        <th className="p-2 border border-navy-800">Email</th>
                        <th className="p-2 border border-navy-800">Password</th>
                        <th className="p-2 border border-navy-800">Primary Responsibility</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-navy-800 text-navy-800">
                      <tr>
                        <td className="p-2 font-bold">Admin</td>
                        <td className="p-2 font-mono">admin@costview.ng</td>
                        <td className="p-2 font-mono">DemoPass2026!</td>
                        <td className="p-2">Full system settings &amp; RBAC</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold">Project Manager</td>
                        <td className="p-2 font-mono">pm@costview.ng</td>
                        <td className="p-2 font-mono">DemoPass2026!</td>
                        <td className="p-2">Baseline approval, VO review</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold">Quantity Surveyor</td>
                        <td className="p-2 font-mono">qs@costview.ng</td>
                        <td className="p-2 font-mono">DemoPass2026!</td>
                        <td className="p-2">BOQ upload, interim certifications</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold">Architect</td>
                        <td className="p-2 font-mono">arch@costview.ng</td>
                        <td className="p-2 font-mono">DemoPass2026!</td>
                        <td className="p-2">Site Instructions (SI), design changes</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold">Site Engineer</td>
                        <td className="p-2 font-mono">site@costview.ng</td>
                        <td className="p-2 font-mono">DemoPass2026!</td>
                        <td className="p-2">Daily shift diary &amp; muster attendance</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold">Procurement Officer</td>
                        <td className="p-2 font-mono">procure@costview.ng</td>
                        <td className="p-2 font-mono">DemoPass2026!</td>
                        <td className="p-2">3-Way match &amp; PO issuance</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PDF DOWNLOAD */}
          {activeTab === "pdf" && (
            <div className="space-y-4">
              <div className="bg-mustard-100 border-2 border-navy-800 p-5 shadow-brutal-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs bg-navy-800 text-mustard-400 font-mono font-black px-2 py-0.5 border border-navy-800">
                      OFFICIAL PUBLICATION
                    </span>
                    <span className="text-xs font-bold text-navy-800">5-Page Branded Neo-Brutalism PDF</span>
                  </div>
                  <h3 className="text-base font-black text-navy-800 uppercase tracking-tight">
                    CostView 360 · Comprehensive Enterprise User Manual
                  </h3>
                  <p className="text-xs text-navy-800/80 mt-1 max-w-xl">
                    Download the complete, high-resolution Neo-Brutalist PDF guide covering system architecture, operational SOPs,
                    standard status badges, developer contributing governance, and the field troubleshooting matrix.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                  <a
                    href="/docs/CostView-360-User-Guide.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 bg-white hover:bg-cream-100 text-navy-800 border-2 border-navy-800 shadow-brutal-sm font-black text-xs uppercase flex items-center justify-center gap-1.5 transition-transform active:translate-x-0.5 active:translate-y-0.5"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open in Tab</span>
                  </a>
                  <a
                    href="/docs/CostView-360-User-Guide.pdf"
                    download="CostView-360-User-Guide.pdf"
                    className="px-4 py-2.5 bg-navy-800 hover:bg-navy-900 text-mustard-400 border-2 border-navy-800 shadow-brutal-sm font-black text-xs uppercase flex items-center justify-center gap-1.5 transition-transform active:translate-x-0.5 active:translate-y-0.5"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </a>
                </div>
              </div>

              {/* PDF Contents Breakdown */}
              <div className="bg-white border-2 border-navy-800 p-4 shadow-brutal-sm">
                <h4 className="text-xs font-black text-navy-800 uppercase mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-navy-800" />
                  What is Included Inside the 5-Page Guide
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="border border-navy-800 p-2.5 bg-cream-50">
                    <span className="font-mono font-bold text-navy-800 bg-white border border-navy-800 px-1 py-0.5 text-[10px]">
                      PAGE 1
                    </span>
                    <h5 className="font-bold text-navy-800 mt-1">Cover &amp; Executive Architecture</h5>
                    <p className="text-navy-800/70 text-[11px] mt-0.5">
                      Core mandate, NGN native accounting, eliminating 15-30% site leakage, specifications table.
                    </p>
                  </div>

                  <div className="border border-navy-800 p-2.5 bg-cream-50">
                    <span className="font-mono font-bold text-navy-800 bg-white border border-navy-800 px-1 py-0.5 text-[10px]">
                      PAGE 2
                    </span>
                    <h5 className="font-bold text-navy-800 mt-1">The 10 Functional Modules</h5>
                    <p className="text-navy-800/70 text-[11px] mt-0.5">
                      Full breakdown of all 10 modules: primary actor, what to do, and automated business value.
                    </p>
                  </div>

                  <div className="border border-navy-800 p-2.5 bg-cream-50">
                    <span className="font-mono font-bold text-navy-800 bg-white border border-navy-800 px-1 py-0.5 text-[10px]">
                      PAGE 3
                    </span>
                    <h5 className="font-bold text-navy-800 mt-1">Operational Workflows &amp; SOPs</h5>
                    <p className="text-navy-800/70 text-[11px] mt-0.5">
                      Phase 1 (Day 1 setup) through Phase 5 (handover, defects liability, retention fund release).
                    </p>
                  </div>

                  <div className="border border-navy-800 p-2.5 bg-cream-50">
                    <span className="font-mono font-bold text-navy-800 bg-white border border-navy-800 px-1 py-0.5 text-[10px]">
                      PAGE 4
                    </span>
                    <h5 className="font-bold text-navy-800 mt-1">Contributing Guidelines &amp; AGENTS.md</h5>
                    <p className="text-navy-800/70 text-[11px] mt-0.5">
                      The 5-step pull request protocol, demo accounts table, environment setup, and strict prohibitions.
                    </p>
                  </div>

                  <div className="border border-navy-800 p-2.5 bg-cream-50 md:col-span-2">
                    <span className="font-mono font-bold text-navy-800 bg-white border border-navy-800 px-1 py-0.5 text-[10px]">
                      PAGE 5
                    </span>
                    <h5 className="font-bold text-navy-800 mt-1">Cheat Sheet &amp; Troubleshooting Matrix</h5>
                    <p className="text-navy-800/70 text-[11px] mt-0.5">
                      In-app status badge meanings, field scenario resolution table, and compliance verification sign-off.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-cream-100 border-t-2 border-navy-800 px-5 py-3 flex items-center justify-between shrink-0">
          <div className="text-xs text-navy-800/70 font-mono hidden sm:block">
            CostView 360 · Licensed under Commercial Field Cost Governance Standards
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <a
              href="/docs/CostView-360-User-Guide.pdf"
              download="CostView-360-User-Guide.pdf"
              className="px-3 py-1.5 bg-mustard-400 hover:bg-mustard-500 text-navy-800 border-2 border-navy-800 font-black text-xs uppercase flex items-center gap-1 shadow-brutal-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Get PDF</span>
            </a>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-navy-800 hover:bg-navy-900 text-white border-2 border-navy-800 font-black text-xs uppercase shadow-brutal-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
