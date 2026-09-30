"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { CommandPalette } from "@/components/layout/command-palette";
import { useSessionExpiry } from "@/lib/auth/session";
import { getNavUrl, parseNavPath } from "@/lib/routes";

interface AppShellProps {
  children: React.ReactNode;
  activeSection?: string;
  activeSubSection?: string;
}

export function AppShell({
  children,
  activeSection: propActiveSection,
  activeSubSection: propActiveSubSection,
}: AppShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  useSessionExpiry();

  // If props not passed, deduce from pathname
  const pathNav = parseNavPath(pathname || "");
  const activeSection = propActiveSection || pathNav.section;
  const activeSubSection = propActiveSubSection || pathNav.subSection;

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

  // Navigation coordinator: route directly to dedicated semantic URL
  const handleNavSelect = (section: string, subSection?: string) => {
    const targetUrl = getNavUrl(section, subSection);
    router.push(targetUrl);
  };

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
          {children}
        </main>
      </div>

      <MobileBottomNav
        activeSection={activeSection}
        onSelectNav={handleNavSelect}
        onMenuClick={() => setSidebarOpen((v) => !v)}
        isMenuOpen={sidebarOpen}
      />

      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onSelectNav={handleNavSelect}
      />
    </div>
  );
}
