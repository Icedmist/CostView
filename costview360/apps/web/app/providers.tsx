"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { RoleName } from "@/lib/supabase/database.types";
import { AppDataProvider } from "@/lib/store/app-data";
import { createClient } from "@/lib/supabase/client";
import { ThemeProvider } from "@/lib/theme/theme-context";

const ALL_VALID_ROLES: RoleName[] = [
  "Admin",
  "Project Manager",
  "Quantity Surveyor",
  "Architect",
  "Site Engineer",
  "Procurement Officer",
  "Accountant",
  "Storekeeper",
];

interface AppContextType {
  activeMode: "site" | "commercial";
  setActiveMode: (mode: "site" | "commercial") => void;
  activeRole: RoleName;
  setActiveRole: (role: RoleName) => void;
  currency: string;
  setCurrency: (c: string) => void;
  currentProject: {
    id: string;
    name: string;
    code: string;
    location: string;
    budgetTotal: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const [activeMode, setActiveMode] = useState<"site" | "commercial">("site");
  const [activeRole, setActiveRoleState] = useState<RoleName>("Project Manager");
  const [currency, setCurrency] = useState("NGN");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRole = localStorage.getItem("costview_demo_role") as RoleName | null;
      if (storedRole && ALL_VALID_ROLES.includes(storedRole)) {
        setActiveRoleState(storedRole);
      }
    }

    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      const userRole = (data.user?.user_metadata?.default_role as RoleName) || null;
      if (userRole && ALL_VALID_ROLES.includes(userRole)) {
        setActiveRoleState(userRole);
        if (typeof window !== "undefined") {
          localStorage.setItem("costview_demo_role", userRole);
          document.cookie = `costview_demo_role=${encodeURIComponent(userRole)}; path=/; max-age=7200; SameSite=Lax`;
        }
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const userRole = (session?.user?.user_metadata?.default_role as RoleName) || null;
      if (userRole && ALL_VALID_ROLES.includes(userRole)) {
        setActiveRoleState(userRole);
        if (typeof window !== "undefined") {
          localStorage.setItem("costview_demo_role", userRole);
          document.cookie = `costview_demo_role=${encodeURIComponent(userRole)}; path=/; max-age=7200; SameSite=Lax`;
        }
      }
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  const setActiveRole = (role: RoleName) => {
    setActiveRoleState(role);
    if (typeof window !== "undefined") {
      localStorage.setItem("costview_demo_role", role);
      document.cookie = `costview_demo_role=${encodeURIComponent(role)}; path=/; max-age=7200; SameSite=Lax`;
    }
  };

  const [currentProject] = useState({
    id: "22222222-2222-2222-2222-222222222222",
    name: "Eko Atlantic Horizon Towers",
    code: "CV-EAH-2026",
    location: "Victoria Island, Lagos",
    budgetTotal: 301815000, // ₦301,815,000 baseline
  });

  return (
    <QueryClientProvider client={queryClient}>
      <AppContext.Provider
        value={{
          activeMode,
          setActiveMode,
          activeRole,
          setActiveRole,
          currency,
          setCurrency,
          currentProject,
        }}
      >
        <ThemeProvider>
          <AppDataProvider>{children}</AppDataProvider>
        </ThemeProvider>
      </AppContext.Provider>
    </QueryClientProvider>
  );
}
