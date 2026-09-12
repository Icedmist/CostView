"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/app/providers";
import type { RoleName } from "@/lib/supabase/database.types";
import {
  LayoutDashboard,
  Calculator,
  ShoppingCart,
  Boxes,
  Users,
  TrendingUp,
  Briefcase,
  FileSpreadsheet,
  Settings,
  ShieldCheck,
  Building2,
  Receipt,
  FileCheck,
  Scale,
  DollarSign,
  ClipboardList,
  Home,
  X,
  Lock,
  LogOut,
  BookOpen,
  ChevronDown,
  ChevronRight,
  BadgeCheck,
  Clock,
  Truck,
  CreditCard,
  Calendar,
  Image as ImageIcon,
  FileCheck2,
  AlertCircle,
  HardHat,
  ScrollText,
  Sliders,
  History,
  UserCheck,
  Activity,
  AlertTriangle,
  FolderSync,
} from "lucide-react";
import { canAccess } from "@/lib/auth/permissions";
import { OnboardingModal } from "@/components/onboarding/onboarding-modal";

export interface SubNavSection {
  id: string;
  name: string;
  code: string;
  icon: React.ElementType;
  badge?: string;
}

export interface PrimarySection {
  id: string;
  name: string;
  code: string;
  icon: React.ElementType;
  permission?: string;
  badge?: string;
  subSections: SubNavSection[];
}

