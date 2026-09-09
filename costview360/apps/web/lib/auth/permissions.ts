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

export function canAccess(role: RoleName, permission: PermissionKey): boolean {
  return MATRIX[role]?.[permission] ?? false;
}

export function getRolePermissions(role: RoleName): PermissionKey[] {
  return (Object.keys(MATRIX[role] || {}) as PermissionKey[]).filter((k) => MATRIX[role][k]);
}
