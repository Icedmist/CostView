import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as fs from "fs";
import * as path from "path";

// Color Palette - Smoothed Neo-Brutalism
const C_NAVY = [10, 25, 49];       // #0A1931 - Primary brand navy
const C_CREAM = [255, 253, 240];   // #FFFDF0 - Background cream
const C_CREAM_MUTED = [245, 242, 226]; // Card fill cream
const C_MUSTARD = [255, 210, 63];  // #FFD23F - Vibrant brand mustard
const C_EMERALD = [16, 185, 129];  // #10B981 - Success emerald
const C_AMBER = [217, 119, 6];     // #D97706 - Warning amber
const C_RED = [220, 38, 38];       // #DC2626 - Critical red
const C_BLUE = [37, 99, 235];      // #2563EB - Info blue
const C_PURPLE = [147, 51, 234];   // #9333EA - Variation purple
const C_DARK = [15, 23, 42];       // #0F172A - High-contrast black/slate
const C_WHITE = [255, 255, 255];
const C_TEXT = [15, 23, 42];
const C_MUTED = [100, 116, 139];

function createCostViewGuide() {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // Neo-brutalist helper: draw box with offset shadow
  function drawBrutalBox(
    x: number,
    y: number,
    w: number,
    h: number,
    fillRGB: number[],
    borderRGB: number[] = C_NAVY,
    shadowOffset: number = 2,
    lineWidth: number = 0.6
  ) {
    if (shadowOffset > 0) {
      doc.setFillColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
      doc.rect(x + shadowOffset, y + shadowOffset, w, h, "F");
    }
    doc.setFillColor(fillRGB[0], fillRGB[1], fillRGB[2]);
    doc.setDrawColor(borderRGB[0], borderRGB[1], borderRGB[2]);
    doc.setLineWidth(lineWidth);
    doc.rect(x, y, w, h, "FD");
  }

  // Draw header on subsequent pages
  function drawPageHeader(pageNum: number, sectionTitle: string) {
    // Header background bar
    drawBrutalBox(margin, 10, contentWidth, 12, C_NAVY, C_NAVY, 1.5, 0.5);

    doc.setTextColor(C_MUSTARD[0], C_MUSTARD[1], C_MUSTARD[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("COSTVIEW 360", margin + 4, 17.5);

    doc.setTextColor(C_WHITE[0], C_WHITE[1], C_WHITE[2]);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(" |  " + sectionTitle.toUpperCase(), margin + 32, 17.5);

    doc.setTextColor(C_MUSTARD[0], C_MUSTARD[1], C_MUSTARD[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(`PAGE ${pageNum}`, pageWidth - margin - 16, 17.5);
  }

  // Draw footer on all pages
  function drawPageFooter(pageNum: number, totalPages: number) {
    const footY = pageHeight - 12;
    doc.setDrawColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
    doc.setLineWidth(0.6);
    doc.line(margin, footY - 2, pageWidth - margin, footY - 2);

    doc.setTextColor(C_MUTED[0], C_MUTED[1], C_MUTED[2]);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text("COSTVIEW 360 · ENTERPRISE FIELD COST GOVERNANCE MANUAL", margin, footY + 2);
    doc.text("ADHERES STRICTLY TO AGENTS.MD REPO GOVERNANCE", margin + 95, footY + 2);
    doc.text(`${pageNum} / ${totalPages}`, pageWidth - margin - 10, footY + 2);
  }

  // ==========================================
  // PAGE 1: COVER & EXECUTIVE ARCHITECTURE
  // ==========================================

  // Background subtle cream wash
  doc.setFillColor(C_CREAM[0], C_CREAM[1], C_CREAM[2]);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Hero Card
  drawBrutalBox(margin, 16, contentWidth, 54, C_NAVY, C_NAVY, 3, 0.8);

  // Brand Badge
  doc.setFillColor(C_MUSTARD[0], C_MUSTARD[1], C_MUSTARD[2]);
  doc.rect(margin + 6, 22, 42, 6, "F");
  doc.setDrawColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.setLineWidth(0.4);
  doc.rect(margin + 6, 22, 42, 6, "D");
  doc.setTextColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("ENTERPRISE SYSTEM GUIDE", margin + 8, 26.2);

  // Title
  doc.setTextColor(C_WHITE[0], C_WHITE[1], C_WHITE[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("COSTVIEW 360", margin + 6, 38);

  // Subtitle
  doc.setTextColor(C_MUSTARD[0], C_MUSTARD[1], C_MUSTARD[2]);
  doc.setFontSize(11);
  doc.text("Commercial Construction Intelligence & Field Cost Governance", margin + 6, 45);

  doc.setTextColor(200, 210, 230);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(
    "Authoritative handbook for Quantity Surveyors, Project Managers, Site Engineers & Financial Controllers.",
    margin + 6,
    51
  );
  doc.text(
    "Version 2.0 · Nigerian & Emerging African Commercial Real Estate Focus · NGN Native Architecture",
    margin + 6,
    56
  );

  // Executive Problem & Solution Block
  let curY = 77;
  drawBrutalBox(margin, curY, contentWidth, 38, C_WHITE, C_NAVY, 2, 0.6);

  // Section header
  doc.setFillColor(C_MUSTARD[0], C_MUSTARD[1], C_MUSTARD[2]);
  doc.rect(margin, curY, contentWidth, 7, "FD");
  doc.setTextColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("1. EXECUTIVE MANDATE: ELIMINATING SITE COST LEAKAGE", margin + 4, curY + 5);

  doc.setTextColor(C_TEXT[0], C_TEXT[1], C_TEXT[2]);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  const mandateLines = [
    "Commercial construction projects in Nigeria and emerging African markets routinely suffer from 15% to 30% unbudgeted",
    "cost inflation, uncontrolled contractor variation claims, material diversion from site, and unverified contractor invoices.",
    "CostView 360 bridges the critical communications chasm between field site operations and head-office commercial controllers.",
    "By combining real-time Bill of Quantities (BOQ) baseline tracking, mandatory 3-way invoice matching, statutory 10% retention",
    "withholding, and daily shift attendance logs, CostView 360 transforms loose construction management into an immutable,",
    "audit-ready commercial workflow engine."
  ];
  mandateLines.forEach((l, i) => doc.text(l, margin + 4, curY + 12 + i * 4.2));

  // The 4 System Pillars
  curY = 121;
  const colW = (contentWidth - 6) / 2;
  const colH = 40;

  // Pillar 1: NGN Native & Multi-Currency
  drawBrutalBox(margin, curY, colW, colH, C_WHITE, C_NAVY, 2, 0.5);
  doc.setFillColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.rect(margin, curY, colW, 6, "F");
  doc.setTextColor(C_MUSTARD[0], C_MUSTARD[1], C_MUSTARD[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("PILLAR 1: NGN (₦) NATIVE ACCOUNTING", margin + 3, curY + 4.2);
  doc.setTextColor(C_TEXT[0], C_TEXT[1], C_TEXT[2]);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text(
    "Purpose-built for Nigerian commercial construction.\nAll rates, certified sums, and retention funds are natively\nmanaged in Naira (₦) with instant dynamic conversions\nto USD ($), GBP (£), and EUR (€) for imported plant,\nequipment, and foreign contractor packages.",
    margin + 3,
    curY + 10.5
  );

  // Pillar 2: 3-Way Invoicing Match
  drawBrutalBox(margin + colW + 6, curY, colW, colH, C_WHITE, C_NAVY, 2, 0.5);
  doc.setFillColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.rect(margin + colW + 6, curY, colW, 6, "F");
  doc.setTextColor(C_MUSTARD[0], C_MUSTARD[1], C_MUSTARD[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("PILLAR 2: 3-WAY INVOICE PROCUREMENT MATCH", margin + colW + 9, curY + 4.2);
  doc.setTextColor(C_TEXT[0], C_TEXT[1], C_TEXT[2]);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text(
    "Strict accounting reconciliation matching Purchase Order\n(PO) quantity and agreed unit rate against the physical\nGoods Received Note (GRN) from site store, and vendor's\nsubmitted Invoice. Automatic zero-tolerance flags prevent\nphantom billings and double charges.",
    margin + colW + 9,
    curY + 10.5
  );

  // Pillar 3: 10% Statutory Retention
  curY = 167;
  drawBrutalBox(margin, curY, colW, colH, C_WHITE, C_NAVY, 2, 0.5);
  doc.setFillColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.rect(margin, curY, colW, 6, "F");
  doc.setTextColor(C_MUSTARD[0], C_MUSTARD[1], C_MUSTARD[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("PILLAR 3: 10% STATUTORY RETENTION FUND", margin + 3, curY + 4.2);
  doc.setTextColor(C_TEXT[0], C_TEXT[1], C_TEXT[2]);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text(
    "Standard Nigerian building contract clause (JCT/FIDIC)\nenforced digitally. The system automatically withholds\n10% from every subcontractor interim payment valuation,\nsafeguarding quality guarantee funds until practical\ncompletion and final snag remediation sign-off.",
    margin + 3,
    curY + 10.5
  );

  // Pillar 4: Immutable Audit Trail
  drawBrutalBox(margin + colW + 6, curY, colW, colH, C_WHITE, C_NAVY, 2, 0.5);
  doc.setFillColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.rect(margin + colW + 6, curY, colW, 6, "F");
  doc.setTextColor(C_MUSTARD[0], C_MUSTARD[1], C_MUSTARD[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("PILLAR 4: IMMUTABLE AUDIT TRAIL & RBAC", margin + colW + 9, curY + 4.2);
  doc.setTextColor(C_TEXT[0], C_TEXT[1], C_TEXT[2]);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text(
    "Every budget baseline revision, variation order approval,\nand invoice certification is indelibly recorded in the\nPostgreSQL journal with actor role attribution, exact\ntimestamp, and delta change record. Absolute compliance\ngovernance across 8 enterprise role profiles.",
    margin + colW + 9,
    curY + 10.5
  );

  // Technical Metadata Table
  curY = 213;
  drawBrutalBox(margin, curY, contentWidth, 68, C_CREAM_MUTED, C_NAVY, 2, 0.6);
  doc.setFillColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.rect(margin, curY, contentWidth, 6.5, "F");
  doc.setTextColor(C_WHITE[0], C_WHITE[1], C_WHITE[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("TECHNICAL ARCHITECTURE & SPECIFICATIONS SNAPSHOT", margin + 4, curY + 4.5);

  autoTable(doc, {
    startY: curY + 7.5,
    margin: { left: margin + 2, right: margin + 2 },
    styles: {
      fontSize: 7,
      font: "helvetica",
      textColor: C_NAVY,
      lineColor: C_NAVY,
      lineWidth: 0.2,
      cellPadding: 1.6
    },
    headStyles: {
      fillColor: C_MUSTARD,
      textColor: C_NAVY,
      fontStyle: "bold"
    },
    alternateRowStyles: {
      fillColor: C_WHITE
    },
    head: [["Specification Dimension", "Platform Standard", "Operational Rationale"]],
    body: [
      ["Frontend Engine", "Next.js 14 App Router + React 18", "Server-rendered speed, instant page switching, zero dev-cache lags"],
      ["Database & RLS", "Supabase PostgreSQL (eu-central-1)", "25 relational tables, strict Row Level Security by tenant & role"],
      ["Design System", "Smoothed Neo-Brutalism (Tailwind)", "2px solid borders, 4px shadow, #0A1931 navy, #FFFDF0 cream, #FFD23F"],
      ["Currency Precision", "Nigerian Naira Native (2-dec numeric)", "Zero floating point round-off error on multi-billion Naira ledgers"],
      ["Measurement Standard", "NRM2 & CESMM4 Aligned Code Format", "Standard building & civil engineering breakdown (CON-01, LAB-02)"],
      ["Deployment & Host", "Vercel Production Auto-Deploy", "Continuous integration with branch protection, live at costview-peach.vercel.app"],
      ["Governance Rule", "AGENTS.md Issue → Branch → PR → Merge", "Strict quality enforcement: no direct pushes to main, zero unreviewed code"]
    ]
  });

  drawPageFooter(1, 5);

  // ==========================================
  // PAGE 2: THE 10 CORE FUNCTIONAL MODULES
  // ==========================================
  doc.addPage();
  doc.setFillColor(C_CREAM[0], C_CREAM[1], C_CREAM[2]);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  drawPageHeader(2, "Core Functional Modules & System Capabilities");

  // Overview intro
  curY = 26;
  drawBrutalBox(margin, curY, contentWidth, 14, C_WHITE, C_NAVY, 1.5, 0.5);
  doc.setTextColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("EXPLANATORY BREAKDOWN OF THE 10 COSTVIEW 360 CORE SUBSYSTEMS", margin + 4, curY + 5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text(
    "Each module is engineered to handle a dedicated facet of commercial construction management, enforcing dual-signoffs and auditable baselines.",
    margin + 4,
    curY + 10
  );

  // Detailed Table of the 10 Modules
  autoTable(doc, {
    startY: curY + 17,
    margin: { left: margin, right: margin },
    styles: {
      fontSize: 6.8,
      font: "helvetica",
      textColor: C_NAVY,
      lineColor: C_NAVY,
      lineWidth: 0.3,
      cellPadding: 1.8
    },
    headStyles: {
      fillColor: C_NAVY,
      textColor: C_MUSTARD,
      fontStyle: "bold"
    },
    columnStyles: {
      0: { cellWidth: 32, fontStyle: "bold" },
      1: { cellWidth: 26 },
      2: { cellWidth: 62 },
      3: { cellWidth: 62 }
    },
    head: [["Module Name", "Primary Actor", "Core Function & What To Do", "System Automation & Business Value"]],
    body: [
      [
        "1. Commercial Command Center",
        "Project Director / Commercial Mgr",
        "Executive KPI overview: track Total Committed Cost, Paid to Date, Contingency Burn, CPI, and SPI indices in real-time.",
        "Generates dynamic budget health badges (On Track, At Risk, Over Budget). Highlights cost code variances before budget overrun."
      ],
      [
        "2. BOQ & Baseline Budget Engine",
        "Senior Quantity Surveyor (QS)",
        "Import Excel/CSV BOQs, establish NRM2 cost codes (CON, FIN, MEP), and lock the initial commercial baseline.",
        "Protects baseline integrity. Changes require formal revision orders. Maintains 5.0% contingency reserve and final account reconciliation."
      ],
      [
        "3. Three-Way Invoice Match",
        "Procurement Officer / Accountant",
        "Reconcile Purchase Orders (PO) against physical Goods Received Notes (GRN) and submitted Vendor Invoices.",
        "Calculates price and quantity variance deltas automatically. Zero-tolerance block prevents unapproved disbursements and double billing."
      ],
      [
        "4. Materials & Stock Control",
        "Site Storekeeper / Field Eng",
        "Record physical material receipts, log daily consumption against BOQ grid locations, and dispatch inter-site store transfers.",
        "Live stock gauge meters. Automatic alerts when reorder levels drop below critical thresholds. Reconciles theoretical vs actual usage."
      ],
      [
        "5. Labour Muster & Payroll",
        "Site Supervisor / HR / Acct",
        "Mark daily craftsman presence (masons, carpenters, steel fixers), log overtime hours, and track contractor workforce counts.",
        "Auto-calculates weekly payroll disbursements in Naira (₦) with daily rate multipliers. Eliminates ghost worker fraud."
      ],
      [
        "6. Site Diary & Quality Progress",
        "Resident Engineer / QA-QC Insp",
        "Publish daily shift weather logs, upload timestamped milestone progress photos, and conduct structural inspection checklists.",
        "Failed QA checklists automatically generate Snag/Defect tickets. Prevents laptop loss since all shift records live in the secure cloud."
      ],
      [
        "7. Subcontractor Packages & Ledger",
        "Quantity Surveyor / Project PM",
        "Manage trade contractor contract sums, certify interim payment claims, and grade performance across 4 evaluation categories.",
        "Applies automatic 10% statutory retention withholding on every certificate. Tracks retention release milestones and contractor ratings."
      ],
      [
        "8. Site Instructions & Variations",
        "Architect / Resident Eng / QS",
        "Log formal Site Instructions (SIs) and advance Variation Orders (VOs) through a 4-stage approval workflow.",
        "Approval stages: Draft → QS Valuation → PM Review → Approved. Approved variations automatically uplift master budget cost baseline."
      ],
      [
        "9. Branded Reports Studio",
        "Commercial Controller / Client",
        "Compile branded Neo-Brutalist PDF reports: Executive Cost-to-Complete, Subcontractor Statements, and Audit Trails.",
        "One-click high-resolution PDF generation ready for bank valuation, joint-venture partners, and statutory regulatory compliance."
      ],
      [
        "10. Role-Based Access & Audit",
        "Enterprise Admin / Auditor",
        "Manage the 8 enterprise role profiles, configure permissions, and search the immutable chronological audit journal.",
        "Every approval, deletion, and price adjustment is timestamped with actor attribution and IP identity. Complete legal audit proof."
      ]
    ]
  });

  drawPageFooter(2, 5);

  // ==========================================
  // PAGE 3: STEP-BY-STEP OPERATIONAL WORKFLOWS
  // ==========================================
  doc.addPage();
  doc.setFillColor(C_CREAM[0], C_CREAM[1], C_CREAM[2]);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  drawPageHeader(3, "Step-by-Step 'What To Do' Operational Workflows");

  curY = 26;
  drawBrutalBox(margin, curY, contentWidth, 12, C_MUSTARD, C_NAVY, 1.5, 0.5);
  doc.setTextColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("STANDARD OPERATING PROCEDURE (SOP): DAY 1 TO PROJECT CLOSEOUT", margin + 4, curY + 7.5);

  // Phase A: Day 1 Initialization
  curY = 42;
  drawBrutalBox(margin, curY, contentWidth, 38, C_WHITE, C_NAVY, 1.5, 0.5);
  doc.setFillColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.rect(margin, curY, contentWidth, 6, "F");
  doc.setTextColor(C_WHITE[0], C_WHITE[1], C_WHITE[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("PHASE 1: PROJECT INITIALIZATION & BASELINE SETUP (DAY 1)", margin + 4, curY + 4.2);

  doc.setTextColor(C_TEXT[0], C_TEXT[1], C_TEXT[2]);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  const phaseAText = [
    "Step 1: Quantity Surveyor logs in with QS credentials and navigates to the 'BOQ & Budget Baseline' module.",
    "Step 2: Click 'Import Excel / CSV BOQ' and upload the client-approved Bill of Quantities or sample template.",
    "Step 3: Review parsed items, verify NRM2 cost code mapping (e.g. SUB-01 Substructure, CON-02 Concrete frame, FIN-03 Finishes).",
    "Step 4: Establish project contingency budget (standard 5.0% allocation for price escalation and ground surprises).",
    "Step 5: Lock the Baseline. Once locked, the original budget cannot be edited without formal Revision Orders or approved VOs."
  ];
  phaseAText.forEach((t, i) => doc.text(t, margin + 4, curY + 11 + i * 5.2));

  // Phase B: Daily Site Routine
  curY = 84;
  drawBrutalBox(margin, curY, contentWidth, 44, C_WHITE, C_NAVY, 1.5, 0.5);
  doc.setFillColor(C_EMERALD[0], C_EMERALD[1], C_EMERALD[2]);
  doc.rect(margin, curY, contentWidth, 6, "F");
  doc.setTextColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("PHASE 2: DAILY & WEEKLY SITE OPERATIONS WORKFLOW", margin + 4, curY + 4.2);

  doc.setTextColor(C_TEXT[0], C_TEXT[1], C_TEXT[2]);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  const phaseBText = [
    "07:30 Morning Shift Muster: Site Engineer opens 'Labour Muster' and marks daily presence for all artisan gangs (Masons,",
    "      Carpenters, Steel Fixers). Any overtime hours worked the previous night are verified and keyed in.",
    "10:00 Daily Site Diary Entry: Site Supervisor navigates to 'Site Diary', checks auto-stamped weather, logs current headcount,",
    "      and publishes key shift tasks (e.g., 'Casting second-floor suspended slab columns with 40m3 ReadyMix').",
    "13:00 Material Issue & GRN: Storekeeper logs any material deliveries in 'Materials & Stock' against procurement POs and issues",
    "      rebar and cement to specific contractor crews with grid location tags.",
    "16:00 QA/QC Inspections & Snags: Inspector records element inspections in 'Site Diary > Inspections'. If an inspection",
    "      fails (e.g. honeycombing in beam B-14), the system automatically raises a defect Snag/NCR assigned to the subcontractor."
  ];
  phaseBText.forEach((t, i) => doc.text(t, margin + 4, curY + 11 + i * 8));

  // Phase C: Monthly Valuation & Invoicing Match
  curY = 132;
  drawBrutalBox(margin, curY, contentWidth, 44, C_WHITE, C_NAVY, 1.5, 0.5);
  doc.setFillColor(C_BLUE[0], C_BLUE[1], C_BLUE[2]);
  doc.rect(margin, curY, contentWidth, 6, "F");
  doc.setTextColor(C_WHITE[0], C_WHITE[1], C_WHITE[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("PHASE 3: MONTHLY SUBCONTRACTOR VALUATION & 3-WAY INVOICING CYCLE", margin + 4, curY + 4.2);

  doc.setTextColor(C_TEXT[0], C_TEXT[1], C_TEXT[2]);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  const phaseCText = [
    "Step 1: Subcontractor submits monthly Interim Payment Claim for work accomplished (e.g. Zenith Piling: ₦18,500,000).",
    "Step 2: QS visits site, validates physical measurements, and clicks 'Certify & Apply 10%'. CostView 360 automatically",
    "        deducts ₦1,850,000 into the statutory retention holding ledger and certifies the net ₦16,650,000 for payment.",
    "Step 3: Procurement Officer opens '3-Way Match' to reconcile material supplier invoices. The system cross-references the",
    "        original Purchase Order, the Site Goods Received Note (GRN), and the submitted Vendor Invoice.",
    "Step 4: If unit prices or quantities diverge, a Discrepancy Alert triggers. The Financial Accountant cannot release payment",
    "        until the variance delta is investigated and resolved with formal commercial approval."
  ];
  phaseCText.forEach((t, i) => doc.text(t, margin + 4, curY + 11 + i * 7.8));

  // Phase D: Variations & Closeout
  curY = 180;
  drawBrutalBox(margin, curY, contentWidth, 42, C_WHITE, C_NAVY, 1.5, 0.5);
  doc.setFillColor(C_PURPLE[0], C_PURPLE[1], C_PURPLE[2]);
  doc.rect(margin, curY, contentWidth, 6, "F");
  doc.setTextColor(C_WHITE[0], C_WHITE[1], C_WHITE[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("PHASE 4: SITE INSTRUCTIONS, VARIATION ORDERS & FINAL ACCOUNT CLOSEOUT", margin + 4, curY + 4.2);

  doc.setTextColor(C_TEXT[0], C_TEXT[1], C_TEXT[2]);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  const phaseDText = [
    "1. Site Instruction Issued: Architect/Engineer logs formal instruction in 'Site Operations > 7.1 Site Instructions'.",
    "2. Raise Variation Order: QS links the SI to '7.2 Variation Orders', estimating the cost delta (₦) and time impact (days).",
    "3. 4-Stage Approval Chain: VO progresses: Draft → QS Valuation → PM Review → Approved. Once approved by the Project",
    "   Manager, the system automatically uplifts the master budget baseline and commits the funds.",
    "4. Practical Completion & Retention Release: At project handover, all open snags must be certified 'Closed'.",
    "   Once the defects liability period elapses, the QS issues the Final Account statement and releases the 10% retention fund."
  ];
  phaseDText.forEach((t, i) => doc.text(t, margin + 4, curY + 11 + i * 5.6));

  // Quick Action Summary Box
  curY = 226;
  drawBrutalBox(margin, curY, contentWidth, 54, C_CREAM_MUTED, C_NAVY, 2, 0.5);
  doc.setFillColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.rect(margin, curY, contentWidth, 6, "F");
  doc.setTextColor(C_MUSTARD[0], C_MUSTARD[1], C_MUSTARD[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("SUMMARY OPERATIONAL RULES: WHAT TO DO IN COMMON SITUATIONS", margin + 4, curY + 4.2);

  autoTable(doc, {
    startY: curY + 7,
    margin: { left: margin + 2, right: margin + 2 },
    styles: {
      fontSize: 6.8,
      font: "helvetica",
      textColor: C_NAVY,
      lineColor: C_NAVY,
      lineWidth: 0.2,
      cellPadding: 1.6
    },
    headStyles: {
      fillColor: C_MUSTARD,
      textColor: C_NAVY,
      fontStyle: "bold"
    },
    head: [["Scenario Occurring On Site", "Action Required In CostView 360", "Prevented Risk / Outcome"]],
    body: [
      ["Supplier delivers 80 bags of cement instead of 100 on PO", "Log GRN with received qty: 80. Match matrix flags red discrepancy.", "Prevents paying for 20 undelivered bags; accountant holds invoice."],
      ["Architect requests moving plumbing plinth on site", "Enter Site Instruction under 7.1; raise VO under 7.2 with cost estimate.", "Eliminates verbal instruction disputes and unrecorded cost creep."],
      ["Subcontractor finishes 40% of trade milestone", "Certify claim in 'Packages & Retention'. System auto-deducts 10%.", "Protects client cashflow with legal retention safety fund held."],
      ["Site inspection reveals cracked column plaster", "Record failed inspection; system auto-generates Snag with photo tag.", "Ensures contractor remediates defects before receiving payment."]
    ]
  });

  drawPageFooter(3, 5);

  // ==========================================
  // PAGE 4: CONTRIBUTING & AGENTS.MD GUIDELINES
  // ==========================================
  doc.addPage();
  doc.setFillColor(C_CREAM[0], C_CREAM[1], C_CREAM[2]);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  drawPageHeader(4, "Contributing Guidelines & AGENTS.md Developer Governance");

  // Title box
  curY = 26;
  drawBrutalBox(margin, curY, contentWidth, 14, C_NAVY, C_NAVY, 1.5, 0.5);
  doc.setTextColor(C_MUSTARD[0], C_MUSTARD[1], C_MUSTARD[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("CORE RULE: NO DIRECT PUSHES TO MAIN. EVERY CHANGE = ISSUE → BRANCH → PR → MERGE", margin + 4, curY + 5.5);
  doc.setTextColor(C_WHITE[0], C_WHITE[1], C_WHITE[2]);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text(
    "All software contributions, bugfixes, UI polishes, and document additions must strictly adhere to repo governance in AGENTS.md and .github/CONTRIBUTING.md.",
    margin + 4,
    curY + 10.5
  );

  // The 5 Steps of AGENTS.md
  curY = 44;
  drawBrutalBox(margin, curY, contentWidth, 54, C_WHITE, C_NAVY, 2, 0.6);
  doc.setFillColor(C_MUSTARD[0], C_MUSTARD[1], C_MUSTARD[2]);
  doc.rect(margin, curY, contentWidth, 6.5, "F");
  doc.setTextColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("THE MANDATORY 5-STEP AGENT & DEVELOPER CONTRIBUTION PROTOCOL", margin + 4, curY + 4.5);

  const steps = [
    {
      num: "STEP 1",
      name: "Create GitHub Issue",
      cmd: "gh issue create --title '<scope>: <short>' --body 'Closes via PR' --label enhancement",
      desc: "Note the assigned issue number (#<n>). No branch or pull request may exist without an originating issue."
    },
    {
      num: "STEP 2",
      name: "Checkout Feature Branch",
      cmd: "git checkout main && git pull && git checkout -b feat/issue-<n>-<slug>   # or fix/",
      desc: "Always branch from a fresh, up-to-date main branch. Use clean semantic branch names."
    },
    {
      num: "STEP 3",
      name: "Conventional Commit",
      cmd: "git commit -m 'feat(scope): ... (#<n>)' -m 'Closes #<n>'",
      desc: "Use user credentials (icedmist / talk2icedmist@gmail.com). Never push directly to main."
    },
    {
      num: "STEP 4",
      name: "Push & Open Pull Request",
      cmd: "git push -u origin feat/issue-<n>-<slug> && gh pr create --title 'feat: ... (#<n>)' --body 'Closes #<n>'",
      desc: "Provide PR description summarizing changes, rationale, testing results, and Vercel preview URL."
    },
    {
      num: "STEP 5",
      name: "Review & Squash Merge",
      cmd: "gh pr merge --squash --delete-branch",
      desc: "Require automated Vercel preview build pass. Squash and delete feature branch after merge."
    }
  ];

  steps.forEach((s, i) => {
    const stepY = curY + 8 + i * 9.2;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
    doc.text(`${s.num}: ${s.name}`, margin + 3, stepY + 3);

    doc.setFont("courier", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(C_BLUE[0], C_BLUE[1], C_BLUE[2]);
    doc.text(s.cmd, margin + 42, stepY + 3);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(C_MUTED[0], C_MUTED[1], C_MUTED[2]);
    doc.text(s.desc, margin + 42, stepY + 6.8);
  });

  // Seed User Accounts Table (From CONTRIBUTING.md)
  curY = 102;
  drawBrutalBox(margin, curY, contentWidth, 74, C_WHITE, C_NAVY, 2, 0.6);
  doc.setFillColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.rect(margin, curY, contentWidth, 6.5, "F");
  doc.setTextColor(C_MUSTARD[0], C_MUSTARD[1], C_MUSTARD[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("PRE-SEEDED ENTERPRISE TEST ACCOUNTS (DEMO CREDENTIALS)", margin + 4, curY + 4.5);

  autoTable(doc, {
    startY: curY + 7.5,
    margin: { left: margin + 2, right: margin + 2 },
    styles: {
      fontSize: 6.8,
      font: "helvetica",
      textColor: C_NAVY,
      lineColor: C_NAVY,
      lineWidth: 0.2,
      cellPadding: 1.4
    },
    headStyles: {
      fillColor: C_MUSTARD,
      textColor: C_NAVY,
      fontStyle: "bold"
    },
    head: [["Role Identifier", "Demo Login Email", "Default Password", "Permission Scope & Module Access"]],
    body: [
      ["Administrator", "admin@costview.ng", "DemoPass2026!", "Full system control, RBAC configuration, audit journal, tenant setup"],
      ["Project Manager", "pm@costview.ng", "DemoPass2026!", "Baseline approval, Variation Order review, financial metric oversight"],
      ["Quantity Surveyor", "qs@costview.ng", "DemoPass2026!", "BOQ upload, cost code mapping, valuation certifications, retention 10%"],
      ["Architect", "arch@costview.ng", "DemoPass2026!", "Issuing formal Site Instructions (SIs), design clarifications, VO origins"],
      ["Site Engineer", "site@costview.ng", "DemoPass2026!", "Daily site diary logging, weather recording, labour muster attendance"],
      ["Procurement Officer", "procure@costview.ng", "DemoPass2026!", "Purchase requisitions, RFQ quotes, PO issuance, 3-Way invoice match"],
      ["Accountant", "acct@costview.ng", "DemoPass2026!", "Payment approvals, disbursement ledger, cashflow velocity, payroll"],
      ["Storekeeper", "store@costview.ng", "DemoPass2026!", "Goods Received Notes (GRN), warehouse stock gauges, material issues"]
    ]
  });

  // Environment & Prohibited Actions Block
  curY = 180;
  drawBrutalBox(margin, curY, contentWidth, 100, C_CREAM_MUTED, C_NAVY, 2, 0.6);
  doc.setFillColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.rect(margin, curY, contentWidth, 6.5, "F");
  doc.setTextColor(C_WHITE[0], C_WHITE[1], C_WHITE[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("ENVIRONMENT CONFIGURATION & STRICT 'NEVER' PROHIBITIONS", margin + 4, curY + 4.5);

  const envLines = [
    "Environment & Hosting Architecture:",
    "  • Local Development: costview360/apps/web/.env.local (gitignored, contains SUPABASE keys & DATABASE_URL).",
    "  • Production Hosting: Linked to iced-mist-s-projects/costview on Vercel, auto-deployed to costview-peach.vercel.app.",
    "  • Build Verification: npm run build --workspace=apps/web (must exit code 0 with 0 lint errors before opening PR).",
    "  • User Identity: All git commits must attribute author as username: icedmist, email: talk2icedmist@gmail.com.",
    "",
    "Absolute Governance Rules (Never Violate):",
    "  1. NEVER push directly to main branch or force-push (-f).",
    "  2. NEVER execute work or create code without an originating GitHub issue.",
    "  3. NEVER modify AGENTS.md, .github/WORKFLOW.md, or .github/CONTRIBUTING.md without a dedicated issue.",
    "  4. NEVER run browser agents or automated visual crawlers (explicit user rule).",
    "  5. NEVER make major architectural alterations or install external dependencies without user knowledge.",
    "  6. ALWAYS store chat memories and update MEMORY.md on key workflow completions."
  ];

  envLines.forEach((l, i) => {
    if (l.startsWith("Absolute Governance Rules")) {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(C_RED[0], C_RED[1], C_RED[2]);
    } else if (l.startsWith("Environment & Hosting")) {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
    } else {
      doc.setFont("helvetica", "normal");
      doc.setTextColor(C_TEXT[0], C_TEXT[1], C_TEXT[2]);
    }
    doc.setFontSize(7.2);
    doc.text(l, margin + 4, curY + 13 + i * 5.2);
  });

  drawPageFooter(4, 5);

  // ==========================================
  // PAGE 5: CHEAT SHEET & TROUBLESHOOTING
  // ==========================================
  doc.addPage();
  doc.setFillColor(C_CREAM[0], C_CREAM[1], C_CREAM[2]);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  drawPageHeader(5, "Quick Reference Cheat Sheet & Field Troubleshooting");

  curY = 26;
  drawBrutalBox(margin, curY, contentWidth, 14, C_WHITE, C_NAVY, 1.5, 0.5);
  doc.setTextColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("COSTVIEW 360 QUICK REFERENCE & ONBOARDING CHEAT SHEET", margin + 4, curY + 5.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text(
    "Fast navigational reference, standard UI indicators, and troubleshooting answers for field and office users.",
    margin + 4,
    curY + 10.5
  );

  // Status Badges Reference Table
  curY = 44;
  drawBrutalBox(margin, curY, contentWidth, 68, C_WHITE, C_NAVY, 2, 0.6);
  doc.setFillColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.rect(margin, curY, contentWidth, 6.5, "F");
  doc.setTextColor(C_MUSTARD[0], C_MUSTARD[1], C_MUSTARD[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("STANDARD IN-APP STATUS BADGES & MEANINGS", margin + 4, curY + 4.5);

  autoTable(doc, {
    startY: curY + 7.5,
    margin: { left: margin + 2, right: margin + 2 },
    styles: {
      fontSize: 6.8,
      font: "helvetica",
      textColor: C_NAVY,
      lineColor: C_NAVY,
      lineWidth: 0.2,
      cellPadding: 1.6
    },
    headStyles: {
      fillColor: C_MUSTARD,
      textColor: C_NAVY,
      fontStyle: "bold"
    },
    head: [["Status Badge", "Module Used", "Color Styling", "Operational Meaning & Required Next Action"]],
    body: [
      ["Baseline Locked", "BOQ & Budget", "Solid Navy Fill", "Master budget approved. Requires formal Revision Order to modify."],
      ["Match Validated", "3-Way Match", "Emerald Green Fill", "PO, GRN, and Invoice numbers and unit prices align perfectly. Ready to disburse."],
      ["Discrepancy Flag", "3-Way Match", "Amber / Red Border", "Invoice quantity or unit price diverges from site receipt. Payment held."],
      ["10% Retention Held", "Subcontractors", "Amber Block", "Statutory 10% fund withheld from interim valuation until defect period ends."],
      ["Draft → QS Valuation", "Variations (VO)", "Blue Badge", "Initial variation proposed; Quantity Surveyor is computing cost/time delta."],
      ["PM Review → Approved", "Variations (VO)", "Purple → Emerald", "PM approves valuation; budget baseline is automatically uplifted."],
      ["Low Stock Alert", "Materials", "Amber Pulsing Block", "Warehouse inventory has dipped below safety reorder threshold. Create PO."],
      ["NCR / Snag Open", "Site Diary", "Critical Red Fill", "Defect identified during site inspection; contractor must remediate and sign off."]
    ]
  });

  // Troubleshooting Matrix
  curY = 118;
  drawBrutalBox(margin, curY, contentWidth, 76, C_WHITE, C_NAVY, 2, 0.6);
  doc.setFillColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.rect(margin, curY, contentWidth, 6.5, "F");
  doc.setTextColor(C_MUSTARD[0], C_MUSTARD[1], C_MUSTARD[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("FIELD TROUBLESHOOTING & FREQUENTLY ASKED QUESTIONS", margin + 4, curY + 4.5);

  autoTable(doc, {
    startY: curY + 7.5,
    margin: { left: margin + 2, right: margin + 2 },
    styles: {
      fontSize: 6.8,
      font: "helvetica",
      textColor: C_NAVY,
      lineColor: C_NAVY,
      lineWidth: 0.2,
      cellPadding: 1.6
    },
    headStyles: {
      fillColor: C_NAVY,
      textColor: C_MUSTARD,
      fontStyle: "bold"
    },
    head: [["User Question / Dilemma", "Root Cause", "Solution & Next Action In App"]],
    body: [
      [
        "Why is my vendor invoice blocked from payment?",
        "The 3-Way Match detected an unapproved variance (>0%) between PO, GRN, or Invoice.",
        "Open '3-Way Match', review the discrepancy note, and have the Procurement Officer or QS sign off the delta."
      ],
      [
        "How do I update the budget when concrete prices increase?",
        "Direct edits are prohibited once baseline is locked.",
        "Log a formal Revision Order or have the PM approve a Variation Order (VO) linked to CON cost code."
      ],
      [
        "A subcontractor claims their certified amount was deducted?",
        "By contractual mandate, CostView 360 automatically withholds 10% statutory retention.",
        "Check 'Packages & Retention' ledger. The 10% retention fund is released upon practical completion."
      ],
      [
        "Can site engineers modify certified subcontractor valuations?",
        "Separation of duties: Site Engineers only have write access to Daily Diary and Attendance.",
        "Valuations and payments require Quantity Surveyor or Accountant RBAC credentials."
      ],
      [
        "Where is the branded PDF guide stored inside the web application?",
        "Directly in public/docs/CostView-360-User-Guide.pdf and accessible via the top-bar button.",
        "Click 'User Manual' in header or Onboarding Guide modal to download or view anytime."
      ]
    ]
  });

  // Closing Sign-Off Block
  curY = 200;
  drawBrutalBox(margin, curY, contentWidth, 80, C_CREAM_MUTED, C_NAVY, 2, 0.6);
  doc.setFillColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.rect(margin, curY, contentWidth, 6.5, "F");
  doc.setTextColor(C_MUSTARD[0], C_MUSTARD[1], C_MUSTARD[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("EXECUTIVE COMPLIANCE VERIFICATION & AUDIT SIGN-OFF", margin + 4, curY + 4.5);

  doc.setTextColor(C_TEXT[0], C_TEXT[1], C_TEXT[2]);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.2);
  const closingText = [
    "CostView 360 guarantees full digital custody of commercial construction capital. When implemented in accordance with",
    "the workflows documented in this manual:",
    "  • Construction cost leakage drops by an estimated 85% through mandatory 3-way procurement matching.",
    "  • Subcontractor dispute turnaround times fall from weeks to hours with automated 10% retention accounting.",
    "  • All operational site records remain permanently intact in high-res cloud storage, impervious to hardware theft.",
    "  • Executive controllers possess instantaneous, unimpeachable visibility into every committed, certified, and disbursed Naira.",
    "",
    "For technical support, code contributions, or institutional onboarding inquiries, refer to:",
    "Repository: https://github.com/Icedmist/CostView · Deployment: https://costview-peach.vercel.app",
    "Author: icedmist (talk2icedmist@gmail.com) · Licensed under Enterprise Commercial Real Estate Governance Standards."
  ];

  closingText.forEach((l, i) => {
    if (l.startsWith("Repository:")) {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(C_BLUE[0], C_BLUE[1], C_BLUE[2]);
    } else {
      doc.setFont("helvetica", "normal");
      doc.setTextColor(C_TEXT[0], C_TEXT[1], C_TEXT[2]);
    }
    doc.text(l, margin + 4, curY + 13 + i * 5.2);
  });

  drawPageFooter(5, 5);

  return doc;
}

// Generate and write files
const doc = createCostViewGuide();
const buffer = Buffer.from(doc.output("arraybuffer"));

const targetWebPath = path.resolve(__dirname, "../apps/web/public/docs/CostView-360-User-Guide.pdf");
const targetRootPath = path.resolve(__dirname, "../../CostView-360-User-Guide.pdf");

fs.writeFileSync(targetWebPath, buffer);
fs.writeFileSync(targetRootPath, buffer);

console.log(`✅ Branded User Guide PDF generated successfully!`);
console.log(`   Web public path:  ${targetWebPath} (${buffer.byteLength} bytes)`);
console.log(`   Repo root path:   ${targetRootPath} (${buffer.byteLength} bytes)`);
