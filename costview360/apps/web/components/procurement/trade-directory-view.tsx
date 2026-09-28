"use client";

import React, { useState, useMemo } from "react";
import { formatCurrency } from "@/lib/utils";
import {
  Store,
  Search,
  Filter,
  CheckCircle2,
  ShieldCheck,
  Star,
  MapPin,
  Truck,
  Users,
  Phone,
  Mail,
  Send,
  Plus,
  ExternalLink,
  Award,
  Layers,
  Clock,
  BadgeCheck,
  X,
  FileText,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

interface SupplierItem {
  id: string;
  name: string;
  category: "Cement & Concrete" | "Structural Steel" | "Aggregates" | "Electrical & MEP" | "Finishes & Tiles" | "Plant & Heavy Equipment";
  location: string;
  cacNumber: string;
  isYardAudited: boolean;
  rating: number;
  reviewCount: number;
  leadTime: string;
  paymentTerms: string;
  keyProducts: { name: string; benchmarkPrice: string; unit: string }[];
  contactPerson: string;
  phone: string;
  email: string;
  verifiedProjectsCount: number;
}

interface ArtisanTradeItem {
  id: string;
  tradeName: string;
  specialty: "Iron Bending & Steel Fixing" | "Formwork & Carpentry" | "Blocklaying & Masonry" | "MEP Plumbing & Electrical" | "POP & Screeding" | "Tiling & Marble Fitting";
  leadMaster: string;
  crewCapacity: number;
  location: string;
  experienceYears: number;
  rating: number;
  completedJobs: number;
  safetyScore: string;
  benchmarkRates: { task: string; rate: string; unit: string }[];
  phone: string;
  verifiedBadges: string[];
}

const SAMPLE_SUPPLIERS: SupplierItem[] = [];

const SAMPLE_ARTISANS: ArtisanTradeItem[] = [];

export function TradeDirectoryView({
  onBack,
}: {
  onBack?: () => void;
} = {}) {
  const [activeTab, setActiveTab] = useState<"suppliers" | "artisans">("suppliers");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [rfqModalTarget, setRfqModalTarget] = useState<SupplierItem | ArtisanTradeItem | null>(null);
  const [rfqSuccessMessage, setRfqSuccessMessage] = useState<string | null>(null);

  // Filtered Suppliers
  const filteredSuppliers = useMemo(() => {
    return SAMPLE_SUPPLIERS.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.keyProducts.some((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchCat = selectedCategory === "All" || s.category === selectedCategory;
      const matchLoc = selectedLocation === "All" || s.location.includes(selectedLocation);
      return matchSearch && matchCat && matchLoc;
    });
  }, [searchQuery, selectedCategory, selectedLocation]);

  // Filtered Artisans
  const filteredArtisans = useMemo(() => {
    return SAMPLE_ARTISANS.filter((a) => {
      const matchSearch =
        a.tradeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.leadMaster.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.specialty.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === "All" || a.specialty === selectedCategory;
      const matchLoc = selectedLocation === "All" || a.location.includes(selectedLocation);
      return matchSearch && matchCat && matchLoc;
    });
  }, [searchQuery, selectedCategory, selectedLocation]);

  const handleSendRFQ = (e: React.FormEvent) => {
    e.preventDefault();
    if (rfqModalTarget) {
      setRfqSuccessMessage(
        `Quotation Enquiry (RFQ) successfully dispatched to ${"name" in rfqModalTarget ? rfqModalTarget.name : rfqModalTarget.tradeName}. Logged in Procurement Enquiries Register!`
      );
      setRfqModalTarget(null);
      setTimeout(() => setRfqSuccessMessage(null), 5000);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-[#0A2540] rounded-3xl p-7 md:p-10 text-white shadow-xl border-2 border-[#0A2540] relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-black uppercase tracking-wider px-3 py-1 bg-amber-400 text-[#0A2540] rounded-lg shadow-sm flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5" /> Vetted Construction Marketplace
              </span>
              <span className="text-white/80 text-xs font-bold">
                · Physical Yard &amp; Trade Audited
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">
              Vetted Supplier &amp; Artisan Trade Directory
            </h1>
            <p className="text-base text-white/80 mt-2 max-w-2xl font-normal leading-relaxed">
              Source verified building material suppliers, equipment hire companies, and vetted artisan trade crews across Nigeria with verified price benchmarks and direct RFQs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="min-h-[46px] px-5 py-2.5 bg-white/15 hover:bg-white/25 text-white border-2 border-white/20 rounded-xl text-sm font-black flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-white" />
                <span>Back to 3-Way Match</span>
              </button>
            )}
            <div className="bg-white/10 border-2 border-white/20 rounded-2xl p-4 text-center min-w-[140px]">
              <div className="text-2xl font-black font-mono text-white">{filteredSuppliers.length}</div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-white/70 mt-0.5">Vetted Suppliers</div>
            </div>
            <div className="bg-white/10 border-2 border-white/20 rounded-2xl p-4 text-center min-w-[140px]">
              <div className="text-2xl font-black font-mono text-emerald-400">{filteredArtisans.length}</div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-white/70 mt-0.5">Artisan Crews</div>
            </div>
          </div>
        </div>

        {rfqSuccessMessage && (
          <div className="mt-6 p-4 rounded-xl bg-emerald-950/90 border-2 border-emerald-400 text-emerald-100 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="text-sm font-bold">{rfqSuccessMessage}</div>
            </div>
            <button
              onClick={() => setRfqSuccessMessage(null)}
              className="text-xs font-black uppercase underline text-white hover:text-emerald-200"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Directory Tab Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border-2 border-[#E5E5DE] rounded-2xl p-2 shadow-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => {
              setActiveTab("suppliers");
              setSelectedCategory("All");
            }}
            className={`flex-1 sm:flex-initial min-h-[44px] px-6 rounded-xl text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === "suppliers"
                ? "bg-[#0A2540] text-white shadow-sm"
                : "bg-transparent text-slate-700 hover:bg-slate-100"
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Building Material Suppliers &amp; Plant ({SAMPLE_SUPPLIERS.length})</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("artisans");
              setSelectedCategory("All");
            }}
            className={`flex-1 sm:flex-initial min-h-[44px] px-6 rounded-xl text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === "artisans"
                ? "bg-[#0A2540] text-white shadow-sm"
                : "bg-transparent text-slate-700 hover:bg-slate-100"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Vetted Artisan Trade Crews ({SAMPLE_ARTISANS.length})</span>
          </button>
        </div>

        <div className="text-xs font-bold text-slate-500 pr-3">
          Showing {activeTab === "suppliers" ? filteredSuppliers.length : filteredArtisans.length} vetted entries
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border-2 border-[#E5E5DE] rounded-2xl p-4 shadow-xs grid sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={
              activeTab === "suppliers"
                ? "Search cement, rebar, pipes, supplier name..."
                : "Search trade, master name, iron bender..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-[#FAF9F5] border border-[#E5E5DE] rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-[#0A2540]"
          />
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full h-11 px-3 bg-[#FAF9F5] border border-[#E5E5DE] rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:border-[#0A2540]"
          >
            <option value="All">All Categories / Trades</option>
            {activeTab === "suppliers" ? (
              <>
                <option value="Cement & Concrete">Cement &amp; Concrete</option>
                <option value="Structural Steel">Structural Steel</option>
                <option value="Aggregates">Aggregates &amp; Sand</option>
                <option value="Electrical & MEP">Electrical &amp; MEP Cables</option>
                <option value="Finishes & Tiles">Finishes &amp; Tiles</option>
                <option value="Plant & Heavy Equipment">Plant &amp; Heavy Equipment</option>
              </>
            ) : (
              <>
                <option value="Iron Bending & Steel Fixing">Iron Bending &amp; Steel Fixing</option>
                <option value="Formwork & Carpentry">Formwork &amp; Carpentry</option>
                <option value="Blocklaying & Masonry">Blocklaying &amp; Masonry</option>
                <option value="MEP Plumbing & Electrical">MEP Plumbing &amp; Electrical</option>
              </>
            )}
          </select>
        </div>

        <div>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full h-11 px-3 bg-[#FAF9F5] border border-[#E5E5DE] rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:border-[#0A2540]"
          >
            <option value="All">All Locations &amp; States</option>
            <option value="Lagos">Lagos State (Island &amp; Mainland)</option>
            <option value="Ogun">Ogun State Corridor</option>
            <option value="Abuja">Abuja FCT</option>
            <option value="Rivers">Rivers / Port Harcourt</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Suppliers Tab */}
      {activeTab === "suppliers" && (
        filteredSuppliers.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-[#E5E5DE] rounded-3xl p-12 text-center space-y-3">
            <Store className="w-12 h-12 text-[#0A2540]/30 mx-auto" />
            <h3 className="text-lg font-black text-[#0A2540]">No Vetted Suppliers Found</h3>
            <p className="text-sm font-medium text-slate-500 max-w-md mx-auto">
              {searchQuery || selectedCategory !== "All" || selectedLocation !== "All"
                ? "No suppliers match your current filter parameters."
                : "No supplier directory entries available. Verified suppliers will appear here after physical yard audits."}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSuppliers.map((sup) => (
              <div
                key={sup.id}
                className="bg-white border-2 border-[#E5E5DE] rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Header Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg">
                      {sup.category}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-black">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{sup.rating}</span>
                      <span className="text-slate-400">({sup.reviewCount})</span>
                    </div>
                  </div>

                  {/* Company Name */}
                  <div>
                    <h3 className="text-lg font-black text-[#0A2540] leading-snug">{sup.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mt-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>{sup.location}</span>
                    </div>
                  </div>

                  {/* Verification Indicators */}
                  <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#E5E5DE] space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="font-bold flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> CAC Reg:
                      </span>
                      <span className="font-mono font-bold text-[#0A2540]">{sup.cacNumber}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="font-bold flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-blue-600" /> Lead Time:
                      </span>
                      <span className="font-bold text-slate-900">{sup.leadTime}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="font-bold flex items-center gap-1.5">
                        <BadgeCheck className="w-3.5 h-3.5 text-purple-600" /> Verified Projects:
                      </span>
                      <span className="font-mono font-bold text-purple-900">{sup.verifiedProjectsCount} Sites</span>
                    </div>
                  </div>

                  {/* Benchmark Rates */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-black uppercase tracking-wider text-slate-500">Live Benchmark Rates</div>
                    <div className="space-y-1">
                      {sup.keyProducts.map((prod, idx) => (
                        <div
                          key={idx}
                          className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                        >
                          <span className="font-semibold text-slate-800 line-clamp-1">{prod.name}</span>
                          <span className="font-mono font-black text-[#0A2540] shrink-0 ml-2">
                            {prod.benchmarkPrice} <span className="text-[10px] text-slate-500 font-normal">/ {prod.unit}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="mt-6 pt-4 border-t-2 border-[#E5E5DE] flex items-center gap-2.5">
                  <button
                    onClick={() => setRfqModalTarget(sup)}
                    className="flex-1 min-h-[44px] bg-[#0A2540] hover:bg-[#003366] text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Request RFQ Quote</span>
                  </button>
                  <a
                    href={`tel:${sup.phone}`}
                    className="min-h-[44px] px-3.5 bg-[#FAF9F5] hover:bg-slate-100 text-[#0A2540] border-2 border-[#E5E5DE] rounded-xl text-xs font-black flex items-center justify-center transition-all cursor-pointer"
                    title="Direct Call"
                  >
                    <Phone className="w-4 h-4 text-[#0A2540]" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Main Grid: Artisans Tab */}
      {activeTab === "artisans" && (
        filteredArtisans.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-[#E5E5DE] rounded-3xl p-12 text-center space-y-3">
            <Users className="w-12 h-12 text-[#0A2540]/30 mx-auto" />
            <h3 className="text-lg font-black text-[#0A2540]">No Artisan Crews Found</h3>
            <p className="text-sm font-medium text-slate-500 max-w-md mx-auto">
              {searchQuery || selectedCategory !== "All" || selectedLocation !== "All"
                ? "No artisan trade crews match your current filter parameters."
                : "No artisan trade crews registered yet. Vetted artisan crews will appear here once verified."}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
          {filteredArtisans.map((art) => (
            <div
              key={art.id}
              className="bg-white border-2 border-[#E5E5DE] rounded-3xl p-6 md:p-7 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-200 rounded-lg">
                    {art.specialty}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-black">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{art.rating}</span>
                    <span className="text-slate-400">({art.completedJobs} projects)</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-black text-[#0A2540] leading-tight">{art.tradeName}</h3>
                  <div className="text-xs font-bold text-slate-600 mt-1">
                    Master Craftsman: <strong className="text-slate-900">{art.leadMaster}</strong> · {art.experienceYears} Years Experience
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {art.verifiedBadges.map((b, i) => (
                    <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                      ✓ {b}
                    </span>
                  ))}
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-800 border border-purple-200">
                    Crew: {art.crewCapacity} Artisans
                  </span>
                </div>

                {/* Benchmark Rates */}
                <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E5E5DE] space-y-2">
                  <div className="text-[11px] font-black uppercase tracking-wider text-slate-500">Contract Rate Benchmarks</div>
                  {art.benchmarkRates.map((r, i) => (
                    <div key={i} className="flex justify-between items-center text-xs">
                      <span className="text-slate-700 font-medium">{r.task}</span>
                      <span className="font-mono font-black text-[#0A2540]">
                        {r.rate} <span className="text-[10px] text-slate-500 font-normal">/ {r.unit}</span>
                      </span>
                    </div>
                  ))}
                </div>

                <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Safety Record: <strong className="text-slate-800">{art.safetyScore}</strong></span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t-2 border-[#E5E5DE] flex items-center gap-3">
                <button
                  onClick={() => setRfqModalTarget(art)}
                  className="flex-1 min-h-[44px] bg-[#0A2540] hover:bg-[#003366] text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Request Work Tender</span>
                </button>
                <a
                  href={`tel:${art.phone}`}
                  className="min-h-[44px] px-4 bg-[#FAF9F5] hover:bg-slate-100 text-[#0A2540] border-2 border-[#E5E5DE] rounded-xl text-xs font-black flex items-center justify-center transition-all cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-[#0A2540] mr-1.5" />
                  <span>{art.phone}</span>
                </a>
              </div>
            </div>
          ))}
          </div>
        )
      )}

      {/* RFQ Tender Request Modal */}
      {rfqModalTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#0A2540] rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#E5E5DE]">
              <div>
                <h3 className="text-lg font-black text-[#0A2540]">
                  {"name" in rfqModalTarget ? "Dispatch RFQ Quotation Enquiry" : "Request Trade Work Tender"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  To: {"name" in rfqModalTarget ? rfqModalTarget.name : rfqModalTarget.tradeName}
                </p>
              </div>
              <button
                onClick={() => setRfqModalTarget(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendRFQ} className="space-y-4">
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-700">Project Worksite</label>
                <input
                  type="text"
                  defaultValue="Emerald Heights Commercial Tower, Victoria Island, Lagos"
                  className="w-full h-11 px-3.5 bg-[#FAF9F5] border border-[#E5E5DE] rounded-xl text-xs font-bold text-[#0A2540] mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-700">Material Items / Scope Required</label>
                <textarea
                  rows={3}
                  placeholder="e.g. 600 bags Dangote 42.5R cement, delivered to site in 2 tranches..."
                  className="w-full p-3.5 bg-[#FAF9F5] border border-[#E5E5DE] rounded-xl text-xs font-bold text-slate-900 mt-1 focus:outline-none focus:border-[#0A2540]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700">Required Delivery Date</label>
                  <input
                    type="date"
                    defaultValue="2026-09-28"
                    className="w-full h-11 px-3 bg-[#FAF9F5] border border-[#E5E5DE] rounded-xl text-xs font-bold text-slate-800 mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700">Payment Terms</label>
                  <select className="w-full h-11 px-3 bg-[#FAF9F5] border border-[#E5E5DE] rounded-xl text-xs font-bold text-slate-800 mt-1">
                    <option>Standard 3-Way Match Verification</option>
                    <option>30% Advance + 70% GRN Delivery</option>
                    <option>Direct Pro-Forma Invoice</option>
                  </select>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-950 font-medium">
                Enquiry will be logged into your <strong>Procurement Enquiries register (Section 4.3)</strong> and linked with your BOQ cost code.
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5E5DE]">
                <button
                  type="button"
                  onClick={() => setRfqModalTarget(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-6 bg-[#0A2540] hover:bg-[#003366] text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Quotation Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
