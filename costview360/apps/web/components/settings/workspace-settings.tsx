"use client";

import React, { useState, useEffect, useRef } from "react";
import { useApp } from "@/app/providers";
import { createClient } from "@/lib/supabase/client";
import {
  Settings,
  Building2,
  MapPin,
  Hash,
  DollarSign,
  Clock,
  Bell,
  CheckCircle2,
  Cloud,
  UploadCloud,
  File,
  Image as ImageIcon,
  FileText,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  FolderOpen,
} from "lucide-react";
import {
  uploadToStorage,
  listStorageFiles,
  deleteStorageFile,
  StorageFolder,
  StorageFileItem,
  STORAGE_BUCKET,
} from "@/lib/storage/client";

export function WorkspaceSettingsView() {
  const {
    currency,
    setCurrency,
    activeRole,
    currentProject,
    setCurrentProject,
  } = useApp();

  // User-inputted Project Details (editable, not pre-configured)
  const [projectName, setProjectName] = useState(currentProject?.name || "");
  const [projectCode, setProjectCode] = useState(currentProject?.code || "");
  const [projectLocation, setProjectLocation] = useState(currentProject?.location || "");
  const [projectBudget, setProjectBudget] = useState<string | number>(
    currentProject?.budgetTotal || 0
  );

  // Sync state if currentProject changes
  useEffect(() => {
    if (currentProject) {
      setProjectName(currentProject.name || "");
      setProjectCode(currentProject.code || "");
      setProjectLocation(currentProject.location || "");
      setProjectBudget(currentProject.budgetTotal || 0);
    }
  }, [currentProject]);

  const [timezone, setTimezone] = useState("Africa/Lagos");
  const [notifications, setNotifications] = useState(true);
  const [discrepancyAlerts, setDiscrepancyAlerts] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Storage Vault State
  const [activeFolder, setActiveFolder] = useState<StorageFolder>("pictures");
  const [files, setFiles] = useState<StorageFileItem[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchFiles = async (folder: StorageFolder) => {
    setLoadingFiles(true);
    setUploadError(null);
    const { files: loadedFiles, error } = await listStorageFiles(folder);
    if (!error) {
      setFiles(loadedFiles);
    }
    setLoadingFiles(false);
  };

  useEffect(() => {
    fetchFiles(activeFolder);
  }, [activeFolder]);

  const handleSaveProject = async () => {
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const supabase = createClient();
      const budgetNum = Number(projectBudget) || 0;

      // Update in Supabase
      if (currentProject?.id) {
        const { error } = await supabase
          .from("projects")
          .update({
            name: projectName.trim(),
            code: projectCode.trim().toUpperCase(),
            location: projectLocation.trim(),
            budget_total: budgetNum,
          })
          .eq("id", currentProject.id);

        if (error) throw error;
      }

      // Update context in app
      const updated = {
        ...currentProject,
        name: projectName.trim(),
        code: projectCode.trim().toUpperCase(),
        location: projectLocation.trim(),
        budgetTotal: budgetNum,
      };

      if (setCurrentProject) setCurrentProject(updated);

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setSaveError(err?.message || "Failed to update project details.");
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setUploading(true);
    setUploadError(null);

    const { url, error } = await uploadToStorage(selectedFile, activeFolder);
    if (error) {
      setUploadError(error);
    } else if (url) {
      await fetchFiles(activeFolder);
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = async (filePath: string) => {
    const { error } = await deleteStorageFile(filePath);
    if (!error) {
      setFiles((prev) => prev.filter((f) => `${f.folder}/${f.name}` !== filePath));
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  return (
    <div className="space-y-4">
      {/* Compact Header Banner */}
      <div className="bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0A2540] dark:bg-[#1E3A8A] text-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 bg-[#0A2540] dark:bg-amber-400 text-white dark:text-[#0A2540] rounded">
                Workspace Settings
              </span>
              <span className="text-xs font-semibold text-[#0A2540]/60 dark:text-slate-400">
                · Role: <strong className="text-[#0A2540] dark:text-amber-300">{activeRole}</strong>
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-black text-[#0A2540] dark:text-white tracking-tight mt-0.5">
              Project Parameters &amp; Media Vault
            </h1>
          </div>
        </div>

        <button
          onClick={handleSaveProject}
          disabled={saving}
          className="h-10 px-5 bg-[#0A2540] hover:bg-[#003366] dark:bg-amber-400 dark:hover:bg-amber-300 text-white dark:text-[#0A2540] rounded-xl font-black text-xs uppercase tracking-wider shadow-sm transition-all active:scale-[0.98] cursor-pointer flex items-center gap-2 justify-center shrink-0 disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
          <span>{saving ? "Saving..." : "Save Project Details"}</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-300 dark:border-emerald-600 rounded-xl text-xs font-extrabold text-emerald-900 dark:text-emerald-200 flex items-center gap-2 shadow-xs animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Project details and preferences saved to database successfully.</span>
        </div>
      )}

      {saveError && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-300 dark:border-rose-600 rounded-xl text-xs font-extrabold text-rose-900 dark:text-rose-200 flex items-center gap-2 shadow-xs">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      {/* Main Settings Grids */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-5">
        {/* Left Column: Project & Financial Configuration (User-Inputted) */}
        <div className="bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b-2 border-[#E5E5DE] dark:border-white/10">
            <Building2 className="w-4 h-4 text-[#0A2540] dark:text-amber-400" />
            <h2 className="text-xs sm:text-sm font-black text-[#0A2540] dark:text-white uppercase tracking-wider">
              Project Specification &amp; Location
            </h2>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-[#0A2540]/80 dark:text-slate-200 mb-1">
                Project Name
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g. Horizon Towers Residential Complex"
                className="w-full h-10 bg-[#FAF9F5] dark:bg-[#071324] border-2 border-[#E5E5DE] dark:border-white/10 rounded-xl px-3 text-xs sm:text-sm font-bold text-[#0A2540] dark:text-white focus:outline-none focus:border-[#0A2540]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-[#0A2540]/80 dark:text-slate-200 mb-1">
                  Project Code
                </label>
                <input
                  type="text"
                  value={projectCode}
                  onChange={(e) => setProjectCode(e.target.value)}
                  placeholder="e.g. HT-01"
                  className="w-full h-10 bg-[#FAF9F5] dark:bg-[#071324] border-2 border-[#E5E5DE] dark:border-white/10 rounded-xl px-3 text-xs sm:text-sm font-mono font-black text-[#0A2540] dark:text-white focus:outline-none focus:border-[#0A2540]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-[#0A2540]/80 dark:text-slate-200 mb-1">
                  Site Location
                </label>
                <input
                  type="text"
                  value={projectLocation}
                  onChange={(e) => setProjectLocation(e.target.value)}
                  placeholder="e.g. Victoria Island, Lagos"
                  className="w-full h-10 bg-[#FAF9F5] dark:bg-[#071324] border-2 border-[#E5E5DE] dark:border-white/10 rounded-xl px-3 text-xs sm:text-sm font-semibold text-[#0A2540] dark:text-white focus:outline-none focus:border-[#0A2540]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-[#0A2540]/80 dark:text-slate-200 mb-1">
                Contract Budget Baseline ({currency})
              </label>
              <input
                type="number"
                value={projectBudget}
                onChange={(e) => setProjectBudget(e.target.value)}
                placeholder="0"
                className="w-full h-10 bg-[#FAF9F5] dark:bg-[#071324] border-2 border-[#E5E5DE] dark:border-white/10 rounded-xl px-3 text-xs sm:text-sm font-mono font-black text-[#0A2540] dark:text-white focus:outline-none focus:border-[#0A2540]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-[#0A2540]/80 dark:text-slate-200 mb-1">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full h-10 bg-[#FAF9F5] dark:bg-[#071324] border-2 border-[#E5E5DE] dark:border-white/10 rounded-xl px-3 text-xs sm:text-sm font-bold text-[#0A2540] dark:text-white focus:outline-none cursor-pointer"
                >
                  <option value="NGN">₦ NGN (Naira)</option>
                  <option value="USD">$ USD (Dollar)</option>
                  <option value="GBP">£ GBP (Pound)</option>
                  <option value="EUR">€ EUR (Euro)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-[#0A2540]/80 dark:text-slate-200 mb-1">
                  Timezone
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full h-10 bg-[#FAF9F5] dark:bg-[#071324] border-2 border-[#E5E5DE] dark:border-white/10 rounded-xl px-3 text-xs sm:text-sm font-bold text-[#0A2540] dark:text-white focus:outline-none cursor-pointer"
                >
                  <option value="Africa/Lagos">Lagos (WAT, UTC+1)</option>
                  <option value="Africa/Accra">Accra (GMT, UTC+0)</option>
                  <option value="Europe/London">London (UTC+1)</option>
                  <option value="UTC">UTC Standard</option>
                </select>
              </div>
            </div>

            {/* Notification Toggles */}
            <div className="space-y-2 pt-2 border-t border-[#E5E5DE] dark:border-white/10">
              <div className="flex items-center justify-between p-2.5 bg-[#FAF9F5] dark:bg-[#071324] border border-[#E5E5DE] dark:border-white/10 rounded-xl">
                <div>
                  <div className="text-xs font-bold text-[#0A2540] dark:text-white">Budget Drift Attention Alerts</div>
                  <div className="text-[10px] text-[#0A2540]/60 dark:text-slate-400 font-medium">
                    Trigger flags when item commitment exceeds ±5% threshold
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifications(!notifications)}
                  className={`w-10 h-6 rounded-full border flex items-center px-0.5 transition-colors cursor-pointer ${
                    notifications ? "bg-[#0A2540] dark:bg-amber-400 justify-end" : "bg-slate-300 dark:bg-slate-700 justify-start"
                  }`}
                >
                  <span className="w-4 h-4 bg-white dark:bg-[#0A2540] rounded-full shadow-xs" />
                </button>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[#FAF9F5] dark:bg-[#071324] border border-[#E5E5DE] dark:border-white/10 rounded-xl">
                <div>
                  <div className="text-xs font-bold text-[#0A2540] dark:text-white">Three-Way Match Lock Notifications</div>
                  <div className="text-[10px] text-[#0A2540]/60 dark:text-slate-400 font-medium">
                    Lock invoices when quantity or rate exceeds physical delivery
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDiscrepancyAlerts(!discrepancyAlerts)}
                  className={`w-10 h-6 rounded-full border flex items-center px-0.5 transition-colors cursor-pointer ${
                    discrepancyAlerts ? "bg-[#0A2540] dark:bg-amber-400 justify-end" : "bg-slate-300 dark:bg-slate-700 justify-start"
                  }`}
                >
                  <span className="w-4 h-4 bg-white dark:bg-[#0A2540] rounded-full shadow-xs" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Storage Bucket & Media Vault (Replaces Theme & Telemetry) */}
        <div className="bg-white dark:bg-[#0D2137] border-2 border-[#E5E5DE] dark:border-white/10 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b-2 border-[#E5E5DE] dark:border-white/10">
            <div className="flex items-center gap-2">
              <Cloud className="w-4 h-4 text-[#0A2540] dark:text-amber-400" />
              <h2 className="text-xs sm:text-sm font-black text-[#0A2540] dark:text-white uppercase tracking-wider">
                Storage Bucket: {STORAGE_BUCKET}
              </h2>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Connected
            </span>
          </div>

          {/* Folder Category Selector */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "pictures", label: "Pictures", icon: ImageIcon, desc: "Site Photos" },
              { id: "drawings", label: "Drawings", icon: FileText, desc: "CAD & BIM" },
              { id: "documents", label: "Documents", icon: File, desc: "Contracts / POs" },
            ].map((cat) => {
              const Icon = cat.icon;
              const isActive = activeFolder === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveFolder(cat.id as StorageFolder)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#0A2540] text-white border-[#0A2540] shadow-xs dark:bg-amber-400 dark:text-[#0A2540] dark:border-amber-400"
                      : "bg-[#FAF9F5] dark:bg-[#071324] border-[#E5E5DE] dark:border-white/10 text-[#0A2540] dark:text-white hover:bg-slate-100 dark:hover:bg-[#0F2137]"
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-black">
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.label}</span>
                  </div>
                  <div className={`text-[10px] font-semibold mt-0.5 ${isActive ? "opacity-90" : "text-[#0A2540]/60 dark:text-slate-400"}`}>
                    {cat.desc}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Upload Dropzone */}
          <div className="border-2 border-dashed border-[#E5E5DE] dark:border-white/20 rounded-xl p-4 bg-[#FAF9F5] dark:bg-[#071324] text-center space-y-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept={
                activeFolder === "pictures"
                  ? "image/*"
                  : activeFolder === "drawings"
                  ? ".pdf,.dwg,.dxf,image/*"
                  : ".pdf,.csv,.xlsx,.doc,.docx"
              }
            />
            <div className="w-8 h-8 mx-auto bg-white dark:bg-[#0A1931] border border-[#E5E5DE] dark:border-white/10 rounded-lg flex items-center justify-center text-[#0A2540] dark:text-amber-400 shadow-xs">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-black text-[#0A2540] dark:text-white">
                Upload to <span className="font-mono text-emerald-700 dark:text-emerald-400">{activeFolder}/</span>
              </div>
              <p className="text-[10px] font-semibold text-[#0A2540]/60 dark:text-slate-400 mt-0.5">
                {activeFolder === "pictures" && "PNG, JPG, WEBP, GIF up to 50MB"}
                {activeFolder === "drawings" && "PDF, DWG, DXF architectural & structural drawings"}
                {activeFolder === "documents" && "PDF, CSV, Excel, contracts & delivery notes"}
              </p>
            </div>
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="h-8 px-4 bg-[#0A2540] hover:bg-[#003366] dark:bg-amber-400 dark:hover:bg-amber-300 text-white dark:text-[#0A2540] rounded-lg font-black text-[11px] uppercase tracking-wider transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              {uploading ? "Uploading..." : `Choose ${activeFolder.slice(0, -1)} file`}
            </button>
          </div>

          {uploadError && (
            <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 text-rose-800 dark:text-rose-300 rounded-lg text-xs font-bold">
              {uploadError}
            </div>
          )}

          {/* File Vault List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-[#0A2540]/70 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <FolderOpen className="w-3.5 h-3.5" /> Recent {activeFolder} ({files.length})
              </span>
              <button
                type="button"
                onClick={() => fetchFiles(activeFolder)}
                className="hover:underline flex items-center gap-1 text-[10px] cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${loadingFiles ? "animate-spin" : ""}`} /> Refresh
              </button>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-1.5 divide-y divide-[#E5E5DE]/40">
              {loadingFiles ? (
                <div className="p-4 text-center text-xs text-[#0A2540]/50 font-bold">Loading storage files...</div>
              ) : files.length === 0 ? (
                <div className="p-4 text-center bg-[#FAF9F5] dark:bg-[#071324] border border-[#E5E5DE] dark:border-white/10 rounded-xl">
                  <p className="text-xs font-bold text-[#0A2540]/60 dark:text-slate-400">No {activeFolder} uploaded yet</p>
                  <p className="text-[10px] text-[#0A2540]/50 dark:text-slate-500 mt-0.5">
                    Uploaded files will appear here with direct public URLs
                  </p>
                </div>
              ) : (
                files.map((file) => (
                  <div
                    key={file.name}
                    className="pt-1.5 flex items-center justify-between gap-2 p-2 bg-[#FAF9F5] dark:bg-[#071324] border border-[#E5E5DE] dark:border-white/10 rounded-lg hover:border-[#0A2540] dark:hover:border-amber-400 transition-all text-xs"
                  >
                    <div className="min-w-0 flex items-center gap-2">
                      <File className="w-3.5 h-3.5 text-[#0A2540]/60 dark:text-amber-400 shrink-0" />
                      <div className="truncate">
                        <div className="font-bold text-[#0A2540] dark:text-white truncate max-w-[160px] sm:max-w-[200px]" title={file.name}>
                          {file.name}
                        </div>
                        <div className="text-[10px] text-[#0A2540]/50 dark:text-slate-400">
                          {formatFileSize(file.size)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => copyToClipboard(file.url)}
                        title="Copy Public URL"
                        className="p-1.5 rounded bg-white dark:bg-[#0D2137] border border-[#E5E5DE] dark:border-white/10 text-[#0A2540] dark:text-white hover:bg-slate-50 cursor-pointer"
                      >
                        {copiedUrl === file.url ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      </button>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noreferrer"
                        title="Open file in new tab"
                        className="p-1.5 rounded bg-white dark:bg-[#0D2137] border border-[#E5E5DE] dark:border-white/10 text-[#0A2540] dark:text-white hover:bg-slate-50"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <button
                        type="button"
                        onClick={() => handleDelete(`${file.folder}/${file.name}`)}
                        title="Delete file"
                        className="p-1.5 rounded bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
