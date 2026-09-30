"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { ManagementDecisionCenter } from "@/components/dashboard/management-decision-center";
import { UserRoleManager } from "@/components/admin/user-role-manager";
import { DataMigrationHub } from "@/components/admin/data-migration-hub";
import { AuditLogView } from "@/components/admin/audit-log-view";
import { WorkspaceSettingsView } from "@/components/settings/workspace-settings";
import { RoleGuard } from "@/components/auth/role-guard";
import { getNavUrl } from "@/lib/routes";

export default function DashboardSubPage() {
  const params = useParams();
  const router = useRouter();
  const sub = (params?.sub as string) || "my-work";

  useEffect(() => {
    if (sub === "reports") {
      router.replace("/reports");
    } else if (sub === "portal") {
      router.replace("/portal");
    } else if (sub !== "telemetry" && sub !== "admin") {
      router.replace("/dashboard");
    }
  }, [sub, router]);

  if (sub === "telemetry") {
    return (
      <AppShell activeSection="Oversight" activeSubSection="telemetry">
        <ManagementDecisionCenter
          onNavigate={(section, subSection) => {
            router.push(getNavUrl(section, subSection));
          }}
        />
      </AppShell>
    );
  }

  if (sub === "admin") {
    return (
      <AppShell activeSection="Oversight" activeSubSection="admin">
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
      </AppShell>
    );
  }

  return null;
}
