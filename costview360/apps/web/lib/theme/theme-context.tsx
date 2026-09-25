"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export type ThemeMode = "auto" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

export interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  isTimeBased: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function getTimeBasedTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  const hour = new Date().getHours();
  // Day time: 6:00 AM (06:00) to 6:59 PM (18:59)
  // Night time: 7:00 PM (19:00) to 5:59 AM (05:59)
  return hour >= 6 && hour < 19 ? "light" : "dark";
}

function applyThemeToDOM(resolved: ResolvedTheme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (resolved === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Default to "auto" (time-based) unless explicitly changed by user
  const [theme, setThemeState] = useState<ThemeMode>("auto");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");
  const [mounted, setMounted] = useState(false);

  // Initialize theme from storage or default to time-based
  useEffect(() => {
    setMounted(true);
    let initialPref: ThemeMode = "auto";
    try {
      const stored = localStorage.getItem("costview_theme");
      if (stored === "light" || stored === "dark" || stored === "auto") {
        initialPref = stored as ThemeMode;
      }
    } catch {
      // Ignore localStorage access errors
    }

    setThemeState(initialPref);
    const resolved = initialPref === "auto" ? getTimeBasedTheme() : initialPref;
    setResolvedTheme(resolved);
    applyThemeToDOM(resolved);
  }, []);

  // Update theme mode and persist user choice
  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
    try {
      if (newTheme === "auto") {
        localStorage.removeItem("costview_theme");
      } else {
        localStorage.setItem("costview_theme", newTheme);
      }
    } catch {
      // Ignore localStorage access errors
    }

    const resolved = newTheme === "auto" ? getTimeBasedTheme() : newTheme;
    setResolvedTheme(resolved);
    applyThemeToDOM(resolved);
  }, []);

  // 1-click toggle between light and dark (sets explicit user preference)
  const toggleTheme = useCallback(() => {
    const next: ThemeMode = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(next);
  }, [resolvedTheme, setTheme]);

  // Periodic check for time-based transitions when in "auto" mode
  useEffect(() => {
    if (!mounted || theme !== "auto") return;

    const interval = setInterval(() => {
      const currentExpected = getTimeBasedTheme();
      if (currentExpected !== resolvedTheme) {
        setResolvedTheme(currentExpected);
        applyThemeToDOM(currentExpected);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [mounted, theme, resolvedTheme]);

  // Sync across tabs if user changes theme in another tab
  useEffect(() => {
    if (!mounted) return;
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "costview_theme") {
        const val = e.newValue as ThemeMode | null;
        const nextTheme: ThemeMode = val === "light" || val === "dark" ? val : "auto";
        setThemeState(nextTheme);
        const resolved = nextTheme === "auto" ? getTimeBasedTheme() : nextTheme;
        setResolvedTheme(resolved);
        applyThemeToDOM(resolved);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [mounted]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme,
        toggleTheme,
        isTimeBased: theme === "auto",
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    // Graceful fallback if called outside provider
    return {
      theme: "auto",
      resolvedTheme: "light",
      setTheme: () => {},
      toggleTheme: () => {},
      isTimeBased: true,
    };
  }
  return context;
}
