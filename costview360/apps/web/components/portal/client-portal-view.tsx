"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
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

const MILESTONES: MilestoneItem[] = [
  {
    id: "m-01",
    name: "Geotechnical Piling & Soil Consolidation",
    stage: "Substructure",
    percentComplete: 100,
    status: "Completed",
    certifiedDate: "14 May 2026",
    inspectionPassed: true,
  },
  {
    id: "m-02",
    name: "Raft Foundation & Basement Retaining Walls",
    stage: "Substructure",
    percentComplete: 100,
    status: "Completed",
    certifiedDate: "28 June 2026",
    inspectionPassed: true,
  },
  {
    id: "m-03",
    name: "Ground to 3rd Floor Concrete Frame & Slabs",
    stage: "Superstructure",
    percentComplete: 100,
    status: "Completed",
    certifiedDate: "12 August 2026",
    inspectionPassed: true,
  },
  {
    id: "m-04",
    name: "4th to 6th Floor Suspended Slabs & Shear Walls",
    stage: "Superstructure",
    percentComplete: 65,
    status: "In Progress",
    certifiedDate: "Scheduled 10 Oct 2026",
    inspectionPassed: true,
  },
  {
    id: "m-05",
    name: "MEP 1st Fix (Conduits, Piping & Risers)",
    stage: "Building Services",
    percentComplete: 35,
    status: "In Progress",
    inspectionPassed: true,
  },
  {
    id: "m-06",
    name: "Roof Slab Waterproofing & Parapet Coping",
    stage: "Enclosure",
    percentComplete: 0,
    status: "Upcoming",
    inspectionPassed: false,
  },
  {
    id: "m-07",
    name: "Curtain Walling, Glazing & External Facade",
    stage: "Finishes",
    percentComplete: 0,
    status: "Upcoming",
    inspectionPassed: false,
  },
];

const SITE_PHOTOS: SitePhotoItem[] = [
  {
    id: "p-01",
    title: "Level 4 Suspended Slab Pre-Pour Reinforcement",
    date: "18 Sept 2026",
    milestone: "Superstructure Frame",
    engineerNote: "Top & bottom Y16 rebar mesh spaced at 150mm c/c with concrete cover blocks verified. Passed QA/QC inspection sign-off.",
    imgUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f8?auto=format&fit=crop&w=800&q=80",
    inspectorName: "Engr. Babatunde Sanusi (Resident Engineer)",
  },
  {
    id: "p-02",
    title: "Batch Delivery of 40T Fe500 Structural Rebar",
    date: "14 Sept 2026",
    milestone: "Material Intake",
    engineerNote: "Physical weighbridge certificate reconciled with PO-2026-088. Zero surface oxidation, tensile test mill cert accepted.",
    imgUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
    inspectorName: "David O. (Materials Engineer)",
  },
  {
    id: "p-03",
    title: "Aerial Drone Survey: 6-Storey Superstructure Core",
    date: "10 Sept 2026",
    milestone: "Overall Site Progress",
    engineerNote: "Lift core and shear walls verticality within ±3mm tolerance. Overall project execution currently 64% against master schedule.",
    imgUrl: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80",
    inspectorName: "Arc. Amina Bello (Principal Consultant)",
  },
];

export function ClientPortalView({ standalone = false }: { standalone?: boolean }) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<SitePhotoItem | null>(null);

  const approvedContractSum = 301815000;
  const certifiedWorkToDate = 216400000;
  const paidToDate = 194760000;
  const retentionInEscrow = 21640000; // 10% statutory retention
  const pendingCertificate = 18500000;

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
              Emerald Heights Commercial Tower
            </h1>
            <p className="text-base text-white/80 mt-2 max-w-2xl font-normal leading-relaxed flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
              Plot 14B Ozumba Mbadiwe Avenue, Victoria Island, Lagos, Nigeria
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
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
            <span className="text-xs font-mono font-bold text-slate-500">7 Milestones</span>
          </div>

          <div className="space-y-4">
            {MILESTONES.map((m) => (
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
            ))}
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
              {SITE_PHOTOS.map((photo) => (
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
              ))}
            </div>
          </div>

          {/* Lead Consultants & Commercial Oversight Contact Card */}
          <div className="bg-white border-2 border-[#E5E5DE] rounded-3xl p-6 md:p-7 shadow-sm space-y-4">
            <h4 className="text-sm font-black uppercase tracking-wider text-[#0A2540] flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-600" /> Lead Project Consultants &amp; Sign-Offs
            </h4>
            <div className="grid sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E5E5DE]">
                <div className="text-xs font-black text-[#0A2540]">Engr. Babatunde Sanusi, FNSE</div>
                <div className="text-[11px] text-slate-500 font-medium">Resident Structural Engineer</div>
                <div className="text-[10px] font-mono text-emerald-700 font-bold mt-1">COREN R.29410</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E5E5DE]">
                <div className="text-xs font-black text-[#0A2540]">QS. Chijioke Nwosu, MNIQS</div>
                <div className="text-[11px] text-slate-500 font-medium">Lead Commercial Quantity Surveyor</div>
                <div className="text-[10px] font-mono text-emerald-700 font-bold mt-1">QSRBN Reg #4402</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
