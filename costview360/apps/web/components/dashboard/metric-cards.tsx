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
      <div className="bg-white border-2 border-navy-800 shadow-brutal p-4 relative overflow-hidden min-h-[130px] flex flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <span className="text-xs font-black uppercase tracking-widest text-navy-800/60 leading-tight">
            Approved Budget
          </span>
          <div className="w-9 h-9 bg-navy-800 border-2 border-navy-800 flex items-center justify-center text-mustard-400 shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
        <div className="mt-4 text-xl font-black tracking-tighter text-navy-800 font-mono leading-none">
          {formatCurrency(approvedBudget, currency)}
        </div>
        <div className="mt-3 flex items-center gap-2 text-sm font-black">
          <span className="bg-navy-800 text-white px-3 py-1 text-xs uppercase tracking-wide">100% Baseline</span>
          <span className="text-navy-800/60 font-bold text-xs">· BOQ Master</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-navy-800" />
      </div>

      {/* Committed Spend */}
      <div className="bg-white border-2 border-navy-800 shadow-brutal p-4 relative overflow-hidden min-h-[130px] flex flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <span className="text-xs font-black uppercase tracking-widest text-navy-800/60 leading-tight">
            Committed (POs)
          </span>
          <div className="w-9 h-9 bg-mustard-400 border-2 border-navy-800 flex items-center justify-center text-navy-800 shrink-0">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
        </div>
        <div className="mt-4 text-xl font-black tracking-tighter text-navy-800 font-mono leading-none">
          {formatCurrency(committedCost, currency)}
        </div>
        <div className="mt-3 flex items-center gap-2 text-sm font-bold">
          <span className="bg-mustard-400 border-2 border-navy-800 px-3 py-1 text-navy-800 font-black text-sm">{committedPercentage}%</span>
          <span className="text-navy-800/60 text-xs font-bold">of total committed</span>
        </div>
        <div className="absolute bottom-0 left-0 h-2 bg-mustard-400" style={{ width: `${Math.min(100, committedPercentage)}%` }} />
        <div className="absolute bottom-0 right-0 left-0 h-2 bg-navy-800/10 -z-0" />
      </div>

      {/* Actual Spend */}
      <div className="bg-white border-2 border-navy-800 shadow-brutal p-4 relative overflow-hidden min-h-[130px] flex flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <span className="text-xs font-black uppercase tracking-widest text-navy-800/60 leading-tight">
            Actual (Certified)
          </span>
          <div className="w-9 h-9 bg-white border-2 border-navy-800 flex items-center justify-center text-navy-800 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
        <div className="mt-4 text-xl font-black tracking-tighter text-navy-800 font-mono leading-none">
          {formatCurrency(actualCost, currency)}
        </div>
        <div className="mt-3 flex items-center gap-2 text-sm font-bold">
          <span className="bg-navy-800 text-white px-3 py-1 font-black text-sm">{actualPercentage}%</span>
          <span className="text-navy-800/60 text-xs">disbursed & certified</span>
        </div>
        <div className="absolute bottom-0 left-0 h-2 bg-navy-800" style={{ width: `${Math.min(100, actualPercentage)}%` }} />
      </div>

      {/* Remaining */}
      <div className={`border-2 border-navy-800 shadow-brutal p-4 relative overflow-hidden min-h-[130px] flex flex-col justify-between ${uncommittedBalance >= 0 ? "bg-mustard-400" : "bg-red-500"}`}>
        <div className="flex items-start justify-between gap-3">
          <span className="text-xs font-black uppercase tracking-widest text-navy-800 leading-tight">
            Uncommitted<br />Contingency
          </span>
          <div className={`w-9 h-9 border-2 border-navy-800 flex items-center justify-center shrink-0 ${uncommittedBalance >= 0 ? "bg-white text-navy-800" : "bg-navy-800 text-white"}`}>
            {uncommittedBalance >= 0 ? <TrendingDown className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
          </div>
        </div>
        <div className={`mt-4 text-xl font-black tracking-tighter font-mono leading-none ${uncommittedBalance >= 0 ? "text-navy-800" : "text-white"}`}>
          {formatCurrency(uncommittedBalance, currency)}
        </div>
        <div className="mt-3 flex items-center gap-2 text-sm font-black">
          <span className="bg-navy-800 text-white px-3 py-1 text-sm">
            {Math.max(0, 100 - committedPercentage)}%
          </span>
          <span className={uncommittedBalance >= 0 ? "text-navy-800/70 text-xs font-bold" : "text-white font-bold text-xs"}>headroom remaining</span>
        </div>
      </div>
    </div>
  );
}
