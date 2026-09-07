"use client";

import React from "react";
import { useApp } from "@/app/providers";
import { Building2, Bell, RefreshCw, ShieldAlert } from "lucide-react";

export function Header() {
  const { currentProject, currency, setCurrency, activeRole } = useApp();

  return (
    <header className="h-14 bg-zinc-950 border-b border-zinc-800 px-6 flex items-center justify-between">
      {/* Current Project Info */}
      <div className="flex items-center gap-3">
        <div className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-md text-emerald-400">
          <Building2 className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold text-zinc-100 tracking-tight">
              {currentProject.name}
            </h2>
            <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded font-mono border border-zinc-700">
              {currentProject.code}
            </span>
          </div>
          <p className="text-[10px] text-zinc-400">{currentProject.location}</p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Currency Switcher (PRD: Currency-first, Naira default) */}
        <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-md px-2 py-1">
          <span className="text-[10px] text-zinc-400 font-semibold">Currency:</span>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="bg-transparent text-xs text-zinc-200 font-medium focus:outline-none cursor-pointer"
          >
            <option value="NGN" className="bg-zinc-900 text-zinc-200">
              ₦ NGN (Naira)
            </option>
            <option value="USD" className="bg-zinc-900 text-zinc-200">
              $ USD (Dollar)
            </option>
            <option value="GBP" className="bg-zinc-900 text-zinc-200">
              £ GBP (Pound)
            </option>
            <option value="EUR" className="bg-zinc-900 text-zinc-200">
              € EUR (Euro)
            </option>
          </select>
        </div>

        {/* Realtime Connection Indicator */}
        <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-zinc-300 font-medium">Supabase Live</span>
        </div>

        {/* Notifications & Pending Approvals */}
        <button
          title="3 Pending Approval Actions"
          className="relative p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 rounded-md border border-zinc-800 transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-500 text-zinc-950 text-[9px] font-black rounded-full flex items-center justify-center">
            3
          </span>
        </button>
      </div>
    </header>
  );
}
