"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { RoleGuard } from "@/components/auth/role-guard";
import { SubcontractorView } from "@/components/subcontractors/subcontractor-view";

const VALID_SUBS = ["ledger", "contracts", "claims", "instructions", "variations"];

export default function ContractsPage() {
  const params = useParams();
  const router = useRouter();
  const rawSub = Array.isArray(params?.sub)
    ? params.sub[0]
    : (params?.sub as string) || "ledger";
  const subParam = rawSub === "contracts" ? "ledger" : rawSub;
  const validSub = VALID_SUBS.includes(subParam) ? subParam : "ledger";

  return (
    <AppShell activeSection="Contracts" activeSubSection={validSub === "ledger" ? "contracts" : validSub}>
      <RoleGuard permission="Subcontractors">
        <SubcontractorView
          initialSubTab={validSub as any}
          onTabChange={(tab) => {
            const nextTab = tab === "contracts" ? "ledger" : tab;
            router.push(`/contracts/${nextTab}`);
          }}
        />
      </RoleGuard>
    </AppShell>
  );
}
