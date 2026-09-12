"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/app/providers";
import { Sidebar, NAVIGATION_SECTIONS } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MetricCards } from "@/components/dashboard/metric-cards";
import { BOQTable } from "@/components/budget/boq-table";
import { ThreeWayMatchView } from "@/components/procurement/three-way-match";
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
  ChevronRight,
  Calculator,
  ShoppingCart,
  Briefcase,
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
      "Contracts & Subcontractors": "Subcontractors",
      Administration: "Admin",
    };
    const perm = permMap[activeSection];
    if (perm && !canAccess(activeRole, perm as any)) {
      handleNavSelect("Command Center", "telemetry");
    }
  }, [activeRole, activeSection]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAF9F5] font-sans text-slate-900">
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

        <main className="flex-1 overflow-y-auto p-5 md:p-8 space-y-8 bg-[#FAF9F5]">
          {/* 1. COMMAND CENTER */}
          {activeSection === "Command Center" && (
            <div className="space-y-8">
              {/* Bright Navy Hero Banner */}
              <div className="bg-[#0A2540] rounded-2xl p-7 md:p-10 text-white shadow-xl relative overflow-hidden border-2 border-[#0A2540]">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-3.5">
                      <span className="text-xs font-black uppercase tracking-wider px-3.5 py-1 bg-white/10 text-white rounded-lg border border-white/20">
                        Executive Command Center
                      </span>
                      <span className="text-white/80 text-xs font-bold">
                        · Active Simulator Role: <strong className="text-white underline">{activeRole}</strong>
                      </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                      Construction Cost &amp; Operations Intelligence
                    </h1>
                    <p className="text-base text-white/80 mt-2.5 max-w-2xl leading-relaxed font-normal">
                      Consolidated baseline BOQs, 3-way matching gate, subcontractor valuations, and site diary shift logs unified under deep construction governance.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3.5">
                    <button
                      onClick={() => handleNavSelect("Budget & BOQ", "boq")}
                      className="min-h-[46px] px-6 py-3 bg-white hover:bg-slate-100 text-[#0A2540] rounded-xl text-sm font-extrabold flex items-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer"
                    >
                      <span>Manage BOQ Master</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleNavSelect("Procurement", "match")}
                      className="min-h-[46px] px-6 py-3 bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 rounded-xl text-sm font-extrabold transition-all shadow-xs cursor-pointer"
                    >
                      Verify 3-Way Match Gate
                    </button>
                    {activeRole === "Admin" && (
                      <button
                        onClick={() => handleNavSelect("Administration", "users")}
                        className="min-h-[46px] px-6 py-3 bg-white text-[#0A2540] hover:bg-slate-100 rounded-xl text-sm font-extrabold flex items-center gap-2 transition-all shadow-md cursor-pointer"
                      >
                        <UserPlus className="w-4 h-4 text-[#0A2540]" />
                        <span>User &amp; Role Hub</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Quick Telemetry Strip */}
                <div className="mt-8 pt-6 border-t-2 border-white/10 flex flex-wrap gap-10 text-sm text-white/80">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-white/60 font-black">Execution Progress</div>
                    <div className="text-xl md:text-2xl font-black text-white mt-1">62% Superstructure</div>
                  </div>
                  <div className="h-10 w-[2px] bg-white/10 hidden sm:block" />
                  <div>
                    <div className="text-xs uppercase tracking-wider text-white/60 font-black">Financial Health</div>
                    <div className="text-xl md:text-2xl font-black text-emerald-400 mt-1">Healthy (1.04 CPI)</div>
                  </div>
                  <div className="h-10 w-[2px] bg-white/10 hidden sm:block" />
                  <div>
                    <div className="text-xs uppercase tracking-wider text-white/60 font-black">Active Worksite</div>
                    <div className="text-xl md:text-2xl font-black text-white mt-1">Shift #142 · 48 Active Crew</div>
                  </div>
                </div>
              </div>

              {/* Metric KPI Cards */}
              <MetricCards
                approvedBudget={approvedBudget}
                committedCost={committedCost}
                actualCost={actualCost}
              />

              {/* Operational Telemetry Sub-Views */}
              {activeSubSection === "alerts" ? (
                <div className="space-y-5">
                  <div className="p-6 rounded-2xl bg-white border-2 border-[#E5E5DE] shadow-sm">
                    <h3 className="text-lg font-black text-[#0A2540] flex items-center gap-2 mb-4">
                      <AlertTriangle className="w-5 h-5 text-rose-600" /> Active Attention &amp; Variance Alerts
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-5 rounded-xl bg-rose-50 border-2 border-rose-200 text-rose-950">
                        <div className="text-sm font-black uppercase tracking-wider text-rose-700">Procurement Discrepancy</div>
                        <div className="text-base font-extrabold mt-1">PO-2026-092 (Pulkit Steels) Locked</div>
                        <p className="text-sm text-rose-800 mt-1 leading-relaxed">
                          Invoice billed 30T vs 27T physical GRN receipt delivered to site. Automatic payment disbursement hold active.
                        </p>
                        <button
                          onClick={() => handleNavSelect("Procurement", "match")}
                          className="mt-3.5 px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-black uppercase tracking-wider shadow-xs hover:bg-rose-700 cursor-pointer"
                        >
                          Resolve Discrepancy →
                        </button>
                      </div>

                      <div className="p-5 rounded-xl bg-[#FAF9F5] border-2 border-[#E5E5DE] text-[#0A2540]">
                        <div className="text-sm font-black uppercase tracking-wider text-[#0A2540]/60">BOQ Baseline Drift</div>
                        <div className="text-base font-extrabold mt-1">CON-02.01 (+₦4M Variance Pending)</div>
                        <p className="text-sm text-[#0A2540]/80 mt-1 leading-relaxed">
                          Substructure ready-mix concrete pump rates updated. Awaiting formal Quantity Surveyor delta sign-off.
                        </p>
                        <button
                          onClick={() => handleNavSelect("Budget & BOQ", "revisions")}
                          className="mt-3.5 px-4 py-2 bg-[#0A2540] text-white rounded-lg text-xs font-black uppercase tracking-wider shadow-xs hover:bg-[#003366] cursor-pointer"
                        >
                          Review Revision Delta →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : activeSubSection === "health" ? (
                <div className="bg-white border-2 border-[#E5E5DE] rounded-2xl p-7 shadow-sm">
                  <h3 className="text-xl font-black text-[#0A2540] mb-3">Baseline Financial Health &amp; Earned Value</h3>
                  <p className="text-sm text-[#0A2540]/70 mb-6">
                    Real-time index comparing planned schedule value against certified work performance and physical delivery receipts.
                  </p>
                  <div className="grid sm:grid-cols-3 gap-6">
                    <div className="p-5 rounded-xl bg-[#FAF9F5] border-2 border-[#E5E5DE]">
                      <div className="text-xs font-black uppercase tracking-wider text-[#0A2540]/60">Cost Performance Index (CPI)</div>
                      <div className="text-3xl font-black font-mono text-emerald-700 mt-2">1.04</div>
                      <div className="text-xs text-emerald-800 font-bold mt-1">Under budget by 4% per naira spent</div>
                    </div>
                    <div className="p-5 rounded-xl bg-[#FAF9F5] border-2 border-[#E5E5DE]">
                      <div className="text-xs font-black uppercase tracking-wider text-[#0A2540]/60">Schedule Performance Index (SPI)</div>
                      <div className="text-3xl font-black font-mono text-[#0A2540] mt-2">0.98</div>
                      <div className="text-xs text-[#0A2540]/70 font-bold mt-1">2% schedule delay on rebar fixing</div>
                    </div>
                    <div className="p-5 rounded-xl bg-[#FAF9F5] border-2 border-[#E5E5DE]">
                      <div className="text-xs font-black uppercase tracking-wider text-[#0A2540]/60">Certified Retention Escrow</div>
                      <div className="text-3xl font-black font-mono text-[#0A2540] mt-2">₦21.6M</div>
                      <div className="text-xs text-[#0A2540]/70 font-bold mt-1">10% retained until defects liability signoff</div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Telemetry Overview: BOQ & 3-Way Match Quick Modules */
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* BOQ Summary Card */}
                  <div className="bg-white border-2 border-[#E5E5DE] rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b-2 border-[#E5E5DE]">
                      <div>
                        <h3 className="text-lg font-black text-[#0A2540] flex items-center gap-2.5">
                          <Calculator className="w-5 h-5 text-[#0A2540]" /> Contractual BOQ Master
                        </h3>
                        <p className="text-xs font-semibold text-[#0A2540]/60 mt-1">Active items tracked against contractual budget cap</p>
                      </div>
                      <button
                        onClick={() => handleNavSelect("Budget & BOQ", "boq")}
                        className="px-4 py-2 bg-[#FAF9F5] hover:bg-[#F2F1EC] text-[#0A2540] border-2 border-[#E5E5DE] rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <span>Open Register</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      {[
                        { code: "CON-02.01", desc: "Grade 30 reinforced concrete raft", budget: "₦93.6M", committed: "₦94.0M", over: true },
                        { code: "STL-02.03", desc: "High-yield deformed rebar Y16 & Y20", budget: "₦78.2M", committed: "₦72.0M", over: false },
                        { code: "EAR-01.02", desc: "Bulk site excavation & cart-away", budget: "₦42.0M", committed: "₦38.5M", over: false },
                      ].map((item) => (
                        <div key={item.code} className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E5E5DE] flex items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-black text-[#0A2540]">{item.code}</span>
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${item.over ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-800"}`}>
                                {item.over ? "VARIANCE FLAGGED" : "ON TRACK"}
                              </span>
                            </div>
                            <div className="text-sm font-bold text-slate-800 mt-1">{item.desc}</div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-sm font-black font-mono text-[#0A2540]">{item.committed}</div>
                            <div className="text-xs text-[#0A2540]/60 font-semibold">of {item.budget}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3-Way Match Quick Summary Card */}
                  <div className="bg-white border-2 border-[#E5E5DE] rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b-2 border-[#E5E5DE]">
                      <div>
                        <h3 className="text-lg font-black text-[#0A2540] flex items-center gap-2.5">
                          <ShoppingCart className="w-5 h-5 text-[#0A2540]" /> Three-Way Match Engine
                        </h3>
                        <p className="text-xs font-semibold text-[#0A2540]/60 mt-1">PO ⇄ GRN ⇄ Invoice automated payment verification</p>
                      </div>
                      <button
                        onClick={() => handleNavSelect("Procurement", "match")}
                        className="px-4 py-2 bg-[#FAF9F5] hover:bg-[#F2F1EC] text-[#0A2540] border-2 border-[#E5E5DE] rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <span>Open Gate</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      {[
                        { id: "PO-2026-092", vendor: "Pulkit Steels Ltd", items: "30T Y16 Rebar", status: "DISCREPANCY LOCKED", locked: true },
                        { id: "PO-2026-088", vendor: "Dangote Cement PLC", items: "600 Bags Grade 42.5R", status: "MATCH VERIFIED", locked: false },
                        { id: "PO-2026-081", vendor: "Lafarge Readymix", items: "45m³ Grade 30 Concrete", status: "MATCH VERIFIED", locked: false },
                      ].map((po) => (
                        <div key={po.id} className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E5E5DE] flex items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-black text-[#0A2540]">{po.id}</span>
                              <span className="text-xs font-bold text-slate-600">· {po.vendor}</span>
                            </div>
                            <div className="text-sm font-bold text-slate-800 mt-1">{po.items}</div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className={`text-xs font-black px-2.5 py-1 rounded-full ${po.locked ? "bg-rose-100 text-rose-800 border border-rose-300" : "bg-emerald-100 text-emerald-800 border border-emerald-300"}`}>
                              {po.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. BUDGET & BOQ MASTER */}
          {activeSection === "Budget & BOQ" && (
            <RoleGuard permission="Budget">
              <BOQTable />
            </RoleGuard>
          )}

          {/* 3. PROCUREMENT LIFECYCLE */}
          {activeSection === "Procurement" && (
            <RoleGuard permission="Procurement">
              <ThreeWayMatchView
                initialSubTab={activeSubSection as any}
                onTabChange={(tab) => setActiveSubSection(tab)}
              />
            </RoleGuard>
          )}

          {/* 4. SITE OPERATIONS */}
          {activeSection === "Site Operations" && (
            <RoleGuard permission="Progress">
              <div className="space-y-6">
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

          {/* 5. CONTRACTS & SUBCONTRACTORS (Commercial removed) */}
          {activeSection === "Contracts & Subcontractors" && (
            <RoleGuard permission="Subcontractors">
              <div className="space-y-6">
                <SubcontractorView
                  initialSubTab={activeSubSection as any}
                  onTabChange={(tab) => setActiveSubSection(tab)}
                />
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
