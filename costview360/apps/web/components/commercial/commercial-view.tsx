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
      {/* Commercial Header Banner - Smooth Pearl Glass */}
      <div className="smooth-pearl-hero p-5 text-slate-900 rounded-2xl shadow-pearl border border-sky-200/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold tracking-wider px-3 py-1 bg-sky-100 text-[#0067c0] border border-sky-200 rounded-full font-mono">
                Commercial Mode Active
              </span>
              <span className="text-slate-500 text-xs font-medium">· Developer &amp; Investor View</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Project Margin &amp; Capital Stack
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Live feasibility yield, debt drawdowns, and receivables for {currentProject.name}.
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-md border border-sky-200/80 px-5 py-3 rounded-xl shadow-xs text-center text-slate-900">
            <div className="text-xs font-medium uppercase tracking-wider text-slate-500">Target Margin</div>
            <div className="text-2xl font-bold font-mono text-[#0067c0]">
              {metrics.marginPercent}% (₦420M)
            </div>
          </div>
        </div>
      </div>

      {/* Commercial KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-xl shadow-card p-4">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold tracking-wider uppercase">
            <span>Gross Development Value</span>
            <span className="w-8 h-8 bg-blue-50 text-[#0067c0] rounded-lg flex items-center justify-center">
              <Building className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 text-xl font-bold text-slate-900 font-mono">
            {formatCurrency(metrics.grossDevelopmentValue, currency)}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs font-medium border-t border-slate-200/80 pt-2">
            <span className="text-slate-500">Total Units Value</span>
            <span className="bg-blue-50 text-[#0067c0] border border-blue-200/80 px-2 py-0.5 rounded-md font-semibold">48 Luxury Units</span>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-xl shadow-card p-4 border-l-4 border-l-[#0067c0]">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold tracking-wider uppercase">
            <span>Debt Facility Drawdown</span>
            <span className="w-8 h-8 bg-blue-50 text-[#0067c0] rounded-lg flex items-center justify-center">
              <Landmark className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 text-xl font-bold text-slate-900 font-mono">
            {formatCurrency(metrics.debtDrawn, currency)}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs font-medium border-t border-slate-200/80 pt-2">
            <span className="text-slate-500">Limit: {formatCurrency(metrics.debtFacility, currency)}</span>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2 py-0.5 rounded-md font-mono font-semibold">58% Drawn</span>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-xl shadow-card p-4">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold tracking-wider uppercase">
            <span>Collections</span>
            <span className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 text-xl font-bold text-slate-900 font-mono">
            {formatCurrency(metrics.salesCollected, currency)}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs font-medium border-t border-slate-200/80 pt-2">
            <span className="text-slate-500">Sold: 24/48 Units</span>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2 py-0.5 rounded-md font-semibold">40% Realized</span>
          </div>
        </div>
      </div>

      {/* Lifecycle Tracker */}
      <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-xl shadow-card overflow-hidden">
        <div className="p-4 border-b border-slate-200/80 bg-slate-50/80">
          <h3 className="text-sm font-bold tracking-tight text-slate-900">Commercial Lifecycle Tracker</h3>
          <p className="text-xs font-medium text-slate-500 mt-1">
            18-stage developer and contractor governance pipeline.
          </p>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {[
            { stage: "1. Feasibility & Land Acquisition", status: "Completed", amount: 150000000, responsible: "Investment Director" },
            { stage: "2. Tender & Estimating (Main Works)", status: "Completed", amount: 450000000, responsible: "Senior QS" },
            { stage: "3. Contract Execution & Bond Deposit", status: "Active", amount: 45000000, responsible: "Legal / PM" },
            { stage: "4. Interim Valuation #3 Certification", status: "Under Review", amount: 62000000, responsible: "Consultant QS" },
            { stage: "5. Sales Milestone Collections (Phase 1)", status: "Active", amount: 480000000, responsible: "Commercial Mgr" },
            { stage: "6. Project Margin Reconciliation", status: "Projected", amount: 420000000, responsible: "Finance Partner" },
          ].map((row, i) => (
            <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-blue-50 text-[#0067c0] rounded-lg flex items-center justify-center text-xs font-mono font-bold">
                  {i + 1}
                </span>
                <div>
                  <div className="font-semibold text-slate-900 text-xs">{row.stage}</div>
                  <div className="text-xs text-slate-500">Lead: {row.responsible}</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right font-mono font-bold text-slate-900 hidden sm:block">
                  {formatCurrency(row.amount, currency)}
                </div>
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${
                  row.status === "Completed"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : row.status === "Active"
                    ? "bg-blue-50 text-[#0067c0] border-blue-200"
                    : "bg-slate-50 text-slate-700 border-slate-200"
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
