"use client";

import React, { useState } from "react";
import {
  X,
  BookOpen,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Download,
  ExternalLink,
  ShieldCheck,
  Layers,
  ArrowRight,
  HardHat,
  Receipt,
  FileSpreadsheet,
  Boxes,
  Workflow,
  Copy,
  Check,
  Building2,
  Scale,
  Users,
  Clock,
  Coins
} from "lucide-react";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "workflows" | "dataflow" | "pdf">("overview");
  const [activeFlow, setActiveFlow] = useState<"lifecycle" | "threeway" | "retention" | "variations">("lifecycle");
  const [copiedDiagram, setCopiedDiagram] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDiagram(id);
    setTimeout(() => setCopiedDiagram(null), 2500);
  };

  const mermaidLifecycle = `flowchart TD
    subgraph FIELD["Tier 1: Field Site Operations & Store"]
        D1["Daily Site Diary\\nWeather & Delays"] --> M1["Labour Muster Roll\\nArtisan Attendance"]
        M1 --> G1["Material Deliveries\\nGoods Received Note (GRN)"]
        G1 --> I1["Element Inspections\\nQA/QC Checks"]
        I1 -->|Failed Check| S1["Auto-Generated\\nDefect Snag"]
    end

    subgraph COMMERCIAL["Tier 2: Commercial & Procurement Engine"]
        B1["BOQ Master Baseline\\nCost Codes & Unit Rates"] --> P1["Purchase Orders (PO)\\nSupplier Contract Rates"]
        G1 -.->|Physical Quantities| T1["3-Way Match Engine\\nPO vs GRN vs Invoice"]
        P1 --> T1
        V1["Vendor Invoices"] --> T1
        T1 -->|Zero Variance| C1["Payment Certification"]
        T1 -->|Discrepancy| D2["Discrepancy Dispute\\nHalt Payment"]
        W1["Subcontractor Claim"] --> R1["QS Valuation & Measurement\\nAuto 10% Retention Deduction"]
        R1 --> C1
    end

    subgraph EXECUTIVE["Tier 3: Executive Financial Command Center"]
        C1 --> E1["Committed vs Actual Cost Ledger"]
        E1 --> K1["Live Financial KPIs\\nCPI, SPI, Contingency Burn"]
        SI["Site Instruction (SI)"] --> VO["4-Stage Variation Order"]
        VO -->|Client Approved| B1
        K1 --> REP["Executive PDF Reports\\nBank Valuation Sheets"]
    end

    style FIELD fill:#FFFDF0,stroke:#0A1931,stroke-width:2px
    style COMMERCIAL fill:#FFFDF0,stroke:#0A1931,stroke-width:2px
    style EXECUTIVE fill:#FFFDF0,stroke:#0A1931,stroke-width:2px
    style T1 fill:#FFD23F,stroke:#0A1931,stroke-width:2px
    style R1 fill:#2563EB,color:#fff,stroke:#0A1931,stroke-width:2px
    style K1 fill:#10B981,color:#fff,stroke:#0A1931,stroke-width:2px
    style D2 fill:#DC2626,color:#fff,stroke:#0A1931,stroke-width:2px`;

  const mermaidThreeWay = `flowchart TD
    A["Purchase Order (PO)\\nAgreed Contract Rate & Qty"] --> D{"3-Way Match\\nReconciliation Engine"}
    B["Goods Received Note (GRN)\\nPhysical On-Site Store Count"] --> D
    C["Vendor Invoice\\nBilled Qty & Unit Price"] --> D

    D -->|Price & Qty Match 100%| E["✔ Green: Match Approved"]
    D -->|Price > PO Rate OR Qty > GRN| F["✖ Red: Discrepancy Halt"]

    E --> G["Commercial Sign-off\\nPayment Disbursed to Supplier"]
    F --> H["Payment Locked\\nCredit Note Requested from Vendor"]

    style D fill:#FFD23F,stroke:#0A1931,stroke-width:2px
    style E fill:#10B981,color:#fff,stroke:#0A1931,stroke-width:2px
    style F fill:#DC2626,color:#fff,stroke:#0A1931,stroke-width:2px
    style G fill:#0A1931,color:#fff,stroke:#0A1931,stroke-width:2px
    style H fill:#D97706,color:#fff,stroke:#0A1931,stroke-width:2px`;

  const mermaidRetention = `flowchart LR
    A["1. Monthly Claim\\nSubcontractor submits milestone sum"] --> B["2. Physical Valuation\\nQS verifies work done on site"]
    B --> C["3. 10% Withholding\\nSystem isolates 10% in Escrow"]
    C --> D["4. Net 90% Certificate\\nCertified for payment to bank"]
    D --> E["5. Practical Handover\\n5% released on initial sign-off"]
    E --> F["6. Defects Clearance\\nFinal 5% released after 6 months"]

    style A fill:#FFFDF0,stroke:#0A1931,stroke-width:2px
    style B fill:#2563EB,color:#fff,stroke:#0A1931,stroke-width:2px
    style C fill:#9333EA,color:#fff,stroke:#0A1931,stroke-width:2px
    style D fill:#FFD23F,stroke:#0A1931,stroke-width:2px
    style E fill:#10B981,color:#fff,stroke:#0A1931,stroke-width:2px
    style F fill:#0A1931,color:#fff,stroke:#0A1931,stroke-width:2px`;

  const mermaidVariations = `flowchart TD
    S1["Stage 1: Site Instruction (SI)\\nArchitect / Consultant issues change notice"] --> S2["Stage 2: QS Valuation\\nQS calculates cost delta (₦) & time impact (days)"]
    S2 --> S3["Stage 3: PM Review\\nProject Manager reviews against contingency fund"]
    S3 --> S4["Stage 4: Client Approval\\nFormal sign-off by Employer / Client"]
    S4 --> S5["Automated Baseline Uplift\\nMaster BOQ updated; funds committed"]

    style S1 fill:#FFFDF0,stroke:#0A1931,stroke-width:2px
    style S2 fill:#2563EB,color:#fff,stroke:#0A1931,stroke-width:2px
    style S3 fill:#FFD23F,stroke:#0A1931,stroke-width:2px
    style S4 fill:#9333EA,color:#fff,stroke:#0A1931,stroke-width:2px
    style S5 fill:#10B981,color:#fff,stroke:#0A1931,stroke-width:2px`;

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
                  CostView 360 · User Guide & Operations Manual
                </h2>
                <span className="text-xs bg-mustard-400 text-navy-800 px-2 py-0.5 border border-navy-800 font-mono font-bold hidden sm:inline-block">
                  v2.0 Manual
                </span>
              </div>
              <p className="text-xs text-cream-200">
                End-user handbook, visual data flows, operational workflows & field cost governance
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
            1. Core Capabilities & Tenets
          </button>
          <button
            onClick={() => setActiveTab("workflows")}
            className={`px-3 py-1.5 text-xs font-black uppercase tracking-wide border-2 border-navy-800 transition-all ${
              activeTab === "workflows"
                ? "bg-navy-800 text-white shadow-brutal-sm"
                : "bg-white text-navy-800 hover:bg-cream-200"
            }`}
          >
            2. Step-by-Step User Guide
          </button>
          <button
            onClick={() => setActiveTab("dataflow")}
            className={`px-3 py-1.5 text-xs font-black uppercase tracking-wide border-2 border-navy-800 transition-all flex items-center gap-1.5 ${
              activeTab === "dataflow"
                ? "bg-navy-800 text-white shadow-brutal-sm"
                : "bg-white text-navy-800 hover:bg-cream-200"
            }`}
          >
            <Workflow className="w-3.5 h-3.5" />
            <span>3. Visual Process & Data Flows</span>
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
            <span>4. Branded PDF Manual</span>
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
                  Why CostView 360 Exists: Eliminating Commercial Construction Cost Leakage
                </h3>
                <p className="text-xs text-navy-800/80 mt-1 leading-relaxed">
                  Commercial building projects in Nigeria routinely suffer from 15% to 30% unbudgeted cost inflation,
                  uncontrolled contractor variation claims, material diversion from site storage, and unverified contractor invoices.
                  CostView 360 bridges the critical operational chasm between physical site operations and commercial finance controllers.
                  By enforcing real-time Bill of Quantities (BOQ) baselines, mandatory 3-way invoice matching, statutory 10% retention
                  withholding, and shift attendance logs, CostView 360 ensures every kobo spent is verified against physical site reality.
                </p>
              </div>

              {/* The 4 Core Operational Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white border-2 border-navy-800 p-3 shadow-brutal-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-6 h-6 bg-navy-800 text-mustard-400 font-mono font-bold text-xs flex items-center justify-center border border-navy-800">
                      ₦
                    </span>
                    <h4 className="text-xs font-black uppercase text-navy-800">1. NGN-Native Valuation</h4>
                  </div>
                  <p className="text-xs text-navy-800/80">
                    Purpose-built for Nigerian construction finance. All rates, certified sums, and retention funds are natively
                    managed in Naira (₦) with instant dynamic conversions to USD ($), GBP (£), and EUR (€) for imported MEP plant.
                  </p>
                </div>

                <div className="bg-white border-2 border-navy-800 p-3 shadow-brutal-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Receipt className="w-5 h-5 text-blue-700" />
                    <h4 className="text-xs font-black uppercase text-navy-800">2. Automated 3-Way Match</h4>
                  </div>
                  <p className="text-xs text-navy-800/80">
                    Strict cross-verification matching the approved Purchase Order (PO) against physical Goods Received Notes (GRN) from site
                    and the vendor's submitted Invoice. System automatically halts payment on price or quantity discrepancies.
                  </p>
                </div>

                <div className="bg-white border-2 border-navy-800 p-3 shadow-brutal-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Scale className="w-5 h-5 text-purple-700" />
                    <h4 className="text-xs font-black uppercase text-navy-800">3. 10% Statutory Retention</h4>
                  </div>
                  <p className="text-xs text-navy-800/80">
                    Standard Nigerian building contract clause (JCT/FIDIC) enforced automatically. 10% is withheld from every
                    subcontractor interim certificate, maintaining a secure defect guarantee fund until Practical Completion sign-off.
                  </p>
                </div>

                <div className="bg-white border-2 border-navy-800 p-3 shadow-brutal-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-5 h-5 text-emerald-700" />
                    <h4 className="text-xs font-black uppercase text-navy-800">4. Dual-Signoff Governance</h4>
                  </div>
                  <p className="text-xs text-navy-800/80">
                    Separation of duties protects project funds. Site supervisors record physical facts (deliveries, attendance, snags),
                    while Quantity Surveyors and Project Managers certify valuations and approve change orders before finance releases disbursements.
                  </p>
                </div>
              </div>

              {/* Roles & Key Responsibilities Matrix */}
              <div className="bg-white border-2 border-navy-800 p-4 shadow-brutal-sm">
                <h4 className="text-xs font-black uppercase text-navy-800 mb-2">User Roles & Operational Responsibilities</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-navy-800">
                    <thead className="bg-navy-800 text-white font-mono">
                      <tr>
                        <th className="p-2 border border-navy-800">Role</th>
                        <th className="p-2 border border-navy-800">Key Daily & Monthly Tasks</th>
                        <th className="p-2 border border-navy-800">Primary Module</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-navy-800 text-navy-800">
                      <tr>
                        <td className="p-2 font-bold">Project Director / PM</td>
                        <td className="p-2">Review budget health, approve Variation Orders, track CPI/SPI indicators</td>
                        <td className="p-2 font-mono text-[11px]">Commercial Command Center</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold">Quantity Surveyor (QS)</td>
                        <td className="p-2">Import BOQ, lock baselines, certify interim claims, apply 10% retention</td>
                        <td className="p-2 font-mono text-[11px]">BOQ &amp; Subcontractors</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold">Procurement Officer</td>
                        <td className="p-2">Solicit supplier quotes, issue formal POs, reconcile 3-Way Match variances</td>
                        <td className="p-2 font-mono text-[11px]">Procurement</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold">Site Engineer / Agent</td>
                        <td className="p-2">Log daily shift diary, record weather delays, conduct element inspections</td>
                        <td className="p-2 font-mono text-[11px]">Site Operations</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold">Storekeeper</td>
                        <td className="p-2">Inspect arriving deliveries, issue Goods Received Notes (GRNs), track rebar/cement stock</td>
                        <td className="p-2 font-mono text-[11px]">Materials &amp; Stock</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold">Financial Controller</td>
                        <td className="p-2">Release 3-way matched payments, audit retention fund escrow, generate reports</td>
                        <td className="p-2 font-mono text-[11px]">Reports Studio</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STEP-BY-STEP USER GUIDE */}
          {activeTab === "workflows" && (
            <div className="space-y-4">
              <div className="bg-mustard-100 border-2 border-navy-800 p-4 shadow-brutal-sm">
                <h3 className="text-sm font-black text-navy-800 uppercase tracking-wide">
                  Standard Operating Procedures: Step-by-Step User Instructions
                </h3>
                <p className="text-xs text-navy-800/80 mt-1">
                  Follow these proven operational procedures to maintain complete cost, quality, and material governance across every project phase.
                </p>
              </div>

              {/* Step 1 */}
              <div className="bg-white border-2 border-navy-800 p-4 shadow-brutal-sm space-y-2">
                <div className="flex items-center gap-2">
                  <span className="bg-navy-800 text-mustard-400 font-mono font-bold px-2 py-0.5 text-xs">PHASE 1</span>
                  <h4 className="text-xs font-black uppercase text-navy-800">Project Setup & BOQ Baseline Budget Locking</h4>
                </div>
                <ol className="text-xs text-navy-800/80 space-y-1.5 list-decimal list-inside">
                  <li>Log in with your Quantity Surveyor (QS) or Commercial Manager account.</li>
                  <li>Open <strong>BOQ &amp; Budget</strong> from the sidebar navigation.</li>
                  <li>Click <strong>Import Excel / CSV BOQ</strong> and select your client-approved Bill of Quantities spreadsheet.</li>
                  <li>Verify cost code mapping across major sections (Substructure, Concrete Frame, Finishes, MEP).</li>
                  <li>Set the project contingency reserve percentage (standard 5.0% recommended for price escalation buffer).</li>
                  <li>Review bill rates in Naira (₦) and click <strong>Lock Baseline</strong> to freeze the contract baseline.</li>
                </ol>
              </div>

              {/* Step 2 */}
              <div className="bg-white border-2 border-navy-800 p-4 shadow-brutal-sm space-y-2">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-700 text-white font-mono font-bold px-2 py-0.5 text-xs">PHASE 2</span>
                  <h4 className="text-xs font-black uppercase text-navy-800">Daily Site Operations, Attendance & Inspections</h4>
                </div>
                <ol className="text-xs text-navy-800/80 space-y-1.5 list-decimal list-inside">
                  <li><strong>07:30 AM — Morning Muster:</strong> Open <strong>Labour Muster</strong> and mark attendance for direct and subcontractor artisans (masons, carpenters, steel fixers). Record authorized night overtime hours.</li>
                  <li><strong>09:30 AM — Site Diary Log:</strong> Open <strong>Site Diary</strong>. Check auto-recorded weather and log planned shift activities and workforce count.</li>
                  <li><strong>12:00 PM — Material Deliveries:</strong> When supplier trucks arrive, storekeeper counts items and clicks <strong>Log Goods Received Note (GRN)</strong> in <strong>Materials &amp; Stock</strong>.</li>
                  <li><strong>03:30 PM — Element QA/QC Checks:</strong> Resident Engineer opens <strong>Site Diary &gt; Inspections</strong> and conducts checklist. If a check fails, the system automatically logs a defect Snag assigned to the trade.</li>
                  <li><strong>05:30 PM — Shift Sign-off:</strong> Attach milestone progress photos, record any weather delay hours (vital for Extension of Time claims), and submit shift record.</li>
                </ol>
              </div>

              {/* Step 3 */}
              <div className="bg-white border-2 border-navy-800 p-4 shadow-brutal-sm space-y-2">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-700 text-white font-mono font-bold px-2 py-0.5 text-xs">PHASE 3</span>
                  <h4 className="text-xs font-black uppercase text-navy-800">Procurement & 3-Way Invoice Matching (Zero Overpayment)</h4>
                </div>
                <ol className="text-xs text-navy-800/80 space-y-1.5 list-decimal list-inside">
                  <li>Site supervisor raises purchase requisition referencing the exact BOQ line item.</li>
                  <li>Procurement collects 3 supplier quotes and issues a formal <strong>Purchase Order (PO)</strong> with binding unit rates.</li>
                  <li>Upon delivery, storekeeper issues a <strong>Goods Received Note (GRN)</strong> with the physical count.</li>
                  <li>When vendor invoice arrives, open <strong>Procurement &gt; Three-Way Match</strong>. The system automatically reconciles PO unit rates vs physical GRN count vs Vendor Invoice sum.</li>
                  <li>If matched 100%, finance clicks <strong>Approve for Payment</strong>. If price or quantity differs, system locks invoice with a <strong>Discrepancy Halt</strong> until vendor issues a credit note.</li>
                </ol>
              </div>

              {/* Step 4 */}
              <div className="bg-white border-2 border-navy-800 p-4 shadow-brutal-sm space-y-2">
                <div className="flex items-center gap-2">
                  <span className="bg-purple-700 text-white font-mono font-bold px-2 py-0.5 text-xs">PHASE 4</span>
                  <h4 className="text-xs font-black uppercase text-navy-800">Subcontractor Valuations & 10% Statutory Retention</h4>
                </div>
                <ol className="text-xs text-navy-800/80 space-y-1.5 list-decimal list-inside">
                  <li>Trade contractor submits monthly Interim Payment Claim for completed milestone work.</li>
                  <li>Quantity Surveyor visits site, verifies physical measurements against drawings, and opens <strong>Subcontractor Packages</strong>.</li>
                  <li>Enter certified progress sum and click <strong>Certify &amp; Apply 10%</strong>. The system automatically isolates 10% into the retention escrow ledger and certifies the 90% net sum for disbursement.</li>
                  <li>Submit contractor 4-factor performance evaluation (Schedule, Quality, Safety, Cooperation).</li>
                  <li>At Practical Completion, 5% is released upon snag list clearance; remaining 5% is released after the 6-month Defects Liability Period.</li>
                </ol>
              </div>

              {/* Step 5 */}
              <div className="bg-white border-2 border-navy-800 p-4 shadow-brutal-sm space-y-2">
                <div className="flex items-center gap-2">
                  <span className="bg-amber-600 text-white font-mono font-bold px-2 py-0.5 text-xs">PHASE 5</span>
                  <h4 className="text-xs font-black uppercase text-navy-800">Site Instructions & 4-Stage Variation Orders</h4>
                </div>
                <ol className="text-xs text-navy-800/80 space-y-1.5 list-decimal list-inside">
                  <li>Architect or Consultant logs formal instruction under <strong>Site Operations &gt; 7.1 Site Instructions</strong>.</li>
                  <li>Quantity Surveyor links the SI to <strong>7.2 Variation Orders</strong>, estimating cost delta (₦) and time impact (days).</li>
                  <li>Variation Order advances through 4 stages: <strong>Draft &rarr; QS Valuation &rarr; PM Review &rarr; Approved</strong>.</li>
                  <li>Upon formal Client approval, the system automatically commits funds and adjusts the master budget baseline.</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 3: VISUAL DATA FLOW & PROCESS MAPS */}
          {activeTab === "dataflow" && (
            <div className="space-y-4">
              <div className="bg-white border-2 border-navy-800 p-4 shadow-brutal-sm">
                <h3 className="text-sm font-black text-navy-800 uppercase tracking-wide flex items-center gap-2">
                  <Workflow className="w-4 h-4 text-mustard-500" />
                  Visual Data Flow Architecture & Process Maps
                </h3>
                <p className="text-xs text-navy-800/80 mt-1">
                  Visualize how information travels across CostView 360 between field site teams, commercial surveyors, and executive controllers.
                </p>
              </div>

              {/* Process Map Switcher */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveFlow("lifecycle")}
                  className={`px-3 py-1.5 text-xs font-bold uppercase border-2 border-navy-800 transition-all ${
                    activeFlow === "lifecycle"
                      ? "bg-navy-800 text-mustard-400 shadow-brutal-sm"
                      : "bg-white text-navy-800 hover:bg-cream-100"
                  }`}
                >
                  1. End-to-End System Lifecycle
                </button>
                <button
                  onClick={() => setActiveFlow("threeway")}
                  className={`px-3 py-1.5 text-xs font-bold uppercase border-2 border-navy-800 transition-all ${
                    activeFlow === "threeway"
                      ? "bg-navy-800 text-mustard-400 shadow-brutal-sm"
                      : "bg-white text-navy-800 hover:bg-cream-100"
                  }`}
                >
                  2. 3-Way Invoice Match Gate
                </button>
                <button
                  onClick={() => setActiveFlow("retention")}
                  className={`px-3 py-1.5 text-xs font-bold uppercase border-2 border-navy-800 transition-all ${
                    activeFlow === "retention"
                      ? "bg-navy-800 text-mustard-400 shadow-brutal-sm"
                      : "bg-white text-navy-800 hover:bg-cream-100"
                  }`}
                >
                  3. 10% Retention Escrow Flow
                </button>
                <button
                  onClick={() => setActiveFlow("variations")}
                  className={`px-3 py-1.5 text-xs font-bold uppercase border-2 border-navy-800 transition-all ${
                    activeFlow === "variations"
                      ? "bg-navy-800 text-mustard-400 shadow-brutal-sm"
                      : "bg-white text-navy-800 hover:bg-cream-100"
                  }`}
                >
                  4. 4-Stage Variation Orders
                </button>
              </div>

              {/* FLOW 1: SYSTEM LIFECYCLE */}
              {activeFlow === "lifecycle" && (
                <div className="space-y-3">
                  <div className="bg-cream-100 border-2 border-navy-800 p-4 shadow-brutal-sm space-y-3">
                    <div className="flex items-center justify-between border-b border-navy-800 pb-2">
                      <span className="font-black text-xs uppercase text-navy-800 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-blue-700" />
                        Three-Tier Enterprise Data Flow Architecture
                      </span>
                      <button
                        onClick={() => copyToClipboard(mermaidLifecycle, "lifecycle")}
                        className="px-2 py-1 bg-white hover:bg-cream-200 text-navy-800 border border-navy-800 text-[11px] font-mono font-bold flex items-center gap-1 shadow-brutal-xs"
                      >
                        {copiedDiagram === "lifecycle" ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Copied Mermaid!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Mermaid Code</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Visual 3-Tier Layout */}
                    <div className="space-y-2">
                      {/* Tier 1 */}
                      <div className="bg-white border-2 border-navy-800 p-3 shadow-brutal-xs">
                        <div className="text-[11px] font-black uppercase text-mustard-700 mb-1">
                          Tier 1: Field Site Operations &amp; Site Store
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                          <div className="bg-cream-50 border border-navy-800 p-2">
                            <span className="font-bold block">1. Daily Site Diary &amp; Muster</span>
                            <span className="text-[11px] text-navy-800/70">Weather, delays, artisan counts, overtime hours</span>
                          </div>
                          <div className="bg-cream-50 border border-navy-800 p-2">
                            <span className="font-bold block">2. Deliveries &amp; GRN</span>
                            <span className="text-[11px] text-navy-800/70">Storekeeper physical count, warehouse stock gauges</span>
                          </div>
                          <div className="bg-cream-50 border border-navy-800 p-2">
                            <span className="font-bold block">3. Element QA/QC</span>
                            <span className="text-[11px] text-navy-800/70">Structural signoffs; failed checks auto-create snags</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-center">
                        <div className="bg-navy-800 text-mustard-400 font-mono font-bold text-[10px] px-3 py-0.5 border border-navy-800 flex items-center gap-1">
                          <span>Physical Delivery Counts &amp; Site Verifications</span>
                          <ArrowRight className="w-3 h-3 rotate-90" />
                        </div>
                      </div>

                      {/* Tier 2 */}
                      <div className="bg-white border-2 border-navy-800 p-3 shadow-brutal-xs">
                        <div className="text-[11px] font-black uppercase text-blue-700 mb-1">
                          Tier 2: Commercial &amp; Procurement Engine
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                          <div className="bg-cream-50 border border-navy-800 p-2">
                            <span className="font-bold block">4. BOQ Baseline Budget</span>
                            <span className="text-[11px] text-navy-800/70">Master quantities, unit rates, contingency reserve</span>
                          </div>
                          <div className="bg-cream-50 border border-navy-800 p-2">
                            <span className="font-bold block">5. 3-Way Match Gate</span>
                            <span className="text-[11px] text-navy-800/70">PO vs GRN vs Invoice; zero price or quantity delta</span>
                          </div>
                          <div className="bg-cream-50 border border-navy-800 p-2">
                            <span className="font-bold block">6. Subcontractor Ledger</span>
                            <span className="text-[11px] text-navy-800/70">Milestone claims, auto 10% retention withholding</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-center">
                        <div className="bg-navy-800 text-mustard-400 font-mono font-bold text-[10px] px-3 py-0.5 border border-navy-800 flex items-center gap-1">
                          <span>Certified Valuations &amp; Approved Disbursements</span>
                          <ArrowRight className="w-3 h-3 rotate-90" />
                        </div>
                      </div>

                      {/* Tier 3 */}
                      <div className="bg-white border-2 border-navy-800 p-3 shadow-brutal-xs">
                        <div className="text-[11px] font-black uppercase text-emerald-700 mb-1">
                          Tier 3: Executive Financial Command Center
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                          <div className="bg-cream-50 border border-navy-800 p-2">
                            <span className="font-bold block">7. Cost-to-Complete KPIs</span>
                            <span className="text-[11px] text-navy-800/70">Real-time CPI, SPI, budget health status badge</span>
                          </div>
                          <div className="bg-cream-50 border border-navy-800 p-2">
                            <span className="font-bold block">8. 4-Stage Variations</span>
                            <span className="text-[11px] text-navy-800/70">SI logged &rarr; QS costed &rarr; PM approved &rarr; baseline uplift</span>
                          </div>
                          <div className="bg-cream-50 border border-navy-800 p-2">
                            <span className="font-bold block">9. Executive PDF Reports</span>
                            <span className="text-[11px] text-navy-800/70">Boardroom exports, bank valuation, immutable audit</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* FLOW 2: 3-WAY MATCH */}
              {activeFlow === "threeway" && (
                <div className="space-y-3">
                  <div className="bg-cream-100 border-2 border-navy-800 p-4 shadow-brutal-sm space-y-3">
                    <div className="flex items-center justify-between border-b border-navy-800 pb-2">
                      <span className="font-black text-xs uppercase text-navy-800 flex items-center gap-2">
                        <Receipt className="w-4 h-4 text-blue-700" />
                        Automated 3-Way Match Decision Process
                      </span>
                      <button
                        onClick={() => copyToClipboard(mermaidThreeWay, "threeway")}
                        className="px-2 py-1 bg-white hover:bg-cream-200 text-navy-800 border border-navy-800 text-[11px] font-mono font-bold flex items-center gap-1 shadow-brutal-xs"
                      >
                        {copiedDiagram === "threeway" ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Copied Mermaid!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Mermaid Code</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div className="bg-white border border-navy-800 p-2.5">
                        <span className="text-xs font-bold text-navy-800 block">Doc 1: Purchase Order</span>
                        <p className="text-[11px] text-navy-800/70 mt-0.5">Agreed commercial contract rate &amp; ordered quantity.</p>
                      </div>
                      <div className="bg-white border border-navy-800 p-2.5">
                        <span className="text-xs font-bold text-navy-800 block">Doc 2: Site GRN</span>
                        <p className="text-[11px] text-navy-800/70 mt-0.5">Physical count verified by site storekeeper upon delivery.</p>
                      </div>
                      <div className="bg-white border border-navy-800 p-2.5">
                        <span className="text-xs font-bold text-navy-800 block">Doc 3: Vendor Invoice</span>
                        <p className="text-[11px] text-navy-800/70 mt-0.5">Billed unit price and claimed quantity from supplier.</p>
                      </div>
                    </div>

                    <div className="bg-mustard-200 border-2 border-navy-800 p-3 text-center">
                      <span className="font-mono font-black text-xs uppercase text-navy-800">
                        ⚡ Reconciled Automatically by CostView 360 Matching Engine
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-white border-2 border-emerald-600 p-3 shadow-brutal-xs">
                        <span className="font-bold text-xs text-emerald-700 flex items-center gap-1.5 mb-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Perfect Match (0% Delta)
                        </span>
                        <p className="text-[11px] text-navy-800/80">
                          Unit price and quantity agree 100%. Finance signs off, invoice is approved, and disbursement is cleared.
                        </p>
                      </div>
                      <div className="bg-white border-2 border-red-600 p-3 shadow-brutal-xs">
                        <span className="font-bold text-xs text-red-700 flex items-center gap-1.5 mb-1">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          Discrepancy Detected (Rate / Qty)
                        </span>
                        <p className="text-[11px] text-navy-800/80">
                          System immediately halts disbursement. Discrepancy notice issued to supplier to provide an amended credit note.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* FLOW 3: RETENTION */}
              {activeFlow === "retention" && (
                <div className="space-y-3">
                  <div className="bg-cream-100 border-2 border-navy-800 p-4 shadow-brutal-sm space-y-3">
                    <div className="flex items-center justify-between border-b border-navy-800 pb-2">
                      <span className="font-black text-xs uppercase text-navy-800 flex items-center gap-2">
                        <Scale className="w-4 h-4 text-purple-700" />
                        10% Statutory Retention Lifecycle Flow
                      </span>
                      <button
                        onClick={() => copyToClipboard(mermaidRetention, "retention")}
                        className="px-2 py-1 bg-white hover:bg-cream-200 text-navy-800 border border-navy-800 text-[11px] font-mono font-bold flex items-center gap-1 shadow-brutal-xs"
                      >
                        {copiedDiagram === "retention" ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Copied Mermaid!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Mermaid Code</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                      <div className="bg-white border border-navy-800 p-2.5">
                        <span className="bg-navy-800 text-white font-mono px-1.5 py-0.5 text-[10px] font-bold block w-fit mb-1">STAGE 1</span>
                        <span className="font-bold block">Interim Claim</span>
                        <p className="text-[11px] text-navy-800/70 mt-0.5">Contractor submits monthly payment valuation.</p>
                      </div>
                      <div className="bg-white border border-navy-800 p-2.5">
                        <span className="bg-blue-700 text-white font-mono px-1.5 py-0.5 text-[10px] font-bold block w-fit mb-1">STAGE 2</span>
                        <span className="font-bold block">QS Valuation</span>
                        <p className="text-[11px] text-navy-800/70 mt-0.5">QS validates physical work on site.</p>
                      </div>
                      <div className="bg-white border border-navy-800 p-2.5">
                        <span className="bg-purple-700 text-white font-mono px-1.5 py-0.5 text-[10px] font-bold block w-fit mb-1">STAGE 3</span>
                        <span className="font-bold block">10% Retention</span>
                        <p className="text-[11px] text-navy-800/70 mt-0.5">System isolates 10% in escrow; 90% net paid.</p>
                      </div>
                      <div className="bg-white border border-navy-800 p-2.5">
                        <span className="bg-emerald-700 text-white font-mono px-1.5 py-0.5 text-[10px] font-bold block w-fit mb-1">STAGE 4</span>
                        <span className="font-bold block">Handover Release</span>
                        <p className="text-[11px] text-navy-800/70 mt-0.5">5% released on handover; 5% after 6-month defect period.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* FLOW 4: VARIATIONS */}
              {activeFlow === "variations" && (
                <div className="space-y-3">
                  <div className="bg-cream-100 border-2 border-navy-800 p-4 shadow-brutal-sm space-y-3">
                    <div className="flex items-center justify-between border-b border-navy-800 pb-2">
                      <span className="font-black text-xs uppercase text-navy-800 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-purple-700" />
                        4-Stage Variation Order Approval Chain
                      </span>
                      <button
                        onClick={() => copyToClipboard(mermaidVariations, "variations")}
                        className="px-2 py-1 bg-white hover:bg-cream-200 text-navy-800 border border-navy-800 text-[11px] font-mono font-bold flex items-center gap-1 shadow-brutal-xs"
                      >
                        {copiedDiagram === "variations" ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Copied Mermaid!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Mermaid Code</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-start gap-3 bg-white border border-navy-800 p-2.5">
                        <span className="w-6 h-6 bg-navy-800 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">1</span>
                        <div>
                          <span className="font-bold block text-navy-800">Site Instruction (SI) Issued</span>
                          <span className="text-[11px] text-navy-800/70">Architect or Resident Engineer registers formal instruction in module 7.1 with sketches.</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 bg-white border border-navy-800 p-2.5">
                        <span className="w-6 h-6 bg-blue-700 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">2</span>
                        <div>
                          <span className="font-bold block text-navy-800">QS Cost &amp; Time Valuation</span>
                          <span className="text-[11px] text-navy-800/70">Quantity Surveyor attaches contract unit rates, material quantities, and schedule delay estimate.</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 bg-white border border-navy-800 p-2.5">
                        <span className="w-6 h-6 bg-amber-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">3</span>
                        <div>
                          <span className="font-bold block text-navy-800">Project Manager Review</span>
                          <span className="text-[11px] text-navy-800/70">PM evaluates impact against contingency reserve and project handover schedule.</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 bg-white border border-navy-800 p-2.5">
                        <span className="w-6 h-6 bg-emerald-700 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">4</span>
                        <div>
                          <span className="font-bold block text-navy-800">Client Approval &amp; Baseline Uplift</span>
                          <span className="text-[11px] text-navy-800/70">Client signs off; master budget baseline automatically uplifts and extra work is committed.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PDF MANUAL DOWNLOAD */}
          {activeTab === "pdf" && (
            <div className="space-y-4">
              <div className="bg-mustard-100 border-2 border-navy-800 p-5 shadow-brutal-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs bg-navy-800 text-mustard-400 font-mono font-black px-2 py-0.5 border border-navy-800">
                      OFFICIAL PUBLICATION
                    </span>
                    <span className="text-xs font-bold text-navy-800">5-Page Branded Neo-Brutalist PDF</span>
                  </div>
                  <h3 className="text-base font-black text-navy-800 uppercase tracking-tight">
                    CostView 360 · Comprehensive Enterprise User Manual
                  </h3>
                  <p className="text-xs text-navy-800/80 mt-1 max-w-xl">
                    Download the complete, high-resolution Neo-Brutalist PDF guide covering system purpose, the 10 functional modules,
                    step-by-step field routines, visual data flow maps, standard status badges, and field troubleshooting.
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5">
                <div className="bg-white border-2 border-navy-800 p-3 shadow-brutal-xs">
                  <div className="text-[10px] font-mono font-bold bg-navy-800 text-mustard-400 px-1.5 py-0.5 w-fit mb-1">
                    PAGE 1
                  </div>
                  <h5 className="text-xs font-black uppercase text-navy-800">Cover &amp; Data Flow</h5>
                  <p className="text-[11px] text-navy-800/70 mt-1">
                    Executive mandate, 4 operational pillars, and visual 3-tier system data flow map.
                  </p>
                </div>

                <div className="bg-white border-2 border-navy-800 p-3 shadow-brutal-xs">
                  <div className="text-[10px] font-mono font-bold bg-navy-800 text-mustard-400 px-1.5 py-0.5 w-fit mb-1">
                    PAGE 2
                  </div>
                  <h5 className="text-xs font-black uppercase text-navy-800">The 10 Subsystems</h5>
                  <p className="text-[11px] text-navy-800/70 mt-1">
                    Detailed breakdown of all 10 core modules: screens, primary actors, and what to do.
                  </p>
                </div>

                <div className="bg-white border-2 border-navy-800 p-3 shadow-brutal-xs">
                  <div className="text-[10px] font-mono font-bold bg-navy-800 text-mustard-400 px-1.5 py-0.5 w-fit mb-1">
                    PAGE 3
                  </div>
                  <h5 className="text-xs font-black uppercase text-navy-800">Setup &amp; Field Routines</h5>
                  <p className="text-[11px] text-navy-800/70 mt-1">
                    BOQ baseline setup, daily 07:30 muster, shift logs, and visual QA snag workflow.
                  </p>
                </div>

                <div className="bg-white border-2 border-navy-800 p-3 shadow-brutal-xs">
                  <div className="text-[10px] font-mono font-bold bg-navy-800 text-mustard-400 px-1.5 py-0.5 w-fit mb-1">
                    PAGE 4
                  </div>
                  <h5 className="text-xs font-black uppercase text-navy-800">3-Way Match &amp; Retention</h5>
                  <p className="text-[11px] text-navy-800/70 mt-1">
                    Visual matching gate, variance halts, and 10% statutory retention escrow cycle.
                  </p>
                </div>

                <div className="bg-white border-2 border-navy-800 p-3 shadow-brutal-xs">
                  <div className="text-[10px] font-mono font-bold bg-navy-800 text-mustard-400 px-1.5 py-0.5 w-fit mb-1">
                    PAGE 5
                  </div>
                  <h5 className="text-xs font-black uppercase text-navy-800">Variations &amp; Troubleshoot</h5>
                  <p className="text-[11px] text-navy-800/70 mt-1">
                    4-stage VO pipeline, standard status badge dictionary, and field resolution matrix.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="bg-cream-100 border-t-2 border-navy-800 px-5 py-3 flex items-center justify-between shrink-0">
          <span className="text-xs text-navy-800 font-bold hidden sm:inline-block">
            CostView 360 · Enterprise Commercial Construction Intelligence
          </span>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <a
              href="/docs/CostView-360-User-Guide.pdf"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-white text-navy-800 border-2 border-navy-800 shadow-brutal-xs font-bold text-xs uppercase hover:bg-cream-200 transition-colors flex items-center gap-1"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>PDF Guide</span>
            </a>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-navy-800 text-white border-2 border-navy-800 shadow-brutal-xs font-bold text-xs uppercase hover:bg-navy-900 transition-colors"
            >
              Got It
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
