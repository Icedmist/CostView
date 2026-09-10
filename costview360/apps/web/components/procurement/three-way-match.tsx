"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/app/providers";
import { formatCurrency } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import {
  CheckCircle,
  AlertTriangle,
  Lock,
  Unlock,
  FileText,
  ArrowRight,
  Plus,
  Search,
  Star,
  Download,
  CreditCard,
  Ban,
  Truck,
  Check,
  X,
  Layers,
  Clock,
  ThumbsUp,
  Receipt,
  Eye,
  BadgeCheck,
} from "lucide-react";

interface ThreeWayMatchRecord {
  id: string;
  poNumber: string;
  supplierName: string;
  itemDescription: string;
  poQty: number;
  poRate: number;
  poTotal: number;
  paymentTerms: "Pay After Delivery" | "Pay First" | "30% Advance";
  grnNumber: string;
  grnQtyReceived: number;
  invoiceNumber: string;
  invoiceQtyBilled: number;
  invoiceRateBilled: number;
  invoiceTotal: number;
  matchStatus: "Matched" | "Discrepancy" | "Paid" | "Payment Held";
  discrepancyReason?: string;
  paymentLocked: boolean;
  paidAt?: string;
  paymentMethod?: string;
  deliveryQualityScore?: number;
}

interface Requisition {
  id: string;
  reqNumber: string;
  itemDescription: string;
  quantity: number;
  unit: string;
  estimatedCost: number;
  urgency: "Normal" | "High" | "Critical";
  status: "Pending Approval" | "Approved" | "Rejected";
  requestedBy: string;
  date: string;
}

interface SupplierEnquiry {
  id: string;
  enquiryNumber: string;
  itemDescription: string;
  quantity: number;
  unit: string;
  suppliersQuoted: { name: string; quoteRate: number; leadDays: number }[];
  selectedSupplier?: string;
  status: "Open" | "Quotes Received" | "Converted to PO";
}

const SAMPLE_MATCHES: ThreeWayMatchRecord[] = [
  {
    id: "match-1",
    poNumber: "PO-2026-088",
    supplierName: "Dangote Cement Plc",
    itemDescription: "Ordinary Portland Cement 42.5R (50kg bags)",
    poQty: 600,
    poRate: 9800,
    poTotal: 5880000,
    paymentTerms: "Pay After Delivery",
    grnNumber: "GRN-0941",
    grnQtyReceived: 600,
    invoiceNumber: "INV-DANG-9920",
    invoiceQtyBilled: 600,
    invoiceRateBilled: 9800,
    invoiceTotal: 5880000,
    matchStatus: "Matched",
    paymentLocked: false,
    deliveryQualityScore: 5,
  },
  {
    id: "match-2",
    poNumber: "PO-2026-092",
    supplierName: "Pulkit Steels & Alloys Ltd",
    itemDescription: "16mm High Tensile TMT Rebar (Tons)",
    poQty: 30,
    poRate: 1450000,
    poTotal: 43500000,
    paymentTerms: "30% Advance",
    grnNumber: "GRN-0955",
    grnQtyReceived: 27, // 3 tons short!
    invoiceNumber: "INV-PULK-4102",
    invoiceQtyBilled: 30, // Billed full 30 tons
    invoiceRateBilled: 1450000,
    invoiceTotal: 43500000,
    matchStatus: "Discrepancy",
    discrepancyReason: "Short delivery: 27 Tons received vs 30 Tons invoiced (₦4,350,000 variance)",
    paymentLocked: true,
  },
  {
    id: "match-3",
    poNumber: "PO-2026-095",
    supplierName: "Lafarge ReadyMix Nigeria",
    itemDescription: "Grade 30 ReadyMix Concrete (m³)",
    poQty: 120,
    poRate: 195000,
    poTotal: 23400000,
    paymentTerms: "Pay After Delivery",
    grnNumber: "GRN-0960",
    grnQtyReceived: 120,
    invoiceNumber: "INV-LAF-8819",
    invoiceQtyBilled: 120,
    invoiceRateBilled: 195000,
    invoiceTotal: 23400000,
    matchStatus: "Paid",
    paymentLocked: false,
    paidAt: "2026-09-06 16:30",
    paymentMethod: "Direct Bank Transfer (Zenith Bank)",
    deliveryQualityScore: 4.8,
  },
];

const INITIAL_REQUISITIONS: Requisition[] = [
  {
    id: "req-1",
    reqNumber: "REQ-2026-041",
    itemDescription: "Rapid hardening admixture drums (200L) for slab pour",
    quantity: 6,
    unit: "Drums",
    estimatedCost: 1850000,
    urgency: "High",
    status: "Pending Approval",
    requestedBy: "Engr. Tayo (Site Eng)",
    date: "2026-09-07 08:30",
  },
  {
    id: "req-2",
    reqNumber: "REQ-2026-042",
    itemDescription: "Safety helmets (EN397 certified) and reflective vests",
    quantity: 50,
    unit: "Sets",
    estimatedCost: 750000,
    urgency: "Normal",
    status: "Approved",
    requestedBy: "HSE Officer",
    date: "2026-09-06 11:15",
  },
];

