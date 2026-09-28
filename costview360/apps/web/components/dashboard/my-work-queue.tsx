"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "@/app/providers";
import { useAppData } from "@/lib/store/app-data";
import { formatCurrency } from "@/lib/utils";
import type { RoleName } from "@/lib/supabase/database.types";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Calculator,
  ShoppingCart,
  HardHat,
  Briefcase,
  ShieldCheck,
  FileCheck2,
  Receipt,
  Boxes,
  TrendingDown,
  Sparkles,
  Filter,
} from "lucide-react";

interface ActionTask {
  id: string;
  role: RoleName;
  priority: "Critical" | "High" | "Medium";
  flow: "Cost Plan" | "Buy & Supply" | "Site" | "Contracts" | "Oversight";
  subSection: string;
  title: string;
  code: string;
  description: string;
  value?: string;
  actionText: string;
}

interface MyWorkQueueProps {
  onSelectNav: (section: string, subSection?: string) => void;
}

export function MyWorkQueue({ onSelectNav }: MyWorkQueueProps) {
  const { activeRole, currency } = useApp();
  const { boqItems } = useAppData();
  const [filter, setFilter] = useState<"all" | "critical" | "high">("all");

  // Dynamically compute real project action items based on live commitments and variances
  const dynamicTasks: ActionTask[] = useMemo(() => {
    const tasks: ActionTask[] = [];

    (boqItems || []).forEach((item) => {
      const overCommitment = (item.committedAmount || 0) - (item.budgetAmount || 0);
      if (overCommitment > 0) {
        tasks.push({
          id: `boq-var-${item.id}`,
          role: "Quantity Surveyor",
          priority: "Critical",
          flow: "Cost Plan",
          subSection: "risks",
          code: item.code,
          title: `${item.description} Over-Commitment Alert`,
          description: `Committed cost exceeds baseline BOQ allocation by ${formatCurrency(overCommitment, currency)}.`,
          value: `+${formatCurrency(overCommitment, currency)} Variance`,
          actionText: "Resolve BOQ Risk in Cost Plan",
        });
      }
    });

    return tasks;
  }, [boqItems, currency]);

  // Filter tasks by active role (Executive Admin / PM see all tasks)
  const activeTasks = dynamicTasks.filter(
    (task) => activeRole === "Admin" || activeRole === "Project Manager" || task.role === activeRole
  );

  const filteredTasks = activeTasks.filter((t) => {
    if (filter === "critical") return t.priority === "Critical";
    if (filter === "high") return t.priority === "Critical" || t.priority === "High";
    return true;
  });

  const criticalCount = activeTasks.filter((t) => t.priority === "Critical").length;
  const highCount = activeTasks.filter((t) => t.priority === "High").length;

  const flowIconMap = {
    "Cost Plan": Calculator,
    "Buy & Supply": ShoppingCart,
    "Site": HardHat,
    "Contracts": Briefcase,
    "Oversight": ShieldCheck,
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-[#0A2540]/60 dark:text-slate-400">
              Role-Filtered Action Queue
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-[#0A2540] dark:bg-amber-400 text-white dark:text-[#0A2540]">
              {activeRole}
            </span>
          </div>
          <h2 className="text-2xl font-black text-[#0A2540] dark:text-white tracking-tight">
            My Work &amp; Priority Items
          </h2>
          <p className="text-sm text-[#0A2540]/70 dark:text-slate-300 mt-1 max-w-xl">
            Items awaiting your sign-off, discrepancies needing reconciliation, and urgent site actions.
          </p>
        </div>

        {/* Status Counters */}
        <div className="flex items-center gap-3">
          <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 px-4 py-2.5 rounded-xl text-center">
            <div className="text-xl font-black text-rose-700 dark:text-rose-400">{criticalCount}</div>
            <div className="text-[10px] font-bold text-rose-600 dark:text-rose-300 uppercase tracking-wider">Critical</div>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 px-4 py-2.5 rounded-xl text-center">
            <div className="text-xl font-black text-amber-700 dark:text-amber-400">{highCount}</div>
            <div className="text-[10px] font-bold text-amber-600 dark:text-amber-300 uppercase tracking-wider">High Priority</div>
          </div>
          <div className="bg-[#FAF9F5] dark:bg-[#071324] border border-[#E5E5DE] dark:border-white/10 px-4 py-2.5 rounded-xl text-center">
            <div className="text-xl font-black text-[#0A2540] dark:text-white">{activeTasks.length}</div>
            <div className="text-[10px] font-bold text-[#0A2540]/60 dark:text-slate-400 uppercase tracking-wider">Total Actions</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              filter === "all"
                ? "bg-[#0A2540] dark:bg-amber-400 text-white dark:text-[#0A2540] shadow-xs"
                : "bg-white dark:bg-[#0D2137] text-[#0A2540]/80 dark:text-slate-300 hover:bg-[#FAF9F5] dark:hover:bg-white/5 border border-[#E5E5DE] dark:border-white/10"
            }`}
          >
            All Action Items ({activeTasks.length})
          </button>
          <button
            onClick={() => setFilter("critical")}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              filter === "critical"
                ? "bg-rose-600 text-white shadow-xs"
                : "bg-white dark:bg-[#0D2137] text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60"
            }`}
          >
            Critical Only ({criticalCount})
          </button>
          <button
            onClick={() => setFilter("high")}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              filter === "high"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-white dark:bg-[#0D2137] text-amber-800 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60"
            }`}
          >
            Urgent + High ({criticalCount + highCount})
          </button>
        </div>

        <span className="text-sm text-[#0A2540]/70 dark:text-slate-300 font-semibold hidden sm:inline">
          Showing tasks assigned to {activeRole}
        </span>
      </div>

      {/* Action Tasks Grid */}
      <div className="space-y-3.5">
        {filteredTasks.length === 0 ? (
          <div className="bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-2xl p-10 text-center text-[#0A2540]/60 dark:text-slate-400">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto mb-2 opacity-80" />
            <h3 className="font-extrabold text-base text-[#0A2540] dark:text-white">No pending actions</h3>
            <p className="text-sm text-[#0A2540]/60 dark:text-slate-400 mt-1">All items in your queue are resolved.</p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const FlowIcon = flowIconMap[task.flow] || ShieldCheck;
            const isCritical = task.priority === "Critical";
            const isHigh = task.priority === "High";

            return (
              <div
                key={task.id}
                className="bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-2xl p-5 shadow-xs hover:border-[#0A2540]/40 dark:hover:border-amber-400/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 group"
              >
                <div className="flex items-start gap-4 min-w-0">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                      isCritical
                        ? "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/60"
                        : isHigh
                        ? "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/60"
                        : "bg-slate-50 dark:bg-[#071324] text-[#0A2540] dark:text-slate-200 border-[#E5E5DE] dark:border-white/10"
                    }`}
                  >
                    <FlowIcon className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span
                        className={`text-xs font-mono font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${
                          isCritical
                            ? "bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800"
                            : isHigh
                            ? "bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-800"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700"
                        }`}
                      >
                        {task.priority}
                      </span>
                      <span className="text-xs font-mono font-extrabold text-[#0A2540]/80 dark:text-slate-300 bg-[#FAF9F5] dark:bg-[#071324] border border-[#E5E5DE] dark:border-white/10 px-2.5 py-0.5 rounded-md">
                        {task.flow} · {task.code}
                      </span>
                      {task.value && (
                        <span className="text-sm font-black text-rose-600 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-0.5 rounded-md border border-rose-100 dark:border-rose-900/60">
                          {task.value}
                        </span>
                      )}
                    </div>

                    <h4 className="text-lg font-black text-[#0A2540] dark:text-white tracking-tight">
                      {task.title}
                    </h4>
                    <p className="text-sm text-[#0A2540]/80 dark:text-slate-300 mt-1 leading-relaxed">
                      {task.description}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-3">
                  <button
                    onClick={() => onSelectNav(task.flow, task.subSection)}
                    className="w-full md:w-auto px-5 py-2.5 bg-[#0A2540] hover:bg-[#003366] dark:bg-amber-400 dark:hover:bg-amber-300 text-white dark:text-[#0A2540] rounded-xl text-sm font-black flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.98] cursor-pointer group-hover:shadow-md"
                  >
                    <span>{task.actionText}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
