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
    <div className="bg-white border-2 border-navy-800 shadow-brutal overflow-hidden shadow-sm space-y-4">
      {/* Subnavigation Bar */}
      <div className="p-3 bg-navy-800 border-b-[3px] border-navy-800 flex items-center justify-between overflow-x-auto gap-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSubTab("match")}
            className={`px-3 py-1.5 border-2 border-navy-800 text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              subTab === "match"
                ? "bg-cream-100 text-white border border-navy-800 shadow-sm"
                : "text-navy-800/70 hover:text-navy-800"
            }`}
          >
            <BadgeCheck className="w-3.5 h-3.5 text-[#6B8A6B]" />
            <span>2.1 Three-Way Match</span>
          </button>

          <button
            onClick={() => setSubTab("requisitions")}
            className={`px-3 py-1.5 border-2 border-navy-800 text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              subTab === "requisitions"
                ? "bg-cream-100 text-white border border-navy-800 shadow-sm"
                : "text-navy-800/70 hover:text-navy-800"
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>2.2 Requisitions</span>
            {requisitions.filter((r) => r.status === "Pending Approval").length > 0 && (
              <span className="text-xs bg-amber-950 text-amber-300 px-1.5 rounded-full font-mono">
                {requisitions.filter((r) => r.status === "Pending Approval").length}
              </span>
            )}
          </button>

          <button
            onClick={() => setSubTab("enquiries")}
            className={`px-3 py-1.5 border-2 border-navy-800 text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              subTab === "enquiries"
                ? "bg-cream-100 text-white border border-navy-800 shadow-sm"
                : "text-navy-800/70 hover:text-navy-800"
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-blue-400" />
            <span>2.3 Enquiries & Quotes</span>
          </button>

          <button
            onClick={() => setSubTab("invoices")}
            className={`px-3 py-1.5 border-2 border-navy-800 text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              subTab === "invoices"
                ? "bg-cream-100 text-white border border-navy-800 shadow-sm"
                : "text-navy-800/70 hover:text-navy-800"
            }`}
          >
            <Receipt className="w-3.5 h-3.5 text-purple-400" />
            <span>2.6 Invoices & Credits</span>
          </button>

          <button
            onClick={() => setSubTab("payments")}
            className={`px-3 py-1.5 border-2 border-navy-800 text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              subTab === "payments"
                ? "bg-cream-100 text-white border border-navy-800 shadow-sm"
                : "text-navy-800/70 hover:text-navy-800"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-[#6B8A6B]" />
            <span>2.7 Payments Ledger</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: 3-WAY MATCH MATRIX */}
      {subTab === "match" && (
        <div>
          <div className="p-4 border-b border-navy-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Three-Way Financial Match Engine</span>
                <span className="text-xs bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800 font-mono">
                  PO ⇄ GRN ⇄ Invoice
                </span>
              </h3>
              <p className="text-xs text-navy-800/70 mt-0.5">
                Automated quantity and unit rate cross-validation per PRD Section 2.
              </p>
            </div>
            <button
              onClick={() => setIsNewInvoiceOpen(true)}
              className="px-3 py-1.5 bg-[#6B8A6B] hover:bg-[#7A9B7A] text-white border-2 border-navy-800 text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Supplier Invoice</span>
            </button>
          </div>

          <div className="divide-y divide-zinc-800/60">
            {records.map((rec) => (
              <div key={rec.id} className="p-4 hover:bg-cream-100/30 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-[#6B8A6B] text-xs">
                        {rec.poNumber}
                      </span>
                      <span className="text-navy-800/40">·</span>
                      <span className="font-semibold text-white text-xs">{rec.supplierName}</span>
                      <span className="text-navy-800/40">·</span>
                      <span className="text-xs text-navy-800/70">{rec.itemDescription}</span>
                      <span className="text-navy-800/40">·</span>
                      <span className="text-xs text-navy-800/70 bg-cream-100 px-2 py-0.5 rounded font-mono">
                        Terms: {rec.paymentTerms}
                      </span>
                    </div>

                    {/* 3 Steps Matrix */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 bg-cream-100/60 p-3 border-2 border-navy-800 border border-navy-800/80">
                      {/* Step 1: PO */}
                      <div>
                        <div className="text-xs font-semibold text-navy-800/40 uppercase tracking-wider mb-1">
                          1. Purchase Order
                        </div>
                        <div className="text-xs font-mono text-navy-800">
                          Qty: <span className="font-bold text-white">{rec.poQty}</span> @ {formatCurrency(rec.poRate, currency)}
                        </div>
                        <div className="text-xs font-mono font-semibold text-navy-800 mt-0.5">
                          Total: {formatCurrency(rec.poTotal, currency)}
                        </div>
                      </div>

                      {/* Step 2: GRN */}
                      <div>
                        <div className="text-xs font-semibold text-navy-800/40 uppercase tracking-wider mb-1 flex items-center justify-between">
                          <span>2. Delivery ({rec.grnNumber})</span>
                          <button
                            onClick={() => handleOpenRateDelivery(rec)}
                            className="text-xs text-amber-400 hover:underline flex items-center gap-0.5"
                          >
                            <Star className="w-2.5 h-2.5 fill-amber-400" />
                            <span>{rec.deliveryQualityScore ? `${rec.deliveryQualityScore}★` : "Rate"}</span>
                          </button>
                        </div>
                        <div className="text-xs font-mono text-navy-800">
                          Received: <span className={`font-bold ${rec.grnQtyReceived !== rec.poQty ? "text-amber-400" : "text-[#6B8A6B]"}`}>
                            {rec.grnQtyReceived}
                          </span>
                        </div>
                        <div className="text-xs text-navy-800/70 mt-0.5">
                          {rec.grnQtyReceived === rec.poQty ? "100% Fulfilled" : `${rec.poQty - rec.grnQtyReceived} Units Shortfall`}
                        </div>
                      </div>

                      {/* Step 3: Invoice */}
                      <div>
                        <div className="text-xs font-semibold text-navy-800/40 uppercase tracking-wider mb-1">
                          3. Supplier Invoice ({rec.invoiceNumber})
                        </div>
                        <div className="text-xs font-mono text-navy-800">
                          Billed: <span className="font-bold text-white">{rec.invoiceQtyBilled}</span> @ {formatCurrency(rec.invoiceRateBilled, currency)}
                        </div>
                        <div className="text-xs font-mono font-semibold text-navy-800 mt-0.5">
                          Total: {formatCurrency(rec.invoiceTotal, currency)}
                        </div>
                      </div>
                    </div>

                    {/* Discrepancy Alert */}
                    {rec.discrepancyReason && (
                      <div className="mt-2 flex items-center gap-2 p-2 rounded bg-red-950/40 border border-red-800/50 text-red-300 text-xs">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                        <span>{rec.discrepancyReason}</span>
                      </div>
                    )}
                  </div>

                  {/* Status and Actions */}
                  <div className="flex flex-wrap items-center gap-2 lg:self-center">
                    {rec.paymentLocked ? (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-navy-800 bg-red-950/80 border border-red-800 text-red-300 text-xs font-semibold">
                        <Lock className="w-3.5 h-3.5 text-red-400" />
                        <span>Payment Locked</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-navy-800 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-semibold">
                        <CheckCircle className="w-3.5 h-3.5 text-[#6B8A6B]" />
                        <span>{rec.matchStatus}</span>
                      </div>
                    )}

                    {rec.paymentLocked && (
                      <button
                        onClick={() => handleResolveDiscrepancy(rec.id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-cream-100 hover:bg-cream-100 text-navy-800 border-2 border-navy-800 text-xs font-semibold transition-colors"
                      >
                        <Unlock className="w-3.5 h-3.5 text-[#6B8A6B]" />
                        <span>Adjust Credit & Unlock</span>
                      </button>
                    )}

                    {!rec.paymentLocked && rec.matchStatus !== "Paid" && (
                      <button
                        onClick={() => handleOpenProcessPayment(rec)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-[#6B8A6B] hover:bg-[#7A9B7A] text-white border-2 border-navy-800 text-xs font-semibold shadow-sm transition-colors"
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
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-navy-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Site Material Requisitions & Authorizations</span>
              </h3>
              <p className="text-xs text-navy-800/70 mt-0.5">
                Site Engineer manual orders or low-stock automated triggers (PRD Section 2.2).
              </p>
            </div>
            <button
              onClick={() => setIsNewReqOpen(true)}
              className="px-3 py-1.5 bg-[#6B8A6B] hover:bg-[#7A9B7A] text-white border-2 border-navy-800 text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Requisition</span>
            </button>
          </div>

          <div className="divide-y divide-zinc-800/60">
            {requisitions.map((req) => (
              <div key={req.id} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-cream-100/20 px-2 border-2 border-navy-800 transition-colors">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-amber-400 text-xs">{req.reqNumber}</span>
                    <span className="text-navy-800/40">·</span>
                    <span className="font-semibold text-white text-xs">{req.itemDescription}</span>
                    <span className="text-navy-800/40">·</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold border ${
                      req.urgency === "Critical"
                        ? "bg-red-950 text-red-300 border-red-800"
                        : req.urgency === "High"
                        ? "bg-amber-950 text-amber-300 border-amber-800"
                        : "bg-cream-100 text-navy-800/70 border-navy-800"
                    }`}>
                      {req.urgency} Urgency
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-navy-800/70">
                    <span>Qty: <strong className="text-navy-800">{req.quantity} {req.unit}</strong></span>
                    <span>·</span>
                    <span>Est. Cost: <strong className="text-[#6B8A6B] font-mono">{formatCurrency(req.estimatedCost, currency)}</strong></span>
                    <span>·</span>
                    <span>Requested by {req.requestedBy} on {req.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded text-xs font-bold border ${
                    req.status === "Approved"
                      ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                      : req.status === "Rejected"
                      ? "bg-red-950 text-red-300 border-red-800"
                      : "bg-amber-950 text-amber-300 border-amber-800"
                  }`}>
                    {req.status}
                  </span>

                  {req.status === "Pending Approval" && (
                    <div className="flex items-center gap-1.5 ml-2">
                      <button
                        onClick={() => handleUpdateReqStatus(req.id, "Approved")}
                        className="px-2.5 py-1 bg-[#6B8A6B] hover:bg-[#7A9B7A] text-white rounded text-xs font-semibold shadow-sm transition-colors flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleUpdateReqStatus(req.id, "Rejected")}
                        className="px-2.5 py-1 bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800 rounded text-xs font-semibold transition-colors flex items-center gap-1"
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
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-navy-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-400" />
                <span>Supplier Price Enquiries & RFQ Comparison</span>
              </h3>
              <p className="text-xs text-navy-800/70 mt-0.5">
                Side-by-side competitive bidding before purchase order conversion (PRD Section 2.3).
              </p>
            </div>
            <button
              onClick={() => setIsNewEnquiryOpen(true)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white border-2 border-navy-800 text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Enquiry</span>
            </button>
          </div>

          <div className="space-y-4">
            {enquiries.map((enq) => (
              <div key={enq.id} className="bg-cream-100 p-4 border-2 border-navy-800 border border-navy-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-blue-400 text-xs">{enq.enquiryNumber}</span>
                    <h4 className="text-xs font-bold text-white mt-0.5">
                      {enq.itemDescription} ({enq.quantity} {enq.unit})
                    </h4>
                  </div>
                  <span className="text-xs bg-cream-100 text-navy-800 px-2 py-0.5 rounded font-mono font-semibold">
                    {enq.status}
                  </span>
                </div>

                {/* Side-by-side Quote Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {enq.suppliersQuoted.map((quote, idx) => (
                    <div key={idx} className="p-3 border-2 border-navy-800 bg-white border border-navy-800 flex flex-col justify-between">
                      <div>
                        <div className="text-xs font-bold text-navy-800">{quote.name}</div>
                        <div className="text-xs font-mono text-[#6B8A6B] font-semibold mt-1">
                          {formatCurrency(quote.quoteRate, currency)} / {enq.unit}
                        </div>
                        <div className="text-xs text-navy-800/70 mt-0.5">
                          Delivery: {quote.leadDays} Days Lead
                        </div>
                      </div>
                      <button
                        onClick={() => alert(`Supplier ${quote.name} selected. Converting RFQ to Purchase Order.`)}
                        className="mt-3 w-full py-1 bg-cream-100 hover:bg-cream-100 text-white rounded text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                      >
                        <span>Award & Create PO</span>
                        <ArrowRight className="w-3 h-3 text-[#6B8A6B]" />
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
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-navy-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Receipt className="w-4 h-4 text-purple-400" />
                <span>Supplier Invoices, Discrepancies & Credit Notes</span>
              </h3>
              <p className="text-xs text-navy-800/70 mt-0.5">
                Log invoices, flag shortfalls, and request formal credit notes (PRD Section 2.6).
              </p>
            </div>
            <button
              onClick={() => setIsNewInvoiceOpen(true)}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white border-2 border-navy-800 text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log New Invoice</span>
            </button>
          </div>

          <div className="divide-y divide-zinc-800/60">
            {records.map((r) => (
              <div key={r.id} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-cream-100/20 px-2 border-2 border-navy-800 transition-colors">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-purple-400 text-xs">{r.invoiceNumber}</span>
                    <span className="text-navy-800/40">·</span>
                    <span className="font-semibold text-white text-xs">{r.supplierName}</span>
                    <span className="text-navy-800/40">·</span>
                    <span className="font-mono text-[#6B8A6B] text-xs font-bold">
                      {formatCurrency(r.invoiceTotal, currency)}
                    </span>
                  </div>
                  <div className="text-xs text-navy-800/70">
                    Linked PO: <strong className="text-navy-800">{r.poNumber}</strong> · GRN: <strong className="text-navy-800">{r.grnNumber}</strong>
                  </div>
                  {r.discrepancyReason && (
                    <div className="text-xs text-red-400 mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>{r.discrepancyReason}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {r.discrepancyReason ? (
                    <button
                      onClick={() => alert(`Credit note request issued to ${r.supplierName} for discrepancy on ${r.invoiceNumber}`)}
                      className="px-3 py-1.5 bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-800 border-2 border-navy-800 text-xs font-semibold transition-colors"
                    >
                      Request Credit Note
                    </button>
                  ) : (
                    <span className="px-2.5 py-1 rounded bg-cream-100 text-navy-800 text-xs font-semibold">
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
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-navy-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#6B8A6B]" />
                <span>Supplier Disbursement & Payment Trail</span>
              </h3>
              <p className="text-xs text-navy-800/70 mt-0.5">
                Audit records of completed bank wires and payments held for investigation (PRD Section 2.7).
              </p>
            </div>
          </div>

          <div className="divide-y divide-zinc-800/60">
            {records.map((r) => (
              <div key={r.id} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-cream-100/20 px-2 border-2 border-navy-800 transition-colors">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-white text-xs">{r.supplierName}</span>
                    <span className="text-navy-800/40">·</span>
                    <span className="font-mono text-[#6B8A6B] text-xs font-bold">
                      {formatCurrency(r.invoiceTotal, currency)}
                    </span>
                    <span className="text-navy-800/40">·</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold border ${
                      r.matchStatus === "Paid"
                        ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                        : r.paymentLocked
                        ? "bg-red-950 text-red-300 border-red-800"
                        : "bg-cream-100 text-navy-800/70 border-navy-800"
                    }`}>
                      {r.matchStatus}
                    </span>
                  </div>
                  <div className="text-xs text-navy-800/70">
                    Ref: {r.invoiceNumber} · PO: {r.poNumber}
                    {r.paidAt && ` · Paid on ${r.paidAt} via ${r.paymentMethod}`}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {r.matchStatus !== "Paid" && (
                    <>
                      <button
                        onClick={() => handleHoldPayment(r.id)}
                        className="px-2.5 py-1.5 bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800 border-2 border-navy-800 text-xs font-semibold transition-colors flex items-center gap-1"
                      >
                        <Ban className="w-3 h-3" />
                        <span>Hold Payment</span>
                      </button>
                      <button
                        onClick={() => handleOpenProcessPayment(r)}
                        className="px-3 py-1.5 bg-[#6B8A6B] hover:bg-[#7A9B7A] text-white border-2 border-navy-800 text-xs font-semibold shadow-sm transition-colors flex items-center gap-1"
                      >
                        <CreditCard className="w-3 h-3" />
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
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-white border border-navy-800 border-2 border-navy-800 max-w-md w-full p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-white">Raise New Material Requisition</h3>
            <form onSubmit={handleCreateRequisition} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs text-navy-800 mb-1">Item Description</label>
                <input
                  type="text"
                  required
                  value={reqDesc}
                  onChange={(e) => setReqDesc(e.target.value)}
                  placeholder="e.g. 100 bags rapid setting cement"
                  className="w-full bg-cream-100 border border-navy-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-navy-800 mb-1">Quantity</label>
                  <input
                    type="number"
                    required
                    value={reqQty}
                    onChange={(e) => setReqQty(Number(e.target.value))}
                    className="w-full bg-cream-100 border border-navy-800 rounded px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-navy-800 mb-1">Unit</label>
                  <input
                    type="text"
                    required
                    value={reqUnit}
                    onChange={(e) => setReqUnit(e.target.value)}
                    className="w-full bg-cream-100 border border-navy-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-navy-800 mb-1">Estimated Cost (₦)</label>
                  <input
                    type="number"
                    required
                    value={reqEstCost}
                    onChange={(e) => setReqEstCost(Number(e.target.value))}
                    className="w-full bg-cream-100 border border-navy-800 rounded px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-navy-800 mb-1">Urgency</label>
                  <select
                    value={reqUrgency}
                    onChange={(e) => setReqUrgency(e.target.value as Requisition["urgency"])}
                    className="w-full bg-cream-100 border border-navy-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewReqOpen(false)}
                  className="px-3 py-1.5 bg-cream-100 text-navy-800 rounded text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-[#6B8A6B] hover:bg-[#7A9B7A] text-white rounded text-xs font-semibold"
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
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-white border border-navy-800 border-2 border-navy-800 max-w-md w-full p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-white">Create Supplier Price Enquiry (RFQ)</h3>
            <form onSubmit={handleCreateEnquiry} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs text-navy-800 mb-1">Item Description</label>
                <input
                  type="text"
                  required
                  value={enqDesc}
                  onChange={(e) => setEnqDesc(e.target.value)}
                  placeholder="e.g. 20mm aggregate gravel"
                  className="w-full bg-cream-100 border border-navy-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-navy-800 mb-1">Quantity</label>
                  <input
                    type="number"
                    required
                    value={enqQty}
                    onChange={(e) => setEnqQty(Number(e.target.value))}
                    className="w-full bg-cream-100 border border-navy-800 rounded px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-navy-800 mb-1">Unit</label>
                  <input
                    type="text"
                    required
                    value={enqUnit}
                    onChange={(e) => setEnqUnit(e.target.value)}
                    className="w-full bg-cream-100 border border-navy-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewEnquiryOpen(false)}
                  className="px-3 py-1.5 bg-cream-100 text-navy-800 rounded text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold"
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
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-white border border-navy-800 border-2 border-navy-800 max-w-md w-full p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-white">Log Supplier Invoice</h3>
            <form onSubmit={handleCreateInvoice} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs text-navy-800 mb-1">Invoice Number</label>
                <input
                  type="text"
                  required
                  value={invNumber}
                  onChange={(e) => setInvNumber(e.target.value)}
                  placeholder="e.g. INV-SUPP-9021"
                  className="w-full bg-cream-100 border border-navy-800 rounded px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs text-navy-800 mb-1">Supplier Name</label>
                <input
                  type="text"
                  required
                  value={invSupplier}
                  onChange={(e) => setInvSupplier(e.target.value)}
                  placeholder="e.g. Dangote Cement Plc"
                  className="w-full bg-cream-100 border border-navy-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs text-navy-800 mb-1">Total Invoiced Amount (₦)</label>
                <input
                  type="number"
                  required
                  value={invAmount}
                  onChange={(e) => setInvAmount(Number(e.target.value))}
                  className="w-full bg-cream-100 border border-navy-800 rounded px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewInvoiceOpen(false)}
                  className="px-3 py-1.5 bg-cream-100 text-navy-800 rounded text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded text-xs font-semibold"
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
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-white border border-navy-800 border-2 border-navy-800 max-w-md w-full p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-white">Process Supplier Disbursement</h3>
            <p className="text-xs text-navy-800/70 mt-1">
              Disbursing <strong className="text-[#6B8A6B] font-mono">{formatCurrency(selectedRecord.invoiceTotal, currency)}</strong> to {selectedRecord.supplierName}.
            </p>

            <form onSubmit={handleConfirmPayment} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs text-navy-800 mb-1">Payment Method / Bank Account</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-cream-100 border border-navy-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Bank Transfer (Zenith Bank NGN)">Zenith Bank Project Operations Account</option>
                  <option value="Bank Transfer (Access Bank NGN)">Access Bank Corporate Escrow</option>
                  <option value="Certified Bank Draft">Certified Bank Draft</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-navy-800 mb-1">Payment Reference / Transaction ID</label>
                <input
                  type="text"
                  required
                  defaultValue={`TXN-${Date.now().toString().slice(-6)}`}
                  className="w-full bg-cream-100 border border-navy-800 rounded px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProcessPaymentOpen(false)}
                  className="px-3 py-1.5 bg-cream-100 text-navy-800 rounded text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-[#6B8A6B] hover:bg-[#7A9B7A] text-white rounded text-xs font-semibold"
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
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-white border border-navy-800 border-2 border-navy-800 max-w-md w-full p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-white">Rate This Delivery Quality</h3>
            <p className="text-xs text-navy-800/70 mt-1">
              Goods received under {selectedRecord.grnNumber} from {selectedRecord.supplierName}.
            </p>

            <form onSubmit={handleSaveDeliveryRating} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs text-navy-800 mb-1">Quality Assessment (1 - 5 Stars)</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingScore(star)}
                      className={`p-2 border-2 border-navy-800 border flex items-center gap-1 ${
                        ratingScore >= star
                          ? "bg-amber-950 text-amber-300 border-amber-800"
                          : "bg-cream-100 text-navy-800/40 border-navy-800"
                      }`}
                    >
                      <Star className={`w-4 h-4 ${ratingScore >= star ? "fill-amber-400 text-amber-400" : ""}`} />
                      <span className="text-xs font-bold font-mono">{star}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-navy-800 mb-1">Inspector Note / Site Observation</label>
                <textarea
                  rows={3}
                  value={ratingNote}
                  onChange={(e) => setRatingNote(e.target.value)}
                  placeholder="e.g. Clean delivery, certificates of conformity verified on arrival..."
                  className="w-full bg-cream-100 border border-navy-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRateDeliveryOpen(false)}
                  className="px-3 py-1.5 bg-cream-100 text-navy-800 rounded text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-amber-600 hover:bg-[#A68A5A] text-white rounded text-xs font-semibold"
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
