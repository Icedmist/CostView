"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/app/providers";
import { formatCurrency } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Users, UserPlus, Clock, Check, X, AlertCircle } from "lucide-react";

interface WorkerRecord {
  id: string;
  name: string;
  trade: string;
  dailyRate: number;
  daysPresent: number;
  overtimeHours: number;
}

const INITIAL_WORKERS: WorkerRecord[] = [
  {
    id: "wrk-1",
    name: "Musa Ibrahim",
    trade: "Chief Mason",
    dailyRate: 14000,
    daysPresent: 5,
    overtimeHours: 6,
  },
  {
    id: "wrk-2",
    name: "Emeka Okafor",
    trade: "Steel Fixer Lead",
    dailyRate: 15000,
    daysPresent: 6,
    overtimeHours: 10,
  },
  {
    id: "wrk-3",
    name: "Sunday Balogun",
    trade: "Formwork Carpenter",
    dailyRate: 13500,
    daysPresent: 5,
    overtimeHours: 4,
  },
  {
    id: "wrk-4",
    name: "Aliyu Garba",
    trade: "Site Labourer",
    dailyRate: 7500,
    daysPresent: 6,
    overtimeHours: 2,
  },
];

export function LabourView() {
  const { currency } = useApp();
  const [workers, setWorkers] = useState<WorkerRecord[]>(INITIAL_WORKERS);
  const [isAddWorkerOpen, setIsAddWorkerOpen] = useState(false);

  // Load live muster from Supabase daily_attendance
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("daily_attendance")
          .select("id, worker_name, trade, date, status, hours_worked, overtime_hours");
        if (isMounted && data && data.length > 0) {
          const rates: Record<string, number> = {
            "Chief Mason": 14000,
            "Mason": 12000,
            "Steel Fixer Lead": 15000,
            "Steel Fixer": 13000,
            "Formwork Carpenter": 13500,
            "Electrician": 14500,
            "Site Labourer": 7500,
          };
          const workerMap = new Map<string, WorkerRecord>();
          data.forEach((d: any) => {
            const name = d.worker_name;
            const trade = d.trade || "Site Labourer";
            const current = workerMap.get(name) || {
              id: `wrk-${name.toLowerCase().replace(/\s+/g, "-")}`,
              name,
              trade,
              dailyRate: rates[trade] || 10000,
              daysPresent: 0,
              overtimeHours: 0,
            };
            if (d.status === "Present") {
              current.daysPresent += 1;
              current.overtimeHours += Math.round(Number(d.overtime_hours || 0));
            }
            workerMap.set(name, current);
          });
          setWorkers(Array.from(workerMap.values()));
        }
      } catch (e) {
        console.warn("Failed to load attendance from Supabase", e);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  // Form states
  const [name, setName] = useState("");
  const [trade, setTrade] = useState("Mason");
  const [dailyRate, setDailyRate] = useState<number>(12000);

  const handleAddWorker = (e: React.FormEvent) => {
    e.preventDefault();
    const newWorker: WorkerRecord = {
      id: `wrk-${Date.now()}`,
      name,
      trade,
      dailyRate: Number(dailyRate),
      daysPresent: 0,
      overtimeHours: 0,
    };
    setWorkers((prev) => [newWorker, ...prev]);
    setIsAddWorkerOpen(false);
    setName("");
  };

  const handleToggleAttendance = async (id: string) => {
    const target = workers.find((w) => w.id === id);
    setWorkers((prev) =>
      prev.map((w) => (w.id === id ? { ...w, daysPresent: w.daysPresent + 1 } : w))
    );
    if (target) {
      try {
        const supabase = createClient();
        await supabase.from("daily_attendance").insert({
          project_id: "22222222-2222-2222-2222-222222222222",
          worker_name: target.name,
          trade: target.trade,
          date: new Date().toISOString().split("T")[0],
          status: "Present",
          hours_worked: 8.0,
          overtime_hours: 0,
        });
      } catch (e) {
        console.warn("Failed to record attendance in Supabase", e);
      }
    }
  };

  // Automated payroll calculation (PRD Section 3.4)
  const totalPayroll = workers.reduce((sum, w) => {
    const regularPay = w.daysPresent * w.dailyRate;
    const hourlyRate = w.dailyRate / 8;
    const overtimePay = w.overtimeHours * hourlyRate * 1.5;
    return sum + regularPay + overtimePay;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-xl shadow-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded font-mono">
              Labour Muster & Timesheets
            </span>
            <span className="text-slate-900/60 text-xs">· Site Workforce Operations</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Labour Productivity & Automated Payroll
          </h2>
          <p className="text-xs text-slate-900/60 mt-0.5">
            Attendance muster grid automatically compiling weekly site payroll disbursements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-slate-900/60 uppercase font-semibold">
              Weekly Est. Payroll
            </div>
            <div className="text-lg font-bold text-emerald-600 font-mono">
              {formatCurrency(totalPayroll, currency)}
            </div>
          </div>
          <button
            onClick={() => setIsAddWorkerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white border border-slate-200/80 text-xs font-semibold shadow-xs rounded-xl transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Worker</span>
          </button>
        </div>
      </div>

      {/* Workers Muster Table */}
      <div className="bg-white border border-slate-200/80 shadow-card overflow-hidden">
        <div className="p-4 border-b border-slate-200/80">
          <h3 className="text-sm font-bold text-slate-900">Active Site Roster (Current Shift)</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-white uppercase text-xs font-semibold border-b border-slate-200/80">
              <tr>
                <th className="py-3 px-4">Worker Name</th>
                <th className="py-3 px-4">Trade</th>
                <th className="py-3 px-4 text-right">Daily Rate</th>
                <th className="py-3 px-4 text-center">Days Present (This Week)</th>
                <th className="py-3 px-4 text-center">Overtime Hours</th>
                <th className="py-3 px-4 text-right">Gross Pay</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800/10 text-slate-900">
              {workers.map((w) => {
                const hourlyRate = w.dailyRate / 8;
                const grossPay = w.daysPresent * w.dailyRate + w.overtimeHours * hourlyRate * 1.5;

                return (
                  <tr key={w.id} className="hover:bg-white/30 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{w.name}</td>
                    <td className="py-3 px-4 text-slate-900">
                      <span className="px-2 py-0.5 bg-white border border-slate-200/80 text-xs font-bold text-slate-900">
                        {w.trade}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-900">
                      {formatCurrency(w.dailyRate, currency)}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-emerald-600">
                      {w.daysPresent} / 6 Days
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-amber-600 font-bold">
                      {w.overtimeHours} hrs
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      {formatCurrency(grossPay, currency)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleAttendance(w.id)}
                        className="px-2.5 py-1 bg-white hover:bg-[#f5f5f5] border border-slate-200/80 text-slate-900 shadow-xs rounded-xl text-xs font-bold transition-transform active:translate-x-0.5 active:translate-y-0.5"
                      >
                        + Mark Day
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Worker Modal */}
      {isAddWorkerOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200/80 max-w-md w-full p-6 shadow-card">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Add Worker to Site Roster</h3>
            <p className="text-xs text-slate-900/70 mt-0.5 font-medium">Register new craftsman or general labourer</p>

            <form onSubmit={handleAddWorker} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kenneth Nwosu"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-slate-200/80 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">Trade / Specialization</label>
                <input
                  type="text"
                  required
                  placeholder="Mason, Carpenter, Steel Fixer, Plumber"
                  value={trade}
                  onChange={(e) => setTrade(e.target.value)}
                  className="w-full bg-white border border-slate-200/80 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">Agreed Daily Rate (₦)</label>
                <input
                  type="number"
                  required
                  min={1000}
                  value={dailyRate}
                  onChange={(e) => setDailyRate(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200/80 px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-navy-800"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddWorkerOpen(false)}
                  className="px-3 py-1.5 bg-white hover:bg-[#f5f5f5] border border-slate-200/80 text-slate-900 text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white border border-slate-200/80 shadow-xs rounded-xl text-xs font-bold transition-transform active:translate-x-0.5 active:translate-y-0.5"
                >
                  Add Worker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
