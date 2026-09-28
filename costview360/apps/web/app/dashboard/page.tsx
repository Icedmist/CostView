"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/app/providers";
import { Sidebar, NAVIGATION_SECTIONS, normalizeSection } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MetricCards } from "@/components/dashboard/metric-cards";
import { MyWorkQueue } from "@/components/dashboard/my-work-queue";
import { CommandPalette } from "@/components/layout/command-palette";
import { BOQTable } from "@/components/budget/boq-table";
import { DrawingsView } from "@/components/drawings/drawings-view";
import { ThreeWayMatchView } from "@/components/procurement/three-way-match";
import { SiteDiaryView } from "@/components/site-ops/site-diary-view";
import { MaterialsStockView } from "@/components/materials/materials-stock-view";
import { LabourView } from "@/components/labour/labour-view";
import { SubcontractorView } from "@/components/subcontractors/subcontractor-view";
import { UserRoleManager } from "@/components/admin/user-role-manager";
import { DataMigrationHub } from "@/components/admin/data-migration-hub";
import { AuditLogView } from "@/components/admin/audit-log-view";
import { WorkspaceSettingsView } from "@/components/settings/workspace-settings";
import { ReportsView } from "@/components/reports/reports-view";
import { TradeDirectoryView } from "@/components/procurement/trade-directory-view";
import { ClientPortalView } from "@/components/portal/client-portal-view";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { ManagementDecisionCenter } from "@/components/dashboard/management-decision-center";
import { RoleGuard } from "@/components/auth/role-guard";
import { canAccess } from "@/lib/auth/permissions";
import { useAppData } from "@/lib/store/app-data";
import { SiteHub } from "@/components/site-ops/site-hub";
import { useSessionExpiry } from "@/lib/auth/session";

