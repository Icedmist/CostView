"use client";

import React, { useState } from "react";
import { useApp } from "@/app/providers";
import { Building2, Bell, Menu, LogOut, BookOpen } from "lucide-react";
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
    sessionStorage.clear();
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="h-[60px] bg-white/85 backdrop-blur-xl border-b border-[#e5e5e5] px-4 md:px-6 flex items-center justify-between gap-4 shrink-0 shadow-[0_1px_4px_rgba(0,0,0,0.02)] z-20">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 bg-white border border-[#e5e5e5] rounded-lg flex items-center justify-center text-[#5c5c5c] hover:text-[#1b1b1b] shadow-sm"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Project Switcher Pill */}
        <div className="flex items-center gap-2.5">
          <div className="inline-flex items-center gap-2 bg-[#f0f1f3] hover:bg-[#e6e7ea] border border-[#e5e5e5] px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#1b1b1b] transition-all cursor-pointer shadow-sm">
            <Building2 className="w-3.5 h-3.5 text-[#0067c0]" />
            <span className="truncate max-w-[200px] md:max-w-none">{currentProject.name}</span>
            <span className="text-[10px] text-[#5c5c5c] font-normal">({currentProject.code})</span>
          </div>
          <span className="text-xs text-[#5c5c5c] hidden xl:inline">
            {currentProject.location} · ₦ NGN
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        {/* Currency Pill */}
        <div className="hidden sm:flex items-center gap-1.5 bg-[#f8f9fa] border border-[#e5e5e5] rounded-lg px-2.5 py-1 text-xs font-semibold text-[#5c5c5c]">
          <span>Currency:</span>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="bg-transparent text-xs font-semibold text-[#1b1b1b] focus:outline-none cursor-pointer"
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
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#f5f5f5] border border-[#d5d5d5] text-[#1b1b1b] rounded-lg font-semibold text-xs shadow-sm transition-all"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#0067c0]" />
          <span className="hidden md:inline">User Guide</span>
        </button>

        {/* Live Status Pill */}
        <div className="hidden md:flex items-center gap-2 bg-[#eef2fb] text-[#0067c0] border border-[#0067c0]/20 px-2.5 py-1 rounded-full text-xs font-semibold">
          <span className="w-2 h-2 bg-[#0f7b3f] rounded-full animate-pulse" />
          <span>System Live</span>
        </div>

        {/* Notification Bell with Menu */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen((v) => !v)}
            title="Attention Alerts"
            className="relative w-9 h-9 rounded-lg border border-[#e5e5e5] bg-white hover:bg-[#f5f5f5] flex items-center justify-center text-[#5c5c5c] hover:text-[#1b1b1b] transition-all shadow-sm"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#c42b1c] text-white text-[9.5px] font-bold rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white/95 backdrop-blur-2xl border border-[#e5e5e5] rounded-xl shadow-[0_16px_40px_rgba(0,0,0,0.16)] p-3 z-50 animate-in fade-in zoom-in-95">
              <div className="text-[11.5px] font-bold uppercase tracking-wider text-[#5c5c5c] pb-2 border-b border-[#e5e5e5]">
                Attention Required
              </div>
              <div className="py-2 space-y-2 text-xs">
                <div className="p-2 rounded-lg bg-[#fbe4e2] text-[#c42b1c] border border-[#c42b1c]/15">
                  <div className="font-bold">Procurement Commitment Alert</div>
                  <div className="text-[11px] text-[#1b1b1b]/80 mt-0.5">POs tracking ₦18.4M above baseline allocation.</div>
                </div>
                <div className="p-2 rounded-lg bg-[#fdf0dd] text-[#a15c00] border border-[#a15c00]/15">
                  <div className="font-bold">BOQ Rate Variance</div>
                  <div className="text-[11px] text-[#1b1b1b]/80 mt-0.5">Blockwork item running 3% over approved unit rate.</div>
                </div>
                <div className="p-2 rounded-lg bg-[#eef2fb] text-[#0067c0] border border-[#0067c0]/15">
                  <div className="font-bold">Site Progress</div>
                  <div className="text-[11px] text-[#1b1b1b]/80 mt-0.5">Daily muster recorded 96% attendance today.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sign Out Button */}
        <button
          onClick={handleLogout}
          title="Sign out of workspace"
          className="w-9 h-9 rounded-lg border border-[#e5e5e5] bg-white hover:bg-[#f5f5f5] flex items-center justify-center text-[#5c5c5c] hover:text-[#c42b1c] transition-all shadow-sm"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />
    </header>
  );
}
