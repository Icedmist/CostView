"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/app/providers";
import { createClient } from "@/lib/supabase/client";
import {
  DraftingCompass,
  Plus,
  History,
  CheckCircle2,
  XCircle,
  FileCheck2,
  BadgeCheck,
  Eye,
} from "lucide-react";
import type { DrawingDiscipline } from "@/lib/supabase/database.types";

// PRD Section 3 (Architect) + Section 5 (Site Engineer):
// upload arch/struct/mech drawings, keep the current version accessible,
// retain previous versions, revise, approve/reject variation requisitions,
// mark work items design-verified, view drawing alongside work item.

interface Drawing {
  id: string;
  discipline: DrawingDiscipline;
  title: string;
  drawingNumber: string;
  version: number;
  fileRef: string;
  isCurrent: boolean;
  linkedBoqCode: string;
  uploadedBy: string;
  uploadedAt: string;
}

type VariationStage =
  | "Pending Architect"
  | "Approved — with QS for pricing"
  | "Priced — cost updated"
  | "Rejected";

interface VariationReq {
  id: string;
  voNumber: string;
  title: string;
  siteNote: string;
  linkedBoq: string;
  linkedDrawing: string;
  raisedBy: string;
  raisedAt: string;
  stage: VariationStage;
  costImpact: number | null;
}

interface WorkItemVerify {
  code: string;
  description: string;
  linkedDrawing: string;
  designVerified: boolean;
}

const SAMPLE_DRAWINGS: Drawing[] = [
  {
    id: "drw-a101-v3",
    discipline: "Architectural",
    title: "Ground Floor General Arrangement",
    drawingNumber: "A-101",
    version: 3,
    fileRef: "A-101_GA_Ground_v3.pdf",
    isCurrent: true,
    linkedBoqCode: "EAR-01.02",
    uploadedBy: "David Okafor (Architect)",
    uploadedAt: "2026-09-10",
  },
  {
    id: "drw-a101-v2",
    discipline: "Architectural",
    title: "Ground Floor General Arrangement",
    drawingNumber: "A-101",
    version: 2,
    fileRef: "A-101_GA_Ground_v2.pdf",
    isCurrent: false,
    linkedBoqCode: "EAR-01.02",
    uploadedBy: "David Okafor (Architect)",
    uploadedAt: "2026-08-02",
  },
  {
    id: "drw-a101-v1",
    discipline: "Architectural",
    title: "Ground Floor General Arrangement",
    drawingNumber: "A-101",
    version: 1,
    fileRef: "A-101_GA_Ground_v1.pdf",
    isCurrent: false,
    linkedBoqCode: "EAR-01.02",
    uploadedBy: "David Okafor (Architect)",
    uploadedAt: "2026-06-14",
  },
  {
    id: "drw-s201-v2",
    discipline: "Structural",
    title: "Raft Foundation Details & Sections",
    drawingNumber: "S-201",
    version: 2,
    fileRef: "S-201_Raft_Details_v2.pdf",
    isCurrent: true,
    linkedBoqCode: "CON-02.01",
    uploadedBy: "David Okafor (Architect)",
    uploadedAt: "2026-09-04",
  },
  {
    id: "drw-s201-v1",
    discipline: "Structural",
    title: "Raft Foundation Details & Sections",
    drawingNumber: "S-201",
    version: 1,
    fileRef: "S-201_Raft_Details_v1.pdf",
    isCurrent: false,
    linkedBoqCode: "CON-02.01",
    uploadedBy: "David Okafor (Architect)",
    uploadedAt: "2026-07-11",
  },
  {
    id: "drw-m301-v1",
    discipline: "Mechanical",
    title: "Ground Floor Plumbing Layout",
    drawingNumber: "M-301",
    version: 1,
    fileRef: "M-301_Plumbing_GF_v1.pdf",
    isCurrent: true,
    linkedBoqCode: "STL-02.03",
    uploadedBy: "David Okafor (Architect)",
    uploadedAt: "2026-08-20",
  },
];

