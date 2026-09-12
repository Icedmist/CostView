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
    if (section === "Administration" && subSection === "settings") {
      // Stay on settings
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAF9F5] font-sans text-slate-900">
      <Sidebar
        activeSection="Administration"
        activeSubSection="settings"
        onSelectNav={handleNavSelect}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          onMenuClick={() => setSidebarOpen((v) => !v)}
          activeSection="Administration"
          activeSubSection="settings"
          onSelectNav={handleNavSelect}
        />

        <main className="flex-1 overflow-y-auto p-5 md:p-8 space-y-8 bg-[#FAF9F5] pb-24 lg:pb-8">
          <RoleGuard permission="Admin">
            <WorkspaceSettingsView />
          </RoleGuard>
        </main>
      </div>

      <MobileBottomNav
        activeSection="Administration"
        onSelectNav={handleNavSelect}
        onMenuClick={() => setSidebarOpen((v) => !v)}
        isMenuOpen={sidebarOpen}
      />
    </div>
  );
}
