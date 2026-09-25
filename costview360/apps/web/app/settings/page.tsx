"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { WorkspaceSettingsView } from "@/components/settings/workspace-settings";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { RoleGuard } from "@/components/auth/role-guard";
import { useSessionExpiry } from "@/lib/auth/session";

export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useSessionExpiry();

  const handleNavSelect = (section: string, subSection?: string) => {
    if (section === "Oversight" && subSection === "admin") {
      // Stay on settings
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAF9F5] dark:bg-[#071324] font-sans text-slate-900 dark:text-slate-100">
      <Sidebar
        activeSection="Oversight"
        activeSubSection="admin"
        onSelectNav={handleNavSelect}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          onMenuClick={() => setSidebarOpen((v) => !v)}
          activeSection="Oversight"
          activeSubSection="admin"
          onSelectNav={handleNavSelect}
        />

        <main className="flex-1 overflow-y-auto p-5 md:p-8 space-y-8 bg-[#FAF9F5] dark:bg-[#071324] pb-24 lg:pb-8">
          <RoleGuard permission="Admin">
            <WorkspaceSettingsView />
          </RoleGuard>
        </main>
      </div>

      <MobileBottomNav
        activeSection="Oversight"
        onSelectNav={handleNavSelect}
        onMenuClick={() => setSidebarOpen((v) => !v)}
        isMenuOpen={sidebarOpen}
      />
    </div>
  );
}
