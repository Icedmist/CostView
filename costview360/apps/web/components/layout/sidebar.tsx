"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  ClipboardList,
  Home,
  X,
  Lock,
  LogOut,
  BookOpen,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
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
  User,
  PanelLeftClose,
  PanelLeftOpen,
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
    id: "Contracts & Subcontractors",
    name: "Contracts & Subcontractors",
    code: "5.0",
    icon: Briefcase,
    permission: "Subcontractors",
    subSections: [
      { id: "contracts", name: "Subcontractor Ledger", code: "5.1", icon: Briefcase },
      { id: "claims", name: "10% Retention Escrow & Certs", code: "5.2", icon: Receipt },
      { id: "instructions", name: "Site Instructions Register", code: "5.3", icon: ScrollText },
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

interface SidebarProps {
  activeSection?: string;
  activeSubSection?: string;
  onSelectNav?: (section: string, subSection?: string) => void;
  // Legacy props compatibility
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({
  activeSection = "Command Center",
  activeSubSection = "telemetry",
  onSelectNav,
  activeTab,
  onSelectTab,
  open,
  onClose,
}: SidebarProps) {
  const { activeRole, setActiveRole, currentProject } = useApp();
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [userName, setUserName] = useState<string>("CostView User");
  const [userEmail, setUserEmail] = useState<string>("user@costview.ng");
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [subPanelCollapsed, setSubPanelCollapsed] = useState(false);
  const router = useRouter();

  // Handle compatibility mapping
  const currentSection = activeSection || "Command Center";
  const activePrimary = NAVIGATION_SECTIONS.find((s) => s.id === currentSection) || NAVIGATION_SECTIONS[0];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const demoRole = localStorage.getItem("costview_demo_role") || activeRole;
      const demoEmail = localStorage.getItem("costview_demo_email");

      const roleDisplayMap: Record<string, { name: string; email: string }> = {
        Admin: { name: "Adebayo Admin", email: "admin@costview.ng" },
        "Project Manager": { name: "Babatunde Adeyemi", email: "pm@costview.ng" },
        "Quantity Surveyor": { name: "Mrs. Nkechi", email: "qs@costview.ng" },
        Architect: { name: "David Okafor", email: "arch@costview.ng" },
        "Site Engineer": { name: "Engr. Tayo", email: "site@costview.ng" },
        "Procurement Officer": { name: "Chidi Procurement", email: "procure@costview.ng" },
        Accountant: { name: "Funke Accountant", email: "acct@costview.ng" },
        Storekeeper: { name: "Musa Storekeeper", email: "store@costview.ng" },
      };

      const mapped = roleDisplayMap[demoRole] || {
        name: `CostView (${demoRole})`,
        email: demoEmail || `${demoRole.toLowerCase().replace(/\s+/g, ".")}@costview.ng`,
      };

      setUserName(mapped.name);
      setUserEmail(mapped.email);
    }
  }, [activeRole]);

  const handleRoleChange = (newRole: RoleName) => {
    setActiveRole(newRole);
    if (typeof window !== "undefined") {
      localStorage.setItem("costview_demo_role", newRole);
      document.cookie = `costview_demo_role=${newRole}; path=/; max-age=604800; SameSite=Lax`;
    }
  };

  const handlePrimaryClick = (sectionId: string) => {
    const sec = NAVIGATION_SECTIONS.find((s) => s.id === sectionId);
    const firstSub = sec?.subSections[0]?.id || "";
    if (onSelectNav) {
      onSelectNav(sectionId, firstSub);
    } else if (onSelectTab) {
      onSelectTab(sectionId);
    }
    if (subPanelCollapsed) {
      setSubPanelCollapsed(false);
    }
  };

  const handleSubClick = (subId: string) => {
    if (onSelectNav) {
      onSelectNav(currentSection, subId);
    } else if (onSelectTab) {
      onSelectTab(subId);
    }
    if (onClose) {
      onClose();
    }
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("costview_demo_role");
      localStorage.removeItem("costview_demo_email");
      localStorage.removeItem("costview_last_active");
      sessionStorage.clear();
      document.cookie = "costview_demo_role=; path=/; max-age=0";
      window.location.href = "/login";
    }
  };

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-[#0A2540]/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Supabase-Style Dual-Rail Navigation Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* TIER 1: SUPABASE PRIMARY ICON RAIL (w-[68px], Bright Navy #0A2540) */}
        <div className="w-[68px] bg-[#0A2540] flex flex-col items-center justify-between py-4 border-r border-[#0A2540]/30 shrink-0 z-20 text-white select-none shadow-lg">
          {/* Top: Logo Block */}
          <div className="flex flex-col items-center gap-6">
            <Link
              href="/dashboard"
              title="CostView Home"
              className="w-11 h-11 bg-white text-[#0A2540] rounded-xl flex items-center justify-center font-black text-base shadow-md hover:scale-105 transition-transform"
            >
              CV
            </Link>

            {/* Primary Domain Icons */}
            <nav className="flex flex-col items-center gap-3">
              {NAVIGATION_SECTIONS.map((section) => {
                const Icon = section.icon;
                const isAllowed = !section.permission || canAccess(activeRole, section.permission as any);
                const isActive = currentSection === section.id;

                return (
                  <button
                    key={section.id}
                    onClick={() => isAllowed && handlePrimaryClick(section.id)}
                    disabled={!isAllowed}
                    title={`${section.code} ${section.name}${!isAllowed ? " (Restricted for your role)" : ""}`}
                    className={`relative w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer group ${
                      !isAllowed
                        ? "opacity-35 cursor-not-allowed text-white/40"
                        : isActive
                        ? "bg-white text-[#0A2540] shadow-md font-bold"
                        : "text-white/80 hover:bg-white/15 hover:text-white"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {section.badge && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-xs">
                        {section.badge}
                      </span>
                    )}
                    {/* Tooltip on hover */}
                    <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#0A2540] text-white text-xs font-bold rounded-lg shadow-xl whitespace-nowrap hidden group-hover:block z-50 pointer-events-none border border-white/20">
                      {section.code} {section.name}
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Actions on Primary Rail */}
          <div className="flex flex-col items-center gap-3">
            {/* User Guide Button */}
            <button
              onClick={() => setIsOnboardingOpen(true)}
              title="Interactive User Guide"
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <BookOpen className="w-5 h-5" />
            </button>

            {/* Account Quick Link */}
            <Link
              href="/account"
              title="My Account"
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-xs transition-colors border border-white/20"
            >
              <span>{initials}</span>
            </Link>
          </div>
        </div>

        {/* TIER 2: SUPABASE SECONDARY SUB-NAV PANEL (w-64, Milk/White Background) */}
        {!subPanelCollapsed && (
          <div className="w-64 bg-[#FAF9F5] border-r-2 border-[#E5E5DE] flex flex-col justify-between shrink-0 z-10 animate-in fade-in duration-150">
            {/* Sub-Nav Header */}
            <div>
              <div className="p-4 border-b-2 border-[#E5E5DE] bg-white flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#0A2540]/60">
                    {activePrimary.code} Domain
                  </div>
                  <div className="text-base font-extrabold text-[#0A2540] truncate leading-tight mt-0.5">
                    {activePrimary.name}
                  </div>
                </div>
                <button
                  onClick={() => setSubPanelCollapsed(true)}
                  title="Collapse Sub-Navigation"
                  className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-[#0A2540]/60 hover:text-[#0A2540]"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>

              {/* Sub-Sections List */}
              <div className="p-3 space-y-1.5 overflow-y-auto max-h-[calc(100vh-220px)]">
                {activePrimary.subSections.map((sub) => {
                  const SubIcon = sub.icon;
                  const isSubActive = activeSubSection === sub.id;

                  return (
                    <button
                      key={sub.id}
                      onClick={() => handleSubClick(sub.id)}
                      className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-left font-bold text-sm transition-all flex items-center justify-between group cursor-pointer ${
                        isSubActive
                          ? "bg-[#0A2540] text-white shadow-sm"
                          : "text-[#0A2540]/80 hover:bg-[#0A2540]/10 hover:text-[#0A2540]"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <SubIcon
                          className={`w-4 h-4 shrink-0 ${
                            isSubActive ? "text-white" : "text-[#0A2540]/60 group-hover:text-[#0A2540]"
                          }`}
                        />
                        <span className="truncate">{sub.name}</span>
                      </div>
                      <span
                        className={`text-[11px] font-mono font-bold shrink-0 ml-2 px-2 py-0.5 rounded ${
                          isSubActive
                            ? "bg-white/20 text-white"
                            : "bg-[#0A2540]/5 text-[#0A2540]/70"
                        }`}
                      >
                        {sub.code}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sub-Nav Footer: Role & Simulator */}
            <div className="p-3.5 border-t-2 border-[#E5E5DE] bg-white space-y-3">
              {/* Active User Card */}
              <div className="relative">
                <div
                  onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#FAF9F5] border border-[#E5E5DE] cursor-pointer transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#0A2540] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-extrabold text-[#0A2540] truncate">{userName}</div>
                    <div className="text-[11px] font-semibold text-[#0A2540]/70 truncate">{activeRole}</div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#0A2540]/60 shrink-0" />
                </div>

                {accountMenuOpen && (
                  <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border-2 border-[#E5E5DE] rounded-xl shadow-xl p-2 z-50">
                    <Link
                      href="/account"
                      onClick={() => setAccountMenuOpen(false)}
                      className="px-3 py-2.5 rounded-lg text-xs font-bold text-[#0A2540] hover:bg-[#FAF9F5] flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-[#0A2540]" />
                      <span>My Account & Profile</span>
                    </Link>
                    <div
                      onClick={() => {
                        setAccountMenuOpen(false);
                        handlePrimaryClick("Administration");
                        handleSubClick("settings");
                      }}
                      className="px-3 py-2.5 rounded-lg text-xs font-bold text-[#0A2540] hover:bg-[#FAF9F5] flex items-center gap-2 cursor-pointer"
                    >
                      <Settings className="w-4 h-4 text-[#0A2540]/70" />
                      <span>Workspace Settings</span>
                    </div>
                    <div className="h-[1px] bg-[#E5E5DE] my-1" />
                    <div
                      onClick={() => {
                        setAccountMenuOpen(false);
                        handleLogout();
                      }}
                      className="px-3 py-2.5 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Persona Switcher */}
              <div className="p-2.5 bg-[#FAF9F5] border border-[#E5E5DE] rounded-xl">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#0A2540]/70 mb-1.5 flex items-center justify-between">
                  <span>Simulator Persona</span>
                </div>
                <select
                  value={activeRole}
                  onChange={(e) => handleRoleChange(e.target.value as RoleName)}
                  className="w-full h-8 text-xs font-bold bg-white text-[#0A2540] border border-[#E5E5DE] rounded-lg px-2 focus:outline-none cursor-pointer"
                >
                  {ALL_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Collapsed Sub-Nav Re-open Handle */}
        {subPanelCollapsed && (
          <button
            onClick={() => setSubPanelCollapsed(false)}
            title="Expand Sub-Navigation"
            className="hidden lg:flex items-center justify-center w-5 bg-[#FAF9F5] hover:bg-white border-r-2 border-[#E5E5DE] text-[#0A2540]/60 hover:text-[#0A2540] cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </aside>

      <OnboardingModal isOpen={isOnboardingOpen} onClose={() => setIsOnboardingOpen(false)} />
    </>
  );
}
