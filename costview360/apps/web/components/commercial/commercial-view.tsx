"use client";

import React from "react";
import { useApp } from "@/app/providers";
import { formatCurrency } from "@/lib/utils";
import {
  TrendingUp,
  PieChart,
  Landmark,
  Building,
  DollarSign,
  Receipt,
  Percent,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

export function CommercialView() {
  const { currency, currentProject } = useApp();

  const metrics = {
    grossDevelopmentValue: 1200000000, // ₦1.2B
    totalDevelopmentCost: 780000000,   // ₦780M
    projectedMargin: 420000000,        // ₦420M
    marginPercent: 35,
    equityDrawn: 250000000,
    debtFacility: 530000000,
    debtDrawn: 310000000,
    salesCollected: 480000000,
    salesTarget: 1200000000,
  };

  return (
    <div className="space-y-6">
      {/* Commercial Header Banner */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-mono">
                Commercial Mode Active
              </span>
              <span className="text-zinc-500 text-xs">· Developer & Investor View</span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Project Margin & Capital Stack Command Center
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Live feasibility yield, debt drawdowns, and real-time receivables for {currentProject.name}.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] text-zinc-400 uppercase font-semibold">
                Target Margin
              </div>
              <div className="text-xl font-black text-emerald-400 font-mono">
                {metrics.marginPercent}% (₦420M)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Commercial KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Gross Development Value (GDV) */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold">
            <span>Gross Development Value (GDV)</span>
            <Building className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-xl font-bold text-white font-mono">
            {formatCurrency(metrics.grossDevelopmentValue, currency)}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-zinc-400 border-t border-zinc-800/80 pt-2">
            <span>Total Units Value</span>
            <span className="text-zinc-200 font-medium">48 Luxury Apartments</span>
          </div>
        </div>

        {/* Capital Stack & Debt Drawdown */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold">
            <span>Debt Facility Drawdown</span>
            <Landmark className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2 text-xl font-bold text-white font-mono">
            {formatCurrency(metrics.debtDrawn, currency)}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-zinc-400 border-t border-zinc-800/80 pt-2">
            <span>Facility Limit: {formatCurrency(metrics.debtFacility, currency)}</span>
            <span className="text-blue-400 font-semibold font-mono">58% Drawn</span>
          </div>
        </div>

        {/* Off-Plan Sales & Receivables */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold">
            <span>Collections & Receivables</span>
            <DollarSign className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 text-xl font-bold text-white font-mono">
            {formatCurrency(metrics.salesCollected, currency)}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-zinc-400 border-t border-zinc-800/80 pt-2">
            <span>Off-Plan Sold: 24/48 Units</span>
            <span className="text-purple-400 font-semibold font-mono">40% Realized</span>
          </div>
        </div>
      </div>

      {/* Feasibility & Lifecycle Stages Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-zinc-800">
          <h3 className="text-sm font-bold text-white">Commercial Lifecycle Tracker</h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            18-stage developer and contractor governance pipeline (PRD Section 5.2).
          </p>
        </div>

        <div className="divide-y divide-zinc-800/60 text-xs">
          {[
            { stage: "1. Feasibility & Land Acquisition", status: "Completed", amount: 150000000, responsible: "Investment Director" },
            { stage: "2. Tender & Estimating (Main Works)", status: "Completed", amount: 450000000, responsible: "Senior QS" },
            { stage: "3. Contract Execution & Bond Deposit", status: "Active", amount: 45000000, responsible: "Legal / PM" },
            { stage: "4. Interim Valuation #3 Certification", status: "Under Review", amount: 62000000, responsible: "Consultant QS" },
            { stage: "5. Sales Milestone Collections (Phase 1)", status: "Active", amount: 480000000, responsible: "Commercial Mgr" },
            { stage: "6. Project Margin Reconciliation", status: "Projected", amount: 420000000, responsible: "Finance Partner" },
          ].map((row, i) => (
            <div key={i} className="p-3.5 flex items-center justify-between hover:bg-zinc-800/40 transition-colors">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[11px] font-mono text-zinc-300 font-bold">
                  {i + 1}
                </span>
                <div>
                  <div className="font-semibold text-zinc-100">{row.stage}</div>
                  <div className="text-[10px] text-zinc-500">Lead: {row.responsible}</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right font-mono">
                  <div className="font-bold text-zinc-200">{formatCurrency(row.amount, currency)}</div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                  row.status === "Completed"
                    ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                    : row.status === "Active"
                    ? "bg-blue-950 text-blue-300 border-blue-800"
                    : "bg-amber-950 text-amber-300 border-amber-800"
                }`}>
                  {row.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
