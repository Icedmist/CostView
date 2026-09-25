"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useApp } from "@/app/providers";
import type { RoleName } from "@/lib/supabase/database.types";
import {
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
  Search,
  ChevronDown,
  ChevronRight,
  LogOut,
  Settings,
  X,
  Lock,
  UserCheck,
  BookOpen,
} from "lucide-react";
import { canAccess } from "@/lib/auth/permissions";
import { OnboardingModal } from "@/components/onboarding/onboarding-modal";

export interface SubNavSection {
  id: string;
  name: string;
  code: string;
  icon: React.ElementType;
  badge?: string;
  permission?: string;
}

export interface PrimarySection {
  id: string;
  name: string;
  code: string;
  icon: React.ElementType;
  flowStatement: string;
  permission?: string;
  badge?: string;
  subSections: SubNavSection[];
}

export const NAVIGATION_SECTIONS: PrimarySection[] = [
  // 1. COST PLAN
  {
    id: "Cost Plan",
    name: "Cost Plan",
    code: "1.0",
    icon: Calculator,
    flowStatement: "Estimate → BOQ → Cost Control → Close-out",
    permission: "Budget",
    subSections: [
      {
        id: "estimator",
        name: "AI Cost Estimator",
        code: "1.1",
        icon: Sparkles,
        badge: "AI",
      },
      {
        id: "boq",
        name: "BOQ Master Register",
        code: "1.2",
        icon: Calculator,
      },
      {
        id: "risks",
        name: "Cost Control & Risks",
        code: "1.3",
        icon: ShieldAlert,
      },
      {
        id: "revisions",
        name: "Rate Revisions & Deltas",
        code: "1.4",
        icon: FileSpreadsheet,
      },
      {
        id: "finalAccount",
        name: "Final Account Closeout",
        code: "1.5",
        icon: FileText,
      },
      {
        id: "reports-cost",
        name: "Budget vs Actual Reports",
        code: "1.6",
        icon: DollarSign,
      },
    ],
  },

  // 2. BUY & SUPPLY
  {
    id: "Buy & Supply",
    name: "Buy & Supply",
    code: "2.0",
    icon: ShoppingCart,
    flowStatement: "Requisition → Quote → 3-Way Match → Pay → Deliver",
    permission: "Procurement",
    badge: "3",
    subSections: [
      {
        id: "requisitions",
        name: "Material Requisitions",
        code: "2.1",
        icon: Clock,
        badge: "3",
      },
      {
        id: "enquiries",
        name: "Supplier Enquiries & Quotes",
        code: "2.2",
        icon: Truck,
      },
      {
        id: "match",
        name: "Three-Way Match Gate",
        code: "2.3",
        icon: BadgeCheck,
      },
      {
        id: "invoices",
        name: "Invoices & Payments",
        code: "2.4",
        icon: Receipt,
      },
      {
        id: "payments",
        name: "Disbursement Ledger",
        code: "2.5",
        icon: CreditCard,
      },
      {
        id: "stock",
        name: "Materials & Stock Ledger",
        code: "2.6",
        icon: Boxes,
      },
      {
        id: "assets",
        name: "Plant, Equipment & Assets",
        code: "2.7",
        icon: Truck,
        badge: "Assets",
      },
      {
        id: "directory",
        name: "Vetted Trade Directory",
        code: "2.8",
        icon: Store,
        badge: "Vetted",
      },
      {
        id: "reports-procurement",
        name: "Procurement Reports",
        code: "2.9",
        icon: FileText,
      },
    ],
  },

  // 3. SITE
  {
    id: "Site",
    name: "Site",
    code: "3.0",
    icon: HardHat,
    flowStatement: "Log → Progress → Inspect → Resolve",
    permission: "Progress",
    subSections: [
      {
        id: "diary",
        name: "Daily Site Diary & Log",
        code: "3.1",
        icon: Calendar,
      },
      {
        id: "photos",
        name: "Progress Photos & Proof",
        code: "3.2",
        icon: ImageIcon,
      },
      {
        id: "labour",
        name: "Labour & Productivity",
        code: "3.3",
        icon: Users,
      },
      {
        id: "drawings",
        name: "Drawings & Revisions",
        code: "3.4",
        icon: DraftingCompass,
      },
      {
        id: "inspections",
        name: "QA/QC Inspections & Tests",
        code: "3.5",
        icon: FileCheck2,
      },
      {
        id: "snags",
        name: "Snags & NCRs",
        code: "3.6",
        icon: AlertCircle,
      },
      {
        id: "safety",
        name: "HSE Safety Observations",
        code: "3.7",
        icon: HardHat,
      },
      {
        id: "reports-site",
        name: "Site Progress Reports",
        code: "3.8",
        icon: FileText,
      },
    ],
  },

  // 4. CONTRACTS
  {
    id: "Contracts",
    name: "Contracts",
    code: "4.0",
    icon: Briefcase,
    flowStatement: "Instruct → Claim → Certify → Retain",
    permission: "Subcontractors",
    subSections: [
      {
        id: "instructions",
        name: "Site Instructions Register",
        code: "4.1",
        icon: ScrollText,
      },
      {
        id: "claims",
        name: "Interim Claims & Certs",
        code: "4.2",
        icon: Receipt,
      },
      {
        id: "variations",
        name: "Variation Orders Register",
        code: "4.3",
        icon: FileSpreadsheet,
      },
      {
        id: "contracts",
        name: "Subcontractor Ledger & Retention",
        code: "4.4",
        icon: Briefcase,
      },
      {
        id: "reports-contracts",
        name: "Valuation Reports",
        code: "4.5",
        icon: DollarSign,
      },
    ],
  },

  // 5. OVERSIGHT
  {
    id: "Oversight",
    name: "Oversight",
    code: "5.0",
    icon: LayoutDashboard,
    flowStatement: "Watch → Decide → Approve → Share",
    subSections: [
      {
        id: "my-work",
        name: "My Work Action Queue",
        code: "5.1",
        icon: Activity,
        badge: "Action",
      },
      {
        id: "telemetry",
        name: "Management Decision Center",
        code: "5.2",
        icon: TrendingUp,
        badge: "Executive",
      },
      {
        id: "alerts",
        name: "Attention & Variance Alerts",
        code: "5.3",
        icon: AlertTriangle,
        badge: "3",
      },
      {
        id: "health",
        name: "Baseline Financial Health",
        code: "5.4",
        icon: DollarSign,
      },
      {
        id: "portal",
        name: "Client & Investor Portal",
        code: "5.5",
        icon: Globe,
        badge: "Live",
      },
      {
        id: "reports-all",
        name: "Executive Reports Studio",
        code: "5.6",
        icon: FileText,
      },
      {
        id: "admin",
        name: "Governance & Settings",
        code: "5.7",
        icon: ShieldCheck,
        badge: "Admin",
        permission: "Admin",
      },
      {
        id: "documents-admin",
        name: "Documents & Administration",
        code: "5.8",
        icon: FileCheck2,
        badge: "Docs",
      },
    ],
  },
];

