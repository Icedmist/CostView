"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { ReportsView } from "@/components/reports/reports-view";
import { RoleGuard } from "@/components/auth/role-guard";

function ReportsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialReportParam = searchParams.get("report") || "cost-control";
  const [activeReport, setActiveReport] = useState(initialReportParam);

  return (
    <AppShell activeSection="Oversight" activeSubSection="reports">
      <RoleGuard permission="Reports">
        <ReportsView
          initialReportId={activeReport}
          onReportChange={(reportSlug) => {
            setActiveReport(reportSlug);
            router.replace(`/reports?report=${reportSlug}`);
          }}
        />
      </RoleGuard>
    </AppShell>
  );
}

export default function ReportsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-[#FAF9F5] dark:bg-[#071324]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-[#0A2540] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-black text-[#0A2540] dark:text-white">Loading Reports Studio...</span>
          </div>
        </div>
      }
    >
      <ReportsContent />
    </Suspense>
  );
}
