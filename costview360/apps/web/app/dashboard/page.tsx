"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/app/providers";
import { Sidebar, NAVIGATION_SECTIONS } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MetricCards } from "@/components/dashboard/metric-cards";
import { BOQTable } from "@/components/budget/boq-table";
import { ThreeWayMatchView } from "@/components/procurement/three-way-match";
import { CommercialView } from "@/components/commercial/commercial-view";
import { SiteDiaryView } from "@/components/site-ops/site-diary-view";
import { MaterialsStockView } from "@/components/materials/materials-stock-view";
import { LabourView } from "@/components/labour/labour-view";
import { SubcontractorView } from "@/components/subcontractors/subcontractor-view";
import { UserRoleManager } from "@/components/admin/user-role-manager";
import {
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  UserPlus,
  Boxes,
  Users,
  HardHat,
} from "lucide-react";
import { RoleGuard } from "@/components/auth/role-guard";
import { canAccess } from "@/lib/auth/permissions";
import { useSessionExpiry } from "@/lib/auth/session";

export default function DashboardPage() {
  const { activeRole } = useApp();
  const [activeSection, setActiveSection] = useState("Command Center");
  const [activeSubSection, setActiveSubSection] = useState("telemetry");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const approvedBudget = 301815000;
  const committedCost = 292250000;
  const actualCost = 216400000;

  useSessionExpiry();

  // Navigation state coordinator
  const handleNavSelect = (section: string, subSection?: string) => {
    setActiveSection(section);
    if (subSection) {
      setActiveSubSection(subSection);
    } else {
      const primary = NAVIGATION_SECTIONS.find((s) => s.id === section);
      setActiveSubSection(primary?.subSections[0]?.id || "");
    }
  };

  // Auto-redirect if current section not allowed for role
  useEffect(() => {
    const permMap: Record<string, string> = {
      "Budget & BOQ": "Budget",
      Procurement: "Procurement",
      "Site Operations": "Progress",
      "Commercial & Contracts": "Subcontractors",
      Administration: "Admin",
    };
    const perm = permMap[activeSection];
    if (perm && !canAccess(activeRole, perm as any)) {
      handleNavSelect("Command Center", "telemetry");
    }
  }, [activeRole, activeSection]);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-900">
      <Sidebar
        activeSection={activeSection}
        activeSubSection={activeSubSection}
        onSelectNav={handleNavSelect}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          onMenuClick={() => setSidebarOpen((v) => !v)}
          activeSection={activeSection}
          activeSubSection={activeSubSection}
          onSelectNav={handleNavSelect}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {/* 1. COMMAND CENTER */}
          {activeSection === "Command Center" && (
            <div className="space-y-6">
              {/* Deep Construction Navy Hero Banner */}
              <div className="bg-gradient-to-r from-[#0A1931] via-[#0F2137] to-[#142C4E] rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
                <div className="pointer-events-none absolute -right-16 -bottom-16 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5 mb-3">
                      <span className="text-xs font-bold px-3 py-1 bg-white/10 text-amber-300 rounded-full border border-white/20 backdrop-blur-md">
                        Executive Command Center
                      </span>
                      <span className="text-slate-300 text-xs font-semibold">
                        · Active Simulator Role: <strong className="text-white underline">{activeRole}</strong>
                      </span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
                      Construction Cost &amp; Operations <span className="text-[#D4A017]">Intelligence</span>
                    </h1>
                    <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed font-normal">
                      Consolidated baseline BOQs, 3-way matching gate, subcontractor valuations, and site diary shift logs unified under deep construction governance.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => handleNavSelect("Budget & BOQ", "boq")}
                      className="px-4 py-2.5 bg-[#D4A017] hover:bg-[#E8B838] text-[#0A1931] rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer"
                    >
                      <span>Manage BOQ Master</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleNavSelect("Procurement", "match")}
                      className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      Verify 3-Way Match Gate
                    </button>
                    {activeRole === "Admin" && (
                      <button
                        onClick={() => handleNavSelect("Administration", "users")}
                        className="px-4 py-2.5 bg-white text-[#0A1931] hover:bg-slate-100 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                      >
                        <UserPlus className="w-4 h-4 text-[#0A1931]" />
                        <span>User &amp; Role Hub</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Quick Telemetry Strip */}
                <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap gap-8 text-xs text-slate-300">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Execution Progress</div>
                    <div className="text-lg font-extrabold text-white mt-0.5">62% Superstructure</div>
                  </div>
                  <div className="h-8 w-[1px] bg-white/10 hidden sm:block" />
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Financial Health</div>
                    <div className="text-lg font-extrabold text-emerald-400 mt-0.5">Healthy (1.04 CPI)</div>
                  </div>
                  <div className="h-8 w-[1px] bg-white/10 hidden sm:block" />
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Active Worksite</div>
                    <div className="text-lg font-extrabold text-white mt-0.5">Shift #142 · 48 Active Crew</div>
                  </div>
                </div>
              </div>

              {/* Metric KPI Cards */}
              <MetricCards
                approvedBudget={approvedBudget}
                committedCost={committedCost}
                actualCost={actualCost}
              />

              {/* Attention Cards - High-Contrast 1-Click Navigation */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  onClick={() => handleNavSelect("Procurement", "match")}
                  className="cursor-pointer bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-rose-400 hover:shadow-md hover:-translate-y-0.5 transition-all min-h-[140px] flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-xs font-bold flex items-center gap-2 text-slate-900">
                        <span className="w-8 h-8 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center border border-rose-200">
                          <AlertTriangle className="w-4 h-4" />
                        </span>
                        <span>Procurement Match Discrepancy</span>
                      </span>
                      <span className="text-[10px] bg-rose-100 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-full font-bold uppercase">
                        Payment Locked
                      </span>
                    </div>
                    <p className="text-sm font-extrabold text-slate-900 group-hover:text-[#0A1931]">
                      Pulkit Steels &amp; Alloys (PO-2026-092)
                    </p>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Invoiced for 30 Tons, but GRN receipts confirm only 27 Tons delivered. 3 Tons shortfall automatically holds disbursement.
                    </p>
                  </div>
                  <div className="text-xs font-bold text-[#0A1931] mt-3 flex items-center gap-1 group-hover:underline">
                    <span>Resolve in 3-Way Match</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div
                  onClick={() => handleNavSelect("Budget & BOQ", "revisions")}
                  className="cursor-pointer bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-amber-400 hover:shadow-md hover:-translate-y-0.5 transition-all min-h-[140px] flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-xs font-bold flex items-center gap-2 text-slate-900">
                        <span className="w-8 h-8 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center border border-amber-200">
                          <Clock className="w-4 h-4" />
                        </span>
                        <span>Pending Rate Revision</span>
                      </span>
                      <span className="text-[10px] bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-bold uppercase">
                        QS Valuation
                      </span>
                    </div>
                    <p className="text-sm font-extrabold text-slate-900 group-hover:text-[#0A1931]">
                      CON-02.01 Grade 30 ReadyMix
                    </p>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      +₦4,000,000 delta requested due to diesel pump price adjustment awaiting Quantity Surveyor valuation approval.
                    </p>
                  </div>
                  <div className="text-xs font-bold text-[#0A1931] mt-3 flex items-center gap-1 group-hover:underline">
                    <span>Review in BOQ Register</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div
                  onClick={() => handleNavSelect("Site Operations", "diary")}
                  className="cursor-pointer bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-emerald-400 hover:shadow-md hover:-translate-y-0.5 transition-all min-h-[140px] flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-xs font-bold flex items-center gap-2 text-slate-900">
                        <span className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center border border-emerald-200">
                          <CheckCircle2 className="w-4 h-4" />
                        </span>
                        <span>Site Execution Synchronized</span>
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-bold uppercase">
                        Today Shift
                      </span>
                    </div>
                    <p className="text-sm font-extrabold text-slate-900 group-hover:text-[#0A1931]">
                      48 Workers Active · Shift #142
                    </p>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      2 active snags logged on Block B raft. 0 safety incidents recorded across 142 consecutive shifts.
                    </p>
                  </div>
                  <div className="text-xs font-bold text-[#0A1931] mt-3 flex items-center gap-1 group-hover:underline">
                    <span>Open Site Operations Log</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* BOQ Master Register Preview */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold text-slate-500 tracking-wide uppercase">
                    Bill of Quantities — Master Baseline &amp; Variances
                  </h2>
                  <button
                    onClick={() => handleNavSelect("Budget & BOQ", "boq")}
                    className="text-xs font-bold text-[#0A1931] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Open Full BOQ Register</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <BOQTable />
              </div>
            </div>
          )}

          {/* 2. BUDGET & BOQ MASTER */}
          {activeSection === "Budget & BOQ" && (
            <RoleGuard permission="Budget">
              <div className="space-y-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <h2 className="text-xl font-black text-[#0A1931] tracking-tight">
                    Budget Master Register &amp; Bill of Quantities
                  </h2>
                  <p className="text-xs text-slate-600 mt-1 font-normal">
                    Line-item baseline budget vs committed purchase orders vs certified actuals, with complete rate revision audit trails.
                  </p>
                </div>
                <BOQTable />
              </div>
            </RoleGuard>
          )}

          {/* 3. PROCUREMENT & THREE-WAY MATCH */}
          {activeSection === "Procurement" && (
            <RoleGuard permission="Procurement">
              <div className="space-y-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <h2 className="text-xl font-black text-[#0A1931] tracking-tight">
                    Procurement Lifecycle &amp; Three-Way Match Gate
                  </h2>
                  <p className="text-xs text-slate-600 mt-1 font-normal">
                    Requisitions, RFQ supplier quotes, Purchase Orders, and Automated Three-Way Matching gate holding unauthorized disbursements.
                  </p>
                </div>
                <ThreeWayMatchView
                  initialSubTab={activeSubSection as any}
                  onTabChange={(tab) => setActiveSubSection(tab)}
                />
              </div>
            </RoleGuard>
          )}

          {/* 4. SITE OPERATIONS */}
          {activeSection === "Site Operations" && (
            <RoleGuard permission="Progress">
              <div className="space-y-4">
                {activeSubSection === "stock" ? (
                  <MaterialsStockView />
                ) : activeSubSection === "labour" ? (
                  <LabourView />
                ) : (
                  <SiteDiaryView
                    initialSubTab={activeSubSection as any}
                    onTabChange={(tab) => setActiveSubSection(tab)}
                  />
                )}
              </div>
            </RoleGuard>
          )}

          {/* 5. COMMERCIAL & CONTRACTS */}
          {activeSection === "Commercial & Contracts" && (
            <RoleGuard permission="Subcontractors">
              <div className="space-y-4">
                {activeSubSection === "feasibility" ? (
                  <CommercialView />
                ) : (
                  <SubcontractorView
                    initialSubTab={activeSubSection as any}
                    onTabChange={(tab) => setActiveSubSection(tab)}
                  />
                )}
              </div>
            </RoleGuard>
          )}

          {/* 6. ADMINISTRATION & ROLES */}
          {activeSection === "Administration" && (
            <RoleGuard permission="Admin">
              <UserRoleManager />
            </RoleGuard>
          )}
        </main>
      </div>
    </div>
  );
}
