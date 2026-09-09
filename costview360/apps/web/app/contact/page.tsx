"use client";
import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { MarketingNav } from "@/components/marketing/nav";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setName(""); setEmail(""); setCompany(""); setMessage("");
  };

  return (
    <div className="min-h-screen bg-[#FFFDF0] text-navy-800 font-sans">
      <MarketingNav />

      <header className="border-b-[3px] border-navy-800 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-14">
          <div className="inline-block bg-navy-800 text-white border-[3px] border-navy-800 px-4 py-2 font-black uppercase text-sm">Get in Touch</div>
          <h1 className="mt-4 text-4xl md:text-5xl font-black tracking-tighter leading-none">Let’s Talk<br /><span className="bg-[#FFD23F] border-[3px] border-navy-800 px-2">Your Next Build.</span></h1>
          <p className="mt-4 text-base font-bold text-navy-800/60 max-w-2xl">Lagos-based, remote-friendly. We respond within 24 hours — often same day. For pilot teams, we onboard you live on your BOQ.</p>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-14">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white border-[3px] border-navy-800 p-6 md:p-8 shadow-brutal">
            <h3 className="font-black uppercase text-lg">Send a Message</h3>
            <p className="text-sm font-bold text-navy-800/60 mt-1">Tell us about your project, team size, and current tools (Excel/WhatsApp/paper).</p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest mb-1">Full Name</label>
                  <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Engr. Babatunde" className="w-full bg-[#FFFDF0] border-2 border-navy-800 px-3 py-3 text-sm font-bold" />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest mb-1">Work Email</label>
                  <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@firm.ng" className="w-full bg-[#FFFDF0] border-2 border-navy-800 px-3 py-3 text-sm font-bold" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest mb-1">Company</label>
                <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Julius Berger / Eko Atlantic" className="w-full bg-[#FFFDF0] border-2 border-navy-800 px-3 py-3 text-sm font-bold" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest mb-1">Message</label>
                <textarea required rows={5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="We run 2 sites, 40 workers, BOQ in Excel, need 3-way match..." className="w-full bg-[#FFFDF0] border-2 border-navy-800 px-3 py-3 text-sm font-bold" />
              </div>
              <button type="submit" className="w-full py-4 bg-navy-800 text-white border-2 border-navy-800 font-black uppercase text-sm shadow-brutal flex items-center justify-center gap-2">
                <Send className="w-4 h-4 text-mustard-400" /> Send Message
              </button>
              {sent && <div className="p-3 bg-green-500 text-white border-2 border-navy-800 text-sm font-black text-center">Message sent — we’ll reply within 24 hours.</div>}
            </form>
          </div>

          <div className="space-y-4">
            <div className="bg-navy-800 text-white border-[3px] border-navy-800 p-6 shadow-brutal">
              <h4 className="font-black uppercase flex items-center gap-2"><MapPin className="w-5 h-5 text-mustard-400" /> Lagos</h4>
              <p className="text-sm font-bold text-white/70 mt-2">Victoria Island, Lagos, Nigeria<br />Available for site visits — Lekki, Eko Atlantic, Ikeja</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="bg-[#FFD23F] text-navy-800 px-3 py-1 text-xs font-black border-2 border-navy-800">HQ: VI</span>
                <span className="bg-white text-navy-800 px-3 py-1 text-xs font-black border-2 border-navy-800">Remote: Nationwide</span>
              </div>
            </div>
            <div className="bg-white border-[3px] border-navy-800 p-6 shadow-brutal">
              <h4 className="font-black uppercase flex items-center gap-2"><Mail className="w-5 h-5" /> Email & Phone</h4>
              <p className="text-sm font-bold mt-2">talk2icedmist@gmail.com<br />+234 803 000 0000 (9am–6pm WAT)</p>
              <div className="mt-3 flex items-center gap-2 text-xs font-bold text-navy-800/60">
                <Clock className="w-4 h-4" /> Response SLA: 24 hours (often 4 hours)
              </div>
            </div>
            <div className="bg-[#FFFDF0] border-[3px] border-navy-800 p-6 shadow-brutal">
              <h4 className="font-black uppercase">Pilot Onboarding</h4>
              <p className="text-sm font-bold text-navy-800/60 mt-2">We import your BOQ live on a call, set up your first project, and invite your 3 users — all in 60 minutes. Free.</p>
              <Link href="/register" className="mt-4 inline-block px-5 py-3 bg-[#FFD23F] border-2 border-navy-800 font-black uppercase text-sm shadow-brutal-sm">Create Workspace →</Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#FFFDF0] border-t-[3px] border-navy-800">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/"><Logo size="sm" /></Link>
          <div className="flex gap-4 text-sm font-black uppercase">
            <Link href="/features" className="hover:underline">Features</Link>
            <Link href="/pricing" className="hover:underline">Pricing</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
