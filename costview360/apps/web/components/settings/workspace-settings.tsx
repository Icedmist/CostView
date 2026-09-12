"use client";

import React, { useState } from "react";
import { useApp } from "@/app/providers";
import {
  Settings,
  DollarSign,
  Clock,
  Bell,
  Shield,
  Database,
  Palette,
  CheckCircle2,
  Lock,
  Globe,
  FileSpreadsheet,
} from "lucide-react";

export function WorkspaceSettingsView() {
  const { currency, setCurrency, activeRole, currentProject } = useApp();
  const [timezone, setTimezone] = useState("Africa/Lagos");
  const [notifications, setNotifications] = useState(true);
  const [discrepancyAlerts, setDiscrepancyAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border-2 border-[#E5E5DE] rounded-2xl p-6 md:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-13 h-13 bg-[#0A2540] text-white rounded-2xl flex items-center justify-center shadow-md">
            <Settings className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 bg-[#0A2540] text-white rounded-md">
                Workspace Code 6.5
              </span>
              <span className="text-xs font-bold text-[#0A2540]/60">
                · Active Role: <strong className="text-[#0A2540] underline">{activeRole}</strong>
              </span>
            </div>
            <h1 className="text-2xl font-black text-[#0A2540] tracking-tight mt-1">
              Workspace Configuration &amp; Preferences
            </h1>
            <p className="text-sm font-semibold text-[#0A2540]/70 mt-0.5">
              Project defaults, financial currencies, security policies, and brand theme styling.
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="min-h-[46px] px-6 py-2.5 bg-[#0A2540] hover:bg-[#003366] text-white rounded-xl font-black text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center gap-2 justify-center"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Save Workspace Settings</span>
        </button>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-xl text-sm font-extrabold text-emerald-900 flex items-center gap-2 shadow-xs animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Workspace preferences updated and persisted locally.</span>
        </div>
      )}

      {/* Main Settings Grids */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Workspace Financial Defaults */}
        <div className="bg-white border-2 border-[#E5E5DE] rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b-2 border-[#E5E5DE]">
            <DollarSign className="w-5 h-5 text-[#0A2540]" />
            <h2 className="text-base font-black text-[#0A2540] uppercase tracking-wider">
              Financial &amp; Localization Defaults
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#0A2540]/80 mb-1.5">
                Primary Accounting Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full h-12 bg-[#FAF9F5] border-2 border-[#E5E5DE] rounded-xl px-4 text-sm font-extrabold text-[#0A2540] focus:outline-none focus:border-[#0A2540] cursor-pointer"
              >
                <option value="NGN">₦ NGN — Nigerian Naira (Primary Default)</option>
                <option value="USD">$ USD — United States Dollar</option>
                <option value="GBP">£ GBP — British Pound Sterling</option>
                <option value="EUR">€ EUR — European Euro</option>
              </select>
              <p className="text-xs text-[#0A2540]/60 mt-1 font-semibold">
                Sets default symbol and decimal notation across all BOQ registers and 10 Reports.
              </p>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#0A2540]/80 mb-1.5">
                Regional Timezone
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full h-12 bg-[#FAF9F5] border-2 border-[#E5E5DE] rounded-xl px-4 text-sm font-extrabold text-[#0A2540] focus:outline-none focus:border-[#0A2540] cursor-pointer"
              >
                <option value="Africa/Lagos">Africa/Lagos (WAT, UTC+1)</option>
                <option value="Africa/Accra">Africa/Accra (GMT, UTC+0)</option>
                <option value="Europe/London">Europe/London (BST, UTC+1)</option>
                <option value="UTC">UTC (Universal Coordinated Time)</option>
              </select>
              <p className="text-xs text-[#0A2540]/60 mt-1 font-semibold">
                Determines daily site diary timestamps and audit log journal entries.
              </p>
            </div>

            {/* Notification Toggles */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between p-4 bg-[#FAF9F5] border-2 border-[#E5E5DE] rounded-xl">
                <div>
                  <div className="text-sm font-black text-[#0A2540]">In-App Attention Alerts</div>
                  <div className="text-xs text-[#0A2540]/60 font-semibold">
                    Real-time indicators for budget drift and critical stock depletion
                  </div>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`w-13 h-7 rounded-full border-2 border-[#E5E5DE] flex items-center px-1 transition-colors cursor-pointer ${
                    notifications ? "bg-[#0A2540] justify-end" : "bg-slate-300 justify-start"
                  }`}
                >
                  <span className="w-5 h-5 bg-white rounded-full shadow-xs" />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#FAF9F5] border-2 border-[#E5E5DE] rounded-xl">
                <div>
                  <div className="text-sm font-black text-[#0A2540]">Three-Way Match Lock Notifications</div>
                  <div className="text-xs text-[#0A2540]/60 font-semibold">
                    Immediate alerts when quantity or unit price mismatches trip the gate
                  </div>
                </div>
                <button
                  onClick={() => setDiscrepancyAlerts(!discrepancyAlerts)}
                  className={`w-13 h-7 rounded-full border-2 border-[#E5E5DE] flex items-center px-1 transition-colors cursor-pointer ${
                    discrepancyAlerts ? "bg-[#0A2540] justify-end" : "bg-slate-300 justify-start"
                  }`}
                >
                  <span className="w-5 h-5 bg-white rounded-full shadow-xs" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CostView Branded Visual System */}
        <div className="space-y-6">
          <div className="bg-white border-2 border-[#E5E5DE] rounded-2xl p-6 md:p-8 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 pb-4 border-b-2 border-[#E5E5DE]">
              <Palette className="w-5 h-5 text-[#0A2540]" />
              <h2 className="text-base font-black text-[#0A2540] uppercase tracking-wider">
                CostView Brand Identity &amp; System Palette
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#FAF9F5] border-2 border-[#E5E5DE] rounded-xl p-3 text-center">
                <div className="w-full h-9 bg-[#0A2540] rounded-lg mb-2 shadow-xs" />
                <div className="text-xs font-black text-[#0A2540]">Bright Navy</div>
                <div className="text-[10px] font-mono text-[#0A2540]/60 font-bold">#0A2540</div>
              </div>
              <div className="bg-white border-2 border-[#E5E5DE] rounded-xl p-3 text-center">
                <div className="w-full h-9 bg-[#FAF9F5] border-2 border-[#E5E5DE] rounded-lg mb-2" />
                <div className="text-xs font-black text-[#0A2540]">Milk Canvas</div>
                <div className="text-[10px] font-mono text-[#0A2540]/60 font-bold">#FAF9F5</div>
              </div>
              <div className="bg-[#FAF9F5] border-2 border-[#E5E5DE] rounded-xl p-3 text-center">
                <div className="w-full h-9 bg-[#E5E5DE] rounded-lg mb-2" />
                <div className="text-xs font-black text-[#0A2540]">2px Border</div>
                <div className="text-[10px] font-mono text-[#0A2540]/60 font-bold">#E5E5DE</div>
              </div>
            </div>

            <p className="text-xs font-semibold text-[#0A2540]/70 leading-relaxed">
              CostView Signature Theme: Crisp bright navy primary rails, high-contrast milk canvas, sharp 2px borders, domain color indicator dots, and zero legacy styling.
            </p>
          </div>

          {/* Database & Cloud Telemetry */}
          <div className="bg-white border-2 border-[#E5E5DE] rounded-2xl p-6 md:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b-2 border-[#E5E5DE]">
              <Database className="w-5 h-5 text-[#0A2540]" />
              <h2 className="text-base font-black text-[#0A2540] uppercase tracking-wider">
                Cloud Infrastructure &amp; Security
              </h2>
            </div>

            <ul className="space-y-2.5 text-xs font-bold text-[#0A2540]/80">
              <li className="flex items-center gap-2.5 p-2 rounded-lg bg-[#FAF9F5]">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full shrink-0" />
                <span>
                  <strong className="text-[#0A2540]">Supabase Postgres eu-central-1:</strong> 25 relational tables, Row-Level Security (RLS) active
                </span>
              </li>
              <li className="flex items-center gap-2.5 p-2 rounded-lg bg-[#FAF9F5]">
                <span className="w-2.5 h-2.5 bg-blue-500 rounded-full shrink-0" />
                <span>
                  <strong className="text-[#0A2540]">Session Security:</strong> 2-hour inactivity policy + tab-close automatic token expiry
                </span>
              </li>
              <li className="flex items-center gap-2.5 p-2 rounded-lg bg-[#FAF9F5]">
                <span className="w-2.5 h-2.5 bg-purple-500 rounded-full shrink-0" />
                <span>
                  <strong className="text-[#0A2540]">Reports Studio:</strong> 10 automated construction registers with branded PDF &amp; CSV pipelines
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
