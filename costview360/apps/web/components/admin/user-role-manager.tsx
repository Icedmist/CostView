"use client";

import React, { useState, useEffect, useMemo } from "react";
import type { RoleName } from "@/lib/supabase/database.types";
import {
  getFullMatrix,
  setRuntimePermission,
  loadRuntimePermissions,
  type PermissionKey,
} from "@/lib/auth/permissions";
import {
  UserPlus,
  Shield,
  ShieldCheck,
  Users,
  Search,
  Check,
  X,
  Lock,
  Unlock,
  RefreshCw,
  Sparkles,
  KeyRound,
  Mail,
  Phone,
  User,
  Sliders,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { AuditLogView } from "@/components/admin/audit-log-view";

const ALL_ROLES: RoleName[] = [
  "Admin",
  "Project Manager",
  "Quantity Surveyor",
  "Architect",
  "Site Engineer",
  "Procurement Officer",
  "Accountant",
  "Storekeeper",
];

const PERMISSION_KEYS: { key: PermissionKey; label: string; desc: string }[] = [
  { key: "Budget", label: "Budget & BOQ", desc: "View & edit baseline budgets and rates" },
  { key: "Procurement", label: "Procurement & Match", desc: "Purchase orders & 3-way match validation" },
  { key: "Materials", label: "Materials & Stock", desc: "Stock balances & gate-pass transfers" },
  { key: "Labour", label: "Labour & Muster", desc: "Daily headcount & muster rolls" },
  { key: "Progress", label: "Site Progress & Diary", desc: "Daily diaries, photos, & snag inspections" },
  { key: "Subcontractors", label: "Subcontractors", desc: "Contractor ledgers, claims, & retention" },
  { key: "Variations", label: "Variations & Claims", desc: "Site instructions & revision governance" },
  { key: "Reports", label: "Reports Studio", desc: "Export valuation certificates & PDFs" },
  { key: "Admin", label: "Administration", desc: "Manage users, roles, & security logs" },
];

const ROLE_DESCRIPTIONS: Record<RoleName, string> = {
  Admin: "Complete unrestricted access across all financial, site, and security modules.",
  "Project Manager": "Full operational and financial oversight, PO and claim certifications.",
  "Quantity Surveyor": "Baseline BOQs, rate revisions, subcontractor valuations, and claims.",
  Architect: "Site progress review, design inspections, and variation order authoring.",
  "Site Engineer": "Daily site diary logging, labour muster, and snag remediation records.",
  "Procurement Officer": "Requisition processing, RFQ quotes, PO authoring, and invoice checks.",
  Accountant: "Three-way match gatekeeper, invoice approvals, and payment releases.",
  Storekeeper: "Warehouse stock receiving, material issues, and gate-pass balances.",
};

interface UserRecord {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  default_role: RoleName;
  avatar_url?: string | null;
  created_at?: string;
}

export function UserRoleManager() {
  const [activeTab, setActiveTab] = useState<"users" | "matrix" | "audit">("users");
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [matrix, setMatrix] = useState<Record<RoleName, Record<PermissionKey, boolean>>>(getFullMatrix());
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("All");
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("CostView2026!");
  const [formPhone, setFormPhone] = useState("");
  const [formRole, setFormRole] = useState<RoleName>("Site Engineer");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Users & Roles
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
      }
      if (data.roleAccess && data.roleAccess.length > 0) {
        loadRuntimePermissions(data.roleAccess);
        setMatrix(getFullMatrix());
      }
    } catch (err) {
      console.error("Failed to fetch admin users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Handle Role Assignment Change
  const handleRoleChange = async (userId: string, newRole: RoleName) => {
    // Optimistic UI update
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, default_role: newRole } : u))
    );

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_role", userId, role: newRole }),
      });
      const result = await res.json();
      if (result.success) {
        showNotification(`Role updated to ${newRole}`);
      } else {
        showNotification(result.error || "Failed to update role", "error");
        fetchUsers();
      }
    } catch {
      showNotification("Failed to update user role", "error");
      fetchUsers();
    }
  };

  // Handle Permission Matrix Toggle
  const handleTogglePermission = async (role: RoleName, perm: PermissionKey) => {
    const currentVal = matrix[role]?.[perm] ?? false;
    const newVal = !currentVal;

    // Update in-memory and local state
    setRuntimePermission(role, perm, newVal);
    setMatrix((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [perm]: newVal,
      },
    }));

    // Persist to backend
    try {
      await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_permission",
          role,
          permission_key: perm,
          allowed: newVal,
        }),
      });
      showNotification(`Updated ${perm} permission for ${role}`);
    } catch (err) {
      console.error("Failed to persist permission to backend:", err);
    }
  };

  // Handle Create User
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || !formPassword) {
      showNotification("Please fill in all required fields", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: formName,
          email: formEmail,
          password: formPassword,
          phone: formPhone,
          role: formRole,
        }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUsers((prev) => [data.user, ...prev]);
        showNotification(`User "${formName}" created successfully as ${formRole}`);
        setIsCreateModalOpen(false);
        setFormName("");
        setFormEmail("");
        setFormPhone("");
      } else {
        showNotification(data.error || "Failed to create user", "error");
      }
    } catch {
      showNotification("Network error creating user", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate random password
  const generatePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
    let pass = "";
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormPassword(pass);
  };

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.default_role.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === "All" || u.default_role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl transition-all border animate-in fade-in slide-in-from-bottom-3 ${
            notification.type === "success"
              ? "bg-[#0A2540] text-white border-[#0A2540]"
              : "bg-rose-900 text-white border-rose-700"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span className="text-sm font-semibold">{notification.message}</span>
        </div>
      )}

      {/* Hero / Header Card */}
      <div className="bg-[#0A2540] rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3.5 py-1.5 rounded-full text-xs font-bold text-white mb-3 backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-white" />
              <span>Enterprise RBAC &amp; Identity Engine</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              User &amp; Role Management Hub
            </h1>
            <p className="text-slate-200 text-sm mt-2 max-w-2xl leading-relaxed">
              Create and provision workspace users, adjust role assignments with instant effect, and customize the module-by-module permission matrix.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-5 py-3 bg-white hover:bg-slate-100 text-[#0A2540] rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg transition-all active:scale-[0.98] cursor-pointer min-h-[44px]"
            >
              <UserPlus className="w-4 h-4 text-[#0A2540]" />
              <span>+ Create New User</span>
            </button>
            <button
              onClick={fetchUsers}
              title="Refresh User Directory"
              className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-all cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Sub-Nav Tab Strip */}
        <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-white/15">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all cursor-pointer min-h-[40px] ${
              activeTab === "users"
                ? "bg-white text-[#0A2540] shadow-md"
                : "bg-white/10 text-white hover:bg-white/15"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Workspace Directory ({users.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("matrix")}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all cursor-pointer min-h-[40px] ${
              activeTab === "matrix"
                ? "bg-white text-[#0A2540] shadow-md"
                : "bg-white/10 text-white hover:bg-white/15"
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Role Permissions Matrix</span>
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all cursor-pointer min-h-[40px] ${
              activeTab === "audit"
                ? "bg-white text-[#0A2540] shadow-md"
                : "bg-white/10 text-white hover:bg-white/15"
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Security Audit Trail</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Users Directory */}
      {activeTab === "users" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Controls Bar */}
          <div className="p-4 md:p-5 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/50">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search user by name, email, or role..."
                className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0A2540] focus:ring-2 focus:ring-[#0A2540]/15"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Filter Role:</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#0A2540] cursor-pointer"
              >
                <option value="All">All Roles ({users.length})</option>
                {ALL_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF9F5] border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-600">
                  <th className="py-3.5 px-5">User</th>
                  <th className="py-3.5 px-4">Contact Info</th>
                  <th className="py-3.5 px-4">Current Assigned Role</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Created Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500 font-medium">
                      No users found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const initials =
                      u.full_name
                        .split(" ")
                        .map((p) => p[0])
                        .filter(Boolean)
                        .slice(0, 2)
                        .join("")
                        .toUpperCase() || "CV";

                    return (
                      <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-full bg-[#0A2540] text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
                              {initials}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">{u.full_name}</div>
                              <div className="text-xs text-slate-500">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-slate-600 text-xs font-mono">
                          {u.phone || "—"}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <select
                              value={u.default_role}
                              onChange={(e) => handleRoleChange(u.id, e.target.value as RoleName)}
                              className="bg-slate-50 hover:bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-[#0A2540] focus:outline-none focus:border-[#0A2540] focus:ring-2 focus:ring-[#0A2540]/15 cursor-pointer transition-all shadow-xs min-h-[38px]"
                            >
                              {ALL_ROLES.map((r) => (
                                <option key={r} value={r}>
                                  {r}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        </td>
                        <td className="py-4 px-4 text-xs text-slate-500">
                          {u.created_at ? new Date(u.created_at).toLocaleDateString() : "Baseline"}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => {
                              showNotification(`Role permissions loaded for ${u.full_name}`);
                              setActiveTab("matrix");
                            }}
                            className="text-xs font-bold text-[#0A2540] hover:underline cursor-pointer"
                          >
                            View Matrix
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Role Permissions Matrix */}
      {activeTab === "matrix" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <h2 className="text-lg font-extrabold text-[#0A2540]">
                Interactive Role Permissions Matrix
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Toggle module access per role. Changes apply live to all users holding the respective role and sync with Supabase <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-[11px]">role_access</code>.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  localStorage.removeItem("costview_permission_overrides");
                  setMatrix(getFullMatrix());
                  showNotification("Matrix reset to default configurations");
                }}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 transition-all cursor-pointer min-h-[38px]"
              >
                Reset to Defaults
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-[#FAF9F5] border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-700">
                  <th className="py-3.5 px-4 w-52">Role Name</th>
                  {PERMISSION_KEYS.map((p) => (
                    <th key={p.key} className="py-3.5 px-3 text-center" title={p.desc}>
                      <div>{p.label}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {ALL_ROLES.map((role) => (
                  <tr key={role} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div>{role}</div>
                      <div className="text-[11px] text-slate-500 font-normal line-clamp-1 mt-0.5">
                        {ROLE_DESCRIPTIONS[role]}
                      </div>
                    </td>
                    {PERMISSION_KEYS.map((p) => {
                      const isAllowed = matrix[role]?.[p.key] ?? false;
                      const isAdminRole = role === "Admin";

                      return (
                        <td key={p.key} className="py-3.5 px-3 text-center">
                          <button
                            disabled={isAdminRole}
                            onClick={() => handleTogglePermission(role, p.key)}
                            title={
                              isAdminRole
                                ? "Admin role always retains full access"
                                : `${isAllowed ? "Revoke" : "Grant"} ${p.label} for ${role}`
                            }
                            className={`w-8 h-8 rounded-lg inline-flex items-center justify-center transition-all ${
                              isAdminRole
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                : isAllowed
                                ? "bg-[#0A2540] text-white hover:bg-[#003366] shadow-xs cursor-pointer active:scale-95"
                                : "bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-700 cursor-pointer"
                            }`}
                          >
                            {isAllowed ? <Check className="w-4 h-4 stroke-[2.5]" /> : <X className="w-3.5 h-3.5" />}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-[#FAF9F5] border border-[#E5E5DE] rounded-xl text-xs text-[#0A2540] flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#0A2540] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Automated RBAC Enforcement:</span> Role permission updates take immediate effect for navigation items, data entry forms, and approval authorization gates across CostView.
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Security Audit Trail */}
      {activeTab === "audit" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-lg font-extrabold text-[#0A2540]">
              Postgres Row-Level Security &amp; Admin Audit Trail
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Immutable ledger of user authentications, role modifications, contract approvals, and permission delta events.
            </p>
          </div>
          <AuditLogView />
        </div>
      )}

      {/* Create User Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
            <div className="p-5 bg-[#0A2540] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <UserPlus className="w-5 h-5 text-white" />
                <h3 className="font-extrabold text-lg">Provision New Workspace User</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Ibrahim Suleiman"
                    className="w-full bg-[#FAF9F5] border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#0A2540] focus:ring-2 focus:ring-[#0A2540]/15"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="suleiman@contractor.ng"
                    className="w-full bg-[#FAF9F5] border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#0A2540] focus:ring-2 focus:ring-[#0A2540]/15"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password *
                  </label>
                  <button
                    type="button"
                    onClick={generatePassword}
                    className="text-xs font-bold text-[#0A2540] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#0A2540]" />
                    Generate Strong
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-mono text-slate-900 focus:outline-none focus:border-[#0A2540] focus:ring-2 focus:ring-[#0A2540]/15"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Assigned Project Role *
                </label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value as RoleName)}
                  className="w-full bg-[#FAF9F5] border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold text-[#0A2540] focus:outline-none focus:border-[#0A2540] focus:ring-2 focus:ring-[#0A2540]/15 cursor-pointer"
                >
                  {ALL_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-1 italic">
                  {ROLE_DESCRIPTIONS[formRole]}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="+234 800 000 0000"
                    className="w-full bg-[#FAF9F5] border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#0A2540] focus:ring-2 focus:ring-[#0A2540]/15"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition-all cursor-pointer min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#0A2540] hover:bg-[#003366] text-white font-bold transition-all shadow-md active:scale-98 cursor-pointer flex items-center gap-2 min-h-[44px]"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Create User</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
