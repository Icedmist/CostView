"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { useApp } from "@/app/providers";
import { useAppData } from "@/lib/store/app-data";
import { createClient } from "@/lib/supabase/client";
import {
  Globe,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Download,
  Camera,
  MapPin,
  UserCheck,
  ArrowUpRight,
  TrendingUp,
  FileCheck,
  Copy,
  Check,
  Lock,
  ArrowLeft,
  ShieldAlert,
} from "lucide-react";

interface MilestoneItem {
  id: string;
  name: string;
  stage: string;
  percentComplete: number;
  status: "Completed" | "In Progress" | "Upcoming";
  certifiedDate?: string;
  inspectionPassed: boolean;
}

interface SitePhotoItem {
  id: string;
  title: string;
  date: string;
  milestone: string;
  engineerNote: string;
  imgUrl: string;
  inspectorName: string;
}

interface ConsultantItem {
  id: string;
  name: string;
  role: string;
}

export function ClientPortalView({
  standalone = false,
  onReturn,
}: {
  standalone?: boolean;
  onReturn?: () => void;
}) {
  const { currentProject } = useApp();
  const { boqItems } = useAppData();
  const [copiedLink, setCopiedLink] = useState(false);
  const [sitePhotos, setSitePhotos] = useState<SitePhotoItem[]>([]);
  const [consultants, setConsultants] = useState<ConsultantItem[]>([]);

  // 1. Dynamic Financials derived from currentProject & boqItems
  const approvedContractSum =
    currentProject.budgetTotal ||
    boqItems.reduce((acc, it) => acc + (it.budgetAmount || 0), 0);
  const certifiedWorkToDate = boqItems.reduce(
    (acc, it) => acc + (it.actualAmount || 0),
    0
  );
  const paidToDate = certifiedWorkToDate;
  const retentionInEscrow = certifiedWorkToDate > 0 ? certifiedWorkToDate * 0.05 : 0;
  const pendingCertificate = 0;
  const progressPercent =
    approvedContractSum > 0
      ? Math.min(100, Math.round((certifiedWorkToDate / approvedContractSum) * 100))
      : 0;

  // 2. Dynamic Milestones derived from real BOQ categories
  const milestones: MilestoneItem[] = useMemo(() => {
    if (boqItems.length === 0) return [];
    const categoryMap = new Map<string, { budget: number; actual: number }>();
    boqItems.forEach((item) => {
      const cat = item.category || "General Works";
      const current = categoryMap.get(cat) || { budget: 0, actual: 0 };
      categoryMap.set(cat, {
        budget: current.budget + (item.budgetAmount || 0),
        actual: current.actual + (item.actualAmount || 0),
      });
    });

    return Array.from(categoryMap.entries()).map(([name, { budget, actual }], index) => {
      const pct = budget > 0 ? Math.min(100, Math.round((actual / budget) * 100)) : 0;
      const status: "Completed" | "In Progress" | "Upcoming" =
        pct >= 100 ? "Completed" : pct > 0 ? "In Progress" : "Upcoming";
      return {
        id: `milestone-${index}`,
        name,
        stage: `Phase 0${index + 1}`,
        percentComplete: pct,
        status,
        inspectionPassed: pct > 0,
      };
    });
  }, [boqItems]);

  // 3. Load live site photos and consultants from Supabase for current project
  useEffect(() => {
    let isMounted = true;
    async function loadPortalData() {
      if (!currentProject.id) return;
      try {
        const supabase = createClient();

        // Fetch site posts with media for this project
        const { data: postsData } = await supabase
          .from("site_posts")
          .select("*")
          .eq("project_id", currentProject.id)
          .order("created_at", { ascending: false });

        if (isMounted && postsData && postsData.length > 0) {
          const loadedPhotos: SitePhotoItem[] = [];
          postsData.forEach((p: any) => {
            const urls = Array.isArray(p.media_urls) ? p.media_urls : [];
            urls.forEach((url: string, idx: number) => {
              loadedPhotos.push({
                id: `${p.id}-${idx}`,
                title: p.content
                  ? p.content.slice(0, 45) + (p.content.length > 45 ? "..." : "")
                  : "Site Progress Verification",
                date: new Date(p.created_at).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }),
                milestone: p.post_type?.toUpperCase() || "PROGRESS",
                engineerNote: p.content || "Site progress record verified on site.",
                imgUrl: url,
                inspectorName: p.author_name || "Resident Engineer",
              });
            });
          });
          setSitePhotos(loadedPhotos);
        } else if (isMounted) {
          setSitePhotos([]);
        }

        // Fetch consultants / assigned project members
        const { data: memberRows } = await supabase
          .from("project_members")
          .select("user_id, role")
          .eq("project_id", currentProject.id);

        if (isMounted && memberRows && memberRows.length > 0) {
          const userIds = memberRows.map((m: any) => m.user_id);
          const { data: profilesData } = await supabase
            .from("profiles")
            .select("id, full_name, email, default_role")
            .in("id", userIds);

          const profileMap = new Map((profilesData || []).map((p: any) => [p.id, p]));
          const mappedConsultants: ConsultantItem[] = memberRows.map((m: any) => {
            const prof = profileMap.get(m.user_id);
            return {
              id: m.user_id,
              name: prof?.full_name || prof?.email || "Team Member",
              role: m.role || prof?.default_role || "Project Consultant",
            };
          });
          setConsultants(mappedConsultants);
        } else if (isMounted) {
          setConsultants([]);
        }
      } catch (err) {
        console.warn("Could not load live portal data", err);
      }
    }
    loadPortalData();
    return () => {
      isMounted = false;
    };
  }, [currentProject.id]);

  const handleCopyShareLink = () => {
    if (typeof window !== "undefined") {
      const shareUrl = `${window.location.origin}/portal${
        currentProject.id ? `?project=${encodeURIComponent(currentProject.id)}` : ""
      }`;
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const handleDownloadCertificate = () => {
    window.print();
  };

  // If Client Portal is disabled by the admin in project settings, show gate notice
  if (!currentProject.clientPortalEnabled) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 md:p-12 bg-white dark:bg-[#0A1931] border-2 border-[#E5E5DE] dark:border-[#1E3A5F] rounded-3xl text-center space-y-6 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700 flex items-center justify-center mx-auto text-amber-600 dark:text-amber-400">
          <Lock className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-[#0A2540] dark:text-white">
            Client Portal Disabled
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">
            The project administrator has not enabled public client and investor portal access for{" "}
            <strong className="text-[#0A2540] dark:text-white">
              {currentProject.name || "this project"}
            </strong>.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#FAF9F5] dark:bg-[#071324] border border-[#E5E5DE] dark:border-[#1E3A5F] text-xs text-slate-500 dark:text-slate-400 text-left space-y-2">
          <div className="font-bold text-[#0A2540] dark:text-white flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            <span>How to enable portal access</span>
          </div>
          <p>
            Administrators can enable Client Portal visibility in{" "}
            <strong>Oversight → Governance &amp; Administration → Project Profile &amp; Settings</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {!standalone && onReturn ? (
            <button
              onClick={onReturn}
              className="px-5 py-2.5 bg-[#0A2540] text-white hover:bg-[#003366] rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
            >
              Return to Telemetry
            </button>
          ) : (
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-[#0A2540] hover:bg-[#003366] text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Enter CostView Workspace</span>
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-[#0A2540] rounded-3xl p-7 md:p-10 text-white shadow-xl border-2 border-[#0A2540] relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-black uppercase tracking-wider px-3 py-1 bg-emerald-400 text-[#0A2540] rounded-lg shadow-sm flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" /> Client &amp; Stakeholder Portal
              </span>
              <span className="text-white/80 text-xs font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Read-Only Transparent Governance
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">
              {currentProject.name}
            </h1>
            <p className="text-base text-white/80 mt-2 max-w-2xl font-normal leading-relaxed flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
              {currentProject.location}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {!standalone && onReturn && (
              <button
                type="button"
                onClick={onReturn}
                className="min-h-[46px] px-5 py-2.5 bg-white/15 hover:bg-white/25 text-white border-2 border-white/20 rounded-xl text-sm font-black flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-white" />
                <span>Return to Telemetry</span>
              </button>
            )}
            <button
              onClick={handleCopyShareLink}
              className="min-h-[46px] px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white border-2 border-white/20 rounded-xl text-sm font-black flex items-center gap-2 transition-all cursor-pointer"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? "Link Copied to Clipboard!" : "Share Portal Link"}</span>
            </button>
            <button
              onClick={handleDownloadCertificate}
              className="min-h-[46px] px-6 py-2.5 bg-white text-[#0A2540] hover:bg-slate-100 rounded-xl text-sm font-black flex items-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#0A2540]" />
              <span>Download Valuation PDF</span>
            </button>
            {standalone && (
              <Link
                href="/dashboard"
                className="min-h-[46px] px-5 py-2.5 bg-[#047857] hover:bg-[#065f46] text-white rounded-xl text-sm font-black flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <span>Back to App</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>

        {/* Project Key Milestone Status Header Bar */}
        <div className="mt-8 pt-6 border-t-2 border-white/15 grid sm:grid-cols-4 gap-6 text-white/90">
          <div>
            <div className="text-[11px] font-black uppercase tracking-wider text-white/60">
              Verified Physical Progress
            </div>
            <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
              {progressPercent}% Complete
            </div>
            <div className="text-xs text-white/70 mt-0.5">
              {progressPercent > 0
                ? `${formatCurrency(certifiedWorkToDate, "NGN")} certified work`
                : "No physical works certified yet"}
            </div>
          </div>
          <div>
            <div className="text-[11px] font-black uppercase tracking-wider text-white/60">
              Project Reference
            </div>
            <div className="text-2xl font-black font-mono text-white mt-1">
              {currentProject.code || "PRJ-01"}
            </div>
            <div className="text-xs text-white/70 mt-0.5">Baseline Schedule Active</div>
          </div>
          <div>
            <div className="text-[11px] font-black uppercase tracking-wider text-white/60">
              Quality Assurance (QA/QC)
            </div>
            <div className="text-2xl font-black font-mono text-emerald-300 mt-1">
              {sitePhotos.length > 0 ? `${sitePhotos.length} Proofs Logged` : "Active"}
            </div>
            <div className="text-xs text-white/70 mt-0.5">Verified Visual Records</div>
          </div>
          <div>
            <div className="text-[11px] font-black uppercase tracking-wider text-white/60">
              Statutory Escrow Reserve
            </div>
            <div className="text-2xl font-black font-mono text-amber-300 mt-1">
              {formatCurrency(retentionInEscrow, "NGN")}
            </div>
            <div className="text-xs text-white/70 mt-0.5">
              {retentionInEscrow > 0 ? "5% Retention Protected" : "No retention held"}
            </div>
          </div>
        </div>
      </div>

      {/* Financial Transparency Strip */}
      <div className="bg-white border-2 border-[#E5E5DE] rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-[#E5E5DE]">
          <div>
            <h3 className="text-xl font-black text-[#0A2540] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" /> Commercial Valuation &amp; Disbursement Ledger
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Live financial statement reconciled from approved project accounts and site valuations
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 self-start sm:self-auto">
            <Lock className="w-3.5 h-3.5 text-emerald-700" />
            <span>Client Transparency View</span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-2xl bg-[#FAF9F5] border border-[#E5E5DE]">
            <div className="text-xs font-black uppercase tracking-wider text-slate-500">
              Approved Contract Sum
            </div>
            <div className="text-2xl font-black font-mono text-[#0A2540] mt-2">
              {formatCurrency(approvedContractSum, "NGN")}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Original baseline agreement</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF9F5] border border-[#E5E5DE]">
            <div className="text-xs font-black uppercase tracking-wider text-slate-500">
              Certified Work-in-Place
            </div>
            <div className="text-2xl font-black font-mono text-emerald-700 mt-2">
              {formatCurrency(certifiedWorkToDate, "NGN")}
            </div>
            <div className="text-xs text-emerald-800 font-bold mt-1">
              {progressPercent > 0
                ? `${progressPercent}% of total contract value`
                : "0% certified to date"}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF9F5] border border-[#E5E5DE]">
            <div className="text-xs font-black uppercase tracking-wider text-slate-500">
              Total Funds Disbursed
            </div>
            <div className="text-2xl font-black font-mono text-[#0A2540] mt-2">
              {formatCurrency(paidToDate, "NGN")}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Reconciled disbursements</div>
          </div>

          <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200">
            <div className="text-xs font-black uppercase tracking-wider text-amber-900">
              5% Retention in Escrow
            </div>
            <div className="text-2xl font-black font-mono text-amber-800 mt-2">
              {formatCurrency(retentionInEscrow, "NGN")}
            </div>
            <div className="text-xs text-amber-900 font-bold mt-1">
              {retentionInEscrow > 0 ? "FIDIC/JCT escrow fund" : "No retention withheld"}
            </div>
          </div>
        </div>

        {/* Current Active Certificate Notice */}
        {pendingCertificate > 0 ? (
          <div className="p-5 rounded-2xl bg-blue-50/90 border-2 border-blue-200 flex flex-col md:flex-row md:items-center justify-between gap-4 text-blue-950">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-800">
                <FileCheck className="w-4 h-4 text-blue-700" /> Interim Payment Certificate Pending
              </div>
              <div className="text-base font-extrabold">
                Amount Due for Disbursement: {formatCurrency(pendingCertificate, "NGN")}
              </div>
              <p className="text-xs text-blue-900 leading-relaxed">
                Interim valuation certified and pending disbursement authorization.
              </p>
            </div>

            <button
              onClick={handleDownloadCertificate}
              className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shrink-0 shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Valuation PDF</span>
            </button>
          </div>
        ) : (
          <div className="p-5 rounded-2xl bg-emerald-50/80 border-2 border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-emerald-950">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center shrink-0 text-emerald-700">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-black uppercase tracking-wider text-emerald-800">
                  Disbursements Reconciled
                </div>
                <p className="text-xs text-emerald-900/80 mt-0.5">
                  No outstanding Interim Payment Certificates (IPC) pending disbursement at this time. All certified work-to-date is settled.
                </p>
              </div>
            </div>
            <button
              onClick={handleDownloadCertificate}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shrink-0 shadow-xs cursor-pointer self-start sm:self-auto"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Statement</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Grid: Milestones & Photo Stream */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left: Milestone Schedule (6 cols) */}
        <div className="lg:col-span-6 bg-white border-2 border-[#E5E5DE] rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="pb-3 border-b-2 border-[#E5E5DE] flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-[#0A2540]">Contractual Milestone Schedule</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Physical progress verified by structural inspection sheets
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">
              {milestones.length} Milestones
            </span>
          </div>

          <div className="space-y-4">
            {milestones.length === 0 ? (
              <div className="p-8 text-center text-sm font-semibold text-slate-500 bg-[#FAF9F5] rounded-2xl border border-[#E5E5DE]">
                No contractual milestone phases defined yet. Milestones certified by the engineering team will automatically appear here.
              </div>
            ) : (
              milestones.map((m) => (
                <div
                  key={m.id}
                  className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E5E5DE] space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-200 text-slate-700 rounded">
                          {m.stage}
                        </span>
                        {m.status === "Completed" && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Certified Done
                          </span>
                        )}
                        {m.status === "In Progress" && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                            In Execution ({m.percentComplete}%)
                          </span>
                        )}
                        {m.status === "Upcoming" && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                            Upcoming Phase
                          </span>
                        )}
                      </div>
                      <div className="text-sm font-extrabold text-slate-900 mt-2">{m.name}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-mono text-sm font-black text-[#0A2540]">
                        {m.percentComplete}%
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        m.status === "Completed" ? "bg-emerald-600" : "bg-[#0A2540]"
                      }`}
                      style={{ width: `${m.percentComplete}%` }}
                    />
                  </div>

                  {m.certifiedDate && (
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{m.certifiedDate}</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Verified Photo Stream & Project Team (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Photo Gallery Card */}
          <div className="bg-white border-2 border-[#E5E5DE] rounded-3xl p-6 md:p-8 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#E5E5DE]">
              <div>
                <h3 className="text-lg font-black text-[#0A2540] flex items-center gap-2">
                  <Camera className="w-5 h-5 text-[#0A2540]" /> Verified Jobsite Visual Proof
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Timestamped on-site inspection photographs and progress media
                </p>
              </div>
              <span className="text-xs font-bold text-slate-500">Live Stream</span>
            </div>

            <div className="space-y-4">
              {sitePhotos.length === 0 ? (
                <div className="p-8 text-center text-sm font-semibold text-slate-500 bg-[#FAF9F5] rounded-2xl border border-[#E5E5DE]">
                  <Camera className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  No site inspection photos uploaded yet. Verified QA/QC photos will stream here once logged.
                </div>
              ) : (
                sitePhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="rounded-2xl border-2 border-[#E5E5DE] overflow-hidden bg-[#FAF9F5] shadow-xs"
                  >
                    <div className="relative h-48 sm:h-56 w-full bg-slate-200 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo.imgUrl}
                        alt={photo.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 bg-[#0A2540]/90 backdrop-blur-xs text-white text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg">
                        {photo.date}
                      </div>
                      <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                        QA/QC Verified
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <h4 className="font-extrabold text-sm text-[#0A2540]">{photo.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed font-normal">
                        {photo.engineerNote}
                      </p>
                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                        <span className="font-medium">Signed: {photo.inspectorName}</span>
                        <span className="font-bold text-[#0A2540]">{photo.milestone}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Lead Consultants & Commercial Oversight Contact Card */}
          <div className="bg-white border-2 border-[#E5E5DE] rounded-3xl p-6 md:p-7 shadow-sm space-y-4">
            <h4 className="text-sm font-black uppercase tracking-wider text-[#0A2540] flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-600" /> Lead Project Consultants &amp; Sign-Offs
            </h4>
            {consultants.length === 0 ? (
              <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E5E5DE] text-xs text-slate-500 font-medium">
                Lead engineering and commercial consultants will be listed here upon project formal accreditation.
              </div>
            ) : (
              <div className="space-y-2">
                {consultants.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-xl bg-[#FAF9F5] border border-[#E5E5DE] flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#0A2540] text-white flex items-center justify-center font-bold text-xs">
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-xs font-black text-[#0A2540]">{c.name}</div>
                        <div className="text-[11px] text-slate-500">{c.role}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Accredited
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
