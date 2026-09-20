"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { ClientPortalView } from "@/components/portal/client-portal-view";
import { Logo } from "@/components/brand/logo";
import { ShieldCheck, ArrowLeft, Globe, Phone, Mail } from "lucide-react";

export default function StandalonePortalPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F5] text-slate-900 flex flex-col font-sans">
      {/* Top Client Brand Bar */}
      <header className="bg-white border-b-2 border-[#E5E5DE] sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:opacity-90 transition-opacity">
              <Logo />
            </Link>
            <div className="hidden sm:block h-6 w-[2px] bg-[#E5E5DE]" />
            <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-[#0A2540]">
              <Globe className="w-4 h-4 text-emerald-600" />
              <span>Project Stakeholder Transparency Portal</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-[#0A2540] hover:bg-[#003366] text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Enter Workspace</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8">
        <Suspense fallback={<div className="p-8 text-center text-sm font-bold text-slate-500">Loading Client Portal...</div>}>
          <ClientPortalView standalone={true} />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t-2 border-[#E5E5DE] py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Authenticated Client Progress Portal · Powered by CostView</span>
          </div>
          <div>Project ID: P-2026-VI01 · Certified Nigerian Construction Governance</div>
        </div>
      </footer>
    </div>
  );
}
