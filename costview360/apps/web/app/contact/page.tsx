"use client";

import { useState } from "react";
import { MarketingNav } from "@/components/marketing/nav";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, Building2 } from "lucide-react";

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
    <div className="min-h-screen bg-[#FAF9F5] text-slate-900 font-sans selection:bg-[#0A2540] selection:text-white">
      <MarketingNav />

      {/* Hero */}
      <header className="border-b-2 border-[#E5E5DE] bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-[#FAF9F5] text-[#0A2540] border-2 border-[#E5E5DE] px-5 py-2 rounded-full text-sm font-black tracking-wide mb-6 shadow-xs">
            Direct Technical Advisory
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#0A2540] leading-tight">
            Let’s Discuss Your Next Build.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-[#0A2540]/80 leading-relaxed max-w-2xl mx-auto font-normal">
            Based in Lagos, available globally. We onboard site teams and import master BOQs directly to get you running within 24 hours.
          </p>
        </div>
      </header>

      {/* Form & Contact Details */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 max-w-6xl mx-auto items-start">
          {/* Form Card */}
          <div className="bg-white border-2 border-[#E5E5DE] rounded-3xl p-8 md:p-10 shadow-sm">
            <h2 className="font-black text-2xl md:text-3xl text-[#0A2540]">Send a Message</h2>
            <p className="text-base text-[#0A2540]/75 mt-2 leading-relaxed font-normal">
              Tell us about your project scale, number of active sites, and current operational tools.
            </p>

            {sent ? (
              <div className="mt-8 p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-900 text-base font-bold flex items-center gap-4 shadow-sm animate-in fade-in">
                <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
                <span>Thank you! Your message has been received. Our advisory team will reach out within 4 hours.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-black text-[#0A2540] mb-2">Full Name</label>
                    <input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Engr. Babatunde Adeyemi"
                      className="w-full h-12 bg-[#FAF9F5] border-2 border-[#E5E5DE] rounded-xl px-4 text-base font-bold text-[#0A2540] focus:outline-none focus:border-[#0A2540] focus:bg-white transition-all shadow-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-black text-[#0A2540] mb-2">Work Email</label>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="babatunde@horizon.ng"
                      className="w-full h-12 bg-[#FAF9F5] border-2 border-[#E5E5DE] rounded-xl px-4 text-base font-bold text-[#0A2540] focus:outline-none focus:border-[#0A2540] focus:bg-white transition-all shadow-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-black text-[#0A2540] mb-2">Company / Organization</label>
                  <input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Horizon Towers / Lekki Developments"
                    className="w-full h-12 bg-[#FAF9F5] border-2 border-[#E5E5DE] rounded-xl px-4 text-base font-bold text-[#0A2540] focus:outline-none focus:border-[#0A2540] focus:bg-white transition-all shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-[#0A2540] mb-2">Project Scale &amp; Current Setup</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="We have 2 active sites, 45 site workers, BOQ in Excel, need 3-way match gate and subcontractor ledger..."
                    className="w-full p-4 bg-[#FAF9F5] border-2 border-[#E5E5DE] rounded-xl text-base font-bold text-[#0A2540] focus:outline-none focus:border-[#0A2540] focus:bg-white transition-all shadow-xs leading-relaxed"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full min-h-[52px] py-4 bg-[#0A2540] hover:bg-[#003366] text-white rounded-xl font-black text-base shadow-lg shadow-[#0A2540]/25 flex items-center justify-center gap-3 transition-all active:scale-[0.98] cursor-pointer"
                >
                  <Send className="w-5 h-5" /> <span>Send Technical Inquiry</span>
                </button>
              </form>
            )}
          </div>

          {/* Contact Details Cards */}
          <div className="space-y-6">
            <div className="bg-white border-2 border-[#E5E5DE] rounded-3xl p-8 shadow-sm space-y-6">
              <h3 className="font-black text-xl md:text-2xl text-[#0A2540]">Direct Channels</h3>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#0A2540]/10 text-[#0A2540] flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-[#0A2540]" />
                </div>
                <div>
                  <div className="font-black text-base text-[#0A2540]">support@costview.ng</div>
                  <div className="text-sm font-semibold text-[#0A2540]/60 mt-0.5">Average response: &lt; 2 hours</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#0A2540]/10 text-[#0A2540] flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-[#0A2540]" />
                </div>
                <div>
                  <div className="font-black text-base text-[#0A2540]">+234 810 000 2678</div>
                  <div className="text-sm font-semibold text-[#0A2540]/60 mt-0.5">WhatsApp &amp; Direct Line</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#0A2540]/10 text-[#0A2540] flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-[#0A2540]" />
                </div>
                <div>
                  <div className="font-black text-base text-[#0A2540]">Victoria Island, Lagos</div>
                  <div className="text-sm font-semibold text-[#0A2540]/60 mt-0.5">Field support across Lagos &amp; Abuja</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#0A2540]/10 text-[#0A2540] flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-[#0A2540]" />
                </div>
                <div>
                  <div className="font-black text-base text-[#0A2540]">Mon — Sat: 07:30 — 18:30 WAT</div>
                  <div className="text-sm font-semibold text-[#0A2540]/60 mt-0.5">Site-hours active desk</div>
                </div>
              </div>
            </div>

            <div className="bg-[#FAF9F5] border-2 border-[#E5E5DE] rounded-3xl p-8 shadow-sm">
              <div className="flex items-center gap-3 font-black text-lg md:text-xl text-[#0A2540] mb-3">
                <Building2 className="w-6 h-6 text-[#0A2540]" />
                <span>On-Site Implementation Service</span>
              </div>
              <p className="text-base text-[#0A2540]/80 leading-relaxed font-normal">
                Our solutions engineering team provides hands-on on-site training for storekeepers, quantity surveyors, and project managers directly at your job site trailer.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
