"use client";

import React, { useState } from "react";
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
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Budget & BOQ", icon: Calculator, permission: "Budget" },
  { name: "Procurement", icon: ShoppingCart, permission: "Procurement", badge: "3" },
  { name: "Materials & Stock", icon: Boxes, permission: "Materials" },
  { name: "Labour & Muster", icon: Users, permission: "Labour" },
  { name: "Site Progress & Diary", icon: TrendingUp, permission: "Progress" },
  { name: "Subcontractors", icon: Briefcase, permission: "Subcontractors" },
  { name: "Variations & Claims", icon: FileSpreadsheet, permission: "Variations" },
  { name: "Reports Studio", icon: ClipboardList, permission: "Reports" },
  { name: "Admin & Roles", icon: ShieldCheck, permission: "Admin" },
  { name: "Settings", icon: Settings },
];

const COMMERCIAL_NAV: NavItem[] = [
  { name: "Command Center", icon: LayoutDashboard },
  { name: "Feasibility & Land", icon: Building2 },
  { name: "Development Costs", icon: Calculator },
  { name: "Tender & Estimating", icon: Scale },
  { name: "Valuation & Certs", icon: Receipt },
  { name: "Claims & EOT", icon: FileCheck },
  { name: "Sales & Receivables", icon: DollarSign },
  { name: "Project Margin", icon: TrendingUp, badge: "LIVE" },
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
  const navItems = activeMode === "site" ? SITE_OPS_NAV : COMMERCIAL_NAV;

  const handleSelect = (tab: string) => {
    onSelectTab(tab);
    if (onClose) onClose(); // close drawer on mobile
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-navy-800/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-[300px] lg:w-[300px] bg-navy-800 text-white border-r-[3px] border-navy-800 flex flex-col h-screen lg:h-screen select-none shrink-0 transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } overflow-y-auto`}
      >
      {/* Brand Header - Brutalist */}
      <div className="p-5 border-b-[3px] border-white/10 shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-mustard-400 border-2 border-white flex items-center justify-center font-black text-navy-800 text-sm shadow-[3px_3px_0px_0px_white] shrink-0">
              <span className="font-display tracking-tighter">CV</span>
            </div>
            <div>
              <div className="font-black text-white text-[16px] leading-none tracking-tighter">
                CostView
              </div>
              <div className="text-[11px] font-mono font-bold tracking-[0.16em] text-white/50 uppercase">Analyse · Plan · Build</div>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden w-9 h-9 bg-white/10 border border-white/20 flex items-center justify-center">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
        <Link
          href="/"
          className="mt-4 flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-mustard-400 hover:text-white border-2 border-mustard-400/30 px-3 py-1.5 w-fit"
        >
          <Home className="w-4 h-4" /> Back to Landing
        </Link>
      </div>

      {/* Mode Switcher - Brutalist */}
      <div className="px-4 pt-4 shrink-0">
        <div className="bg-navy-900 border-2 border-white/20 p-1 flex gap-1">
          <button
            onClick={() => setActiveMode("site")}
            className={`flex-1 py-2.5 px-2 font-black text-xs uppercase tracking-wide border-2 transition-all ${
              activeMode === "site"
                ? "bg-mustard-400 text-navy-800 border-navy-800 shadow-[3px_3px_0px_0px_white]"
                : "bg-transparent text-white/60 border-transparent hover:text-white hover:bg-white/10"
            }`}
          >
            Site Ops
          </button>
          <button
            onClick={() => setActiveMode("commercial")}
            className={`flex-1 py-2.5 px-2 font-black text-xs uppercase tracking-wide border-2 transition-all ${
              activeMode === "commercial"
                ? "bg-mustard-400 text-navy-800 border-navy-800 shadow-[3px_3px_0px_0px_white]"
                : "bg-transparent text-white/60 border-transparent hover:text-white hover:bg-white/10"
            }`}
          >
            Commercial
          </button>
        </div>
      </div>

      {/* Role Preview Switcher */}
      <div className="px-4 pt-4 shrink-0">
        <div className="bg-white border-2 border-navy-800 p-3 shadow-[4px_4px_0px_0px_#C9A227]">
          <div className="text-xs uppercase font-black tracking-widest text-navy-800 flex items-center justify-between mb-2">
            <span>Simulate Role</span>
            <span className="bg-navy-800 text-mustard-400 px-2 py-1 text-[10px]">RBAC ACTIVE</span>
          </div>
          <select
            value={activeRole}
            onChange={(e) => setActiveRole(e.target.value as RoleName)}
            className="w-full bg-cream-100 border-2 border-navy-800 px-3 py-2.5 text-sm font-black text-navy-800 focus:outline-none cursor-pointer"
          >
            {ALL_ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-1.5">
        <div className="text-xs font-black uppercase tracking-[0.14em] text-mustard-400 px-2 py-2 border-l-[4px] border-mustard-400 mb-3">
          {activeMode === "site" ? "Site Operations" : "Commercial Modules"}
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;
          const hasAccess = !item.permission || canAccess(activeRole, item.permission as any);
          return (
            <button
              key={item.name}
              onClick={() => hasAccess && handleSelect(item.name)}
              disabled={!hasAccess}
              title={!hasAccess ? `Restricted — ${activeRole} lacks ${item.permission}` : undefined}
              className={`w-full flex items-center justify-between px-3 py-3 text-sm font-black uppercase tracking-wide border-2 transition-all ${
                !hasAccess
                  ? "bg-white/5 text-white/30 border-transparent cursor-not-allowed"
                  : isActive
                  ? "bg-mustard-400 text-navy-800 border-navy-800 shadow-[4px_4px_0px_0px_white]"
                  : "bg-transparent text-white/70 border-transparent hover:text-white hover:bg-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-8 h-8 border-2 flex items-center justify-center shrink-0 ${!hasAccess ? "bg-white/5 border-white/10 text-white/20" : isActive ? "bg-navy-800 border-navy-800 text-white" : "bg-white/10 border-white/20 text-white"}`}>
                  {hasAccess ? <Icon className="w-4 h-4" /> : <Lock className="w-3.5 h-3.5" />}
                </span>
                <span className="normal-case font-black tracking-tight text-[13px] text-left">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                {!hasAccess && <Lock className="w-3 h-3 text-white/20" />}
                {item.badge && hasAccess && (
                  <span className={`text-xs px-2 py-1 font-mono font-black border-2 shrink-0 ${isActive ? "bg-navy-800 text-white border-navy-800" : "bg-mustard-400 text-navy-800 border-navy-800"}`}>
                    {item.badge}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </nav>

      {/* User Footer Profile */}
      <div className="p-4 border-t-[3px] border-white/10 bg-navy-900 shrink-0 space-y-2.5">
        <button
          onClick={() => setIsOnboardingOpen(true)}
          className="w-full py-2 bg-mustard-400 border-2 border-navy-800 text-navy-800 font-black uppercase text-xs flex items-center justify-center gap-2 hover:bg-mustard-500 shadow-[2px_2px_0px_0px_white] transition-transform active:translate-x-0.5 active:translate-y-0.5"
        >
          <BookOpen className="w-4 h-4" /> User Guide & Manual
        </button>
        <button
          onClick={async () => {
            const { createClient } = await import("@/lib/supabase/client");
            const supabase = createClient();
            await supabase.auth.signOut();
            localStorage.removeItem("costview_demo_role");
            sessionStorage.clear();
            window.location.href = "/login";
          }}
          className="w-full py-2 bg-white border-2 border-navy-800 font-black uppercase text-xs flex items-center justify-center gap-2 hover:bg-cream-100"
        >
          <LogOut className="w-4 h-4" /> Log out — 2h / tab close
        </button>
        <div className="flex items-center gap-3 bg-white border-2 border-navy-800 p-3 shadow-[3px_3px_0px_0px_#C9A227]">
          <div className="w-10 h-10 bg-navy-800 border-2 border-navy-800 flex items-center justify-center text-sm font-black text-white">
            IM
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-navy-800 truncate">icedmist</p>
            <p className="text-xs font-bold text-navy-800/60 truncate uppercase tracking-wide">{activeRole}</p>
          </div>
          <div className="w-3 h-3 bg-green-500 border-2 border-navy-800 rounded-full animate-pulse" />
        </div>
      </div>
    </aside>

    <OnboardingModal
      isOpen={isOnboardingOpen}
      onClose={() => setIsOnboardingOpen(false)}
    />
    </>
  );
}
