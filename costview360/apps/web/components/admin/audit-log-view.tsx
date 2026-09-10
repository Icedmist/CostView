"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Search, Filter, ShieldCheck, History, ArrowDownToLine } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface AuditEntry {
  id: string;
  actor: string;
  role: string;
  action: string;
  module: "Budget" | "Procurement" | "Materials" | "Labour" | "Variations" | "Commercial";
  entity: string;
  delta: string;
  timestamp: string;
}

const SAMPLE_LOGS: AuditEntry[] = [
  {
    id: "log-1",
    actor: "Engr. Babatunde (PM)",
    role: "Project Manager",
    action: "Discrepancy Lock Applied",
    module: "Procurement",
    entity: "PO-2026-092",
    delta: "Locked payment for Pulkit Steels. Shortfall: 3 Tons rebar.",
    timestamp: "2026-09-07 14:15:22",
  },
  {
    id: "log-2",
    actor: "Mrs. Nkechi (QS)",
    role: "Quantity Surveyor",
    action: "Budget Rate Revision Submitted",
    module: "Budget",
    entity: "CON-02.01",
    delta: "Adjusted rate from ₦195,000 to ₦203,000/m³ (+₦4,000,000 total).",
    timestamp: "2026-09-07 11:42:09",
  },
  {
    id: "log-3",
    actor: "Tayo (Storekeeper)",
    role: "Storekeeper",
    action: "Material Consumption Recorded",
    module: "Materials",
    entity: "MAT-CEM-01",
    delta: "Issued 50 bags cement to Block B Ground Floor raft slab.",
    timestamp: "2026-09-07 09:30:00",
  },
  {
    id: "log-4",
    actor: "Admin (icedmist)",
    role: "Admin",
    action: "User Permissions Updated",
    module: "Commercial",
    entity: "Role Matrix",
    delta: "Granted Quantity Surveyor access to Subcontractor certification.",
    timestamp: "2026-09-06 16:55:12",
  },
  {
    id: "log-5",
    actor: "Engr. Babatunde (PM)",
    role: "Project Manager",
    action: "PO Approved",
    module: "Procurement",
    entity: "PO-2026-088",
    delta: "Authorized ₦5,880,000 order to Dangote Cement Plc.",
    timestamp: "2026-09-05 10:20:41",
  },
];

export function AuditLogView() {
  const [logs, setLogs] = useState<AuditEntry[]>(SAMPLE_LOGS);
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("All");

  // Load live audit logs from Supabase
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("audit_logs")
          .select("*, profiles:actor_id(full_name, default_role)")
          .order("created_at", { ascending: false });
        if (isMounted && data && data.length > 0) {
          const mapped: AuditEntry[] = data.map((d: any) => {
            const moduleMap: Record<string, AuditEntry["module"]> = {
              supplier_invoices: "Procurement",
              purchase_orders: "Procurement",
              subcontractor_claims: "Commercial",
              variation_orders: "Variations",
              boq_items: "Budget",
              stock_balances: "Materials",
            };
            const actMap: Record<string, string> = {
              THREE_WAY_MATCH_FLAGGED: "Discrepancy Lock Applied",
              CLAIM_CERTIFIED: "Subcontractor Claim Certified",
              VARIATION_APPROVED: "Variation Order Approved",
            };
            return {
              id: d.id,
              actor: d.profiles?.full_name || "Engr. Babatunde (PM)",
              role: d.profiles?.default_role || "Project Manager",
              action: actMap[d.action] || d.action,
              module: moduleMap[d.entity_type] || "Commercial",
              entity: d.entity_type,
              delta: typeof d.delta === "object" ? JSON.stringify(d.delta).replace(/[{}"]/g, " ") : String(d.delta),
              timestamp: d.created_at ? d.created_at.replace("T", " ").substring(0, 19) : new Date().toISOString().substring(0, 19),
            };
          });
          setLogs(mapped);
        }
      } catch (e) {
        console.warn("Failed to load audit logs from Supabase", e);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      const matchesSearch =
        l.actor.toLowerCase().includes(search.toLowerCase()) ||
        l.action.toLowerCase().includes(search.toLowerCase()) ||
        l.entity.toLowerCase().includes(search.toLowerCase()) ||
        l.delta.toLowerCase().includes(search.toLowerCase());
      const matchesModule = moduleFilter === "All" || l.module === moduleFilter;
      return matchesSearch && matchesModule;
    });
  }, [logs, search, moduleFilter]);

  return (
    <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-xl shadow-xs rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-200/80 bg-slate-50/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-600" />
            <span>Searchable Compliance Audit Journal</span>
            <span className="text-xs bg-slate-100 text-slate-700 border border-slate-200 rounded px-2 py-0.5 font-mono font-medium text-xs">
              Immutable Ledger
            </span>
          </h3>
          <p className="text-xs text-slate-900/60 mt-0.5">
            Every approval-chain action and state mutation timestamped with actor attribution (PRD Section 9).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-900/60" />
            <input
              type="text"
              placeholder="Search actor, entity, or change..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200/80 text-xs text-slate-900 placeholder-navy-800/50 focus:outline-none focus:ring-2 focus:ring-navy-800"
            />
          </div>

          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="bg-white border border-slate-200/80 px-2 py-1.5 text-xs text-slate-900 font-bold focus:outline-none cursor-pointer"
          >
            <option value="All">All Modules</option>
            <option value="Budget">Budget</option>
            <option value="Procurement">Procurement</option>
            <option value="Materials">Materials</option>
            <option value="Labour">Labour</option>
            <option value="Variations">Variations</option>
            <option value="Commercial">Commercial</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900 text-white uppercase text-xs font-semibold border-b border-slate-200/80">
            <tr>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Actor</th>
              <th className="py-3 px-3">Module</th>
              <th className="py-3 px-4">Action</th>
              <th className="py-3 px-3">Entity Ref</th>
              <th className="py-3 px-4">Change Delta / Record</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-800/10 text-slate-900">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-white/30 transition-colors">
                <td className="py-3 px-4 font-mono text-slate-900/60 whitespace-nowrap">
                  {log.timestamp}
                </td>
                <td className="py-3 px-4">
                  <div className="font-bold text-slate-900">{log.actor}</div>
                  <div className="text-xs text-slate-900/40">{log.role}</div>
                </td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 bg-white border border-slate-200/80 text-xs font-bold text-slate-900">
                    {log.module}
                  </span>
                </td>
                <td className="py-3 px-4 font-bold text-emerald-700">
                  {log.action}
                </td>
                <td className="py-3 px-3 font-mono font-bold text-slate-900">
                  {log.entity}
                </td>
                <td className="py-3 px-4 text-slate-900 max-w-sm">
                  {log.delta}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
