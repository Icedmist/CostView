"use client";

import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { WorkspaceSettingsView } from "@/components/settings/workspace-settings";
import { RoleGuard } from "@/components/auth/role-guard";

export default function SettingsPage() {
  return (
    <AppShell activeSection="Oversight" activeSubSection="admin">
      <RoleGuard permission="Admin">
        <WorkspaceSettingsView />
      </RoleGuard>
    </AppShell>
  );
}
