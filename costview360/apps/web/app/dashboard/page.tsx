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
    <div className="flex h-screen overflow-hidden bg-[#fbfbfb] font-sans">
      <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen((v) => !v)} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-[#fbfbfb]">
          {activeMode === "commercial" ? (
            <CommercialView />
          ) : (
            <>
              {activeTab === "Dashboard" && (
                <div className="space-y-6">
                  {/* Executive Glass Hero Banner */}
                  <div className="glass-hero p-6 md:p-8 relative overflow-hidden">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                      <div>
                        <div className="flex flex-wrap items-center gap-2.5 mb-3">
                          <span className="text-xs font-semibold px-3 py-1 bg-white/10 text-white rounded-full border border-white/20 backdrop-blur-sm">
                            Site Operations Command Center
                          </span>
                          <span className="text-white/60 text-xs font-medium">· Role: {activeRole}</span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white leading-tight">
                          Project Cost &amp; Execution Command Center
                        </h1>
                        <p className="text-xs text-white/75 mt-2 max-w-2xl leading-relaxed">
                          Consolidated budget allocation, committed purchase orders, certified subcontractor valuations, and real-time site execution status.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          onClick={() => setActiveTab("Budget & BOQ")}
                          className="px-4 py-2.5 bg-[#0067c0] hover:bg-[#005ba1] text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm transition-all active:scale-[0.98]"
                        >
                          <span>Manage BOQ</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setActiveTab("Procurement")}
                          className="px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white border border-white/20 rounded-lg text-xs font-semibold backdrop-blur-sm transition-all"
                        >
                          View 3-Way Match
                        </button>
                      </div>
                    </div>

                    {/* Quick Summary Strip */}
                    <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap gap-6 text-xs text-white/80">
                      <div>
                        <div className="text-[10.5px] uppercase tracking-wider text-white/50">Execution Progress</div>
                        <div className="text-base font-bold text-white mt-0.5">62% Complete</div>
                      </div>
                      <div className="h-8 w-[1px] bg-white/10 hidden sm:block" />
                      <div>
                        <div className="text-[10.5px] uppercase tracking-wider text-white/50">Financial Health</div>
                        <div className="text-base font-bold text-[#8fe0ac] mt-0.5">Healthy (1.04 CPI)</div>
                      </div>
                      <div className="h-8 w-[1px] bg-white/10 hidden sm:block" />
                      <div>
                        <div className="text-[10.5px] uppercase tracking-wider text-white/50">Active Worksite</div>
                        <div className="text-base font-bold text-white mt-0.5">Shift #142 · 48 Active Crew</div>
                      </div>
                    </div>
                  </div>

                  <MetricCards
                    approvedBudget={approvedBudget}
                    committedCost={committedCost}
                    actualCost={actualCost}
                  />

                  {/* Attention Cards - Glassmorphic */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div
                      onClick={() => setActiveTab("Procurement")}
                      className="cursor-pointer glass-card p-4 hover:-translate-y-0.5 transition-all min-h-[120px]"
                    >
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-xs font-semibold flex items-center gap-2 text-[#1b1b1b]">
                          <span className="w-7 h-7 bg-[#fbe4e2] text-[#c42b1c] rounded-md flex items-center justify-center">
                            <AlertTriangle className="w-4 h-4" />
                          </span>
                          1 Invoice Discrepancy
                        </span>
                        <span className="text-[10px] bg-[#fbe4e2] text-[#c42b1c] px-2 py-0.5 rounded-full font-bold uppercase">
                          Action Needed
                        </span>
                      </div>
                      <p className="text-xs font-bold text-[#1b1b1b]">
                        Pulkit Steels &amp; Alloys (PO-2026-092)
                      </p>
                      <p className="text-xs text-[#5c5c5c] mt-1 leading-relaxed">
                        Invoiced for 30 Tons, but GRN shows only 27 Tons delivered. Payment locked.
                      </p>
                    </div>

                    <div
                      onClick={() => setActiveTab("Budget & BOQ")}
                      className="cursor-pointer glass-card p-4 hover:-translate-y-0.5 transition-all min-h-[120px]"
                    >
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-xs font-semibold flex items-center gap-2 text-[#1b1b1b]">
                          <span className="w-7 h-7 bg-[#fdf0dd] text-[#a15c00] rounded-md flex items-center justify-center">
                            <Clock className="w-4 h-4" />
                          </span>
                          Pending Revision
                        </span>
                        <span className="text-[10px] bg-[#eef2fb] text-[#0067c0] px-2 py-0.5 rounded-full font-bold uppercase">
                          QS Valuation
                        </span>
                      </div>
                      <p className="text-xs font-bold text-[#1b1b1b]">
                        CON-02.01 Grade 30 ReadyMix
                      </p>
                      <p className="text-xs text-[#5c5c5c] mt-1 leading-relaxed">
                        +₦4,000,000 delta requested due to diesel pump price adjustment.
                      </p>
                    </div>

                    <div
                      onClick={() => setActiveTab("Site Progress & Diary")}
                      className="cursor-pointer glass-card p-4 hover:-translate-y-0.5 transition-all min-h-[120px]"
                    >
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-xs font-semibold flex items-center gap-2 text-[#1b1b1b]">
                          <span className="w-7 h-7 bg-[#e3f6ea] text-[#0f7b3f] rounded-md flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4" />
                          </span>
                          Site Execution Sync
                        </span>
                        <span className="text-[10px] bg-[#e3f6ea] text-[#0f7b3f] px-2 py-0.5 rounded-full font-bold uppercase">
                          Today
                        </span>
                      </div>
                      <p className="text-xs font-bold text-[#1b1b1b]">
                        48 Workers · Shift #142
                      </p>
                      <p className="text-xs text-[#5c5c5c] mt-1 leading-relaxed">
                        2 active snags logged on Block B. 0 safety incidents recorded.
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-xs font-bold text-[#5c5c5c] tracking-wide uppercase">
                        Bill of Quantities — Variances &amp; Commitments
                      </h2>
                      <button
                        onClick={() => setActiveTab("Budget & BOQ")}
                        className="text-xs font-semibold text-[#0067c0] hover:underline"
                      >
                        View Full BOQ Register →
                      </button>
                    </div>
                    <BOQTable />
                  </div>
                </div>
              )}

              {activeTab === "Budget & BOQ" && (
                <RoleGuard permission="Budget">
                  <div className="space-y-4">
                    <div className="glass-card p-4">
                      <h2 className="text-base font-bold text-[#1b1b1b] tracking-tight">
                        Budget Management &amp; Bill of Quantities
                      </h2>
                      <p className="text-xs text-[#5c5c5c] mt-0.5">
                        Line-item budget vs committed purchase orders vs certified actuals, with complete revision audit trails.
                      </p>
                    </div>
                    <BOQTable />
                  </div>
                </RoleGuard>
              )}

              {activeTab === "Procurement" && (
                <RoleGuard permission="Procurement">
                  <div className="space-y-4">
                    <div className="glass-card p-4">
                      <h2 className="text-base font-bold text-[#1b1b1b] tracking-tight">
                        Procurement Lifecycle &amp; Invoice Validation
                      </h2>
                      <p className="text-xs text-[#5c5c5c] mt-0.5">
                        Automated Requisitions, Purchase Orders, and Automated Three-Way Matching gatekeeper.
                      </p>
                    </div>
                    <ThreeWayMatchView />
                  </div>
                </RoleGuard>
              )}

              {activeTab === "Site Progress & Diary" && (
                <RoleGuard permission="Progress">
                  <div className="space-y-4">
                    <div className="glass-card p-4">
                      <h2 className="text-base font-bold text-[#1b1b1b] tracking-tight">
                        Site Execution, Daily Diary &amp; Snagging
                      </h2>
                      <p className="text-xs text-[#5c5c5c] mt-0.5">
                        Weather-stamped daily logs, workforce muster, photographic records, and snag remediation.
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
                <div className="glass-card p-6 md:p-8 max-w-2xl mx-auto text-center space-y-4">
                  <h3 className="text-lg font-bold text-[#1b1b1b]">Project Settings &amp; Account</h3>
                  <p className="text-xs text-[#5c5c5c] max-w-md mx-auto">
                    Manage project currencies, timezones, notification rules, team profiles, and session security.
                  </p>
                  <div className="pt-2 flex flex-wrap justify-center gap-3">
                    <button
                      onClick={() => (window.location.href = "/settings")}
                      className="px-4 py-2 bg-[#0067c0] hover:bg-[#005ba1] text-white font-semibold text-xs rounded-lg shadow-sm transition-all"
                    >
                      Open Full Settings →
                    </button>
                    <button
                      onClick={() => (window.location.href = "/account")}
                      className="px-4 py-2 bg-white hover:bg-[#f5f5f5] text-[#1b1b1b] border border-[#d5d5d5] font-semibold text-xs rounded-lg shadow-sm transition-all"
                    >
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