const INITIAL_ENQUIRIES: SupplierEnquiry[] = [
  {
    id: "enq-1",
    enquiryNumber: "RFQ-2026-018",
    itemDescription: "20mm Crushed Granite Aggregate (Tons)",
    quantity: 150,
    unit: "Tons",
    status: "Quotes Received",
    suppliersQuoted: [
      { name: "Julius Berger Quarry", quoteRate: 21500, leadDays: 2 },
      { name: "Dangote Granites", quoteRate: 20200, leadDays: 3 },
      { name: "Mid-West Aggregates Ltd", quoteRate: 19800, leadDays: 5 },
    ],
  },
];

export function ThreeWayMatchView() {
  const { currency, activeRole } = useApp();
  const [subTab, setSubTab] = useState<"match" | "requisitions" | "enquiries" | "invoices" | "payments">("match");

  const [records, setRecords] = useState<ThreeWayMatchRecord[]>(SAMPLE_MATCHES);
  const [requisitions, setRequisitions] = useState<Requisition[]>(INITIAL_REQUISITIONS);
  const [enquiries, setEnquiries] = useState<SupplierEnquiry[]>(INITIAL_ENQUIRIES);

  // Modals
  const [isNewReqOpen, setIsNewReqOpen] = useState(false);
  const [isNewEnquiryOpen, setIsNewEnquiryOpen] = useState(false);
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);
  const [isProcessPaymentOpen, setIsProcessPaymentOpen] = useState(false);
  const [isRateDeliveryOpen, setIsRateDeliveryOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ThreeWayMatchRecord | null>(null);

  // Form states
  const [reqDesc, setReqDesc] = useState("");
  const [reqQty, setReqQty] = useState<number>(10);
  const [reqUnit, setReqUnit] = useState("Bags");
  const [reqEstCost, setReqEstCost] = useState<number>(500000);
  const [reqUrgency, setReqUrgency] = useState<Requisition["urgency"]>("Normal");

  const [enqDesc, setEnqDesc] = useState("");
  const [enqQty, setEnqQty] = useState<number>(50);
  const [enqUnit, setEnqUnit] = useState("Tons");

  const [invNumber, setInvNumber] = useState("");
  const [invSupplier, setInvSupplier] = useState("");
  const [invAmount, setInvAmount] = useState<number>(1000000);

  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer (Zenith Bank)");
  const [ratingScore, setRatingScore] = useState<number>(5);
  const [ratingNote, setRatingNote] = useState("");

  // 1. Resolve Discrepancy (PRD #8)
  const handleResolveDiscrepancy = (id: string) => {
    setRecords((prev) =>
      prev.map((rec) => {
        if (rec.id === id) {
          return {
            ...rec,
            matchStatus: "Matched",
            paymentLocked: false,
            invoiceQtyBilled: rec.grnQtyReceived,
            invoiceTotal: rec.grnQtyReceived * rec.poRate,
            discrepancyReason: undefined,
          };
        }
        return rec;
      })
    );
  };

  // 2. Add New Requisition (PRD #5)
  const handleCreateRequisition = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq: Requisition = {
      id: `req-${Date.now()}`,
      reqNumber: `REQ-2026-0${requisitions.length + 43}`,
      itemDescription: reqDesc,
      quantity: reqQty,
      unit: reqUnit,
      estimatedCost: reqEstCost,
      urgency: reqUrgency,
      status: "Pending Approval",
      requestedBy: activeRole,
      date: new Date().toISOString().replace("T", " ").substring(0, 16),
    };
    setRequisitions([newReq, ...requisitions]);
    setIsNewReqOpen(false);
    setReqDesc("");
  };

  const handleUpdateReqStatus = (id: string, status: "Approved" | "Rejected") => {
    setRequisitions((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  // 3. Add Supplier Enquiry (PRD #6)
  const handleCreateEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    const newEnq: SupplierEnquiry = {
      id: `enq-${Date.now()}`,
      enquiryNumber: `RFQ-2026-0${enquiries.length + 19}`,
      itemDescription: enqDesc,
      quantity: enqQty,
      unit: enqUnit,
      status: "Open",
      suppliersQuoted: [
        { name: "Certified Supplier A", quoteRate: 20500, leadDays: 3 },
        { name: "Direct Distributor B", quoteRate: 19900, leadDays: 4 },
      ],
    };
    setEnquiries([newEnq, ...enquiries]);
    setIsNewEnquiryOpen(false);
    setEnqDesc("");
  };

  // 4. Log New Invoice (PRD #9)
  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: ThreeWayMatchRecord = {
      id: `match-${Date.now()}`,
      poNumber: `PO-2026-0${records.length + 96}`,
      supplierName: invSupplier,
      itemDescription: "Site Procurement Materials",
      poQty: 100,
      poRate: invAmount / 100,
      poTotal: invAmount,
      paymentTerms: "Pay After Delivery",
      grnNumber: `GRN-0${records.length + 961}`,
      grnQtyReceived: 100,
      invoiceNumber: invNumber,
      invoiceQtyBilled: 100,
      invoiceRateBilled: invAmount / 100,
      invoiceTotal: invAmount,
      matchStatus: "Matched",
      paymentLocked: false,
    };
    setRecords([newRecord, ...records]);
    setIsNewInvoiceOpen(false);
    setInvNumber("");
    setInvSupplier("");
  };

  // 5. Process Payment / Hold Payment (PRD #10)
  const handleOpenProcessPayment = (rec: ThreeWayMatchRecord) => {
    setSelectedRecord(rec);
    setIsProcessPaymentOpen(true);
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;

    setRecords((prev) =>
      prev.map((r) =>
        r.id === selectedRecord.id
          ? {
              ...r,
              matchStatus: "Paid",
              paymentLocked: false,
              paidAt: new Date().toISOString().replace("T", " ").substring(0, 16),
              paymentMethod,
            }
          : r
      )
    );
    setIsProcessPaymentOpen(false);
  };

  const handleHoldPayment = (id: string) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, matchStatus: "Payment Held", paymentLocked: true } : r
      )
    );
  };

  // 6. Rate Delivery (PRD #11)
  const handleOpenRateDelivery = (rec: ThreeWayMatchRecord) => {
    setSelectedRecord(rec);
    setRatingScore(rec.deliveryQualityScore || 5);
    setRatingNote("");
    setIsRateDeliveryOpen(true);
  };

  const handleSaveDeliveryRating = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;

    setRecords((prev) =>
      prev.map((r) =>
        r.id === selectedRecord.id ? { ...r, deliveryQualityScore: ratingScore } : r
      )
    );
    setIsRateDeliveryOpen(false);
  };

  return (
    <div className="bg-white/90 backdrop-blur-md border border-[#e5e5e5] rounded-xl shadow-xs overflow-hidden space-y-4">
      {/* Subnavigation Bar */}
      <div className="p-2.5 bg-[#f8f9fa] border-b border-[#e5e5e5] flex items-center justify-between overflow-x-auto gap-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSubTab("match")}
            className={`px-3 py-1.5 border border-[#e5e5e5] text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              subTab === "match"
                ? "bg-white text-[#0067c0] border border-[#e5e5e5] shadow-xs rounded-md"
                : "text-[#5c5c5c] hover:text-[#1b1b1b] hover:bg-black/5 rounded-md"
            }`}
          >
            <BadgeCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>2.1 Three-Way Match</span>
          </button>

          <button
            onClick={() => setSubTab("requisitions")}
            className={`px-3.5 py-2 border border-[#e5e5e5] text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              subTab === "requisitions"
                ? "bg-white text-[#0067c0] border border-[#e5e5e5] shadow-xs rounded-md"
                : "text-[#5c5c5c] hover:text-[#1b1b1b] hover:bg-black/5 rounded-md"
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>2.2 Requisitions</span>
            {requisitions.filter((r) => r.status === "Pending Approval").length > 0 && (
              <span className="text-[11px] bg-amber-100 text-amber-800 px-1.5 py-0.5 font-mono font-semibold border border-amber-200 rounded">
                {requisitions.filter((r) => r.status === "Pending Approval").length}
              </span>
            )}
          </button>

          <button
            onClick={() => setSubTab("enquiries")}
            className={`px-3.5 py-2 border border-[#e5e5e5] text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              subTab === "enquiries"
                ? "bg-white text-[#0067c0] border border-[#e5e5e5] shadow-xs rounded-md"
                : "text-[#5c5c5c] hover:text-[#1b1b1b] hover:bg-black/5 rounded-md"
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-blue-400" />
            <span>2.3 Enquiries & Quotes</span>
          </button>

          <button
            onClick={() => setSubTab("invoices")}
            className={`px-3.5 py-2 border border-[#e5e5e5] text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              subTab === "invoices"
                ? "bg-white text-[#0067c0] border border-[#e5e5e5] shadow-xs rounded-md"
                : "text-[#5c5c5c] hover:text-[#1b1b1b] hover:bg-black/5 rounded-md"
            }`}
          >
            <Receipt className="w-3.5 h-3.5 text-purple-400" />
            <span>2.6 Invoices & Credits</span>
          </button>

          <button
            onClick={() => setSubTab("payments")}
            className={`px-3.5 py-2 border border-[#e5e5e5] text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              subTab === "payments"
                ? "bg-white text-[#0067c0] border border-[#e5e5e5] shadow-xs rounded-md"
                : "text-[#5c5c5c] hover:text-[#1b1b1b] hover:bg-black/5 rounded-md"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
            <span>2.7 Payments Ledger</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: 3-WAY MATCH MATRIX */}
      {subTab === "match" && (
        <div>
          <div className="p-4 border-b border-[#e5e5e5] flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-[#1b1b1b] flex items-center gap-2">
                <span>Three-Way Financial Match Engine</span>
                <span className="text-xs bg-emerald-100 text-emerald-900 px-2.5 py-1 font-mono font-black border border-[#e5e5e5]">
                  PO ⇄ GRN ⇄ Invoice
                </span>
              </h3>
              <p className="text-xs font-bold text-[#1b1b1b]/70 mt-0.5">
                Automated quantity and unit rate cross-validation per PRD Section 2.
              </p>
            </div>
            <button
              onClick={() => setIsNewInvoiceOpen(true)}
              className="px-3.5 py-1.5 bg-[#0067c0] hover:bg-[#005ba1] text-white rounded-md text-xs font-semibold uppercase tracking-wider shadow-xs transition-all active:scale-[0.98] flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Supplier Invoice</span>
            </button>
          </div>

          <div className="divide-y-2 divide-navy-800/20">
            {records.map((rec) => (
              <div key={rec.id} className="p-4 hover:bg-[#fbfbfb]/40 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-emerald-600 text-xs">
                        {rec.poNumber}
                      </span>
                      <span className="text-[#1b1b1b]/40">·</span>
                      <span className="font-black text-[#1b1b1b] text-xs">{rec.supplierName}</span>
                      <span className="text-[#1b1b1b]/40">·</span>
                      <span className="text-xs font-bold text-[#1b1b1b]/70">{rec.itemDescription}</span>
                      <span className="text-[#1b1b1b]/40">·</span>
                      <span className="text-xs text-[#1b1b1b] bg-[#fbfbfb] px-2.5 py-0.5 font-mono font-bold border border-[#e5e5e5]">
                        Terms: {rec.paymentTerms}
                      </span>
                    </div>

                    {/* 3 Steps Matrix */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 bg-[#fbfbfb]/60 p-3 border border-[#e5e5e5]">
                      {/* Step 1: PO */}
                      <div>
                        <div className="text-xs font-black text-[#1b1b1b]/60 uppercase tracking-wider mb-1">
                          1. Purchase Order
                        </div>
                        <div className="text-xs font-mono text-[#1b1b1b] font-bold">
                          Qty: <span className="font-black text-[#1b1b1b]">{rec.poQty}</span> @ {formatCurrency(rec.poRate, currency)}
                        </div>
                        <div className="text-xs font-mono font-black text-[#1b1b1b] mt-0.5">
                          Total: {formatCurrency(rec.poTotal, currency)}
                        </div>
                      </div>

                      {/* Step 2: GRN */}
                      <div>
                        <div className="text-xs font-black text-[#1b1b1b]/60 uppercase tracking-wider mb-1 flex items-center justify-between">
                          <span>2. Delivery ({rec.grnNumber})</span>
                          <button
                            onClick={() => handleOpenRateDelivery(rec)}
                            className="text-xs text-amber-600 font-bold hover:underline flex items-center gap-0.5"
                          >
                            <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                            <span>{rec.deliveryQualityScore ? `${rec.deliveryQualityScore}★` : "Rate"}</span>
                          </button>
                        </div>
                        <div className="text-xs font-mono text-[#1b1b1b] font-bold">
                          Received: <span className={`font-black ${rec.grnQtyReceived !== rec.poQty ? "text-amber-600" : "text-emerald-700"}`}>
                            {rec.grnQtyReceived}
                          </span>
                        </div>
                        <div className="text-xs text-[#1b1b1b]/80 font-bold mt-0.5">
                          {rec.grnQtyReceived === rec.poQty ? "100% Fulfilled" : `${rec.poQty - rec.grnQtyReceived} Units Shortfall`}
                        </div>
                      </div>

                      {/* Step 3: Invoice */}
                      <div>
                        <div className="text-xs font-black text-[#1b1b1b]/60 uppercase tracking-wider mb-1">
                          3. Supplier Invoice ({rec.invoiceNumber})
                        </div>
                        <div className="text-xs font-mono text-[#1b1b1b] font-bold">
                          Billed: <span className="font-black text-[#1b1b1b]">{rec.invoiceQtyBilled}</span> @ {formatCurrency(rec.invoiceRateBilled, currency)}
                        </div>
                        <div className="text-xs font-mono font-black text-[#1b1b1b] mt-0.5">
                          Total: {formatCurrency(rec.invoiceTotal, currency)}
                        </div>
                      </div>
                    </div>

                    {/* Discrepancy Alert */}
                    {rec.discrepancyReason && (
                      <div className="mt-2 flex items-center gap-2 p-2.5 bg-red-100 border-2 border-red-800 text-red-900 text-xs font-bold">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                        <span>{rec.discrepancyReason}</span>
                      </div>
                    )}
                  </div>

                  {/* Status and Actions */}
                  <div className="flex flex-wrap items-center gap-2 lg:self-center">
                    {rec.paymentLocked ? (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 border-2 border-red-800 text-red-900 text-xs font-black uppercase tracking-wider">
                        <Lock className="w-3.5 h-3.5 text-red-700" />
                        <span>Payment Locked</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 border border-[#e5e5e5] bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-semibold">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{rec.matchStatus}</span>
                      </div>
                    )}

                    {rec.paymentLocked && (
                      <button
                        onClick={() => handleResolveDiscrepancy(rec.id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-[#fbfbfb] hover:bg-[#fbfbfb] text-[#1b1b1b] border border-[#e5e5e5] text-xs font-semibold transition-colors"
                      >
                        <Unlock className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Adjust Credit & Unlock</span>
                      </button>
                    )}

                    {!rec.paymentLocked && rec.matchStatus !== "Paid" && (
                      <button
                        onClick={() => handleOpenProcessPayment(rec)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white border border-[#e5e5e5] text-xs font-semibold shadow-sm transition-colors"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Process Payment</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 2: REQUISITIONS (PRD Item 5) */}
      {subTab === "requisitions" && (
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-[#e5e5e5] pb-3">
            <div>
              <h3 className="text-sm font-black text-[#1b1b1b] flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Site Material Requisitions & Authorizations</span>
              </h3>
              <p className="text-xs text-[#1b1b1b]/70 mt-0.5">
                Site Engineer manual orders or low-stock automated triggers (PRD Section 2.2).
              </p>
            </div>
            <button
              onClick={() => setIsNewReqOpen(true)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white border border-[#e5e5e5] text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Requisition</span>
            </button>
          </div>

          <div className="divide-y-2 divide-navy-800/20">
            {requisitions.map((req) => (
              <div key={req.id} className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-[#fbfbfb]/40 px-3 border-b border-[#e5e5e5]/10 transition-colors">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-black text-[#1b1b1b] text-xs">{req.reqNumber}</span>
                    <span className="text-[#1b1b1b]/40">·</span>
                    <span className="font-black text-[#1b1b1b] text-xs">{req.itemDescription}</span>
                    <span className="text-[#1b1b1b]/40">·</span>
                    <span className={`px-2 py-0.5 text-xs font-black uppercase tracking-wider border-2 ${
                      req.urgency === "Critical"
                        ? "bg-red-100 text-red-900 border-[#e5e5e5]"
                        : req.urgency === "High"
                        ? "bg-amber-100 text-amber-900 border-[#e5e5e5]"
                        : "bg-white text-[#1b1b1b] border-[#e5e5e5]"
                    }`}>
                      {req.urgency} Urgency
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#1b1b1b]/70 font-medium">
                    <span>Qty: <strong className="text-[#1b1b1b]">{req.quantity} {req.unit}</strong></span>
                    <span>·</span>
                    <span>Est. Cost: <strong className="text-emerald-700 font-mono font-bold">{formatCurrency(req.estimatedCost, currency)}</strong></span>
                    <span>·</span>
                    <span>Requested by {req.requestedBy} on {req.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 text-xs font-black uppercase tracking-wider border-2 ${
                    req.status === "Approved"
                      ? "bg-emerald-100 text-emerald-900 border-[#e5e5e5]"
                      : req.status === "Rejected"
                      ? "bg-red-100 text-red-900 border-[#e5e5e5]"
                      : "bg-amber-100 text-amber-900 border-[#e5e5e5]"
                  }`}>
                    {req.status}
                  </span>

                  {req.status === "Pending Approval" && (
                    <div className="flex items-center gap-2 ml-2">
                      <button
                        onClick={() => handleUpdateReqStatus(req.id, "Approved")}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white border border-[#e5e5e5] text-xs font-black uppercase tracking-wider shadow-xs transition-all active:translate-x-[1px] active:translate-y-[1px] flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleUpdateReqStatus(req.id, "Rejected")}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white border border-[#e5e5e5] text-xs font-black uppercase tracking-wider shadow-xs transition-all active:translate-x-[1px] active:translate-y-[1px] flex items-center gap-1"
                      >
                        <X className="w-3 h-3" />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: ENQUIRIES & QUOTES (PRD Item 6) */}
      {subTab === "enquiries" && (
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-[#e5e5e5] pb-3">
            <div>
              <h3 className="text-sm font-black text-[#1b1b1b] flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-600" />
                <span>Supplier Price Enquiries & RFQ Comparison</span>
              </h3>
              <p className="text-xs font-bold text-[#1b1b1b]/70 mt-0.5">
                Side-by-side competitive bidding before purchase order conversion (PRD Section 2.3).
              </p>
            </div>
            <button
              onClick={() => setIsNewEnquiryOpen(true)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white border border-[#e5e5e5] text-xs font-black uppercase tracking-wider shadow-xs transition-all active:translate-x-[2px] active:translate-y-[2px] flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Enquiry</span>
            </button>
          </div>

          <div className="space-y-4">
            {enquiries.map((enq) => (
              <div key={enq.id} className="bg-[#fbfbfb] p-4 border border-[#e5e5e5] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-blue-700 text-xs">{enq.enquiryNumber}</span>
                    <h4 className="text-xs font-black text-[#1b1b1b] mt-0.5">
                      {enq.itemDescription} ({enq.quantity} {enq.unit})
                    </h4>
                  </div>
                  <span className="text-xs bg-white text-[#1b1b1b] px-2.5 py-1 font-mono font-black border border-[#e5e5e5]">
                    {enq.status}
                  </span>
                </div>

                {/* Side-by-side Quote Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {enq.suppliersQuoted.map((quote, idx) => (
                    <div key={idx} className="p-3 bg-white border border-[#e5e5e5] flex flex-col justify-between shadow-xs">
                      <div>
                        <div className="text-xs font-black text-[#1b1b1b]">{quote.name}</div>
                        <div className="text-xs font-mono text-emerald-700 font-bold mt-1">
                          {formatCurrency(quote.quoteRate, currency)} / {enq.unit}
                        </div>
                        <div className="text-xs text-[#1b1b1b]/70 font-medium mt-0.5">
                          Delivery: {quote.leadDays} Days Lead
                        </div>
                      </div>
                      <button
                        onClick={() => alert(`Supplier ${quote.name} selected. Converting RFQ to Purchase Order.`)}
                        className="mt-3 w-full py-2 bg-blue-50 text-[#0067c0] border-blue-200 hover:bg-[#0067c0] text-[#1b1b1b] border border-[#e5e5e5] text-xs font-black uppercase tracking-wider shadow-xs transition-all active:translate-x-[1px] active:translate-y-[1px] flex items-center justify-center gap-1"
                      >
                        <span>Award & Create PO</span>
                        <ArrowRight className="w-3 h-3 text-[#1b1b1b]" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 4: INVOICES & CREDIT NOTES (PRD Item 9) */}
      {subTab === "invoices" && (
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-[#e5e5e5] pb-3">
            <div>
              <h3 className="text-sm font-black text-[#1b1b1b] flex items-center gap-2">
                <Receipt className="w-4 h-4 text-purple-600" />
                <span>Supplier Invoices, Discrepancies & Credit Notes</span>
              </h3>
              <p className="text-xs font-bold text-[#1b1b1b]/70 mt-0.5">
                Log invoices, flag shortfalls, and request formal credit notes (PRD Section 2.6).
              </p>
            </div>
            <button
              onClick={() => setIsNewInvoiceOpen(true)}
              className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white border border-[#e5e5e5] text-xs font-black uppercase tracking-wider shadow-xs transition-all active:translate-x-[2px] active:translate-y-[2px] flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log New Invoice</span>
            </button>
          </div>

          <div className="divide-y-2 divide-navy-800/20">
            {records.map((r) => (
              <div key={r.id} className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-[#fbfbfb]/40 px-3 border-b border-[#e5e5e5]/10 transition-colors">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-purple-700 text-xs">{r.invoiceNumber}</span>
                    <span className="text-[#1b1b1b]/40">·</span>
                    <span className="font-black text-[#1b1b1b] text-xs">{r.supplierName}</span>
                    <span className="text-[#1b1b1b]/40">·</span>
                    <span className="font-mono text-emerald-700 text-xs font-black">
                      {formatCurrency(r.invoiceTotal, currency)}
                    </span>
                  </div>
                  <div className="text-xs text-[#1b1b1b]/70 font-medium">
                    Linked PO: <strong className="text-[#1b1b1b]">{r.poNumber}</strong> · GRN: <strong className="text-[#1b1b1b]">{r.grnNumber}</strong>
                  </div>
                  {r.discrepancyReason && (
                    <div className="text-xs text-red-600 font-bold mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{r.discrepancyReason}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {r.discrepancyReason ? (
                    <button
                      onClick={() => alert(`Credit note request issued to ${r.supplierName} for discrepancy on ${r.invoiceNumber}`)}
                      className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-500 text-[#1b1b1b] border border-[#e5e5e5] text-xs font-black uppercase tracking-wider shadow-xs transition-all active:translate-x-[1px] active:translate-y-[1px]"
                    >
                      Request Credit Note
                    </button>
                  ) : (
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 border border-[#e5e5e5] text-xs font-black uppercase tracking-wider">
                      Verified & Cleared
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 5: PAYMENTS LEDGER (PRD Item 10) */}
      {subTab === "payments" && (
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-[#e5e5e5] pb-3">
            <div>
              <h3 className="text-sm font-black text-[#1b1b1b] flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>Supplier Disbursement & Payment Trail</span>
              </h3>
              <p className="text-xs font-bold text-[#1b1b1b]/70 mt-0.5">
                Audit records of completed bank wires and payments held for investigation (PRD Section 2.7).
              </p>
            </div>
          </div>

          <div className="divide-y-2 divide-navy-800/20">
            {records.map((r) => (
              <div key={r.id} className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-[#fbfbfb]/40 px-3 border-b border-[#e5e5e5]/10 transition-colors">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-[#1b1b1b] text-xs">{r.supplierName}</span>
                    <span className="text-[#1b1b1b]/40">·</span>
                    <span className="font-mono text-emerald-700 text-xs font-black">
                      {formatCurrency(r.invoiceTotal, currency)}
                    </span>
                    <span className="text-[#1b1b1b]/40">·</span>
                    <span className={`px-2.5 py-0.5 text-xs font-black uppercase tracking-wider border-2 ${
                      r.matchStatus === "Paid"
                        ? "bg-emerald-100 text-emerald-900 border-[#e5e5e5]"
                        : r.paymentLocked
                        ? "bg-red-100 text-red-900 border-[#e5e5e5]"
                        : "bg-white text-[#1b1b1b] border-[#e5e5e5]"
                    }`}>
                      {r.matchStatus}
                    </span>
                  </div>
                  <div className="text-xs text-[#1b1b1b]/70 font-medium">
                    Ref: {r.invoiceNumber} · PO: {r.poNumber}
                    {r.paidAt && ` · Paid on ${r.paidAt} via ${r.paymentMethod}`}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {r.matchStatus !== "Paid" && (
                    <>
                      <button
                        onClick={() => handleHoldPayment(r.id)}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white border border-[#e5e5e5] text-xs font-black uppercase tracking-wider shadow-xs transition-all active:translate-x-[1px] active:translate-y-[1px] flex items-center gap-1"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>Hold Payment</span>
                      </button>
                      <button
                        onClick={() => handleOpenProcessPayment(r)}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white border border-[#e5e5e5] text-xs font-black uppercase tracking-wider shadow-xs transition-all active:translate-x-[1px] active:translate-y-[1px] flex items-center gap-1"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Process</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: New Requisition (PRD #5) */}
      {isNewReqOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-xl border border-[#e5e5e5] rounded-xl max-w-md w-full p-6 shadow-xl">
            <div className="border-b border-[#e5e5e5] pb-3">
              <h3 className="text-sm font-black text-[#1b1b1b] uppercase tracking-wide">Raise New Material Requisition</h3>
            </div>
            <form onSubmit={handleCreateRequisition} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#1b1b1b] mb-1 uppercase tracking-wider">Item Description</label>
                <input
                  type="text"
                  required
                  value={reqDesc}
                  onChange={(e) => setReqDesc(e.target.value)}
                  placeholder="e.g. 100 bags rapid setting cement"
                  className="w-full bg-white border border-[#e5e5e5] px-3 py-2 text-xs font-bold text-[#1b1b1b] focus:outline-none focus:shadow-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-[#1b1b1b] mb-1 uppercase tracking-wider">Quantity</label>
                  <input
                    type="number"
                    required
                    value={reqQty}
                    onChange={(e) => setReqQty(Number(e.target.value))}
                    className="w-full bg-white border border-[#e5e5e5] px-3 py-2 text-xs text-[#1b1b1b] font-mono font-bold focus:outline-none focus:shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1b1b1b] mb-1 uppercase tracking-wider">Unit</label>
                  <input
                    type="text"
                    required
                    value={reqUnit}
                    onChange={(e) => setReqUnit(e.target.value)}
                    className="w-full bg-white border border-[#e5e5e5] px-3 py-2 text-xs font-bold text-[#1b1b1b] focus:outline-none focus:shadow-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-[#1b1b1b] mb-1 uppercase tracking-wider">Estimated Cost (₦)</label>
                  <input
                    type="number"
                    required
                    value={reqEstCost}
                    onChange={(e) => setReqEstCost(Number(e.target.value))}
                    className="w-full bg-white border border-[#e5e5e5] px-3 py-2 text-xs text-[#1b1b1b] font-mono font-bold focus:outline-none focus:shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1b1b1b] mb-1 uppercase tracking-wider">Urgency</label>
                  <select
                    value={reqUrgency}
                    onChange={(e) => setReqUrgency(e.target.value as Requisition["urgency"])}
                    className="w-full bg-white border border-[#e5e5e5] px-3 py-2 text-xs font-black text-[#1b1b1b] uppercase focus:outline-none focus:shadow-xs"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#e5e5e5]/10">
                <button
                  type="button"
                  onClick={() => setIsNewReqOpen(false)}
                  className="px-4 py-2 bg-white hover:bg-[#f5f5f5] text-[#1b1b1b] border border-[#e5e5e5] rounded-md text-xs font-medium uppercase tracking-wider shadow-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0067c0] hover:bg-[#005ba1] text-white rounded-md text-xs font-semibold uppercase tracking-wider shadow-xs transition-all active:scale-[0.98]"
                >
                  Submit Requisition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Enquiry (PRD #6) */}
      {isNewEnquiryOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-xl border border-[#e5e5e5] rounded-xl max-w-md w-full p-6 shadow-xl">
            <div className="border-b border-[#e5e5e5] pb-3">
              <h3 className="text-sm font-black text-[#1b1b1b] uppercase tracking-wide">Create Supplier Price Enquiry (RFQ)</h3>
            </div>
            <form onSubmit={handleCreateEnquiry} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#1b1b1b] mb-1 uppercase tracking-wider">Item Description</label>
                <input
                  type="text"
                  required
                  value={enqDesc}
                  onChange={(e) => setEnqDesc(e.target.value)}
                  placeholder="e.g. 20mm aggregate gravel"
                  className="w-full bg-white border border-[#e5e5e5] px-3 py-2 text-xs font-bold text-[#1b1b1b] focus:outline-none focus:shadow-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-[#1b1b1b] mb-1 uppercase tracking-wider">Quantity</label>
                  <input
                    type="number"
                    required
                    value={enqQty}
                    onChange={(e) => setEnqQty(Number(e.target.value))}
                    className="w-full bg-white border border-[#e5e5e5] px-3 py-2 text-xs text-[#1b1b1b] font-mono font-bold focus:outline-none focus:shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1b1b1b] mb-1 uppercase tracking-wider">Unit</label>
                  <input
                    type="text"
                    required
                    value={enqUnit}
                    onChange={(e) => setEnqUnit(e.target.value)}
                    className="w-full bg-white border border-[#e5e5e5] px-3 py-2 text-xs font-bold text-[#1b1b1b] focus:outline-none focus:shadow-xs"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#e5e5e5]/10">
                <button
                  type="button"
                  onClick={() => setIsNewEnquiryOpen(false)}
                  className="px-4 py-2 bg-white hover:bg-[#f5f5f5] text-[#1b1b1b] border border-[#e5e5e5] rounded-md text-xs font-medium uppercase tracking-wider shadow-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white border border-[#e5e5e5] text-xs font-black uppercase tracking-wider shadow-xs transition-all active:translate-x-[2px] active:translate-y-[2px]"
                >
                  Send for Pricing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Invoice (PRD #9) */}
      {isNewInvoiceOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-xl border border-[#e5e5e5] rounded-xl max-w-md w-full p-6 shadow-xl">
            <div className="border-b border-[#e5e5e5] pb-3">
              <h3 className="text-sm font-black text-[#1b1b1b] uppercase tracking-wide">Log Supplier Invoice</h3>
            </div>
            <form onSubmit={handleCreateInvoice} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#1b1b1b] mb-1 uppercase tracking-wider">Invoice Number</label>
                <input
                  type="text"
                  required
                  value={invNumber}
                  onChange={(e) => setInvNumber(e.target.value)}
                  placeholder="e.g. INV-SUPP-9021"
                  className="w-full bg-white border border-[#e5e5e5] px-3 py-2 text-xs text-[#1b1b1b] font-mono font-bold focus:outline-none focus:shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1b1b1b] mb-1 uppercase tracking-wider">Supplier Name</label>
                <input
                  type="text"
                  required
                  value={invSupplier}
                  onChange={(e) => setInvSupplier(e.target.value)}
                  placeholder="e.g. Dangote Cement Plc"
                  className="w-full bg-white border border-[#e5e5e5] px-3 py-2 text-xs font-bold text-[#1b1b1b] focus:outline-none focus:shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1b1b1b] mb-1 uppercase tracking-wider">Total Invoiced Amount (₦)</label>
                <input
                  type="number"
                  required
                  value={invAmount}
                  onChange={(e) => setInvAmount(Number(e.target.value))}
                  className="w-full bg-white border border-[#e5e5e5] px-3 py-2 text-xs text-[#1b1b1b] font-mono font-bold focus:outline-none focus:shadow-xs"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#e5e5e5]/10">
                <button
                  type="button"
                  onClick={() => setIsNewInvoiceOpen(false)}
                  className="px-4 py-2 bg-white hover:bg-[#f5f5f5] text-[#1b1b1b] border border-[#e5e5e5] rounded-md text-xs font-medium uppercase tracking-wider shadow-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white border border-[#e5e5e5] text-xs font-black uppercase tracking-wider shadow-xs transition-all active:translate-x-[2px] active:translate-y-[2px]"
                >
                  Save & Run 3-Way Match
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Process Payment (PRD #10) */}
      {isProcessPaymentOpen && selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-xl border border-[#e5e5e5] rounded-xl max-w-md w-full p-6 shadow-xl">
            <div className="border-b border-[#e5e5e5] pb-3">
              <h3 className="text-sm font-black text-[#1b1b1b] uppercase tracking-wide">Process Supplier Disbursement</h3>
              <p className="text-xs font-bold text-[#1b1b1b]/70 mt-1">
                Disbursing <strong className="text-emerald-700 font-mono font-black">{formatCurrency(selectedRecord.invoiceTotal, currency)}</strong> to {selectedRecord.supplierName}.
              </p>
            </div>

            <form onSubmit={handleConfirmPayment} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#1b1b1b] mb-1 uppercase tracking-wider">Payment Method / Bank Account</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-white border border-[#e5e5e5] px-3 py-2 text-xs font-bold text-[#1b1b1b] focus:outline-none focus:shadow-xs"
                >
                  <option value="Bank Transfer (Zenith Bank NGN)">Zenith Bank Project Operations Account</option>
                  <option value="Bank Transfer (Access Bank NGN)">Access Bank Corporate Escrow</option>
                  <option value="Certified Bank Draft">Certified Bank Draft</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1b1b1b] mb-1 uppercase tracking-wider">Payment Reference / Transaction ID</label>
                <input
                  type="text"
                  required
                  defaultValue={`TXN-${Date.now().toString().slice(-6)}`}
                  className="w-full bg-white border border-[#e5e5e5] px-3 py-2 text-xs text-[#1b1b1b] font-mono font-bold focus:outline-none focus:shadow-xs"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#e5e5e5]/10">
                <button
                  type="button"
                  onClick={() => setIsProcessPaymentOpen(false)}
                  className="px-4 py-2 bg-white hover:bg-[#f5f5f5] text-[#1b1b1b] border border-[#e5e5e5] rounded-md text-xs font-medium uppercase tracking-wider shadow-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0067c0] hover:bg-[#005ba1] text-white rounded-md text-xs font-semibold uppercase tracking-wider shadow-xs transition-all active:scale-[0.98]"
                >
                  Confirm & Release Funds
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Rate Delivery (PRD #11) */}
      {isRateDeliveryOpen && selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-xl border border-[#e5e5e5] rounded-xl max-w-md w-full p-6 shadow-xl">
            <div className="border-b border-[#e5e5e5] pb-3">
              <h3 className="text-sm font-black text-[#1b1b1b] uppercase tracking-wide">Rate This Delivery Quality</h3>
              <p className="text-xs font-bold text-[#1b1b1b]/70 mt-1">
                Goods received under {selectedRecord.grnNumber} from {selectedRecord.supplierName}.
              </p>
            </div>

            <form onSubmit={handleSaveDeliveryRating} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#1b1b1b] mb-1 uppercase tracking-wider">Quality Assessment (1 - 5 Stars)</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingScore(star)}
                      className={`p-2 border border-[#e5e5e5] flex items-center gap-1.5 shadow-xs transition-all ${
                        ratingScore >= star
                          ? "bg-amber-400 text-[#1b1b1b] font-black"
                          : "bg-white text-[#1b1b1b]/40"
                      }`}
                    >
                      <Star className={`w-4 h-4 ${ratingScore >= star ? "fill-navy-800 text-[#1b1b1b]" : ""}`} />
                      <span className="text-xs font-black font-mono">{star}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1b1b1b] mb-1 uppercase tracking-wider">Inspector Note / Site Observation</label>
                <textarea
                  rows={3}
                  value={ratingNote}
                  onChange={(e) => setRatingNote(e.target.value)}
                  placeholder="e.g. Clean delivery, certificates of conformity verified on arrival..."
                  className="w-full bg-white border border-[#e5e5e5] px-3 py-2 text-xs font-bold text-[#1b1b1b] focus:outline-none focus:shadow-xs"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#e5e5e5]/10">
                <button
                  type="button"
                  onClick={() => setIsRateDeliveryOpen(false)}
                  className="px-4 py-2 bg-white hover:bg-[#f5f5f5] text-[#1b1b1b] border border-[#e5e5e5] rounded-md text-xs font-medium uppercase tracking-wider shadow-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-[#1b1b1b] border border-[#e5e5e5] text-xs font-black uppercase tracking-wider shadow-xs transition-all active:translate-x-[2px] active:translate-y-[2px]"
                >
                  Save Quality Rating
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
