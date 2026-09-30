"use client";

import React, { useState, useEffect, useRef } from "react";
import { useApp } from "@/app/providers";
import { createClient } from "@/lib/supabase/client";
import { uploadToStorage } from "@/lib/storage/client";
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
  Loader2,
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

const INITIAL_LOGS: DailyLog[] = [];
const INITIAL_PHOTOS: SitePhoto[] = [];
const INITIAL_INSPECTIONS: Inspection[] = [];
const SAMPLE_SNAGS: SnagRecord[] = [];
const INITIAL_SAFETY: SafetyObservation[] = [];

export function SiteDiaryView({
  initialSubTab = "diary",
  onTabChange,
}: {
  initialSubTab?: "diary" | "photos" | "inspections" | "snags" | "safety";
  onTabChange?: (tab: "diary" | "photos" | "inspections" | "snags" | "safety") => void;
} = {}) {
  const { activeRole, currentProject, availableProjects } = useApp();
  const [subTab, setSubTab] = useState<"diary" | "photos" | "inspections" | "snags" | "safety">(initialSubTab);

  useEffect(() => {
    if (initialSubTab) {
      setSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  const handleSubTabClick = (tab: "diary" | "photos" | "inspections" | "snags" | "safety") => {
    setSubTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  const [logs, setLogs] = useState<DailyLog[]>(INITIAL_LOGS);
  const [photos, setPhotos] = useState<SitePhoto[]>(INITIAL_PHOTOS);
  const [inspections, setInspections] = useState<Inspection[]>(INITIAL_INSPECTIONS);
  const [snags, setSnags] = useState<SnagRecord[]>(SAMPLE_SNAGS);
  const [safetyLogs, setSafetyLogs] = useState<SafetyObservation[]>(INITIAL_SAFETY);

  // Load live site operations and snags from Supabase
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const supabase = createClient();
        let diaryQuery = supabase
          .from("site_diaries")
          .select("*")
          .order("log_date", { ascending: false });
        if (currentProject?.id) {
          diaryQuery = diaryQuery.eq("project_id", currentProject.id);
        }
        const { data: diaryData } = await diaryQuery;

        if (isMounted) {
          if (diaryData && diaryData.length > 0) {
            const mappedLogs: DailyLog[] = diaryData.map((d: any, idx: number) => ({
              id: d.id,
              logNumber: diaryData.length - idx,
              date: new Date(d.log_date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
              weather: d.weather_condition || "Sunny",
              temperature: d.temperature || "31°C",
              delayHours: Number(d.delay_hours || 0),
              workerHeadcount: Number(d.total_headcount || 48),
              title: d.title || "Superstructure Concrete Pour & Execution Shift",
              summary: d.work_summary ? d.work_summary.split("\n").filter((p: string) => p.trim().length > 0) : [],
            }));
            setLogs(mappedLogs);
          } else {
            setLogs([]);
          }
        }

        // Fetch site photos from both site_diaries and site_posts
        let postQuery = supabase
          .from("site_posts")
          .select("id, author_name, media_urls, created_at, content, metadata")
          .order("created_at", { ascending: false });
        if (currentProject?.id) {
          postQuery = postQuery.eq("project_id", currentProject.id);
        }
        const { data: postsData } = await postQuery;

        if (isMounted) {
          const combinedPhotos: SitePhoto[] = [];
          if (diaryData) {
            diaryData.forEach((d: any) => {
              if (Array.isArray(d.photos)) {
                d.photos.forEach((p: any, pIdx: number) => {
                  if (p?.url) {
                    combinedPhotos.push({
                      id: `photo-diary-${d.id}-${pIdx}`,
                      title: p.title || "Site Progress Record",
                      category: (p.category as any) || "Structure",
                      timestamp: p.timestamp || d.log_date,
                      uploadedBy: "Site Engineer",
                      url: p.url,
                    });
                  }
                });
              }
            });
          }

          if (postsData) {
            postsData.forEach((p: any) => {
              if (Array.isArray(p.media_urls)) {
                p.media_urls.forEach((url: string, uIdx: number) => {
                  if (url) {
                    combinedPhotos.push({
                      id: `photo-post-${p.id}-${uIdx}`,
                      title: p.metadata?.title || p.content?.slice(0, 36) || "Site Photo",
                      category: (p.metadata?.category as any) || "Structure",
                      timestamp: new Date(p.created_at).toISOString().replace("T", " ").substring(0, 16),
                      uploadedBy: p.author_name || "Team Member",
                      url,
                    });
                  }
                });
              }
            });
          }
          setPhotos(combinedPhotos);
        }

        let snagQuery = supabase
          .from("snags_and_ncrs")
          .select("*")
          .order("created_at", { ascending: false });
        if (currentProject?.id) {
          snagQuery = snagQuery.eq("project_id", currentProject.id);
        }
        const { data: snagData } = await snagQuery;
        if (isMounted) {
          if (snagData && snagData.length > 0) {
            const mappedSnags: SnagRecord[] = snagData.map((s: any) => ({
              id: s.id,
              title: s.title,
              location: s.location || "Site Area",
              severity: (s.severity as any) || "Medium",
              status: (s.status as any) || "Open",
              assignedTo: "Engr. Tayo (Site Eng)",
              raisedBy: "Mrs. Nkechi (QS)",
            }));
            setSnags(mappedSnags);
          } else {
            setSnags([]);
          }
        }
      } catch (err) {
        console.warn("Failed to load site diary from Supabase", err);
      }
    })();
    return () => { isMounted = false; };
  }, [currentProject?.id]);

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
  const [isSubmittingLog, setIsSubmittingLog] = useState(false);

  const [photoTitle, setPhotoTitle] = useState("");
  const [photoCategory, setPhotoCategory] = useState<SitePhoto["category"]>("Structure");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoUploadError, setPhotoUploadError] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

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
  const [isSubmittingSnag, setIsSubmittingSnag] = useState(false);

  // 1. Create New Day Entry (PRD #15)
  const handleCreateDailyLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!logTitle.trim()) return;

    let targetProjectId = currentProject?.id || availableProjects?.[0]?.id;
    if (!targetProjectId) {
      const supabase = createClient();
      const { data: proj } = await supabase.from("projects").select("id").limit(1).maybeSingle();
      targetProjectId = proj?.id;
    }
    if (!targetProjectId) {
      alert("No active project found. Please select or create a project first.");
      return;
    }

    setIsSubmittingLog(true);
    try {
      const supabase = createClient();
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData?.user?.id || null;

      const payload = {
        project_id: targetProjectId,
        title: logTitle.trim(),
        log_date: new Date().toISOString().split("T")[0],
        weather_condition: logWeather,
        temperature: "30°C",
        delay_hours: 0,
        work_summary: logPoints.trim() || logTitle.trim(),
        total_headcount: Number(logWorkers) || 0,
        logged_by: userId,
        photos: [],
      };

      const { data, error } = await supabase
        .from("site_diaries")
        .insert(payload)
        .select()
        .single();

      if (!error && data) {
        const newLog: DailyLog = {
          id: data.id,
          logNumber: logs.length + 1,
          date: new Date(data.log_date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
          weather: data.weather_condition,
          temperature: data.temperature || "30°C",
          delayHours: Number(data.delay_hours || 0),
          workerHeadcount: Number(data.total_headcount || 0),
          title: data.title || logTitle,
          summary: data.work_summary ? data.work_summary.split("\n").filter((p: string) => p.trim().length > 0) : [],
        };
        setLogs([newLog, ...logs]);
      } else {
        console.error("Failed to insert site diary:", error);
      }
    } catch (err) {
      console.error("Error creating site diary:", err);
    } finally {
      setIsSubmittingLog(false);
      setIsNewLogOpen(false);
      setLogTitle("");
      setLogPoints("");
    }
  };

  // 2. Upload Photo (PRD #16)
  const handleUploadPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    let targetProjectId = currentProject?.id || availableProjects?.[0]?.id;
    if (!targetProjectId) {
      const supabase = createClient();
      const { data: proj } = await supabase.from("projects").select("id").limit(1).maybeSingle();
      targetProjectId = proj?.id;
    }
    if (!targetProjectId) {
      alert("No active project found.");
      return;
    }

    setIsUploadingPhoto(true);
    setPhotoUploadError(null);

    let photoUrl = "/images/site-preview.jpg";
    if (photoFile) {
      const uploadRes = await uploadToStorage(photoFile, "pictures");
      if (uploadRes.error) {
        setPhotoUploadError(uploadRes.error);
        setIsUploadingPhoto(false);
        return;
      }
      if (uploadRes.url) {
        photoUrl = uploadRes.url;
      }
    }

    const timestamp = new Date().toISOString().replace("T", " ").substring(0, 16);
    const newPhotoItem: SitePhoto = {
      id: `photo-${Date.now()}`,
      title: photoTitle || "Site Progress Record",
      category: photoCategory,
      timestamp,
      uploadedBy: activeRole,
      url: photoUrl,
    };

    try {
      const supabase = createClient();
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData?.user?.id || null;

      // Persist to site_posts with media_urls so it appears in both Site Diary and Site Hub feed/photos
      await supabase.from("site_posts").insert({
        project_id: targetProjectId,
        author_id: userId,
        author_name: authData?.user?.user_metadata?.full_name || activeRole,
        author_role: activeRole,
        content: `[Photo Upload] ${photoTitle || "Site Progress Record"} (${photoCategory})`,
        post_type: "progress",
        media_urls: [photoUrl],
        metadata: { category: photoCategory, title: photoTitle },
      });

      // Also attach to today's site diary in site_diaries
      const today = new Date().toISOString().split("T")[0];
      const { data: existingDiary } = await supabase
        .from("site_diaries")
        .select("id, photos")
        .eq("project_id", targetProjectId)
        .eq("log_date", today)
        .maybeSingle();

      if (existingDiary) {
        const currentPhotos = Array.isArray(existingDiary.photos) ? existingDiary.photos : [];
        await supabase
          .from("site_diaries")
          .update({
            photos: [...currentPhotos, { title: photoTitle, category: photoCategory, url: photoUrl, timestamp }],
          })
          .eq("id", existingDiary.id);
      } else {
        await supabase.from("site_diaries").insert({
          project_id: targetProjectId,
          log_date: today,
          title: photoTitle || "Site Photo Documentation",
          weather_condition: "Sunny",
          delay_hours: 0,
          work_summary: `Progress photo uploaded: ${photoTitle}`,
          total_headcount: 0,
          logged_by: userId,
          photos: [{ title: photoTitle, category: photoCategory, url: photoUrl, timestamp }],
        });
      }

      setPhotos((prev) => [newPhotoItem, ...prev]);
      setIsUploadPhotoOpen(false);
      setPhotoTitle("");
      setPhotoFile(null);
    } catch (err: any) {
      console.error("Error uploading photo:", err);
      setPhotoUploadError(err?.message || "Failed to persist photo");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // 3. Add Inspection (PRD #17)
  const handleCreateInspection = async (e: React.FormEvent) => {
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

    // If inspection failed, automatically prompt or raise a snag in Supabase
    if (inspStatus === "Failed") {
      let targetProjectId = currentProject?.id || availableProjects?.[0]?.id;
      if (!targetProjectId) {
        const supabase = createClient();
        const { data: proj } = await supabase.from("projects").select("id").limit(1).maybeSingle();
        targetProjectId = proj?.id;
      }
      if (targetProjectId) {
        try {
          const supabase = createClient();
          const { data: authData } = await supabase.auth.getUser();
          const { data: createdSnag } = await supabase
            .from("snags_and_ncrs")
            .insert({
              project_id: targetProjectId,
              title: `Defect from Inspection: ${inspTitle}`,
              description: inspNotes || `Failed inspection for ${inspElement}`,
              location: inspElement || "Site Area",
              severity: "High",
              status: "Open",
              raised_by: authData?.user?.id || null,
            })
            .select()
            .single();

          if (createdSnag) {
            setSnags((prev) => [
              {
                id: createdSnag.id,
                title: createdSnag.title,
                location: createdSnag.location,
                severity: createdSnag.severity,
                status: createdSnag.status,
                assignedTo: "Site Engineer",
                raisedBy: activeRole,
              },
              ...prev,
            ]);
          }
        } catch (err) {
          console.error("Failed to auto-raise snag from failed inspection:", err);
        }
      }
    }

    setIsNewInspectionOpen(false);
    setInspTitle("");
    setInspNotes("");
    setInspElement("");
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

  // 5. Flag Quality Snag (PRD #17)
  const handleCreateSnag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!snagTitle.trim()) return;

    let targetProjectId = currentProject?.id || availableProjects?.[0]?.id;
    if (!targetProjectId) {
      const supabase = createClient();
      const { data: proj } = await supabase.from("projects").select("id").limit(1).maybeSingle();
      targetProjectId = proj?.id;
    }
    if (!targetProjectId) {
      alert("No active project found.");
      return;
    }

    setIsSubmittingSnag(true);
    try {
      const supabase = createClient();
      const { data: authData } = await supabase.auth.getUser();
      const { data: createdSnag, error } = await supabase
        .from("snags_and_ncrs")
        .insert({
          project_id: targetProjectId,
          title: snagTitle.trim(),
          description: snagTitle.trim(),
          location: snagLocation.trim() || "Site Area",
          severity: snagSeverity,
          status: "Open",
          raised_by: authData?.user?.id || null,
        })
        .select()
        .single();

      if (!error && createdSnag) {
        setSnags((prev) => [
          {
            id: createdSnag.id,
            title: createdSnag.title,
            location: createdSnag.location,
            severity: createdSnag.severity,
            status: createdSnag.status,
            assignedTo: snagAssigned || "Site Engineer",
            raisedBy: activeRole,
          },
          ...prev,
        ]);
      }
    } catch (err) {
      console.error("Failed to create snag:", err);
    } finally {
      setIsSubmittingSnag(false);
      setIsNewSnagOpen(false);
      setSnagTitle("");
      setSnagLocation("");
      setSnagAssigned("");
    }
  };

  // 6. Update Snag status in Supabase
  const handleUpdateSnagStatus = async (id: string, status: SnagRecord["status"]) => {
    setSnags((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
    try {
      const supabase = createClient();
      await supabase
        .from("snags_and_ncrs")
        .update({
          status,
          resolved_at: status === "Closed" || status === "Remediated" ? new Date().toISOString() : null,
        })
        .eq("id", id);
    } catch (err) {
      console.error("Failed to update snag status in DB:", err);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-xl shadow-xs rounded-xl overflow-hidden space-y-4">

      {/* SUBTAB 1: DAILY DIARY (PRD Item 15) */}
      {subTab === "diary" && (
        <div className="p-4 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-500" />
                <span>Cloud-Based Site Journal & Daily Shifts</span>
              </h3>
              <p className="text-xs text-slate-900/60 mt-0.5">
                Never lost on a stolen laptop: live weather stamps, muster headcount, and shift summaries (PRD Section 5.1).
              </p>
            </div>
            <button
              onClick={() => setIsNewLogOpen(true)}
              className="px-3.5 py-1.5 bg-[#0067c0] hover:bg-[#005ba1] text-white rounded-md text-xs font-semibold uppercase tracking-wider shadow-xs rounded-xl transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Daily Entry</span>
            </button>
          </div>

          {logs.length === 0 ? (
            <div className="bg-white border-2 border-[#E5E5DE] rounded-2xl p-10 text-center">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-800">No daily site logs recorded yet</h4>
              <p className="text-xs text-slate-500 mt-1">Record weather conditions, workforce attendance, and shift milestones.</p>
              <button
                onClick={() => setIsNewLogOpen(true)}
                className="mt-4 px-4 py-2 bg-[#0A2540] text-white text-xs font-black rounded-xl hover:opacity-90 cursor-pointer shadow-sm"
              >
                + New Daily Entry
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
              <div key={log.id} className="bg-white border border-slate-200/80 border border-slate-200/80 p-4 space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-emerald-500 font-bold">
                        LOG #{log.logNumber}
                      </span>
                      <span className="text-slate-900/40">·</span>
                      <span className="text-xs text-slate-900 font-semibold">{log.date}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{log.title}</h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 bg-white border border-slate-200/80 border border-slate-200/80 px-2.5 py-1 text-xs text-slate-900">
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span>{log.weather} ({log.delayHours} hr delay)</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white border border-slate-200/80 border border-slate-200/80 px-2.5 py-1 text-xs text-slate-900">
                      <Users className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="font-bold text-slate-900 font-mono">{log.workerHeadcount} Workers</span>
                    </div>
                  </div>
                </div>

                <ul className="list-disc list-inside space-y-1 text-xs text-slate-900">
                  {log.summary.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
      )}

      {/* SUBTAB 2: PHOTO GALLERY (PRD Item 16) */}
      {subTab === "photos" && (
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-blue-400" />
                <span>Site Progress Photo Documentation</span>
              </h3>
              <p className="text-xs text-slate-900/60 mt-0.5">
                Geo-stamped visual audit trail for quality assurance and executive reporting (PRD Section 5.2).
              </p>
            </div>
            <button
              onClick={() => setIsUploadPhotoOpen(true)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white border border-slate-200/80 text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Photo</span>
            </button>
          </div>

          {photos.length === 0 ? (
            <div className="bg-white border-2 border-[#E5E5DE] rounded-2xl p-10 text-center">
              <Camera className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-800">No progress photos uploaded yet</h4>
              <p className="text-xs text-slate-500 mt-1">Attach geo-stamped site inspection and progress photos for verification.</p>
              <button
                onClick={() => setIsUploadPhotoOpen(true)}
                className="mt-4 px-4 py-2 bg-[#0A2540] text-white text-xs font-black rounded-xl hover:opacity-90 cursor-pointer shadow-sm"
              >
                + Upload Photo
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {photos.map((p) => (
                <div key={p.id} className="bg-white border border-slate-200/80 shadow-card overflow-hidden group">
                  <div className="h-44 bg-slate-100 flex items-center justify-center border-b border-slate-200/80 relative overflow-hidden">
                    {p.url && !p.url.includes("site-preview.jpg") && !p.url.includes("site-pour.jpg") ? (
                      <img
                        src={p.url}
                        alt={p.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-1 text-slate-400">
                        <Camera className="w-8 h-8" />
                        <span className="text-[10px] font-mono">Image Record</span>
                      </div>
                    )}
                    <span className="absolute top-2 left-2 px-2 py-0.5 text-xs font-bold bg-slate-900/80 backdrop-blur-xs text-white rounded">
                      {p.category}
                    </span>
                  </div>
                  <div className="p-3 bg-white">
                    <h5 className="text-sm font-bold text-slate-900 line-clamp-1">{p.title}</h5>
                    <p className="text-xs text-slate-900/60 mt-1">
                      Uploaded by {p.uploadedBy} · {p.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 3: INSPECTIONS (PRD Item 17) */}
      {subTab === "inspections" && (
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-purple-400" />
                <span>Quality & Pre-Pour Sign-Off Inspections</span>
              </h3>
              <p className="text-xs text-slate-900/60 mt-0.5">
                Defects in failed inspections automatically route directly into the Snag Register (PRD Section 5.3).
              </p>
            </div>
            <button
              onClick={() => setIsNewInspectionOpen(true)}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white border border-slate-200/80 text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Inspection</span>
            </button>
          </div>

          {inspections.length === 0 ? (
            <div className="bg-white border-2 border-[#E5E5DE] rounded-2xl p-10 text-center">
              <FileCheck2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-800">No QA/QC inspections logged</h4>
              <p className="text-xs text-slate-500 mt-1">Record concrete pre-pour sign-offs, rebar checks, and MEP inspections.</p>
              <button
                onClick={() => setIsNewInspectionOpen(true)}
                className="mt-4 px-4 py-2 bg-[#0A2540] text-white text-xs font-black rounded-xl hover:opacity-90 cursor-pointer shadow-sm"
              >
                + Add Inspection
              </button>
            </div>
          ) : (
            <div className="divide-y divide-navy-800/10">
              {inspections.map((insp) => (
                <div key={insp.id} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-white/20 px-2 border border-slate-200/80 transition-colors">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-slate-900 text-xs">{insp.title}</span>
                      <span className="text-slate-900/40">·</span>
                      <span className="text-slate-900/60 text-xs">Element: <strong className="text-slate-900">{insp.element}</strong></span>
                    </div>
                    <p className="text-xs text-slate-900">{insp.notes}</p>
                    <p className="text-xs text-slate-900/60 mt-1">
                      Inspector: {insp.inspector} · {insp.date}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 text-xs font-bold border border-slate-200/80 ${
                      insp.status === "Passed"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {insp.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 4: SNAGS & NCR REGISTER */}
      {subTab === "snags" && (
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <span>Defects, Snags & Non-Conformance Reports (NCR)</span>
              </h3>
              <p className="text-xs text-slate-900/60 mt-0.5">
                Visual remediation workflow from discovery to contractor sign-off.
              </p>
            </div>
            <button
              onClick={() => setIsNewSnagOpen(true)}
              className="px-3.5 py-1.5 bg-[#0A2540] hover:bg-[#003366] text-white rounded-md text-xs font-semibold uppercase tracking-wider shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Flag Quality Snag</span>
            </button>
          </div>

          {snags.length === 0 ? (
            <div className="bg-white border-2 border-[#E5E5DE] rounded-2xl p-10 text-center">
              <AlertTriangle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-800">No open snags flagged</h4>
              <p className="text-xs text-slate-500 mt-1">Quality defects, remedial actions, and punch list items will appear here.</p>
              <button
                onClick={() => setIsNewSnagOpen(true)}
                className="mt-4 px-4 py-2 bg-[#0A2540] text-white text-xs font-black rounded-xl hover:opacity-90 cursor-pointer shadow-sm"
              >
                + Flag Quality Snag
              </button>
            </div>
          ) : (
            <div className="divide-y divide-navy-800/10">
              {snags.map((snag) => (
                <div key={snag.id} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-white/20 px-2 border border-slate-200/80 transition-colors">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 text-xs font-bold border border-slate-200/80 ${
                        snag.severity === "Critical"
                          ? "bg-red-100 text-red-800"
                          : snag.severity === "High"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-white text-slate-900"
                      }`}>
                        {snag.severity}
                      </span>
                      <span className="font-semibold text-slate-900 text-xs">{snag.title}</span>
                    </div>
                    <div className="text-xs text-slate-900/60">
                      Location: <strong className="text-slate-900">{snag.location}</strong> · Assigned: <strong className="text-slate-900">{snag.assignedTo}</strong> · Raised by: {snag.raisedBy}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={snag.status}
                      onChange={(e) => handleUpdateSnagStatus(snag.id, e.target.value as SnagRecord["status"])}
                      className="bg-white border border-slate-200/80 px-2 py-1 text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-navy-800"
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
          )}
        </div>
      )}

      {/* SUBTAB 5: SAFETY (PRD Item 18) */}
      {subTab === "safety" && (
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <HardHat className="w-4 h-4 text-red-500" />
                <span>Site Safety Observations & Lost-Time Incidents</span>
              </h3>
              <p className="text-xs text-slate-900/60 mt-0.5">
                Log near-misses, PPE compliance, and zero lost-time streak tracking (PRD Section 5.5).
              </p>
            </div>
            <button
              onClick={() => setIsNewSafetyOpen(true)}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white border border-slate-200/80 text-xs font-semibold shadow-xs rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Observation / Incident</span>
            </button>
          </div>

          {safetyLogs.length === 0 ? (
            <div className="bg-white border-2 border-[#E5E5DE] rounded-2xl p-10 text-center">
              <ShieldAlert className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-800">No HSE safety observations logged</h4>
              <p className="text-xs text-slate-500 mt-1">Track near misses, safety toolbox talks, and preventative actions.</p>
              <button
                onClick={() => setIsNewSafetyOpen(true)}
                className="mt-4 px-4 py-2 bg-[#0A2540] text-white text-xs font-black rounded-xl hover:opacity-90 cursor-pointer shadow-sm"
              >
                + Log Observation / Incident
              </button>
            </div>
          ) : (
            <div className="divide-y divide-navy-800/10">
              {safetyLogs.map((s) => (
                <div key={s.id} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-white/20 px-2 border border-slate-200/80 transition-colors">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 text-xs font-bold border border-slate-200/80 ${
                        s.type === "Incident"
                          ? "bg-red-100 text-red-800"
                          : s.type === "Unsafe Act"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}>
                        {s.type}
                      </span>
                      <span className="font-semibold text-slate-900 text-xs">{s.description}</span>
                    </div>
                    <div className="text-xs text-slate-900/60">
                      Location: <strong className="text-slate-900">{s.location}</strong> · Reported by: {s.reportedBy} · {s.timestamp}
                    </div>
                  </div>

                  <span className="px-2.5 py-1 bg-white border border-slate-200/80 text-slate-900 text-xs font-semibold">
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal: New Daily Entry (PRD #15) */}
      {isNewLogOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200/80 max-w-md w-full p-6 shadow-card">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Create New Site Daily Log Entry</h3>
            <form onSubmit={handleCreateDailyLog} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">Log Title / Shift Focus</label>
                <input
                  type="text"
                  required
                  value={logTitle}
                  onChange={(e) => setLogTitle(e.target.value)}
                  placeholder="e.g. Ground Floor Raft Slab Concrete Pouring"
                  className="w-full bg-white border border-slate-200/80 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">Weather Condition</label>
                  <input
                    type="text"
                    required
                    value={logWeather}
                    onChange={(e) => setLogWeather(e.target.value)}
                    className="w-full bg-white border border-slate-200/80 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">Worker Headcount</label>
                  <input
                    type="number"
                    required
                    value={logWorkers}
                    onChange={(e) => setLogWorkers(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200/80 px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-navy-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">Work Accomplished (1 point per line)</label>
                <textarea
                  rows={4}
                  required
                  value={logPoints}
                  onChange={(e) => setLogPoints(e.target.value)}
                  placeholder="Cast 60m3 of grade 30 concrete...&#10;Erected 120m2 formwork..."
                  className="w-full bg-white border border-slate-200/80 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-800"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewLogOpen(false)}
                  className="px-3 py-1.5 bg-white hover:bg-[#f5f5f5] border border-slate-200/80 text-slate-900 text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white border border-slate-200/80 shadow-xs rounded-xl text-xs font-bold transition-transform active:translate-x-0.5 active:translate-y-0.5"
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
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200/80 max-w-md w-full p-6 shadow-card">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Upload Site Progress Photo</h3>
            <form onSubmit={handleUploadPhoto} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">Photo Description / Milestone</label>
                <input
                  type="text"
                  required
                  value={photoTitle}
                  onChange={(e) => setPhotoTitle(e.target.value)}
                  placeholder="e.g. Completed shear wall reinforcement"
                  className="w-full bg-white border border-slate-200/80 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">Category</label>
                <select
                  value={photoCategory}
                  onChange={(e) => setPhotoCategory(e.target.value as SitePhoto["category"])}
                  className="w-full bg-white border border-slate-200/80 px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-navy-800"
                >
                  <option value="Structure">Structure</option>
                  <option value="Finishing">Finishing</option>
                  <option value="Quality">Quality</option>
                  <option value="Safety">Safety</option>
                </select>
              </div>

              <div
                onClick={() => photoInputRef.current?.click()}
                className="p-4 border border-dashed border-slate-200/80 text-center bg-white shadow-xs rounded-xl cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setPhotoFile(f);
                  }}
                  className="hidden"
                />
                <Upload className="w-8 h-8 text-slate-900/40 mx-auto mb-2" />
                <p className="text-xs text-slate-900 font-bold">
                  {photoFile ? photoFile.name : "Click or drag photo file here"}
                </p>
                <p className="text-xs text-slate-900/60 mt-1">
                  {photoFile ? `${(photoFile.size / 1024).toFixed(0)} KB ready to upload` : "PNG, JPG, HEIC up to 10MB"}
                </p>
              </div>

              {photoUploadError && (
                <div className="p-2 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded">
                  {photoUploadError}
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  disabled={isUploadingPhoto}
                  onClick={() => {
                    setIsUploadPhotoOpen(false);
                    setPhotoFile(null);
                    setPhotoUploadError(null);
                  }}
                  className="px-3 py-1.5 bg-white hover:bg-[#f5f5f5] border border-slate-200/80 text-slate-900 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingPhoto}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white border border-slate-200/80 shadow-xs rounded-xl text-xs font-bold transition-transform active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isUploadingPhoto && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isUploadingPhoto ? "Uploading..." : "Save Photo"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Inspection (PRD #17) */}
      {isNewInspectionOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200/80 max-w-md w-full p-6 shadow-card">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Record Site Inspection</h3>
            <form onSubmit={handleCreateInspection} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">Inspection Scope</label>
                <input
                  type="text"
                  required
                  value={inspTitle}
                  onChange={(e) => setInspTitle(e.target.value)}
                  placeholder="e.g. Plinth beam rebar spacing verification"
                  className="w-full bg-white border border-slate-200/80 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">Element / Location</label>
                  <input
                    type="text"
                    required
                    value={inspElement}
                    onChange={(e) => setInspElement(e.target.value)}
                    placeholder="e.g. Block B Floor 1"
                    className="w-full bg-white border border-slate-200/80 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">Result Status</label>
                  <select
                    value={inspStatus}
                    onChange={(e) => setInspStatus(e.target.value as Inspection["status"])}
                    className="w-full bg-white border border-slate-200/80 px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-navy-800"
                  >
                    <option value="Passed">Passed</option>
                    <option value="Failed">Failed (Auto-raises Snag)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">Inspector Notes</label>
                <textarea
                  rows={3}
                  required
                  value={inspNotes}
                  onChange={(e) => setInspNotes(e.target.value)}
                  placeholder="Notes on tolerance, surface quality, bar spacing..."
                  className="w-full bg-white border border-slate-200/80 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-800"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewInspectionOpen(false)}
                  className="px-3 py-1.5 bg-white hover:bg-[#f5f5f5] border border-slate-200/80 text-slate-900 text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white border border-slate-200/80 shadow-xs rounded-xl text-xs font-bold transition-transform active:translate-x-0.5 active:translate-y-0.5"
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
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200/80 max-w-md w-full p-6 shadow-card">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Log Safety Observation / Incident</h3>
            <form onSubmit={handleCreateSafetyLog} className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">Observation Type</label>
                  <select
                    value={safetyType}
                    onChange={(e) => setSafetyType(e.target.value as SafetyObservation["type"])}
                    className="w-full bg-white border border-slate-200/80 px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-navy-800"
                  >
                    <option value="Unsafe Act">Unsafe Act</option>
                    <option value="Near Miss">Near Miss</option>
                    <option value="Good Practice">Good Practice</option>
                    <option value="Incident">Incident</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">Severity</label>
                  <select
                    value={safetySev}
                    onChange={(e) => setSafetySev(e.target.value as SafetyObservation["severity"])}
                    className="w-full bg-white border border-slate-200/80 px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-navy-800"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">Observation Description</label>
                <textarea
                  rows={3}
                  required
                  value={safetyDesc}
                  onChange={(e) => setSafetyDesc(e.target.value)}
                  placeholder="Detail the safety hazard or proactive measure observed..."
                  className="w-full bg-white border border-slate-200/80 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">Specific Location</label>
                <input
                  type="text"
                  required
                  value={safetyLoc}
                  onChange={(e) => setSafetyLoc(e.target.value)}
                  placeholder="e.g. Scaffolding elevation north side"
                  className="w-full bg-white border border-slate-200/80 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-800"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewSafetyOpen(false)}
                  className="px-3 py-1.5 bg-white hover:bg-[#f5f5f5] border border-slate-200/80 text-slate-900 text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white border border-slate-200/80 shadow-xs rounded-xl text-xs font-bold transition-transform active:translate-x-0.5 active:translate-y-0.5"
                >
                  Record Safety Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Flag Quality Snag (PRD #17) */}
      {isNewSnagOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200/80 max-w-md w-full p-6 shadow-card">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Flag Defect or Snag Item</h3>
            <form onSubmit={handleCreateSnag} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">Defect Title / Item</label>
                <input
                  type="text"
                  required
                  value={snagTitle}
                  onChange={(e) => setSnagTitle(e.target.value)}
                  placeholder="e.g. Honeycombing on Column C4 after formwork striking"
                  className="w-full bg-white border border-slate-200/80 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={snagLocation}
                    onChange={(e) => setSnagLocation(e.target.value)}
                    placeholder="e.g. Grid 4-B First Floor"
                    className="w-full bg-white border border-slate-200/80 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">Severity</label>
                  <select
                    value={snagSeverity}
                    onChange={(e) => setSnagSeverity(e.target.value as SnagRecord["severity"])}
                    className="w-full bg-white border border-slate-200/80 px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-navy-800"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">Assigned Remediation Team</label>
                <input
                  type="text"
                  value={snagAssigned}
                  onChange={(e) => setSnagAssigned(e.target.value)}
                  placeholder="e.g. Concrete Subcontractor / Engr Tayo"
                  className="w-full bg-white border border-slate-200/80 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-800"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  disabled={isSubmittingSnag}
                  onClick={() => setIsNewSnagOpen(false)}
                  className="px-3 py-1.5 bg-white hover:bg-[#f5f5f5] border border-slate-200/80 text-slate-900 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingSnag}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white border border-slate-200/80 shadow-xs rounded-xl text-xs font-bold transition-transform active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingSnag && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isSubmittingSnag ? "Saving..." : "Save Snag"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
