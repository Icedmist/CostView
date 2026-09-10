"use client";
import React from "react";
import { useApp } from "@/app/providers";
import { canAccess, type PermissionKey } from "@/lib/auth/permissions";
import { Lock, ShieldAlert } from "lucide-react";

export function RoleGuard({
  permission,
  children,
  fallback,
}: {
  permission: PermissionKey;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { activeRole } = useApp();
  if (canAccess(activeRole, permission)) return <>{children}</>;
  if (fallback) return <>{fallback}</>;
  return (
    <div className="bg-white/80 backdrop-blur-md border border-[#e5e5e5] rounded-xl shadow-card p-8 text-center">
      <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto border border-amber-200">
        <Lock className="w-6 h-6" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-[#1b1b1b]">Restricted — {activeRole} lacks {permission}</h3>
      <p className="text-xs text-[#5c5c5c] mt-2 max-w-md mx-auto">
        Your role cannot view this module. Contact Admin to update <span className="font-mono bg-slate-100 border border-[#e5e5e5] px-1 rounded">role_access</span> or switch role via sidebar.
      </p>
      <div className="mt-4 inline-flex items-center gap-2 bg-white border border-[#e5e5e5] rounded-md px-3 py-1.5 text-xs font-medium text-[#1b1b1b] shadow-xs">
        <ShieldAlert className="w-4 h-4 text-amber-600" /> Ask Admin for access
      </div>
    </div>
  );
}
