"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { RoleGuard } from "@/components/auth/role-guard";
import { ThreeWayMatchView } from "@/components/procurement/three-way-match";
import { MaterialsStockView } from "@/components/materials/materials-stock-view";
import { TradeDirectoryView } from "@/components/procurement/trade-directory-view";

const VALID_SUBS = ["match", "requisitions", "enquiries", "invoices", "stock", "directory"];

export default function BuyAndSupplyPage() {
  const params = useParams();
  const router = useRouter();
  const subParam = Array.isArray(params?.sub)
    ? params.sub[0]
    : (params?.sub as string) || "match";
  const validSub = VALID_SUBS.includes(subParam) ? subParam : "match";

  return (
    <AppShell activeSection="Buy & Supply" activeSubSection={validSub}>
      <RoleGuard permission="Procurement">
        {validSub === "directory" ? (
          <TradeDirectoryView onBack={() => router.push("/buy-and-supply/match")} />
        ) : validSub === "stock" ? (
          <MaterialsStockView />
        ) : (
          <ThreeWayMatchView
            initialSubTab={validSub as any}
            onTabChange={(tab) => {
              router.push(`/buy-and-supply/${tab}`);
            }}
          />
        )}
      </RoleGuard>
    </AppShell>
  );
}
