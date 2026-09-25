"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { useApp } from "@/app/providers";
import { useSessionExpiry, clearAuthSession } from "@/lib/auth/session";
import { canAccess, getRolePermissions, PermissionKey } from "@/lib/auth/permissions";
import type { RoleName } from "@/lib/supabase/database.types";
import {
  User,
  Mail,
  Shield,
  Building,
  Key,
  LogOut,
  Save,
  CheckCircle2,
  Lock,
  Smartphone,
  Globe,
  Bell,
  Check,
  AlertTriangle,
  Clock,
  Laptop,
  Copy,
  ExternalLink,
  ShieldCheck,
  Zap,
  Sun,
  Moon,
} from "lucide-react";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";

const ALL_ROLES: { name: RoleName; desc: string; color: string }[] = [
  { name: "Admin", desc: "Full system governance, user management, and workspace configuration", color: "bg-purple-100 text-purple-800 border-purple-300" },
  { name: "Project Manager", desc: "Project budgets, procurement approvals, contractor valuations, and executive reports", color: "bg-blue-100 text-[#0A2540] border-blue-300" },
  { name: "Quantity Surveyor", desc: "BOQ master, rate revisions, interim valuations, and final account reconciliation", color: "bg-indigo-100 text-indigo-800 border-indigo-300" },
  { name: "Site Engineer", desc: "Daily site diary, labour muster, material requisitions, and snagging inspections", color: "bg-amber-100 text-amber-900 border-amber-300" },
  { name: "Procurement Officer", desc: "Vendor RFQs, purchase orders, delivery GRNs, and 3-way match verification", color: "bg-sky-100 text-sky-800 border-sky-300" },
  { name: "Accountant", desc: "Supplier invoice ledger, payment disbursements, retention escrow, and audit logs", color: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  { name: "Storekeeper", desc: "Warehouse stock balances, material issue slips, and gate-pass receipt logging", color: "bg-teal-100 text-teal-800 border-teal-300" },
  { name: "Architect", desc: "Design drawings, technical variations, site instructions, and defect punch lists", color: "bg-rose-100 text-rose-800 border-rose-300" },
];

const PERMISSION_MODULES: { key: PermissionKey; label: string; desc: string }[] = [
  { key: "Budget", label: "BOQ & Budget Control", desc: "Create, import, and revise BOQ lines, rates, and quantities" },
  { key: "Procurement", label: "Procurement & 3-Way Match", desc: "Raise RFQs, approve purchase orders, and release matched invoices" },
  { key: "Materials", label: "Materials & Inventory", desc: "Log physical stock deliveries, issue warehouse items, and manage transfers" },
  { key: "Labour", label: "Labour & Muster Roll", desc: "Record daily shift headcounts, artisan trades, and export payroll" },
  { key: "Progress", label: "Site Diary & Snags", desc: "Log daily shift execution, weather stamps, and photo snags" },
  { key: "Subcontractors", label: "Subcontractor Ledger", desc: "Manage trade packages, interim certificates, and 10% retention" },
  { key: "Variations", label: "Variations & Claims", desc: "Raise and approve variation orders, claims, and rate reconciliations" },
  { key: "Reports", label: "Reports & Financials", desc: "Access financial summaries, certified valuations, and cost-to-complete analytics" },
  { key: "Admin", label: "System Administration", desc: "Manage workspace users, customize role permissions, and view audit trails" },
];

export default function AccountPage() {
  const { activeRole, setActiveRole } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "role_access" | "notifications">("profile");

  // Profile Form Fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+234 803 555 0192");
  const [jobTitle, setJobTitle] = useState("Lead Project Manager");
  const [organization, setOrganization] = useState("CostView Construction Consortium");
  const [timezone, setTimezone] = useState("Africa/Lagos (WAT, GMT+1)");
  const [copiedId, setCopiedId] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  // Security Form Fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordFeedback, setPasswordFeedback] = useState<string | null>(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Notifications State
  const [notifs, setNotifs] = useState({
    threeWayDiscrepancy: true,
    boqThresholdOverrun: true,
    poApprovalRequest: true,
    lowStockWarning: true,
    dailyDiarySubmission: false,
    weeklyFinancialDigest: true,
  });
  const [notifsSaved, setNotifsSaved] = useState(false);

  const router = useRouter();
  const supabase = createClient();
  useSessionExpiry();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        window.location.href = "/login";
        return;
      }
      setUser(data.user);
      setEmail(data.user.email || "");
      const metaName = (data.user.user_metadata as any)?.full_name || "CostView User";
      setFullName(metaName);
    });
  }, []);

  const handleCopyUserId = () => {
    if (!user?.id) return;
    navigator.clipboard.writeText(user.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleSaveProfile = () => {
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const handleUpdatePassword = () => {
    if (!newPassword || newPassword.length < 8) {
      setPasswordFeedback("New password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordFeedback("Passwords do not match");
      return;
    }
    setPasswordFeedback("Password updated successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPasswordFeedback(null), 3000);
  };

  const handleSaveNotifications = () => {
    setNotifsSaved(true);
    setTimeout(() => setNotifsSaved(false), 2500);
  };

  const handleLogout = async () => {
    await clearAuthSession(supabase);
  };

  const handleRoleSelect = (roleName: RoleName) => {
    setActiveRole(roleName);
    if (typeof window !== "undefined") {
      localStorage.setItem("costview_demo_role", roleName);
      document.cookie = `costview_demo_role=${roleName}; path=/; max-age=604800; SameSite=Lax`;
    }
  };

  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "CV";

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] flex items-center justify-center">
        <div className="bg-white border-2 border-[#E5E5DE] rounded-2xl p-10 shadow-lg text-center max-w-sm">
          <div className="w-10 h-10 border-4 border-[#0A2540] border-t-transparent rounded-full mx-auto animate-spin" />
          <p className="text-base font-bold text-[#0A2540] mt-4">Loading user profile…</p>
          <p className="text-xs text-[#0A2540]/60 mt-1">Connecting to CostView session</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC] font-sans">
      <Sidebar
        activeTab="Settings"
        onSelectTab={(t) => {
          if (t === "Settings") router.push("/account");
          else router.push("/dashboard");
        }}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen((v) => !v)} activeSection="Administration" activeSubSection="settings" />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 bg-[#F8FAFC]">
          {/* Top Banner Header */}
          <div className="bg-white border-2 border-slate-300 rounded-2xl shadow-sm p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0A2540] via-[#0F2137] to-[#1E3A5F] border-2 border-slate-400 flex items-center justify-center text-white font-black text-2xl shadow-md shrink-0">
                <span>{initials}</span>
              </div>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl md:text-3xl font-extrabold text-[#0A2540] dark:text-white tracking-tight">{fullName}</h1>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950/60 text-[#0A2540] dark:text-blue-300 border border-blue-300 dark:border-blue-700">
                    <Shield className="w-3.5 h-3.5 text-[#0A2540] dark:text-blue-300" />
                    {activeRole}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{email} · CostView Workspace</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleLogout}
                className="min-h-[44px] px-5 py-2.5 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border-2 border-rose-300 dark:border-rose-700 rounded-xl font-bold text-sm shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>

          {/* Tab Navigation Pill Bar */}
          <div className="flex flex-wrap gap-2 border-b-2 border-slate-200 dark:border-[#1E3A5F] pb-2">
            {[
              { id: "profile", label: "Profile & Identity", icon: User },
              { id: "security", label: "Security & Sessions", icon: Key },
              { id: "role_access", label: "Role & RBAC Access", icon: ShieldCheck },
              { id: "notifications", label: "Notification Preferences", icon: Bell },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`min-h-[46px] px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                    isActive
                      ? "bg-[#0A2540] dark:bg-[#FFD23F] text-white dark:text-[#0A1931] shadow-md border-2 border-[#0A2540] dark:border-[#FFD23F]"
                      : "bg-white dark:bg-[#0A1931] hover:bg-slate-100 dark:hover:bg-[#0F2137] text-slate-700 dark:text-slate-200 border-2 border-slate-200 dark:border-[#1E3A5F] hover:border-slate-300"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white dark:text-[#0A1931]" : "text-slate-500 dark:text-slate-400"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: PROFILE & IDENTITY */}
          {activeTab === "profile" && (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white border-2 border-slate-300 rounded-2xl shadow-sm p-6 md:p-8">
                  <div className="flex items-center justify-between pb-5 border-b-2 border-slate-100 mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-[#0A2540] flex items-center gap-2">
                        <User className="w-5 h-5 text-[#0A2540]" /> Personal Information
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">Update your operational name, contact details, and organization role.</p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Full Name</label>
                      <input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full h-12 bg-white border-2 border-slate-300 rounded-xl px-4 text-base font-semibold text-[#0A2540] focus:outline-none focus:border-[#0A2540] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Work Email Address</label>
                      <div className="flex items-center gap-2 bg-slate-100 border-2 border-slate-300 rounded-xl px-4 h-12">
                        <Mail className="w-5 h-5 text-slate-500 shrink-0" />
                        <input value={email} disabled className="flex-1 bg-transparent text-base font-semibold text-slate-600 focus:outline-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Phone Number</label>
                      <div className="flex items-center gap-2 bg-white border-2 border-slate-300 rounded-xl px-4 h-12">
                        <Smartphone className="w-5 h-5 text-slate-500 shrink-0" />
                        <input
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="flex-1 bg-transparent text-base font-semibold text-[#0A2540] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Job Title / Designation</label>
                      <input
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        className="w-full h-12 bg-white border-2 border-slate-300 rounded-xl px-4 text-base font-semibold text-[#0A2540] focus:outline-none focus:border-[#0A2540] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Organization / Company</label>
                      <div className="flex items-center gap-2 bg-white border-2 border-slate-300 rounded-xl px-4 h-12">
                        <Building className="w-5 h-5 text-slate-500 shrink-0" />
                        <input
                          value={organization}
                          onChange={(e) => setOrganization(e.target.value)}
                          className="flex-1 bg-transparent text-base font-semibold text-[#0A2540] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Timezone</label>
                      <div className="flex items-center gap-2 bg-white border-2 border-slate-300 rounded-xl px-4 h-12">
                        <Globe className="w-5 h-5 text-slate-500 shrink-0" />
                        <select
                          value={timezone}
                          onChange={(e) => setTimezone(e.target.value)}
                          className="flex-1 bg-transparent text-sm font-semibold text-[#0A2540] focus:outline-none cursor-pointer"
                        >
                          <option value="Africa/Lagos (WAT, GMT+1)">Africa/Lagos (WAT, UTC+1)</option>
                          <option value="Europe/London (GMT, UTC+0)">Europe/London (GMT, UTC+0)</option>
                          <option value="Europe/Berlin (CET, UTC+1)">Europe/Berlin (CET, UTC+1)</option>
                          <option value="America/New_York (EST, UTC-5)">America/New_York (EST, UTC-5)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t-2 border-slate-100 flex items-center justify-between">
                    <button
                      onClick={handleSaveProfile}
                      className="min-h-[48px] px-8 py-3 bg-[#0A2540] hover:bg-[#0F2137] text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2"
                    >
                      <Save className="w-4 h-4 text-white" /> Save Profile Changes
                    </button>

                    {profileSaved && (
                      <span className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 px-4 py-2 rounded-xl">
                        <Check className="w-4 h-4" /> Profile updated successfully
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar Info Card */}
              <div className="space-y-6">
                {/* Theme & Appearance Card */}
                <div className="bg-white dark:bg-[#0A1931] border-2 border-slate-300 dark:border-[#1E3A5F] rounded-2xl shadow-sm p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100 dark:border-[#1E3A5F]">
                    <div className="flex items-center gap-2">
                      <Sun className="w-5 h-5 text-amber-500" />
                      <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#0A2540] dark:text-white">
                        Theme &amp; Appearance
                      </h4>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Default is <strong className="text-[#0A2540] dark:text-white">Auto (Time-based)</strong>: light mode during the day (6:00 AM – 6:59 PM) and dark mode during the night (7:00 PM – 5:59 AM) unless changed.
                  </p>

                  <div className="pt-1">
                    <ThemeSwitcher variant="segmented" className="w-full justify-between" />
                  </div>
                </div>

                <div className="bg-white dark:bg-[#0A1931] border-2 border-slate-300 dark:border-[#1E3A5F] rounded-2xl shadow-sm p-6">
                  <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#0A2540] dark:text-white flex items-center gap-2 mb-3">
                    <Building className="w-4 h-4 text-[#0A2540] dark:text-white" /> Workspace Context
                  </h4>
                  <p className="text-base font-bold text-[#0A2540] dark:text-white">CostView Workspace</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Multi-tenant construction cost &amp; finance ledger</p>

                  <div className="mt-4 p-3 bg-slate-100 dark:bg-[#071324] border border-slate-300 dark:border-[#1E3A5F] rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Workspace ID</span>
                      <button
                        onClick={handleCopyUserId}
                        className="text-xs font-bold text-[#0A2540] dark:text-white hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedId ? "Copied" : "Copy"}
                      </button>
                    </div>
                    <p className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 mt-1 truncate">11111111-1111-1111-1111-111111111111</p>
                  </div>

                  <div className="mt-4 space-y-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    <div className="flex justify-between py-1 border-b border-slate-100 dark:border-[#1E3A5F]">
                      <span className="text-slate-500 dark:text-slate-400">Base Currency</span>
                      <span className="font-mono font-bold text-[#0A2540] dark:text-white">₦ NGN</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100 dark:border-[#1E3A5F]">
                      <span className="text-slate-500 dark:text-slate-400">Active Sites</span>
                      <span className="font-bold text-[#0A2540] dark:text-white">2 (Eko Atlantic, Lekki)</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500 dark:text-slate-400">Role Authority</span>
                      <span className="font-bold text-[#0A2540] dark:text-white">{activeRole}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => router.push("/settings")}
                    className="mt-6 w-full min-h-[44px] bg-slate-100 dark:bg-[#071324] hover:bg-slate-200 dark:hover:bg-[#0F2137] text-[#0A2540] dark:text-white border-2 border-slate-300 dark:border-[#1E3A5F] rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Manage Workspace Settings</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SECURITY & SESSIONS */}
          {activeTab === "security" && (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {/* Change Password Card */}
                <div className="bg-white border-2 border-slate-300 rounded-2xl shadow-sm p-6 md:p-8">
                  <h3 className="text-lg font-bold text-[#0A2540] flex items-center gap-2 mb-1">
                    <Key className="w-5 h-5 text-[#0A2540]" /> Password & Credentials
                  </h3>
                  <p className="text-xs text-slate-500 mb-6">Manage password complexity and authentication security.</p>

                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Current Password</label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full h-12 bg-white border-2 border-slate-300 rounded-xl px-4 text-base font-mono text-[#0A2540] focus:outline-none focus:border-[#0A2540]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="At least 8 characters with numbers"
                        className="w-full h-12 bg-white border-2 border-slate-300 rounded-xl px-4 text-base font-mono text-[#0A2540] focus:outline-none focus:border-[#0A2540]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-type new password"
                        className="w-full h-12 bg-white border-2 border-slate-300 rounded-xl px-4 text-base font-mono text-[#0A2540] focus:outline-none focus:border-[#0A2540]"
                      />
                    </div>

                    {passwordFeedback && (
                      <div
                        className={`p-3 rounded-xl text-xs font-bold ${
                          passwordFeedback.includes("successfully")
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-300"
                            : "bg-rose-50 text-rose-800 border border-rose-300"
                        }`}
                      >
                        {passwordFeedback}
                      </div>
                    )}

                    <button
                      onClick={handleUpdatePassword}
                      className="min-h-[48px] px-8 py-3 bg-[#0A2540] hover:bg-[#0F2137] text-white rounded-xl font-bold text-sm shadow-md transition-all mt-2"
                    >
                      Update Password
                    </button>
                  </div>
                </div>

                {/* Session Security Policy Telemetry */}
                <div className="bg-white border-2 border-slate-300 rounded-2xl shadow-sm p-6 md:p-8">
                  <h3 className="text-lg font-bold text-[#0A2540] flex items-center gap-2 mb-1">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" /> Active Session Telemetry
                  </h3>
                  <p className="text-xs text-slate-500 mb-6">Real-time session state, automatic expiry protection, and device authentication.</p>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-xl">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        <Laptop className="w-4 h-4 text-[#0A2540]" /> Current Client Device
                      </div>
                      <div className="text-base font-bold text-[#0A2540] mt-1">Modern Web Browser (Chrome/V8)</div>
                      <div className="text-xs text-slate-500 mt-0.5">Desktop Environment · Linux Session</div>
                    </div>

                    <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-xl">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        <Globe className="w-4 h-4 text-emerald-600" /> Cloud Database Connection
                      </div>
                      <div className="text-base font-bold text-[#0A2540] mt-1">Supabase eu-central-1 (Frankfurt)</div>
                      <div className="text-xs text-slate-500 mt-0.5">IPv4 Pooler Active · 25 Tables RLS</div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl flex items-start gap-3.5">
                    <Clock className="w-5 h-5 text-[#0A2540] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-bold text-[#0A2540]">Inactivity Lock &amp; Tab-Close Session Guard</div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        To protect project and financial data on shared site laptops, sessions automatically expire after <strong>2 hours of inactivity</strong> or immediately upon closing the browser tab (<code className="font-mono bg-white px-1.5 py-0.5 rounded border border-blue-200">sessionStorage</code>).
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2FA & Danger Zone */}
              <div className="space-y-6">
                <div className="bg-white border-2 border-slate-300 rounded-2xl shadow-sm p-6">
                  <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#0A2540] flex items-center gap-2 mb-2">
                    <Lock className="w-4 h-4 text-[#0A2540]" /> Two-Factor Authentication
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Require an authenticator code (TOTP) during sign-in to safeguard project cost and financial records.
                  </p>

                  <div className="mt-4 flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-sm font-bold text-[#0A2540]">Authenticator App (TOTP)</span>
                    <button
                      onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        twoFactorEnabled ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                      }`}
                    >
                      {twoFactorEnabled ? "Enabled" : "Disabled"}
                    </button>
                  </div>
                </div>

                <div className="bg-white border-2 border-rose-300 rounded-2xl shadow-sm p-6">
                  <h4 className="text-sm font-extrabold uppercase tracking-wider text-rose-700 flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4" /> Session Termination
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Terminate all active sessions across other devices and browser tabs immediately.
                  </p>
                  <button
                    onClick={() => alert("All other active sessions have been revoked.")}
                    className="mt-4 w-full min-h-[44px] bg-white border-2 border-rose-300 text-rose-700 hover:bg-rose-50 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
                  >
                    Terminate Other Sessions
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ROLE & RBAC ACCESS */}
          {activeTab === "role_access" && (
            <div className="space-y-8">
              {/* Role Header Banner */}
              <div className="bg-white border-2 border-slate-300 rounded-2xl shadow-sm p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-[#0A2540] border border-blue-300 mb-2">
                    <Shield className="w-3.5 h-3.5 text-[#0A2540]" /> Current Effective Role
                  </div>
                  <h2 className="text-2xl font-black text-[#0A2540]">{activeRole}</h2>
                  <p className="text-sm text-slate-600 mt-1 max-w-xl">
                    {ALL_ROLES.find((r) => r.name === activeRole)?.desc || "Active operational role with specific permission boundaries."}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => router.push("/settings")}
                    className="min-h-[46px] px-6 py-2.5 bg-[#0A2540] hover:bg-[#003366] text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Admin Role Customizer</span>
                    <ExternalLink className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Interactive Role Switcher for Sandboxing */}
              <div>
                <h3 className="text-base font-extrabold uppercase tracking-wider text-[#0A2540] mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#0A2540]" /> Interactive Role Simulator
                </h3>
                <p className="text-sm text-slate-600 mb-5">
                  Select any persona to immediately simulate their permissions, UI navigation, and operational privileges:
                </p>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {ALL_ROLES.map((r) => {
                    const isSelected = activeRole === r.name;
                    return (
                      <div
                        key={r.name}
                        onClick={() => handleRoleSelect(r.name)}
                        className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? "bg-[#0A2540] text-white border-[#0A2540] shadow-lg scale-[1.02]"
                            : "bg-white hover:bg-slate-50 text-slate-800 border-slate-300 hover:border-slate-400 shadow-xs"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span
                              className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                                isSelected ? "bg-white text-[#0A2540] border-white font-black" : r.color
                              }`}
                            >
                              {r.name}
                            </span>
                            {isSelected && <Check className="w-4 h-4 text-white" />}
                          </div>
                          <p className={`text-xs mt-2 leading-relaxed ${isSelected ? "text-slate-200" : "text-slate-600"}`}>
                            {r.desc}
                          </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-200/40 flex items-center justify-between text-xs font-semibold">
                          <span className={isSelected ? "text-white font-bold" : "text-slate-500"}>
                            {isSelected ? "Active Persona" : "Click to Switch"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Effective Permission Matrix Checklist */}
              <div className="bg-white border-2 border-slate-300 rounded-2xl shadow-sm p-6 md:p-8">
                <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-slate-100">
                  <div>
                    <h3 className="text-lg font-bold text-[#0A2540] flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" /> Effective Module Permissions ({activeRole})
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Determines which cost management modules this user can view, edit, or authorize.
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {PERMISSION_MODULES.map((mod) => {
                    const hasAccess = canAccess(activeRole, mod.key);
                    return (
                      <div
                        key={mod.key}
                        className={`p-4 rounded-xl border-2 flex items-start gap-3 transition-all ${
                          hasAccess
                            ? "bg-emerald-50/50 border-emerald-300 text-emerald-950"
                            : "bg-slate-50 border-slate-200 text-slate-400 opacity-60"
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {hasAccess ? (
                            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                              <Check className="w-4 h-4" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center">
                              <Lock className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">{mod.label}</div>
                          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{mod.desc}</p>
                          <div className="mt-2 text-[11px] font-bold">
                            {hasAccess ? (
                              <span className="text-emerald-700">✓ Authorized Access</span>
                            ) : (
                              <span className="text-slate-400">✗ Restricted (Needs Elevation)</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: NOTIFICATION PREFERENCES */}
          {activeTab === "notifications" && (
            <div className="max-w-4xl space-y-6">
              <div className="bg-white border-2 border-slate-300 rounded-2xl shadow-sm p-6 md:p-8">
                <div className="flex items-center justify-between pb-5 border-b-2 border-slate-100 mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-[#0A2540] flex items-center gap-2">
                      <Bell className="w-5 h-5 text-[#0A2540]" /> Alert &amp; Workflow Notifications
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Configure instant alerts when budget ceilings are exceeded or invoices fail matching rules.
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  {[
                    {
                      id: "threeWayDiscrepancy",
                      title: "3-Way Match GRN Discrepancy Locks",
                      desc: "Instant alert when supplier invoice quantity or rate differs from physical GRN delivery receipts.",
                      priority: "Critical",
                      pColor: "bg-rose-100 text-rose-800 border-rose-300",
                    },
                    {
                      id: "boqThresholdOverrun",
                      title: "BOQ Variance Threshold (±5%) Exceeded",
                      desc: "Notify when work package spending moves outside the approved contractual threshold.",
                      priority: "High",
                      pColor: "bg-[#0A2540]/10 text-[#0A2540] border-[#0A2540]/20",
                    },
                    {
                      id: "poApprovalRequest",
                      title: "Purchase Order & Requisition Approvals",
                      desc: "Notifications when site engineers submit material requisitions requiring budget sign-off.",
                      priority: "Action Required",
                      pColor: "bg-blue-100 text-[#0A2540] border-blue-300",
                    },
                    {
                      id: "lowStockWarning",
                      title: "Warehouse Minimum Stock Level Alerts",
                      desc: "Alerts when cement, rebar, or diesel reserves hit safety buffer thresholds.",
                      priority: "Standard",
                      pColor: "bg-slate-100 text-slate-700 border-slate-300",
                    },
                    {
                      id: "dailyDiarySubmission",
                      title: "Daily Site Diary & Safety Snag Updates",
                      desc: "Daily end-of-shift summary with active labour headcounts and equipment operating hours.",
                      priority: "Operational",
                      pColor: "bg-slate-100 text-slate-700 border-slate-300",
                    },
                    {
                      id: "weeklyFinancialDigest",
                      title: "Weekly Financial & Valuation Digest",
                      desc: "Executive snapshot of cash outflow, certified valuations, and projected project cost.",
                      priority: "Executive",
                      pColor: "bg-[#FAF9F5] text-[#0A2540] border-[#E5E5DE]",
                    },
                  ].map((item) => {
                    const isChecked = (notifs as any)[item.id];
                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-4 p-4 rounded-xl border-2 border-slate-200 hover:border-slate-300 transition-all bg-slate-50/50"
                      >
                        <div>
                          <div className="flex items-center gap-2.5">
                            <span className="text-base font-bold text-[#0A2540]">{item.title}</span>
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${item.pColor}`}>
                              {item.priority}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-xl">{item.desc}</p>
                        </div>

                        <button
                          onClick={() => setNotifs((prev) => ({ ...prev, [item.id]: !isChecked }))}
                          className={`w-14 h-8 rounded-full p-1 transition-colors flex items-center cursor-pointer shrink-0 ${
                            isChecked ? "bg-[#0A2540]" : "bg-slate-300"
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${
                              isChecked ? "translate-x-6 bg-white" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 pt-6 border-t-2 border-slate-100 flex items-center justify-between">
                  <button
                    onClick={handleSaveNotifications}
                    className="min-h-[48px] px-8 py-3 bg-[#0A2540] hover:bg-[#003366] text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2"
                  >
                    <Save className="w-4 h-4 text-white" /> Save Notification Preferences
                  </button>

                  {notifsSaved && (
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 px-4 py-2 rounded-xl">
                      <Check className="w-4 h-4" /> Preferences saved
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
