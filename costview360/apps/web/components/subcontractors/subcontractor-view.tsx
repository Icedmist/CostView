"use client";

import React, { useState } from "react";
import { useApp } from "@/app/providers";
import { formatCurrency } from "@/lib/utils";
import {
  Briefcase,
  Plus,
  FileCheck,
  Star,
  CheckCircle,
  Clock,
  ArrowRight,
  Receipt,
  FileSpreadsheet,
} from "lucide-react";

interface Subcontractor {
  id: string;
  name: string;
  trade: string;
  contractSum: number;
  certifiedAmount: number;
  retentionHeld: number;
  paidAmount: number;
  scoreQuality: number;
  scoreSchedule: number;
  scoreSafety: number;
  scoreResponse: number;
}

interface Variation {
  id: string;
  voNumber: string;
  title: string;
  stage: "Draft" | "QS Valuation" | "PM Review" | "Approved";
  costImpact: number;
  timeImpactDays: number;
  raisedBy: string;
}

const INITIAL_SUBS: Subcontractor[] = [
  {
    id: "sub-1",
    name: "Apex MEP Engineering Ltd",
    trade: "Electrical & Piping",
    contractSum: 45000000,
    certifiedAmount: 22000000,
    retentionHeld: 2200000, // 10%
    paidAmount: 19800000,
    scoreQuality: 4.8,
    scoreSchedule: 4.2,
    scoreSafety: 5.0,
    scoreResponse: 4.5,
  },
  {
    id: "sub-2",
    name: "Horizon Fenestration & Aluminium",
    trade: "Glazing & Curtain Walls",
    contractSum: 38000000,
    certifiedAmount: 12000000,
    retentionHeld: 1200000,
    paidAmount: 10800000,
    scoreQuality: 4.5,
    scoreSchedule: 4.0,
    scoreSafety: 4.8,
    scoreResponse: 4.2,
  },
];

const INITIAL_VOS: Variation[] = [
  {
    id: "vo-1",
    voNumber: "VO-2026-001",
    title: "Relocate basement water treatment plant to service annex",
    stage: "PM Review",
    costImpact: 3500000,
    timeImpactDays: 5,
    raisedBy: "Architect David",
  },
  {
    id: "vo-2",
    voNumber: "VO-2026-002",
    title: "Upgrade elevator core rebar to Grade 460 steel specification",
    stage: "Approved",
    costImpact: 8200000,
    timeImpactDays: 0,
    raisedBy: "Structural Engr",
  },
];

