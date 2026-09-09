"use client";

import React, { createContext, useContext, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { RoleName } from "@/lib/supabase/database.types";
import { AppDataProvider } from "@/lib/store/app-data";

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
  const [activeRole, setActiveRole] = useState<RoleName>("Project Manager");
  const [currency, setCurrency] = useState("NGN");
  const [currentProject] = useState({
    id: "proj-lagos-01",
    name: "Eko Atlantic Horizon Towers",
    code: "CV-EAH-2026",
    location: "Victoria Island, Lagos",
    budgetTotal: 450000000, // ₦450,000,000
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
        <AppDataProvider>{children}</AppDataProvider>
      </AppContext.Provider>
    </QueryClientProvider>
  );
}
