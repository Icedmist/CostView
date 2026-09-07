"use client";

import React, { useState } from "react";
import { useApp } from "@/app/providers";
import {
  Sun,
  CloudRain,
  Users,
  AlertCircle,
  CheckCircle2,
  Clock,
  Camera,
  Plus,
  ShieldAlert,
} from "lucide-react";

interface SnagRecord {
  id: string;
  title: string;
  location: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  status: "Open" | "In Progress" | "Remediated" | "Closed";
  assignedTo: string;
  raisedBy: string;
}

const SAMPLE_SNAGS: SnagRecord[] = [
  {
    id: "snag-1",
    title: "Honeycomb voiding on column C4 plinth level",
    location: "Block B, Ground Floor",
    severity: "High",
    status: "Open",
    assignedTo: "Engr. Tayo (Site Eng)",
    raisedBy: "Architect David",
  },
  {
    id: "snag-2",
    title: "Reinforcement cover spacing inadequate (<25mm)",
    location: "Raft Slab Grid 3-4",
    severity: "Critical",
    status: "In Progress",
    assignedTo: "Bar Benders Foreman",
    raisedBy: "Consultant QS / PM",
  },
  {
    id: "snag-3",
    title: "Conduit piping misalignment in riser shaft",
    location: "First Floor Riser A",
    severity: "Medium",
    status: "Remediated",
    assignedTo: "MEP Subcontractor",
    raisedBy: "Site Engineer",
  },
];

export function SiteDiaryView() {
  const [snags, setSnags] = useState<SnagRecord[]>(SAMPLE_SNAGS);

  return (
    <div className="space-y-6">
      {/* Daily Site Diary Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-emerald-400 font-bold">
                DAILY LOG #142
              </span>
              <span className="text-zinc-500">·</span>
              <span className="text-xs text-zinc-300 font-medium">Monday, 7 September 2026</span>
            </div>
            <h3 className="text-base font-bold text-white mt-1">
              Superstructure Concrete Pour & Blockwork Muster
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {/* Weather Metric */}
            <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-300">
              <Sun className="w-4 h-4 text-amber-400" />
              <span>31°C · Sunny (0 delay hrs)</span>
            </div>

            {/* Total Headcount */}
            <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-300">
              <Users className="w-4 h-4 text-emerald-400" />
              <span className="font-mono font-bold text-white">48 Workers</span>
              <span className="text-zinc-500">on site</span>
            </div>
          </div>
        </div>

        {/* Work summary */}
        <div className="mt-4 text-xs text-zinc-300 leading-relaxed bg-zinc-950/60 p-3 rounded-lg border border-zinc-800/80">
          <p className="font-semibold text-zinc-200 mb-1">Shift Progress Summary:</p>
          <ul className="list-disc list-inside space-y-1 text-zinc-400">
            <li>Cast 65m³ of Grade 30 reinforced concrete on Floor 2 beam & slab section 1.</li>
            <li>Completed 180m² of 225mm hollow sandcrete blockwork perimeter walling on Grid line A-E.</li>
            <li>Received delivery of 600 bags Dangote cement (matched against PO-2026-088).</li>
            <li>Zero lost-time safety incidents recorded (Day 114 incident-free streak).</li>
          </ul>
        </div>
      </div>

      {/* Snagging & Non-Conformance Reports (NCR) */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Snagging & Quality Non-Conformance (NCR)</span>
              <span className="text-[10px] bg-amber-950 text-amber-400 px-2 py-0.5 rounded border border-amber-800/60 font-mono">
                {snags.filter(s => s.status !== "Closed").length} Active Snags
              </span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Visual issue tracking from discovery to remediation and QS/PM sign-off.
            </p>
          </div>
        </div>

        <div className="divide-y divide-zinc-800/60">
          {snags.map((snag) => (
            <div key={snag.id} className="p-4 hover:bg-zinc-800/30 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    snag.severity === "Critical"
                      ? "bg-red-950 text-red-300 border-red-800"
                      : snag.severity === "High"
                      ? "bg-orange-950 text-orange-300 border-orange-800"
                      : "bg-amber-950 text-amber-300 border-amber-800"
                  }`}>
                    {snag.severity}
                  </span>
                  <span className="font-semibold text-white text-xs">{snag.title}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                  <span>Location: <strong className="text-zinc-300">{snag.location}</strong></span>
                  <span>·</span>
                  <span>Assigned: <strong className="text-zinc-300">{snag.assignedTo}</strong></span>
                  <span>·</span>
                  <span>Raised by: {snag.raisedBy}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                  snag.status === "Open"
                    ? "bg-zinc-800 text-zinc-300 border-zinc-700"
                    : snag.status === "In Progress"
                    ? "bg-blue-950 text-blue-300 border-blue-800"
                    : "bg-emerald-950 text-emerald-300 border-emerald-800"
                }`}>
                  {snag.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
