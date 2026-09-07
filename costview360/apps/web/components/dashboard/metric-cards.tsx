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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Approved Budget */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
            Approved Budget
          </span>
          <div className="p-1.5 rounded-md bg-emerald-950/80 text-emerald-400 border border-emerald-800/40">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 text-xl font-bold text-white tracking-tight">
          {formatCurrency(approvedBudget, currency)}
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-zinc-400">
          <span className="text-emerald-400 font-medium">100% Baseline</span>
          <span>· BOQ Master</span>
        </div>
      </div>

      {/* Committed Spend */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
            Committed (POs Issued)
          </span>
          <div className="p-1.5 rounded-md bg-blue-950/80 text-blue-400 border border-blue-800/40">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 text-xl font-bold text-white tracking-tight">
          {formatCurrency(committedCost, currency)}
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-zinc-400">
          <span className="text-blue-400 font-semibold">{committedPercentage}%</span>
          <span>of total budget committed</span>
        </div>
      </div>

      {/* Actual Spend */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
            Actual Cost (Certified)
          </span>
          <div className="p-1.5 rounded-md bg-purple-950/80 text-purple-400 border border-purple-800/40">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 text-xl font-bold text-white tracking-tight">
          {formatCurrency(actualCost, currency)}
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-zinc-400">
          <span className="text-purple-400 font-semibold">{actualPercentage}%</span>
          <span>disbursed & certified</span>
        </div>
      </div>

      {/* Remaining Uncommitted Balance */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
            Uncommitted Contingency
          </span>
          <div className={`p-1.5 rounded-md border ${
            uncommittedBalance >= 0
              ? "bg-emerald-950/80 text-emerald-400 border-emerald-800/40"
              : "bg-red-950/80 text-red-400 border-red-800/40"
          }`}>
            {uncommittedBalance >= 0 ? (
              <TrendingDown className="w-4 h-4" />
            ) : (
              <AlertTriangle className="w-4 h-4" />
            )}
          </div>
        </div>
        <div className={`mt-2 text-xl font-bold tracking-tight ${
          uncommittedBalance >= 0 ? "text-emerald-400" : "text-red-400"
        }`}>
          {formatCurrency(uncommittedBalance, currency)}
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-zinc-400">
          <span className={uncommittedBalance >= 0 ? "text-emerald-400 font-semibold" : "text-red-400 font-semibold"}>
            {Math.max(0, 100 - committedPercentage)}%
          </span>
          <span>headroom remaining</span>
        </div>
      </div>
    </div>
  );
}