const ALL_ROLES: RoleName[] = [
  "Admin",
  "Project Manager",
  "Quantity Surveyor",
  "Architect",
  "Site Engineer",
  "Procurement Officer",
  "Accountant",
  "Storekeeper",
];

// Helper to normalize legacy section names to the 5 flows
export function normalizeSection(section?: string): string {
  if (!section) return "Oversight";
  const map: Record<string, string> = {
    "Command Center": "Oversight",
    "Budget & BOQ": "Cost Plan",
    "Cost Plan": "Cost Plan",
    Drawings: "Site",
    Procurement: "Buy & Supply",
    "Buy & Supply": "Buy & Supply",
    "Site Operations": "Site",
    Site: "Site",
    "Contracts & Subcontractors": "Contracts",
    Contracts: "Contracts",
    Administration: "Oversight",
    "Reports Studio": "Oversight",
    Oversight: "Oversight",
  };
  return map[section] || "Oversight";
}

interface SidebarProps {
  activeSection?: string;
  activeSubSection?: string;
  onSelectNav?: (section: string, subSection?: string) => void;
  onOpenSearch?: () => void;
  // Legacy props compatibility
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({
  activeSection = "Oversight",
  activeSubSection = "my-work",
  onSelectNav,
  onOpenSearch,
  activeTab,
  onSelectTab,
  open,
  onClose,
}: SidebarProps) {
  const { activeRole, setActiveRole, currentProject } = useApp();
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [userName, setUserName] = useState<string>("CostView User");
  const [userEmail, setUserEmail] = useState<string>("user@costview.ng");
  const router = useRouter();

  // Normalized current flow
  const currentFlowId = normalizeSection(activeSection || activeTab);

  // Accordion open states (default: active flow is open)
  const [expandedFlows, setExpandedFlows] = useState<Record<string, boolean>>({
    [currentFlowId]: true,
  });

  // Keep active flow expanded when activeSection changes
  useEffect(() => {
    setExpandedFlows((prev) => ({
      ...prev,
      [currentFlowId]: true,
    }));
  }, [currentFlowId]);

  const toggleFlow = (flowId: string) => {
    setExpandedFlows((prev) => ({
      ...prev,
      [flowId]: !prev[flowId],
    }));
  };

  const handleSubSelect = (flowId: string, subId: string) => {
    if (onSelectNav) {
      onSelectNav(flowId, subId);
    } else if (onSelectTab) {
      onSelectTab(flowId);
    }
    if (onClose) onClose();
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  return (
    <>
      {/* ========================================================= */}
      {/* 1. DESKTOP SINGLE-STREAM SIDEBAR (w-[290px], Single Panel) */}
      {/* ========================================================= */}
      <aside className="hidden lg:flex flex-col w-[290px] h-full bg-white dark:bg-[#0A1931] border-r-2 border-[#E5E5DE] dark:border-[#1E3A5F] shrink-0 z-20 select-none shadow-xs font-sans transition-colors">
        {/* Brand Header */}
        <div className="p-5 border-b-2 border-[#E5E5DE] dark:border-[#1E3A5F] flex items-center justify-between gap-3 bg-white dark:bg-[#0A1931]">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-white dark:bg-[#0F2137] rounded-xl flex items-center justify-center p-1.5 shadow-sm border border-[#0A2540]/15 dark:border-[#1E3A5F] group-hover:scale-105 transition-transform">
              <Image
                src="/logo-mark.png"
                alt="CostView"
                width={32}
                height={32}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div>
              <div className="text-lg font-black tracking-tight text-[#0A2540] dark:text-white leading-none">
                CostView
              </div>
              <div className="text-[10px] font-bold tracking-wider text-[#0A2540]/60 dark:text-white/60 uppercase mt-1">
                Cost Intelligence
              </div>
            </div>
          </Link>

          <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#FAF9F5] dark:bg-[#071324] border border-[#E5E5DE] dark:border-[#1E3A5F] rounded-md text-[#0A2540]/70 dark:text-white/70">
            5 Flows
          </span>
        </div>

        {/* ⌘K Search Quick Bar */}
        <div className="p-3.5 border-b-2 border-[#E5E5DE] dark:border-[#1E3A5F] bg-[#FAF9F5] dark:bg-[#071324]">
          <button
            onClick={() => onOpenSearch?.()}
            className="w-full flex items-center justify-between px-3.5 py-2.5 bg-white dark:bg-[#0A1931] hover:bg-slate-50 dark:hover:bg-[#0F2137] border-2 border-[#E5E5DE] dark:border-[#1E3A5F] rounded-xl text-xs font-bold text-[#0A2540]/70 dark:text-white/70 shadow-2xs transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-[#0A2540]/50 dark:text-white/50 group-hover:text-[#0A2540] dark:group-hover:text-white" />
              <span className="text-[#0A2540]/60 dark:text-white/60 group-hover:text-[#0A2540] dark:group-hover:text-white">
                Quick jump or search...
              </span>
            </div>
            <kbd className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono font-black text-[#0A2540]/80 dark:text-white/80 bg-[#FAF9F5] dark:bg-[#071324] border border-[#E5E5DE] dark:border-[#1E3A5F] rounded-md shadow-2xs">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* The 5 Flows Accordion List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {NAVIGATION_SECTIONS.map((flow) => {
            const isAllowed = !flow.permission || canAccess(activeRole, flow.permission as any);
            const isCurrent = currentFlowId === flow.id;
            const isExpanded = !!expandedFlows[flow.id];
            const FlowIcon = flow.icon;

            return (
              <div
                key={flow.id}
                className={`rounded-2xl transition-all border ${
                  isCurrent
                    ? "bg-[#FAF9F5] dark:bg-[#071324] border-[#0A2540]/20 dark:border-[#FFD23F]/30 shadow-xs"
                    : "bg-white dark:bg-[#0A1931] border-[#E5E5DE] dark:border-[#1E3A5F] hover:border-[#0A2540]/20 dark:hover:border-[#FFD23F]/30"
                }`}
              >
                {/* Flow Section Header Button */}
                <button
                  onClick={() => {
                    if (isAllowed) {
                      toggleFlow(flow.id);
                      if (!isCurrent) {
                        handleSubSelect(flow.id, flow.subSections[0]?.id || "");
                      }
                    }
                  }}
                  disabled={!isAllowed}
                  className={`w-full p-3 rounded-2xl flex items-center justify-between text-left transition-all cursor-pointer ${
                    !isAllowed
                      ? "opacity-40 cursor-not-allowed"
                      : isCurrent
                      ? "text-[#0A2540] dark:text-[#FFD23F] font-black"
                      : "text-[#0A2540]/80 dark:text-white/80 hover:text-[#0A2540] dark:hover:text-white font-extrabold"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                        isCurrent
                          ? "bg-[#0A2540] text-white border-[#0A2540] shadow-xs"
                          : "bg-[#FAF9F5] text-[#0A2540] border-[#E5E5DE]"
                      }`}
                    >
                      <FlowIcon className="w-4 h-4" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono font-black text-[#0A2540]/50">
                          {flow.code}
                        </span>
                        <span className="text-sm font-black truncate">{flow.name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {flow.badge && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                        {flow.badge}
                      </span>
                    )}
                    {!isAllowed ? (
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                    ) : isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-[#0A2540]/60" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-[#0A2540]/40" />
                    )}
                  </div>
                </button>

                {/* Expanded: Flow Stated Statement + Sub-Items */}
                {isExpanded && isAllowed && (
                  <div className="px-2 pb-2.5 pt-1 space-y-1">
                    {/* Stated Sequence Pill */}
                    <div className="mx-1 mb-2 px-2.5 py-1.5 bg-white dark:bg-[#0A1931] border border-[#E5E5DE] dark:border-[#1E3A5F] rounded-xl text-[10px] font-mono font-bold text-[#0A2540]/70 dark:text-white/70 flex items-center gap-1.5 shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span className="truncate">{flow.flowStatement}</span>
                    </div>

                    {/* Sub-Items (One Level Deep) */}
                    <div className="space-y-1">
                      {flow.subSections.map((sub) => {
                        const isSubActive =
                          isCurrent &&
                          (activeSubSection === sub.id ||
                            (flow.id === "Oversight" && activeSubSection === "my-work" && sub.id === "my-work"));
                        const SubIcon = sub.icon;

                        return (
                          <button
                            key={sub.id}
                            onClick={() => handleSubSelect(flow.id, sub.id)}
                            className={`w-full px-3 py-2 rounded-xl text-xs flex items-center justify-between gap-2.5 transition-all cursor-pointer ${
                              isSubActive
                                ? "bg-[#0A2540] dark:bg-[#FFD23F] text-white dark:text-[#0A1931] font-extrabold shadow-sm"
                                : "text-[#0A2540]/75 dark:text-white/75 hover:bg-white dark:hover:bg-[#0F2137] hover:text-[#0A2540] dark:hover:text-white font-bold"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <SubIcon
                                className={`w-3.5 h-3.5 shrink-0 ${
                                  isSubActive ? "text-white dark:text-[#0A1931]" : "text-[#0A2540]/60 dark:text-white/60"
                                }`}
                              />
                              <span className="truncate">{sub.name}</span>
                            </div>

                            {sub.badge && (
                              <span
                                className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-black uppercase ${
                                  isSubActive
                                    ? "bg-white/20 dark:bg-[#0A1931]/20 text-white dark:text-[#0A1931]"
                                    : "bg-[#FAF9F5] dark:bg-[#071324] text-[#0A2540]/70 dark:text-white/70 border border-[#E5E5DE] dark:border-[#1E3A5F]"
                                }`}
                              >
                                {sub.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Control Bar */}
        <div className="p-3.5 border-t-2 border-[#E5E5DE] dark:border-[#1E3A5F] bg-[#FAF9F5] dark:bg-[#071324] space-y-3">
          {/* Active Role Selector (Simulator) */}
          <div className="bg-white dark:bg-[#0A1931] border border-[#E5E5DE] dark:border-[#1E3A5F] rounded-xl p-2.5 shadow-2xs">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#0A2540]/60 dark:text-white/60 mb-1 flex items-center justify-between">
              <span>Active Role Simulator</span>
              <UserCheck className="w-3 h-3 text-[#0A2540]/50 dark:text-white/50" />
            </div>
            <select
              value={activeRole}
              onChange={(e) => setActiveRole(e.target.value as RoleName)}
              className="w-full bg-[#FAF9F5] dark:bg-[#071324] border border-[#E5E5DE] dark:border-[#1E3A5F] rounded-lg px-2.5 py-1.5 text-xs font-black text-[#0A2540] dark:text-white focus:outline-none cursor-pointer"
            >
              {ALL_ROLES.map((role) => (
                <option key={role} value={role} className="dark:bg-[#0A1931]">
                  {role}
                </option>
              ))}
            </select>
          </div>

          {/* User Info & Settings / Logout */}
          <div className="flex items-center justify-between pt-1">
            <Link
              href="/account"
              className="flex items-center gap-2 text-xs font-bold text-[#0A2540] dark:text-white hover:underline"
            >
              <div className="w-7 h-7 rounded-full bg-[#0A2540] dark:bg-[#FFD23F] text-white dark:text-[#0A1931] flex items-center justify-center font-black text-[11px]">
                {activeRole.charAt(0)}
              </div>
              <span className="truncate max-w-[120px]">{activeRole}</span>
            </Link>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleSubSelect("Oversight", "admin")}
                title="Governance & Settings"
                className="w-7 h-7 rounded-lg border border-[#E5E5DE] dark:border-[#1E3A5F] bg-white dark:bg-[#0A1931] hover:bg-slate-100 dark:hover:bg-[#0F2137] flex items-center justify-center text-[#0A2540]/70 dark:text-white/70 hover:text-[#0A2540] dark:hover:text-white cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleLogout}
                title="Sign Out"
                className="w-7 h-7 rounded-lg border border-[#E5E5DE] dark:border-[#1E3A5F] bg-white dark:bg-[#0A1931] hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:border-rose-200 dark:hover:border-rose-800 flex items-center justify-center text-[#0A2540]/70 dark:text-white/70 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* 2. MOBILE DRAWER NAVIGATION                               */}
      {/* ========================================================= */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-[#0A2540]/60 dark:bg-black/70 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-full max-w-[320px] bg-white dark:bg-[#0A1931] flex flex-col justify-between transform transition-transform duration-200 ease-in-out lg:hidden shadow-2xl border-r-2 border-[#E5E5DE] dark:border-[#1E3A5F] ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex-1 flex flex-col min-h-0">
          {/* Mobile Top Header */}
          <div className="p-4 bg-[#FAF9F5] dark:bg-[#071324] border-b-2 border-[#E5E5DE] dark:border-[#1E3A5F] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white dark:bg-[#0F2137] rounded-xl flex items-center justify-center p-1.5 shadow-sm border border-[#0A2540]/15 dark:border-[#1E3A5F]">
                <Image
                  src="/logo-mark.png"
                  alt="CostView"
                  width={28}
                  height={28}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
              <div>
                <div className="text-base font-extrabold text-[#0A2540] dark:text-white">CostView</div>
                <div className="text-[10px] font-bold text-[#0A2540]/60 dark:text-white/60 uppercase tracking-wider">
                  5 Flows Navigation
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center justify-center text-[#0A2540]/70 dark:text-white/70 hover:text-[#0A2540] dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Search Button */}
          <div className="p-3 border-b border-[#E5E5DE] dark:border-[#1E3A5F] bg-white dark:bg-[#0A1931]">
            <button
              onClick={() => {
                if (onClose) onClose();
                if (onOpenSearch) onOpenSearch();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 bg-[#FAF9F5] dark:bg-[#071324] border border-[#E5E5DE] dark:border-[#1E3A5F] rounded-xl text-xs font-bold text-[#0A2540]/70 dark:text-white/70"
            >
              <Search className="w-4 h-4 text-[#0A2540]/50 dark:text-white/50" />
              <span>Search workflows or items...</span>
            </button>
          </div>

          {/* Mobile 5 Flows */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {NAVIGATION_SECTIONS.map((flow) => {
              const isAllowed = !flow.permission || canAccess(activeRole, flow.permission as any);
              const isCurrent = currentFlowId === flow.id;
              const isExpanded = !!expandedFlows[flow.id];
              const FlowIcon = flow.icon;

              return (
                <div
                  key={flow.id}
                  className={`rounded-xl border ${
                    isCurrent
                      ? "bg-[#FAF9F5] dark:bg-[#071324] border-[#0A2540]/20 dark:border-[#FFD23F]/30"
                      : "bg-white dark:bg-[#0A1931] border-[#E5E5DE] dark:border-[#1E3A5F]"
                  }`}
                >
                  <button
                    onClick={() => toggleFlow(flow.id)}
                    disabled={!isAllowed}
                    className={`w-full p-3 flex items-center justify-between text-left ${
                      !isAllowed ? "opacity-40" : "font-extrabold text-[#0A2540] dark:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <FlowIcon className="w-4 h-4 text-[#0A2540] dark:text-[#FFD23F]" />
                      <span className="text-sm font-black">{flow.name}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-[#0A2540]/60 dark:text-white/60" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-[#0A2540]/40 dark:text-white/40" />
                    )}
                  </button>

                  {isExpanded && isAllowed && (
                    <div className="px-2 pb-2 space-y-1">
                      <div className="px-2 py-1 bg-white dark:bg-[#0A1931] border border-[#E5E5DE] dark:border-[#1E3A5F] rounded-md text-[10px] font-mono font-bold text-[#0A2540]/70 dark:text-white/70 truncate">
                        {flow.flowStatement}
                      </div>

                      {flow.subSections.map((sub) => {
                        const isSubActive = isCurrent && activeSubSection === sub.id;
                        const SubIcon = sub.icon;

                        return (
                          <button
                            key={sub.id}
                            onClick={() => handleSubSelect(flow.id, sub.id)}
                            className={`w-full px-3 py-2 rounded-lg text-xs flex items-center justify-between ${
                              isSubActive
                                ? "bg-[#0A2540] dark:bg-[#FFD23F] text-white dark:text-[#0A1931] font-extrabold"
                                : "text-[#0A2540]/80 dark:text-white/80 font-bold hover:bg-white dark:hover:bg-[#0F2137]"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <SubIcon className="w-3.5 h-3.5" />
                              <span>{sub.name}</span>
                            </div>
                            {sub.badge && (
                              <span className="text-[9px] px-1 bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 rounded">
                                {sub.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Bottom User Area */}
        <div className="p-4 border-t-2 border-[#E5E5DE] dark:border-[#1E3A5F] bg-[#FAF9F5] dark:bg-[#071324] flex items-center justify-between">
          <div className="text-xs font-bold text-[#0A2540] dark:text-white">
            Logged as: <strong className="underline">{activeRole}</strong>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs font-extrabold text-rose-600 dark:text-rose-400 hover:underline"
          >
            Sign Out
          </button>
        </div>
      </aside>

      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />
    </>
  );
}
