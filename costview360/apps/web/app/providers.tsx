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

interface ProjectInfo {
  id: string;
  name: string;
  code: string;
  location: string;
  budgetTotal: number;
}

interface AppContextType {
  activeMode: "site" | "commercial";
  setActiveMode: (mode: "site" | "commercial") => void;
  activeRole: RoleName;
  setActiveRole: (role: RoleName) => void;
  currency: string;
  setCurrency: (c: string) => void;
  currentProject: ProjectInfo;
  setCurrentProject: (p: ProjectInfo) => void;
  availableProjects: ProjectInfo[];
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

  const [currentProject, setCurrentProject] = useState<ProjectInfo>({
    id: "",
    name: "Primary Construction Site",
    code: "PRJ-01",
    location: "Lagos, Nigeria",
    budgetTotal: 0,
  });
  const [availableProjects, setAvailableProjects] = useState<ProjectInfo[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRole = localStorage.getItem("costview_demo_role") as RoleName | null;
      if (storedRole && ALL_VALID_ROLES.includes(storedRole)) {
        setActiveRoleState(storedRole);
      }
    }

    const supabase = createClient();

    const loadUserProjects = async (userId: string) => {
      try {
        const { data: members } = await supabase
          .from("project_members")
          .select("project_id, role, projects(id, name, code, location, budget_total, currency)")
          .eq("user_id", userId);

        if (members && members.length > 0) {
          const projs: ProjectInfo[] = members
            .map((m: any) => m.projects)
            .filter(Boolean)
            .map((p: any) => ({
              id: p.id,
              name: p.name,
              code: p.code || "PRJ-01",
              location: p.location || "Lagos, Nigeria",
              budgetTotal: Number(p.budget_total || 0),
            }));

          if (projs.length > 0) {
            setAvailableProjects(projs);
            setCurrentProject(projs[0]);
            return;
          }
        }

        // Fallback: load workspace projects
        const { data: projs } = await supabase
          .from("projects")
          .select("id, name, code, location, budget_total")
          .limit(5);

        if (projs && projs.length > 0) {
          const mapped: ProjectInfo[] = projs.map((p: any) => ({
            id: p.id,
            name: p.name,
            code: p.code || "PRJ-01",
            location: p.location || "Lagos, Nigeria",
            budgetTotal: Number(p.budget_total || 0),
          }));
          setAvailableProjects(mapped);
          setCurrentProject(mapped[0]);
        }
      } catch (err) {
        console.warn("Could not load user projects from Supabase", err);
      }
    };

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        const userRole = (data.user.user_metadata?.default_role as RoleName) || null;
        if (userRole && ALL_VALID_ROLES.includes(userRole)) {
          setActiveRoleState(userRole);
          if (typeof window !== "undefined") {
            localStorage.setItem("costview_demo_role", userRole);
            document.cookie = `costview_demo_role=${encodeURIComponent(userRole)}; path=/; max-age=7200; SameSite=Lax`;
          }
        }
        loadUserProjects(data.user.id);
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const userRole = (session.user.user_metadata?.default_role as RoleName) || null;
        if (userRole && ALL_VALID_ROLES.includes(userRole)) {
          setActiveRoleState(userRole);
          if (typeof window !== "undefined") {
            localStorage.setItem("costview_demo_role", userRole);
            document.cookie = `costview_demo_role=${encodeURIComponent(userRole)}; path=/; max-age=7200; SameSite=Lax`;
          }
        }
        loadUserProjects(session.user.id);
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
          setCurrentProject,
          availableProjects,
        }}
      >
        <ThemeProvider>
          <AppDataProvider projectId={currentProject.id}>{children}</AppDataProvider>
        </ThemeProvider>
      </AppContext.Provider>
    </QueryClientProvider>
  );
}
