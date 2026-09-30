"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { BOQTable } from "@/components/budget/boq-table";
import { RoleGuard } from "@/components/auth/role-guard";

export default function CostPlanPage() {
  const params = useParams();
  const router = useRouter();
  const subParam = Array.isArray(params?.sub)
    ? params.sub[0]
    : (params?.sub as string) || "boq";
  const validSub = ["boq", "risks", "revisions"].includes(subParam) ? subParam : "boq";

  return (
    <AppShell activeSection="Cost Plan" activeSubSection={validSub}>
      <RoleGuard permission="Budget">
        <BOQTable
          initialSubTab={validSub as any}
          onTabChange={(tab) => {
            router.push(`/cost-plan/${tab}`);
          }}
        />
      </RoleGuard>
    </AppShell>
  );
}
