"use client";

import React, { useState, useMemo } from "react";
import { Search, Filter, ShieldCheck, History, ArrowDownToLine } from "lucide-react";

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
    <div className="bg-white border-2 border-navy-800 shadow-brutal overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-navy-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-400" />
            <span>Searchable Compliance Audit Journal</span>
            <span className="text-xs bg-cream-100 text-navy-800/60 border border-navy-800 px-2 py-0.5 rounded font-mono">
              Immutable Ledger
            </span>
          </h3>
          <p className="text-xs text-navy-800/60 mt-0.5">
            Every approval-chain action and state mutation timestamped with actor attribution (PRD Section 9).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-navy-800/60" />
            <input
              type="text"
              placeholder="Search actor, entity, or change..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-cream-100 border border-navy-800 border-2 border-navy-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="bg-cream-100 border border-navy-800 border-2 border-navy-800 px-2 py-1.5 text-xs text-navy-800 focus:outline-none cursor-pointer"
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
          <thead className="bg-navy-800 text-white uppercase text-xs font-semibold border-b border-navy-800">
            <tr>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Actor</th>
              <th className="py-3 px-3">Module</th>
              <th className="py-3 px-4">Action</th>
              <th className="py-3 px-3">Entity Ref</th>
              <th className="py-3 px-4">Change Delta / Record</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-800/10 text-navy-800">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-cream-100/30 transition-colors">
                <td className="py-3 px-4 font-mono text-navy-800/60 whitespace-nowrap">
                  {log.timestamp}
                </td>
                <td className="py-3 px-4">
                  <div className="font-bold text-navy-800">{log.actor}</div>
                  <div className="text-xs text-navy-800/40">{log.role}</div>
                </td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded bg-cream-100 border border-navy-800 text-xs font-medium text-navy-800">
                    {log.module}
                  </span>
                </td>
                <td className="py-3 px-4 font-semibold text-emerald-300">
                  {log.action}
                </td>
                <td className="py-3 px-3 font-mono font-bold text-navy-800">
                  {log.entity}
                </td>
                <td className="py-3 px-4 text-navy-800 max-w-sm">
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
