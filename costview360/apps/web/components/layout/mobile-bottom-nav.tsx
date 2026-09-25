"use client";

import React from "react";
import {
  Calculator,
  ShoppingCart,
  HardHat,
  Briefcase,
  LayoutDashboard,
  Menu,
} from "lucide-react";
import { normalizeSection } from "@/components/layout/sidebar";

interface MobileBottomNavProps {
  activeSection: string;
  onSelectNav: (section: string, subSection?: string) => void;
  onMenuClick: () => void;
  isMenuOpen?: boolean;
}

interface BottomNavItem {
  id: string;
  name: string;
  icon: React.ElementType;
  badge?: string;
}

const BOTTOM_NAV_ITEMS: BottomNavItem[] = [
  {
    id: "Cost Plan",
    name: "Cost Plan",
    icon: Calculator,
  },
  {
    id: "Buy & Supply",
    name: "Buy",
    icon: ShoppingCart,
    badge: "3",
  },
  {
    id: "Site",
    name: "Site",
    icon: HardHat,
  },
  {
    id: "Contracts",
    name: "Contracts",
    icon: Briefcase,
  },
  {
    id: "Oversight",
    name: "Oversight",
    icon: LayoutDashboard,
  },
];

export function MobileBottomNav({
  activeSection,
  onSelectNav,
  onMenuClick,
  isMenuOpen = false,
}: MobileBottomNavProps) {
  const currentFlow = normalizeSection(activeSection);

  return (
    <nav
      aria-label="Mobile Navigation Bar"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t-2 border-[#E5E5DE] shadow-[0_-4px_16px_rgba(10,37,64,0.06)] px-1.5 py-1"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentFlow === item.id && !isMenuOpen;

          return (
            <button
              key={item.id}
              onClick={() => onSelectNav(item.id)}
              className={`relative flex flex-col items-center justify-center min-w-[52px] py-1 px-1.5 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? "bg-[#0A2540]/10 text-[#0A2540]"
                  : "text-[#0A2540]/60 hover:text-[#0A2540] hover:bg-slate-100"
              }`}
            >
              {isActive && (
                <span className="absolute -top-1 w-2 h-1 bg-[#0A2540] rounded-full" />
              )}

              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? "scale-110 text-[#0A2540]" : "text-[#0A2540]/70"
                  }`}
                />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 min-w-[14px] h-[14px] px-1 bg-amber-500 text-white text-[9px] font-black rounded-full flex items-center justify-center leading-none shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[10px] mt-0.5 tracking-tight truncate max-w-[54px] ${
                  isActive ? "font-black text-[#0A2540]" : "font-bold text-[#0A2540]/70"
                }`}
              >
                {item.name}
              </span>
            </button>
          );
        })}

        {/* Menu / Drawer Toggle */}
        <button
          onClick={onMenuClick}
          aria-label="Open Full Navigation Drawer"
          className={`relative flex flex-col items-center justify-center min-w-[52px] py-1 px-1.5 rounded-xl transition-all cursor-pointer ${
            isMenuOpen
              ? "bg-[#0A2540] text-white"
              : "text-[#0A2540]/60 hover:text-[#0A2540] hover:bg-slate-100"
          }`}
        >
          <Menu
            className={`w-5 h-5 ${
              isMenuOpen ? "text-white" : "text-[#0A2540]/70"
            }`}
          />
          <span
            className={`text-[10px] mt-0.5 tracking-tight truncate max-w-[54px] ${
              isMenuOpen ? "font-black text-white" : "font-bold text-[#0A2540]/70"
            }`}
          >
            Menu
          </span>
        </button>
      </div>
    </nav>
  );
}
