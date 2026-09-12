"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { useApp } from "@/app/providers";
import { useSessionExpiry } from "@/lib/auth/session";
import { User, Mail, Shield, Building, Key, LogOut, Save } from "lucide-react";

export default function AccountPage() {
  const { activeRole } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saved, setSaved] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  useSessionExpiry();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        const demoRole = typeof window !== "undefined" ? localStorage.getItem("costview_demo_role") : null;
        const demoEmail = typeof window !== "undefined" ? localStorage.getItem("costview_demo_email") : null;
        if (demoRole) {
          const fallbackEmail = demoEmail || "demo@costview.ng";
          setUser({ id: "demo-sandbox-id", email: fallbackEmail, user_metadata: { full_name: `CostView Demo (${demoRole})` } });
          setEmail(fallbackEmail);
          setFullName(`CostView Demo (${demoRole})`);
          return;
        }
        window.location.href = "/login";
        return;
      }
      setUser(data.user);
      setEmail(data.user.email || "");
      setFullName((data.user.user_metadata as any)?.full_name || "");
    });
  }, []);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("costview_demo_role");
    localStorage.removeItem("costview_demo_email");
    localStorage.removeItem("costview_last_active");
    document.cookie = "costview_demo_role=; path=/; max-age=0";
    sessionStorage.clear();
    window.location.href = "/login";
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f3f3f3] flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-xl p-8 shadow-card text-center">
          <div className="w-8 h-8 border border-[#0067c0] border-t-transparent rounded-full mx-auto animate-spin" />
          <p className="text-sm font-medium text-slate-900 mt-3">Loading account…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f3f3f3] font-sans">
      <Sidebar activeTab="Settings" onSelectTab={(t) => { if (t === "Settings") router.push("/account"); else router.push("/dashboard"); }} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen((v) => !v)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-white">
          <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-xl shadow-card p-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-10 h-10 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center text-[#0067c0]"><User className="w-5 h-5" /></span>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Account Center</h1>
                <p className="text-xs text-slate-500">Profile, workspace, and security — session expires on tab close or 2h inactivity</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-xl shadow-card p-6">
                <h3 className="font-semibold uppercase tracking-wider text-xs text-slate-500 flex items-center gap-2"><User className="w-4 h-4 text-[#0067c0]" /> Profile Details</h3>
                <div className="mt-4 grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-900 mb-1">Full Name</label>
                    <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-white border border-slate-200/80 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#0067c0] focus:ring-1 focus:ring-[#0067c0]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-900 mb-1">Work Email</label>
                    <div className="flex items-center gap-2 bg-slate-50/80 border border-slate-200/80 rounded-lg px-3 py-2">
                      <Mail className="w-4 h-4 text-slate-500" />
                      <input value={email} disabled className="flex-1 bg-transparent text-sm text-slate-500 focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-900 mb-1">Role (per project)</label>
                    <div className="flex items-center gap-2 bg-blue-50 text-[#0067c0] border border-blue-200 rounded-lg px-3 py-2">
                      <Shield className="w-4 h-4" />
                      <span className="text-sm font-semibold">{activeRole}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-900 mb-1">User ID</label>
                    <div className="text-xs font-mono bg-slate-50/80 border border-slate-200/80 rounded-lg px-3 py-2 truncate text-slate-500">{user.id}</div>
                  </div>
                </div>
                <button onClick={handleSave} className="mt-4 px-5 py-2.5 bg-[#0067c0] hover:bg-[#005ba1] text-white rounded-lg font-semibold text-xs uppercase tracking-wider shadow-xs rounded-xl transition-all active:scale-[0.98] flex items-center gap-2">
                  <Save className="w-4 h-4" /> Save Profile
                </button>
                {saved && <div className="mt-3 p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-medium text-emerald-700 text-center">Saved locally</div>}
              </div>

              <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-xl shadow-card p-6">
                <h3 className="font-semibold uppercase tracking-wider text-xs text-slate-500 flex items-center gap-2"><Key className="w-4 h-4 text-[#0067c0]" /> Security & Password</h3>
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-900 mb-1">New Password</label>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="At least 8 characters" className="w-full bg-white border border-slate-200/80 rounded-lg px-3 py-2 text-sm font-mono text-slate-900 focus:outline-none focus:border-[#0067c0] focus:ring-1 focus:ring-[#0067c0]" />
                  </div>
                  <button onClick={() => { setNewPassword(""); alert("Password update wired to supabase.auth.updateUser when live"); }} className="px-5 py-2 bg-white hover:bg-[#f5f5f5] text-slate-900 border border-slate-200/80 rounded-lg font-semibold text-xs uppercase tracking-wider shadow-xs rounded-xl transition-all">Update Password</button>
                  <div className="text-xs text-slate-500">Session: expires on tab close (sessionStorage) or 2h inactivity — handled by useSessionExpiry hook</div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="smooth-pearl-hero text-slate-900 rounded-2xl shadow-pearl p-6 border border-sky-200/80">
                <h3 className="font-semibold uppercase tracking-wider text-xs text-[#0067c0] flex items-center gap-2"><Building className="w-4 h-4 text-[#0067c0]" /> Workspace</h3>
                <p className="text-base font-bold text-slate-900 mt-2">CostView Demo Workspace</p>
                <p className="text-xs font-mono bg-sky-50 border border-sky-200/80 rounded-lg px-2.5 py-1 mt-2 text-[#0067c0]">ID: 11111111-1111-1111-1111-111111111111</p>
                <p className="text-xs text-slate-600 mt-3">Currency: ₦ NGN · Projects: 2 (Eko Atlantic, Lekki)</p>
                <button onClick={() => router.push("/settings")} className="mt-4 w-full py-2.5 bg-gradient-to-r from-[#0067c0] to-[#0284c7] hover:from-[#005ba1] hover:to-[#0275b0] text-white rounded-xl font-semibold text-xs shadow-md shadow-blue-600/20 transition-all active:scale-[0.98]">Go to Settings →</button>
              </div>
              <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-xl shadow-card p-6">
                <h3 className="font-semibold uppercase tracking-wider text-xs text-red-600">Danger Zone</h3>
                <p className="text-xs text-slate-500 mt-1">Sign out clears active session and returns to login</p>
                <button onClick={handleLogout} className="mt-4 w-full py-2.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg font-semibold text-xs uppercase tracking-wider shadow-xs rounded-xl transition-all flex items-center justify-center gap-2">
                  <LogOut className="w-4 h-4" /> Log out
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
