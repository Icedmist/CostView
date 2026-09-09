import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { MarketingNav } from "@/components/marketing/nav";
import { Building2, Users, Zap, ShieldCheck, MapPin, Calendar, Code2 } from "lucide-react";

export const metadata = { title: "About — CostView", description: "Vision, team, and stack." };

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FFFDF0] text-navy-800 font-sans">
      <MarketingNav />

      <header className="border-b-[3px] border-navy-800 bg-navy-800 text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-14">
          <div className="inline-block bg-[#FFD23F] text-navy-800 border-[3px] border-navy-800 px-4 py-2 font-black uppercase text-sm">Our Story</div>
          <h1 className="mt-4 text-4xl md:text-5xl font-black tracking-tighter leading-none">For Builders Everywhere.</h1>
          <p className="mt-4 text-base font-bold text-white/70 max-w-2xl">CostView began with a lost laptop and a site diary that lived on paper. We fixed it by putting every cost — from BOQ to final account — in one auditable system, in Naira by default.</p>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-14">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white border-[3px] border-navy-800 p-6 md:p-8 shadow-brutal">
            <h3 className="font-black uppercase text-lg">Vision</h3>
            <p className="text-sm font-bold text-navy-800/60 mt-3 leading-relaxed">Analyse · Plan · Build Smarter. No more budget overruns surfacing only at final account. No more WhatsApp POs and paper GRNs. One true version of the budget everyone works against.</p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-[#FFFDF0] border-2 border-navy-800 p-4"><Building2 className="w-6 h-6 mb-2" /><div className="font-black uppercase text-xs">Eko Atlantic</div><div className="text-xs font-bold text-navy-800/60">Horizon Towers — flagship pilot</div></div>
              <div className="bg-[#FFD23F] border-2 border-navy-800 p-4"><MapPin className="w-6 h-6 mb-2" /><div className="font-black uppercase text-xs">Lekki</div><div className="text-xs font-bold">Commercial Complex — planning</div></div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-[#FFFDF0] border-[3px] border-navy-800 p-6 shadow-brutal">
              <h4 className="font-black uppercase flex items-center gap-2"><Users className="w-5 h-5" /> Who We Are</h4>
              <p className="text-sm font-bold text-navy-800/60 mt-2">Small team of PM, QS, and engineers who felt spreadsheet pain. Backed by Iced Mist. We build for site teams, not just HQ.</p>
            </div>
            <div className="bg-white border-[3px] border-navy-800 p-6 shadow-brutal">
              <h4 className="font-black uppercase flex items-center gap-2"><Code2 className="w-5 h-5" /> Stack</h4>
              <ul className="mt-3 space-y-2 text-sm font-bold">
                <li className="flex gap-2"><span className="w-2 h-2 bg-navy-800 mt-2 shrink-0" />Next.js 14 + TypeScript + Tailwind</li>
                <li className="flex gap-2"><span className="w-2 h-2 bg-[#FFD23F] mt-2 shrink-0 border border-navy-800" />Supabase Postgres (25 tables, RLS) — eu-central-1</li>
                <li className="flex gap-2"><span className="w-2 h-2 bg-navy-800 mt-2 shrink-0" />Vercel (frontend) + Supabase Pooler</li>
              </ul>
            </div>
            <div className="bg-navy-800 text-white border-[3px] border-navy-800 p-6 shadow-brutal">
              <h4 className="font-black uppercase flex items-center gap-2"><Calendar className="w-5 h-5 text-mustard-400" /> Timeline</h4>
              <p className="text-sm font-bold text-white/70 mt-2">Scaffold → Site Ops MVP → Commercial → Intelligence. Live today: Budget, Procurement, Materials, Labour, Progress, Subcontractors, Reports.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border-y-[3px] border-navy-800">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#FFFDF0] border-[3px] border-navy-800 p-6 shadow-brutal"><Zap className="w-8 h-8 mb-3" /><h4 className="font-black uppercase">Fast</h4><p className="text-sm font-bold text-navy-800/60 mt-2">Less typing — linked documents carry forward.</p></div>
            <div className="bg-[#FFD23F] border-[3px] border-navy-800 p-6 shadow-brutal"><Users className="w-8 h-8 mb-3" /><h4 className="font-black uppercase">Efficient</h4><p className="text-sm font-bold mt-2">Right module for right role, auto routing.</p></div>
            <div className="bg-navy-800 text-white border-[3px] border-navy-800 p-6 shadow-brutal"><ShieldCheck className="w-8 h-8 mb-3 text-mustard-400" /><h4 className="font-black uppercase">Auditable</h4><p className="text-sm font-bold text-white/70 mt-2">Every approval logged — actor + timestamp.</p></div>
          </div>
        </div>
      </section>

      <footer className="bg-[#FFFDF0] border-t-[3px] border-navy-800">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/"><Logo size="sm" /></Link>
          <div className="flex gap-4 text-sm font-black uppercase">
            <Link href="/features" className="hover:underline">Features</Link>
            <Link href="/contact" className="hover:underline">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
