"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/app/providers";
import type { RoleName } from "@/lib/supabase/database.types";
import {
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
} from "lucide-react";
import { canAccess } from "@/lib/auth/permissions";
import { OnboardingModal } from "@/components/onboarding/onboarding-modal";

interface NavItem {
  name: string;
  icon: React.ElementType;
  permission?: string;
  badge?: string;
}

const SITE_OPS_NAV: NavItem[] = [
  { name: "Budget & BOQ", icon: Calculator, permission: "Budget" },
  { name: "Procurement", icon: ShoppingCart, permission: "Procurement", badge: "3" },
  { name: "Materials & Stock", icon: Boxes, permission: "Materials" },
  { name: "Labour & Muster", icon: Users, permission: "Labour" },
  { name: "Site Progress & Diary", icon: TrendingUp, permission: "Progress" },
  { name: "Subcontractors", icon: Briefcase, permission: "Subcontractors" },
  { name: "Variations & Claims", icon: FileSpreadsheet, permission: "Variations" },
];

const COMMERCIAL_NAV: NavItem[] = [
  { name: "Feasibility & Land", icon: Building2 },
  { name: "Development Costs", icon: Calculator },
  { name: "Tender & Estimating", icon: Scale },
  { name: "Valuation & Certs", icon: Receipt },
  { name: "Claims & EOT", icon: FileCheck },
  { name: "Sales & Receivables", icon: DollarSign },
  { name: "Project Margin", icon: TrendingUp, badge: "LIVE" },
];

