"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/app/providers";
import { formatCurrency } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import {
  Briefcase,
  Plus,
  FileCheck,
  Star,
  CheckCircle,
  Clock,
  ArrowRight,
  Receipt,
  FileSpreadsheet,
  Layers,
  Award,
  ScrollText,
  DollarSign,
  AlertCircle,
  Eye,
  Check,
  X,
} from "lucide-react";

interface Subcontractor {
  id: string;
  name: string;
  trade: string;
  contractSum: number;
  certifiedAmount: number;
  retentionHeld: number;
  paidAmount: number;
  scoreQuality: number;
  scoreSchedule: number;
  scoreSafety: number;
  scoreResponse: number;
}

interface InterimClaim {
  id: string;
  claimNumber: string;
  subcontractorId: string;
  subcontractorName: string;
  claimPeriod: string;
  claimedAmount: number;
  certifiedAmount?: number;
  retentionDeduction?: number;
  status: "Submitted" | "Certified" | "Paid";
  submittedAt: string;
  certifiedAt?: string;
  workDescription: string;
}

interface SiteInstruction {
  id: string;
  instructionNumber: string;
  issuedBy: string;
  issueDate: string;
  subject: string;
  description: string;
  linkedVoNumber?: string;
}

interface Variation {
  id: string;
  voNumber: string;
  title: string;
  instructionId?: string;
  stage: "Draft" | "QS Valuation" | "PM Review" | "Approved";
  costImpact: number;
  timeImpactDays: number;
  raisedBy: string;
  linkedBOQItem: string;
}

const INITIAL_SUBS: Subcontractor[] = [
  {
    id: "sub-1",
    name: "Apex MEP Engineering Ltd",
    trade: "Electrical & Piping",
    contractSum: 45000000,
    certifiedAmount: 22000000,
    retentionHeld: 2200000, // 10%
    paidAmount: 19800000,
    scoreQuality: 4.8,
    scoreSchedule: 4.2,
    scoreSafety: 5.0,
    scoreResponse: 4.5,
  },
  {
    id: "sub-2",
    name: "Horizon Fenestration & Aluminium",
    trade: "Glazing & Curtain Walls",
    contractSum: 38000000,
    certifiedAmount: 12000000,
    retentionHeld: 1200000,
    paidAmount: 10800000,
    scoreQuality: 4.5,
    scoreSchedule: 4.0,
    scoreSafety: 4.8,
    scoreResponse: 4.2,
  },
];

const INITIAL_CLAIMS: InterimClaim[] = [
  {
    id: "clm-1",
    claimNumber: "CLM-APEX-04",
    subcontractorId: "sub-1",
    subcontractorName: "Apex MEP Engineering Ltd",
    claimPeriod: "August 2026",
    claimedAmount: 6500000,
    certifiedAmount: 6000000,
    retentionDeduction: 600000,
    status: "Certified",
    submittedAt: "2026-08-30",
    certifiedAt: "2026-09-03",
    workDescription: "Conduit piping and DB trunking on Floor 1 & 2.",
  },
  {
    id: "clm-2",
    claimNumber: "CLM-HORIZ-02",
    subcontractorId: "sub-2",
    subcontractorName: "Horizon Fenestration & Aluminium",
    claimPeriod: "September 2026",
    claimedAmount: 4200000,
    status: "Submitted",
    submittedAt: "2026-09-06",
    workDescription: "Extruded aluminium mullions installation on East facade.",
  },
];

const INITIAL_INSTRUCTIONS: SiteInstruction[] = [
  {
    id: "si-1",
    instructionNumber: "SI-2026-011",
    issuedBy: "Architect David",
    issueDate: "2026-09-02",
    subject: "Relocate basement water treatment plant",
    description: "Re-route piping to service annex room B-04 per client revision.",
    linkedVoNumber: "VO-2026-001",
  },
  {
    id: "si-2",
    instructionNumber: "SI-2026-012",
    issuedBy: "Structural Consultant",
    issueDate: "2026-09-05",
    subject: "Elevator core rebar upgrade",
    description: "Upgrade rebar specification to Grade 460 steel for lift pit shear walls.",
    linkedVoNumber: "VO-2026-002",
  },
];

