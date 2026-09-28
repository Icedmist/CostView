"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/app/providers";
import {
  Building2,
  Bell,
  Menu,
  ChevronRight,
  Globe,
  Search,
  Settings,
} from "lucide-react";
import { NAVIGATION_SECTIONS, normalizeSection } from "@/components/layout/sidebar";

interface HeaderProps {
  onMenuClick?: () => void;
  activeSection?: string;
  activeSubSection?: string;
  onSelectNav?: (section: string, subSection?: string) => void;
  onOpenSearch?: () => void;
}

export function Header({
  onMenuClick,
  activeSection = "Oversight",
  activeSubSection,
  onSelectNav,
  onOpenSearch,
}: HeaderProps) {
  const { currentProject } = useApp();
  const [notifOpen, setNotifOpen] = useState(false);

  // Normalize active section to one of the 5 flows
  const normalizedFlow = normalizeSection(activeSection);
  const currentPrimary = NAVIGATION_SECTIONS.find((s) => s.id === normalizedFlow);
  const currentSub = currentPrimary?.subSections.find((sub) => sub.id === activeSubSection);

  return (
    <header className="h-[72px] bg-white dark:bg-[#0A1931] border-b-2 border-[#E5E5DE] dark:border-[#1E3A5F] px-4 md:px-6 flex items-center justify-between gap-4 shrink-0 z-20 transition-colors">
      <div className="flex items-center gap-4 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-11 h-11 bg-[#FAF9F5] dark:bg-[#071324] border-2 border-[#E5E5DE] dark:border-[#1E3A5F] rounded-xl flex items-center justify-center text-[#0A2540] dark:text-white shadow-xs cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile Active Section Pill */}
        {currentPrimary && (
          <div className="flex lg:hidden items-center gap-2 min-w-0">
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-black shrink-0 bg-[#FAF9F5] dark:bg-[#071324] text-[#0A2540] dark:text-white border border-[#E5E5DE] dark:border-[#1E3A5F]">
              {currentSub ? currentSub.code : currentPrimary.code}
            </span>
            <span className="text-sm font-black text-[#0A2540] dark:text-white truncate max-w-[150px] sm:max-w-none">
              {currentSub ? currentSub.name : currentPrimary.name}
            </span>
          </div>
        )}

        {/* Project Switcher Pill */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="inline-flex items-center gap-2.5 bg-[#FAF9F5] dark:bg-[#071324] hover:bg-[#F2F1EC] dark:hover:bg-[#0F2137] border-2 border-[#E5E5DE] dark:border-[#1E3A5F] px-4 py-2.5 rounded-xl text-base font-bold text-[#0A2540] dark:text-white transition-all cursor-pointer shadow-xs">
            <Building2 className="w-4.5 h-4.5 text-[#0A2540] dark:text-[#FFD23F]" />
            <span className="truncate max-w-[190px] sm:max-w-none">{currentProject.name}</span>
            <span className="text-xs text-[#0A2540]/60 dark:text-white/60 font-mono font-semibold">({currentProject.code})</span>
          </div>
        </div>

        {/* Contextual Nav Breadcrumbs */}
        <div className="hidden md:flex items-center gap-3 text-base font-semibold text-[#0A2540]/70 dark:text-white/70 pl-3 border-l-2 border-[#E5E5DE] dark:border-[#1E3A5F]">
          <button
            onClick={() => onSelectNav?.(normalizedFlow)}
            className="text-[#0A2540] dark:text-white hover:underline font-extrabold cursor-pointer text-base"
          >
            {normalizedFlow}
          </button>
          {currentSub && (
            <>
              <ChevronRight className="w-4 h-4 text-[#0A2540]/40 dark:text-white/40" />
              <span className="font-extrabold px-3 py-1 rounded-lg text-sm tracking-wide shadow-xs bg-[#0A2540] dark:bg-[#FFD23F] text-white dark:text-[#0A1931]">
                {currentSub.name}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {/* ⌘K Search Quick Button */}
        <button
          onClick={() => onOpenSearch?.()}
          title="Command Search (⌘K)"
          className="hidden xl:flex items-center gap-2.5 h-11 px-4 bg-[#FAF9F5] dark:bg-[#071324] hover:bg-slate-100 dark:hover:bg-[#0F2137] border-2 border-[#E5E5DE] dark:border-[#1E3A5F] text-[#0A2540] dark:text-white rounded-xl font-bold text-sm shadow-xs transition-all cursor-pointer"
        >
          <Search className="w-4 h-4 text-[#0A2540]/60 dark:text-white/60" />
          <span>Quick search...</span>
          <kbd className="text-xs font-mono px-2 py-0.5 bg-white dark:bg-[#0A1931] border border-[#E5E5DE] dark:border-[#1E3A5F] rounded shadow-2xs font-black">
            ⌘K
          </kbd>
        </button>

        {/* Client Portal Link */}
        <Link
          href="/portal"
          target="_blank"
          title="Open Public Client & Investor Portal"
          className="hidden sm:flex items-center gap-2 h-11 px-4 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border-2 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-300 rounded-xl font-extrabold text-sm uppercase tracking-wider shadow-xs transition-all cursor-pointer"
        >
          <Globe className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
          <span className="hidden xl:inline">Client Portal</span>
        </Link>

        {/* Settings Gear Icon (Governance & Workspace Config) */}
        <button
          onClick={() => onSelectNav?.("Oversight", "admin")}
          title="Governance & Settings"
          className="w-11 h-11 rounded-xl border-2 border-[#E5E5DE] dark:border-[#1E3A5F] bg-white dark:bg-[#0A1931] hover:bg-[#FAF9F5] dark:hover:bg-[#0F2137] flex items-center justify-center text-[#0A2540] dark:text-white transition-all shadow-xs cursor-pointer"
        >
          <Settings className="w-4.5 h-4.5" />
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen((v) => !v)}
            title="Attention Alerts"
            className="relative w-11 h-11 rounded-xl border-2 border-[#E5E5DE] dark:border-[#1E3A5F] bg-white dark:bg-[#0A1931] hover:bg-[#FAF9F5] dark:hover:bg-[#0F2137] flex items-center justify-center text-[#0A2540] dark:text-white transition-all shadow-xs cursor-pointer"
          >
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-rose-600 text-white text-xs font-black rounded-full flex items-center justify-center shadow-xs">
              3
            </span>
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-88 bg-white dark:bg-[#0A1931] border-2 border-[#E5E5DE] dark:border-[#1E3A5F] rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in">
              <div className="text-xs font-extrabold uppercase tracking-wider text-[#0A2540]/70 dark:text-white/70 pb-2.5 border-b-2 border-[#E5E5DE] dark:border-[#1E3A5F] flex items-center justify-between">
                <span>Attention Alerts</span>
                <span className="bg-rose-100 text-rose-800 border border-rose-300 px-2 py-0.5 rounded-full text-xs font-black">
                  3 Active
                </span>
              </div>
              <div className="py-2.5 space-y-2.5 text-xs">
                <div
                  onClick={() => {
                    setNotifOpen(false);
                    onSelectNav?.("Buy & Supply", "match");
                  }}
                  className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-200 dark:border-rose-900 text-rose-950 dark:text-rose-200 cursor-pointer hover:bg-rose-100/80 dark:hover:bg-rose-900/60 transition-colors"
                >
                  <div className="font-bold text-sm">Procurement Match Discrepancy</div>
                  <div className="text-xs text-rose-800 dark:text-rose-300 mt-1">
                    Pulkit Steels PO-2026-092 billed 30T vs 27T GRN delivered. Locked.
                  </div>
                </div>
                <div
                  onClick={() => {
                    setNotifOpen(false);
                    onSelectNav?.("Cost Plan", "revisions");
                  }}
                  className="p-3 rounded-xl bg-[#FAF9F5] dark:bg-[#071324] border-2 border-[#E5E5DE] dark:border-[#1E3A5F] text-[#0A2540] dark:text-white cursor-pointer hover:bg-slate-100 dark:hover:bg-[#0F2137] transition-colors"
                >
                  <div className="font-bold text-sm">BOQ Revision Pending</div>
                  <div className="text-xs text-[#0A2540]/80 dark:text-white/80 mt-1">
                    CON-02.01 ready-mix diesel pump adjustment awaiting QS review.
                  </div>
                </div>
                <div
                  onClick={() => {
                    setNotifOpen(false);
                    onSelectNav?.("Site", "diary");
                  }}
                  className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-200 dark:border-amber-900 text-amber-950 dark:text-amber-200 cursor-pointer hover:bg-amber-100/80 dark:hover:bg-amber-900/60 transition-colors"
                >
                  <div className="font-bold text-sm">Site Diary Incomplete</div>
                  <div className="text-xs text-amber-800 dark:text-amber-300 mt-1">
                    Shift #142 pour completed but labour muster and equipment hours unsaved.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