const SAMPLE_VARIATIONS: VariationReq[] = [
  {
    id: "vo-014",
    voNumber: "VO-014",
    title: "Rock encountered at Grid C4 — deepen raft by 600mm",
    siteNote:
      "Trial pit at Grid C4 hit hard rock above formation level. Foundation depth differs from S-201 v2. Request instruction before blinding.",
    linkedBoq: "CON-02.01",
    linkedDrawing: "S-201 v2",
    raisedBy: "Engr. Tayo (Site Engineer)",
    raisedAt: "2026-09-12",
    stage: "Pending Architect",
    costImpact: null,
  },
  {
    id: "vo-013",
    voNumber: "VO-013",
    title: "Additional Y20 rebar at raft edge thickening",
    siteNote: "Extra laps instructed per the revised bar bending schedule.",
    linkedBoq: "STL-02.03",
    linkedDrawing: "S-201 v2",
    raisedBy: "Engr. Tayo (Site Engineer)",
    raisedAt: "2026-08-28",
    stage: "Priced — cost updated",
    costImpact: 4000000,
  },
];

const SAMPLE_WORK_ITEMS: WorkItemVerify[] = [
  {
    code: "CON-02.01",
    description: "Grade 30 reinforced concrete raft",
    linkedDrawing: "S-201 v2",
    designVerified: true,
  },
  {
    code: "STL-02.03",
    description: "High-yield deformed rebar Y16 & Y20",
    linkedDrawing: "S-201 v2",
    designVerified: false,
  },
  {
    code: "EAR-01.02",
    description: "Bulk site excavation & cart-away",
    linkedDrawing: "A-101 v3",
    designVerified: true,
  },
];

const DISCIPLINES: DrawingDiscipline[] = ["Architectural", "Structural", "Mechanical"];

interface DrawingsViewProps {
  initialSubTab?: string;
  onTabChange?: (tab: string) => void;
}

