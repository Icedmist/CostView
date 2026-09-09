"use client";

import React, { useState } from "react";
import { useApp } from "@/app/providers";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MetricCards } from "@/components/dashboard/metric-cards";
import { BOQTable } from "@/components/budget/boq-table";
import { ThreeWayMatchView } from "@/components/procurement/three-way-match";
import { CommercialView } from "@/components/commercial/commercial-view";
import { SiteDiaryView } from "@/components/site-ops/site-diary-view";
import { MaterialsStockView } from "@/components/materials/materials-stock-view";
import { LabourView } from "@/components/labour/labour-view";
import { SubcontractorView } from "@/components/subcontractors/subcontractor-view";
import { ReportsView } from "@/components/reports/reports-view";
import { AuditLogView } from "@/components/admin/audit-log-view";
import {
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { RoleGuard } from "@/components/auth/role-guard";
import { canAccess } from "@/lib/auth/permissions";
import { useSessionExpiry } from "@/lib/auth/session";

export default function DashboardPage() {
  const { activeMode, activeRole } = useApp();
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const approvedBudget = 301815000;
  const committedCost = 292250000;
  const actualCost = 216400000;

  useSessionExpiry();

  // Auto-redirect if current tab not allowed for role
  React.useEffect(() => {
    const permMap: Record<string, string> = {
      "Budget & BOQ": "Budget",
      Procurement: "Procurement",
      "Materials & Stock": "Materials",
      "Labour & Muster": "Labour",
      "Site Progress & Diary": "Progress",
      Subcontractors: "Subcontractors",
      "Variations & Claims": "Variations",
      "Reports Studio": "Reports",
      "Admin & Roles": "Admin",
    };
    const perm = permMap[activeTab];
    if (perm && !canAccess(activeRole, perm as any)) {
      setActiveTab("Dashboard");
    }
  }, [activeRole, activeTab]);

  return (
    <div className="flex h-screen overflow-hidden bg-cream-100 font-sans">
      <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen((v) => !v)} />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-cream-100/40">
          {activeMode === "commercial" ? (
            <CommercialView />
          ) : (
            <>
              {activeTab === "Dashboard" && (
                <div className="space-y-6">
                  {/* Executive Banner - Brutalist - EXPANDED */}
                  <div className="bg-white border-2 border-navy-800 shadow-brutal p-5 md:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <span className="text-xs uppercase font-black tracking-wider px-4 py-1.5 bg-navy-800 text-white border-2 border-navy-800 font-mono">
                            Site Operations Command Center
                          </span>
                          <span className="text-navy-800/60 text-xs font-bold font-mono">· Role: {activeRole}</span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-black text-navy-800 tracking-tighter leading-none">
                          PROJECT COST & EXECUTION STATUS
                        </h1>
                        <p className="text-xs font-bold text-navy-800/60 mt-2 max-w-2xl leading-relaxed">
                          Consolidated budget, committed POs, site deliveries, and approval alerts — all in one brutalist command center.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          onClick={() => setActiveTab("Budget & BOQ")}
                          className="px-4 py-2.5 bg-mustard-400 hover:bg-mustard-500 text-navy-800 border-2 border-navy-800 shadow-brutal text-xs font-black uppercase tracking-wide flex items-center gap-2 active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all"
                        >
                          <span>Manage BOQ</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setActiveTab("Procurement")}
                          className="px-4 py-2.5 bg-white hover:bg-cream-100 text-navy-800 border-2 border-navy-800 shadow-brutal text-xs font-black uppercase tracking-wide active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all"
                        >
                          View 3-Way Match
                        </button>
                      </div>
                    </div>
                  </div>

                  <MetricCards
                    approvedBudget={approvedBudget}
                    committedCost={committedCost}
                    actualCost={actualCost}
                  />

                  {/* Attention Cards - Brutalist - EXPANDED */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div
                      onClick={() => setActiveTab("Procurement")}
                      className="cursor-pointer bg-white border-2 border-navy-800 shadow-brutal p-4 hover:shadow-brutal hover:-translate-y-1 transition-all min-h-[120px]"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-black flex items-center gap-2 text-navy-800 uppercase">
                          <span className="w-8 h-8 bg-red-500 border-2 border-navy-800 flex items-center justify-center">
                            <AlertTriangle className="w-4 h-4 text-white" />
                          </span>
                          1 Invoice Discrepancy
                        </span>
                        <span className="text-xs bg-red-500 text-white px-3 py-1 border-2 border-navy-800 font-mono font-black uppercase">
                          Action Needed
                        </span>
                      </div>
                      <p className="text-sm text-navy-800 font-black">
                        Pulkit Steels & Alloys (PO-2026-092)
                      </p>
                      <p className="text-xs font-bold text-navy-800/60 mt-2 leading-relaxed">
                        Invoiced for 30 Tons, but GRN shows only 27 Tons delivered. Payment locked.
                      </p>
                    </div>

                    <div
                      onClick={() => setActiveTab("Budget & BOQ")}
                      className="cursor-pointer bg-white border-2 border-navy-800 shadow-brutal p-4 hover:shadow-brutal hover:-translate-y-1 transition-all min-h-[120px]"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-black flex items-center gap-2 text-navy-800 uppercase">
                          <span className="w-8 h-8 bg-mustard-400 border-2 border-navy-800 flex items-center justify-center">
                            <Clock className="w-4 h-4 text-navy-800" />
                          </span>
                          Pending Revision
                        </span>
                        <span className="text-xs bg-navy-800 text-white px-3 py-1 border-2 border-navy-800 font-mono font-black uppercase">
                          QS Valuation
                        </span>
                      </div>
                      <p className="text-sm text-navy-800 font-black">
                        CON-02.01 Grade 30 ReadyMix
                      </p>
                      <p className="text-xs font-bold text-navy-800/60 mt-2 leading-relaxed">
                        +₦4,000,000 delta requested due to diesel pump price.
                      </p>
                    </div>

                    <div
                      onClick={() => setActiveTab("Site Progress & Diary")}
                      className="cursor-pointer bg-white border-2 border-navy-800 shadow-brutal p-4 hover:shadow-brutal hover:-translate-y-1 transition-all min-h-[120px]"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-black flex items-center gap-2 text-navy-800 uppercase">
                          <span className="w-8 h-8 bg-navy-800 border-2 border-navy-800 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </span>
                          Site Execution Sync
                        </span>
                        <span className="text-xs bg-mustard-400 text-navy-800 px-3 py-1 border-2 border-navy-800 font-mono font-black uppercase">
                          Today
                        </span>
                      </div>
                      <p className="text-sm text-navy-800 font-black">
                        48 Workers · Shift #142
                      </p>
                      <p className="text-xs font-bold text-navy-800/60 mt-2 leading-relaxed">
                        2 active snags on Block B. 0 safety incidents.
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-xs font-black text-navy-800 tracking-tight uppercase">
                        Bill of Quantities — Variances
                      </h2>
                      <button
                        onClick={() => setActiveTab("Budget & BOQ")}
                        className="text-xs bg-navy-800 text-white px-3 py-1.5 border-2 border-navy-800 font-black uppercase tracking-wide hover:bg-navy-700"
                      >
                        View Full Budget →
                      </button>
                    </div>
                    <BOQTable />
                  </div>
                </div>
              )}

              {activeTab === "Budget & BOQ" && (
                <RoleGuard permission="Budget">
                  <div className="space-y-4">
                    <div className="bg-white border-2 border-navy-800 shadow-brutal-sm p-4">
                      <h2 className="text-base font-black text-navy-800 tracking-tighter uppercase">
                        Budget Management & Bill of Quantities
                      </h2>
                      <p className="text-xs font-bold text-navy-800/60">
                        Line-item budget vs committed (POs) vs actual (certified), with revision audit trails.
                      </p>
                    </div>
                    <BOQTable />
                  </div>
                </RoleGuard>
              )}

              {activeTab === "Procurement" && (
                <RoleGuard permission="Procurement">
                  <div className="space-y-4">
                    <div className="bg-white border-2 border-navy-800 shadow-brutal-sm p-4">
                      <h2 className="text-base font-black text-navy-800 tracking-tighter uppercase">
                        Procurement Lifecycle & Invoice Validation
                      </h2>
                      <p className="text-xs font-bold text-navy-800/60">
                        Requisitions, Purchase Orders, and Automated Three-Way Matching.
                      </p>
                    </div>
                    <ThreeWayMatchView />
                  </div>
                </RoleGuard>
              )}

              {activeTab === "Site Progress & Diary" && (
                <RoleGuard permission="Progress">
                  <div className="space-y-4">
                    <div className="bg-white border-2 border-navy-800 shadow-brutal-sm p-4">
                      <h2 className="text-base font-black text-navy-800 tracking-tighter uppercase">
                        Site Execution, Daily Diary & Snagging
                      </h2>
                      <p className="text-xs font-bold text-navy-800/60">
                        Weather-stamped logs, workforce muster, and remediation.
                      </p>
                    </div>
                    <SiteDiaryView />
                  </div>
                </RoleGuard>
              )}

              {activeTab === "Materials & Stock" && (
                <RoleGuard permission="Materials">
                  <MaterialsStockView />
                </RoleGuard>
              )}

              {activeTab === "Labour & Muster" && (
                <RoleGuard permission="Labour">
                  <LabourView />
                </RoleGuard>
              )}

              {(activeTab === "Subcontractors" || activeTab === "Variations & Claims") && (
                <RoleGuard permission={activeTab === "Subcontractors" ? "Subcontractors" : "Variations"}>
                  <SubcontractorView />
                </RoleGuard>
              )}

              {activeTab === "Reports Studio" && (
                <RoleGuard permission="Reports">
                  <ReportsView />
                </RoleGuard>
              )}

              {activeTab === "Admin & Roles" && (
                <RoleGuard permission="Admin">
                  <AuditLogView />
                </RoleGuard>
              )}

              {activeTab === "Settings" && (
                <div className="bg-white border-2 border-navy-800 shadow-brutal p-6 md:p-8">
                  <h3 className="text-base font-black text-navy-800 uppercase text-center">Project Settings & Account</h3>
                  <p className="text-xs font-bold text-navy-800/60 mt-1 max-w-md mx-auto text-center">
                    Manage currency (₦ NGN), timezone, notifications, profile and session.
                  </p>
                  <div className="mt-5 grid sm:grid-cols-2 gap-3 max-w-md mx-auto">
                    <button onClick={() => (window.location.href = "/settings")} className="px-4 py-3 bg-navy-800 text-white border-2 border-navy-800 font-black uppercase text-xs shadow-brutal-sm">
                      Open Settings →
                    </button>
                    <button onClick={() => (window.location.href = "/account")} className="px-4 py-3 bg-mustard-400 text-navy-800 border-2 border-navy-800 font-black uppercase text-xs shadow-brutal-sm">
                      Account Center →
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
