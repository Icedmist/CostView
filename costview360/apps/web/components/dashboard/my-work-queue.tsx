"use client";

import React, { useState } from "react";
import { useApp } from "@/app/providers";
import type { RoleName } from "@/lib/supabase/database.types";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Calculator,
  ShoppingCart,
  HardHat,
  Briefcase,
  ShieldCheck,
  FileCheck2,
  Receipt,
  Boxes,
  TrendingDown,
  Sparkles,
  Filter,
} from "lucide-react";

interface ActionTask {
  id: string;
  role: RoleName;
  priority: "Critical" | "High" | "Medium";
  flow: "Cost Plan" | "Buy & Supply" | "Site" | "Contracts" | "Oversight";
  subSection: string;
  title: string;
  code: string;
  description: string;
  value?: string;
  actionText: string;
}

const ACTION_TASKS: ActionTask[] = [
  // --- QUANTITY SURVEYOR ---
  {
    id: "qs-1",
    role: "Quantity Surveyor",
    priority: "Critical",
    flow: "Cost Plan",
    subSection: "risks",
    code: "BOQ 02-310",
    title: "High Tensile Steel Rebars (16mm) Variance Alert",
    description: "Committed cost exceeds baseline BOQ allocation by ₦1,840,000 due to mill price escalation.",
    value: "+₦1.84M Variance",
    actionText: "Resolve BOQ Risk in Cost Plan",
  },
  {
    id: "qs-2",
    role: "Quantity Surveyor",
    priority: "High",
    flow: "Cost Plan",
    subSection: "revisions",
    code: "REV-2026-04",
    title: "Ready-Mix Concrete Grade C30/37 Rate Revision",
    description: "Supplier quote delta of +20% requested by Lafarge Africa Plc. Needs QS sign-off.",
    value: "₦138,000 / m³",
    actionText: "Review Rate Delta",
  },
  {
    id: "qs-3",
    role: "Quantity Surveyor",
    priority: "Medium",
    flow: "Contracts",
    subSection: "claims",
    code: "VAL-SUB-03",
    title: "Interim Valuation for MEP Electrical First-Fix",
    description: "Subcontractor submitted interim valuation claim #03 for ₦14,200,000; QS assessment recommended at ₦12,800,000.",
    value: "₦12.8M Assessed",
    actionText: "Certify Valuation",
  },

  // --- PROCUREMENT OFFICER ---
  {
    id: "proc-1",
    role: "Procurement Officer",
    priority: "Critical",
    flow: "Buy & Supply",
    subSection: "match",
    code: "3WM-088",
    title: "3-Way Match Gate Discrepancy on Dangote Cement",
    description: "Invoice #9914 (600 bags @ ₦9,850) differs from approved PO #2026-088 unit rate (₦9,500). Payment gate blocked.",
    value: "₦210,000 Discrepancy",
    actionText: "Resolve 3-Way Match Gate",
  },
  {
    id: "proc-2",
    role: "Procurement Officer",
    priority: "High",
    flow: "Buy & Supply",
    subSection: "requisitions",
    code: "REQ-042",
    title: "Material Requisition: Hardwood 2x4 Timber Formwork",
    description: "Site requisition submitted by Site Engineer. Awaiting creation of RFQ to vetted lumber suppliers.",
    value: "250 Lengths",
    actionText: "Open RFQ in Buy & Supply",
  },
  {
    id: "proc-3",
    role: "Procurement Officer",
    priority: "Medium",
    flow: "Buy & Supply",
    subSection: "stock",
    code: "GRN-019",
    title: "Goods Received Note: BRC Mesh A142 Delivery Confirmation",
    description: "Delivery truck arrived at site gate. Physical stock tally and store receipt acknowledgment pending.",
    value: "50 Rolls Received",
    actionText: "Acknowledge Stock Receipt",
  },

  // --- ACCOUNTANT ---
  {
    id: "acct-1",
    role: "Accountant",
    priority: "Critical",
    flow: "Buy & Supply",
    subSection: "invoices",
    code: "INV-4102",
    title: "Berger Paints Nigeria Plc Approved Invoice Clearance",
    description: "3-way matched and certified by QS. Due for release from project disbursement account.",
    value: "₦3,450,000 Due",
    actionText: "Clear Invoice in Buy & Supply",
  },
  {
    id: "acct-2",
    role: "Accountant",
    priority: "High",
    flow: "Buy & Supply",
    subSection: "payments",
    code: "DISB-051",
    title: "Foundation Piling Interim Certificate #02",
    description: "Certified interim amount of ₦8,900,000 with 5% contractual retention (₦445,000) withheld.",
    value: "₦8,455,000 Net Payout",
    actionText: "Record Payout in Ledger",
  },
  {
    id: "acct-3",
    role: "Accountant",
    priority: "Medium",
    flow: "Contracts",
    subSection: "contracts",
    code: "RET-2025-11",
    title: "Structural Frame Subcontractor 5% Retention Milestone",
    description: "Defects Liability Period milestone due in 18 days. Review final retention release certificate.",
    value: "₦2,180,000 Retention",
    actionText: "Inspect Retention Ledger",
  },

  // --- SITE ENGINEER ---
  {
    id: "site-1",
    role: "Site Engineer",
    priority: "Critical",
    flow: "Site",
    subSection: "diary",
    code: "SHIFT #143",
    title: "Daily Site Diary & Shift Log Incomplete",
    description: "Shift #143 weather, concrete pour times, and equipment idle hours require electronic submission.",
    value: "Today's Log",
    actionText: "Complete Shift Diary in Site",
  },
  {
    id: "site-2",
    role: "Site Engineer",
    priority: "High",
    flow: "Site",
    subSection: "snags",
    code: "NCR-07",
    title: "Column C3 Alignment Non-Conformance Notice",
    description: "Post-pour survey detected column face out-of-plumb by 14mm. Remedial action plan pending.",
    value: "Grid C3 Column",
    actionText: "Resolve NCR in Site",
  },
  {
    id: "site-3",
    role: "Site Engineer",
    priority: "Medium",
    flow: "Site",
    subSection: "drawings",
    code: "REV-C",
    title: "First Floor Structural Slab Rebar Working Drawing Update",
    description: "Architect issued Revision C with adjusted cantilever steel spacing. Review before tomorrow's pour.",
    value: "Drawing #ST-104",
    actionText: "View Working Drawing",
  },

  // --- PROJECT MANAGER ---
  {
    id: "pm-1",
    role: "Project Manager",
    priority: "Critical",
    flow: "Contracts",
    subSection: "variations",
    code: "VO-04",
    title: "Variation Order VO-04: Substructure Deepening",
    description: "Geotechnical condition required +1.2m foundation excavation. Subcontractor variation claim of ₦4,850,000 awaiting PM approval.",
    value: "₦4,850,000",
    actionText: "Review Variation Order",
  },
  {
    id: "pm-2",
    role: "Project Manager",
    priority: "High",
    flow: "Cost Plan",
    subSection: "risks",
    code: "BUDGET",
    title: "Macro Baseline Budget Tracking: 96.8% Committed",
    description: "Total project committed costs approaching ceiling. Review remaining contingency headroom.",
    value: "₦292.2M / ₦301.8M",
    actionText: "Inspect Cost Control",
  },
  {
    id: "pm-3",
    role: "Project Manager",
    priority: "Medium",
    flow: "Oversight",
    subSection: "telemetry",
    code: "CPI 1.04",
    title: "Financial Health & Telemetry Executive Review",
    description: "Review current Cost Performance Index, active workforce muster, and milestone progress curves.",
    value: "62% Physical Progress",
    actionText: "Open Telemetry View",
  },

  // --- ARCHITECT ---
  {
    id: "arch-1",
    role: "Architect",
    priority: "High",
    flow: "Site",
    subSection: "drawings",
    code: "RFI-12",
    title: "Service Shaft Penetration Drawing Revision",
    description: "Site Engineer query regarding HVAC riser dimensions through floor slab Grid B2.",
    value: "Grid B2 Penetration",
    actionText: "Review Drawing Query",
  },
  {
    id: "arch-2",
    role: "Architect",
    priority: "Medium",
    flow: "Site",
    subSection: "snags",
    code: "SNAG-18",
    title: "Facade Glazing Reveal Tolerance Inspection",
    description: "Visual inspection sign-off required for perimeter mullion alignment on Ground Floor Entrance.",
    value: "Entrance Facade",
    actionText: "Sign-off Snag Item",
  },

  // --- STOREKEEPER ---
  {
    id: "store-1",
    role: "Storekeeper",
    priority: "Critical",
    flow: "Buy & Supply",
    subSection: "stock",
    code: "STK-LOW",
    title: "Dangote 42.5R Cement Stock Level Below Minimum Buffer",
    description: "Current warehouse balance: 45 bags (Threshold: 100 bags). Upcoming slab pour requires 350 bags.",
    value: "45 Bags Remaining",
    actionText: "Check Stock Ledger",
  },
  {
    id: "store-2",
    role: "Storekeeper",
    priority: "High",
    flow: "Buy & Supply",
    subSection: "stock",
    code: "GRN-020",
    title: "PVC Electrical Conduit Pipes Gate Pass & Delivery",
    description: "Delivery acknowledged at physical gate. Complete inspection and update site store ledger.",
    value: "1,200 Metres",
    actionText: "Record Stock Receipt",
  },

  // --- ADMIN ---
  {
    id: "adm-1",
    role: "Admin",
    priority: "High",
    flow: "Oversight",
    subSection: "admin",
    code: "SEC-USR",
    title: "User Role Assignment for 2 New Site Engineers",
    description: "New team members created via Supabase Auth without active project permissions.",
    value: "2 Accounts Pending",
    actionText: "Configure User Roles",
  },
  {
    id: "adm-2",
    role: "Admin",
    priority: "Medium",
    flow: "Oversight",
    subSection: "admin",
    code: "AUD-SYS",
    title: "Immutable System Audit Trail Verification",
    description: "28 security and financial ledger events recorded in last 24 hours.",
    value: "28 Log Events",
    actionText: "Inspect Audit Trail",
  },
];

