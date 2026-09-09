"use client";

import React from "react";
import { useApp } from "@/app/providers";
import { Building2, Bell, Menu } from "lucide-react";

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const { currentProject, currency, setCurrency } = useApp();
  return (
    <header className="h-[72px] bg-white border-b-[3px] border-navy-800 px-4 md:px-6 flex items-center justify-between gap-4 shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        <button onClick={onMenuClick} className="lg:hidden w-11 h-11 bg-navy-800 border-2 border-navy-800 flex items-center justify-center text-white shadow-brutal-sm">
          <Menu className="w-5 h-5" />
        </button>
        <div className="w-11 h-11 bg-navy-800 border-2 border-navy-800 hidden sm:flex items-center justify-center text-mustard-400 shadow-brutal-sm shrink-0">
          <Building2 className="w-6 h-6" />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base md:text-lg font-black text-navy-800 tracking-tighter uppercase truncate">
              {currentProject.name}
            </h2>
            <span className="text-xs bg-mustard-400 text-navy-800 px-2.5 py-1 border-2 border-navy-800 font-mono font-black">
              {currentProject.code}
            </span>
          </div>
          <p className="text-xs font-bold text-navy-800/60 truncate hidden sm:block">{currentProject.location} · Africa/Lagos · ₦ NGN</p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        <div className="hidden lg:flex items-center gap-2 bg-cream-100 border-2 border-navy-800 px-3 py-2 shadow-brutal-sm">
          <span className="text-xs font-black uppercase tracking-widest text-navy-800">Currency:</span>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="bg-white border-2 border-navy-800 text-sm font-black text-navy-800 px-3 py-1 focus:outline-none cursor-pointer"
          >
            <option value="NGN">₦ NGN</option>
            <option value="USD">$ USD</option>
            <option value="GBP">£ GBP</option>
            <option value="EUR">€ EUR</option>
          </select>
        </div>

        <div className="hidden md:flex items-center gap-2 bg-navy-800 text-white border-2 border-navy-800 px-4 py-2.5 shadow-brutal-sm">
          <span className="w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full animate-pulse" />
          <span className="text-xs font-black uppercase tracking-wide">Live</span>
        </div>

        <button
          title="3 Pending Approval Actions"
          className="relative w-11 h-11 md:w-12 md:h-12 bg-mustard-400 border-2 border-navy-800 flex items-center justify-center text-navy-800 shadow-brutal-sm hover:bg-mustard-500 active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
        >
          <Bell className="w-5 h-5 md:w-6 md:h-6" />
          <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-black border-2 border-navy-800 flex items-center justify-center">
            3
          </span>
        </button>
      </div>
    </header>
  );
}