export function SubcontractorView() {
  const { currency, activeRole } = useApp();
  const [subs, setSubs] = useState<Subcontractor[]>(INITIAL_SUBS);
  const [variations, setVariations] = useState<Variation[]>(INITIAL_VOS);

  // Modals
  const [isAddSubOpen, setIsAddSubOpen] = useState(false);
  const [isAddVoOpen, setIsAddVoOpen] = useState(false);

  // Forms
  const [subName, setSubName] = useState("");
  const [subTrade, setSubTrade] = useState("");
  const [subSum, setSubSum] = useState<number>(25000000);

  const [voTitle, setVoTitle] = useState("");
  const [voCost, setVoCost] = useState<number>(4500000);

  const handleAddSub = (e: React.FormEvent) => {
    e.preventDefault();
    const newSub: Subcontractor = {
      id: `sub-${Date.now()}`,
      name: subName,
      trade: subTrade,
      contractSum: subSum,
      certifiedAmount: 0,
      retentionHeld: 0,
      paidAmount: 0,
      scoreQuality: 5.0,
      scoreSchedule: 5.0,
      scoreSafety: 5.0,
      scoreResponse: 5.0,
    };
    setSubs((prev) => [newSub, ...prev]);
    setIsAddSubOpen(false);
    setSubName("");
    setSubTrade("");
  };

  const handleAddVo = (e: React.FormEvent) => {
    e.preventDefault();
    const newVo: Variation = {
      id: `vo-${Date.now()}`,
      voNumber: `VO-2026-00${variations.length + 1}`,
      title: voTitle,
      stage: "Draft",
      costImpact: voCost,
      timeImpactDays: 3,
      raisedBy: activeRole,
    };
    setVariations((prev) => [newVo, ...prev]);
    setIsAddVoOpen(false);
    setVoTitle("");
  };

  const handleAdvanceVoStage = (id: string) => {
    setVariations((prev) =>
      prev.map((vo) => {
        if (vo.id === id) {
          const nextStage =
            vo.stage === "Draft"
              ? "QS Valuation"
              : vo.stage === "QS Valuation"
              ? "PM Review"
              : "Approved";
          return { ...vo, stage: nextStage };
        }
        return vo;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Subcontractor Contracts & Claims */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-400" />
              <span>Subcontractor Packages & Financial Ledger</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Track contract values, interim certificates, and 10% retention fund held (PRD Section 6).
            </p>
          </div>
          <button
            onClick={() => setIsAddSubOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Subcontractor</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950/60 text-zinc-400 uppercase text-[10px] font-semibold border-b border-zinc-800">
              <tr>
                <th className="py-3 px-4">Subcontractor</th>
                <th className="py-3 px-4">Trade Scope</th>
                <th className="py-3 px-4 text-right">Contract Sum</th>
                <th className="py-3 px-4 text-right">Certified To Date</th>
                <th className="py-3 px-4 text-right">Retention (10%)</th>
                <th className="py-3 px-4 text-right">Paid Amount</th>
                <th className="py-3 px-4 text-center">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-200">
              {subs.map((s) => {
                const avgScore = ((s.scoreQuality + s.scoreSchedule + s.scoreSafety + s.scoreResponse) / 4).toFixed(1);
                return (
                  <tr key={s.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="py-3 px-4 font-bold text-white">{s.name}</td>
                    <td className="py-3 px-4 text-zinc-300">{s.trade}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-white">
                      {formatCurrency(s.contractSum, currency)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-zinc-200">
                      {formatCurrency(s.certifiedAmount, currency)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-amber-400">
                      {formatCurrency(s.retentionHeld, currency)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-400">
                      {formatCurrency(s.paidAmount, currency)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-amber-300 text-[11px] font-bold">
                        <Star className="w-3 h-3 fill-amber-300" />
                        {avgScore}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Variations & Change Order Workflow */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-blue-400" />
              <span>Variation Orders (Change Register & Approval Routing)</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Four-stage internal sign-off: Draft → QS Valuation → PM Review → Approved (PRD Section 7.3).
            </p>
          </div>
          <button
            onClick={() => setIsAddVoOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Raise Variation</span>
          </button>
        </div>

        <div className="divide-y divide-zinc-800/60">
          {variations.map((vo) => (
            <div key={vo.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-zinc-800/30 transition-colors">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-bold text-blue-400 text-xs">{vo.voNumber}</span>
                  <span className="text-zinc-500">·</span>
                  <span className="font-bold text-white text-xs">{vo.title}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-zinc-400">
                  <span>Cost Impact: <strong className="font-mono text-emerald-400">{formatCurrency(vo.costImpact, currency)}</strong></span>
                  <span>·</span>
                  <span>Time Delta: <strong className="text-zinc-300">{vo.timeImpactDays} Days</strong></span>
                  <span>·</span>
                  <span>Raised by: {vo.raisedBy}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded text-xs font-semibold border ${
                  vo.stage === "Approved"
                    ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                    : vo.stage === "PM Review"
                    ? "bg-purple-950 text-purple-300 border-purple-800"
                    : vo.stage === "QS Valuation"
                    ? "bg-blue-950 text-blue-300 border-blue-800"
                    : "bg-zinc-800 text-zinc-300 border-zinc-700"
                }`}>
                  {vo.stage}
                </span>

                {vo.stage !== "Approved" && (
                  <button
                    onClick={() => handleAdvanceVoStage(vo.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-xs font-semibold border border-zinc-700 transition-colors"
                  >
                    <span>Advance Stage</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Sub Modal */}
      {isAddSubOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl max-w-md w-full p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-white">Add Subcontractor Package</h3>
            <form onSubmit={handleAddSub} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs text-zinc-300 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  placeholder="e.g. Zenith Piling Works Ltd"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-300 mb-1">Trade Scope</label>
                <input
                  type="text"
                  required
                  value={subTrade}
                  onChange={(e) => setSubTrade(e.target.value)}
                  placeholder="Piling, Waterproofing, HVAC"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-300 mb-1">Contract Sum (₦)</label>
                <input
                  type="number"
                  required
                  value={subSum}
                  onChange={(e) => setSubSum(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddSubOpen(false)}
                  className="px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold"
                >
                  Save Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add VO Modal */}
      {isAddVoOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl max-w-md w-full p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-white">Raise Variation Order</h3>
            <form onSubmit={handleAddVo} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs text-zinc-300 mb-1">Variation Title / Scope Change</label>
                <input
                  type="text"
                  required
                  value={voTitle}
                  onChange={(e) => setVoTitle(e.target.value)}
                  placeholder="e.g. Additional security bollards along perimeter"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-300 mb-1">Estimated Cost Impact (₦)</label>
                <input
                  type="number"
                  required
                  value={voCost}
                  onChange={(e) => setVoCost(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddVoOpen(false)}
                  className="px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold"
                >
                  Submit Variation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
