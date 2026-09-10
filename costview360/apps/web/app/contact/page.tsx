"use client";

import { useState } from "react";
import { MarketingNav } from "@/components/marketing/nav";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setName("");
    setEmail("");
    setCompany("");
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f7ff]/40 via-white to-[#f8fafc] text-slate-900 font-sans">
      <MarketingNav />

      {/* Hero */}
      <header className="border-b border-slate-200/80 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,103,192,0.12),rgba(255,255,255,0))]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-14 md:py-20 text-center max-w-3xl">
          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-[#0067c0] border border-blue-200/80 px-4 py-1.5 rounded-full text-xs font-semibold mb-4 shadow-xs">
            Direct Technical Advisory
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Let’s Discuss <span className="bg-gradient-to-r from-[#0067c0] to-[#0284c7] bg-clip-text text-transparent">Your Next Build.</span>
          </h1>
          <p className="mt-4 text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Based in Lagos, available globally. We onboard site teams and import master BOQs directly to get you running within 24 hours.
          </p>
        </div>
      </header>

      {/* Form & Contact Details */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-14 md:py-20">
        <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
          <div className="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-8 shadow-card">
            <h3 className="font-bold text-xl text-slate-900">Send a Message</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Tell us about your project scale, number of active sites, and current tools.
            </p>

            {sent ? (
              <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Thank you! Your message has been received. Our advisory team will reach out within 4 hours.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
                    <input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Engr. Babatunde"
                      className="w-full bg-slate-50/80 border border-slate-200/90 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0067c0] focus:ring-2 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Work Email</label>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@firm.ng"
                      className="w-full bg-slate-50/80 border border-slate-200/90 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0067c0] focus:ring-2 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Company / Organization</label>
                  <input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Horizon Towers / Lekki Developments"
                    className="w-full bg-slate-50/80 border border-slate-200/90 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0067c0] focus:ring-2 focus:ring-blue-500/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Project Description</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="We have 2 active sites, 45 site workers, BOQ in Excel, need 3-way match automation..."
                    className="w-full bg-slate-50/80 border border-slate-200/90 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0067c0] focus:ring-2 focus:ring-blue-500/10 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-[#0067c0] to-[#0284c7] hover:from-[#005ba1] hover:to-[#0275b0] text-white rounded-xl font-bold text-xs shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <Send className="w-4 h-4" /> Send Inquiry
                </button>
              </form>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-card space-y-4">
              <h4 className="font-bold text-base text-slate-900">Direct Contact</h4>
              <div className="flex items-center gap-3 text-xs text-slate-600">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0067c0] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800">support@costview.ng</div>
                  <div className="text-[11px] text-slate-400">Average response: &lt; 2 hours</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-600">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0067c0] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800">+234 810 000 2678</div>
                  <div className="text-[11px] text-slate-400">WhatsApp &amp; Direct Line</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-600">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0067c0] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800">Victoria Island, Lagos</div>
                  <div className="text-[11px] text-slate-400">Field support for Lagos &amp; Abuja</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-600">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0067c0] flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800">Mon – Sat, 7:00 AM – 7:00 PM WAT</div>
                  <div className="text-[11px] text-slate-400">Aligned with site operational hours</div>
                </div>
              </div>
            </div>

            <div className="glass-hero text-white rounded-3xl p-6 shadow-glass">
              <h4 className="font-bold text-base mb-1.5">Live BOQ Onboarding</h4>
              <p className="text-xs text-white/80 leading-relaxed">
                Want us to review your actual BOQ format? Attach your bill in your message or email us directly and our quantity surveyors will format it into CostView for your pilot.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