export const NAVIGATION_SECTIONS: PrimarySection[] = [
  {
    id: "Command Center",
    name: "Command Center",
    code: "1.0",
    icon: LayoutDashboard,
    subSections: [
      { id: "telemetry", name: "Telemetry & Executive KPIs", code: "1.1", icon: Activity },
      { id: "alerts", name: "Attention & Variance Alerts", code: "1.2", icon: AlertTriangle, badge: "3" },
      { id: "health", name: "Baseline Financial Health", code: "1.3", icon: TrendingUp },
    ],
  },
  {
    id: "Budget & BOQ",
    name: "Budget & BOQ Master",
    code: "2.0",
    icon: Calculator,
    permission: "Budget",
    subSections: [
      { id: "boq", name: "BOQ Master Register", code: "2.1", icon: Calculator },
      { id: "revisions", name: "Rate Revisions & Deltas", code: "2.2", icon: FileSpreadsheet },
      { id: "import", name: "CSV Import & Export", code: "2.3", icon: FolderSync },
    ],
  },
  {
    id: "Procurement",
    name: "Procurement Lifecycle",
    code: "3.0",
    icon: ShoppingCart,
    permission: "Procurement",
    badge: "3",
    subSections: [
      { id: "match", name: "Three-Way Match Gate", code: "3.1", icon: BadgeCheck },
      { id: "requisitions", name: "Material Requisitions", code: "3.2", icon: Clock, badge: "3" },
      { id: "enquiries", name: "Supplier Enquiries & Quotes", code: "3.3", icon: Truck },
      { id: "invoices", name: "Invoices & Credits", code: "3.4", icon: Receipt },
      { id: "payments", name: "Disbursement Ledger", code: "3.5", icon: CreditCard },
    ],
  },
  {
    id: "Site Operations",
    name: "Site Operations",
    code: "4.0",
    icon: HardHat,
    permission: "Progress",
    subSections: [
      { id: "diary", name: "Daily Site Diary & Log", code: "4.1", icon: Calendar },
      { id: "stock", name: "Materials & Stock Ledger", code: "4.2", icon: Boxes },
      { id: "labour", name: "Labour Muster & Productivity", code: "4.3", icon: Users },
      { id: "photos", name: "Progress Photos & Proof", code: "4.4", icon: ImageIcon },
      { id: "inspections", name: "QA/QC Inspections & Tests", code: "4.5", icon: FileCheck2 },
      { id: "safety", name: "HSE Safety Observations", code: "4.6", icon: HardHat },
    ],
  },
  {
    id: "Commercial & Contracts",
    name: "Commercial & Contracts",
    code: "5.0",
    icon: Scale,
    permission: "Subcontractors",
    subSections: [
      { id: "contracts", name: "Subcontractor Ledger", code: "5.1", icon: Briefcase },
      { id: "claims", name: "10% Retention Escrow & Certs", code: "5.2", icon: Receipt },
      { id: "instructions", name: "Site Instructions Register", code: "5.3", icon: ScrollText },
      { id: "feasibility", name: "Project Margin & Feasibility", code: "5.4", icon: DollarSign, badge: "LIVE" },
    ],
  },
  {
    id: "Administration",
    name: "Administration & Security",
    code: "6.0",
    icon: ShieldCheck,
    permission: "Admin",
    subSections: [
      { id: "users", name: "User & Role Customization", code: "6.1", icon: UserCheck },
      { id: "matrix", name: "Role Permissions Matrix", code: "6.2", icon: Sliders },
      { id: "audit", name: "Immutable Audit Trail", code: "6.3", icon: History },
      { id: "settings", name: "Workspace & Project Config", code: "6.4", icon: Settings },
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

const DEMO_USER_NAMES: Record<string, string> = {
  Admin: "Adebayo Admin",
  "Project Manager": "Babatunde Adeyemi",
  "Quantity Surveyor": "Mrs. Nkechi",
  Architect: "David Okafor",
  "Site Engineer": "Engr. Tayo",
  "Procurement Officer": "Chidi Procurement",
  Accountant: "Funke Accountant",
  Storekeeper: "Musa Storekeeper",
};

interface SidebarProps {
  activeSection?: string;
  activeSubSection?: string;
  onSelectNav?: (section: string, subSection?: string) => void;
  // Backwards compatibility props
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({
  activeSection,
  activeSubSection,
  onSelectNav,
  activeTab,
  onSelectTab,
  open = true,
  onClose,
}: SidebarProps) {
  const { activeRole, setActiveRole } = useApp();
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [userName, setUserName] = useState(DEMO_USER_NAMES[activeRole] || "Abubakar Alkali");

  // Resolve current active section
  const currentActiveSection = activeSection || (activeTab === "Dashboard" ? "Command Center" : activeTab) || "Command Center";
  const currentActiveSub = activeSubSection || "";

  // Track expanded sections: default to activeSection
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    [currentActiveSection]: true,
  });

  // Keep active section expanded
  useEffect(() => {
    if (currentActiveSection) {
      setExpandedSections((prev) => ({ ...prev, [currentActiveSection]: true }));
    }
  }, [currentActiveSection]);

  useEffect(() => {
    import("@/lib/supabase/client").then(({ createClient }) => {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => {
        const metaName = data.user?.user_metadata?.full_name;
        if (metaName) {
          setUserName(metaName);
        } else if (DEMO_USER_NAMES[activeRole]) {
          setUserName(DEMO_USER_NAMES[activeRole]);
        }
      });
    });
  }, [activeRole]);

  const initials =
    userName
      .split(" ")
      .map((p) => p[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "CV";

  const handleSectionClick = (sec: PrimarySection) => {
    const isCurrentlyExpanded = !!expandedSections[sec.id];
    setExpandedSections((prev) => ({ ...prev, [sec.id]: !isCurrentlyExpanded }));

    // Activate the first sub-section if not already on this section
    if (currentActiveSection !== sec.id) {
      const firstSub = sec.subSections[0]?.id;
      if (onSelectNav) {
        onSelectNav(sec.id, firstSub);
      } else if (onSelectTab) {
        onSelectTab(sec.id);
      }
    }
  };

  const handleSubSectionClick = (secId: string, subId: string) => {
    if (onSelectNav) {
      onSelectNav(secId, subId);
    } else if (onSelectTab) {
      onSelectTab(secId);
    }
    if (onClose) onClose();
  };

  const handleLogout = async () => {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    await supabase.auth.signOut();
    localStorage.removeItem("costview_demo_role");
    localStorage.removeItem("costview_demo_email");
    localStorage.removeItem("costview_last_active");
    document.cookie = "costview_demo_role=; path=/; max-age=0";
    sessionStorage.clear();
    window.location.href = "/login";
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-[#0A1931]/50 backdrop-blur-xs z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-[320px] lg:w-[320px] bg-white text-slate-900 border-r border-slate-200 flex flex-col h-screen select-none shrink-0 transition-transform duration-300 shadow-sm ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } overflow-hidden`}
      >
        {/* Brand Header */}
        <div className="shrink-0 p-4 pb-3 bg-white border-b border-slate-100">
          <div className="flex items-center justify-between px-1">
            <Link href="/" className="group flex items-baseline select-none">
              <span className="text-2xl font-black text-[#0A1931] tracking-tight">CostView</span>
              <span className="text-2xl font-extrabold text-[#D4A017] ml-1 tracking-tight">360</span>
            </Link>
            <button
              onClick={onClose}
              className="lg:hidden w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="px-1 text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">
            Construction Cost Intelligence
          </div>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 min-h-0 overflow-y-auto p-3.5 space-y-3">
          {/* User Profile Card */}
          <div className="relative">
            <div
              onClick={() => setAccountMenuOpen((v) => !v)}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-all border border-slate-200 bg-white shadow-xs"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0A1931] to-[#1E3A5F] flex items-center justify-center text-white font-bold text-sm shadow-xs shrink-0">
                <span>{initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-slate-900 truncate">{userName}</div>
                <div className="text-xs text-slate-500 truncate font-semibold">{activeRole}</div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
            </div>

            {accountMenuOpen && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50 animate-in fade-in">
                <div
                  onClick={() => {
                    setAccountMenuOpen(false);
                    handleSubSectionClick("Administration", "settings");
                  }}
                  className="px-3 py-2.5 rounded-lg text-xs font-bold text-slate-800 hover:bg-slate-100 cursor-pointer flex items-center gap-2"
                >
                  <Settings className="w-4 h-4 text-slate-500" />
                  <span>Workspace Settings</span>
                </div>
                <div
                  onClick={() => {
                    setAccountMenuOpen(false);
                    setIsOnboardingOpen(true);
                  }}
                  className="px-3 py-2.5 rounded-lg text-xs font-bold text-slate-800 hover:bg-slate-100 cursor-pointer flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-[#D4A017]" />
                  <span>Interactive User Guide</span>
                </div>
                <div className="h-[1px] bg-slate-100 my-1" />
                <div
                  onClick={() => {
                    setAccountMenuOpen(false);
                    handleLogout();
                  }}
                  className="px-3 py-2.5 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 cursor-pointer flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </div>
              </div>
            )}
          </div>

          {/* Role Simulator Selector */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 shadow-xs">
            <div className="text-[11px] uppercase font-bold tracking-wider text-slate-500 flex items-center justify-between mb-1.5 px-0.5">
              <span>Active Simulator Role</span>
              <span className="text-[#0A1931] bg-blue-100/70 px-2 py-0.5 rounded-md text-[10px] font-bold border border-blue-200">
                RBAC LIVE
              </span>
            </div>
            <select
              value={activeRole}
              onChange={(e) => setActiveRole(e.target.value as RoleName)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-[#0A1931] focus:outline-none focus:border-[#0A1931] cursor-pointer shadow-xs"
            >
              {ALL_ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          {/* Navigation Section Tree */}
          <nav className="space-y-1.5 pt-1">
            <div className="px-2 py-1 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
              Modules &amp; Sub-Navigation
            </div>

            {NAVIGATION_SECTIONS.map((section) => {
              const allowed = !section.permission || canAccess(activeRole, section.permission as any);
              const isSectionActive = currentActiveSection === section.id;
              const isExpanded = !!expandedSections[section.id];

              return (
                <div key={section.id} className="space-y-1">
                  {/* Primary Section Button */}
                  <button
                    onClick={() => allowed && handleSectionClick(section)}
                    disabled={!allowed}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                      !allowed
                        ? "opacity-40 cursor-not-allowed text-slate-400"
                        : isSectionActive
                        ? "bg-[#0A1931] text-white shadow-sm border border-[#0A1931]"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <section.icon
                        className={`w-5 h-5 shrink-0 ${
                          isSectionActive ? "text-[#D4A017]" : "text-slate-500"
                        }`}
                      />
                      <span className="truncate">{section.name}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {!allowed ? (
                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <>
                          {section.badge && (
                            <span
                              className={`px-2 py-0.5 text-xs font-extrabold rounded-full ${
                                isSectionActive
                                  ? "bg-[#D4A017] text-[#0A1931]"
                                  : "bg-blue-100 text-[#0A1931]"
                              }`}
                            >
                              {section.badge}
                            </span>
                          )}
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                          )}
                        </>
                      )}
                    </div>
                  </button>

                  {/* Expanding Sub-Nav Tree */}
                  {allowed && isExpanded && (
                    <div className="pl-4 pr-1 py-1 space-y-1 border-l-2 border-[#0A1931]/20 ml-5 animate-in slide-in-from-top-2 duration-200">
                      {section.subSections.map((sub) => {
                        const isSubActive =
                          isSectionActive && (currentActiveSub === sub.id || (!currentActiveSub && section.subSections[0]?.id === sub.id));

                        return (
                          <button
                            key={sub.id}
                            onClick={() => handleSubSectionClick(section.id, sub.id)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                              isSubActive
                                ? "bg-[#0A1931] text-white font-bold shadow-xs border border-[#0A1931]"
                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 truncate">
                              <sub.icon
                                className={`w-3.5 h-3.5 shrink-0 ${
                                  isSubActive ? "text-[#D4A017]" : "text-slate-400"
                                }`}
                              />
                              <span className="truncate">{sub.name}</span>
                            </div>

                            {sub.badge && (
                              <span
                                className={`px-1.5 py-0.2 text-[10px] font-extrabold rounded-full ${
                                  isSubActive
                                    ? "bg-[#D4A017] text-[#0A1931]"
                                    : "bg-slate-200 text-slate-700"
                                }`}
                              >
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
          </nav>
        </div>

        {/* User Guide Footer Hub */}
        <div className="p-3.5 border-t border-slate-200 bg-white">
          <button
            onClick={() => setIsOnboardingOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-[#D4A017]" />
            <span>Interactive User Operations Guide</span>
          </button>
        </div>
      </aside>

      <OnboardingModal isOpen={isOnboardingOpen} onClose={() => setIsOnboardingOpen(false)} />
    </>
  );
}