export default function DashboardPage() {
  const { activeRole } = useApp();
  const { boqItems } = useAppData();
  const [activeSection, setActiveSection] = useState("Oversight");
  const [activeSubSection, setActiveSubSection] = useState("my-work");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Dynamic budget KPIs calculated from live project BOQ data
  const approvedBudget = boqItems.reduce((acc, it) => acc + (it.budgetAmount || 0), 0);
  const committedCost = boqItems.reduce((acc, it) => acc + (it.committedAmount || 0), 0);
  const actualCost = boqItems.reduce((acc, it) => acc + (it.actualAmount || 0), 0);

  useSessionExpiry();

  // Navigation state coordinator
  const handleNavSelect = (section: string, subSection?: string) => {
    const normalized = normalizeSection(section);
    setActiveSection(normalized);
    if (subSection) {
      setActiveSubSection(subSection);
    } else {
      const primary = NAVIGATION_SECTIONS.find((s) => s.id === normalized);
      setActiveSubSection(primary?.subSections[0]?.id || (normalized === "Oversight" ? "my-work" : ""));
    }
  };

  // Keyboard shortcut listener for Command Search (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Auto-redirect if current section not allowed for role
  useEffect(() => {
    const permMap: Record<string, string> = {
      "Cost Plan": "Budget",
      "Buy & Supply": "Procurement",
      "Site": "Progress",
      "Contracts": "Subcontractors",
    };
    const perm = permMap[activeSection];
    if (perm && !canAccess(activeRole, perm as any)) {
      handleNavSelect("Oversight", "my-work");
    }
  }, [activeRole, activeSection]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAF9F5] dark:bg-[#071324] font-sans text-slate-900 dark:text-slate-100">
      <Sidebar
        activeSection={activeSection}
        activeSubSection={activeSubSection}
        onSelectNav={handleNavSelect}
        onOpenSearch={() => setCommandPaletteOpen(true)}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          onMenuClick={() => setSidebarOpen((v) => !v)}
          activeSection={activeSection}
          activeSubSection={activeSubSection}
          onSelectNav={handleNavSelect}
          onOpenSearch={() => setCommandPaletteOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-8 space-y-6 bg-[#FAF9F5] dark:bg-[#071324] pb-24 lg:pb-8">
          {/* ========================================================= */}
          {/* SECTION 1: COST PLAN                                      */}
          {/* ========================================================= */}
          {activeSection === "Cost Plan" && (
            <RoleGuard permission="Budget">
              <BOQTable
                initialSubTab={activeSubSection as any}
                onTabChange={(tab) => setActiveSubSection(tab)}
              />
            </RoleGuard>
          )}

          {/* ========================================================= */}
          {/* SECTION 2: BUY & SUPPLY                                   */}
          {/* ========================================================= */}
          {activeSection === "Buy & Supply" && (
            <RoleGuard permission="Procurement">
              {activeSubSection === "directory" ? (
                <TradeDirectoryView
                  onBack={() => handleNavSelect("Buy & Supply", "match")}
                />
              ) : activeSubSection === "stock" ? (
                <MaterialsStockView />
              ) : (
                <ThreeWayMatchView
                  initialSubTab={activeSubSection as any}
                  onTabChange={(tab) => setActiveSubSection(tab)}
                />
              )}
            </RoleGuard>
          )}

          {/* ========================================================= */}
          {/* SECTION 3: SITE (COLLABORATIVE SITE HUB)                  */}
          {/* ========================================================= */}
          {activeSection === "Site" && (
            <RoleGuard permission="Progress">
              {activeSubSection === "drawings" ? (
                <DrawingsView
                  initialSubTab="current"
                  onTabChange={() => {}}
                />
              ) : activeSubSection === "labour" ? (
                <LabourView />
              ) : activeSubSection === "diary" ? (
                <SiteDiaryView />
              ) : (
                <SiteHub />
              )}
            </RoleGuard>
          )}

          {/* ========================================================= */}
          {/* SECTION 4: CONTRACTS                                      */}
          {/* ========================================================= */}
          {activeSection === "Contracts" && (
            <RoleGuard permission="Subcontractors">
              <SubcontractorView
                initialSubTab={activeSubSection as any}
                onTabChange={(tab) => setActiveSubSection(tab)}
              />
            </RoleGuard>
          )}

          {/* ========================================================= */}
          {/* SECTION 5: OVERSIGHT                                      */}
          {/* ========================================================= */}
          {activeSection === "Oversight" && (
            <div className="space-y-6">
              {activeSubSection === "telemetry" ? (
                <ManagementDecisionCenter onNavigate={handleNavSelect} />
              ) : activeSubSection === "reports" ? (
                <ReportsView />
              ) : activeSubSection === "portal" ? (
                <ClientPortalView
                  standalone={false}
                  onReturn={() => handleNavSelect("Oversight", "my-work")}
                />
              ) : activeSubSection === "admin" ? (
                <RoleGuard permission="Admin">
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-[#0A1931] border-2 border-[#E5E5DE] dark:border-[#1E3A5F] rounded-2xl p-5 shadow-xs">
                      <h2 className="text-xl font-black text-[#0A2540] dark:text-white tracking-tight">
                        Workspace Governance &amp; Administration
                      </h2>
                      <p className="text-xs text-[#0A2540]/70 dark:text-slate-300 mt-1">
                        Manage security credentials, custom user roles, database migration syncs, and immutable audit logs.
                      </p>
                    </div>
                    <UserRoleManager />
                    <DataMigrationHub />
                    <AuditLogView />
                    <WorkspaceSettingsView />
                  </div>
                </RoleGuard>
              ) : (
                <div className="space-y-6">
                  {/* Clean Metric KPI Cards */}
                  <MetricCards
                    approvedBudget={approvedBudget}
                    committedCost={committedCost}
                    actualCost={actualCost}
                  />

                  {/* My Work Action Queue */}
                  <MyWorkQueue onSelectNav={handleNavSelect} />
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeSection={activeSection}
        onSelectNav={handleNavSelect}
        onMenuClick={() => setSidebarOpen((v) => !v)}
        isMenuOpen={sidebarOpen}
      />

      {/* Command Search Palette (⌘K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onSelectNav={handleNavSelect}
      />
    </div>
  );
}
