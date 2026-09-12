"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/app/providers";
import { Building2, Bell, Menu, BookOpen, ChevronRight, User } from "lucide-react";
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
    <header className="h-[68px] bg-white border-b-2 border-[#E5E5DE] px-4 md:px-6 flex items-center justify-between gap-4 shrink-0 z-20">
      <div className="flex items-center gap-4 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-11 h-11 bg-[#FAF9F5] border-2 border-[#E5E5DE] rounded-xl flex items-center justify-center text-[#0A2540] shadow-xs cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile Active Section Pill */}
        {currentPrimary && (
          <div className="flex lg:hidden items-center gap-1.5 min-w-0">
            <span
              className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-black shrink-0 ${currentPrimary.theme.badgeBg}`}
            >
              {currentSub ? currentSub.code : currentPrimary.code}
            </span>
            <span className="text-xs font-extrabold text-[#0A2540] truncate max-w-[130px] sm:max-w-none">
              {currentSub ? currentSub.name : currentPrimary.name}
            </span>
          </div>
        )}

        {/* Project Switcher Pill */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="inline-flex items-center gap-2.5 bg-[#FAF9F5] hover:bg-[#F2F1EC] border-2 border-[#E5E5DE] px-4 py-2 rounded-xl text-sm font-bold text-[#0A2540] transition-all cursor-pointer shadow-xs">
            <Building2 className="w-4 h-4 text-[#0A2540]" />
            <span className="truncate max-w-[170px] sm:max-w-none">{currentProject.name}</span>
            <span className="text-xs text-[#0A2540]/60 font-mono">({currentProject.code})</span>
          </div>
        </div>

        {/* Contextual Nav Breadcrumbs */}
        <div className="hidden md:flex items-center gap-2.5 text-sm font-semibold text-[#0A2540]/70 pl-3 border-l-2 border-[#E5E5DE]">
          <button
            onClick={() => onSelectNav?.(activeSection)}
            className="text-[#0A2540] hover:underline font-extrabold cursor-pointer"
          >
            {activeSection}
          </button>
          {currentSub && (
            <>
              <ChevronRight className="w-4 h-4 text-[#0A2540]/40" />
              <span
                className={`font-bold px-3 py-1 rounded-lg text-xs tracking-wide shadow-xs ${
                  currentPrimary?.theme.activeItemBg || "bg-[#0A2540] text-white"
                }`}
              >
                {currentSub.code} {currentSub.name}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {/* Currency Switcher */}
        <div className="hidden sm:flex items-center gap-2 bg-[#FAF9F5] border-2 border-[#E5E5DE] rounded-xl px-3.5 h-10 text-xs font-bold text-[#0A2540] shadow-xs">
          <span className="text-[#0A2540]/60 uppercase tracking-wider">Currency:</span>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="bg-transparent text-sm font-black text-[#0A2540] focus:outline-none cursor-pointer"
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
          className="flex items-center gap-2 h-10 px-4 bg-white hover:bg-[#FAF9F5] border-2 border-[#E5E5DE] text-[#0A2540] rounded-xl font-bold text-xs uppercase tracking-wider shadow-xs transition-all cursor-pointer"
        >
          <BookOpen className="w-4 h-4 text-[#0A2540]" />
          <span className="hidden md:inline">User Guide</span>
        </button>

        {/* Live Status Pill */}
        <div className="hidden lg:flex items-center gap-2 bg-emerald-50 text-emerald-900 border-2 border-emerald-300 px-3.5 h-10 rounded-xl text-xs font-bold shadow-xs">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
          <span>System Online</span>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen((v) => !v)}
            title="Attention Alerts"
            className="relative w-10 h-10 rounded-xl border-2 border-[#E5E5DE] bg-white hover:bg-[#FAF9F5] flex items-center justify-center text-[#0A2540] transition-all shadow-xs cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-xs">
              3
            </span>
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-84 bg-white border-2 border-[#E5E5DE] rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in">
              <div className="text-xs font-extrabold uppercase tracking-wider text-[#0A2540]/70 pb-2.5 border-b-2 border-[#E5E5DE] flex items-center justify-between">
                <span>Attention Alerts</span>
                <span className="bg-rose-100 text-rose-800 border border-rose-300 px-2 py-0.5 rounded-full text-xs font-black">
                  3 Active
                </span>
              </div>
              <div className="py-2.5 space-y-2.5 text-xs">
                <div
                  onClick={() => {
                    setNotifOpen(false);
                    onSelectNav?.("Procurement", "match");
                  }}
                  className="p-3 rounded-xl bg-rose-50 border-2 border-rose-200 text-rose-950 cursor-pointer hover:bg-rose-100/80 transition-colors"
                >
                  <div className="font-bold text-sm">Procurement Match Discrepancy</div>
                  <div className="text-xs text-rose-800 mt-1">
                    Pulkit Steels PO-2026-092 billed 30T vs 27T GRN delivered. Locked.
                  </div>
                </div>
                <div
                  onClick={() => {
                    setNotifOpen(false);
                    onSelectNav?.("Budget & BOQ", "revisions");
                  }}
                  className="p-3 rounded-xl bg-[#FAF9F5] border-2 border-[#E5E5DE] text-[#0A2540] cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="font-bold text-sm">BOQ Revision Pending</div>
                  <div className="text-xs text-[#0A2540]/80 mt-1">
                    CON-02.01 ready-mix diesel pump adjustment awaiting QS review.
                  </div>
                </div>
                <div
                  onClick={() => {
                    setNotifOpen(false);
                    onSelectNav?.("Site Operations", "diary");
                  }}
                  className="p-3 rounded-xl bg-blue-50 border-2 border-blue-200 text-[#0A2540] cursor-pointer hover:bg-blue-100/70 transition-colors"
                >
                  <div className="font-bold text-sm">Site Execution Sync</div>
                  <div className="text-xs text-[#0A2540]/80 mt-1">
                    Shift #142 closed with 48 crew. 2 non-critical snags logged.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* My Account & Profile Quick Link */}
        <Link
          href="/account"
          title="My Account & Profile"
          className="flex items-center gap-2 h-10 px-3 bg-[#0A2540] hover:bg-[#003366] text-white rounded-xl transition-all shadow-xs cursor-pointer"
        >
          <User className="w-4 h-4 text-white" />
          <span className="text-xs font-bold hidden sm:inline">Account</span>
        </Link>
      </div>

      <OnboardingModal isOpen={isOnboardingOpen} onClose={() => setIsOnboardingOpen(false)} />
    </header>
  );
}
