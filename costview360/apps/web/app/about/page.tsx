import Link from "next/link";
import { MarketingNav } from "@/components/marketing/nav";
import {
  Building2,
  Users,
  Zap,
  ShieldCheck,
  MapPin,
  Calendar,
  Code2,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export const metadata = {
  title: "About — CostView",
  description: "Vision, architecture, and engineering principles behind CostView.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F5] text-slate-900 font-sans selection:bg-[#0A2540] selection:text-white">
      <MarketingNav />

      {/* Hero */}
      <header className="border-b-2 border-[#E5E5DE] bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-[#FAF9F5] text-[#0A2540] border-2 border-[#E5E5DE] px-5 py-2 rounded-full text-sm font-black tracking-wide mb-6 shadow-xs">
            Our Mission &amp; Vision
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#0A2540] leading-tight">
            Engineered For Builders Everywhere.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-[#0A2540]/80 leading-relaxed max-w-2xl mx-auto font-normal">
            CostView originated from the painful reality of construction site cost overruns: lost paper site diaries, unrecorded variation claims, and spreadsheets that drift by month three. We unified the entire lifecycle into one verifiable system of record.
          </p>
        </div>
      </header>

      {/* Narrative & Architecture */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12">
          <div className="bg-white border-2 border-[#E5E5DE] rounded-3xl p-8 md:p-10 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#0A2540] text-white flex items-center justify-center mb-6 shadow-md">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <h2 className="font-black text-2xl md:text-3xl text-[#0A2540]">The Problem We Solve</h2>
              <p className="text-base md:text-lg text-[#0A2540]/80 mt-4 leading-relaxed font-normal">
                Construction projects routinely lose 4% to 12% of their margin to payment leakage, uncertified variation claims, and unmonitored supplier overbilling. By replacing disconnected spreadsheets with an immutable, role-guarded database, CostView provides site engineers, quantity surveyors, and developers with one shared source of truth.
              </p>
            </div>

            <div className="mt-10 grid sm:grid-cols-2 gap-5 pt-8 border-t-2 border-[#E5E5DE]">
              <div className="bg-[#FAF9F5] border-2 border-[#E5E5DE] rounded-2xl p-5 shadow-xs">
                <MapPin className="w-6 h-6 text-[#0A2540] mb-2.5" />
                <div className="font-black text-base text-[#0A2540]">Eko Atlantic</div>
                <div className="text-sm font-semibold text-[#0A2540]/70 mt-1">Horizon Towers flagship implementation</div>
              </div>
              <div className="bg-[#FAF9F5] border-2 border-[#E5E5DE] rounded-2xl p-5 shadow-xs">
                <MapPin className="w-6 h-6 text-[#0A2540] mb-2.5" />
                <div className="font-black text-base text-[#0A2540]">Lekki &amp; Abuja</div>
                <div className="text-sm font-semibold text-[#0A2540]/70 mt-1">Commercial mixed-use active deployments</div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border-2 border-[#E5E5DE] rounded-2xl p-7 md:p-8 shadow-xs hover:border-[#0A2540] transition-colors">
              <div className="flex items-center gap-3 font-black text-lg md:text-xl text-[#0A2540] mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#0A2540]/10 text-[#0A2540] flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-[#0A2540]" />
                </div>
                <span>Built With Field Practitioners</span>
              </div>
              <p className="text-base text-[#0A2540]/80 leading-relaxed font-normal">
                Co-designed alongside practicing Quantity Surveyors (NIQS), Project Managers, and Site Engineers to reflect Nigerian project realities — Naira-first calculations, dual-currency tolerance, and flexible stage-gate approvals.
              </p>
            </div>

            <div className="bg-white border-2 border-[#E5E5DE] rounded-2xl p-7 md:p-8 shadow-xs hover:border-[#0A2540] transition-colors">
              <div className="flex items-center gap-3 font-black text-lg md:text-xl text-[#0A2540] mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#0A2540]/10 text-[#0A2540] flex items-center justify-center shrink-0">
                  <Code2 className="w-5 h-5 text-[#0A2540]" />
                </div>
                <span>Production-Grade Architecture</span>
              </div>
              <ul className="space-y-3 text-base font-semibold text-[#0A2540]/80">
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-2 h-2 bg-[#0A2540] rounded-full shrink-0" />
                  <span><strong>Next.js 14 App Router</strong> with TypeScript &amp; Tailwind CSS</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-2 h-2 bg-[#0A2540] rounded-full shrink-0" />
                  <span><strong>Supabase PostgreSQL</strong> with 25 relational tables and Row-Level Security</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-2 h-2 bg-[#0A2540] rounded-full shrink-0" />
                  <span><strong>Vercel Edge Network</strong> for sub-50ms regional delivery</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border-2 border-[#E5E5DE] rounded-2xl p-7 md:p-8 shadow-xs hover:border-[#0A2540] transition-colors">
              <div className="flex items-center gap-3 font-black text-lg md:text-xl text-[#0A2540] mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#0A2540]/10 text-[#0A2540] flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-[#0A2540]" />
                </div>
                <span>Platform Evolution</span>
              </div>
              <p className="text-base text-[#0A2540]/80 leading-relaxed font-normal">
                From MVP foundations to full operational control: Budget &amp; BOQ, Three-Way Match, Inventory, Labour, Site Diary, Subcontractor Ledger, and Executive Reports Studio now live across enterprise deployments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Value Strip */}
      <section className="bg-white border-y-2 border-[#E5E5DE] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-[#FAF9F5] border-2 border-[#E5E5DE] rounded-2xl shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-[#0A2540] text-white flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-black text-xl text-[#0A2540]">High-Speed Execution</h3>
            <p className="text-base text-[#0A2540]/75 mt-2.5 leading-relaxed font-normal">
              Data linked from procurement through delivery without manual reconciliation or double data entry.
            </p>
          </div>
          <div className="p-6 bg-[#FAF9F5] border-2 border-[#E5E5DE] rounded-2xl shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-[#0A2540] text-white flex items-center justify-center mx-auto mb-4 shadow-sm">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-black text-xl text-[#0A2540]">Complete Audit Defense</h3>
            <p className="text-base text-[#0A2540]/75 mt-2.5 leading-relaxed font-normal">
              Every approval, revision, and delivery receipt logged with timestamped actors and immutable records.
            </p>
          </div>
          <div className="p-6 bg-[#FAF9F5] border-2 border-[#E5E5DE] rounded-2xl shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-[#0A2540] text-white flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Users className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-black text-xl text-[#0A2540]">Role-Tailored Views</h3>
            <p className="text-base text-[#0A2540]/75 mt-2.5 leading-relaxed font-normal">
              Site teams focus on daily logs; HQ commands capital drawdowns, variances, and projected margins.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 text-center">
        <div className="bg-[#0A2540] p-8 md:p-14 text-white rounded-3xl relative overflow-hidden max-w-4xl mx-auto shadow-2xl border-2 border-[#0A2540]">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Ready to experience CostView?
          </h2>
          <p className="text-base md:text-lg text-white/80 mt-3.5 max-w-xl mx-auto font-normal">
            Test drive our live workspace pre-loaded with Horizon Towers enterprise construction data.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="min-h-[52px] px-8 py-4 bg-white text-[#0A2540] hover:bg-slate-100 rounded-xl font-black text-base shadow-lg transition-all active:scale-[0.98] flex items-center gap-2"
            >
              <span>Launch Live App Demo</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/contact"
              className="min-h-[52px] px-8 py-4 bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 rounded-xl font-black text-base shadow-xs transition-all flex items-center"
            >
              Contact Advisory Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
