"use client";

import React, { useState } from "react";
import { useApp } from "@/app/providers";
import { formatCurrency } from "@/lib/utils";
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

  const handleToggleAttendance = (id: string) => {
    setWorkers((prev) =>
      prev.map((w) => (w.id === id ? { ...w, daysPresent: w.daysPresent + 1 } : w))
    );
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
      <div className="bg-white border-2 border-navy-800 shadow-brutal p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800/60 font-mono">
              Labour Muster & Timesheets
            </span>
            <span className="text-navy-800/40 text-xs">· Site Workforce Operations</span>
          </div>
          <h2 className="text-lg font-bold text-navy-800 tracking-tight">
            Labour Productivity & Automated Payroll
          </h2>
          <p className="text-sm font-bold text-navy-800/60 mt-0.5">
            Attendance muster grid automatically compiling weekly site payroll disbursements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-bold text-navy-800/60 uppercase font-semibold">
              Weekly Est. Payroll
            </div>
            <div className="text-lg font-bold text-emerald-400 font-mono">
              {formatCurrency(totalPayroll, currency)}
            </div>
          </div>
          <button
            onClick={() => setIsAddWorkerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white border-2 border-navy-800 text-xs font-semibold shadow-sm transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Worker</span>
          </button>
        </div>
      </div>

      {/* Workers Muster Table */}
      <div className="bg-white border-2 border-navy-800 shadow-brutal overflow-hidden">
        <div className="p-4 border-b border-navy-800">
          <h3 className="text-sm font-bold text-navy-800">Active Site Roster (Current Shift)</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-800 text-white uppercase text-xs font-semibold border-b border-navy-800">
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
            <tbody className="divide-y divide-navy-800/10 text-navy-800">
              {workers.map((w) => {
                const hourlyRate = w.dailyRate / 8;
                const grossPay = w.daysPresent * w.dailyRate + w.overtimeHours * hourlyRate * 1.5;

                return (
                  <tr key={w.id} className="hover:bg-cream-100/30 transition-colors">
                    <td className="py-3 px-4 font-bold text-navy-800">{w.name}</td>
                    <td className="py-3 px-4 text-navy-800">
                      <span className="px-2 py-0.5 rounded bg-cream-100 border border-navy-800 text-xs font-semibold">
                        {w.trade}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-navy-800">
                      {formatCurrency(w.dailyRate, currency)}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-emerald-400">
                      {w.daysPresent} / 6 Days
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-amber-400">
                      {w.overtimeHours} hrs
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-navy-800">
                      {formatCurrency(grossPay, currency)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleAttendance(w.id)}
                        className="px-2.5 py-1 bg-cream-100 hover:bg-emerald-950 hover:text-emerald-300 border border-navy-800 hover:border-emerald-700 rounded text-sm font-medium transition-colors"
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
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-navy-800 border-navy-800 max-w-md w-full p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-navy-800">Add Worker to Site Roster</h3>
            <p className="text-sm font-bold text-navy-800/60 mt-0.5">Register new craftsman or general labourer</p>

            <form onSubmit={handleAddWorker} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs text-navy-800 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kenneth Nwosu"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-cream-100 border border-navy-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs text-navy-800 mb-1">Trade / Specialization</label>
                <input
                  type="text"
                  required
                  placeholder="Mason, Carpenter, Steel Fixer, Plumber"
                  value={trade}
                  onChange={(e) => setTrade(e.target.value)}
                  className="w-full bg-cream-100 border border-navy-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs text-navy-800 mb-1">Agreed Daily Rate (₦)</label>
                <input
                  type="number"
                  required
                  min={1000}
                  value={dailyRate}
                  onChange={(e) => setDailyRate(Number(e.target.value))}
                  className="w-full bg-cream-100 border border-navy-800 rounded px-3 py-1.5 text-xs text-navy-800 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddWorkerOpen(false)}
                  className="px-3 py-1.5 bg-cream-100 text-navy-800 rounded text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold"
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
