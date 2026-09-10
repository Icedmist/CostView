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
    <div className="min-h-screen bg-[#fbfbfb] text-[#1b1b1b] font-sans">
      <MarketingNav />

      <header className="border-b border-[#e5e5e5] bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-14">
          <div className="inline-block glass-hero text-white rounded-xl px-4 py-2 font-semibold text-sm">Get in Touch</div>
          <h1 className="mt-4 text-4xl md:text-5xl font-black tracking-tighter leading-none">Let’s Talk<br /><span className="bg-blue-50 text-[#0067c0] border-blue-200 border border-[#e5e5e5] px-2">Your Next Build.</span></h1>
          <p className="mt-4 text-base font-bold text-[#5c5c5c] max-w-2xl">Lagos-based, remote-friendly. We respond within 24 hours — often same day. For pilot teams, we onboard you live on your BOQ.</p>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-14">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white border border-[#e5e5e5] rounded-xl p-6 md:p-8 shadow-card">
            <h3 className="font-semibold text-lg">Send a Message</h3>
            <p className="text-sm font-bold text-[#5c5c5c] mt-1">Tell us about your project, team size, and current tools (Excel/WhatsApp/paper).</p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold tracking-widest mb-1">Full Name</label>
                  <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Engr. Babatunde" className="w-full bg-[#fbfbfb] border border-[#e5e5e5] px-3 py-3 text-sm font-bold" />
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-widest mb-1">Work Email</label>
                  <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@firm.ng" className="w-full bg-[#fbfbfb] border border-[#e5e5e5] px-3 py-3 text-sm font-bold" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-widest mb-1">Company</label>
                <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Julius Berger / Eko Atlantic" className="w-full bg-[#fbfbfb] border border-[#e5e5e5] px-3 py-3 text-sm font-bold" />
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-widest mb-1">Message</label>
                <textarea required rows={5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="We run 2 sites, 40 workers, BOQ in Excel, need 3-way match..." className="w-full bg-[#fbfbfb] border border-[#e5e5e5] px-3 py-3 text-sm font-bold" />
              </div>
              <button type="submit" className="w-full py-4 glass-hero text-white rounded-xl font-semibold text-sm shadow-card flex items-center justify-center gap-2">
                <Send className="w-4 h-4 text-[#0067c0]" /> Send Message
              </button>
              {sent && <div className="p-3 bg-green-500 text-white border border-[#e5e5e5] text-sm font-black text-center">Message sent — we’ll reply within 24 hours.</div>}
            </form>
          </div>

          <div className="space-y-4">
            <div className="glass-hero text-white rounded-xl p-6 shadow-card">
              <h4 className="font-semibold flex items-center gap-2"><MapPin className="w-5 h-5 text-[#0067c0]" /> Lagos</h4>
              <p className="text-sm font-bold text-white/70 mt-2">Victoria Island, Lagos, Nigeria<br />Available for site visits — Lekki, Eko Atlantic, Ikeja</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="bg-blue-50 text-[#0067c0] border-blue-200 text-[#1b1b1b] px-3 py-1 text-xs font-black border border-[#e5e5e5]">HQ: VI</span>
                <span className="bg-white text-[#1b1b1b] px-3 py-1 text-xs font-black border border-[#e5e5e5]">Remote: Nationwide</span>
              </div>
            </div>
            <div className="bg-white border border-[#e5e5e5] rounded-xl p-6 shadow-card">
              <h4 className="font-semibold flex items-center gap-2"><Mail className="w-5 h-5" /> Email & Phone</h4>
              <p className="text-sm font-bold mt-2">talk2icedmist@gmail.com<br />+234 803 000 0000 (9am–6pm WAT)</p>
              <div className="mt-3 flex items-center gap-2 text-xs font-bold text-[#5c5c5c]">
                <Clock className="w-4 h-4" /> Response SLA: 24 hours (often 4 hours)
              </div>
            </div>
            <div className="bg-[#fbfbfb] border border-[#e5e5e5] p-6 shadow-card">
              <h4 className="font-semibold">Pilot Onboarding</h4>
              <p className="text-sm font-bold text-[#5c5c5c] mt-2">We import your BOQ live on a call, set up your first project, and invite your 3 users — all in 60 minutes. Free.</p>
              <Link href="/register" className="mt-4 inline-block px-5 py-3 bg-blue-50 text-[#0067c0] border-blue-200 border border-[#e5e5e5] font-semibold text-sm shadow-xs">Create Workspace →</Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#fbfbfb] border-t border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/"><Logo size="sm" /></Link>
          <div className="flex gap-4 text-sm font-semibold">
            <Link href="/features" className="hover:underline">Features</Link>
            <Link href="/pricing" className="hover:underline">Pricing</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
