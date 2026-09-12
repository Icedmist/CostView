"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Search, Filter, ShieldCheck, History, ArrowDownToLine, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface AuditEntry {
  id: string;
  actor: string;
  role: string;
  action: string;
  module: "Budget" | "Procurement" | "Materials" | "Labour" | "Variations" | "Contracts";
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
    delta: "Locked payment disbursement for Pulkit Steels. Shortfall: 3 Tons rebar.",
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
    module: "Contracts",
    entity: "Role Matrix",
    delta: "Granted Quantity Surveyor access to Subcontractor certification.",
    timestamp: "2026-09-06 16:55:12",
  },
  {
    id: "log-5",
    actor: "Engr. Babatunde (PM)",
    role: "Project Manager",
    action: "Purchase Order Authorized",
    module: "Procurement",
    entity: "PO-2026-088",
    delta: "Authorized ₦5,880,000 order to Dangote Cement Plc.",
    timestamp: "2026-09-05 10:20:41",
  },
  {
    id: "log-6",
    actor: "Engr. Babatunde (PM)",
    role: "Project Manager",
    action: "Interim Claim Certified",
    module: "Contracts",
    entity: "CLM-2026-014",
    delta: "Certified ₦20,000,000 net valuation with 10% retention withheld.",
    timestamp: "2026-09-04 15:10:00",
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
              subcontractor_claims: "Contracts",
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
              module: moduleMap[d.entity_type] || "Contracts",
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
    return () => {
      isMounted = false;
    };
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
    <div className="bg-white border-2 border-[#E5E5DE] rounded-2xl shadow-xs overflow-hidden space-y-0">
      {/* Header & Filter Bar */}
      <div className="p-6 md:p-8 border-b-2 border-[#E5E5DE] bg-[#FAF9F5] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 bg-[#0A2540] text-white rounded-md">
              Audit Code 6.4
            </span>
            <span className="text-xs font-bold px-2.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-md flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Immutable
            </span>
          </div>
          <h2 className="text-xl font-black text-[#0A2540] flex items-center gap-2.5">
            <History className="w-5 h-5 text-[#0A2540]" />
            <span>Searchable Compliance &amp; Governance Audit Journal</span>
          </h2>
          <p className="text-xs md:text-sm text-[#0A2540]/70 font-semibold mt-1">
            Every approval-chain action, contract valuation, and state mutation recorded with actor attribution.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A2540]/50" />
            <input
              type="text"
              placeholder="Search actor, entity, or delta..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 pl-10 pr-3.5 bg-white border-2 border-[#E5E5DE] rounded-xl text-xs font-bold text-[#0A2540] placeholder-[#0A2540]/40 focus:outline-none focus:border-[#0A2540]"
            />
          </div>

          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="h-11 bg-white border-2 border-[#E5E5DE] rounded-xl px-3.5 text-xs font-black text-[#0A2540] focus:outline-none focus:border-[#0A2540] cursor-pointer"
          >
            <option value="All">All Modules ({logs.length})</option>
            <option value="Budget">Budget</option>
            <option value="Procurement">Procurement</option>
            <option value="Materials">Materials</option>
            <option value="Labour">Labour</option>
            <option value="Variations">Variations</option>
            <option value="Contracts">Contracts</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs md:text-sm">
          <thead className="bg-[#0A2540] text-white uppercase text-xs font-black tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Timestamp</th>
              <th className="py-3.5 px-4">Actor</th>
              <th className="py-3.5 px-3">Module</th>
              <th className="py-3.5 px-4">Action</th>
              <th className="py-3.5 px-3">Entity Ref</th>
              <th className="py-3.5 px-4">Change Delta / Record</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-[#E5E5DE] bg-white text-[#0A2540]">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-sm font-bold text-[#0A2540]/60">
                  No matching audit entries found for "{search}".
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#FAF9F5] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#0A2540]/70 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-extrabold text-[#0A2540]">{log.actor}</div>
                    <div className="text-xs text-[#0A2540]/60 font-medium">{log.role}</div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2.5 py-1 bg-[#FAF9F5] border border-[#E5E5DE] rounded-md text-xs font-black text-[#0A2540]">
                      {log.module}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-black text-emerald-800">
                    {log.action}
                  </td>
                  <td className="py-3.5 px-3 font-mono font-black text-[#0A2540]">
                    {log.entity}
                  </td>
                  <td className="py-3.5 px-4 text-[#0A2540]/90 font-medium max-w-md">
                    {log.delta}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
