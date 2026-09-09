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
    <div className="bg-cream-100 border-2 border-navy-800 shadow-brutal p-8 text-center">
      <div className="w-14 h-14 bg-navy-800 border-2 border-navy-800 flex items-center justify-center mx-auto">
        <Lock className="w-7 h-7 text-mustard-500" />
      </div>
      <h3 className="mt-4 text-lg font-black text-navy-800">Restricted — {activeRole} lacks {permission}</h3>
      <p className="text-sm font-bold text-navy-800/60 mt-2 max-w-md mx-auto">
        Your role cannot view this module. Contact Admin to update <span className="font-mono bg-white border border-navy-800 px-1">role_access</span> or switch role via sidebar.
      </p>
      <div className="mt-4 inline-flex items-center gap-2 bg-white border-2 border-navy-800 px-3 py-2 text-xs font-black">
        <ShieldAlert className="w-4 h-4" /> Ask Admin for access
      </div>
    </div>
  );
}