const INITIAL_VOS: Variation[] = [
  {
    id: "vo-1",
    voNumber: "VO-2026-001",
    title: "Relocate basement water treatment plant to service annex",
    instructionId: "si-1",
    stage: "PM Review",
    costImpact: 3500000,
    timeImpactDays: 5,
    raisedBy: "Architect David",
    linkedBOQItem: "MEP-04.01",
  },
  {
    id: "vo-2",
    voNumber: "VO-2026-002",
    title: "Upgrade elevator core rebar to Grade 460 steel specification",
    instructionId: "si-2",
    stage: "Approved",
    costImpact: 8200000,
    timeImpactDays: 0,
    raisedBy: "Structural Engr",
    linkedBOQItem: "STL-02.03",
  },
];

export function SubcontractorView({
  initialSubTab = "contracts",
  onTabChange,
}: {
  initialSubTab?: "contracts" | "claims" | "instructions" | "variations";
  onTabChange?: (tab: "contracts" | "claims" | "instructions" | "variations") => void;
} = {}) {
  const { currency, activeRole } = useApp();
  const [subTab, setSubTab] = useState<"contracts" | "claims" | "instructions" | "variations">(initialSubTab);

  useEffect(() => {
    if (initialSubTab) {
      setSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  const handleSubTabClick = (tab: "contracts" | "claims" | "instructions" | "variations") => {
    setSubTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  const [subs, setSubs] = useState<Subcontractor[]>(INITIAL_SUBS);
  const [claims, setClaims] = useState<InterimClaim[]>(INITIAL_CLAIMS);
  const [instructions, setInstructions] = useState<SiteInstruction[]>(INITIAL_INSTRUCTIONS);
  const [variations, setVariations] = useState<Variation[]>(INITIAL_VOS);

  // Load live subcontractors, claims, and variations from Supabase
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const supabase = createClient();
        const { data: subData } = await supabase
          .from("subcontractors")
          .select("*");
        const { data: claimData } = await supabase
          .from("subcontractor_claims")
          .select("*, subcontractors(company_name, trade)");
        const { data: voData } = await supabase
          .from("variation_orders")
          .select("*, boq_items(code)");

        if (isMounted && subData && subData.length > 0) {
          const mappedSubs: Subcontractor[] = subData.map((s: any) => {
            const sum = Number(s.contract_sum || 0);
            return {
              id: s.id,
              name: s.company_name,
              trade: s.trade,
              contractSum: sum,
              certifiedAmount: sum * 0.45,
              retentionHeld: sum * 0.45 * 0.10,
              paidAmount: sum * 0.40,
              scoreQuality: 4.8,
              scoreSchedule: 4.5,
              scoreSafety: 5.0,
              scoreResponse: 4.6,
            };
          });
          setSubs(mappedSubs);
        }

        if (isMounted && claimData && claimData.length > 0) {
          const mappedClaims: InterimClaim[] = claimData.map((c: any) => {
            const claimed = Number(c.claimed_amount || 0);
            const certified = c.certified_amount ? Number(c.certified_amount) : undefined;
            return {
              id: c.id,
              claimNumber: c.claim_number,
              subcontractorId: c.subcontractor_id,
              subcontractorName: c.subcontractors?.company_name || "Subcontractor",
              claimPeriod: c.valuation_date ? new Date(c.valuation_date).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "September 2026",
              claimedAmount: claimed,
              certifiedAmount: certified,
              retentionDeduction: certified ? certified * 0.10 : undefined,
              status: (c.status as any) || "Submitted",
              submittedAt: c.submitted_at ? c.submitted_at.substring(0, 10) : "2026-09-01",
              certifiedAt: c.approved_at ? c.approved_at.substring(0, 10) : undefined,
              workDescription: "Execution of site trade package according to milestone specifications.",
            };
          });
          setClaims(mappedClaims);
        }

        if (isMounted && voData && voData.length > 0) {
          const mappedVos: Variation[] = voData.map((v: any) => ({
            id: v.id,
            voNumber: v.vo_number,
            title: v.title,
            stage: (v.status === "Client Approved" ? "Approved" : v.status as any) || "Draft",
            costImpact: Number(v.cost_impact || 0),
            timeImpactDays: Number(v.time_impact_days || 0),
            raisedBy: "Mrs. Nkechi (QS)",
            linkedBOQItem: v.boq_items?.code || "SUB-01.01",
          }));
          setVariations(mappedVos);
        }
      } catch (err) {
        console.warn("Failed to load subcontractors from Supabase", err);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  // Modals
  const [isAddSubOpen, setIsAddSubOpen] = useState(false);
  const [isDetailSubOpen, setIsDetailSubOpen] = useState(false);
  const [isGradeSubOpen, setIsGradeSubOpen] = useState(false);
  const [isAddClaimOpen, setIsAddClaimOpen] = useState(false);
  const [isAddInstructionOpen, setIsAddInstructionOpen] = useState(false);
  const [isAddVoOpen, setIsAddVoOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState<Subcontractor | null>(null);

  // Forms
  const [subName, setSubName] = useState("");
  const [subTrade, setSubTrade] = useState("");
  const [subSum, setSubSum] = useState<number>(25000000);

  const [scoreQual, setScoreQual] = useState<number>(5.0);
  const [scoreSched, setScoreSched] = useState<number>(5.0);
  const [scoreSafe, setScoreSafe] = useState<number>(5.0);
  const [scoreResp, setScoreResp] = useState<number>(5.0);

  const [claimSubId, setClaimSubId] = useState(INITIAL_SUBS[0].id);
  const [claimPeriod, setClaimPeriod] = useState("September 2026");
  const [claimAmount, setClaimAmount] = useState<number>(3500000);
  const [claimDesc, setClaimDesc] = useState("");

  const [instrIssuedBy, setInstrIssuedBy] = useState("Architect");
  const [instrSubject, setInstrSubject] = useState("");
  const [instrDesc, setInstrDesc] = useState("");

  const [voTitle, setVoTitle] = useState("");
  const [voCost, setVoCost] = useState<number>(4500000);
  const [voBoqCode, setVoBoqCode] = useState("CON-02.01");

  // 1. Add Subcontractor (PRD #19)
  const handleAddSub = (e: React.FormEvent) => {
    e.preventDefault();
    const newSub: Subcontractor = {
      id: `sub-${Date.now()}`,
      name: subName,
      trade: subTrade,
      contractSum: subSum,
      certifiedAmount: 0,
      retentionHeld: 0,
      paidAmount: 0,
      scoreQuality: 5.0,
      scoreSchedule: 5.0,
      scoreSafety: 5.0,
      scoreResponse: 5.0,
    };
    setSubs((prev) => [newSub, ...prev]);
    setIsAddSubOpen(false);
    setSubName("");
    setSubTrade("");
  };

  // 2. Open Detail View (PRD #19)
  const handleOpenSubDetail = (sub: Subcontractor) => {
    setSelectedSub(sub);
    setIsDetailSubOpen(true);
  };

  // 3. Grade Subcontractor across 4 categories (PRD #21)
  const handleOpenGradeSub = (sub: Subcontractor) => {
    setSelectedSub(sub);
    setScoreQual(sub.scoreQuality);
    setScoreSched(sub.scoreSchedule);
    setScoreSafe(sub.scoreSafety);
    setScoreResp(sub.scoreResponse);
    setIsGradeSubOpen(true);
  };

  const handleSaveSubGrading = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;

    setSubs((prev) =>
      prev.map((s) =>
        s.id === selectedSub.id
          ? {
              ...s,
              scoreQuality: Number(scoreQual),
              scoreSchedule: Number(scoreSched),
              scoreSafety: Number(scoreSafe),
              scoreResponse: Number(scoreResp),
            }
          : s
      )
    );
    setIsGradeSubOpen(false);
  };

  // 4. Add Interim Claim (PRD #20)
  const handleCreateClaim = (e: React.FormEvent) => {
    e.preventDefault();
    const targetSub = subs.find((s) => s.id === claimSubId);
    const newClaim: InterimClaim = {
      id: `clm-${Date.now()}`,
      claimNumber: `CLM-${targetSub?.name.slice(0, 4).toUpperCase()}-0${claims.length + 1}`,
      subcontractorId: claimSubId,
      subcontractorName: targetSub?.name || "Subcontractor",
      claimPeriod,
      claimedAmount: claimAmount,
      status: "Submitted",
      submittedAt: new Date().toISOString().substring(0, 10),
      workDescription: claimDesc,
    };
    setClaims([newClaim, ...claims]);
    setIsAddClaimOpen(false);
    setClaimDesc("");
  };

  // 5. Certify Claim (Calculates 10% retention fund automatically)
  const handleCertifyClaim = (claimId: string) => {
    setClaims((prev) =>
      prev.map((c) => {
        if (c.id === claimId) {
          const certified = c.claimedAmount;
          const retention = certified * 0.1; // 10% Retention
          
          // Update subcontractor ledger
          setSubs((subsPrev) =>
            subsPrev.map((s) =>
              s.id === c.subcontractorId
                ? {
                    ...s,
                    certifiedAmount: s.certifiedAmount + certified,
                    retentionHeld: s.retentionHeld + retention,
                    paidAmount: s.paidAmount + (certified - retention),
                  }
                : s
            )
          );

          return {
            ...c,
            certifiedAmount: certified,
            retentionDeduction: retention,
            status: "Certified",
            certifiedAt: new Date().toISOString().substring(0, 10),
          };
        }
        return c;
      })
    );
  };

  // 6. Add Site Instruction (PRD #22)
  const handleCreateInstruction = (e: React.FormEvent) => {
    e.preventDefault();
    const newInstr: SiteInstruction = {
      id: `si-${Date.now()}`,
      instructionNumber: `SI-2026-0${instructions.length + 13}`,
      issuedBy: instrIssuedBy,
      issueDate: new Date().toISOString().substring(0, 10),
      subject: instrSubject,
      description: instrDesc,
    };
    setInstructions([newInstr, ...instructions]);
    setIsAddInstructionOpen(false);
    setInstrSubject("");
    setInstrDesc("");
  };

  // 7. Add Variation (PRD #23)
  const handleAddVo = (e: React.FormEvent) => {
    e.preventDefault();
    const newVo: Variation = {
      id: `vo-${Date.now()}`,
      voNumber: `VO-2026-00${variations.length + 1}`,
      title: voTitle,
      stage: "Draft",
      costImpact: voCost,
      timeImpactDays: 3,
      raisedBy: activeRole,
      linkedBOQItem: voBoqCode,
    };
    setVariations((prev) => [newVo, ...prev]);
    setIsAddVoOpen(false);
    setVoTitle("");
  };

  // 8. Advance Variation Stage (PRD #24)
  const handleAdvanceVoStage = (id: string) => {
    setVariations((prev) =>
      prev.map((vo) => {
        if (vo.id === id) {
          const nextStage =
            vo.stage === "Draft"
              ? "QS Valuation"
              : vo.stage === "QS Valuation"
              ? "PM Review"
              : "Approved";
          return { ...vo, stage: nextStage };
        }
        return vo;
      })
    );
  };

  return (
    <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-xl shadow-xs rounded-xl overflow-hidden space-y-4">
      {/* Subnavigation Bar */}
      <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between overflow-x-auto gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSubTabClick("contracts")}
            className={`px-4 py-2 border text-xs font-bold transition-all flex items-center gap-2 rounded-xl cursor-pointer ${
              subTab === "contracts"
                ? "bg-[#0A1931] text-white border-[#0A1931] shadow-sm"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <Briefcase className={`w-4 h-4 ${subTab === "contracts" ? "text-emerald-300" : "text-emerald-500"}`} />
            <span>5.1 Packages & Retention</span>
          </button>

          <button
            onClick={() => handleSubTabClick("claims")}
            className={`px-4 py-2 border text-xs font-bold transition-all flex items-center gap-2 rounded-xl cursor-pointer ${
              subTab === "claims"
                ? "bg-[#0A1931] text-white border-[#0A1931] shadow-sm"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <Receipt className={`w-4 h-4 ${subTab === "claims" ? "text-amber-300" : "text-amber-500"}`} />
            <span>5.2 Interim Claims & Certs</span>
            {claims.filter((c) => c.status === "Submitted").length > 0 && (
              <span className={`text-[11px] px-1.5 py-0.5 font-mono font-bold rounded ${
                subTab === "claims" ? "bg-amber-400 text-slate-900" : "bg-amber-100 text-amber-800"
              }`}>
                {claims.filter((c) => c.status === "Submitted").length}
              </span>
            )}
          </button>

          <button
            onClick={() => handleSubTabClick("instructions")}
            className={`px-4 py-2 border text-xs font-bold transition-all flex items-center gap-2 rounded-xl cursor-pointer ${
              subTab === "instructions"
                ? "bg-[#0A1931] text-white border-[#0A1931] shadow-sm"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <ScrollText className={`w-4 h-4 ${subTab === "instructions" ? "text-blue-300" : "text-blue-500"}`} />
            <span>5.3 Site Instructions</span>
          </button>

          <button
            onClick={() => handleSubTabClick("variations")}
            className={`px-4 py-2 border text-xs font-bold transition-all flex items-center gap-2 rounded-xl cursor-pointer ${
              subTab === "variations"
                ? "bg-[#0A1931] text-white border-[#0A1931] shadow-sm"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <FileSpreadsheet className={`w-4 h-4 ${subTab === "variations" ? "text-purple-300" : "text-purple-500"}`} />
            <span>5.4 Variation Orders</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: SUBCONTRACTOR PACKAGES & RETENTION (PRD Item 19) */}
      {subTab === "contracts" && (
        <div>
          <div className="p-4 border-b border-slate-200/80 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-400" />
                <span>Subcontractor Packages & Financial Ledger</span>
              </h3>
              <p className="text-xs text-slate-900/60 mt-0.5">
                Contract sums, certified work to date, and 10% statutory retention fund held (PRD Section 6).
              </p>
            </div>
            <button
              onClick={() => setIsAddSubOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white border border-slate-200/80 text-xs font-semibold shadow-xs rounded-xl transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Subcontractor</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-white uppercase text-xs font-semibold border-b border-slate-200/80">
                <tr>
                  <th className="py-3 px-4">Subcontractor</th>
                  <th className="py-3 px-4">Trade Scope</th>
                  <th className="py-3 px-4 text-right">Contract Sum</th>
                  <th className="py-3 px-4 text-right">Certified To Date</th>
                  <th className="py-3 px-4 text-right">Retention (10%)</th>
                  <th className="py-3 px-4 text-right">Paid Amount</th>
                  <th className="py-3 px-4 text-center">Avg Rating</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-800/10 text-slate-900">
                {subs.map((s) => {
                  const avgScore = ((s.scoreQuality + s.scoreSchedule + s.scoreSafety + s.scoreResponse) / 4).toFixed(1);
                  return (
                    <tr key={s.id} className="hover:bg-white/30 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">{s.name}</td>
                      <td className="py-3 px-4 text-slate-900">{s.trade}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        {formatCurrency(s.contractSum, currency)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-900">
                        {formatCurrency(s.certifiedAmount, currency)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-amber-600 font-bold">
                        {formatCurrency(s.retentionHeld, currency)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-emerald-600 font-bold">
                        {formatCurrency(s.paidAmount, currency)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 border border-slate-200/80 text-amber-600 text-sm font-bold bg-white">
                          <Star className="w-3 h-3 fill-amber-500" />
                          {avgScore}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenSubDetail(s)}
                            title="View Financial Statement"
                            className="p-1 text-slate-900 hover:bg-[#f5f5f5] border border-slate-200/80 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-900" />
                          </button>
                          <button
                            onClick={() => handleOpenGradeSub(s)}
                            title="Grade Subcontractor"
                            className="p-1 text-slate-900 hover:bg-[#f5f5f5] border border-slate-200/80 transition-colors"
                          >
                            <Award className="w-3.5 h-3.5 text-slate-900" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 2: INTERIM CLAIMS & CERTIFICATES (PRD Item 20) */}
      {subTab === "claims" && (
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-amber-400" />
                <span>Interim Payment Claims & Valuation Certificates</span>
              </h3>
              <p className="text-xs text-slate-900/60 mt-0.5">
                Subcontractor claims validated against contract terms with automatic 10% retention holding (PRD Section 6.2).
              </p>
            </div>
            <button
              onClick={() => setIsAddClaimOpen(true)}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white border border-slate-200/80 text-xs font-semibold shadow-xs rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Interim Claim</span>
            </button>
          </div>

          <div className="divide-y divide-navy-800/10">
            {claims.map((c) => (
              <div key={c.id} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-white/20 px-2 border border-slate-200/80 transition-colors">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-amber-600 text-xs">{c.claimNumber}</span>
                    <span className="text-slate-900/40">·</span>
                    <span className="font-semibold text-slate-900 text-xs">{c.subcontractorName}</span>
                    <span className="text-slate-900/40">·</span>
                    <span className="text-xs text-slate-900/60">{c.claimPeriod}</span>
                  </div>
                  <div className="text-xs text-slate-900">{c.workDescription}</div>
                  <div className="text-xs text-slate-900/60 mt-1 flex items-center gap-2 font-mono">
                    <span>Claimed: <strong className="text-slate-900">{formatCurrency(c.claimedAmount, currency)}</strong></span>
                    {c.retentionDeduction && (
                      <span>· Retention Withheld (10%): <strong className="text-amber-600">{formatCurrency(c.retentionDeduction, currency)}</strong></span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 text-xs font-bold border border-slate-200/80 ${
                    c.status === "Certified"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}>
                    {c.status}
                  </span>

                  {c.status === "Submitted" && (
                    <button
                      onClick={() => handleCertifyClaim(c.id)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white border border-slate-200/80 text-xs font-semibold shadow-xs rounded-xl transition-colors flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Certify & Apply 10%</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: SITE INSTRUCTIONS (PRD Item 22) */}
      {subTab === "instructions" && (
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ScrollText className="w-4 h-4 text-blue-600" />
                <span>Site Instructions Register (Architect / Engineer / Client)</span>
              </h3>
              <p className="text-xs text-slate-900/60 mt-0.5">
                Master record of formal site instructions that trigger variation orders (PRD Section 7.1).
              </p>
            </div>
            <button
              onClick={() => setIsAddInstructionOpen(true)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white border border-slate-200/80 text-xs font-semibold shadow-xs rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Instruction</span>
            </button>
          </div>

          <div className="divide-y divide-navy-800/10">
            {instructions.map((instr) => (
              <div key={instr.id} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-white/20 px-2 border border-slate-200/80 transition-colors">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-blue-600 text-xs">{instr.instructionNumber}</span>
                    <span className="text-slate-900/40">·</span>
                    <span className="font-semibold text-slate-900 text-xs">{instr.subject}</span>
                    <span className="text-slate-900/40">·</span>
                    <span className="text-xs bg-white text-slate-900 px-2 py-0.5 border border-slate-200/80 font-mono">
                      Issued by: {instr.issuedBy} ({instr.issueDate})
                    </span>
                  </div>
                  <p className="text-xs text-slate-900">{instr.description}</p>
                </div>

                <div>
                  {instr.linkedVoNumber ? (
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-slate-200/80 text-xs font-mono font-bold">
                      Linked: {instr.linkedVoNumber}
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-white text-slate-900/60 border border-slate-200/80 text-xs">
                      Pending VO
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 4: VARIATIONS REGISTER (PRD Items 23 & 24) */}
      {subTab === "variations" && (
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-purple-600" />
                <span>Variation Orders Register & 4-Stage Approval</span>
              </h3>
              <p className="text-xs text-slate-900/60 mt-0.5">
                Draft → QS Valuation → PM Review → Approved. Approved variations auto-update budget baseline (PRD Section 7.3).
              </p>
            </div>
            <button
              onClick={() => setIsAddVoOpen(true)}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white border border-slate-200/80 text-xs font-semibold shadow-xs rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Raise Variation</span>
            </button>
          </div>

          <div className="divide-y divide-navy-800/10">
            {variations.map((vo) => (
              <div key={vo.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-white/30 transition-colors">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-purple-600 text-xs">{vo.voNumber}</span>
                    <span className="text-slate-900/40">·</span>
                    <span className="font-bold text-slate-900 text-xs">{vo.title}</span>
                    <span className="text-slate-900/40">·</span>
                    <span className="text-xs bg-white text-emerald-700 px-1.5 py-0.5 border border-slate-200/80 font-mono">
                      Affects BOQ: {vo.linkedBOQItem}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-900/60">
                    <span>Cost Impact: <strong className="font-mono text-emerald-600">{formatCurrency(vo.costImpact, currency)}</strong></span>
                    <span>·</span>
                    <span>Time Delta: <strong className="text-slate-900">{vo.timeImpactDays} Days</strong></span>
                    <span>·</span>
                    <span>Raised by: {vo.raisedBy}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 text-xs font-semibold border border-slate-200/80 ${
                    vo.stage === "Approved"
                      ? "bg-emerald-100 text-emerald-800"
                      : vo.stage === "PM Review"
                      ? "bg-purple-100 text-purple-800"
                      : vo.stage === "QS Valuation"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-white text-slate-900"
                  }`}>
                    {vo.stage}
                  </span>

                  {vo.stage !== "Approved" && (
                    <button
                      onClick={() => handleAdvanceVoStage(vo.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-[#f5f5f5] text-slate-900 text-xs font-semibold border border-slate-200/80 shadow-xs rounded-xl transition-colors"
                    >
                      <span>Advance Stage</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Add Subcontractor (PRD #19) */}
      {isAddSubOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200/80 max-w-md w-full p-6 shadow-card">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Add Subcontractor Package</h3>
            <form onSubmit={handleAddSub} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  placeholder="e.g. Zenith Piling Works Ltd"
                  className="w-full bg-white border border-slate-200/80 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">Trade Scope</label>
                <input
                  type="text"
                  required
                  value={subTrade}
                  onChange={(e) => setSubTrade(e.target.value)}
                  placeholder="Piling, Waterproofing, HVAC"
                  className="w-full bg-white border border-slate-200/80 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">Contract Sum (₦)</label>
                <input
                  type="number"
                  required
                  value={subSum}
                  onChange={(e) => setSubSum(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200/80 px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-navy-800"
                />
              </div>
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddSubOpen(false)}
                  className="px-3 py-1.5 bg-white hover:bg-[#f5f5f5] border border-slate-200/80 text-slate-900 text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white border border-slate-200/80 shadow-xs rounded-xl text-xs font-bold transition-transform active:translate-x-0.5 active:translate-y-0.5"
                >
                  Save Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Subcontractor Financial Detail (PRD #19) */}
      {isDetailSubOpen && selectedSub && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200/80 max-w-md w-full p-6 shadow-card space-y-4">
            <div className="border-b border-slate-200/80 pb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">{selectedSub.name}</h3>
              <p className="text-xs text-slate-900/70 font-mono mt-0.5">Scope: {selectedSub.trade}</p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-200/80">
                <span className="text-slate-900/70 font-medium">Agreed Contract Sum:</span>
                <span className="font-mono font-bold text-slate-900">{formatCurrency(selectedSub.contractSum, currency)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200/80">
                <span className="text-slate-900/70 font-medium">Total Certified to Date:</span>
                <span className="font-mono font-bold text-emerald-700">{formatCurrency(selectedSub.certifiedAmount, currency)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200/80">
                <span className="text-slate-900/70 font-medium">Retention Fund Held (10%):</span>
                <span className="font-mono font-bold text-amber-700">{formatCurrency(selectedSub.retentionHeld, currency)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200/80">
                <span className="text-slate-900/70 font-medium">Net Disbursed / Paid:</span>
                <span className="font-mono font-bold text-blue-700">{formatCurrency(selectedSub.paidAmount, currency)}</span>
              </div>
              <div className="flex justify-between py-1.5 font-bold pt-2 border-t border-slate-200/80">
                <span className="text-slate-900 uppercase tracking-wider">Remaining Balance:</span>
                <span className="font-mono text-emerald-700">
                  {formatCurrency(selectedSub.contractSum - selectedSub.certifiedAmount, currency)}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsDetailSubOpen(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-navy-900 text-white border border-slate-200/80 shadow-xs rounded-xl text-xs font-bold transition-transform active:translate-x-0.5 active:translate-y-0.5"
              >
                Close Statement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Grade Subcontractor Across 4 Categories (PRD #21) */}
      {isGradeSubOpen && selectedSub && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200/80 max-w-md w-full p-6 shadow-card">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Performance Evaluation · {selectedSub.name}</h3>
            <p className="text-xs text-slate-900/70 mt-1">
              Grade across the 4 key categories to update dynamic contractor rating (PRD Section 6.5).
            </p>

            <form onSubmit={handleSaveSubGrading} className="mt-4 space-y-3">
              <div>
                <div className="flex justify-between text-xs text-slate-900 mb-1">
                  <span className="font-bold">1. Quality of Workmanship:</span>
                  <span className="font-mono font-bold text-amber-600">{scoreQual.toFixed(1)} / 5.0</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={0.1}
                  value={scoreQual}
                  onChange={(e) => setScoreQual(Number(e.target.value))}
                  className="w-full accent-navy-800"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-900 mb-1">
                  <span className="font-bold">2. Schedule & Milestone Adherence:</span>
                  <span className="font-mono font-bold text-amber-600">{scoreSched.toFixed(1)} / 5.0</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={0.1}
                  value={scoreSched}
                  onChange={(e) => setScoreSched(Number(e.target.value))}
                  className="w-full accent-navy-800"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-900 mb-1">
                  <span className="font-bold">3. Site Safety & PPE Compliance:</span>
                  <span className="font-mono font-bold text-amber-600">{scoreSafe.toFixed(1)} / 5.0</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={0.1}
                  value={scoreSafe}
                  onChange={(e) => setScoreSafe(Number(e.target.value))}
                  className="w-full accent-navy-800"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-900 mb-1">
                  <span className="font-bold">4. Responsiveness & Site Presence:</span>
                  <span className="font-mono font-bold text-amber-600">{scoreResp.toFixed(1)} / 5.0</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={0.1}
                  value={scoreResp}
                  onChange={(e) => setScoreResp(Number(e.target.value))}
                  className="w-full accent-navy-800"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsGradeSubOpen(false)}
                  className="px-3 py-1.5 bg-white hover:bg-[#f5f5f5] border border-slate-200/80 text-slate-900 text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white border border-slate-200/80 shadow-xs rounded-xl text-xs font-bold transition-transform active:translate-x-0.5 active:translate-y-0.5"
                >
                  Save Evaluation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Claim (PRD #20) */}
      {isAddClaimOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200/80 max-w-md w-full p-6 shadow-card">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Log Subcontractor Interim Claim</h3>
            <form onSubmit={handleCreateClaim} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">Subcontractor</label>
                <select
                  value={claimSubId}
                  onChange={(e) => setClaimSubId(e.target.value)}
                  className="w-full bg-white border border-slate-200/80 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-800"
                >
                  {subs.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.trade})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">Claim Period</label>
                  <input
                    type="text"
                    required
                    value={claimPeriod}
                    onChange={(e) => setClaimPeriod(e.target.value)}
                    placeholder="e.g. September 2026"
                    className="w-full bg-white border border-slate-200/80 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">Claimed Amount (₦)</label>
                  <input
                    type="number"
                    required
                    value={claimAmount}
                    onChange={(e) => setClaimAmount(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200/80 px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-navy-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">Work Accomplished Description</label>
                <textarea
                  rows={3}
                  required
                  value={claimDesc}
                  onChange={(e) => setClaimDesc(e.target.value)}
                  placeholder="Detail work done for this valuation period..."
                  className="w-full bg-white border border-slate-200/80 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-800"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddClaimOpen(false)}
                  className="px-3 py-1.5 bg-white hover:bg-[#f5f5f5] border border-slate-200/80 text-slate-900 text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white border border-slate-200/80 shadow-xs rounded-xl text-xs font-bold transition-transform active:translate-x-0.5 active:translate-y-0.5"
                >
                  Submit Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Instruction (PRD #22) */}
      {isAddInstructionOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200/80 max-w-md w-full p-6 shadow-card">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Log Site Instruction</h3>
            <form onSubmit={handleCreateInstruction} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">Issued By</label>
                <input
                  type="text"
                  required
                  value={instrIssuedBy}
                  onChange={(e) => setInstrIssuedBy(e.target.value)}
                  placeholder="e.g. Architect David / Consultant Structural Eng"
                  className="w-full bg-white border border-slate-200/80 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">Subject / Header</label>
                <input
                  type="text"
                  required
                  value={instrSubject}
                  onChange={(e) => setInstrSubject(e.target.value)}
                  placeholder="e.g. Relocate water tank plinth"
                  className="w-full bg-white border border-slate-200/80 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">Instruction Text</label>
                <textarea
                  rows={3}
                  required
                  value={instrDesc}
                  onChange={(e) => setInstrDesc(e.target.value)}
                  placeholder="Exact description of instruction given on site..."
                  className="w-full bg-white border border-slate-200/80 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-800"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddInstructionOpen(false)}
                  className="px-3 py-1.5 bg-white hover:bg-[#f5f5f5] border border-slate-200/80 text-slate-900 text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white border border-slate-200/80 shadow-xs rounded-xl text-xs font-bold transition-transform active:translate-x-0.5 active:translate-y-0.5"
                >
                  Log Instruction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add VO (PRD #23) */}
      {isAddVoOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200/80 max-w-md w-full p-6 shadow-card">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Raise Variation Order</h3>
            <form onSubmit={handleAddVo} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">Variation Title / Scope Change</label>
                <input
                  type="text"
                  required
                  value={voTitle}
                  onChange={(e) => setVoTitle(e.target.value)}
                  placeholder="e.g. Additional security bollards along perimeter"
                  className="w-full bg-white border border-slate-200/80 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">Estimated Cost Impact (₦)</label>
                  <input
                    type="number"
                    required
                    value={voCost}
                    onChange={(e) => setVoCost(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200/80 px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-navy-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">Affected BOQ Cost Code</label>
                  <input
                    type="text"
                    required
                    value={voBoqCode}
                    onChange={(e) => setVoBoqCode(e.target.value)}
                    placeholder="e.g. CON-02.01"
                    className="w-full bg-white border border-slate-200/80 px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-navy-800"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddVoOpen(false)}
                  className="px-3 py-1.5 bg-white hover:bg-[#f5f5f5] border border-slate-200/80 text-slate-900 text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white border border-slate-200/80 shadow-xs rounded-xl text-xs font-bold transition-transform active:translate-x-0.5 active:translate-y-0.5"
                >
                  Submit Variation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
