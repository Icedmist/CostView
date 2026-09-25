"use client";

import React, { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import {
  TrendingUp,
  DollarSign,
  Building2,
  Users,
  Truck,
  AlertTriangle,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowRight,
  ChevronRight,
  BarChart3,
  Briefcase,
  Target,
  Sparkles,
  PieChart,
  Activity,
  Layers,
  Check,
  X,
  FileCheck2,
} from "lucide-react";

interface ProjectMatrixItem {
  id: string;
  name: string;
  location: string;
  contractSum: number;
  certifiedToDate: number;
  actualCostToDate: number;
  cpi: number;
  spi: number;
  progressPct: number;
  status: "Healthy" | "Attention" | "Critical";
  primaryRisk: string;
}

const PROJECTS_DATA: ProjectMatrixItem[] = [
  {
    id: "prj-01",
    name: "Horizon Commercial Towers",
    location: "Lekki Phase 1, Lagos",
    contractSum: 1250000000,
    certifiedToDate: 780000000,
    actualCostToDate: 750000000,
    cpi: 1.04,
    spi: 0.98,
    progressPct: 62,
    status: "Healthy",
    primaryRisk: "Rebar delivery delay (PO-092 discrepancy hold)",
  },
  {
    id: "prj-02",
    name: "Victoria Island Corporate HQ",
    location: "Victoria Island, Lagos",
    contractSum: 850000000,
    certifiedToDate: 748000000,
    actualCostToDate: 740000000,
    cpi: 1.01,
    spi: 1.00,
    progressPct: 88,
    status: "Healthy",
    primaryRisk: "Curtain wall glazing import clearance",
  },
  {
    id: "prj-03",
    name: "Ikoyi Luxury Waterfront Residences",
    location: "Banana Island, Ikoyi, Lagos",
    contractSum: 2100000000,
    certifiedToDate: 504000000,
    actualCostToDate: 525000000,
    cpi: 0.96,
    spi: 0.94,
    progressPct: 24,
    status: "Attention",
    primaryRisk: "Sheet piling dewatering groundwater surge",
  },
];

interface ManagementDecisionProps {
  onNavigate: (section: string, subSection: string) => void;
}

export function ManagementDecisionCenter({ onNavigate }: ManagementDecisionProps) {
  const [activeDomain, setActiveDomain] = useState<
    "company" | "financial" | "projects" | "business" | "people" | "assets" | "decisions"
  >("company");

  const [selectedFlowStep, setSelectedFlowStep] = useState<number>(1);

  const flowSteps = [
    { step: 1, label: "Information", desc: "Raw site logs, GRNs, invoices, and attendance captured." },
    { step: 2, label: "Dashboard", desc: "Automated synthesis of CPI/SPI, cash runway, and commit limits." },
    { step: 3, label: "Reports", desc: "Structured valuation summaries, variance audits, and EAC forecasts." },
    { step: 4, label: "Review", desc: "Commercial & technical peer scrutiny by Chief QS and Site Lead." },
    { step: 5, label: "Decision", desc: "MD & Executive sign-offs on variations, claims, and CAPEX." },
    { step: 6, label: "Action", desc: "Automated treasury release, site instruction issuance, or work halt." },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Header & Stated Management Flow */}
      <div className="bg-[#0A2540] dark:bg-[#071324] border-2 border-[#0A2540] dark:border-white/10 rounded-2xl p-7 md:p-9 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="text-xs font-black uppercase tracking-wider px-3 py-1 bg-white/10 text-white rounded-lg border border-white/20 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                Flow 5.2 · Management Decision Center
              </span>
              <span className="text-amber-400 text-xs font-bold bg-amber-400/10 px-2.5 py-1 rounded-md border border-amber-400/20">
                Executive Control
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
              Management Performance &amp; Decision Center
            </h1>
            <p className="text-sm md:text-base text-white/80 mt-2 max-w-3xl leading-relaxed">
              Consolidated enterprise oversight across portfolio profitability, treasury cash liquidity, plant fleet efficiency, workforce throughput, and executive decisions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate("Oversight", "reports-all")}
              className="min-h-[46px] px-5 py-3 bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 rounded-xl text-xs md:text-sm font-black flex items-center gap-2 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4 text-white" />
              <span>Executive Reports Studio</span>
            </button>
            <button
              onClick={() => setActiveDomain("decisions")}
              className="min-h-[46px] px-5 py-3 bg-amber-400 hover:bg-amber-300 text-[#0A2540] rounded-xl text-xs md:text-sm font-black flex items-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4 fill-[#0A2540]" />
              <span>Pending Decisions (3)</span>
            </button>
          </div>
        </div>

        {/* The Management Flow: Information → Dashboard → Reports → Review → Decision → Action */}
        <div className="mt-8 pt-6 border-t-2 border-white/10">
          <div className="text-xs uppercase font-black tracking-wider text-white/60 mb-3 flex items-center gap-2">
            <span>The Management Flow:</span>
            <span className="text-amber-400 font-mono">
              Information → Dashboard → Reports → Review → Decision → Action
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {flowSteps.map((s) => {
              const isSelected = selectedFlowStep === s.step;
              return (
                <button
                  key={s.step}
                  onClick={() => setSelectedFlowStep(s.step)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-amber-400 text-[#0A2540] border-amber-400 font-black shadow-md scale-102"
                      : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10"
                  }`}
                >
                  <div className="text-[10px] font-mono uppercase opacity-75">
                    Step 0{s.step}
                  </div>
                  <div className="text-sm font-black mt-0.5">{s.label}</div>
                  <div className="text-[11px] opacity-80 mt-1 line-clamp-2 leading-tight">
                    {s.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Seven Management Performance Domains Switcher */}
      <div className="flex items-center gap-2 border-b-2 border-[#E5E5DE] dark:border-white/10 pb-1 overflow-x-auto">
        {[
          { id: "company", label: "Company Performance", icon: Building2 },
          { id: "financial", label: "Financial & Treasury", icon: DollarSign },
          { id: "projects", label: "Project Performance", icon: BarChart3, count: PROJECTS_DATA.length },
          { id: "business", label: "Business & Tenders", icon: Target },
          { id: "people", label: "People & Workforce", icon: Users },
          { id: "assets", label: "Plant & Fleet Assets", icon: Truck },
          { id: "decisions", label: "Action Decision Queue", icon: AlertTriangle, count: 3, alert: true },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeDomain === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveDomain(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs md:text-sm font-black whitespace-nowrap transition-all cursor-pointer border-2 ${
                isActive
                  ? "bg-[#0A2540] dark:bg-amber-400 text-white dark:text-[#0A2540] border-[#0A2540] dark:border-amber-400 shadow-sm"
                  : "bg-white dark:bg-[#0D2137] text-[#0A2540]/70 dark:text-slate-300 border-[#E5E5DE] dark:border-white/10 hover:border-[#0A2540]/30"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`ml-1 px-2 py-0.5 rounded-full text-[11px] font-mono ${
                    tab.alert
                      ? "bg-rose-500 text-white"
                      : isActive
                      ? "bg-white/20 dark:bg-[#0A2540]/20 text-white dark:text-[#0A2540]"
                      : "bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. DOMAIN PANELS */}

      {/* DOMAIN A: COMPANY PERFORMANCE */}
      {activeDomain === "company" && (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-2xl p-6 shadow-xs">
              <div className="text-[10px] font-black uppercase text-[#0A2540]/60 dark:text-slate-400">Total Contract Value</div>
              <div className="text-3xl font-black font-mono text-[#0A2540] dark:text-white mt-1">₦4.20B</div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +18.4% vs previous FY
              </div>
            </div>

            <div className="bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-2xl p-6 shadow-xs">
              <div className="text-[10px] font-black uppercase text-[#0A2540]/60 dark:text-slate-400">Net Operating Margin</div>
              <div className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">14.8%</div>
              <div className="text-xs text-[#0A2540]/70 dark:text-slate-400 font-bold mt-1">
                Target: 12.5% (Above benchmark)
              </div>
            </div>

            <div className="bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-2xl p-6 shadow-xs">
              <div className="text-[10px] font-black uppercase text-[#0A2540]/60 dark:text-slate-400">Portfolio Execution Rate</div>
              <div className="text-3xl font-black font-mono text-[#0A2540] dark:text-white mt-1">58.4%</div>
              <div className="text-xs text-[#0A2540]/70 dark:text-slate-400 font-bold mt-1">
                Average milestone completion
              </div>
            </div>

            <div className="bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-2xl p-6 shadow-xs">
              <div className="text-[10px] font-black uppercase text-[#0A2540]/60 dark:text-slate-400">Overall Portfolio CPI</div>
              <div className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">1.02</div>
              <div className="text-xs text-emerald-700 dark:text-emerald-400 font-bold mt-1">
                Under budget across all active sites
              </div>
            </div>
          </div>

          {/* Quick Portfolio Pulse */}
          <div className="bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b-2 border-[#E5E5DE] dark:border-white/10">
              <div>
                <h3 className="text-xl font-black text-[#0A2540] dark:text-white">Active Site Projects Summary</h3>
                <p className="text-xs text-[#0A2540]/60 dark:text-slate-400 mt-0.5">High-level financial and schedule health of ongoing projects</p>
              </div>
              <button
                onClick={() => setActiveDomain("projects")}
                className="text-xs font-black text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View Full Matrix</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid gap-4">
              {PROJECTS_DATA.map((p) => (
                <div
                  key={p.id}
                  className="p-5 rounded-xl bg-[#FAF9F5] dark:bg-[#071324] border border-[#E5E5DE] dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500">{p.location}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          p.status === "Healthy"
                            ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
                            : "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300"
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>
                    <h4 className="text-lg font-black text-[#0A2540] dark:text-white">{p.name}</h4>
                    <p className="text-xs text-[#0A2540]/70 dark:text-slate-300">
                      <strong>Key Issue:</strong> {p.primaryRisk}
                    </p>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <div className="text-[10px] uppercase font-black text-slate-400">Contract Sum</div>
                      <div className="text-lg font-black font-mono text-[#0A2540] dark:text-white">
                        {formatCurrency(p.contractSum)}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] uppercase font-black text-slate-400">CPI / SPI</div>
                      <div className="text-lg font-black font-mono text-emerald-600 dark:text-emerald-400">
                        {p.cpi} / {p.spi}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] uppercase font-black text-slate-400">Physical Progress</div>
                      <div className="text-lg font-black font-mono text-amber-500">{p.progressPct}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DOMAIN B: FINANCIAL PERFORMANCE */}
      {activeDomain === "financial" && (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-2xl p-6 shadow-xs">
              <div className="text-[10px] font-black uppercase text-[#0A2540]/60 dark:text-slate-400">Cumulative Revenue Certified</div>
              <div className="text-3xl font-black font-mono text-[#0A2540] dark:text-white mt-1">₦2.03B</div>
              <div className="text-xs text-slate-500 mt-1 font-semibold">Across all active milestone certificates</div>
            </div>

            <div className="bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-2xl p-6 shadow-xs">
              <div className="text-[10px] font-black uppercase text-[#0A2540]/60 dark:text-slate-400">Total Disbursements Settled</div>
              <div className="text-3xl font-black font-mono text-[#0A2540] dark:text-white mt-1">₦1.78B</div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-bold">100% 3-way matched against GRNs</div>
            </div>

            <div className="bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-2xl p-6 shadow-xs">
              <div className="text-[10px] font-black uppercase text-[#0A2540]/60 dark:text-slate-400">Treasury Liquid Runway</div>
              <div className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">₦342M</div>
              <div className="text-xs text-slate-500 mt-1 font-semibold">3.8 months runway at current site burn</div>
            </div>
          </div>

          {/* Direct link to Financial Reports */}
          <div className="bg-[#FAF9F5] dark:bg-[#071324] border-2 border-[#E5E5DE] dark:border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-lg font-black text-[#0A2540] dark:text-white">Need Detailed Financial Valuation Reports?</h4>
              <p className="text-xs text-[#0A2540]/70 dark:text-slate-300 mt-0.5">
                Generate Budget vs Actual variance breakdowns, cash flow curves, and subcontractor retention schedules.
              </p>
            </div>
            <button
              onClick={() => onNavigate("Cost Plan", "reports-cost")}
              className="px-5 py-2.5 bg-[#0A2540] hover:bg-[#003366] dark:bg-amber-400 dark:hover:bg-amber-300 text-white dark:text-[#0A2540] rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Open Budget Reports</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* DOMAIN C: PROJECT PERFORMANCE */}
      {activeDomain === "projects" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-2xl overflow-hidden shadow-xs">
            <div className="p-6 border-b-2 border-[#E5E5DE] dark:border-white/10">
              <h3 className="text-xl font-black text-[#0A2540] dark:text-white">Multi-Project Comparative Performance Matrix</h3>
              <p className="text-xs text-[#0A2540]/60 dark:text-slate-400 mt-0.5">
                Contractual commitments, earned value metrics, and critical execution bottlenecks.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FAF9F5] dark:bg-[#071324] border-b-2 border-[#E5E5DE] dark:border-white/10 text-[11px] font-black uppercase tracking-wider text-[#0A2540]/70 dark:text-slate-400">
                    <th className="p-4">Project &amp; Location</th>
                    <th className="p-4">Contract Sum</th>
                    <th className="p-4">Certified Value</th>
                    <th className="p-4">Actual Cost</th>
                    <th className="p-4">CPI / SPI</th>
                    <th className="p-4">Physical Progress</th>
                    <th className="p-4">Critical Risk Factor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5DE] dark:divide-white/10 text-xs font-semibold">
                  {PROJECTS_DATA.map((p) => (
                    <tr key={p.id} className="hover:bg-amber-500/5 transition-colors">
                      <td className="p-4">
                        <div className="font-black text-sm text-[#0A2540] dark:text-white">{p.name}</div>
                        <div className="text-[11px] text-slate-500">{p.location}</div>
                      </td>
                      <td className="p-4 font-mono font-bold text-[#0A2540] dark:text-white">
                        {formatCurrency(p.contractSum)}
                      </td>
                      <td className="p-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(p.certifiedToDate)}
                      </td>
                      <td className="p-4 font-mono font-bold text-[#0A2540] dark:text-white">
                        {formatCurrency(p.actualCostToDate)}
                      </td>
                      <td className="p-4">
                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {p.cpi}
                        </span>
                        <span className="text-slate-400"> / </span>
                        <span className="font-mono font-bold text-[#0A2540] dark:text-white">
                          {p.spi}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-slate-200 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                            <div className="bg-amber-400 h-full" style={{ width: `${p.progressPct}%` }} />
                          </div>
                          <span className="font-mono font-bold">{p.progressPct}%</span>
                        </div>
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                        {p.primaryRisk}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* DOMAIN D: BUSINESS PERFORMANCE */}
      {activeDomain === "business" && (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-4 gap-5">
            <div className="bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-2xl p-6 shadow-xs">
              <div className="text-[10px] font-black uppercase text-[#0A2540]/60 dark:text-slate-400">Active Tenders Submitted</div>
              <div className="text-3xl font-black font-mono text-[#0A2540] dark:text-white mt-1">₦4.85B</div>
              <div className="text-xs text-slate-500 font-bold mt-1">4 competitive bids under evaluation</div>
            </div>

            <div className="bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-2xl p-6 shadow-xs">
              <div className="text-[10px] font-black uppercase text-[#0A2540]/60 dark:text-slate-400">Tender Win Rate</div>
              <div className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">38.2%</div>
              <div className="text-xs text-emerald-700 dark:text-emerald-400 font-bold mt-1">Industry avg in Nigeria: 22%</div>
            </div>

            <div className="bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-2xl p-6 shadow-xs">
              <div className="text-[10px] font-black uppercase text-[#0A2540]/60 dark:text-slate-400">Secured Backlog</div>
              <div className="text-3xl font-black font-mono text-[#0A2540] dark:text-white mt-1">₦2.42B</div>
              <div className="text-xs text-slate-500 font-bold mt-1">Committed unbilled works</div>
            </div>

            <div className="bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-2xl p-6 shadow-xs">
              <div className="text-[10px] font-black uppercase text-[#0A2540]/60 dark:text-slate-400">Client Retention</div>
              <div className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">92%</div>
              <div className="text-xs text-slate-500 font-bold mt-1">Repeat business from developers</div>
            </div>
          </div>
        </div>
      )}

      {/* DOMAIN E: PEOPLE & WORKFORCE */}
      {activeDomain === "people" && (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-4 gap-5">
            <div className="bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-2xl p-6 shadow-xs">
              <div className="text-[10px] font-black uppercase text-[#0A2540]/60 dark:text-slate-400">Total Site Workforce</div>
              <div className="text-3xl font-black font-mono text-[#0A2540] dark:text-white mt-1">142 Crew</div>
              <div className="text-xs text-slate-500 font-bold mt-1">Across 3 active project sites</div>
            </div>

            <div className="bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-2xl p-6 shadow-xs">
              <div className="text-[10px] font-black uppercase text-[#0A2540]/60 dark:text-slate-400">Trade Productivity</div>
              <div className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">94.2%</div>
              <div className="text-xs text-emerald-700 dark:text-emerald-400 font-bold mt-1">Daily output quota achieved</div>
            </div>

            <div className="bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-2xl p-6 shadow-xs">
              <div className="text-[10px] font-black uppercase text-[#0A2540]/60 dark:text-slate-400">Lost Time Incidents (LTI)</div>
              <div className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">0 LTI</div>
              <div className="text-xs text-emerald-700 dark:text-emerald-400 font-bold mt-1">420 consecutive zero-harm days</div>
            </div>

            <div className="bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-2xl p-6 shadow-xs">
              <div className="text-[10px] font-black uppercase text-[#0A2540]/60 dark:text-slate-400">Daily Absenteeism</div>
              <div className="text-3xl font-black font-mono text-[#0A2540] dark:text-white mt-1">2.1%</div>
              <div className="text-xs text-slate-500 font-bold mt-1">Below 5% threshold allowance</div>
            </div>
          </div>

          <div className="bg-[#FAF9F5] dark:bg-[#071324] border-2 border-[#E5E5DE] dark:border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-lg font-black text-[#0A2540] dark:text-white">Inspect Daily Labour Logs &amp; Trade Productivity</h4>
              <p className="text-xs text-[#0A2540]/70 dark:text-slate-300 mt-0.5">
                Drill down into carpenters, iron benders, masons, and machine operators productivity logs.
              </p>
            </div>
            <button
              onClick={() => onNavigate("Site", "labour")}
              className="px-5 py-2.5 bg-[#0A2540] hover:bg-[#003366] dark:bg-amber-400 dark:hover:bg-amber-300 text-white dark:text-[#0A2540] rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Open Labour &amp; Site Diary</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* DOMAIN F: PLANT & ASSETS */}
      {activeDomain === "assets" && (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-4 gap-5">
            <div className="bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-2xl p-6 shadow-xs">
              <div className="text-[10px] font-black uppercase text-[#0A2540]/60 dark:text-slate-400">Total Fleet Acquisition</div>
              <div className="text-3xl font-black font-mono text-[#0A2540] dark:text-white mt-1">₦311.8M</div>
              <div className="text-xs text-slate-500 font-bold mt-1">18 heavy plant assets registered</div>
            </div>

            <div className="bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-2xl p-6 shadow-xs">
              <div className="text-[10px] font-black uppercase text-[#0A2540]/60 dark:text-slate-400">Current Net Book Value</div>
              <div className="text-3xl font-black font-mono text-[#0A2540] dark:text-white mt-1">₦247.9M</div>
              <div className="text-xs text-slate-500 font-bold mt-1">₦63.9M accumulated depreciation</div>
            </div>

            <div className="bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-2xl p-6 shadow-xs">
              <div className="text-[10px] font-black uppercase text-[#0A2540]/60 dark:text-slate-400">Fleet Utilization</div>
              <div className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">84.5%</div>
              <div className="text-xs text-emerald-700 dark:text-emerald-400 font-bold mt-1">15 active / 3 idle machines</div>
            </div>

            <div className="bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-2xl p-6 shadow-xs">
              <div className="text-[10px] font-black uppercase text-[#0A2540]/60 dark:text-slate-400">BOQ Capital Recovery</div>
              <div className="text-3xl font-black font-mono text-amber-500 mt-1">₦4.28M/mo</div>
              <div className="text-xs text-slate-500 font-bold mt-1">Hourly plant chargeback to BOQs</div>
            </div>
          </div>

          <div className="bg-[#FAF9F5] dark:bg-[#071324] border-2 border-[#E5E5DE] dark:border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-lg font-black text-[#0A2540] dark:text-white">Open Plant &amp; Equipment Asset Ledger</h4>
              <p className="text-xs text-[#0A2540]/70 dark:text-slate-300 mt-0.5">
                The Asset Flow: Acquire → Register → Allocate → Use → Maintain → Monitor → Retire/Dispose.
              </p>
            </div>
            <button
              onClick={() => onNavigate("Buy & Supply", "assets")}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-[#0A2540] rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <span>Open Asset Register &amp; Depreciation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* DOMAIN G: DECISION & ACTION QUEUE */}
      {activeDomain === "decisions" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-2xl p-6 shadow-xs">
            <h3 className="text-xl font-black text-[#0A2540] dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              Executive Action &amp; Sign-Off Queue
            </h3>
            <p className="text-xs text-[#0A2540]/60 dark:text-slate-400 mt-1">
              High-priority decisions requiring Managing Director or Chief QS intervention to unlock site operations and payments.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0D2137] border-2 border-rose-200 dark:border-rose-900/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-rose-500 text-white">
                    Urgent Procurement Block
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-500">PO-2026-092 · Pulkit Steels</span>
                </div>
                <h4 className="text-lg font-black text-[#0A2540] dark:text-white">
                  Invoice billed 30T vs 27T physical GRN receipt delivered
                </h4>
                <p className="text-xs text-[#0A2540]/70 dark:text-slate-300">
                  ₦3.45M variance locked in 3-way match gate. Requires management decision: approve short shipment debit note or reject entire invoice.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onNavigate("Buy & Supply", "match")}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-sm cursor-pointer"
                >
                  Resolve 3-Way Match →
                </button>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#0D2137] border-2 border-amber-200 dark:border-amber-900/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-amber-400 text-[#0A2540]">
                    Variation Order Sign-Off
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-500">VO-014 · ₦4.20M Commitment</span>
                </div>
                <h4 className="text-lg font-black text-[#0A2540] dark:text-white">
                  Basement Pump Sump Relocation &amp; Waterproofing
                </h4>
                <p className="text-xs text-[#0A2540]/70 dark:text-slate-300">
                  MEP alignment required to avoid high-voltage utility easement. Approved by Site Director, awaiting commercial budget authorization.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onNavigate("Contracts", "variations")}
                  className="px-5 py-2.5 bg-[#0A2540] hover:bg-[#003366] dark:bg-amber-400 dark:hover:bg-amber-300 text-white dark:text-[#0A2540] rounded-xl text-xs font-black uppercase tracking-wider shadow-sm cursor-pointer"
                >
                  Authorize Variation →
                </button>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500 text-white">
                    Subcontractor Valuation
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-500">IPC-03 · Apex MEP Services</span>
                </div>
                <h4 className="text-lg font-black text-[#0A2540] dark:text-white">
                  ₦18.90M Interim Payment Certificate (Net ₦17.01M after 10% retention)
                </h4>
                <p className="text-xs text-[#0A2540]/70 dark:text-slate-300">
                  First fix electrical and drainage roughing-in completed and passed QA/QC inspection. Ready for treasury disbursement release.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onNavigate("Contracts", "claims")}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-sm cursor-pointer"
                >
                  Release Payment →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Cross-System Quick Audit & Reports Strip */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-2xl p-6 shadow-xs flex items-center justify-between">
          <div>
            <h4 className="text-base font-black text-[#0A2540] dark:text-white flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-amber-500" /> Corporate Document Control
            </h4>
            <p className="text-xs text-slate-500 mt-1">CAC, LASBCA, COREN, and company policies</p>
          </div>
          <button
            onClick={() => onNavigate("Oversight", "documents-admin")}
            className="px-4 py-2 bg-[#FAF9F5] dark:bg-[#071324] hover:bg-[#F2F1EC] dark:hover:bg-white/10 border border-[#E5E5DE] dark:border-white/10 rounded-xl text-xs font-black text-[#0A2540] dark:text-white cursor-pointer"
          >
            Open Docs &amp; Admin →
          </button>
        </div>

        <div className="bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-2xl p-6 shadow-xs flex items-center justify-between">
          <div>
            <h4 className="text-base font-black text-[#0A2540] dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Immutable System Audit Trail
            </h4>
            <p className="text-xs text-slate-500 mt-1">Security logs, permission matrix, and data syncs</p>
          </div>
          <button
            onClick={() => onNavigate("Oversight", "admin")}
            className="px-4 py-2 bg-[#FAF9F5] dark:bg-[#071324] hover:bg-[#F2F1EC] dark:hover:bg-white/10 border border-[#E5E5DE] dark:border-white/10 rounded-xl text-xs font-black text-[#0A2540] dark:text-white cursor-pointer"
          >
            Open Audit Logs →
          </button>
        </div>
      </div>
    </div>
  );
}
