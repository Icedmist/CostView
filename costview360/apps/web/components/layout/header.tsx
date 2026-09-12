"use client";

import React, { useState } from "react";
import { useApp } from "@/app/providers";
import { Building2, Bell, Menu, LogOut, BookOpen, Search, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { OnboardingModal } from "@/components/onboarding/onboarding-modal";

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const { currentProject, currency, setCurrency } = useApp();
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("costview_demo_role");
    localStorage.removeItem("costview_demo_email");
    localStorage.removeItem("costview_last_active");
    document.cookie = "costview_demo_role=; path=/; max-age=0";
    sessionStorage.clear();
    window.location.href = "/login";
  };

  return (
    <header className="h-[64px] bg-white/80 backdrop-blur-2xl border-b border-slate-200/80 px-4 md:px-6 flex items-center justify-between gap-4 shrink-0 shadow-[0_1px_3px_rgba(0,0,0,0.02)] z-20">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:text-slate-900 shadow-xs"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Project Switcher Pill */}
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 bg-slate-100/80 hover:bg-slate-200/70 border border-slate-200/80 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-800 transition-all cursor-pointer shadow-xs">
            <Building2 className="w-3.5 h-3.5 text-[#0067c0]" />
            <span className="truncate max-w-[180px] sm:max-w-none">{currentProject.name}</span>
            <span className="text-[10px] text-slate-500 font-mono">({currentProject.code})</span>
          </div>
          <span className="text-xs text-slate-500 hidden xl:inline">
            {currentProject.location} · ₦ NGN Native
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        {/* Currency Switcher */}
        <div className="hidden sm:flex items-center gap-1.5 bg-slate-50/80 border border-slate-200/80 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-xs">
          <span>Currency:</span>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="NGN">₦ NGN</option>
            <option value="USD">$ USD</option>
            <option value="GBP">£ GBP</option>
            <option value="EUR">€ EUR</option>
          </select>
        </div>

        {/* User Guide Hub */}
        <button
          onClick={() => setIsOnboardingOpen(true)}
          title="Open User Guide & Onboarding Hub"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl font-semibold text-xs shadow-xs transition-all"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#0067c0]" />
          <span className="hidden md:inline">User Guide</span>
        </button>

        {/* Live Status Pill */}
        <div className="hidden md:flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-3 py-1 rounded-full text-xs font-semibold shadow-xs">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span>System Live</span>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen((v) => !v)}
            title="Attention Alerts"
            className="relative w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all shadow-xs"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9.5px] font-bold rounded-full flex items-center justify-center shadow-xs">
              3
            </span>
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-2xl shadow-glass p-3 z-50 animate-in fade-in zoom-in-95">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span>Attention Alerts</span>
                <span className="bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full text-[10px]">3 Active</span>
              </div>
              <div className="py-2 space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-rose-50/80 border border-rose-200/80 text-rose-800">
                  <div className="font-bold">Procurement Match Discrepancy</div>
                  <div className="text-[11px] text-rose-700/80 mt-0.5">
                    Pulkit Steels PO-2026-092 billed 30T vs 27T GRN delivered.
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-800">
                  <div className="font-bold">BOQ Revision Pending</div>
                  <div className="text-[11px] text-amber-700/80 mt-0.5">
                    CON-02.01 ready-mix +₦4M diesel pump adjustment awaiting QS review.
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-blue-50/80 border border-blue-200/80 text-blue-800">
                  <div className="font-bold">Site Execution Sync</div>
                  <div className="text-[11px] text-blue-700/80 mt-0.5">
                    Shift #142 closed with 48 crew. 2 non-critical snags logged.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <OnboardingModal isOpen={isOnboardingOpen} onClose={() => setIsOnboardingOpen(false)} />
    </header>
  );
}
