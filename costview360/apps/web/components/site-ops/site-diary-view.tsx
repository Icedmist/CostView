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
  Calendar,
  Image as ImageIcon,
  FileCheck2,
  Upload,
  AlertTriangle,
  HardHat,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface DailyLog {
  id: string;
  logNumber: number;
  date: string;
  weather: string;
  temperature: string;
  delayHours: number;
  workerHeadcount: number;
  title: string;
  summary: string[];
}

interface SitePhoto {
  id: string;
  title: string;
  category: "Structure" | "Finishing" | "Quality" | "Safety";
  timestamp: string;
  uploadedBy: string;
  url: string;
}

interface Inspection {
  id: string;
  title: string;
  element: string;
  inspector: string;
  date: string;
  status: "Passed" | "Failed" | "Pending";
  notes: string;
}

interface SnagRecord {
  id: string;
  title: string;
  location: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  status: "Open" | "In Progress" | "Remediated" | "Closed";
  assignedTo: string;
  raisedBy: string;
}

interface SafetyObservation {
  id: string;
  type: "Near Miss" | "Unsafe Act" | "Good Practice" | "Incident";
  description: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  location: string;
  reportedBy: string;
  timestamp: string;
  status: "Open" | "Remediated";
}

const INITIAL_LOGS: DailyLog[] = [
  {
    id: "log-142",
    logNumber: 142,
    date: "Monday, 7 September 2026",
    weather: "Sunny",
    temperature: "31°C",
    delayHours: 0,
    workerHeadcount: 48,
    title: "Superstructure Concrete Pour & Blockwork Muster",
    summary: [
      "Cast 65m³ of Grade 30 reinforced concrete on Floor 2 beam & slab section 1.",
      "Completed 180m² of 225mm hollow sandcrete blockwork perimeter walling on Grid line A-E.",
      "Received delivery of 600 bags Dangote cement (matched against PO-2026-088).",
      "Zero lost-time safety incidents recorded (Day 114 incident-free streak).",
    ],
  },
  {
    id: "log-141",
    logNumber: 141,
    date: "Saturday, 5 September 2026",
    weather: "Overcast",
    temperature: "28°C",
    delayHours: 1,
    workerHeadcount: 44,
    title: "Rebar Fixing for Column Plinths & MEP First-Fix Riser",
    summary: [
      "Tied 14 tons of 16mm/20mm high tensile TMT steel on second floor shear wall.",
      "MEP subcontractor completed conduit pipe layout on Block B riser.",
      "Heavy morning drizzle caused 1-hour delay in formwork erection.",
    ],
  },
];

const INITIAL_PHOTOS: SitePhoto[] = [
  {
    id: "photo-1",
    title: "Floor 2 Beam & Slab Concrete Pour Inspection",
    category: "Structure",
    timestamp: "2026-09-07 11:30",
    uploadedBy: "Engr. Tayo (Site Eng)",
    url: "/images/site-pour.jpg",
  },
  {
    id: "photo-2",
    title: "Column C4 Rebar Spacing & Cover Block Placement",
    category: "Quality",
    timestamp: "2026-09-07 09:15",
    uploadedBy: "Architect David",
    url: "/images/rebar-check.jpg",
  },
  {
    id: "photo-3",
    title: "Sandcrete Blockwork Alignment Check Grid Line A",
    category: "Finishing",
    timestamp: "2026-09-06 15:40",
    uploadedBy: "Engr. Tayo (Site Eng)",
    url: "/images/blockwork.jpg",
  },
];

const INITIAL_INSPECTIONS: Inspection[] = [
  {
    id: "insp-1",
    title: "Pre-Pour Reinforcement & Formwork Sign-Off",
    element: "Floor 2 Slab Grid 1-6",
    inspector: "Consultant Structural Engr",
    date: "2026-09-07 08:00",
    status: "Passed",
    notes: "Bar diameters and lap lengths match structural engineering drawings.",
  },
  {
    id: "insp-2",
    title: "Column C4 Plinth Concrete Surface Quality",
    element: "Block B Plinth",
    inspector: "Architect David",
    date: "2026-09-06 14:30",
    status: "Failed",
    notes: "Identified honeycomb voiding due to inadequate poker vibrator compaction.",
  },
];

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

