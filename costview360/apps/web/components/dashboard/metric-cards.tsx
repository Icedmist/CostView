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
      <div className="glass-card p-4 relative overflow-hidden min-h-[130px] flex flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#5c5c5c]">
            Approved Budget
          </span>
          <div className="w-8 h-8 rounded-lg bg-[#eef2fb] text-[#0067c0] flex items-center justify-center shrink-0">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 text-xl font-bold tracking-tight text-[#1b1b1b]">
          {formatCurrency(approvedBudget, currency)}
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs">
          <span className="bg-[#eef2fb] text-[#0067c0] font-semibold px-2 py-0.5 rounded-full">100% Baseline</span>
          <span className="text-[#5c5c5c]">· BOQ Master</span>
        </div>
        <div className="mt-3 h-1.5 w-full bg-[#e5e5e5] rounded-full overflow-hidden">
          <div className="h-full bg-[#0067c0] rounded-full" style={{ width: "100%" }} />
        </div>
      </div>

      {/* Committed Spend */}
      <div className="glass-card p-4 relative overflow-hidden min-h-[130px] flex flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#5c5c5c]">
            Committed (POs)
          </span>
          <div className="w-8 h-8 rounded-lg bg-[#fdf0dd] text-[#a15c00] flex items-center justify-center shrink-0">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 text-xl font-bold tracking-tight text-[#1b1b1b]">
          {formatCurrency(committedCost, currency)}
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs">
          <span className="bg-[#fdf0dd] text-[#a15c00] font-semibold px-2 py-0.5 rounded-full">{committedPercentage}%</span>
          <span className="text-[#5c5c5c]">of total committed</span>
        </div>
        <div className="mt-3 h-1.5 w-full bg-[#e5e5e5] rounded-full overflow-hidden">
          <div className="h-full bg-[#a15c00] rounded-full transition-all" style={{ width: `${Math.min(100, committedPercentage)}%` }} />
        </div>
      </div>

      {/* Actual Spend */}
      <div className="glass-card p-4 relative overflow-hidden min-h-[130px] flex flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#5c5c5c]">
            Actual (Certified)
          </span>
          <div className="w-8 h-8 rounded-lg bg-[#e3f6ea] text-[#0f7b3f] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 text-xl font-bold tracking-tight text-[#1b1b1b]">
          {formatCurrency(actualCost, currency)}
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs">
          <span className="bg-[#e3f6ea] text-[#0f7b3f] font-semibold px-2 py-0.5 rounded-full">{actualPercentage}%</span>
          <span className="text-[#5c5c5c]">disbursed &amp; certified</span>
        </div>
        <div className="mt-3 h-1.5 w-full bg-[#e5e5e5] rounded-full overflow-hidden">
          <div className="h-full bg-[#0f7b3f] rounded-full transition-all" style={{ width: `${Math.min(100, actualPercentage)}%` }} />
        </div>
      </div>

      {/* Remaining */}
      <div className="glass-card p-4 relative overflow-hidden min-h-[130px] flex flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#5c5c5c]">
            Uncommitted Contingency
          </span>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${uncommittedBalance >= 0 ? "bg-[#eef2fb] text-[#0067c0]" : "bg-[#fbe4e2] text-[#c42b1c]"}`}>
            {uncommittedBalance >= 0 ? <TrendingDown className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          </div>
        </div>
        <div className={`mt-3 text-xl font-bold tracking-tight ${uncommittedBalance >= 0 ? "text-[#1b1b1b]" : "text-[#c42b1c]"}`}>
          {formatCurrency(uncommittedBalance, currency)}
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs">
          <span className={`font-semibold px-2 py-0.5 rounded-full ${uncommittedBalance >= 0 ? "bg-[#eef2fb] text-[#0067c0]" : "bg-[#fbe4e2] text-[#c42b1c]"}`}>
            {Math.max(0, 100 - committedPercentage)}%
          </span>
          <span className="text-[#5c5c5c]">headroom remaining</span>
        </div>
        <div className="mt-3 h-1.5 w-full bg-[#e5e5e5] rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${uncommittedBalance >= 0 ? "bg-[#0067c0]" : "bg-[#c42b1c]"}`} style={{ width: `${Math.max(0, 100 - committedPercentage)}%` }} />
        </div>
      </div>
    </div>
  );
}