export function DrawingsView({ initialSubTab, onTabChange }: DrawingsViewProps) {
  const { activeRole } = useApp();
  const [tab, setTab] = useState(initialSubTab || "current");
  const [drawings, setDrawings] = useState<Drawing[]>(SAMPLE_DRAWINGS);
  const [variations, setVariations] = useState<VariationReq[]>(SAMPLE_VARIATIONS);
  const [workItems, setWorkItems] = useState<WorkItemVerify[]>(SAMPLE_WORK_ITEMS);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedWorkItem, setSelectedWorkItem] = useState(SAMPLE_WORK_ITEMS[0].code);
  const [priceInputs, setPriceInputs] = useState<Record<string, string>>({});

  // Form state for upload / revision
  const [formTitle, setFormTitle] = useState("");
  const [formNumber, setFormNumber] = useState("");
  const [formDiscipline, setFormDiscipline] = useState<DrawingDiscipline>("Architectural");
  const [formBoq, setFormBoq] = useState("");
  const [formFile, setFormFile] = useState("");

  const canUpload = activeRole === "Admin" || activeRole === "Architect" || activeRole === "Project Manager";
  const canApprove = activeRole === "Admin" || activeRole === "Architect";
  const canVerify = activeRole === "Admin" || activeRole === "Architect";
  const canPrice = activeRole === "Admin" || activeRole === "Quantity Surveyor" || activeRole === "Project Manager";

  // Load live drawings from Supabase when available; fall back to samples.
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("drawings")
          .select("id, discipline, title, drawing_number, version, file_url, is_current, linked_boq_code, uploaded_by, created_at")
          .order("drawing_number", { ascending: true })
          .order("version", { ascending: false });
        if (!isMounted || error || !data || data.length === 0) return;
        setDrawings(
          data.map((d: any) => ({
            id: d.id,
            discipline: d.discipline as DrawingDiscipline,
            title: d.title,
            drawingNumber: d.drawing_number,
            version: Number(d.version || 1),
            fileRef: d.file_url || `${d.drawing_number}_v${d.version}.pdf`,
            isCurrent: Boolean(d.is_current),
            linkedBoqCode: d.linked_boq_code || "",
            uploadedBy: d.uploaded_by || "Architect",
            uploadedAt: String(d.created_at || "").slice(0, 10),
          }))
        );
      } catch {
        // Offline / table not yet migrated — keep sample data.
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const selectTab = (t: string) => {
    setTab(t);
    onTabChange?.(t);
  };

  const currentDrawings = drawings.filter((d) => d.isCurrent);
  const historyDrawings = drawings.filter((d) => !d.isCurrent);

  const startRevision = (d: Drawing) => {
    setFormTitle(d.title);
    setFormNumber(d.drawingNumber);
    setFormDiscipline(d.discipline);
    setFormBoq(d.linkedBoqCode);
    setFormFile("");
    setIsUploadOpen(true);
  };

  // Upload: a repeated drawing number becomes a new version;
  // the previous current copy is retained as history (never replaced).
  const handleUpload = () => {
    if (!formTitle.trim() || !formNumber.trim()) return;
    const same = drawings.filter(
      (d) => d.drawingNumber.toLowerCase() === formNumber.trim().toLowerCase()
    );
    const nextVersion = same.length > 0 ? Math.max(...same.map((d) => d.version)) + 1 : 1;
    const updated = drawings.map((d) =>
      d.drawingNumber.toLowerCase() === formNumber.trim().toLowerCase() && d.isCurrent
        ? { ...d, isCurrent: false }
        : d
    );
    const entry: Drawing = {
      id: `drw-${Date.now()}`,
      discipline: formDiscipline,
      title: formTitle.trim(),
      drawingNumber: formNumber.trim().toUpperCase(),
      version: nextVersion,
      fileRef: formFile.trim() || `${formNumber.trim().toUpperCase()}_v${nextVersion}.pdf`,
      isCurrent: true,
      linkedBoqCode: formBoq.trim().toUpperCase(),
      uploadedBy: `${activeRole}`,
      uploadedAt: new Date().toISOString().slice(0, 10),
    };
    setDrawings([...updated, entry]);
    setFormTitle("");
    setFormNumber("");
    setFormBoq("");
    setFormFile("");
    setIsUploadOpen(false);
    selectTab("current");
  };

  const handleVariationDecision = (id: string, approved: boolean) => {
    setVariations((prev) =>
      prev.map((v) =>
        v.id === id
          ? { ...v, stage: approved ? "Approved — with QS for pricing" : "Rejected" }
          : v
      )
    );
  };

  const handlePriceVariation = (id: string) => {
    const raw = (priceInputs[id] || "").replace(/[^0-9]/g, "");
    if (!raw) return;
    setVariations((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, stage: "Priced — cost updated", costImpact: Number(raw) } : v
      )
    );
  };

  const toggleVerified = (code: string) => {
    setWorkItems((prev) =>
      prev.map((w) => (w.code === code ? { ...w, designVerified: !w.designVerified } : w))
    );
  };

  const focusedWorkItem = workItems.find((w) => w.code === selectedWorkItem) || workItems[0];
  const focusedDrawing = drawings.find(
    (d) =>
      d.isCurrent &&
      focusedWorkItem &&
      d.linkedBoqCode.toLowerCase() === focusedWorkItem.code.toLowerCase()
  );

  const stageBadge = (stage: VariationStage) => {
    switch (stage) {
      case "Pending Architect":
        return "bg-amber-100 text-amber-900 border border-amber-300";
      case "Approved — with QS for pricing":
        return "bg-blue-100 text-blue-900 border border-blue-300";
      case "Priced — cost updated":
        return "bg-emerald-100 text-emerald-900 border border-emerald-300";
      case "Rejected":
        return "bg-rose-100 text-rose-900 border border-rose-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header — PRD simplicity: white card, light blue accent */}
      <div className="bg-white border-2 border-sky-200 rounded-2xl p-6 md:p-7 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2.5">
              <span className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-sm">
                <DraftingCompass className="w-5 h-5" />
              </span>
              Project Drawings
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Architectural, structural and mechanical drawings. The current version is
              always shown first — older versions are kept below as record.
            </p>
          </div>
          {canUpload && (
            <button
              onClick={() => setIsUploadOpen((v) => !v)}
              className="min-h-[48px] px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-extrabold flex items-center gap-2 shadow-sm transition-all active:scale-[0.98] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Drawing</span>
            </button>
          )}
        </div>

        {/* Simple tab row */}
        <div className="mt-5 flex flex-wrap gap-2">
          {[
            { id: "current", label: "Current Drawings", icon: FileCheck2 },
            { id: "history", label: "Version History", icon: History },
            { id: "approvals", label: "Variation Approvals", icon: BadgeCheck },
          ].map((t) => {
            const Icon = t.icon;
            const isActive = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => selectTab(t.id)}
                className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border-2 transition-all cursor-pointer ${
                  isActive
                    ? "bg-sky-600 text-white border-sky-600 shadow-sm"
                    : "bg-white text-slate-700 border-slate-200 hover:border-sky-300 hover:text-sky-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Upload form — straightforward, one purpose */}
      {isUploadOpen && canUpload && (
        <div className="bg-white border-2 border-sky-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-base font-black text-slate-900">
            Upload drawing — a repeated drawing number creates a new version
          </h3>
          <div className="mt-4 grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                Drawing title
              </span>
              <input
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. Ground Floor General Arrangement"
                className="mt-1.5 w-full min-h-[48px] px-4 py-3 rounded-xl border-2 border-slate-200 text-sm font-semibold focus:border-sky-500 focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                Drawing number
              </span>
              <input
                value={formNumber}
                onChange={(e) => setFormNumber(e.target.value)}
                placeholder="e.g. A-102"
                className="mt-1.5 w-full min-h-[48px] px-4 py-3 rounded-xl border-2 border-slate-200 text-sm font-mono font-bold focus:border-sky-500 focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                Discipline
              </span>
              <select
                value={formDiscipline}
                onChange={(e) => setFormDiscipline(e.target.value as DrawingDiscipline)}
                className="mt-1.5 w-full min-h-[48px] px-4 py-3 rounded-xl border-2 border-slate-200 text-sm font-semibold focus:border-sky-500 focus:outline-none bg-white"
              >
                {DISCIPLINES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                Linked work item (BOQ code)
              </span>
              <input
                value={formBoq}
                onChange={(e) => setFormBoq(e.target.value)}
                placeholder="e.g. CON-02.01"
                className="mt-1.5 w-full min-h-[48px] px-4 py-3 rounded-xl border-2 border-slate-200 text-sm font-mono font-bold focus:border-sky-500 focus:outline-none"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                File reference
              </span>
              <input
                value={formFile}
                onChange={(e) => setFormFile(e.target.value)}
                placeholder="e.g. A-102_GA_FirstFloor_v1.pdf"
                className="mt-1.5 w-full min-h-[48px] px-4 py-3 rounded-xl border-2 border-slate-200 text-sm font-semibold focus:border-sky-500 focus:outline-none"
              />
            </label>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={handleUpload}
              className="min-h-[48px] px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-extrabold shadow-sm cursor-pointer"
            >
              Save drawing
            </button>
            <button
              onClick={() => setIsUploadOpen(false)}
              className="min-h-[48px] px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 rounded-xl text-sm font-extrabold cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* CURRENT DRAWINGS */}
      {tab === "current" && (
        <div className="space-y-4">
          {currentDrawings.map((d) => (
            <div
              key={d.id}
              className="bg-white border-2 border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm font-black text-sky-800">
                      {d.drawingNumber} · v{d.version}
                    </span>
                    <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-sky-100 text-sky-900 border border-sky-300">
                      CURRENT
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {d.discipline}
                    </span>
                  </div>
                  <div className="text-base font-extrabold text-slate-900 mt-1.5">{d.title}</div>
                  <div className="text-xs text-slate-500 font-semibold mt-1">
                    {d.fileRef} · Linked work item:{" "}
                    <span className="font-mono font-bold text-slate-700">
                      {d.linkedBoqCode || "—"}
                    </span>{" "}
                    · Uploaded by {d.uploadedBy} · {d.uploadedAt}
                  </div>
                </div>
                {canUpload && (
                  <button
                    onClick={() => startRevision(d)}
                    className="min-h-[44px] px-5 py-2.5 bg-white hover:bg-sky-50 text-sky-800 border-2 border-sky-300 rounded-xl text-xs font-black uppercase tracking-wider shrink-0 cursor-pointer"
                  >
                    Upload revised version
                  </button>
                )}
              </div>
            </div>
          ))}
          {currentDrawings.length === 0 && (
            <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 text-center text-sm font-semibold text-slate-500">
              No current drawings yet. {canUpload ? "Upload the first drawing above." : "Ask the Architect to upload the drawings."}
            </div>
          )}

          {/* View drawing alongside work item (Site Engineer daily use) */}
          <div className="bg-white border-2 border-sky-200 rounded-2xl p-5 md:p-6 shadow-sm">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Eye className="w-4 h-4 text-sky-700" />
              Drawing alongside work item
            </h3>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              Pick a work item to see the current drawing that governs it.
            </p>
            <div className="mt-3 flex flex-col sm:flex-row gap-3">
              <select
                value={selectedWorkItem}
                onChange={(e) => setSelectedWorkItem(e.target.value)}
                className="min-h-[48px] px-4 py-3 rounded-xl border-2 border-slate-200 text-sm font-bold bg-white focus:border-sky-500 focus:outline-none"
              >
                {workItems.map((w) => (
                  <option key={w.code} value={w.code}>
                    {w.code} — {w.description}
                  </option>
                ))}
              </select>
              {focusedDrawing ? (
                <div className="flex-1 px-4 py-3 rounded-xl bg-sky-50 border-2 border-sky-200 text-sm">
                  <span className="font-mono font-black text-sky-900">
                    {focusedDrawing.drawingNumber} · v{focusedDrawing.version}
                  </span>
                  <span className="text-slate-700 font-semibold"> — {focusedDrawing.title} </span>
                  <span className="text-slate-500 font-semibold">({focusedDrawing.fileRef})</span>
                </div>
              ) : (
                <div className="flex-1 px-4 py-3 rounded-xl bg-amber-50 border-2 border-amber-200 text-sm font-bold text-amber-900">
                  No current drawing linked to {focusedWorkItem?.code}. Ask the Architect to link one.
                </div>
              )}
            </div>
          </div>

          {/* Design-verified work items */}
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm overflow-x-auto">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-sky-700" />
              Design verification by work item
            </h3>
            <table className="mt-3 w-full text-sm min-w-[560px]">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-slate-500">
                  <th className="py-2 pr-4 font-black">Work item</th>
                  <th className="py-2 pr-4 font-black">Description</th>
                  <th className="py-2 pr-4 font-black">Drawing</th>
                  <th className="py-2 pr-4 font-black">Status</th>
                  <th className="py-2 font-black">Action</th>
                </tr>
              </thead>
              <tbody>
                {workItems.map((w) => (
                  <tr key={w.code} className="border-t border-slate-100">
                    <td className="py-3 pr-4 font-mono font-black text-slate-800">{w.code}</td>
                    <td className="py-3 pr-4 font-semibold text-slate-700">{w.description}</td>
                    <td className="py-3 pr-4 font-mono font-bold text-sky-800">{w.linkedDrawing}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`text-[11px] font-black px-2.5 py-1 rounded-full border ${
                          w.designVerified
                            ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                            : "bg-slate-100 text-slate-600 border-slate-300"
                        }`}
                      >
                        {w.designVerified ? "DESIGN-VERIFIED" : "NOT VERIFIED"}
                      </span>
                    </td>
                    <td className="py-3">
                      {canVerify ? (
                        <button
                          onClick={() => toggleVerified(w.code)}
                          className="min-h-[40px] px-4 py-2 bg-white hover:bg-sky-50 text-sky-800 border-2 border-sky-300 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer"
                        >
                          {w.designVerified ? "Unmark" : "Mark verified"}
                        </button>
                      ) : (
                        <span className="text-xs font-semibold text-slate-400">
                          Architect only
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VERSION HISTORY */}
      {tab === "history" && (
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm overflow-x-auto">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <History className="w-4 h-4 text-sky-700" />
            Previous versions — kept as record
          </h3>
          <table className="mt-3 w-full text-sm min-w-[620px]">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-slate-500">
                <th className="py-2 pr-4 font-black">Drawing</th>
                <th className="py-2 pr-4 font-black">Version</th>
                <th className="py-2 pr-4 font-black">Title</th>
                <th className="py-2 pr-4 font-black">Uploaded</th>
                <th className="py-2 font-black">Status</th>
              </tr>
            </thead>
            <tbody>
              {historyDrawings.map((d) => (
                <tr key={d.id} className="border-t border-slate-100">
                  <td className="py-3 pr-4 font-mono font-black text-slate-800">
                    {d.drawingNumber}
                  </td>
                  <td className="py-3 pr-4 font-mono font-bold text-slate-600">v{d.version}</td>
                  <td className="py-3 pr-4 font-semibold text-slate-700">{d.title}</td>
                  <td className="py-3 pr-4 text-xs font-semibold text-slate-500">
                    {d.uploadedBy} · {d.uploadedAt}
                  </td>
                  <td className="py-3">
                    <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-300">
                      SUPERSEDED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {historyDrawings.length === 0 && (
            <p className="mt-3 text-sm font-semibold text-slate-500">
              No previous versions yet. When a drawing is revised, the old version stays here.
            </p>
          )}
        </div>
      )}

      {/* VARIATION APPROVALS — Site discrepancy → Architect → QS pricing */}
      {tab === "approvals" && (
        <div className="space-y-4">
          {variations.map((v) => (
            <div
              key={v.id}
              className="bg-white border-2 border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-sm font-black text-slate-900">{v.voNumber}</span>
                <span
                  className={`text-[11px] font-black px-2.5 py-1 rounded-full ${stageBadge(v.stage)}`}
                >
                  {v.stage.toUpperCase()}
                </span>
              </div>
              <div className="text-base font-extrabold text-slate-900 mt-1.5">{v.title}</div>
              <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{v.siteNote}</p>
              <div className="text-xs text-slate-500 font-semibold mt-2">
                Raised by {v.raisedBy} · {v.raisedAt} · Work item{" "}
                <span className="font-mono font-bold">{v.linkedBoq}</span> · Drawing{" "}
                <span className="font-mono font-bold">{v.linkedDrawing}</span>
                {v.costImpact !== null && (
                  <>
                    {" "}· Priced at{" "}
                    <span className="font-mono font-black text-slate-800">
                      ₦{v.costImpact.toLocaleString()}
                    </span>
                  </>
                )}
              </div>

              {v.stage === "Pending Architect" && canApprove && (
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    onClick={() => handleVariationDecision(v.id, true)}
                    className="min-h-[48px] px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-extrabold flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve — send to QS for pricing</span>
                  </button>
                  <button
                    onClick={() => handleVariationDecision(v.id, false)}
                    className="min-h-[48px] px-6 py-3 bg-white hover:bg-rose-50 text-rose-700 border-2 border-rose-300 rounded-xl text-sm font-extrabold flex items-center gap-2 cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                </div>
              )}
              {v.stage === "Pending Architect" && !canApprove && (
                <p className="mt-3 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
                  Waiting for the Architect to approve or reject this requisition.
                </p>
              )}

              {v.stage === "Approved — with QS for pricing" && (
                <div className="mt-4">
                  {canPrice ? (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        value={priceInputs[v.id] || ""}
                        onChange={(e) =>
                          setPriceInputs((p) => ({ ...p, [v.id]: e.target.value }))
                        }
                        placeholder="Enter priced amount, e.g. 4500000"
                        inputMode="numeric"
                        className="min-h-[48px] px-4 py-3 rounded-xl border-2 border-slate-200 text-sm font-mono font-bold focus:border-sky-500 focus:outline-none sm:w-72"
                      />
                      <button
                        onClick={() => handlePriceVariation(v.id)}
                        className="min-h-[48px] px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-extrabold shadow-sm cursor-pointer"
                      >
                        Price variation — update cost
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs font-bold text-blue-800 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5">
                      Approved by the Architect. Waiting for the Quantity Surveyor to price it.
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!canUpload && tab !== "approvals" && (
        <p className="text-xs font-semibold text-slate-400">
          Signed in as {activeRole}. Drawing uploads belong to the Architect — other roles can
          view and use the current versions.
        </p>
      )}
      <p className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Flow: site discrepancy → variation requisition → Architect approval → QS pricing → cost updated.
      </p>
    </div>
  );
}
