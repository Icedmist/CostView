"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { ReportsView } from "@/components/reports/reports-view";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { RoleGuard } from "@/components/auth/role-guard";
import { useSessionExpiry } from "@/lib/auth/session";

function ReportsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialReportParam = searchParams.get("report") || "cost-control";

  const [activeSubSection, setActiveSubSection] = useState(initialReportParam);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useSessionExpiry();

  // Navigation coordinator to switch sections or routes
  const handleNavSelect = (section: string, subSection?: string) => {
    if (section === "Reports Studio") {
      if (subSection) {
        setActiveSubSection(subSection);
        router.replace(`/reports?report=${subSection}`);
      }
    } else {
      router.push(`/dashboard`);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAF9F5] font-sans text-slate-900">
      <Sidebar
        activeSection="Reports Studio"
        activeSubSection={activeSubSection}
        onSelectNav={handleNavSelect}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          onMenuClick={() => setSidebarOpen((v) => !v)}
          activeSection="Reports Studio"
          activeSubSection={activeSubSection}
          onSelectNav={handleNavSelect}
        />

        <main className="flex-1 overflow-y-auto p-5 md:p-8 space-y-8 bg-[#FAF9F5] pb-24 lg:pb-8">
          <RoleGuard permission="Reports">
            <ReportsView
              initialReportId={activeSubSection}
              onReportChange={(reportSlug) => {
                setActiveSubSection(reportSlug);
                router.replace(`/reports?report=${reportSlug}`);
              }}
            />
          </RoleGuard>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeSection="Reports Studio"
        onSelectNav={handleNavSelect}
        onMenuClick={() => setSidebarOpen((v) => !v)}
        isMenuOpen={sidebarOpen}
      />
    </div>
  );
}

export default function ReportsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-[#FAF9F5]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-[#0A2540] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-black text-[#0A2540]">Loading Reports Studio...</span>
          </div>
        </div>
      }
    >
      <ReportsContent />
    </Suspense>
  );
}
