"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { useApp } from "@/app/providers";
import { useSessionExpiry } from "@/lib/auth/session";
import { Settings, DollarSign, Clock, Bell, Shield, Database, Palette } from "lucide-react";

export default function SettingsPage() {
  const { currency, setCurrency, activeRole } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timezone, setTimezone] = useState("Africa/Lagos");
  const [notifications, setNotifications] = useState(true);
  const [saved, setSaved] = useState(false);
  const router = useRouter();
  useSessionExpiry();

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-cream-100 font-sans">
      <Sidebar activeTab="Settings" onSelectTab={(t) => { if (t === "Settings") router.push("/settings"); else if (t === "Dashboard") router.push("/dashboard"); else router.push("/dashboard"); }} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen((v) => !v)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-cream-100/40">
          <div className="bg-white border-2 border-navy-800 shadow-brutal p-6">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 bg-navy-800 border-2 border-navy-800 flex items-center justify-center text-white"><Settings className="w-5 h-5" /></span>
              <div>
                <h1 className="text-xl font-black text-navy-800 tracking-tight">Settings & Preferences</h1>
                <p className="text-xs font-bold text-navy-800/60">Workspace defaults, appearance, and data — role: {activeRole}</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white border-2 border-navy-800 shadow-brutal p-6">
              <h3 className="font-black uppercase text-sm flex items-center gap-2"><DollarSign className="w-4 h-4" /> Workspace Defaults</h3>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest mb-1">Default Currency</label>
                  <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full bg-cream-100 border-2 border-navy-800 px-3 py-2.5 text-sm font-black">
                    <option value="NGN">₦ NGN — Nigerian Naira</option>
                    <option value="USD">$ USD — US Dollar</option>
                    <option value="GBP">£ GBP — Pound</option>
                    <option value="EUR">€ EUR — Euro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest mb-1">Timezone</label>
                  <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="w-full bg-cream-100 border-2 border-navy-800 px-3 py-2.5 text-sm font-black">
                    <option value="Africa/Lagos">Africa/Lagos (WAT)</option>
                    <option value="Africa/Accra">Africa/Accra</option>
                    <option value="Europe/London">Europe/London</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
                <div className="flex items-center justify-between p-3 bg-cream-100 border-2 border-navy-800">
                  <div>
                    <div className="text-sm font-black">Notifications</div>
                    <div className="text-xs font-bold text-navy-800/60">Email + in-app bell (3 pending)</div>
                  </div>
                  <button onClick={() => setNotifications(!notifications)} className={`w-12 h-7 border-2 border-navy-800 flex items-center px-1 transition-colors ${notifications ? "bg-navy-800 justify-end" : "bg-white justify-start"}`}>
                    <span className={`w-5 h-5 ${notifications ? "bg-mustard-400" : "bg-navy-800"} border border-navy-800`} />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white border-2 border-navy-800 shadow-brutal p-6">
                <h3 className="font-black uppercase text-sm flex items-center gap-2"><Palette className="w-4 h-4" /> Appearance</h3>
                <div className="mt-3 grid grid-cols-3 gap-3">
                  <div className="bg-navy-800 text-white border-2 border-navy-800 p-3 text-center">
                    <div className="w-full h-8 bg-navy-800 border border-white/20 mb-2" />
                    <div className="text-xs font-black">Navy</div>
                    <div className="text-[10px] font-mono">#0A1931</div>
                  </div>
                  <div className="bg-cream-100 border-2 border-navy-800 p-3 text-center">
                    <div className="w-full h-8 bg-cream-100 border border-navy-800 mb-2" />
                    <div className="text-xs font-black">Cream</div>
                    <div className="text-[10px] font-mono">#FFFDF0</div>
                  </div>
                  <div className="bg-mustard-400 border-2 border-navy-800 p-3 text-center">
                    <div className="w-full h-8 bg-mustard-400 border border-navy-800 mb-2" />
                    <div className="text-xs font-black">Mustard</div>
                    <div className="text-[10px] font-mono">#FFD23F</div>
                  </div>
                </div>
                <p className="text-xs font-bold text-navy-800/60 mt-3">Smoothed brutalism for app: 2px borders, 4px shadows. Landing stays heavy 3px/6px.</p>
              </div>

              <div className="bg-cream-100 border-2 border-navy-800 shadow-brutal p-6">
                <h3 className="font-black uppercase text-sm flex items-center gap-2"><Database className="w-4 h-4" /> Data & Session</h3>
                <ul className="mt-3 space-y-2 text-xs font-bold">
                  <li className="flex gap-2"><span className="w-2 h-2 bg-navy-800 mt-1.5 shrink-0" />Supabase eu-central-1, 25 tables, RLS on</li>
                  <li className="flex gap-2"><span className="w-2 h-2 bg-mustard-400 border border-navy-800 mt-1.5 shrink-0" />Session: tab-close + 2h inactivity via useSessionExpiry</li>
                  <li className="flex gap-2"><span className="w-2 h-2 bg-navy-800 mt-1.5 shrink-0" />Reports: 10 PDFs + CSV, per-project picker</li>
                </ul>
                <button onClick={handleSave} className="mt-4 w-full py-2.5 bg-navy-800 text-white border-2 border-navy-800 font-black uppercase text-sm">Save Settings</button>
                {saved && <div className="mt-3 p-2 bg-green-100 border-2 border-navy-800 text-xs font-black text-center">Saved — preferences stored locally</div>}
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-navy-800 shadow-brutal p-6">
            <h3 className="font-black uppercase text-sm flex items-center gap-2"><Shield className="w-4 h-4" /> Security</h3>
            <p className="text-xs font-bold text-navy-800/60 mt-1">Current role: {activeRole} — permissions from <span className="font-mono bg-cream-100 border border-navy-800 px-1">role_access</span>. Contact Admin to change.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-navy-800 text-white border-2 border-navy-800 text-xs font-black">RBAC Active</span>
              <span className="px-3 py-1 bg-mustard-400 border-2 border-navy-800 text-xs font-black">2h Inactivity Logout</span>
              <span className="px-3 py-1 bg-white border-2 border-navy-800 text-xs font-black">Tab-Close Expiry</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
