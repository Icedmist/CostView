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
  const navItems = activeMode === "site" ? SITE_OPS_NAV : COMMERCIAL_NAV;
  const isHomeActive = activeTab === "Dashboard" || activeTab === "Command Center";

  const handleSelect = (tab: string) => {
    onSelectTab(tab);
    if (onClose) onClose(); // close drawer on mobile
  };

  const handleLogout = async () => {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    await supabase.auth.signOut();
    localStorage.removeItem("costview_demo_role");
    sessionStorage.clear();
    window.location.href = "/login";
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-[310px] lg:w-[310px] bg-[#f3f3f3]/90 backdrop-blur-xl text-[#1b1b1b] border-r border-[#e5e5e5] flex flex-col h-screen select-none shrink-0 transition-transform duration-300 shadow-[2px_0_12px_rgba(0,0,0,0.03)] ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } overflow-hidden`}
      >
        {/* Frozen Header */}
        <div className="shrink-0 p-3 pb-0 bg-[#f3f3f3]/95 backdrop-blur-md">
          {/* Brand Row */}
          <div className="flex items-center justify-between px-2 pt-2 pb-3">
            <Link href="/" className="group flex items-baseline select-none">
              <span className="text-[21px] font-bold text-[#1b1b1b] tracking-tight">CostView</span>
              <span className="text-[21px] font-light text-[#5c5c5c] ml-1.5 tracking-wider">360</span>
            </Link>
            <button
              onClick={onClose}
              className="lg:hidden w-8 h-8 rounded-md bg-white border border-[#e5e5e5] flex items-center justify-center text-[#5c5c5c] hover:text-[#1b1b1b]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="px-2 -mt-2 mb-3 text-[10.5px] font-semibold text-[#5c5c5c] uppercase tracking-[0.5px]">
            Construction Cost Intelligence
          </div>

          {/* Segmented Mode Toggle */}
          <div className="flex bg-[#e8e8e8] p-1 rounded-lg mb-3">
            <button
              onClick={() => setActiveMode("site")}
              className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-md transition-all ${
                activeMode === "site"
                  ? "bg-white text-[#1b1b1b] shadow-sm font-bold"
                  : "text-[#5c5c5c] hover:text-[#1b1b1b]"
              }`}
            >
              Site Operations
            </button>
            <button
              onClick={() => setActiveMode("commercial")}
              className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-md transition-all ${
                activeMode === "commercial"
                  ? "bg-white text-[#1b1b1b] shadow-sm font-bold"
                  : "text-[#5c5c5c] hover:text-[#1b1b1b]"
              }`}
            >
              Commercial
            </button>
          </div>

          {/* Primary Home Nav Item */}
          <div className="px-1">
            <button
              onClick={() => handleSelect(activeMode === "site" ? "Dashboard" : "Command Center")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-all relative ${
                isHomeActive
                  ? "bg-[#e3e1e6] font-semibold text-[#1b1b1b] shadow-sm before:content-[''] before:absolute before:left-[-4px] before:top-2 before:bottom-2 before:w-[3px] before:bg-[#0067c0] before:rounded-full"
                  : "text-[#1b1b1b] hover:bg-[#f5f5f5] hover:-translate-y-[1px]"
              }`}
            >
              <Home className="w-4 h-4 text-[#0067c0]" />
              <span>Home</span>
            </button>
          </div>

          <div className="h-[1px] bg-[#e5e5e5] mx-1 my-2.5" />
        </div>

        {/* Scrollable Region */}
        <div className="flex-1 min-h-0 overflow-y-auto px-3 pb-3 space-y-3">
          {/* User Account Card with Dropdown */}
          <div className="relative">
            <div
              onClick={() => setAccountMenuOpen((v) => !v)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#f5f5f5] cursor-pointer transition-all border border-transparent hover:border-[#e5e5e5]"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4f6bed] to-[#7b5fe8] flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">
                <span>AA</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-[#1b1b1b] truncate">Abubakar Alkali</div>
                <div className="text-[11.5px] text-[#5c5c5c] truncate">{activeRole}</div>
              </div>
            </div>

            {accountMenuOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white/95 backdrop-blur-xl border border-[#e5e5e5] rounded-xl shadow-[0_12px_30px_rgba(0,0,0,0.12)] p-1.5 z-50 animate-in fade-in zoom-in-95">
                <div
                  onClick={() => {
                    setAccountMenuOpen(false);
                    handleSelect("Settings");
                  }}
                  className="px-3 py-2 rounded-md text-[12.5px] font-semibold text-[#1b1b1b] hover:bg-[#f5f5f5] cursor-pointer"
                >
                  Settings
                </div>
                <div
                  onClick={() => {
                    setAccountMenuOpen(false);
                    setIsOnboardingOpen(true);
                  }}
                  className="px-3 py-2 rounded-md text-[12.5px] font-semibold text-[#1b1b1b] hover:bg-[#f5f5f5] cursor-pointer"
                >
                  Help & User Guide
                </div>
                <div className="h-[1px] bg-[#e5e5e5] my-1" />
                <div
                  onClick={() => {
                    setAccountMenuOpen(false);
                    handleLogout();
                  }}
                  className="px-3 py-2 rounded-md text-[12.5px] font-semibold text-[#c42b1c] hover:bg-red-50 cursor-pointer flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </div>
              </div>
            )}
          </div>

          {/* Role Simulator Pill */}
          <div className="bg-white/80 backdrop-blur-md border border-[#e5e5e5] rounded-lg p-2 shadow-sm">
            <div className="text-[10px] uppercase font-bold tracking-wider text-[#5c5c5c] flex items-center justify-between mb-1.5 px-1">
              <span>Simulate Role</span>
              <span className="text-[#0067c0] bg-[#eef2fb] px-1.5 py-0.5 rounded text-[9.5px]">RBAC</span>
            </div>
            <select
              value={activeRole}
              onChange={(e) => setActiveRole(e.target.value as RoleName)}
              className="w-full bg-[#fafafa] border border-[#d5d5d5] rounded-md px-2.5 py-1.5 text-xs font-semibold text-[#1b1b1b] focus:outline-none focus:border-[#0067c0] cursor-pointer"
            >
              {ALL_ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          {/* Module Navigation List */}
          <nav className="space-y-0.5 pt-1">
            <div className="text-[10.5px] font-bold uppercase tracking-[0.6px] text-[#5c5c5c] px-2.5 py-1">
              {activeMode === "site" ? "Site Operations Modules" : "Commercial Operations"}
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
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] transition-all relative ${
                    !hasAccess
                      ? "opacity-40 cursor-not-allowed text-[#8b8b8b]"
                      : isActive
                      ? "bg-[#e3e1e6] font-semibold text-[#1b1b1b] shadow-sm before:content-[''] before:absolute before:left-[-4px] before:top-2 before:bottom-2 before:w-[3px] before:bg-[#0067c0] before:rounded-full"
                      : "text-[#1b1b1b] hover:bg-[#f5f5f5] hover:-translate-y-[1px]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#0067c0]" : "text-[#5c5c5c]"}`} />
                    <span className="tracking-normal text-left">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {!hasAccess && <Lock className="w-3.5 h-3.5 text-[#8b8b8b]" />}
                    {item.badge && hasAccess && (
                      <span className="text-[10.5px] px-2 py-0.5 rounded-full font-bold bg-[#eef2fb] text-[#0067c0] border border-[#0067c0]/20">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}

            <div className="h-[1px] bg-[#e5e5e5] mx-1 my-3" />

            <div className="text-[10.5px] font-bold uppercase tracking-[0.6px] text-[#5c5c5c] px-2.5 py-1">
              Management & Tools
            </div>
            {BOTTOM_NAV.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name;
              const hasAccess = !item.permission || canAccess(activeRole, item.permission as any);
              return (
                <button
                  key={item.name}
                  onClick={() => hasAccess && handleSelect(item.name)}
                  disabled={!hasAccess}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] transition-all relative ${
                    !hasAccess
                      ? "opacity-40 cursor-not-allowed text-[#8b8b8b]"
                      : isActive
                      ? "bg-[#e3e1e6] font-semibold text-[#1b1b1b] shadow-sm before:content-[''] before:absolute before:left-[-4px] before:top-2 before:bottom-2 before:w-[3px] before:bg-[#0067c0] before:rounded-full"
                      : "text-[#1b1b1b] hover:bg-[#f5f5f5] hover:-translate-y-[1px]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#0067c0]" : "text-[#5c5c5c]"}`} />
                    <span>{item.name}</span>
                  </div>
                  {!hasAccess && <Lock className="w-3.5 h-3.5 text-[#8b8b8b]" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Guide Button Footer */}
        <div className="p-3 border-t border-[#e5e5e5] bg-[#fafafa]/90 shrink-0">
          <button
            onClick={() => setIsOnboardingOpen(true)}
            className="w-full py-2 px-3 bg-white hover:bg-[#f5f5f5] border border-[#d5d5d5] text-[#1b1b1b] font-semibold text-xs rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <BookOpen className="w-4 h-4 text-[#0067c0]" />
            <span>Interactive User Guide</span>
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
