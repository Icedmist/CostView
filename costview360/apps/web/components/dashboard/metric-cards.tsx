"use client";

import React from "react";
import { useApp } from "@/app/providers";
import { formatCurrency } from "@/lib/utils";
import { DollarSign, FileSpreadsheet, CheckCircle2, AlertTriangle, TrendingDown } from "lucide-react";

interface MetricCardsProps {
  approvedBudget: number;
  committedCost: number;
  actualCost: number;
}

export function MetricCards({ approvedBudget, committedCost, actualCost }: MetricCardsProps) {
  const { currency } = useApp();
  const uncommittedBalance = approvedBudget - committedCost;
  const committedPercentage = Math.round((committedCost / (approvedBudget || 1)) * 100);
  const actualPercentage = Math.round((actualCost / (approvedBudget || 1)) * 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
      {/* Approved Budget */}
      <div className="bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-2xl p-6 shadow-sm hover:border-[#0A2540] dark:hover:border-amber-400 transition-all min-h-[160px] flex flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <span className="text-xs font-black uppercase tracking-wider text-[#0A2540]/70 dark:text-slate-300">
            Approved Budget
          </span>
          <div className="w-11 h-11 rounded-xl bg-[#FAF9F5] dark:bg-[#071324] border border-[#E5E5DE] dark:border-white/10 text-[#0A2540] dark:text-amber-400 flex items-center justify-center shrink-0 shadow-xs">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
        <div className="mt-4 text-3xl md:text-4xl font-black font-mono tracking-tight text-[#0A2540] dark:text-white">
          {formatCurrency(approvedBudget, currency)}
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs font-bold">
          <span className="bg-[#0A2540] dark:bg-amber-400 text-white dark:text-[#0A2540] px-2.5 py-0.5 rounded-md">100% Baseline</span>
          <span className="text-[#0A2540]/60 dark:text-slate-400 font-semibold">· Contractual BOQ</span>
        </div>
        <div className="mt-3.5 h-2.5 w-full bg-[#FAF9F5] dark:bg-[#071324] border border-[#E5E5DE] dark:border-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-[#0A2540] dark:bg-amber-400 rounded-full" style={{ width: "100%" }} />
        </div>
      </div>

      {/* Committed Spend */}
      <div className="bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-2xl p-6 shadow-sm hover:border-[#0A2540] dark:hover:border-amber-400 transition-all min-h-[160px] flex flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <span className="text-xs font-black uppercase tracking-wider text-[#0A2540]/70 dark:text-slate-300">
            Committed (POs)
          </span>
          <div className="w-11 h-11 rounded-xl bg-[#FAF9F5] dark:bg-[#071324] border border-[#E5E5DE] dark:border-white/10 text-[#0A2540] dark:text-amber-400 flex items-center justify-center shrink-0 shadow-xs">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
        </div>
        <div className="mt-4 text-3xl md:text-4xl font-black font-mono tracking-tight text-[#0A2540] dark:text-white">
          {formatCurrency(committedCost, currency)}
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs font-bold">
          <span className="bg-[#0A2540]/10 dark:bg-amber-400/20 text-[#0A2540] dark:text-amber-300 border border-[#0A2540]/30 dark:border-amber-400/30 px-2.5 py-0.5 rounded-md">
            {committedPercentage}%
          </span>
          <span className="text-[#0A2540]/60 dark:text-slate-400 font-semibold">of baseline committed</span>
        </div>
        <div className="mt-3.5 h-2.5 w-full bg-[#FAF9F5] dark:bg-[#071324] border border-[#E5E5DE] dark:border-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#0A2540] dark:bg-amber-400 rounded-full transition-all"
            style={{ width: `${Math.min(100, committedPercentage)}%` }}
          />
        </div>
      </div>

      {/* Actual Spend */}
      <div className="bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-2xl p-6 shadow-sm hover:border-[#0A2540] dark:hover:border-amber-400 transition-all min-h-[160px] flex flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <span className="text-xs font-black uppercase tracking-wider text-[#0A2540]/70 dark:text-slate-300">
            Actual Certified
          </span>
          <div className="w-11 h-11 rounded-xl bg-[#FAF9F5] dark:bg-[#071324] border border-[#E5E5DE] dark:border-white/10 text-[#0A2540] dark:text-amber-400 flex items-center justify-center shrink-0 shadow-xs">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
        <div className="mt-4 text-3xl md:text-4xl font-black font-mono tracking-tight text-[#0A2540] dark:text-white">
          {formatCurrency(actualCost, currency)}
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs font-bold">
          <span className="bg-[#0A2540]/10 dark:bg-amber-400/20 text-[#0A2540] dark:text-amber-300 border border-[#0A2540]/30 dark:border-amber-400/30 px-2.5 py-0.5 rounded-md">
            {actualPercentage}%
          </span>
          <span className="text-[#0A2540]/60 dark:text-slate-400 font-semibold">disbursed &amp; certified</span>
        </div>
        <div className="mt-3.5 h-2.5 w-full bg-[#FAF9F5] dark:bg-[#071324] border border-[#E5E5DE] dark:border-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#0A2540] dark:bg-amber-400 rounded-full transition-all"
            style={{ width: `${Math.min(100, actualPercentage)}%` }}
          />
        </div>
      </div>

      {/* Remaining Contingency */}
      <div className="bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-2xl p-6 shadow-sm hover:border-[#0A2540] dark:hover:border-amber-400 transition-all min-h-[160px] flex flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <span className="text-xs font-black uppercase tracking-wider text-[#0A2540]/70 dark:text-slate-300">
            Uncommitted Balance
          </span>
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-xs border ${
              uncommittedBalance >= 0
                ? "bg-[#FAF9F5] dark:bg-[#071324] border-[#E5E5DE] dark:border-white/10 text-[#0A2540] dark:text-emerald-400"
                : "bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-900/60 text-rose-700 dark:text-rose-400"
            }`}
          >
            {uncommittedBalance >= 0 ? <TrendingDown className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
          </div>
        </div>
        <div
          className={`mt-4 text-3xl md:text-4xl font-black font-mono tracking-tight ${
            uncommittedBalance >= 0 ? "text-[#0A2540] dark:text-white" : "text-rose-700 dark:text-rose-400"
          }`}
        >
          {formatCurrency(uncommittedBalance, currency)}
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs font-bold">
          <span
            className={`px-2.5 py-0.5 rounded-md ${
              uncommittedBalance >= 0
                ? "bg-[#0A2540] dark:bg-emerald-500 text-white dark:text-[#0A2540]"
                : "bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800"
            }`}
          >
            {uncommittedBalance >= 0 ? "Under Cap" : "Cap Exceeded"}
          </span>
          <span className="text-[#0A2540]/60 dark:text-slate-400 font-semibold">remaining cushion</span>
        </div>
        <div className="mt-3.5 h-2.5 w-full bg-[#FAF9F5] dark:bg-[#071324] border border-[#E5E5DE] dark:border-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#0A2540] dark:bg-amber-400 rounded-full transition-all"
            style={{ width: `${Math.max(0, Math.min(100, 100 - committedPercentage))}%` }}
          />
        </div>
      </div>
    </div>
  );
}
