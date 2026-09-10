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
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* Approved Budget */}
      <div className="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-5 shadow-card hover:shadow-glass hover:border-blue-300 hover:-translate-y-0.5 transition-all min-h-[140px] flex flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Approved Budget
          </span>
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0067c0] flex items-center justify-center shrink-0 shadow-xs">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 text-2xl md:text-3xl font-extrabold font-mono tracking-tight text-slate-900">
          {formatCurrency(approvedBudget, currency)}
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs">
          <span className="bg-blue-50 text-[#0067c0] font-bold px-2 py-0.5 rounded-full border border-blue-200/60">100% Baseline</span>
          <span className="text-slate-400 font-medium">· BOQ Master</span>
        </div>
        <div className="mt-3 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#0067c0] to-[#0284c7] rounded-full" style={{ width: "100%" }} />
        </div>
      </div>

      {/* Committed Spend */}
      <div className="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-5 shadow-card hover:shadow-glass hover:border-amber-300 hover:-translate-y-0.5 transition-all min-h-[140px] flex flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Committed (POs)
          </span>
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 shadow-xs">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 text-2xl md:text-3xl font-extrabold font-mono tracking-tight text-slate-900">
          {formatCurrency(committedCost, currency)}
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs">
          <span className="bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded-full border border-amber-200/60">{committedPercentage}%</span>
          <span className="text-slate-400 font-medium">of baseline committed</span>
        </div>
        <div className="mt-3 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all" style={{ width: `${Math.min(100, committedPercentage)}%` }} />
        </div>
      </div>

      {/* Actual Spend */}
      <div className="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-5 shadow-card hover:shadow-glass hover:border-emerald-300 hover:-translate-y-0.5 transition-all min-h-[140px] flex flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Actual Certified
          </span>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 shadow-xs">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 text-2xl md:text-3xl font-extrabold font-mono tracking-tight text-slate-900">
          {formatCurrency(actualCost, currency)}
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs">
          <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200/60">{actualPercentage}%</span>
          <span className="text-slate-400 font-medium">disbursed &amp; certified</span>
        </div>
        <div className="mt-3 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all" style={{ width: `${Math.min(100, actualPercentage)}%` }} />
        </div>
      </div>

      {/* Remaining Contingency */}
      <div className="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-5 shadow-card hover:shadow-glass hover:border-blue-300 hover:-translate-y-0.5 transition-all min-h-[140px] flex flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Uncommitted Balance
          </span>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${uncommittedBalance >= 0 ? "bg-blue-50 text-[#0067c0]" : "bg-rose-50 text-rose-600"}`}>
            {uncommittedBalance >= 0 ? <TrendingDown className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          </div>
        </div>
        <div className={`mt-3 text-2xl md:text-3xl font-extrabold font-mono tracking-tight ${uncommittedBalance >= 0 ? "text-slate-900" : "text-rose-600"}`}>
          {formatCurrency(uncommittedBalance, currency)}
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs">
          <span className={`px-2 py-0.5 rounded-full font-bold border ${uncommittedBalance >= 0 ? "bg-blue-50 text-[#0067c0] border-blue-200/60" : "bg-rose-50 text-rose-700 border-rose-200/60"}`}>
            {uncommittedBalance >= 0 ? `${100 - committedPercentage}% Available` : "Over Budget"}
          </span>
          <span className="text-slate-400 font-medium">contingency buffer</span>
        </div>
        <div className="mt-3 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${uncommittedBalance >= 0 ? "bg-gradient-to-r from-blue-500 to-indigo-500" : "bg-rose-500"}`} style={{ width: `${Math.max(0, 100 - committedPercentage)}%` }} />
        </div>
      </div>
    </div>
  );
}
