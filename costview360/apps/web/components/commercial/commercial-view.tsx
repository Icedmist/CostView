"use client";

import React from "react";
import { useApp } from "@/app/providers";
import { formatCurrency } from "@/lib/utils";
import {
  TrendingUp,
  Building,
  Landmark,
  DollarSign,
} from "lucide-react";

export function CommercialView() {
  const { currency, currentProject } = useApp();

  const metrics = {
    grossDevelopmentValue: 1200000000,
    totalDevelopmentCost: 780000000,
    projectedMargin: 420000000,
    marginPercent: 35,
    debtFacility: 530000000,
    debtDrawn: 310000000,
    salesCollected: 480000000,
  };

  return (
    <div className="space-y-6">
      {/* Commercial Header Banner - Brutalist */}
      <div className="bg-navy-800 border-2 border-navy-800 shadow-brutal p-5 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm uppercase font-black tracking-widest px-3 py-1 bg-mustard-400 text-navy-800 border-2 border-navy-800 font-mono">
                Commercial Mode Active
              </span>
              <span className="text-white/60 text-xs font-bold">· Developer & Investor View</span>
            </div>
            <h2 className="text-xl font-black tracking-tighter uppercase">
              Project Margin & Capital Stack
            </h2>
            <p className="text-xs font-bold text-white/70 mt-1">
              Live feasibility yield, debt drawdowns, and receivables for {currentProject.name}.
            </p>
          </div>
          <div className="bg-white border-2 border-navy-800 px-5 py-3 shadow-[4px_4px_0px_0px_#FFD23F] text-center">
            <div className="text-sm font-black uppercase tracking-widest text-navy-800/60">Target Margin</div>
            <div className="text-2xl font-black font-mono text-navy-800">
              {metrics.marginPercent}% (₦420M)
            </div>
          </div>
        </div>
      </div>

      {/* Commercial KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border-2 border-navy-800 shadow-brutal p-4">
          <div className="flex items-center justify-between text-navy-800/60 text-xs font-black uppercase tracking-widest">
            <span>Gross Development Value</span>
            <span className="w-8 h-8 bg-navy-800 text-mustard-400 border-2 border-navy-800 flex items-center justify-center">
              <Building className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 text-xl font-black text-navy-800 font-mono">
            {formatCurrency(metrics.grossDevelopmentValue, currency)}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs font-bold border-t-[3px] border-navy-800 pt-2">
            <span className="text-navy-800/60">Total Units Value</span>
            <span className="bg-mustard-400 px-2 py-1 border border-navy-800">48 Luxury Units</span>
          </div>
        </div>

        <div className="bg-mustard-400 border-2 border-navy-800 shadow-brutal p-4">
          <div className="flex items-center justify-between text-navy-800 text-xs font-black uppercase tracking-widest">
            <span>Debt Facility Drawdown</span>
            <span className="w-8 h-8 bg-navy-800 text-white border-2 border-navy-800 flex items-center justify-center">
              <Landmark className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 text-xl font-black text-navy-800 font-mono">
            {formatCurrency(metrics.debtDrawn, currency)}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs font-bold border-t-[3px] border-navy-800 pt-2">
            <span>Limit: {formatCurrency(metrics.debtFacility, currency)}</span>
            <span className="bg-navy-800 text-white px-2 py-1 font-mono">58% Drawn</span>
          </div>
        </div>

        <div className="bg-white border-2 border-navy-800 shadow-brutal p-4">
          <div className="flex items-center justify-between text-navy-800/60 text-xs font-black uppercase tracking-widest">
            <span>Collections</span>
            <span className="w-8 h-8 bg-white border-2 border-navy-800 flex items-center justify-center text-navy-800">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 text-xl font-black text-navy-800 font-mono">
            {formatCurrency(metrics.salesCollected, currency)}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs font-bold border-t-[3px] border-navy-800 pt-2">
            <span className="text-navy-800/60">Sold: 24/48 Units</span>
            <span className="bg-navy-800 text-white px-2 py-1">40% Realized</span>
          </div>
        </div>
      </div>

      {/* Lifecycle Tracker */}
      <div className="bg-white border-2 border-navy-800 shadow-brutal overflow-hidden">
        <div className="p-4 border-b-[3px] border-navy-800 bg-cream-100">
          <h3 className="text-sm font-black uppercase tracking-tight text-navy-800">Commercial Lifecycle Tracker</h3>
          <p className="text-xs font-bold text-navy-800/60 mt-1">
            18-stage developer and contractor governance pipeline.
          </p>
        </div>

        <div className="divide-y-[3px] divide-navy-800/10 text-xs">
          {[
            { stage: "1. Feasibility & Land Acquisition", status: "Completed", amount: 150000000, responsible: "Investment Director" },
            { stage: "2. Tender & Estimating (Main Works)", status: "Completed", amount: 450000000, responsible: "Senior QS" },
            { stage: "3. Contract Execution & Bond Deposit", status: "Active", amount: 45000000, responsible: "Legal / PM" },
            { stage: "4. Interim Valuation #3 Certification", status: "Under Review", amount: 62000000, responsible: "Consultant QS" },
            { stage: "5. Sales Milestone Collections (Phase 1)", status: "Active", amount: 480000000, responsible: "Commercial Mgr" },
            { stage: "6. Project Margin Reconciliation", status: "Projected", amount: 420000000, responsible: "Finance Partner" },
          ].map((row, i) => (
            <div key={i} className="p-4 flex items-center justify-between hover:bg-cream-100 transition-colors">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-navy-800 text-white border-2 border-navy-800 flex items-center justify-center text-xs font-mono font-black">
                  {i + 1}
                </span>
                <div>
                  <div className="font-black text-navy-800 uppercase tracking-tight text-xs">{row.stage}</div>
                  <div className="text-xs font-bold text-navy-800/60 uppercase">Lead: {row.responsible}</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right font-mono font-black text-navy-800 hidden sm:block">
                  {formatCurrency(row.amount, currency)}
                </div>
                <span className={`px-3 py-1 text-sm font-black uppercase border-2 border-navy-800 ${
                  row.status === "Completed"
                    ? "bg-navy-800 text-white"
                    : row.status === "Active"
                    ? "bg-mustard-400 text-navy-800"
                    : "bg-white text-navy-800"
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