interface MyWorkQueueProps {
  onSelectNav: (section: string, subSection?: string) => void;
}

export function MyWorkQueue({ onSelectNav }: MyWorkQueueProps) {
  const { activeRole } = useApp();
  const [filter, setFilter] = useState<"all" | "critical" | "high">("all");

  // Get tasks for the current active role (or default to Project Manager if not found)
  const roleTasks = ACTION_TASKS.filter((task) => task.role === activeRole);
  const activeTasks = roleTasks.length > 0 ? roleTasks : ACTION_TASKS.slice(0, 3);

  const filteredTasks = activeTasks.filter((t) => {
    if (filter === "critical") return t.priority === "Critical";
    if (filter === "high") return t.priority === "Critical" || t.priority === "High";
    return true;
  });

  const criticalCount = activeTasks.filter((t) => t.priority === "Critical").length;
  const highCount = activeTasks.filter((t) => t.priority === "High").length;

  const flowIconMap = {
    "Cost Plan": Calculator,
    "Buy & Supply": ShoppingCart,
    "Site": HardHat,
    "Contracts": Briefcase,
    "Oversight": ShieldCheck,
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border-2 border-[#E5E5DE] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-[#0A2540]/60">
              Role-Filtered Action Queue
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-[#0A2540] text-white">
              {activeRole}
            </span>
          </div>
          <h2 className="text-2xl font-black text-[#0A2540] tracking-tight">
            My Work &amp; Priority Items
          </h2>
          <p className="text-sm text-[#0A2540]/70 mt-1 max-w-xl">
            Items awaiting your sign-off, discrepancies needing reconciliation, and urgent site actions.
          </p>
        </div>

        {/* Status Counters */}
        <div className="flex items-center gap-3">
          <div className="bg-rose-50 border border-rose-200 px-4 py-2.5 rounded-xl text-center">
            <div className="text-xl font-black text-rose-700">{criticalCount}</div>
            <div className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Critical</div>
          </div>
          <div className="bg-amber-50 border border-amber-200 px-4 py-2.5 rounded-xl text-center">
            <div className="text-xl font-black text-amber-700">{highCount}</div>
            <div className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">High Priority</div>
          </div>
          <div className="bg-[#FAF9F5] border border-[#E5E5DE] px-4 py-2.5 rounded-xl text-center">
            <div className="text-xl font-black text-[#0A2540]">{activeTasks.length}</div>
            <div className="text-[10px] font-bold text-[#0A2540]/60 uppercase tracking-wider">Total Actions</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === "all"
                ? "bg-[#0A2540] text-white shadow-xs"
                : "bg-white text-[#0A2540]/70 hover:bg-[#FAF9F5] border border-[#E5E5DE]"
            }`}
          >
            All Action Items ({activeTasks.length})
          </button>
          <button
            onClick={() => setFilter("critical")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === "critical"
                ? "bg-rose-600 text-white shadow-xs"
                : "bg-white text-rose-700 hover:bg-rose-50 border border-rose-200"
            }`}
          >
            Critical Only ({criticalCount})
          </button>
          <button
            onClick={() => setFilter("high")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === "high"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-white text-amber-800 hover:bg-amber-50 border border-amber-200"
            }`}
          >
            Urgent + High ({criticalCount + highCount})
          </button>
        </div>

        <span className="text-xs text-[#0A2540]/60 font-semibold hidden sm:inline">
          Showing tasks assigned to {activeRole}
        </span>
      </div>

      {/* Action Tasks Grid */}
      <div className="space-y-3.5">
        {filteredTasks.length === 0 ? (
          <div className="bg-white border-2 border-[#E5E5DE] rounded-2xl p-10 text-center text-[#0A2540]/60">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2 opacity-80" />
            <h3 className="font-extrabold text-base text-[#0A2540]">No pending actions</h3>
            <p className="text-xs text-[#0A2540]/60 mt-1">All items in your queue are resolved.</p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const FlowIcon = flowIconMap[task.flow] || ShieldCheck;
            const isCritical = task.priority === "Critical";
            const isHigh = task.priority === "High";

            return (
              <div
                key={task.id}
                className="bg-white border-2 border-[#E5E5DE] rounded-2xl p-5 shadow-xs hover:border-[#0A2540]/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 group"
              >
                <div className="flex items-start gap-4 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                      isCritical
                        ? "bg-rose-50 text-rose-700 border-rose-200"
                        : isHigh
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-slate-50 text-[#0A2540] border-[#E5E5DE]"
                    }`}
                  >
                    <FlowIcon className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                          isCritical
                            ? "bg-rose-100 text-rose-800 border-rose-300"
                            : isHigh
                            ? "bg-amber-100 text-amber-900 border-amber-300"
                            : "bg-slate-100 text-slate-800 border-slate-300"
                        }`}
                      >
                        {task.priority}
                      </span>
                      <span className="text-[11px] font-mono font-extrabold text-[#0A2540]/70 bg-[#FAF9F5] border border-[#E5E5DE] px-2 py-0.5 rounded-md">
                        {task.flow} · {task.code}
                      </span>
                      {task.value && (
                        <span className="text-xs font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                          {task.value}
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-extrabold text-[#0A2540] tracking-tight">
                      {task.title}
                    </h4>
                    <p className="text-xs text-[#0A2540]/70 mt-1 leading-relaxed">
                      {task.description}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-3">
                  <button
                    onClick={() => onSelectNav(task.flow, task.subSection)}
                    className="w-full md:w-auto px-5 py-2.5 bg-[#0A2540] hover:bg-[#0A2540]/90 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.98] cursor-pointer group-hover:shadow-md"
                  >
                    <span>{task.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
