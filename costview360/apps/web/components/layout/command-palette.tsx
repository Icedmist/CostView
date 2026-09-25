"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  X,
  Calculator,
  ShoppingCart,
  HardHat,
  Briefcase,
  LayoutDashboard,
  Sparkles,
  ShieldAlert,
  FileSpreadsheet,
  FileText,
  BadgeCheck,
  Clock,
  Truck,
  Receipt,
  CreditCard,
  Boxes,
  Store,
  Calendar,
  ImageIcon,
  Users,
  DraftingCompass,
  FileCheck2,
  AlertCircle,
  ScrollText,
  DollarSign,
  Activity,
  AlertTriangle,
  TrendingUp,
  Globe,
  ShieldCheck,
  ArrowRight,
  Command,
} from "lucide-react";

export interface CommandItem {
  id: string;
  title: string;
  category: "Flow" | "BOQ & Cost" | "Buy & Supply" | "Site & Drawings" | "Contracts" | "Reports" | "Admin";
  section: string;
  subSection?: string;
  description: string;
  flowLabel: string;
  icon: React.ElementType;
}

export const COMMAND_ITEMS: CommandItem[] = [
  // 1. Cost Plan
  {
    id: "cp-est",
    title: "AI Feasibility & Cost Estimator",
    category: "Flow",
    section: "Cost Plan",
    subSection: "estimator",
    description: "Generate instant BOQ line items and cost forecasts from project parameters",
    flowLabel: "Cost Plan · Estimate",
    icon: Sparkles,
  },
  {
    id: "cp-boq",
    title: "BOQ Master Register",
    category: "BOQ & Cost",
    section: "Cost Plan",
    subSection: "boq",
    description: "Review bill of quantities, rates, quantities and work breakdowns",
    flowLabel: "Cost Plan · BOQ",
    icon: Calculator,
  },
  {
    id: "cp-risks",
    title: "Cost Control & Risks Register",
    category: "BOQ & Cost",
    section: "Cost Plan",
    subSection: "risks",
    description: "Variance tracking, risk mitigation and flagged budget overruns",
    flowLabel: "Cost Plan · Cost Control",
    icon: ShieldAlert,
  },
  {
    id: "cp-rev",
    title: "Rate Revisions & Deltas",
    category: "BOQ & Cost",
    section: "Cost Plan",
    subSection: "revisions",
    description: "Market price adjustments and supplier rate variation history",
    flowLabel: "Cost Plan · Cost Control",
    icon: FileSpreadsheet,
  },
  {
    id: "cp-final",
    title: "Final Account Closeout",
    category: "BOQ & Cost",
    section: "Cost Plan",
    subSection: "finalAccount",
    description: "Final account statements, adjustments, and commercial project reconciliation",
    flowLabel: "Cost Plan · Close-out",
    icon: FileText,
  },
  {
    id: "cp-rep",
    title: "Budget vs Actual Cost Reports",
    category: "Reports",
    section: "Cost Plan",
    subSection: "reports-cost",
    description: "Cost control summary, EAC/ETC forecasts, and budget variance",
    flowLabel: "Cost Plan · Reports",
    icon: DollarSign,
  },

  // 2. Buy & Supply
  {
    id: "bs-req",
    title: "Material Requisitions",
    category: "Buy & Supply",
    section: "Buy & Supply",
    subSection: "requisitions",
    description: "Site material purchase requests and order approvals",
    flowLabel: "Buy & Supply · Requisition",
    icon: Clock,
  },
  {
    id: "bs-enq",
    title: "Supplier Enquiries & Quotes",
    category: "Buy & Supply",
    section: "Buy & Supply",
    subSection: "enquiries",
    description: "Request for Quotations (RFQs) and competitive supplier bidding",
    flowLabel: "Buy & Supply · Quote",
    icon: Truck,
  },
  {
    id: "bs-match",
    title: "Three-Way Match Verification Gate",
    category: "Buy & Supply",
    section: "Buy & Supply",
    subSection: "match",
    description: "Automated PO vs Goods Received (GRN) vs Invoice payment gate",
    flowLabel: "Buy & Supply · 3-Way Match",
    icon: BadgeCheck,
  },
  {
    id: "bs-inv",
    title: "Invoices & Payment Clearances",
    category: "Buy & Supply",
    section: "Buy & Supply",
    subSection: "invoices",
    description: "Track supplier invoice verification and payment authorization",
    flowLabel: "Buy & Supply · Pay",
    icon: Receipt,
  },
  {
    id: "bs-pay",
    title: "Disbursement Ledger",
    category: "Buy & Supply",
    section: "Buy & Supply",
    subSection: "payments",
    description: "Immutable payout ledger and payment voucher auditing",
    flowLabel: "Buy & Supply · Pay",
    icon: CreditCard,
  },
  {
    id: "bs-stock",
    title: "Materials & Stock Ledger",
    category: "Buy & Supply",
    section: "Buy & Supply",
    subSection: "stock",
    description: "Real-time site warehouse stock balances, receipts, and issues",
    flowLabel: "Buy & Supply · Deliver",
    icon: Boxes,
  },
  {
    id: "bs-dir",
    title: "Vetted Trade & Supplier Directory",
    category: "Buy & Supply",
    section: "Buy & Supply",
    subSection: "directory",
    description: "Pre-qualified Nigerian material suppliers and equipment vendors",
    flowLabel: "Buy & Supply · Directory",
    icon: Store,
  },

  // 3. Site
  {
    id: "st-diary",
    title: "Daily Site Diary & Shift Log",
    category: "Site & Drawings",
    section: "Site",
    subSection: "diary",
    description: "Weather conditions, site shifts, progress logs, and equipment muster",
    flowLabel: "Site · Log",
    icon: Calendar,
  },
  {
    id: "st-photos",
    title: "Progress Photos & Milestone Proof",
    category: "Site & Drawings",
    section: "Site",
    subSection: "photos",
    description: "Geotagged site photography and physical construction verification",
    flowLabel: "Site · Progress",
    icon: ImageIcon,
  },
  {
    id: "st-labour",
    title: "Labour Muster & Productivity",
    category: "Site & Drawings",
    section: "Site",
    subSection: "labour",
    description: "Daily trade headcount, gang allocation, and labour output rates",
    flowLabel: "Site · Progress",
    icon: Users,
  },
  {
    id: "st-drawings",
    title: "Architectural & Structural Drawings",
    category: "Site & Drawings",
    section: "Site",
    subSection: "drawings",
    description: "Working drawings register, revision tracking, and BIM sheets",
    flowLabel: "Site · Drawings",
    icon: DraftingCompass,
  },
  {
    id: "st-qc",
    title: "QA/QC Inspections & Concrete Tests",
    category: "Site & Drawings",
    section: "Site",
    subSection: "inspections",
    description: "Cube test results, slump checks, and pre-pour inspection checklists",
    flowLabel: "Site · Inspect",
    icon: FileCheck2,
  },
  {
    id: "st-snags",
    title: "Snags & Non-Conformance (NCRs)",
    category: "Site & Drawings",
    section: "Site",
    subSection: "snags",
    description: "Defect punch items, corrective actions, and sign-offs",
    flowLabel: "Site · Resolve",
    icon: AlertCircle,
  },
  {
    id: "st-safety",
    title: "HSE Safety Observations",
    category: "Site & Drawings",
    section: "Site",
    subSection: "safety",
    description: "Site incident reports, PPE adherence, and hazard mitigation",
    flowLabel: "Site · HSE",
    icon: HardHat,
  },

  // 4. Contracts
  {
    id: "ct-inst",
    title: "Site Instructions Register",
    category: "Contracts",
    section: "Contracts",
    subSection: "instructions",
    description: "Architect and engineer formal written instructions and orders",
    flowLabel: "Contracts · Instruct",
    icon: ScrollText,
  },
  {
    id: "ct-claims",
    title: "Interim Claims & Valuations",
    category: "Contracts",
    section: "Contracts",
    subSection: "claims",
    description: "Subcontractor monthly progress claims and QS valuation certificates",
    flowLabel: "Contracts · Claim",
    icon: Receipt,
  },
  {
    id: "ct-var",
    title: "Variation Orders Register",
    category: "Contracts",
    section: "Contracts",
    subSection: "variations",
    description: "Scope changes, cost impacts, and approved variation addenda",
    flowLabel: "Contracts · Certify",
    icon: FileSpreadsheet,
  },
  {
    id: "ct-sub",
    title: "Subcontractor Ledger & Retention",
    category: "Contracts",
    section: "Contracts",
    subSection: "contracts",
    description: "Contract commitments, cumulative certified, and 5% retention tracking",
    flowLabel: "Contracts · Retain",
    icon: Briefcase,
  },

  // 5. Oversight
  {
    id: "ov-work",
    title: "My Work Action Queue",
    category: "Flow",
    section: "Oversight",
    subSection: "my-work",
    description: "Role-filtered pending actions, approval gates, and immediate tasks",
    flowLabel: "Oversight · Action",
    icon: LayoutDashboard,
  },
  {
    id: "ov-telemetry",
    title: "Executive Telemetry & KPIs",
    category: "Flow",
    section: "Oversight",
    subSection: "telemetry",
    description: "Macro project progress, CPI, committed budget, and cashflow speed",
    flowLabel: "Oversight · Watch",
    icon: Activity,
  },
  {
    id: "ov-alerts",
    title: "Attention & Variance Alerts",
    category: "Flow",
    section: "Oversight",
    subSection: "alerts",
    description: "Discrepancy warnings, cost overruns, and overdue project milestones",
    flowLabel: "Oversight · Decide",
    icon: AlertTriangle,
  },
  {
    id: "ov-health",
    title: "Baseline Financial Health",
    category: "Flow",
    section: "Oversight",
    subSection: "health",
    description: "Project budget integrity, earned value, and financial stability metrics",
    flowLabel: "Oversight · Approve",
    icon: TrendingUp,
  },
  {
    id: "ov-portal",
    title: "Client & Investor Progress Portal",
    category: "Flow",
    section: "Oversight",
    subSection: "portal",
    description: "Shareable public progress, milestone photos, and budget reporting for clients",
    flowLabel: "Oversight · Share",
    icon: Globe,
  },
  {
    id: "ov-admin",
    title: "Workspace Governance & Permissions",
    category: "Admin",
    section: "Oversight",
    subSection: "admin",
    description: "User roles, permissions matrix, database migrations, and audit trails",
    flowLabel: "Oversight · Admin",
    icon: ShieldCheck,
  },
];

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNav: (section: string, subSection?: string) => void;
}

