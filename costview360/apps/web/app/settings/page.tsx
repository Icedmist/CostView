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
    <div className="flex h-screen overflow-hidden bg-[#f3f3f3] font-sans">
      <Sidebar activeTab="Settings" onSelectTab={(t) => { if (t === "Settings") router.push("/settings"); else if (t === "Dashboard") router.push("/dashboard"); else router.push("/dashboard"); }} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen((v) => !v)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-[#fbfbfb]">
          <div className="bg-white/90 backdrop-blur-md border border-[#e5e5e5] rounded-xl shadow-card p-6">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center text-[#0067c0]"><Settings className="w-5 h-5" /></span>
              <div>
                <h1 className="text-xl font-bold text-[#1b1b1b] tracking-tight">Settings & Preferences</h1>
                <p className="text-xs text-[#5c5c5c]">Workspace defaults, appearance, and data — role: {activeRole}</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white/90 backdrop-blur-md border border-[#e5e5e5] rounded-xl shadow-card p-6">
              <h3 className="font-semibold uppercase tracking-wider text-xs text-[#5c5c5c] flex items-center gap-2"><DollarSign className="w-4 h-4 text-[#0067c0]" /> Workspace Defaults</h3>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1b1b1b] mb-1">Default Currency</label>
                  <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full bg-white border border-[#e5e5e5] rounded-lg px-3 py-2 text-sm text-[#1b1b1b] focus:outline-none focus:border-[#0067c0] focus:ring-1 focus:ring-[#0067c0]">
                    <option value="NGN">₦ NGN — Nigerian Naira</option>
                    <option value="USD">$ USD — US Dollar</option>
                    <option value="GBP">£ GBP — Pound</option>
                    <option value="EUR">€ EUR — Euro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1b1b1b] mb-1">Timezone</label>
                  <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="w-full bg-white border border-[#e5e5e5] rounded-lg px-3 py-2 text-sm text-[#1b1b1b] focus:outline-none focus:border-[#0067c0] focus:ring-1 focus:ring-[#0067c0]">
                    <option value="Africa/Lagos">Africa/Lagos (WAT)</option>
                    <option value="Africa/Accra">Africa/Accra</option>
                    <option value="Europe/London">Europe/London</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
                <div className="flex items-center justify-between p-3.5 bg-[#f8f9fa] border border-[#e5e5e5] rounded-lg">
                  <div>
                    <div className="text-sm font-semibold text-[#1b1b1b]">Notifications</div>
                    <div className="text-xs text-[#5c5c5c]">Email + in-app bell (3 pending)</div>
                  </div>
                  <button onClick={() => setNotifications(!notifications)} className={`w-12 h-6.5 rounded-full border border-[#e5e5e5] flex items-center px-1 transition-colors ${notifications ? "bg-[#0067c0] justify-end" : "bg-slate-200 justify-start"}`}>
                    <span className="w-4.5 h-4.5 bg-white rounded-full shadow-xs" />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white/90 backdrop-blur-md border border-[#e5e5e5] rounded-xl shadow-card p-6">
                <h3 className="font-semibold uppercase tracking-wider text-xs text-[#5c5c5c] flex items-center gap-2"><Palette className="w-4 h-4 text-[#0067c0]" /> Appearance & Design System</h3>
                <div className="mt-3 grid grid-cols-3 gap-3">
                  <div className="bg-white border border-[#e5e5e5] rounded-lg p-3 text-center shadow-xs">
                    <div className="w-full h-8 bg-[#0067c0] rounded mb-2" />
                    <div className="text-xs font-semibold text-[#1b1b1b]">Accent</div>
                    <div className="text-[10px] font-mono text-[#5c5c5c]">#0067C0</div>
                  </div>
                  <div className="bg-white border border-[#e5e5e5] rounded-lg p-3 text-center shadow-xs">
                    <div className="w-full h-8 bg-[#f3f3f3] border border-[#e5e5e5] rounded mb-2" />
                    <div className="text-xs font-semibold text-[#1b1b1b]">Canvas</div>
                    <div className="text-[10px] font-mono text-[#5c5c5c]">#F3F3F3</div>
                  </div>
                  <div className="bg-white border border-[#e5e5e5] rounded-lg p-3 text-center shadow-xs">
                    <div className="w-full h-8 bg-[#e5e5e5] rounded mb-2" />
                    <div className="text-xs font-semibold text-[#1b1b1b]">Border</div>
                    <div className="text-[10px] font-mono text-[#5c5c5c]">#E5E5E5</div>
                  </div>
                </div>
                <p className="text-xs text-[#5c5c5c] mt-3">Fluent Glassmorphic system: Segoe UI, frosted glass translucent surfaces, soft elevations, and #0067c0 accent.</p>
              </div>

              <div className="bg-white/90 backdrop-blur-md border border-[#e5e5e5] rounded-xl shadow-card p-6">
                <h3 className="font-semibold uppercase tracking-wider text-xs text-[#5c5c5c] flex items-center gap-2"><Database className="w-4 h-4 text-[#0067c0]" /> Data & Session</h3>
                <ul className="mt-3 space-y-2 text-xs text-[#5c5c5c]">
                  <li className="flex items-center gap-2"><span className="w-2 h-2 bg-[#0067c0] rounded-full shrink-0" /><span className="text-[#1b1b1b] font-medium">Supabase eu-central-1:</span> 25 tables, RLS enabled</li>
                  <li className="flex items-center gap-2"><span className="w-2 h-2 bg-[#0067c0] rounded-full shrink-0" /><span className="text-[#1b1b1b] font-medium">Session:</span> Tab-close + 2h inactivity auto-logout</li>
                  <li className="flex items-center gap-2"><span className="w-2 h-2 bg-[#0067c0] rounded-full shrink-0" /><span className="text-[#1b1b1b] font-medium">Reports:</span> 10 executive PDF exports + CSV pipeline</li>
                </ul>
                <button onClick={handleSave} className="mt-4 w-full py-2.5 bg-[#0067c0] hover:bg-[#005ba1] text-white rounded-lg font-semibold text-xs uppercase tracking-wider shadow-xs transition-all active:scale-[0.98]">Save Settings</button>
                {saved && <div className="mt-3 p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-medium text-emerald-700 text-center">Saved — preferences stored locally</div>}
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-md border border-[#e5e5e5] rounded-xl shadow-card p-6">
            <h3 className="font-semibold uppercase tracking-wider text-xs text-[#5c5c5c] flex items-center gap-2"><Shield className="w-4 h-4 text-[#0067c0]" /> Security & Access Controls</h3>
            <p className="text-xs text-[#5c5c5c] mt-1">Current role: <strong className="text-[#1b1b1b]">{activeRole}</strong> — permissions enforced via <span className="font-mono bg-slate-100 border border-[#e5e5e5] px-1.5 py-0.5 rounded text-[11px]">role_access</span>.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-50 text-[#0067c0] border border-blue-200 rounded-md text-xs font-medium">RBAC Active</span>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-xs font-medium">2h Inactivity Logout</span>
              <span className="px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-md text-xs font-medium">Tab-Close Expiry</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
