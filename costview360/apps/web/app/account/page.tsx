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
        router.push("/login");
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
    sessionStorage.clear();
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center">
        <div className="bg-white border-2 border-navy-800 p-8 shadow-brutal text-center">
          <div className="w-10 h-10 bg-navy-800 border-2 border-navy-800 mx-auto animate-pulse" />
          <p className="text-sm font-bold mt-3">Loading account…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-cream-100 font-sans">
      <Sidebar activeTab="Settings" onSelectTab={(t) => { if (t === "Settings") router.push("/account"); else router.push("/dashboard"); }} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen((v) => !v)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-cream-100/40">
          <div className="bg-white border-2 border-navy-800 shadow-brutal p-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-10 h-10 bg-navy-800 border-2 border-navy-800 flex items-center justify-center text-white"><User className="w-5 h-5" /></span>
              <div>
                <h1 className="text-xl font-black text-navy-800 tracking-tight">Account Center</h1>
                <p className="text-xs font-bold text-navy-800/60">Profile, workspace, and security — session expires on tab close or 2h inactivity</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border-2 border-navy-800 shadow-brutal p-6">
                <h3 className="font-black uppercase text-sm flex items-center gap-2"><User className="w-4 h-4" /> Profile</h3>
                <div className="mt-4 grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest mb-1">Full Name</label>
                    <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-cream-100 border-2 border-navy-800 px-3 py-2.5 text-sm font-bold" />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest mb-1">Work Email</label>
                    <div className="flex items-center gap-2 bg-cream-100 border-2 border-navy-800 px-3 py-2.5">
                      <Mail className="w-4 h-4 text-navy-800" />
                      <input value={email} disabled className="flex-1 bg-transparent text-sm font-bold text-navy-800/60 focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest mb-1">Role (per project)</label>
                    <div className="flex items-center gap-2 bg-navy-800 text-white border-2 border-navy-800 px-3 py-2.5">
                      <Shield className="w-4 h-4 text-mustard-400" />
                      <span className="text-sm font-black">{activeRole}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest mb-1">User ID</label>
                    <div className="text-xs font-mono bg-cream-100 border-2 border-navy-800 px-3 py-2.5 truncate">{user.id}</div>
                  </div>
                </div>
                <button onClick={handleSave} className="mt-4 px-5 py-2.5 bg-navy-800 text-white border-2 border-navy-800 font-black uppercase text-sm flex items-center gap-2">
                  <Save className="w-4 h-4 text-mustard-400" /> Save Profile
                </button>
                {saved && <div className="mt-3 p-2 bg-green-100 border-2 border-navy-800 text-xs font-black text-center">Saved locally (wire to Supabase profiles when live)</div>}
              </div>

              <div className="bg-white border-2 border-navy-800 shadow-brutal p-6">
                <h3 className="font-black uppercase text-sm flex items-center gap-2"><Key className="w-4 h-4" /> Security</h3>
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest mb-1">New Password</label>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="At least 8 characters" className="w-full bg-cream-100 border-2 border-navy-800 px-3 py-2.5 text-sm font-mono" />
                  </div>
                  <button onClick={() => { setNewPassword(""); alert("Password update wired to supabase.auth.updateUser when live"); }} className="px-5 py-2.5 bg-mustard-400 border-2 border-navy-800 font-black uppercase text-sm">Update Password</button>
                  <div className="text-xs font-bold text-navy-800/50">Session: expires on tab close (sessionStorage) or 2h inactivity — handled by useSessionExpiry hook</div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-navy-800 text-white border-2 border-navy-800 shadow-brutal p-6">
                <h3 className="font-black uppercase text-sm flex items-center gap-2"><Building className="w-4 h-4 text-mustard-400" /> Workspace</h3>
                <p className="text-sm font-bold text-white/70 mt-2">CostView Demo Workspace</p>
                <p className="text-xs font-mono bg-white/10 border border-white/20 px-2 py-1 mt-2">ID: 11111111-1111-1111-1111-111111111111</p>
                <p className="text-xs font-bold text-white/60 mt-3">Currency: ₦ NGN · Projects: 2 (Eko Atlantic, Lekki)</p>
                <button onClick={() => router.push("/settings")} className="mt-4 w-full py-2.5 bg-mustard-400 text-navy-800 border-2 border-navy-800 font-black uppercase text-sm">Go to Settings →</button>
              </div>
              <div className="bg-white border-2 border-navy-800 shadow-brutal p-6">
                <h3 className="font-black uppercase text-sm">Danger Zone</h3>
                <p className="text-xs font-bold text-navy-800/60 mt-1">Sign out clears sessionStorage + localStorage and redirects to /login</p>
                <button onClick={handleLogout} className="mt-4 w-full py-3 bg-white border-2 border-navy-800 font-black uppercase text-sm flex items-center justify-center gap-2 hover:bg-red-50">
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
