import Link from "next/link";
import { MarketingNav } from "@/components/marketing/nav";
import { Building2, Users, Zap, ShieldCheck, MapPin, Calendar, Code2, ArrowRight } from "lucide-react";

export const metadata = {
  title: "About — CostView 360",
  description: "Vision, architecture, and engineering principles behind CostView.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f7ff]/40 via-white to-[#f8fafc] text-slate-900 font-sans">
      <MarketingNav />

      {/* Hero */}
      <header className="border-b border-slate-200/80 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,103,192,0.12),rgba(255,255,255,0))]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-14 md:py-20 text-center max-w-3xl">
          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-[#0067c0] border border-blue-200/80 px-4 py-1.5 rounded-full text-xs font-semibold mb-4 shadow-xs">
            Our Mission &amp; Vision
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Engineered For <span className="bg-gradient-to-r from-[#0067c0] to-[#0284c7] bg-clip-text text-transparent">Builders Everywhere.</span>
          </h1>
          <p className="mt-4 text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            CostView originated from the painful reality of construction site cost overruns: lost paper site diaries, unrecorded variation claims, and spreadsheets that drift by month three. We unified the entire lifecycle into one verifiable system of record.
          </p>
        </div>
      </header>

      {/* Narrative & Architecture */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-14 md:py-20">
        <div className="grid lg:grid-cols-2 gap-10">
          <div className="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-8 shadow-card flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0067c0] flex items-center justify-center mb-4">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-xl text-slate-900">The Problem We Solve</h3>
              <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                Construction projects routinely lose 4% to 12% of their margin to payment leakage, uncertified variation claims, and unmonitored supplier overbilling. By replacing disconnected spreadsheets with an immutable, role-guarded database, CostView provides site engineers, quantity surveyors, and developers with one shared source of truth.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 pt-6 border-t border-slate-100">
              <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4">
                <MapPin className="w-5 h-5 text-[#0067c0] mb-2" />
                <div className="font-bold text-xs text-slate-900">Eko Atlantic</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Horizon Towers flagship implementation</div>
              </div>
              <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4">
                <MapPin className="w-5 h-5 text-[#0067c0] mb-2" />
                <div className="font-bold text-xs text-slate-900">Lekki &amp; Abuja</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Commercial mixed-use active deployments</div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 shadow-card">
              <div className="flex items-center gap-2.5 font-bold text-base text-slate-900 mb-2">
                <Users className="w-5 h-5 text-[#0067c0]" /> Built With Field Practitioners
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Co-designed alongside practicing Quantity Surveyors (NIQS), Project Managers, and Site Engineers to reflect Nigerian project realities — Naira-first calculations, dual-currency tolerance, and flexible stage-gate approvals.
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 shadow-card">
              <div className="flex items-center gap-2.5 font-bold text-base text-slate-900 mb-2">
                <Code2 className="w-5 h-5 text-[#0067c0]" /> Production-Grade Architecture
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#0067c0] rounded-full" />
                  <span><strong>Next.js 14 App Router</strong> with TypeScript &amp; Tailwind CSS</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#0067c0] rounded-full" />
                  <span><strong>Supabase PostgreSQL</strong> with 25 relational tables and Row-Level Security</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#0067c0] rounded-full" />
                  <span><strong>Vercel Edge Network</strong> for sub-50ms regional delivery</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/50 backdrop-blur-xl border border-blue-200/80 rounded-2xl p-6 shadow-card">
              <div className="flex items-center gap-2.5 font-bold text-base text-[#0067c0] mb-2">
                <Calendar className="w-5 h-5" /> Platform Evolution
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                From MVP foundations to full operational control: Budget, Three-Way Match, Inventory, Labour, Site Diary, Subcontractors, and 18-stage Commercial mode now live.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Value Strip */}
      <section className="bg-white/80 backdrop-blur-xl border-y border-slate-200/80 py-14">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid md:grid-cols-3 gap-6 text-center">
          <div className="p-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0067c0] flex items-center justify-center mx-auto mb-3">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-slate-900">High-Speed Execution</h4>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">Data linked from procurement through delivery without manual reconciliation.</p>
          </div>
          <div className="p-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-slate-900">Complete Audit Defense</h4>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">Every approval, revision, and delivery receipt logged with timestamped actors.</p>
          </div>
          <div className="p-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-slate-900">Role-Tailored Views</h4>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">Site teams focus on daily logs; HQ commands capital drawdowns and margins.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