export function CommandPalette({ isOpen, onClose, onSelectNav }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter items
  const filtered = React.useMemo(() => {
    if (!query.trim()) {
      return COMMAND_ITEMS.slice(0, 10);
    }
    const q = query.toLowerCase();
    return COMMAND_ITEMS.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.flowLabel.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [query]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1 < filtered.length ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : filtered.length - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selected = filtered[selectedIndex];
        if (selected) {
          onSelectNav(selected.section, selected.subSection);
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onSelectNav, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-[#0A2540]/60 backdrop-blur-xs animate-in fade-in">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-2xl bg-white border-2 border-[#E5E5DE] rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b-2 border-[#E5E5DE] flex items-center gap-3 bg-[#FAF9F5]">
          <Search className="w-5 h-5 text-[#0A2540]/50 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a workflow, BOQ line, supplier, claim, or report..."
            className="w-full bg-transparent text-[#0A2540] placeholder:text-[#0A2540]/40 font-bold text-base focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-[#0A2540]/50 hover:text-[#0A2540] p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono font-bold text-[#0A2540]/60 bg-white border border-[#E5E5DE] px-2 py-0.5 rounded-md shadow-2xs">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-[#E5E5DE]/40">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-[#0A2540]/60">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-30 text-[#0A2540]" />
              <p className="font-bold text-sm">No workflows or records found</p>
              <p className="text-xs mt-1 text-[#0A2540]/50">
                Try searching for &quot;BOQ&quot;, &quot;Match&quot;, &quot;Diary&quot;, &quot;Claim&quot;, or &quot;Estimator&quot;
              </p>
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectNav(item.section, item.subSection);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-xl flex items-center justify-between gap-4 cursor-pointer transition-all ${
                    isSelected
                      ? "bg-[#0A2540] text-white shadow-sm"
                      : "hover:bg-[#FAF9F5] text-[#0A2540]"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${
                        isSelected
                          ? "bg-white/10 text-white border-white/20"
                          : "bg-white text-[#0A2540] border-[#E5E5DE] shadow-2xs"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm truncate">
                          {item.title}
                        </span>
                        <span
                          className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                            isSelected
                              ? "bg-white/15 text-white/90 border-white/20"
                              : "bg-[#FAF9F5] text-[#0A2540]/70 border-[#E5E5DE]"
                          }`}
                        >
                          {item.flowLabel}
                        </span>
                      </div>
                      <p
                        className={`text-xs truncate mt-0.5 ${
                          isSelected ? "text-white/70" : "text-[#0A2540]/60"
                        }`}
                      >
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <ArrowRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isSelected ? "translate-x-0.5 text-white" : "opacity-0"
                    }`}
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 bg-[#FAF9F5] border-t-2 border-[#E5E5DE] flex items-center justify-between text-xs text-[#0A2540]/60 font-medium">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-[#E5E5DE] rounded text-[10px] font-mono shadow-2xs">
                ↑
              </kbd>
              <kbd className="px-1.5 py-0.5 bg-white border border-[#E5E5DE] rounded text-[10px] font-mono shadow-2xs">
                ↓
              </kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-[#E5E5DE] rounded text-[10px] font-mono shadow-2xs">
                ↵
              </kbd>
              <span>to select</span>
            </span>
          </div>
          <span className="font-bold text-[#0A2540]">CostView 5-Flow Search</span>
        </div>
      </div>
    </div>
  );
}
