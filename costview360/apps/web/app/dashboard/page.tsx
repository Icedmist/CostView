"use client";

import React, { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/app/providers";
import { AppShell } from "@/components/layout/app-shell";
import { MetricCards } from "@/components/dashboard/metric-cards";
import { MyWorkQueue } from "@/components/dashboard/my-work-queue";
import { useAppData } from "@/lib/store/app-data";
import { getNavUrl } from "@/lib/routes";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentProject } = useApp();
  const { boqItems } = useAppData();

  // Backward compatibility: If legacy ?flow=... or ?tab=... query param is passed, redirect to semantic route
  useEffect(() => {
    const flow = searchParams.get("flow");
    const sub = searchParams.get("sub") || searchParams.get("tab");
    if (flow && flow !== "Oversight") {
      router.replace(getNavUrl(flow, sub || undefined));
    } else if (sub && sub !== "my-work") {
      router.replace(getNavUrl("Oversight", sub));
    }
  }, [searchParams, router]);

  // Dynamic budget KPIs calculated from live project BOQ data with fallback to project baseline budget
  const boqApprovedTotal = boqItems.reduce((acc, it) => acc + (it.budgetAmount || 0), 0);
  const approvedBudget = boqApprovedTotal > 0 ? boqApprovedTotal : (currentProject?.budgetTotal || 0);
  const committedCost = boqItems.reduce((acc, it) => acc + (it.committedAmount || 0), 0);
  const actualCost = boqItems.reduce((acc, it) => acc + (it.actualAmount || 0), 0);

  return (
    <AppShell activeSection="Oversight" activeSubSection="my-work">
      <div className="space-y-6">
        <MetricCards
          approvedBudget={approvedBudget}
          committedCost={committedCost}
          actualCost={actualCost}
        />
        <MyWorkQueue onSelectNav={(sec, sub) => router.push(getNavUrl(sec, sub))} />
      </div>
    </AppShell>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF9F5] dark:bg-[#071324]" />}>
      <DashboardContent />
    </Suspense>
  );
}
