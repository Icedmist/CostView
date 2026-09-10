import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { MarketingNav } from "@/components/marketing/nav";
import { Building2, Users, Zap, ShieldCheck, MapPin, Calendar, Code2 } from "lucide-react";

export const metadata = { title: "About — CostView", description: "Vision, team, and stack." };

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fbfbfb] text-[#1b1b1b] font-sans">
      <MarketingNav />

      <header className="border-b border-[#e5e5e5] glass-hero text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-14">
          <div className="inline-block bg-blue-50 text-[#0067c0] border-blue-200 text-[#1b1b1b] border border-[#e5e5e5] px-4 py-2 font-semibold text-sm">Our Story</div>
          <h1 className="mt-4 text-4xl md:text-5xl font-black tracking-tighter leading-none">For Builders Everywhere.</h1>
          <p className="mt-4 text-base font-bold text-white/70 max-w-2xl">CostView began with a lost laptop and a site diary that lived on paper. We fixed it by putting every cost — from BOQ to final account — in one auditable system, in Naira by default.</p>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-14">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white border border-[#e5e5e5] rounded-xl p-6 md:p-8 shadow-card">
            <h3 className="font-semibold text-lg">Vision</h3>
            <p className="text-sm font-bold text-[#5c5c5c] mt-3 leading-relaxed">Analyse · Plan · Build Smarter. No more budget overruns surfacing only at final account. No more WhatsApp POs and paper GRNs. One true version of the budget everyone works against.</p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-[#fbfbfb] border border-[#e5e5e5] p-4"><Building2 className="w-6 h-6 mb-2" /><div className="font-semibold text-xs">Eko Atlantic</div><div className="text-xs font-bold text-[#5c5c5c]">Horizon Towers — flagship pilot</div></div>
              <div className="bg-blue-50 text-[#0067c0] border-blue-200 border border-[#e5e5e5] p-4"><MapPin className="w-6 h-6 mb-2" /><div className="font-semibold text-xs">Lekki</div><div className="text-xs font-bold">Commercial Complex — planning</div></div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-[#fbfbfb] border border-[#e5e5e5] p-6 shadow-card">
              <h4 className="font-semibold flex items-center gap-2"><Users className="w-5 h-5" /> Who We Are</h4>
              <p className="text-sm font-bold text-[#5c5c5c] mt-2">Small team of PM, QS, and engineers who felt spreadsheet pain. Backed by Iced Mist. We build for site teams, not just HQ.</p>
            </div>
            <div className="bg-white border border-[#e5e5e5] rounded-xl p-6 shadow-card">
              <h4 className="font-semibold flex items-center gap-2"><Code2 className="w-5 h-5" /> Stack</h4>
              <ul className="mt-3 space-y-2 text-sm font-bold">
                <li className="flex gap-2"><span className="w-2 h-2 bg-navy-800 mt-2 shrink-0" />Next.js 14 + TypeScript + Tailwind</li>
                <li className="flex gap-2"><span className="w-2 h-2 bg-blue-50 text-[#0067c0] border-blue-200 mt-2 shrink-0 border border-[#e5e5e5]" />Supabase Postgres (25 tables, RLS) — eu-central-1</li>
                <li className="flex gap-2"><span className="w-2 h-2 bg-navy-800 mt-2 shrink-0" />Vercel (frontend) + Supabase Pooler</li>
              </ul>
            </div>
            <div className="glass-hero text-white rounded-xl p-6 shadow-card">
              <h4 className="font-semibold flex items-center gap-2"><Calendar className="w-5 h-5 text-[#0067c0]" /> Timeline</h4>
              <p className="text-sm font-bold text-white/70 mt-2">Scaffold → Site Ops MVP → Commercial → Intelligence. Live today: Budget, Procurement, Materials, Labour, Progress, Subcontractors, Reports.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border-y border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#fbfbfb] border border-[#e5e5e5] p-6 shadow-card"><Zap className="w-8 h-8 mb-3" /><h4 className="font-semibold">Fast</h4><p className="text-sm font-bold text-[#5c5c5c] mt-2">Less typing — linked documents carry forward.</p></div>
            <div className="bg-blue-50 text-[#0067c0] border-blue-200 border border-[#e5e5e5] p-6 shadow-card"><Users className="w-8 h-8 mb-3" /><h4 className="font-semibold">Efficient</h4><p className="text-sm font-bold mt-2">Right module for right role, auto routing.</p></div>
            <div className="glass-hero text-white rounded-xl p-6 shadow-card"><ShieldCheck className="w-8 h-8 mb-3 text-[#0067c0]" /><h4 className="font-semibold">Auditable</h4><p className="text-sm font-bold text-white/70 mt-2">Every approval logged — actor + timestamp.</p></div>
          </div>
        </div>
      </section>

      <footer className="bg-[#fbfbfb] border-t border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/"><Logo size="sm" /></Link>
          <div className="flex gap-4 text-sm font-semibold">
            <Link href="/features" className="hover:underline">Features</Link>
            <Link href="/contact" className="hover:underline">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
