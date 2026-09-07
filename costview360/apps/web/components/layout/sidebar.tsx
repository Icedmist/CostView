"use client";

import React from "react";
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
} from "lucide-react";

interface NavItem {
  name: string;
  icon: React.ElementType;
  permission?: string;
  badge?: string;
}

const SITE_OPS_NAV: NavItem[] = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Budget & BOQ", icon: Calculator, permission: "Budget" },
  { name: "Procurement", icon: ShoppingCart, permission: "Procurement", badge: "3 POs" },
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
  { name: "Project Margin", icon: TrendingUp, badge: "Live" },
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
}: {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}) {
  const { activeMode, setActiveMode, activeRole, setActiveRole } = useApp();
  const navItems = activeMode === "site" ? SITE_OPS_NAV : COMMERCIAL_NAV;

  return (
    <aside className="w-64 bg-zinc-900 text-zinc-300 border-r border-zinc-800 flex flex-col h-screen select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-black text-zinc-950 text-base shadow-sm">
            360
          </div>
          <div>
            <div className="font-bold text-white text-base leading-tight tracking-tight">
              CostView <span className="text-emerald-400 font-medium text-xs uppercase px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40">PRO</span>
            </div>
            <div className="text-[11px] text-zinc-400 tracking-wide font-mono">
              Analyse · Plan · Build
            </div>
          </div>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="px-3 pt-3">
        <div className="bg-zinc-950/80 p-1 rounded-lg flex items-center border border-zinc-800 text-xs">
          <button
            onClick={() => setActiveMode("site")}
            className={`flex-1 py-1.5 px-2 rounded-md font-medium text-center transition-all ${
              activeMode === "site"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Site Ops
          </button>
          <button
            onClick={() => setActiveMode("commercial")}
            className={`flex-1 py-1.5 px-2 rounded-md font-medium text-center transition-all ${
              activeMode === "commercial"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Commercial
          </button>
        </div>
      </div>

      {/* Role Preview Switcher (Interactive Sandbox Feature) */}
      <div className="px-3 pt-3">
        <div className="bg-zinc-800/40 rounded-lg p-2 border border-zinc-800/60">
          <div className="text-[10px] uppercase font-semibold text-zinc-400 tracking-wider mb-1 flex items-center justify-between">
            <span>Simulate Role</span>
            <span className="text-emerald-400 text-[10px]">RBAC Active</span>
          </div>
          <select
            value={activeRole}
            onChange={(e) => setActiveRole(e.target.value as RoleName)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded text-xs text-zinc-200 py-1 px-1.5 focus:outline-none focus:border-emerald-500 font-medium"
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
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 px-2 py-1">
          {activeMode === "site" ? "Site Operations Modules" : "Commercial Modules"}
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;
          return (
            <button
              key={item.name}
              onClick={() => onSelectTab(item.name)}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? "bg-zinc-800 text-white font-semibold border-l-2 border-emerald-500"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-zinc-400"}`} />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-medium border border-emerald-500/30">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Footer Profile */}
      <div className="p-3 border-t border-zinc-800 bg-zinc-950/40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-900/60 border border-emerald-500/30 flex items-center justify-center text-xs font-bold text-emerald-300">
            IM
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-zinc-200 truncate">icedmist</p>
            <p className="text-[10px] text-zinc-500 truncate">{activeRole}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
