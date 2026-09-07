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
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  AlertTriangle,
  Building,
  CheckCircle2,
  Clock,
} from "lucide-react";

export default function Home() {
  const { activeMode, activeRole, currentProject } = useApp();
  const [activeTab, setActiveTab] = useState("Dashboard");

  // Summary Metrics for Dashboard
  const approvedBudget = 301815000;
  const committedCost = 292250000;
  const actualCost = 216400000;

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950 font-sans">
      {/* Navigation Sidebar */}
      <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Main App Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* If Mode is Commercial, render the Commercial Command Center */}
          {activeMode === "commercial" ? (
            <CommercialView />
          ) : (
            /* Site Operations Mode */
            <>
              {activeTab === "Dashboard" && (
                <div className="space-y-6">
                  {/* Executive Banner */}
                  <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 border border-zinc-800 rounded-xl p-5 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-mono">
                            Site Operations Command Center
                          </span>
                          <span className="text-zinc-500 text-xs">· Role: {activeRole}</span>
                        </div>
                        <h1 className="text-lg font-bold text-white tracking-tight">
                          Project Cost & Execution Status
                        </h1>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          Consolidated budget, committed POs, site deliveries, and approval alerts.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveTab("Budget & BOQ")}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
                        >
                          <span>Manage BOQ & Revisions</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setActiveTab("Procurement")}
                          className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-semibold border border-zinc-700 transition-colors"
                        >
                          <span>View 3-Way Match</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Financial KPI Cards */}
                  <MetricCards
                    approvedBudget={approvedBudget}
                    committedCost={committedCost}
                    actualCost={actualCost}
                  />

                  {/* Attention Required Cards (PRD Section 5.1: Attention Items) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Discrepancy Alert */}
                    <div
                      onClick={() => setActiveTab("Procurement")}
                      className="cursor-pointer bg-zinc-900 border border-amber-900/40 hover:border-amber-700/60 p-4 rounded-xl transition-all shadow-sm"
                    >
                      <div className="flex items-center justify-between text-amber-400 mb-2">
                        <span className="text-xs font-bold flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                          1 Invoice Discrepancy
                        </span>
                        <span className="text-[10px] bg-amber-950 text-amber-300 px-1.5 py-0.5 rounded font-mono font-semibold">
                          Action Needed
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300 font-medium">
                        Pulkit Steels & Alloys (PO-2026-092)
                      </p>
                      <p className="text-[11px] text-zinc-400 mt-1">
                        Invoiced for 30 Tons, but GRN shows only 27 Tons delivered. Payment release locked.
                      </p>
                    </div>

                    {/* Pending Budget Revision */}
                    <div
                      onClick={() => setActiveTab("Budget & BOQ")}
                      className="cursor-pointer bg-zinc-900 border border-zinc-800 hover:border-zinc-700 p-4 rounded-xl transition-all shadow-sm"
                    >
                      <div className="flex items-center justify-between text-emerald-400 mb-2">
                        <span className="text-xs font-bold flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-emerald-400" />
                          Pending Rate Revision
                        </span>
                        <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded font-mono font-semibold">
                          QS Valuation
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300 font-medium">
                        CON-02.01 Grade 30 ReadyMix Concrete
                      </p>
                      <p className="text-[11px] text-zinc-400 mt-1">
                        +₦4,000,000 delta requested due to diesel pump price adjustment.
                      </p>
                    </div>

                    {/* Site Diary & Snags */}
                    <div
                      onClick={() => setActiveTab("Site Progress & Diary")}
                      className="cursor-pointer bg-zinc-900 border border-zinc-800 hover:border-zinc-700 p-4 rounded-xl transition-all shadow-sm"
                    >
                      <div className="flex items-center justify-between text-blue-400 mb-2">
                        <span className="text-xs font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-blue-400" />
                          Site Execution Sync
                        </span>
                        <span className="text-[10px] bg-blue-950 text-blue-300 px-1.5 py-0.5 rounded font-mono font-semibold">
                          Today
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300 font-medium">
                        48 Workers Headcount · Shift #142
                      </p>
                      <p className="text-[11px] text-zinc-400 mt-1">
                        2 active snags under remediation on Block B. 0 lost-time safety incidents.
                      </p>
                    </div>
                  </div>

                  {/* BOQ Overview Preview */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-sm font-bold text-white tracking-tight">
                        Bill of Quantities (BOQ) Summary & Variances
                      </h2>
                      <button
                        onClick={() => setActiveTab("Budget & BOQ")}
                        className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
                      >
                        View Full Budget Breakdown →
                      </button>
                    </div>
                    <BOQTable />
                  </div>
                </div>
              )}

              {activeTab === "Budget & BOQ" && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-base font-bold text-white tracking-tight">
                      Budget Management & Bill of Quantities (BOQ)
                    </h2>
                    <p className="text-xs text-zinc-400">
                      Line-item budget vs committed (POs) vs actual (certified), with revision audit trails.
                    </p>
                  </div>
                  <BOQTable />
                </div>
              )}

              {activeTab === "Procurement" && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-base font-bold text-white tracking-tight">
                      Procurement Lifecycle & Invoice Validation
                    </h2>
                    <p className="text-xs text-zinc-400">
                      Requisitions, Purchase Orders, and Automated Three-Way Financial Matching.
                    </p>
                  </div>
                  <ThreeWayMatchView />
                </div>
              )}

              {activeTab === "Site Progress & Diary" && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-base font-bold text-white tracking-tight">
                      Site Execution, Daily Diary & Snagging
                    </h2>
                    <p className="text-xs text-zinc-400">
                      Weather-stamped daily logs, workforce muster, and quality non-conformance remediation.
                    </p>
                  </div>
                  <SiteDiaryView />
                </div>
              )}

              {activeTab === "Materials & Stock" && <MaterialsStockView />}

              {activeTab === "Labour & Muster" && <LabourView />}

              {(activeTab === "Subcontractors" || activeTab === "Variations & Claims") && (
                <SubcontractorView />
              )}

              {activeTab === "Reports Studio" && <ReportsView />}

              {activeTab === "Admin & Roles" && <AuditLogView />}

              {activeTab === "Settings" && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
                  <h3 className="text-sm font-bold text-white">Project Settings & Configuration</h3>
                  <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                    Manage default currency (₦ NGN), timezone (Africa/Lagos), and notification channels.
                  </p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
