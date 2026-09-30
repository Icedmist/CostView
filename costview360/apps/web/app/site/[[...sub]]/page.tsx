"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { RoleGuard } from "@/components/auth/role-guard";
import { SiteHub } from "@/components/site-ops/site-hub";
import { DrawingsView } from "@/components/drawings/drawings-view";
import { LabourView } from "@/components/labour/labour-view";
import { SiteDiaryView } from "@/components/site-ops/site-diary-view";

const VALID_SUBS = ["hub", "drawings", "labour", "diary"];

export default function SitePage() {
  const params = useParams();
  const router = useRouter();
  const subParam = Array.isArray(params?.sub)
    ? params.sub[0]
    : (params?.sub as string) || "hub";
  const validSub = VALID_SUBS.includes(subParam) ? subParam : "hub";

  return (
    <AppShell activeSection="Site" activeSubSection={validSub}>
      <RoleGuard permission="Progress">
        {validSub === "drawings" ? (
          <DrawingsView initialSubTab="current" onTabChange={() => {}} />
        ) : validSub === "labour" ? (
          <LabourView />
        ) : validSub === "diary" ? (
          <SiteDiaryView />
        ) : (
          <SiteHub />
        )}
      </RoleGuard>
    </AppShell>
  );
}
