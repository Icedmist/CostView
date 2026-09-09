"use client";
import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/brand/logo";
import {
  ArrowUpRight,
  CheckCircle2,
  Calculator,
  ShoppingCart,
  Boxes,
  Users,
  TrendingUp,
  ShieldCheck,
  Zap,
  BarChart3,
  Clock,
  FileSpreadsheet,
  Building2,
  Sparkles,
  ArrowRight,
  X,
  Menu,
  AlertTriangle,
  HardHat,
  Eye,
  Layers,
  FileCheck,
  Receipt,
  ChevronDown,
  Quote,
} from "lucide-react";

export default function LandingPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[#FFFDF0] text-navy-800 font-sans selection:bg-[#FFD23F] selection:text-navy-800">
      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white border-b-[3px] border-navy-800">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-[76px] flex items-center justify-between gap-4">
          <Logo size="md" />
          <div className="hidden lg:flex items-center gap-6 font-black uppercase text-sm tracking-widest">
            <Link href="/features" className="hover:underline decoration-[4px] underline-offset-4">Features</Link>
            <Link href="/how-it-works" className="hover:underline decoration-[4px] underline-offset-4">How it Works</Link>
            <Link href="/pricing" className="hover:underline decoration-[4px] underline-offset-4">Pricing</Link>
            <Link href="/about" className="hover:underline decoration-[4px] underline-offset-4">About</Link>
            <Link href="/contact" className="hover:underline decoration-[4px] underline-offset-4">Contact</Link>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <Link href="/login" className="px-5 py-3 bg-white border-[3px] border-navy-800 font-black uppercase text-sm tracking-wide hover:bg-[#FFF8D6] shadow-brutal-sm active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all">Sign In</Link>
            <Link href="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 bg-[#FFD23F] border-[3px] border-navy-800 font-black uppercase text-sm tracking-wide shadow-brutal-sm hover:bg-[#FFC11E] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all">Launch App <ArrowUpRight className="w-5 h-5" /></Link>
          </div>
          <button onClick={() => setMobileNavOpen(!mobileNavOpen)} className="lg:hidden w-11 h-11 bg-navy-800 border-[3px] border-navy-800 flex items-center justify-center text-white">
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {mobileNavOpen && (
          <div className="lg:hidden border-t-[3px] border-navy-800 bg-white p-4 space-y-3">
            <Link href="/features" onClick={() => setMobileNavOpen(false)} className="block px-4 py-3 bg-[#FFFDF0] border-[3px] border-navy-800 font-black uppercase text-sm">Features</Link>
            <Link href="/how-it-works" onClick={() => setMobileNavOpen(false)} className="block px-4 py-3 bg-[#FFFDF0] border-[3px] border-navy-800 font-black uppercase text-sm">How it Works</Link>
            <Link href="/pricing" onClick={() => setMobileNavOpen(false)} className="block px-4 py-3 bg-[#FFFDF0] border-[3px] border-navy-800 font-black uppercase text-sm">Pricing</Link>
            <Link href="/about" onClick={() => setMobileNavOpen(false)} className="block px-4 py-3 bg-[#FFFDF0] border-[3px] border-navy-800 font-black uppercase text-sm">About</Link>
            <Link href="/contact" onClick={() => setMobileNavOpen(false)} className="block px-4 py-3 bg-[#FFFDF0] border-[3px] border-navy-800 font-black uppercase text-sm">Contact</Link>
            <Link href="/dashboard" className="block text-center px-4 py-3 bg-[#FFD23F] border-[3px] border-navy-800 font-black uppercase text-sm">Launch App →</Link>
            <Link href="/login" className="block text-center px-4 py-3 bg-navy-800 text-white border-[3px] border-navy-800 font-black uppercase text-sm">Sign In</Link>
          </div>
        )}
      </nav>

      {/* HERO — larger */}
      <section className="relative overflow-hidden border-b-[3px] border-navy-800">
        <div className="absolute inset-0 bg-[#FFFDF0]" />
        <div className="absolute top-0 right-0 w-[62%] h-full bg-[#FFD23F] border-l-[3px] border-navy-800 hidden xl:block" style={{ clipPath: "polygon(18% 0, 100% 0, 100% 100%, 0% 100%)" }} />
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-navy-800 rotate-12 hidden md:block border-[3px] border-navy-800" />
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
          <div className="grid xl:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-navy-800 text-white px-4 py-2 border-[3px] border-navy-800 font-mono text-xs font-black uppercase tracking-widest shadow-brutal-sm mb-6">
                <Sparkles className="w-4 h-4 text-mustard-400" /> Construction Cost Intelligence — v2.0
              </div>
              <h1 className="font-display text-[46px] md:text-[64px] lg:text-[68px] leading-[0.88] tracking-tighter uppercase text-navy-800">
                Analyse.<br />
                <span className="bg-[#FFD23F] px-3 border-[3px] border-navy-800 shadow-brutal inline-block -rotate-1">Plan.</span><br />Build Smarter.
              </h1>
              <p className="mt-6 text-lg font-bold leading-relaxed text-navy-800/70 max-w-xl border-l-[5px] border-navy-800 pl-5">
                The unified system of record for <span className="bg-white px-1.5 border-[2px] border-navy-800 font-black text-navy-800">budget, procurement, site progress</span> and project margins. Stop spreadsheet chaos — command every naira from BOQ to final account with audit trails the QS can defend.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link href="/dashboard" className="px-8 py-4 bg-navy-800 text-white border-[3px] border-navy-800 font-black uppercase text-base tracking-wide shadow-brutal flex items-center gap-2 hover:bg-navy-700 active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all">Start Building Free <ArrowRight className="w-6 h-6 text-mustard-400" /></Link>
                <Link href="/register" className="px-8 py-4 bg-white border-[3px] border-navy-800 font-black uppercase text-base tracking-wide shadow-brutal hover:bg-[#FFF8D6] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all">Create Workspace</Link>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-4 text-sm font-black uppercase tracking-wide">
                <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> No credit card</span>
                <span className="w-2 h-2 bg-navy-800 rounded-full" /> <span>₦ NGN Native</span>
                <span className="w-2 h-2 bg-navy-800 rounded-full" /> <span>RBAC Ready</span>
                <span className="w-2 h-2 bg-navy-800 rounded-full" /> <span>8 Roles Seeded</span>
              </div>
              <div className="mt-6 flex items-center gap-4 p-4 bg-white border-[3px] border-navy-800 shadow-brutal-sm max-w-lg">
                <div className="flex -space-x-2">
                  {[ "PM","QS","SE","AC"].map((initial) => (
                    <div key={initial} className="w-9 h-9 rounded-full bg-navy-800 border-[2px] border-white flex items-center justify-center text-[10px] font-black text-white">{initial}</div>
                  ))}
                </div>
                <div>
                  <div className="text-sm font-black">Trusted by 120+ site teams</div>
                  <div className="text-xs font-bold text-navy-800/60">Victoria Island · Lekki · Eko Atlantic</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white border-[3px] border-navy-800 shadow-brutal-lg overflow-hidden">
                <div className="h-12 bg-navy-800 border-b-[3px] border-navy-800 flex items-center gap-2 px-4">
                  <span className="w-3.5 h-3.5 bg-[#FFD23F] border-2 border-white rounded-full" />
                  <span className="w-3.5 h-3.5 bg-white border-2 border-navy-800 rounded-full" />
                  <span className="w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full" />
                  <span className="ml-4 text-xs font-mono font-bold text-white/80 tracking-widest hidden sm:inline">COSTVIEW:// DASHBOARD — EKO ATLANTIC</span>
                </div>
                <div className="p-5 bg-[#FFFDF0]">
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-white border-[3px] border-navy-800 p-4 shadow-brutal-sm">
                      <div className="text-[11px] font-black uppercase tracking-widest text-navy-800/60">Approved Budget</div>
                      <div className="text-base font-black font-mono text-navy-800 mt-1">₦301.8M</div>
                      <div className="h-2 bg-[#FFD23F] border border-navy-800 mt-2" />
                    </div>
                    <div className="bg-navy-800 border-[3px] border-navy-800 p-4 shadow-brutal-sm text-white">
                      <div className="text-[11px] font-black uppercase tracking-widest text-white/60">Committed</div>
                      <div className="text-base font-black font-mono mt-1">₦292.2M</div>
                      <div className="h-2 bg-white mt-2" />
                    </div>
                    <div className="bg-[#FFD23F] border-[3px] border-navy-800 p-4 shadow-brutal-sm">
                      <div className="text-[11px] font-black uppercase tracking-widest">Actual Cost</div>
                      <div className="text-base font-black font-mono mt-1">₦216.4M</div>
                      <div className="h-2 bg-navy-800 mt-2" />
                    </div>
                  </div>
                  <div className="bg-white border-[3px] border-navy-800 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-black uppercase">BOQ Variance Tracker</span>
                      <span className="text-xs font-mono font-bold bg-red-500 text-white px-3 py-1 border border-navy-800">±5% THRESHOLD</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm font-bold">
                        <span className="w-20 font-mono font-black">CON-02.01</span>
                        <div className="flex-1 h-4 bg-[#FFFDF0] border-[3px] border-navy-800 flex">
                          <div className="h-full bg-navy-800 w-[78%]" /><div className="h-full bg-[#FFD23F] w-[12%]" />
                        </div>
                        <span className="font-mono text-xs bg-red-500 text-white px-2 py-1 border border-navy-800">OVER</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm font-bold">
                        <span className="w-20 font-mono font-black">STL-02.03</span>
                        <div className="flex-1 h-4 bg-[#FFFDF0] border-[3px] border-navy-800"><div className="h-full bg-navy-800 w-[92%]" /></div>
                        <span className="font-mono text-xs bg-navy-800 text-white px-2 py-1">ON TRACK</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="bg-red-500 border-[3px] border-navy-800 p-3 text-white font-black text-sm uppercase flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> 1 Payment Locked</div>
                    <div className="bg-white border-[3px] border-navy-800 p-3 font-black text-sm uppercase">+₦4M Revision Pending</div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-5 -left-5 bg-[#FFD23F] border-[3px] border-navy-800 px-5 py-3 shadow-brutal font-black uppercase text-sm hidden md:block">Secure · Auditable · Live</div>
              <div className="absolute -top-5 -right-5 bg-navy-800 text-white border-[3px] border-navy-800 px-4 py-3 shadow-brutal-sm font-mono text-xs font-black hidden md:block">ZERO SPREADSHEET DRIFT</div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR — expanded */}
      <section className="bg-navy-800 border-y-[3px] border-navy-800 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 divide-x-[3px] divide-white/20 divide-y-[3px] lg:divide-y-0">
          {[
            { k: "₦450M+", v: "Avg Budget Tracked / project" },
            { k: "3-WAY", v: "PO ⇄ GRN ⇄ Invoice Engine" },
            { k: "8 ROLES", v: "PM · QS · Engineer · Storekeeper" },
            { k: "99.9%", v: "Audit Trail Coverage" },
          ].map((s) => (
            <div key={s.k} className="px-6 py-6 md:py-8 text-center">
              <div className="text-3xl font-black font-mono tracking-tighter text-mustard-400">{s.k}</div>
              <div className="text-xs font-bold uppercase tracking-widest text-white/70 mt-1">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PROBLEM — new explanatory section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <div className="inline-block bg-red-500 text-white border-[3px] border-navy-800 px-4 py-2 font-black uppercase text-sm tracking-widest shadow-brutal-sm">The Problem</div>
            <h2 className="mt-4 text-3xl md:text-5xl font-display uppercase tracking-tighter leading-[0.9]">Spreadsheets <br /><span className="bg-navy-800 text-white px-2">Don&apos;t Scale</span></h2>
            <p className="mt-4 text-base font-bold text-navy-800/60 leading-relaxed">Every Nigerian contractor knows the drill: BOQ in Excel, POs in WhatsApp, deliveries on paper, invoices in email. By month 3, no one knows the true cost.</p>
            <div className="mt-8 space-y-4">
              {[
                { title: "₦4.35M lost on one delivery", desc: "A supplier billed 30 Tons, delivered 27. Without 3-way match, you pay for air." },
                { title: "±15% BOQ drift by month 6", desc: "No revision audit. QS can’t defend escalation. Client disputes." },
                { title: "Zero material visibility", desc: "Cement bags counted by eye. Stockouts delay slab pours by days." },
              ].map((item) => (
                <div key={item.title} className="flex gap-4 bg-white border-[3px] border-navy-800 p-4 shadow-brutal-sm">
                  <div className="w-10 h-10 bg-red-500 border-[2px] border-navy-800 flex items-center justify-center shrink-0 text-white"><AlertTriangle className="w-5 h-5" /></div>
                  <div>
                    <h4 className="font-black uppercase text-sm">{item.title}</h4>
                    <p className="text-sm font-bold text-navy-800/60 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white border-[3px] border-navy-800 shadow-brutal p-6">
              <h3 className="font-black uppercase tracking-tight text-navy-800 flex items-center gap-2"><HardHat className="w-6 h-6 text-navy-800" /> What Site Teams Actually Need</h3>
              <ul className="mt-4 space-y-3">
                {[
                  "One number for Approved vs Committed vs Actual — live",
                  "Every budget change needs a reason, forever searchable",
                  "PO quantity must equal GRN before invoice pays",
                  "Storekeeper sees on-hand / reserved / consumed instantly",
                  "PM sees margin, not just spend — 35% target vs 28% live",
                ].map((li) => (
                  <li key={li} className="flex items-start gap-3 text-sm font-bold leading-relaxed">
                    <span className="mt-1 w-6 h-6 bg-[#FFD23F] border-[2px] border-navy-800 flex items-center justify-center shrink-0"><CheckCircle2 className="w-4 h-4 text-navy-800" /></span>
                    <span>{li}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#FFD23F] border-[3px] border-navy-800 shadow-brutal p-6">
              <div className="flex items-center gap-2 font-black uppercase text-sm"><Eye className="w-5 h-5" /> The CostView Fix</div>
              <p className="text-sm font-bold mt-2 leading-relaxed">From BOQ Master → Requisition → RFQ → PO → GRN → 3-Way Match → Payment → Stock → Diary → Final Account. One chain, one truth. No drift.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES — expanded with bullets */}
      <section id="features" className="bg-white border-y-[3px] border-navy-800">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div>
              <div className="inline-block bg-[#FFD23F] border-[3px] border-navy-800 px-4 py-2 font-black uppercase text-sm tracking-widest shadow-brutal-sm">Platform Modules</div>
              <h2 className="mt-4 text-3xl md:text-5xl font-display uppercase tracking-tighter leading-none">Every Cost.<br />Every Site. <span className="bg-navy-800 text-white px-3">One View.</span></h2>
            </div>
            <p className="max-w-md text-base font-bold text-navy-800/60 border-l-[5px] border-navy-800 pl-5 leading-relaxed">Built for Nigerian reality — Naira-first, offline-tolerant, role-aware. From BOQ master to commercial margin.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Calculator, title: "BOQ & Budget Control", bullets: ["CSV import & lock baseline", "±5% variance threshold auto-flag", "Revision delta needs reason + approver", "Final account QS notes without blocking"] },
              { icon: ShoppingCart, title: "Procurement & 3-Way Match", bullets: ["Requisitions → RFQ → PO flow", "Supplier quote side-by-side", "GRN vs Invoice quantity lock", "Variance auto-holds payment"] },
              { icon: Boxes, title: "Materials & Stock", bullets: ["On-hand / Reserved / Consumed live", "Low-stock reorder alerts", "Inter-site transfers", "Consumption tied to BOQ line"] },
              { icon: Users, title: "Labour & Muster", bullets: ["Daily headcount & shift #", "Trade & gang attendance", "Overtime & payroll export", "Productivity per BOQ item"] },
              { icon: TrendingUp, title: "Site Diary & Snags", bullets: ["Weather-stamped logs", "48 workers, Shift #142 live", "Snag/NCR with photos", "Remediation status closed-loop"] },
              { icon: Building2, title: "Commercial Command", bullets: ["GDV ₦1.2B · Cost ₦780M", "35% margin live tracker", "Debt drawdown 58%", "Sales & receivables off-plan"] },
            ].map((f) => (
              <div key={f.title} className="bg-[#FFFDF0] border-[3px] border-navy-800 shadow-brutal p-6 hover:shadow-brutal-lg hover:-translate-y-1 transition-all flex flex-col">
                <div className="w-14 h-14 bg-navy-800 border-[3px] border-navy-800 flex items-center justify-center text-white mb-4"><f.icon className="w-7 h-7" /></div>
                <h3 className="font-black uppercase tracking-tight text-lg leading-none">{f.title}</h3>
                <ul className="mt-4 space-y-2 flex-1">
                  {f.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm font-bold"><span className="mt-1 w-2 h-2 bg-navy-800 shrink-0" />{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PERSONAS */}
      <section id="personas" className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-block bg-navy-800 text-white border-[3px] border-navy-800 px-4 py-2 font-black uppercase text-sm tracking-widest">Built For 8 Roles</div>
          <h2 className="mt-4 text-3xl md:text-5xl font-display uppercase tracking-tighter">Everyone Sees <span className="underline decoration-mustard-400 decoration-[10px]">Their Truth</span></h2>
          <p className="mt-3 text-base font-bold text-navy-800/60">RBAC ensures a Site Engineer never approves budget, and a QS never confirms delivery. Seeded demo users below — all password <span className="bg-[#FFD23F] border border-navy-800 px-1 font-mono font-black">DemoPass2026!</span></p>
        </div>
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { role: "Admin", user: "admin@costview.ng", desc: "Full access, role editor", color: "bg-red-500 text-white" },
            { role: "Project Manager", user: "pm@costview.ng", desc: "Budget + Procurement + Reports", color: "bg-navy-800 text-white" },
            { role: "Quantity Surveyor", user: "qs@costview.ng", desc: "BOQ · Variations · Valuations", color: "bg-[#FFD23F] text-navy-800" },
            { role: "Site Engineer", user: "site@costview.ng", desc: "Materials · Labour · Diary", color: "bg-white text-navy-800" },
            { role: "Procurement Officer", user: "procure@costview.ng", desc: "RFQ · PO · 3-Way Match", color: "bg-white text-navy-800" },
            { role: "Accountant", user: "acct@costview.ng", desc: "Invoices · Payments · Audit", color: "bg-[#FFFDF0] text-navy-800" },
            { role: "Storekeeper", user: "store@costview.ng", desc: "Stock · Issues · Transfers", color: "bg-[#FFD23F] text-navy-800" },
            { role: "Architect", user: "arch@costview.ng", desc: "Drawings · Variations · Snags", color: "bg-navy-800 text-white" },
          ].map((p) => (
            <div key={p.role} className="bg-white border-[3px] border-navy-800 shadow-brutal p-5">
              <div className={`w-full text-center py-1.5 font-black uppercase text-xs tracking-widest border-[2px] border-navy-800 mb-3 ${p.color}`}>{p.role}</div>
              <div className="font-mono text-sm font-black text-navy-800 truncate">{p.user}</div>
              <div className="text-xs font-bold text-navy-800/60 mt-1">{p.desc}</div>
              <div className="mt-3 text-[11px] font-mono font-bold bg-[#FFFDF0] border border-navy-800 px-2 py-1">pwd: DemoPass2026!</div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link href="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-navy-800 text-white border-[3px] border-navy-800 font-black uppercase text-sm shadow-brutal">Try Role Switcher →</Link>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="bg-[#FFFDF0] border-y-[3px] border-navy-800">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-16">
          <h3 className="text-center text-2xl md:text-3xl font-black uppercase tracking-tighter">Excel vs CostView</h3>
          <div className="mt-8 bg-white border-[3px] border-navy-800 shadow-brutal overflow-hidden">
            <div className="grid grid-cols-3 bg-navy-800 text-white font-black uppercase text-sm">
              <div className="p-4">Capability</div><div className="p-4 text-center bg-white/10">Excel / WhatsApp</div><div className="p-4 text-center bg-[#FFD23F] text-navy-800">CostView</div>
            </div>
            {[
              ["BOQ variance alert", "Manual, after month", "Auto ±5% flag"],
              ["PO-GRN-Invoice match", "Eyeball, error prone", "3-way auto-lock"],
              ["Stock on-hand live", "End-of-day guess", "Real-time gauge"],
              ["Audit trail", "No — overwritten", "Immutable, RLS"],
              ["Role access", "File share = leak", "8-role RBAC"],
              ["Commercial margin", "Separate spreadsheet", "Live 35% tracker"],
            ].map((row) => (
              <div key={row[0]} className="grid grid-cols-3 border-t-[3px] border-navy-800 text-sm font-bold">
                <div className="p-4 bg-[#FFFDF0] border-r-[3px] border-navy-800 font-black">{row[0]}</div>
                <div className="p-4 text-center border-r-[3px] border-navy-800 text-navy-800/60">{row[1]}</div>
                <div className="p-4 text-center bg-[#FFD23F] font-black flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4" /> {row[2]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — expanded */}
      <section id="how" className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-3xl md:text-5xl font-display uppercase tracking-tighter leading-none">From Chaos<br />To <span className="underline decoration-mustard-400 decoration-[10px]">Control</span> in 3 Steps</h2>
            <div className="mt-10 space-y-6">
              {[
                { n: "01", t: "Import BOQ & Lock Baseline", d: "CSV import → locked Approved Budget ₦301.8M. From now, every naira moved needs a delta + reason + approver. No silent edits.", bullets: ["Code · Description · Qty · Rate", "Category: Material / Labour / Plant / Subcon", "Threshold badge: On / Over / Under"] },
                { n: "02", t: "Execute & Auto-Match", d: "Site orders → RFQ quotes → PO → GRN photo → Invoice. Engine compares PO qty vs GRN vs Invoice — mismatch locks payment.", bullets: ["Requisition High/Critical triage", "RFQ 3-supplier side-by-side", "Billed 30T vs Delivered 27T → Auto-HOLD"] },
                { n: "03", t: "Close With Confidence", d: "Live variances, commercial GDV ₦1.2B, margin 35%, final account QS notes without blocking. Hand client a defensible close-out.", bullets: ["BOQ vs Actual variance note", "Interim Valuation cert", "Sales & receivables 40% realized"] },
              ].map((s) => (
                <div key={s.n} className="flex gap-5 bg-white border-[3px] border-navy-800 p-6 shadow-brutal">
                  <div className="w-14 h-14 shrink-0 bg-[#FFD23F] text-navy-800 border-[3px] border-navy-800 flex items-center justify-center font-black font-mono text-lg shadow-brutal-sm">{s.n}</div>
                  <div>
                    <h4 className="font-black uppercase text-lg leading-none">{s.t}</h4>
                    <p className="text-sm font-bold text-navy-800/60 mt-2 leading-relaxed">{s.d}</p>
                    <ul className="mt-3 space-y-1">{s.bullets.map((b) => (<li key={b} className="text-xs font-bold flex gap-2"><span className="text-navy-800">·</span>{b}</li>))}</ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6 lg:sticky lg:top-24">
            <div className="bg-navy-800 text-white border-[3px] border-navy-800 shadow-brutal p-6">
              <div className="flex items-center gap-2 font-black uppercase text-sm"><Zap className="w-6 h-6 text-mustard-400" /> Why Teams Switch</div>
              <ul className="mt-4 space-y-3">{[
                    "₦4.35M short-delivery caught before payment (auto 3-way match)",
                "±5% threshold — no silent bleed, QS alerted day 1",
                "Storekeeper: 840 bags on-hand, 800 min → healthy",
                "PM: 48 workers, Shift #142, 0 lost-time incidents",
              ].map((li) => (<li key={li} className="flex items-start gap-3 text-sm font-bold leading-relaxed"><CheckCircle2 className="w-5 h-5 text-mustard-400 shrink-0 mt-0.5" />{li}</li>))}</ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#FFD23F] border-[3px] border-navy-800 p-6 shadow-brutal"><BarChart3 className="w-8 h-8 mb-3" /><div className="font-black uppercase text-sm">Margin Live</div><div className="text-3xl font-black font-mono">35%</div><div className="text-xs font-bold uppercase">₦420M projected</div></div>
              <div className="bg-white border-[3px] border-navy-800 p-6 shadow-brutal"><ShieldCheck className="w-8 h-8 mb-3" /><div className="font-black uppercase text-sm">Audit Ready</div><div className="text-3xl font-black font-mono">100%</div><div className="text-xs font-bold uppercase text-navy-800/60">Every mutation logged</div></div>
            </div>
            <div className="bg-white border-[3px] border-navy-800 shadow-brutal p-6">
              <div className="flex gap-3">
                <Quote className="w-8 h-8 text-navy-800 shrink-0" />
                <div>
                  <p className="text-sm font-bold leading-relaxed">“Finally a QS can defend a variation. Before, we argued with screenshots. Now we show the audit log.”</p>
                  <div className="text-xs font-black uppercase mt-2">— Mrs. Nkechi, Quantity Surveyor · Eko Atlantic</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING — larger */}
      <section id="pricing" className="bg-white border-y-[3px] border-navy-800">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block bg-[#FFD23F] border-[3px] border-navy-800 px-5 py-2 font-black uppercase text-sm tracking-widest shadow-brutal-sm">Simple Pricing — Naira Friendly</div>
            <h2 className="mt-4 text-3xl md:text-5xl font-display uppercase tracking-tighter">Start Free. Scale When You Win.</h2>
            <p className="mt-3 text-base font-bold text-navy-800/60">One workspace per company. Unlimited projects. Pricing that respects Nigerian margins.</p>
          </div>
          <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { name: "Starter", price: "Free", sub: "For pilot teams", feats: ["1 Project live", "BOQ + Procurement", "3 Users + RBAC", "Community Support", "Cloud hosted"], cta: "Start Free", dark: false },
              { name: "Growth", price: "₦45k", sub: "/ month per project", feats: ["Unlimited Projects", "All Site Ops Modules", "Unlimited Users", "RBAC + Audit Log", "Priority WhatsApp", "CSV + Photo proofs"], cta: "Start 14-Day Trial", dark: true, badge: "Most Popular" },
              { name: "Enterprise", price: "Custom", sub: "For developers & groups", feats: ["Commercial Mode 18 modules", "Valuation & Claims", "Sales & Receivables", "Dedicated Success", "SLA & On-Prem", "Naira / USD billing"], cta: "Talk to Founders", dark: false },
            ].map((p) => (
              <div key={p.name} className={`${p.dark ? "bg-navy-800 text-white" : "bg-[#FFFDF0]"} border-[3px] border-navy-800 shadow-brutal p-8 relative flex flex-col min-h-[420px]`}>
                {p.badge && (<div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#FFD23F] text-navy-800 border-[3px] border-navy-800 px-4 py-1.5 font-black uppercase text-xs tracking-widest whitespace-nowrap shadow-brutal-sm">{p.badge}</div>)}
                <h3 className="font-black uppercase tracking-tight text-lg">{p.name}</h3>
                <div className={`mt-2 text-4xl font-black font-mono tracking-tighter ${p.dark ? "text-mustard-400" : "text-navy-800"}`}>{p.price}</div>
                <div className={`text-sm font-bold uppercase tracking-wide ${p.dark ? "text-white/60" : "text-navy-800/60"}`}>{p.sub}</div>
                <ul className="mt-6 space-y-3 flex-1">{p.feats.map((f) => (<li key={f} className="flex items-center gap-3 text-sm font-bold"><span className={`w-6 h-6 border-[2px] border-navy-800 flex items-center justify-center shrink-0 ${p.dark ? "bg-[#FFD23F] text-navy-800" : "bg-navy-800 text-white"}`}><CheckCircle2 className="w-4 h-4" /></span>{f}</li>))}</ul>
                <Link href={p.name === "Enterprise" ? "/register" : "/dashboard"} className={`mt-8 w-full text-center py-4 border-[3px] border-navy-800 font-black uppercase text-sm tracking-wide shadow-brutal-sm active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all ${p.dark ? "bg-[#FFD23F] text-navy-800 hover:bg-[#FFC11E]" : "bg-white hover:bg-white text-navy-800"}`}>{p.cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <h2 className="text-3xl md:text-4xl font-display uppercase tracking-tighter text-center">Questions? Brutally Honest Answers.</h2>
        <div className="mt-8 space-y-3">
          {[
            { q: "Do I need a credit card to start?", a: "No. Starter is free forever for 1 project. Add card only when you add projects. Naira billing via Paystack coming." },
            { q: "What if my site has patchy internet?", a: "Site diary & GRN photo are offline-first. Queue and sync when back on 4G. Audit log shows sync time." },
            { q: "How does RBAC work with 8 roles?", a: "Admin maps permission_keys to roles in role_access. PM sees budget+reports, Storekeeper only stock, QS only BOQ/claims. Seeded 8 users to try instantly." },
            { q: "Can I import my BOQ from Excel?", a: "Yes. CSV import modal parses code, description, unit, qty, rate, auto-computes budget_amount. Test with SUB-01.01…MEP-04.01 sample." },
            { q: "Is cloud setup required?", a: "No — start free, cloud sync is automatic. For self-hosting, contact us for on-prem options." },
            { q: "How is commercial margin computed?", a: "GDV ₦1.2B minus TDC ₦780M = ₦420M (35%). Debt 58% drawn, sales 40% collected live from claims + receivables." },
          ].map((item, idx) => (
            <div key={idx} className="bg-white border-[3px] border-navy-800 shadow-brutal">
              <button onClick={() => setOpenFaq(openFaq === idx ? null : idx)} className="w-full flex items-center justify-between p-5 text-left">
                <span className="font-black uppercase text-sm pr-4">{item.q}</span>
                <span className={`w-9 h-9 border-[3px] border-navy-800 flex items-center justify-center shrink-0 transition-colors ${openFaq === idx ? "bg-[#FFD23F]" : "bg-white"}`}><ChevronDown className={`w-5 h-5 transition-transform ${openFaq === idx ? "rotate-180" : ""}`} /></span>
              </button>
              {openFaq === idx && (<div className="px-5 pb-5 text-sm font-bold text-navy-800/70 leading-relaxed border-t-[3px] border-navy-800 bg-[#FFFDF0] pt-4">{item.a}</div>)}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy-800 border-y-[3px] border-navy-800 text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16 grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-display uppercase tracking-tighter leading-none">Ready To Tame<br /><span className="text-mustard-400">Your Next Build?</span></h2>
            <p className="mt-4 text-base font-bold text-white/70 max-w-lg">Join PMs, QSs and Site Engineers running ₦100M+ projects without spreadsheet drift. Launch in 2 minutes — 8 demo roles waiting.</p>
          </div>
          <div className="flex flex-wrap gap-4 lg:justify-end">
            <Link href="/dashboard" className="px-8 py-4 bg-[#FFD23F] text-navy-800 border-[3px] border-navy-800 font-black uppercase text-base tracking-wide shadow-[6px_6px_0px_0px_white] hover:bg-[#FFC11E] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all">Launch Dashboard →</Link>
            <Link href="/login" className="px-8 py-4 bg-white text-navy-800 border-[3px] border-navy-800 font-black uppercase text-base tracking-wide hover:bg-[#FFFDF0]">Sign In</Link>
          </div>
        </div>
      </section>

      <footer className="bg-[#FFFDF0] border-t-[3px] border-navy-800">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Logo size="sm" />
              <p className="mt-3 text-sm font-bold text-navy-800/60 leading-relaxed">Analyse · Plan · Build Smarter.<br />NAVY-BRUTAL v2</p>
            </div>
            <div>
              <h4 className="font-black uppercase text-sm">Product</h4>
              <ul className="mt-3 space-y-2 text-sm font-bold">
                <li><a href="#features" className="hover:underline">Features</a></li>
                <li><a href="#personas" className="hover:underline">For Teams</a></li>
                <li><a href="#pricing" className="hover:underline">Pricing</a></li>
                <li><Link href="/dashboard" className="hover:underline">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black uppercase text-sm">Resources</h4>
              <ul className="mt-3 space-y-2 text-sm font-bold">
                <li><Link href="/login" className="hover:underline">Sign In</Link></li>
                <li><Link href="/register" className="hover:underline">Register</Link></li>
                <li><span className="text-navy-800/40">Docs (soon)</span></li>
                <li><span className="text-navy-800/40">API (soon)</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black uppercase text-sm">Legal</h4>
              <ul className="mt-3 space-y-2 text-sm font-bold text-navy-800/60">
                <li>© 2026 CostView</li>
                <li>Live Sync · ₦ NGN</li>
                <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 bg-green-500 border-2 border-navy-800 rounded-full animate-pulse" /> All systems operational</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
