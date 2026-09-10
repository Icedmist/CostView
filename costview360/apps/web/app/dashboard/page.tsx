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
  Sparkles,
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
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0]/40 font-sans text-slate-900">
      <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen((v) => !v)} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {activeMode === "commercial" ? (
            <CommercialView />
          ) : (
            <>
              {activeTab === "Dashboard" && (
                <div className="space-y-6">
                  {/* Smooth Pearl Glass Hero Banner */}
                  <div className="smooth-pearl-hero p-6 md:p-8 relative overflow-hidden shadow-pearl border border-sky-200/80 text-slate-900">
                    <div className="pointer-events-none absolute -right-16 -bottom-16 w-64 h-64 bg-gradient-to-br from-sky-400/15 via-blue-500/10 to-indigo-500/10 rounded-full blur-3xl animate-float" />
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                      <div>
                        <div className="flex flex-wrap items-center gap-2.5 mb-3">
                          <span className="text-xs font-bold px-3 py-1 bg-sky-100 text-[#0067c0] rounded-full border border-sky-200 backdrop-blur-md shadow-xs">
                            Site Operations Command
                          </span>
                          <span className="text-slate-500 text-xs font-medium">· Active Role: {activeRole}</span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
                          Project Cost &amp; Execution <span className="bg-gradient-to-r from-[#0067c0] via-[#0284c7] to-[#38bdf8] bg-clip-text text-transparent">Intelligence</span>
                        </h1>
                        <p className="text-xs text-slate-600 mt-2 max-w-2xl leading-relaxed font-normal">
                          Consolidated baseline budget allocation, committed vendor purchase orders, certified subcontractor valuations, and live shift progress records.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          onClick={() => setActiveTab("Budget & BOQ")}
                          className="px-4 py-2.5 bg-gradient-to-r from-[#0067c0] to-[#0284c7] hover:from-[#005ba1] hover:to-[#0275b0] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-600/20 transition-all active:scale-[0.98]"
                        >
                          <span>Manage BOQ Master</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setActiveTab("Procurement")}
                          className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 rounded-xl text-xs font-semibold backdrop-blur-md transition-all shadow-xs"
                        >
                          Verify 3-Way Match
                        </button>
                      </div>
                    </div>

                    {/* Quick Telemetry Strip */}
                    <div className="mt-6 pt-5 border-t border-slate-200/80 flex flex-wrap gap-6 text-xs text-slate-700">
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Execution Progress</div>
                        <div className="text-base font-extrabold text-slate-900 mt-0.5">62% Complete</div>
                      </div>
                      <div className="h-8 w-[1px] bg-slate-200 hidden sm:block" />
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Financial Health</div>
                        <div className="text-base font-extrabold text-emerald-600 mt-0.5">Healthy (1.04 CPI)</div>
                      </div>
                      <div className="h-8 w-[1px] bg-slate-200 hidden sm:block" />
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Active Worksite</div>
                        <div className="text-base font-extrabold text-slate-900 mt-0.5">Shift #142 · 48 Active Crew</div>
                      </div>
                    </div>
                  </div>

                  <MetricCards
                    approvedBudget={approvedBudget}
                    committedCost={committedCost}
                    actualCost={actualCost}
                  />

                  {/* Attention Cards - Luminous Glassmorphism */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div
                      onClick={() => setActiveTab("Procurement")}
                      className="cursor-pointer bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-5 shadow-card hover:shadow-glass hover:border-rose-300 hover:-translate-y-0.5 transition-all min-h-[130px] flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2.5">
                          <span className="text-xs font-bold flex items-center gap-2 text-slate-900">
                            <span className="w-7 h-7 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center border border-rose-200/60">
                              <AlertTriangle className="w-4 h-4" />
                            </span>
                            Invoice Discrepancy
                          </span>
                          <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-200/80 px-2 py-0.5 rounded-full font-bold uppercase">
                            Action Needed
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-800">
                          Pulkit Steels &amp; Alloys (PO-2026-092)
                        </p>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed font-normal">
                          Invoiced for 30 Tons, but GRN receipts confirm only 27 Tons delivered. Payment locked automatically.
                        </p>
                      </div>
                    </div>

                    <div
                      onClick={() => setActiveTab("Budget & BOQ")}
                      className="cursor-pointer bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-5 shadow-card hover:shadow-glass hover:border-amber-300 hover:-translate-y-0.5 transition-all min-h-[130px] flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2.5">
                          <span className="text-xs font-bold flex items-center gap-2 text-slate-900">
                            <span className="w-7 h-7 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center border border-amber-200/60">
                              <Clock className="w-4 h-4" />
                            </span>
                            Pending Revision
                          </span>
                          <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200/80 px-2 py-0.5 rounded-full font-bold uppercase">
                            QS Valuation
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-800">
                          CON-02.01 Grade 30 ReadyMix
                        </p>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed font-normal">
                          +₦4,000,000 delta requested due to diesel pump price adjustment awaiting approval.
                        </p>
                      </div>
                    </div>

                    <div
                      onClick={() => setActiveTab("Site Progress & Diary")}
                      className="cursor-pointer bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-5 shadow-card hover:shadow-glass hover:border-emerald-300 hover:-translate-y-0.5 transition-all min-h-[130px] flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2.5">
                          <span className="text-xs font-bold flex items-center gap-2 text-slate-900">
                            <span className="w-7 h-7 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center border border-emerald-200/60">
                              <CheckCircle2 className="w-4 h-4" />
                            </span>
                            Site Execution Sync
                          </span>
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2 py-0.5 rounded-full font-bold uppercase">
                            Today
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-800">
                          48 Workers · Shift #142 Active
                        </p>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed font-normal">
                          2 active snags logged on Block B. 0 safety incidents recorded across 142 consecutive shifts.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-xs font-bold text-slate-500 tracking-wide uppercase">
                        Bill of Quantities — Master Register &amp; Variances
                      </h2>
                      <button
                        onClick={() => setActiveTab("Budget & BOQ")}
                        className="text-xs font-semibold text-[#0067c0] hover:underline flex items-center gap-1"
                      >
                        <span>Open Full BOQ Register</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <BOQTable />
                  </div>
                </div>
              )}

              {activeTab === "Budget & BOQ" && (
                <RoleGuard permission="Budget">
                  <div className="space-y-4">
                    <div className="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-5 shadow-card">
                      <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                        Budget Master &amp; Bill of Quantities
                      </h2>
                      <p className="text-xs text-slate-500 mt-1 font-normal">
                        Line-item budget baseline vs committed purchase orders vs certified actuals, with complete revision audit trails.
                      </p>
                    </div>
                    <BOQTable />
                  </div>
                </RoleGuard>
              )}

              {activeTab === "Procurement" && (
                <RoleGuard permission="Procurement">
                  <div className="space-y-4">
                    <div className="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-5 shadow-card">
                      <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                        Procurement Lifecycle &amp; Three-Way Match
                      </h2>
                      <p className="text-xs text-slate-500 mt-1 font-normal">
                        Automated Requisitions, Purchase Orders, and Automated Three-Way Matching gatekeeper holding unauthorized disbursements.
                      </p>
                    </div>
                    <ThreeWayMatchView />
                  </div>
                </RoleGuard>
              )}

              {activeTab === "Materials & Stock" && (
                <RoleGuard permission="Materials">
                  <div className="space-y-4">
                    <div className="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-5 shadow-card">
                      <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                        Materials Inventory &amp; Stock Ledger
                      </h2>
                      <p className="text-xs text-slate-500 mt-1 font-normal">
                        Warehouse on-hand, reserved, and consumed stock levels with storekeeper gate-pass transfer records.
                      </p>
                    </div>
                    <MaterialsStockView />
                  </div>
                </RoleGuard>
              )}

              {activeTab === "Labour & Muster" && (
                <RoleGuard permission="Labour">
                  <div className="space-y-4">
                    <div className="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-5 shadow-card">
                      <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                        Labour Headcount &amp; Shift Muster Roll
                      </h2>
                      <p className="text-xs text-slate-500 mt-1 font-normal">
                        Trade and gang rosters, overtime calculations, and productivity yield linked directly to BOQ work items.
                      </p>
                    </div>
                    <LabourView />
                  </div>
                </RoleGuard>
              )}

              {activeTab === "Site Progress & Diary" && (
                <RoleGuard permission="Progress">
                  <div className="space-y-4">
                    <div className="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-5 shadow-card">
                      <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                        Digital Site Diary, Snags &amp; Safety
                      </h2>
                      <p className="text-xs text-slate-500 mt-1 font-normal">
                        Daily shift logs, weather conditions stamps, photo proof documentation, and NCR remediation workflows.
                      </p>
                    </div>
                    <SiteDiaryView />
                  </div>
                </RoleGuard>
              )}

              {activeTab === "Subcontractors" && (
                <RoleGuard permission="Subcontractors">
                  <div className="space-y-4">
                    <div className="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-5 shadow-card">
                      <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                        Subcontractor Valuations &amp; Performance
                      </h2>
                      <p className="text-xs text-slate-500 mt-1 font-normal">
                        Interim valuations, certified claims, retention deductions, and 4-factor contractor grading scorecard.
                      </p>
                    </div>
                    <SubcontractorView />
                  </div>
                </RoleGuard>
              )}

              {activeTab === "Variations & Claims" && (
                <RoleGuard permission="Variations">
                  <div className="space-y-4">
                    <div className="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-5 shadow-card">
                      <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                        Variations Register &amp; Claims Governance
                      </h2>
                      <p className="text-xs text-slate-500 mt-1 font-normal">
                        Architect instructions, QS cost evaluations, and PM approval thresholds updating the live BOQ baseline.
                      </p>
                    </div>
                    <BOQTable />
                  </div>
                </RoleGuard>
              )}

              {activeTab === "Reports Studio" && (
                <RoleGuard permission="Reports">
                  <div className="space-y-4">
                    <div className="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-5 shadow-card">
                      <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                        Executive Reports Studio
                      </h2>
                      <p className="text-xs text-slate-500 mt-1 font-normal">
                        10 branded audit-ready PDF and CSV exports for commercial banking, client valuations, and internal audits.
                      </p>
                    </div>
                    <ReportsView />
                  </div>
                </RoleGuard>
              )}

              {activeTab === "Admin & Roles" && (
                <RoleGuard permission="Admin">
                  <div className="space-y-4">
                    <div className="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-5 shadow-card">
                      <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                        System Administration &amp; Immutable Audit Logs
                      </h2>
                      <p className="text-xs text-slate-500 mt-1 font-normal">
                        Real-time Postgres Row-Level Security actor activity trails and user permission matrices.
                      </p>
                    </div>
                    <AuditLogView />
                  </div>
                </RoleGuard>
              )}

              {activeTab === "Settings" && (
                <div className="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 shadow-card">
                  <h2 className="text-lg font-bold text-slate-900">Project &amp; Workspace Settings</h2>
                  <p className="text-xs text-slate-500 mt-1 mb-6">Configure project base currency, timezones, and system defaults.</p>
                  <div className="max-w-md space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Project Name</label>
                      <input defaultValue="Horizon Towers - Eko Atlantic" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-[#0067c0]" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Base Working Currency</label>
                      <select defaultValue="NGN" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:border-[#0067c0]">
                        <option value="NGN">₦ NGN — Nigerian Naira</option>
                        <option value="USD">$ USD — US Dollar</option>
                        <option value="GBP">£ GBP — British Pound</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Variance Alert Threshold</label>
                      <input defaultValue="±5%" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-[#0067c0]" />
                    </div>
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