const BOTTOM_NAV: NavItem[] = [
  { name: "Reports Studio", icon: ClipboardList, permission: "Reports" },
  { name: "Admin & Roles", icon: ShieldCheck, permission: "Admin" },
  { name: "Settings", icon: Settings },
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

export function Sidebar({
  activeTab,
  onSelectTab,
  open = true,
  onClose,
}: {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  open?: boolean;
  onClose?: () => void;
}) {
  const { activeMode, setActiveMode, activeRole, setActiveRole } = useApp();
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [userName, setUserName] = useState(DEMO_USER_NAMES[activeRole] || "Abubakar Alkali");

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

  const navItems = activeMode === "site" ? SITE_OPS_NAV : COMMERCIAL_NAV;
  const isHomeActive = activeTab === "Dashboard" || activeTab === "Command Center";

  const handleSelect = (tab: string) => {
    onSelectTab(tab);
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
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-[300px] lg:w-[300px] bg-white/80 backdrop-blur-2xl text-slate-900 border-r border-slate-200/80 flex flex-col h-screen select-none shrink-0 transition-transform duration-300 shadow-[1px_0_12px_rgba(0,0,0,0.02)] ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } overflow-hidden`}
      >
        {/* Frozen Header */}
        <div className="shrink-0 p-3.5 pb-0 bg-white/90 backdrop-blur-md">
          {/* Brand Row */}
          <div className="flex items-center justify-between px-2 pt-1 pb-2.5">
            <Link href="/" className="group flex items-baseline select-none">
              <span className="text-[22px] font-extrabold text-slate-900 tracking-tight">CostView</span>
              <span className="text-[22px] font-bold text-[#0067c0] ml-1 tracking-tight">360</span>
            </Link>
            <button
              onClick={onClose}
              className="lg:hidden w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="px-2 -mt-1.5 mb-3 text-[10.5px] font-semibold text-slate-400 uppercase tracking-wider">
            Construction Cost Intelligence
          </div>

          {/* Segmented Mode Toggle */}
          <div className="flex bg-slate-100/90 p-1 rounded-xl mb-3 border border-slate-200/50">
            <button
              onClick={() => setActiveMode("site")}
              className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg transition-all ${
                activeMode === "site"
                  ? "bg-white text-[#0067c0] shadow-xs font-bold border border-slate-200/40"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Site Operations
            </button>
            <button
              onClick={() => setActiveMode("commercial")}
              className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg transition-all ${
                activeMode === "commercial"
                  ? "bg-white text-[#0067c0] shadow-xs font-bold border border-slate-200/40"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Commercial
            </button>
          </div>

          {/* Primary Home Nav Item */}
          <div className="px-1">
            <button
              onClick={() => handleSelect(activeMode === "site" ? "Dashboard" : "Command Center")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isHomeActive
                  ? "bg-blue-50/90 text-[#0067c0] font-bold shadow-xs border border-blue-100/80"
                  : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900"
              }`}
            >
              <Home className={`w-4 h-4 ${isHomeActive ? "text-[#0067c0]" : "text-slate-400"}`} />
              <span>Home Command</span>
            </button>
          </div>

          <div className="h-[1px] bg-slate-100 mx-1 my-2.5" />
        </div>

        {/* Scrollable Region */}
        <div className="flex-1 min-h-0 overflow-y-auto px-3 pb-3 space-y-3">
          {/* User Account Card with Dropdown */}
          <div className="relative">
            <div
              onClick={() => setAccountMenuOpen((v) => !v)}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-100/70 cursor-pointer transition-all border border-slate-200/70 bg-white/70 shadow-xs"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0067c0] to-[#0284c7] flex items-center justify-center text-white font-bold text-xs shadow-xs shrink-0">
                <span>{initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate">{userName}</div>
                <div className="text-[11px] text-slate-500 truncate font-medium">{activeRole}</div>
              </div>
            </div>

            {accountMenuOpen && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-2xl shadow-glass p-2 z-50 animate-in fade-in zoom-in-95">
                <div
                  onClick={() => {
                    setAccountMenuOpen(false);
                    handleSelect("Settings");
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 hover:bg-slate-100/80 cursor-pointer"
                >
                  Settings
                </div>
                <div
                  onClick={() => {
                    setAccountMenuOpen(false);
                    setIsOnboardingOpen(true);
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 hover:bg-slate-100/80 cursor-pointer"
                >
                  Help &amp; User Guide
                </div>
                <div className="h-[1px] bg-slate-100 my-1" />
                <div
                  onClick={() => {
                    setAccountMenuOpen(false);
                    handleLogout();
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 cursor-pointer flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </div>
              </div>
            )}
          </div>

          {/* Role Simulator Pill */}
          <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-2.5 shadow-xs">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 flex items-center justify-between mb-1.5 px-1">
              <span>Simulate Role</span>
              <span className="text-[#0067c0] bg-blue-50 px-2 py-0.5 rounded-full text-[9.5px] font-bold border border-blue-200/60">
                RBAC
              </span>
            </div>
            <select
              value={activeRole}
              onChange={(e) => setActiveRole(e.target.value as RoleName)}
              className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#0067c0] cursor-pointer shadow-xs"
            >
              {ALL_ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {activeMode === "site" ? "Site Operations Modules" : "Commercial Lifecycle"}
            </div>

            {navItems.map((item) => {
              const allowed = !item.permission || canAccess(activeRole, item.permission as any);
              const isActive = activeTab === item.name;

              return (
                <button
                  key={item.name}
                  onClick={() => allowed && handleSelect(item.name)}
                  disabled={!allowed}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    !allowed
                      ? "opacity-40 cursor-not-allowed text-slate-400"
                      : isActive
                      ? "bg-blue-50/90 text-[#0067c0] font-bold shadow-xs border border-blue-100/80"
                      : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <item.icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#0067c0]" : "text-slate-400"}`} />
                    <span className="truncate">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {!allowed ? (
                      <Lock className="w-3 h-3 text-slate-400" />
                    ) : item.badge ? (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-[#0067c0] text-white rounded-full shadow-xs">
                        {item.badge}
                      </span>
                    ) : null}
                  </div>
                </button>
              );
            })}

            <div className="h-[1px] bg-slate-100 my-2.5 mx-1" />

            <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              System Governance
            </div>

            {BOTTOM_NAV.map((item) => {
              const allowed = !item.permission || canAccess(activeRole, item.permission as any);
              const isActive = activeTab === item.name;

              return (
                <button
                  key={item.name}
                  onClick={() => allowed && handleSelect(item.name)}
                  disabled={!allowed}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    !allowed
                      ? "opacity-40 cursor-not-allowed text-slate-400"
                      : isActive
                      ? "bg-blue-50/90 text-[#0067c0] font-bold shadow-xs border border-blue-100/80"
                      : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <item.icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#0067c0]" : "text-slate-400"}`} />
                    <span className="truncate">{item.name}</span>
                  </div>
                  {!allowed && <Lock className="w-3 h-3 text-slate-400" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Guide Hub Trigger */}
        <div className="p-3 border-t border-slate-200/80 bg-white/90 backdrop-blur-md">
          <button
            onClick={() => setIsOnboardingOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold shadow-xs transition-all"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#0067c0]" />
            <span>Interactive User Guide</span>
          </button>
        </div>
      </aside>

      <OnboardingModal isOpen={isOnboardingOpen} onClose={() => setIsOnboardingOpen(false)} />
    </>
  );
}