const INITIAL_SAFETY: SafetyObservation[] = [
  {
    id: "safe-1",
    type: "Good Practice",
    description: "Full edge protection scaffolding and safety netting installed on Floor 2 perimeter.",
    severity: "Low",
    location: "Perimeter Floor 2",
    reportedBy: "HSE Officer",
    timestamp: "2026-09-07 08:30",
    status: "Remediated",
  },
  {
    id: "safe-2",
    type: "Unsafe Act",
    description: "Two carpentry helpers observed working on scaffolding without chin-strapped hard hats.",
    severity: "Medium",
    location: "Block A Formwork Area",
    reportedBy: "Engr. Babatunde (PM)",
    timestamp: "2026-09-06 11:00",
    status: "Remediated",
  },
];

export function SiteDiaryView() {
  const { activeRole } = useApp();
  const [subTab, setSubTab] = useState<"diary" | "photos" | "inspections" | "snags" | "safety">("diary");

  const [logs, setLogs] = useState<DailyLog[]>(INITIAL_LOGS);
  const [photos, setPhotos] = useState<SitePhoto[]>(INITIAL_PHOTOS);
  const [inspections, setInspections] = useState<Inspection[]>(INITIAL_INSPECTIONS);
  const [snags, setSnags] = useState<SnagRecord[]>(SAMPLE_SNAGS);
  const [safetyLogs, setSafetyLogs] = useState<SafetyObservation[]>(INITIAL_SAFETY);

  // Modals
  const [isNewLogOpen, setIsNewLogOpen] = useState(false);
  const [isUploadPhotoOpen, setIsUploadPhotoOpen] = useState(false);
  const [isNewInspectionOpen, setIsNewInspectionOpen] = useState(false);
  const [isNewSafetyOpen, setIsNewSafetyOpen] = useState(false);
  const [isNewSnagOpen, setIsNewSnagOpen] = useState(false);

  // Form states
  const [logTitle, setLogTitle] = useState("");
  const [logWeather, setLogWeather] = useState("Sunny (31°C)");
  const [logWorkers, setLogWorkers] = useState<number>(45);
  const [logPoints, setLogPoints] = useState("");

  const [photoTitle, setPhotoTitle] = useState("");
  const [photoCategory, setPhotoCategory] = useState<SitePhoto["category"]>("Structure");

  const [inspTitle, setInspTitle] = useState("");
  const [inspElement, setInspElement] = useState("");
  const [inspStatus, setInspStatus] = useState<Inspection["status"]>("Passed");
  const [inspNotes, setInspNotes] = useState("");

  const [safetyType, setSafetyType] = useState<SafetyObservation["type"]>("Unsafe Act");
  const [safetyDesc, setSafetyDesc] = useState("");
  const [safetyLoc, setSafetyLoc] = useState("");
  const [safetySev, setSafetySev] = useState<SafetyObservation["severity"]>("Medium");

  const [snagTitle, setSnagTitle] = useState("");
  const [snagLocation, setSnagLocation] = useState("");
  const [snagSeverity, setSnagSeverity] = useState<SnagRecord["severity"]>("High");
  const [snagAssigned, setSnagAssigned] = useState("");

  // 1. Create New Day Entry (PRD #15)
  const handleCreateDailyLog = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: DailyLog = {
      id: `log-${Date.now()}`,
      logNumber: logs.length + 143,
      date: new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
      weather: logWeather,
      temperature: "30°C",
      delayHours: 0,
      workerHeadcount: logWorkers,
      title: logTitle,
      summary: logPoints.split("\n").filter((p) => p.trim().length > 0),
    };
    setLogs([newLog, ...logs]);
    setIsNewLogOpen(false);
    setLogTitle("");
    setLogPoints("");
  };

  // 2. Upload Photo (PRD #16)
  const handleUploadPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    const newPhoto: SitePhoto = {
      id: `photo-${Date.now()}`,
      title: photoTitle,
      category: photoCategory,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
      uploadedBy: activeRole,
      url: "/images/site-preview.jpg",
    };
    setPhotos([newPhoto, ...photos]);
    setIsUploadPhotoOpen(false);
    setPhotoTitle("");
  };

  // 3. Add Inspection (PRD #17)
  const handleCreateInspection = (e: React.FormEvent) => {
    e.preventDefault();
    const newInsp: Inspection = {
      id: `insp-${Date.now()}`,
      title: inspTitle,
      element: inspElement,
      inspector: activeRole,
      date: new Date().toISOString().replace("T", " ").substring(0, 16),
      status: inspStatus,
      notes: inspNotes,
    };
    setInspections([newInsp, ...inspections]);

    // If inspection failed, automatically prompt or raise a snag (PRD #17)
    if (inspStatus === "Failed") {
      const autoSnag: SnagRecord = {
        id: `snag-${Date.now()}`,
        title: `Defect from Inspection: ${inspTitle}`,
        location: inspElement,
        severity: "High",
        status: "Open",
        assignedTo: "Site Engineer",
        raisedBy: activeRole,
      };
      setSnags([autoSnag, ...snags]);
    }

    setIsNewInspectionOpen(false);
    setInspTitle("");
    setInspNotes("");
  };

  // 4. Add Safety Incident / Observation (PRD #18)
  const handleCreateSafetyLog = (e: React.FormEvent) => {
    e.preventDefault();
    const newSafety: SafetyObservation = {
      id: `safe-${Date.now()}`,
      type: safetyType,
      description: safetyDesc,
      severity: safetySev,
      location: safetyLoc,
      reportedBy: activeRole,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
      status: "Open",
    };
    setSafetyLogs([newSafety, ...safetyLogs]);
    setIsNewSafetyOpen(false);
    setSafetyDesc("");
    setSafetyLoc("");
  };

  // 5. Update Snag status
  const handleUpdateSnagStatus = (id: string, status: SnagRecord["status"]) => {
    setSnags((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
  };

  return (
    <div className="bg-white border-2 border-navy-800 shadow-brutal overflow-hidden space-y-4">
      {/* Sub-Navigation Header */}
      <div className="p-3 bg-navy-800 border-b-[3px] border-navy-800 flex items-center justify-between overflow-x-auto gap-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSubTab("diary")}
            className={`px-3 py-1.5 border-2 border-navy-800 text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              subTab === "diary"
                ? "bg-navy-800 text-white border border-navy-800 shadow-sm"
                : "text-navy-800/60 hover:text-navy-800"
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-500" />
            <span>5.1 Daily Diary</span>
          </button>

          <button
            onClick={() => setSubTab("photos")}
            className={`px-3 py-1.5 border-2 border-navy-800 text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              subTab === "photos"
                ? "bg-navy-800 text-white border border-navy-800 shadow-sm"
                : "text-navy-800/60 hover:text-navy-800"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
            <span>5.2 Photo Gallery</span>
          </button>

          <button
            onClick={() => setSubTab("inspections")}
            className={`px-3 py-1.5 border-2 border-navy-800 text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              subTab === "inspections"
                ? "bg-navy-800 text-white border border-navy-800 shadow-sm"
                : "text-navy-800/60 hover:text-navy-800"
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5 text-purple-400" />
            <span>5.3 Inspections</span>
          </button>

          <button
            onClick={() => setSubTab("snags")}
            className={`px-3 py-1.5 border-2 border-navy-800 text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              subTab === "snags"
                ? "bg-navy-800 text-white border border-navy-800 shadow-sm"
                : "text-navy-800/60 hover:text-navy-800"
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>5.4 Snags & NCRs</span>
            {snags.filter((s) => s.status !== "Closed").length > 0 && (
              <span className="text-xs bg-amber-950 text-amber-300 px-1.5 rounded-full font-mono">
                {snags.filter((s) => s.status !== "Closed").length}
              </span>
            )}
          </button>

          <button
            onClick={() => setSubTab("safety")}
            className={`px-3 py-1.5 border-2 border-navy-800 text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              subTab === "safety"
                ? "bg-navy-800 text-white border border-navy-800 shadow-sm"
                : "text-navy-800/60 hover:text-navy-800"
            }`}
          >
            <HardHat className="w-3.5 h-3.5 text-red-400" />
            <span>5.5 Safety Register</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: DAILY DIARY (PRD Item 15) */}
      {subTab === "diary" && (
        <div className="p-4 space-y-5">
          <div className="flex items-center justify-between border-b border-navy-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-navy-800 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-500" />
                <span>Cloud-Based Site Journal & Daily Shifts</span>
              </h3>
              <p className="text-xs text-navy-800/60 mt-0.5">
                Never lost on a stolen laptop: live weather stamps, muster headcount, and shift summaries (PRD Section 5.1).
              </p>
            </div>
            <button
              onClick={() => setIsNewLogOpen(true)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white border-2 border-navy-800 text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Daily Entry</span>
            </button>
          </div>

          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log.id} className="bg-cream-100 border border-navy-800 border-2 border-navy-800 p-4 space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-navy-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-emerald-500 font-bold">
                        LOG #{log.logNumber}
                      </span>
                      <span className="text-navy-800/40">·</span>
                      <span className="text-xs text-navy-800 font-semibold">{log.date}</span>
                    </div>
                    <h4 className="text-sm font-bold text-navy-800 mt-1">{log.title}</h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 bg-white border border-navy-800 border-2 border-navy-800 px-2.5 py-1 text-xs text-navy-800">
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span>{log.weather} ({log.delayHours} hr delay)</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white border border-navy-800 border-2 border-navy-800 px-2.5 py-1 text-xs text-navy-800">
                      <Users className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="font-bold text-navy-800 font-mono">{log.workerHeadcount} Workers</span>
                    </div>
                  </div>
                </div>

                <ul className="list-disc list-inside space-y-1 text-xs text-navy-800">
                  {log.summary.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 2: PHOTO GALLERY (PRD Item 16) */}
      {subTab === "photos" && (
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-navy-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-navy-800 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-blue-400" />
                <span>Site Progress Photo Documentation</span>
              </h3>
              <p className="text-xs text-navy-800/60 mt-0.5">
                Geo-stamped visual audit trail for quality assurance and executive reporting (PRD Section 5.2).
              </p>
            </div>
            <button
              onClick={() => setIsUploadPhotoOpen(true)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white border-2 border-navy-800 text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Photo</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {photos.map((p) => (
              <div key={p.id} className="bg-white border-2 border-navy-800 shadow-brutal overflow-hidden group">
                <div className="h-36 bg-cream-100 flex items-center justify-center border-b-2 border-navy-800 relative">
                  <Camera className="w-8 h-8 text-navy-800" />
                  <span className="absolute top-2 left-2 px-2 py-0.5 text-xs font-black bg-navy-800 text-white border-2 border-navy-800">
                    {p.category}
                  </span>
                </div>
                <div className="p-3 bg-white">
                  <h5 className="text-sm font-black text-navy-800 line-clamp-1">{p.title}</h5>
                  <p className="text-sm text-navy-800/60 mt-1">
                    Uploaded by {p.uploadedBy} · {p.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: INSPECTIONS (PRD Item 17) */}
      {subTab === "inspections" && (
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-navy-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-navy-800 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-purple-400" />
                <span>Quality & Pre-Pour Sign-Off Inspections</span>
              </h3>
              <p className="text-xs text-navy-800/60 mt-0.5">
                Defects in failed inspections automatically route directly into the Snag Register (PRD Section 5.3).
              </p>
            </div>
            <button
              onClick={() => setIsNewInspectionOpen(true)}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white border-2 border-navy-800 text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Inspection</span>
            </button>
          </div>

          <div className="divide-y divide-navy-800/10">
            {inspections.map((insp) => (
              <div key={insp.id} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-cream-100/20 px-2 border-2 border-navy-800 transition-colors">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-white text-xs">{insp.title}</span>
                    <span className="text-navy-800/40">·</span>
                    <span className="text-navy-800/60 text-xs">Element: <strong className="text-navy-800">{insp.element}</strong></span>
                  </div>
                  <p className="text-xs text-navy-800">{insp.notes}</p>
                  <p className="text-sm text-navy-800/40 mt-1">
                    Inspector: {insp.inspector} · {insp.date}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded text-xs font-bold border ${
                    insp.status === "Passed"
                      ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                      : "bg-red-950 text-red-300 border-red-800"
                  }`}>
                    {insp.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 4: SNAGS & NCR REGISTER */}
      {subTab === "snags" && (
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-navy-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-navy-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>Defects, Snags & Non-Conformance Reports (NCR)</span>
              </h3>
              <p className="text-xs text-navy-800/60 mt-0.5">
                Visual remediation workflow from discovery to contractor sign-off.
              </p>
            </div>
          </div>

          <div className="divide-y divide-navy-800/10">
            {snags.map((snag) => (
              <div key={snag.id} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-cream-100/20 px-2 border-2 border-navy-800 transition-colors">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold border ${
                      snag.severity === "Critical"
                        ? "bg-red-950 text-red-300 border-red-800"
                        : snag.severity === "High"
                        ? "bg-amber-950 text-amber-300 border-amber-800"
                        : "bg-cream-100 text-navy-800 border-navy-800"
                    }`}>
                      {snag.severity}
                    </span>
                    <span className="font-semibold text-white text-xs">{snag.title}</span>
                  </div>
                  <div className="text-xs text-navy-800/60">
                    Location: <strong className="text-navy-800">{snag.location}</strong> · Assigned: <strong className="text-navy-800">{snag.assignedTo}</strong> · Raised by: {snag.raisedBy}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={snag.status}
                    onChange={(e) => handleUpdateSnagStatus(snag.id, e.target.value as SnagRecord["status"])}
                    className="bg-cream-100 border border-navy-800 rounded px-2 py-1 text-xs text-navy-800 focus:outline-none"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Remediated">Remediated</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 5: SAFETY (PRD Item 18) */}
      {subTab === "safety" && (
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-navy-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-navy-800 flex items-center gap-2">
                <HardHat className="w-4 h-4 text-red-400" />
                <span>Site Safety Observations & Lost-Time Incidents</span>
              </h3>
              <p className="text-xs text-navy-800/60 mt-0.5">
                Log near-misses, PPE compliance, and zero lost-time streak tracking (PRD Section 5.5).
              </p>
            </div>
            <button
              onClick={() => setIsNewSafetyOpen(true)}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white border-2 border-navy-800 text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Observation / Incident</span>
            </button>
          </div>

          <div className="divide-y divide-navy-800/10">
            {safetyLogs.map((s) => (
              <div key={s.id} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-cream-100/20 px-2 border-2 border-navy-800 transition-colors">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold border ${
                      s.type === "Incident"
                        ? "bg-red-950 text-red-300 border-red-800"
                        : s.type === "Unsafe Act"
                        ? "bg-amber-950 text-amber-300 border-amber-800"
                        : "bg-emerald-950 text-emerald-300 border-emerald-800"
                    }`}>
                      {s.type}
                    </span>
                    <span className="font-semibold text-white text-xs">{s.description}</span>
                  </div>
                  <div className="text-xs text-navy-800/60">
                    Location: <strong className="text-navy-800">{s.location}</strong> · Reported by: {s.reportedBy} · {s.timestamp}
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded bg-cream-100 text-navy-800 text-xs font-semibold">
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: New Daily Entry (PRD #15) */}
      {isNewLogOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-navy-800 border-navy-800 max-w-md w-full p-4 shadow-2xl">
            <h3 className="text-sm font-bold text-navy-800">Create New Site Daily Log Entry</h3>
            <form onSubmit={handleCreateDailyLog} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs text-navy-800 mb-1">Log Title / Shift Focus</label>
                <input
                  type="text"
                  required
                  value={logTitle}
                  onChange={(e) => setLogTitle(e.target.value)}
                  placeholder="e.g. Ground Floor Raft Slab Concrete Pouring"
                  className="w-full bg-cream-100 border border-navy-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-navy-800 mb-1">Weather Condition</label>
                  <input
                    type="text"
                    required
                    value={logWeather}
                    onChange={(e) => setLogWeather(e.target.value)}
                    className="w-full bg-cream-100 border border-navy-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-navy-800 mb-1">Worker Headcount</label>
                  <input
                    type="number"
                    required
                    value={logWorkers}
                    onChange={(e) => setLogWorkers(Number(e.target.value))}
                    className="w-full bg-cream-100 border border-navy-800 rounded px-3 py-1.5 text-xs text-navy-800 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-navy-800 mb-1">Work Accomplished (1 point per line)</label>
                <textarea
                  rows={4}
                  required
                  value={logPoints}
                  onChange={(e) => setLogPoints(e.target.value)}
                  placeholder="Cast 60m3 of grade 30 concrete...&#10;Erected 120m2 formwork..."
                  className="w-full bg-cream-100 border border-navy-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewLogOpen(false)}
                  className="px-3 py-1.5 bg-cream-100 text-navy-800 rounded text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold"
                >
                  Publish Daily Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Upload Photo (PRD #16) */}
      {isUploadPhotoOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-navy-800 border-navy-800 max-w-md w-full p-4 shadow-2xl">
            <h3 className="text-sm font-bold text-navy-800">Upload Site Progress Photo</h3>
            <form onSubmit={handleUploadPhoto} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs text-navy-800 mb-1">Photo Description / Milestone</label>
                <input
                  type="text"
                  required
                  value={photoTitle}
                  onChange={(e) => setPhotoTitle(e.target.value)}
                  placeholder="e.g. Completed shear wall reinforcement"
                  className="w-full bg-cream-100 border border-navy-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs text-navy-800 mb-1">Category</label>
                <select
                  value={photoCategory}
                  onChange={(e) => setPhotoCategory(e.target.value as SitePhoto["category"])}
                  className="w-full bg-cream-100 border border-navy-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Structure">Structure</option>
                  <option value="Finishing">Finishing</option>
                  <option value="Quality">Quality</option>
                  <option value="Safety">Safety</option>
                </select>
              </div>

              <div className="p-4 border-2 border-dashed border-navy-800 border-2 border-navy-800 text-center bg-cream-100">
                <Upload className="w-8 h-8 text-navy-800/40 mx-auto mb-2" />
                <p className="text-xs text-navy-800 font-medium">Click or drag photo file here</p>
                <p className="text-sm text-navy-800/40 mt-1">PNG, JPG, HEIC up to 10MB</p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadPhotoOpen(false)}
                  className="px-3 py-1.5 bg-cream-100 text-navy-800 rounded text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold"
                >
                  Save Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Inspection (PRD #17) */}
      {isNewInspectionOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-navy-800 border-navy-800 max-w-md w-full p-4 shadow-2xl">
            <h3 className="text-sm font-bold text-navy-800">Record Site Inspection</h3>
            <form onSubmit={handleCreateInspection} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs text-navy-800 mb-1">Inspection Scope</label>
                <input
                  type="text"
                  required
                  value={inspTitle}
                  onChange={(e) => setInspTitle(e.target.value)}
                  placeholder="e.g. Plinth beam rebar spacing verification"
                  className="w-full bg-cream-100 border border-navy-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-navy-800 mb-1">Element / Location</label>
                  <input
                    type="text"
                    required
                    value={inspElement}
                    onChange={(e) => setInspElement(e.target.value)}
                    placeholder="e.g. Block B Floor 1"
                    className="w-full bg-cream-100 border border-navy-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-navy-800 mb-1">Result Status</label>
                  <select
                    value={inspStatus}
                    onChange={(e) => setInspStatus(e.target.value as Inspection["status"])}
                    className="w-full bg-cream-100 border border-navy-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Passed">Passed</option>
                    <option value="Failed">Failed (Auto-raises Snag)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-navy-800 mb-1">Inspector Notes</label>
                <textarea
                  rows={3}
                  required
                  value={inspNotes}
                  onChange={(e) => setInspNotes(e.target.value)}
                  placeholder="Notes on tolerance, surface quality, bar spacing..."
                  className="w-full bg-cream-100 border border-navy-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewInspectionOpen(false)}
                  className="px-3 py-1.5 bg-cream-100 text-navy-800 rounded text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded text-xs font-semibold"
                >
                  Save Inspection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Safety Observation (PRD #18) */}
      {isNewSafetyOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-navy-800 border-navy-800 max-w-md w-full p-4 shadow-2xl">
            <h3 className="text-sm font-bold text-navy-800">Log Safety Observation / Incident</h3>
            <form onSubmit={handleCreateSafetyLog} className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-navy-800 mb-1">Observation Type</label>
                  <select
                    value={safetyType}
                    onChange={(e) => setSafetyType(e.target.value as SafetyObservation["type"])}
                    className="w-full bg-cream-100 border border-navy-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="Unsafe Act">Unsafe Act</option>
                    <option value="Near Miss">Near Miss</option>
                    <option value="Good Practice">Good Practice</option>
                    <option value="Incident">Incident</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-navy-800 mb-1">Severity</label>
                  <select
                    value={safetySev}
                    onChange={(e) => setSafetySev(e.target.value as SafetyObservation["severity"])}
                    className="w-full bg-cream-100 border border-navy-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-navy-800 mb-1">Observation Description</label>
                <textarea
                  rows={3}
                  required
                  value={safetyDesc}
                  onChange={(e) => setSafetyDesc(e.target.value)}
                  placeholder="Detail the safety hazard or proactive measure observed..."
                  className="w-full bg-cream-100 border border-navy-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs text-navy-800 mb-1">Specific Location</label>
                <input
                  type="text"
                  required
                  value={safetyLoc}
                  onChange={(e) => setSafetyLoc(e.target.value)}
                  placeholder="e.g. Scaffolding elevation north side"
                  className="w-full bg-cream-100 border border-navy-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewSafetyOpen(false)}
                  className="px-3 py-1.5 bg-cream-100 text-navy-800 rounded text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-semibold"
                >
                  Record Safety Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
