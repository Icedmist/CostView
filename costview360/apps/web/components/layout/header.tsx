"use client";

import React, { useState } from "react";
import { useApp } from "@/app/providers";
import { Building2, Bell, Menu, BookOpen, ChevronRight } from "lucide-react";
import { NAVIGATION_SECTIONS } from "@/components/layout/sidebar";
import { OnboardingModal } from "@/components/onboarding/onboarding-modal";

interface HeaderProps {
  onMenuClick?: () => void;
  activeSection?: string;
  activeSubSection?: string;
  onSelectNav?: (section: string, subSection?: string) => void;
}

export function Header({
  onMenuClick,
  activeSection = "Command Center",
  activeSubSection,
  onSelectNav,
}: HeaderProps) {
  const { currentProject, currency, setCurrency } = useApp();
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  // Find human-readable sub-section title
  const currentPrimary = NAVIGATION_SECTIONS.find((s) => s.id === activeSection);
  const currentSub = currentPrimary?.subSections.find((sub) => sub.id === activeSubSection);

  return (
    <header className="h-[64px] bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between gap-4 shrink-0 shadow-xs z-20">
      <div className="flex items-center gap-3.5 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-10 h-10 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-700 hover:text-[#0A1931] shadow-xs cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Project Switcher Pill */}
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 bg-slate-100/90 hover:bg-slate-200/80 border border-slate-300 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#0A1931] transition-all cursor-pointer shadow-xs">
            <Building2 className="w-4 h-4 text-[#0A1931]" />
            <span className="truncate max-w-[170px] sm:max-w-none">{currentProject.name}</span>
            <span className="text-[11px] text-slate-500 font-mono">({currentProject.code})</span>
          </div>
        </div>

        {/* Contextual Nav Breadcrumbs */}
        <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-slate-600 pl-2 border-l border-slate-200">
          <button
            onClick={() => onSelectNav?.(activeSection)}
            className="text-slate-800 hover:text-[#0A1931] font-bold cursor-pointer hover:underline"
          >
            {activeSection}
          </button>
          {currentSub && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[#0A1931] font-extrabold bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                {currentSub.code} {currentSub.name}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        {/* Currency Switcher */}
        <div className="hidden sm:flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 shadow-xs">
          <span className="text-slate-500">Currency:</span>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="bg-transparent text-xs font-extrabold text-[#0A1931] focus:outline-none cursor-pointer"
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
          className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer"
        >
          <BookOpen className="w-4 h-4 text-[#D4A017]" />
          <span className="hidden md:inline">User Guide</span>
        </button>

        {/* Live Status Pill */}
        <div className="hidden lg:flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-300 px-3 py-1.5 rounded-full text-xs font-bold shadow-xs">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span>System Online</span>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen((v) => !v)}
            title="Attention Alerts"
            className="relative w-10 h-10 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 hover:text-[#0A1931] transition-all shadow-xs cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
              3
            </span>
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span>Attention Alerts</span>
                <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                  3 Active
                </span>
              </div>
              <div className="py-2 space-y-2 text-xs">
                <div
                  onClick={() => {
                    setNotifOpen(false);
                    onSelectNav?.("Procurement", "match");
                  }}
                  className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 cursor-pointer hover:bg-rose-100/70 transition-colors"
                >
                  <div className="font-bold">Procurement Match Discrepancy</div>
                  <div className="text-[11px] text-rose-700 mt-0.5">
                    Pulkit Steels PO-2026-092 billed 30T vs 27T GRN delivered. Locked.
                  </div>
                </div>
                <div
                  onClick={() => {
                    setNotifOpen(false);
                    onSelectNav?.("Budget & BOQ", "revisions");
                  }}
                  className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 cursor-pointer hover:bg-amber-100/70 transition-colors"
                >
                  <div className="font-bold">BOQ Revision Pending</div>
                  <div className="text-[11px] text-amber-800 mt-0.5">
                    CON-02.01 ready-mix +₦4M diesel pump adjustment awaiting QS review.
                  </div>
                </div>
                <div
                  onClick={() => {
                    setNotifOpen(false);
                    onSelectNav?.("Site Operations", "diary");
                  }}
                  className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 cursor-pointer hover:bg-blue-100/70 transition-colors"
                >
                  <div className="font-bold">Site Execution Sync</div>
                  <div className="text-[11px] text-blue-800 mt-0.5">
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
