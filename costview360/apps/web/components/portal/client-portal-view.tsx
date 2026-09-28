"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { useApp } from "@/app/providers";
import {
  Globe,
  Building,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Download,
  Share2,
  ExternalLink,
  Camera,
  MapPin,
  Clock,
  UserCheck,
  ArrowUpRight,
  TrendingUp,
  FileCheck,
  ChevronRight,
  Copy,
  Check,
  Eye,
  Lock,
  ArrowLeft,
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

const MILESTONES: MilestoneItem[] = [];

const SITE_PHOTOS: SitePhotoItem[] = [];

export function ClientPortalView({
  standalone = false,
  onReturn,
}: {
  standalone?: boolean;
  onReturn?: () => void;
}) {
  const { currentProject } = useApp();
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<SitePhotoItem | null>(null);

  const approvedContractSum = currentProject.budgetTotal || 0;
  const certifiedWorkToDate = 0;
  const paidToDate = 0;
  const retentionInEscrow = 0;
  const pendingCertificate = 0;

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/portal?project=p-01&token=demo-diaspora-access`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleDownloadCertificate = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-[#0A2540] rounded-3xl p-7 md:p-10 text-white shadow-xl border-2 border-[#0A2540] relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-black uppercase tracking-wider px-3 py-1 bg-emerald-400 text-[#0A2540] rounded-lg shadow-sm flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" /> Client &amp; Diaspora Investor Portal
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
            <div className="text-[11px] font-black uppercase tracking-wider text-white/60">Verified Physical Progress</div>
            <div className="text-2xl font-black font-mono text-emerald-400 mt-1">64% Complete</div>
            <div className="text-xs text-white/70 mt-0.5">Superstructure Level 4 Floor Slab</div>
          </div>
          <div>
            <div className="text-[11px] font-black uppercase tracking-wider text-white/60">Project Handover Target</div>
            <div className="text-2xl font-black font-mono text-white mt-1">March 2027</div>
            <div className="text-xs text-white/70 mt-0.5">On Schedule (0.98 SPI)</div>
          </div>
          <div>
            <div className="text-[11px] font-black uppercase tracking-wider text-white/60">Quality Assurance (QA/QC)</div>
            <div className="text-2xl font-black font-mono text-emerald-300 mt-1">100% Passed</div>
            <div className="text-xs text-white/70 mt-0.5">38 Element Tests Certified</div>
          </div>
          <div>
            <div className="text-[11px] font-black uppercase tracking-wider text-white/60">Statutory Escrow Reserve</div>
            <div className="text-2xl font-black font-mono text-amber-300 mt-1">₦21.64M</div>
            <div className="text-xs text-white/70 mt-0.5">10% Retention Protected</div>
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
              Authoritative financial statement certified by lead Quantity Surveyor and Resident Engineer
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 self-start sm:self-auto">
            <Lock className="w-3.5 h-3.5 text-emerald-700" />
            <span>Client Transparency View</span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-2xl bg-[#FAF9F5] border border-[#E5E5DE]">
            <div className="text-xs font-black uppercase tracking-wider text-slate-500">Approved Contract Sum</div>
            <div className="text-2xl font-black font-mono text-[#0A2540] mt-2">
              {formatCurrency(approvedContractSum, "NGN")}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Original baseline agreement</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF9F5] border border-[#E5E5DE]">
            <div className="text-xs font-black uppercase tracking-wider text-slate-500">Certified Work-in-Place</div>
            <div className="text-2xl font-black font-mono text-emerald-700 mt-2">
              {formatCurrency(certifiedWorkToDate, "NGN")}
            </div>
            <div className="text-xs text-emerald-800 font-bold mt-1">71.7% of total contract value</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF9F5] border border-[#E5E5DE]">
            <div className="text-xs font-black uppercase tracking-wider text-slate-500">Total Funds Disbursed</div>
            <div className="text-2xl font-black font-mono text-[#0A2540] mt-2">
              {formatCurrency(paidToDate, "NGN")}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Reconciled wire transfers</div>
          </div>

          <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200">
            <div className="text-xs font-black uppercase tracking-wider text-amber-900">10% Retention in Escrow</div>
            <div className="text-2xl font-black font-mono text-amber-800 mt-2">
              {formatCurrency(retentionInEscrow, "NGN")}
            </div>
            <div className="text-xs text-amber-900 font-bold mt-1">Safe FIDIC/JCT escrow fund</div>
          </div>
        </div>

        {/* Current Active Certificate Notice */}
        <div className="p-5 rounded-2xl bg-blue-50/90 border-2 border-blue-200 flex flex-col md:flex-row md:items-center justify-between gap-4 text-blue-950">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-800">
              <FileCheck className="w-4 h-4 text-blue-700" /> Interim Payment Certificate (IPC #04) Active
            </div>
            <div className="text-base font-extrabold">
              Amount Due for Disbursement: {formatCurrency(pendingCertificate, "NGN")}
            </div>
            <p className="text-xs text-blue-900 leading-relaxed">
              Certified by Senior QS on 15 Sept 2026 for 4th floor structural slab milestone completion. Awaiting client authorization wire.
            </p>
          </div>

          <button
            onClick={handleDownloadCertificate}
            className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shrink-0 shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Certified IPC #04</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Milestones & Photo Stream */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left: Milestone Schedule (6 cols) */}
        <div className="lg:col-span-6 bg-white border-2 border-[#E5E5DE] rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="pb-3 border-b-2 border-[#E5E5DE] flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-[#0A2540]">Contractual Milestone Schedule</h3>
              <p className="text-xs text-slate-500 mt-0.5">Physical progress verified by structural inspection sheets</p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">{MILESTONES.length} Milestones</span>
          </div>

          <div className="space-y-4">
            {MILESTONES.length === 0 ? (
              <div className="p-8 text-center text-sm font-semibold text-slate-500 bg-[#FAF9F5] rounded-2xl border border-[#E5E5DE]">
                No contractual milestone phases defined yet. Milestones certified by the engineering team will automatically appear here.
              </div>
            ) : (
              MILESTONES.map((m) => (
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
                      <span className="font-mono text-sm font-black text-[#0A2540]">{m.percentComplete}%</span>
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
                <p className="text-xs text-slate-500 mt-0.5">Timestamped on-site inspection photographs and drone logs</p>
              </div>
              <span className="text-xs font-bold text-slate-500">Live Stream</span>
            </div>

            <div className="space-y-4">
              {SITE_PHOTOS.length === 0 ? (
                <div className="p-8 text-center text-sm font-semibold text-slate-500 bg-[#FAF9F5] rounded-2xl border border-[#E5E5DE]">
                  <Camera className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  No site inspection photos uploaded yet. Verified QA/QC photos will stream here once logged.
                </div>
              ) : (
                SITE_PHOTOS.map((photo) => (
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
                        QA/QC Passed
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <h4 className="font-extrabold text-sm text-[#0A2540]">{photo.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed font-normal">{photo.engineerNote}</p>
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
            <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E5E5DE] text-xs text-slate-500 font-medium">
              Lead engineering and commercial consultants will be listed here upon project formal accreditation.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
