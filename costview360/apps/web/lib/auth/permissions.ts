import type { RoleName } from "@/lib/supabase/database.types";

export type PermissionKey = "Budget" | "Procurement" | "Materials" | "Labour" | "Progress" | "Subcontractors" | "Variations" | "Reports" | "Admin";

// Mirrors supabase/seed.sql role_access matrix — keep in sync
// true = allowed
const MATRIX: Record<RoleName, Record<PermissionKey, boolean>> = {
  Admin: { Budget: true, Procurement: true, Materials: true, Labour: true, Progress: true, Subcontractors: true, Variations: true, Reports: true, Admin: true },
  "Project Manager": { Budget: true, Procurement: true, Materials: true, Labour: true, Progress: true, Subcontractors: true, Variations: true, Reports: true, Admin: false },
  "Quantity Surveyor": { Budget: true, Procurement: true, Materials: false, Labour: false, Progress: false, Subcontractors: true, Variations: true, Reports: true, Admin: false },
  Architect: { Budget: false, Procurement: false, Materials: false, Labour: false, Progress: true, Subcontractors: false, Variations: true, Reports: true, Admin: false },
  "Site Engineer": { Budget: false, Procurement: false, Materials: true, Labour: true, Progress: true, Subcontractors: false, Variations: false, Reports: false, Admin: false },
  "Procurement Officer": { Budget: false, Procurement: true, Materials: true, Labour: false, Progress: false, Subcontractors: true, Variations: false, Reports: false, Admin: false },
  Accountant: { Budget: true, Procurement: true, Materials: false, Labour: false, Progress: false, Subcontractors: false, Variations: false, Reports: true, Admin: false },
  Storekeeper: { Budget: false, Procurement: false, Materials: true, Labour: false, Progress: false, Subcontractors: false, Variations: false, Reports: false, Admin: false },
};

// In-memory runtime override map
let RUNTIME_OVERRIDES: Partial<Record<RoleName, Partial<Record<PermissionKey, boolean>>>> = {};

export function setRuntimePermission(role: RoleName, permission: PermissionKey, allowed: boolean) {
  if (!RUNTIME_OVERRIDES[role]) {
    RUNTIME_OVERRIDES[role] = {};
  }
  RUNTIME_OVERRIDES[role]![permission] = allowed;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("costview_permission_overrides", JSON.stringify(RUNTIME_OVERRIDES));
    } catch {
      // ignore
    }
  }
}

export function loadRuntimePermissions(overrides: { role: RoleName; permission_key: string; allowed: boolean }[]) {
  overrides.forEach((o) => {
    if (!RUNTIME_OVERRIDES[o.role]) {
      RUNTIME_OVERRIDES[o.role] = {};
    }
    RUNTIME_OVERRIDES[o.role]![o.permission_key as PermissionKey] = o.allowed;
  });
}

export function getFullMatrix(): Record<RoleName, Record<PermissionKey, boolean>> {
  // Try loading from localStorage on browser
  if (typeof window !== "undefined" && Object.keys(RUNTIME_OVERRIDES).length === 0) {
    try {
      const stored = localStorage.getItem("costview_permission_overrides");
      if (stored) {
        RUNTIME_OVERRIDES = JSON.parse(stored);
      }
    } catch {
      // ignore
    }
  }

  const result = { ...MATRIX };
  (Object.keys(result) as RoleName[]).forEach((role) => {
    result[role] = { ...MATRIX[role], ...(RUNTIME_OVERRIDES[role] || {}) };
  });
  return result;
}

export function canAccess(role: RoleName, permission: PermissionKey): boolean {
  if (typeof window !== "undefined" && Object.keys(RUNTIME_OVERRIDES).length === 0) {
    try {
      const stored = localStorage.getItem("costview_permission_overrides");
      if (stored) {
        RUNTIME_OVERRIDES = JSON.parse(stored);
      }
    } catch {
      // ignore
    }
  }
  if (RUNTIME_OVERRIDES[role] && RUNTIME_OVERRIDES[role]![permission] !== undefined) {
    return RUNTIME_OVERRIDES[role]![permission]!;
  }
  return MATRIX[role]?.[permission] ?? false;
}

export function getRolePermissions(role: RoleName): PermissionKey[] {
  const current = getFullMatrix()[role] || {};
  return (Object.keys(current) as PermissionKey[]).filter((k) => current[k]);
}

