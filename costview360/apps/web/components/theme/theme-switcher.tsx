"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTheme, type ThemeMode } from "@/lib/theme/theme-context";
import { Sun, Moon, Clock, Check, ChevronDown } from "lucide-react";

interface ThemeSwitcherProps {
  variant?: "button" | "segmented" | "dropdown";
  showLabel?: boolean;
  className?: string;
}

export function ThemeSwitcher({
  variant = "button",
  showLabel = false,
  className = "",
}: ThemeSwitcherProps) {
  const { theme, resolvedTheme, setTheme, toggleTheme, isTimeBased } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  // Variant 1: Segmented control (ideal for Settings / Preferences)
  if (variant === "segmented") {
    return (
      <div
        className={`inline-flex items-center p-1 bg-[#FAF9F5] dark:bg-[#071324] border-2 border-[#E5E5DE] dark:border-[#1E3A5F] rounded-2xl gap-1 shadow-xs ${className}`}
      >
        <button
          type="button"
          onClick={() => setTheme("light")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
            theme === "light"
              ? "bg-white dark:bg-[#0A1931] text-[#0A2540] dark:text-white shadow-xs border border-[#E5E5DE] dark:border-[#1E3A5F]"
              : "text-[#0A2540]/60 dark:text-white/60 hover:text-[#0A2540] dark:hover:text-white"
          }`}
          title="Light Mode"
        >
          <Sun className="w-3.5 h-3.5 text-amber-500" />
          <span>Light</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme("dark")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
            theme === "dark"
              ? "bg-white dark:bg-[#0A1931] text-[#0A2540] dark:text-white shadow-xs border border-[#E5E5DE] dark:border-[#1E3A5F]"
              : "text-[#0A2540]/60 dark:text-white/60 hover:text-[#0A2540] dark:hover:text-white"
          }`}
          title="Dark Mode"
        >
          <Moon className="w-3.5 h-3.5 text-indigo-400" />
          <span>Dark</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme("auto")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
            theme === "auto"
              ? "bg-[#0A2540] text-white dark:bg-[#FFD23F] dark:text-[#0A1931] shadow-xs"
              : "text-[#0A2540]/60 dark:text-white/60 hover:text-[#0A2540] dark:hover:text-white"
          }`}
          title="Auto: Time-based (Day/Night)"
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Auto (Time)</span>
        </button>
      </div>
    );
  }

  // Variant 2: Quick Header Button with interactive drop selector
  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <div className="flex items-center">
        <button
          type="button"
          onClick={toggleTheme}
          title={
            isTimeBased
              ? `Theme: Auto Time-based (${resolvedTheme === "light" ? "Day" : "Night"}) — Click to switch`
              : `Theme: ${theme === "dark" ? "Dark" : "Light"} — Click to switch`
          }
          className="relative h-10 px-3 rounded-xl border-2 border-[#E5E5DE] dark:border-[#1E3A5F] bg-white dark:bg-[#0A1931] hover:bg-[#FAF9F5] dark:hover:bg-[#0F2137] flex items-center gap-2 text-[#0A2540] dark:text-white transition-all shadow-xs cursor-pointer select-none"
          aria-label="Toggle Theme"
        >
          {resolvedTheme === "dark" ? (
            <Moon className="w-4 h-4 text-indigo-400 shrink-0" />
          ) : (
            <Sun className="w-4 h-4 text-amber-500 shrink-0" />
          )}

          {isTimeBased && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-[#0A2540]/70 dark:text-white/70">
              <Clock className="w-3 h-3 text-[#0A2540]/50 dark:text-white/50" />
              <span>Auto</span>
            </span>
          )}

          {showLabel && !isTimeBased && (
            <span className="text-xs font-black capitalize">{theme}</span>
          )}
        </button>

        {/* Small dropdown caret to open 3-option menu */}
        <button
          type="button"
          onClick={() => setDropdownOpen((v) => !v)}
          title="Select Theme Mode (Light / Dark / Auto Time-based)"
          className="h-10 px-1.5 -ml-1 rounded-r-xl border-y-2 border-r-2 border-[#E5E5DE] dark:border-[#1E3A5F] bg-white dark:bg-[#0A1931] hover:bg-[#FAF9F5] dark:hover:bg-[#0F2137] flex items-center justify-center text-[#0A2540]/60 dark:text-white/60 hover:text-[#0A2540] dark:hover:text-white transition-all shadow-xs cursor-pointer"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Mode Selection Popover */}
      {dropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-[#0A1931] border-2 border-[#E5E5DE] dark:border-[#1E3A5F] rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95">
          <div className="px-3 py-2 border-b border-[#E5E5DE] dark:border-[#1E3A5F] text-[11px] font-black uppercase tracking-wider text-[#0A2540]/60 dark:text-white/60">
            Appearance & Theme
          </div>

          <div className="py-1 space-y-1">
            <button
              type="button"
              onClick={() => {
                setTheme("light");
                setDropdownOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                theme === "light"
                  ? "bg-[#FAF9F5] dark:bg-[#0F2137] text-[#0A2540] dark:text-white font-black"
                  : "text-[#0A2540]/80 dark:text-white/80 hover:bg-[#FAF9F5] dark:hover:bg-[#0F2137]"
              }`}
            >
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Light</span>
              </div>
              {theme === "light" && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
            </button>

            <button
              type="button"
              onClick={() => {
                setTheme("dark");
                setDropdownOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                theme === "dark"
                  ? "bg-[#FAF9F5] dark:bg-[#0F2137] text-[#0A2540] dark:text-white font-black"
                  : "text-[#0A2540]/80 dark:text-white/80 hover:bg-[#FAF9F5] dark:hover:bg-[#0F2137]"
              }`}
            >
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-indigo-400" />
                <span>Dark</span>
              </div>
              {theme === "dark" && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
            </button>

            <button
              type="button"
              onClick={() => {
                setTheme("auto");
                setDropdownOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                theme === "auto"
                  ? "bg-[#FAF9F5] dark:bg-[#0F2137] text-[#0A2540] dark:text-white font-black"
                  : "text-[#0A2540]/80 dark:text-white/80 hover:bg-[#FAF9F5] dark:hover:bg-[#0F2137]"
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <div className="text-left">
                  <div>Auto (Time-based)</div>
                  <div className="text-[10px] text-[#0A2540]/50 dark:text-white/50 font-normal">
                    Day (6am–7pm) · Night (7pm–6am)
                  </div>
                </div>
              </div>
              {theme === "auto" && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
            </button>
          </div>

          <div className="mt-1 pt-2 border-t border-[#E5E5DE] dark:border-[#1E3A5F] px-3 pb-1 text-[10px] text-[#0A2540]/50 dark:text-white/50">
            Active: <span className="font-bold text-[#0A2540] dark:text-white capitalize">{resolvedTheme}</span> mode
          </div>
        </div>
      )}
    </div>
  );
}
