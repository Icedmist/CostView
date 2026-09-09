import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as fs from "fs";
import * as path from "path";

// Color Palette - CostView 360 Smoothed Neo-Brutalism
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

  // Draw an arrow between two points
  function drawArrow(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: number[] = C_NAVY,
    lineWidth: number = 0.5
  ) {
    doc.setDrawColor(color[0], color[1], color[2]);
    doc.setLineWidth(lineWidth);
    doc.line(x1, y1, x2, y2);

    // Calculate angle for arrowhead
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const arrowLen = 2.4;
    const arrowAngle = Math.PI / 6;

    const xA = x2 - arrowLen * Math.cos(angle - arrowAngle);
    const yA = y2 - arrowLen * Math.sin(angle - arrowAngle);
    const xB = x2 - arrowLen * Math.cos(angle + arrowAngle);
    const yB = y2 - arrowLen * Math.sin(angle + arrowAngle);

    doc.setFillColor(color[0], color[1], color[2]);
    doc.triangle(x2, y2, xA, yA, xB, yB, "F");
  }

  // Draw header on pages 2-5
  function drawPageHeader(pageNum: number, sectionTitle: string) {
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
    doc.text(`PAGE ${pageNum} OF 5`, pageWidth - margin - 22, 17.5);
  }

  // Draw footer on all pages
  function drawPageFooter(pageNum: number, totalPages: number = 5) {
    const footY = pageHeight - 12;
    doc.setDrawColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
    doc.setLineWidth(0.6);
    doc.line(margin, footY - 2, pageWidth - margin, footY - 2);

    doc.setTextColor(C_MUTED[0], C_MUTED[1], C_MUTED[2]);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text("COSTVIEW 360 · COMMERCIAL CONSTRUCTION FIELD & FINANCIAL GOVERNANCE", margin, footY + 2);
    doc.text("CONFIDENTIAL · LICENSED USER MANUAL", margin + 105, footY + 2);
    doc.text(`${pageNum} / ${totalPages}`, pageWidth - margin - 10, footY + 2);
  }

  // ==========================================
  // PAGE 1: COVER, PURPOSE & DATA FLOW MAP
  // ==========================================

  // Background subtle cream wash
  doc.setFillColor(C_CREAM[0], C_CREAM[1], C_CREAM[2]);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Hero Card
  drawBrutalBox(margin, 16, contentWidth, 54, C_NAVY, C_NAVY, 3, 0.8);

  // Brand Badge
  doc.setFillColor(C_MUSTARD[0], C_MUSTARD[1], C_MUSTARD[2]);
  doc.rect(margin + 6, 22, 45, 6, "F");
  doc.setDrawColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.setLineWidth(0.4);
  doc.rect(margin + 6, 22, 45, 6, "D");
  doc.setTextColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("OFFICIAL USER MANUAL", margin + 8, 26.2);

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
    "Authoritative operational guide for Quantity Surveyors, Project Managers, Site Engineers & Financial Controllers.",
    margin + 6,
    51
  );
  doc.text(
    "Complete End-User Handbook · Practical Field Workflows · Visual Process Data Flows · NGN-Native Controls",
    margin + 6,
    56
  );

  // Section 1: Executive Purpose Block
  let curY = 76;
  drawBrutalBox(margin, curY, contentWidth, 34, C_WHITE, C_NAVY, 2, 0.6);

  // Section header
  doc.setFillColor(C_MUSTARD[0], C_MUSTARD[1], C_MUSTARD[2]);
  doc.rect(margin, curY, contentWidth, 7, "FD");
  doc.setTextColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("1. PLATFORM OBJECTIVE: ELIMINATING 15% - 30% COST LEAKAGE", margin + 4, curY + 5);

  doc.setTextColor(C_TEXT[0], C_TEXT[1], C_TEXT[2]);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.2);
  const mandateLines = [
    "Commercial construction projects in Nigeria routinely suffer from 15% to 30% unbudgeted cost inflation, uncontrolled",
    "contractor variation claims, material diversion from site storage, and unverified contractor invoices.",
    "CostView 360 bridges the critical operational chasm between physical site operations and commercial finance controllers.",
    "By enforcing real-time Bill of Quantities (BOQ) baselines, mandatory 3-way invoice matching, statutory 10% retention",
    "withholding, and shift attendance logs, CostView 360 ensures every kobo spent is verified against physical site reality."
  ];
  mandateLines.forEach((l, i) => doc.text(l, margin + 4, curY + 11.5 + i * 4.2));

  // The 4 Core Operational Tenets
  curY = 115;
  const colW = (contentWidth - 6) / 2;
  const colH = 34;

  // Tenet 1: NGN Native Accounting
  drawBrutalBox(margin, curY, colW, colH, C_WHITE, C_NAVY, 1.8, 0.5);
  doc.setFillColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.rect(margin, curY, colW, 5.5, "F");
  doc.setTextColor(C_MUSTARD[0], C_MUSTARD[1], C_MUSTARD[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("TENET 1: NGN (₦) NATIVE VALUATION", margin + 3, curY + 4);
  doc.setTextColor(C_TEXT[0], C_TEXT[1], C_TEXT[2]);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.text(
    "Purpose-built for Nigerian construction finance. All BOQ rates,\ncertified sums, and retention funds are natively managed\nin Naira (₦) with instant dynamic conversions to USD ($),\nGBP (£), and EUR (€) for imported MEP equipment and plant.",
    margin + 3,
    curY + 9.5
  );

  // Tenet 2: 3-Way Invoicing Match
  drawBrutalBox(margin + colW + 6, curY, colW, colH, C_WHITE, C_NAVY, 1.8, 0.5);
  doc.setFillColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.rect(margin + colW + 6, curY, colW, 5.5, "F");
  doc.setTextColor(C_MUSTARD[0], C_MUSTARD[1], C_MUSTARD[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("TENET 2: AUTOMATED 3-WAY INVOICE MATCH", margin + colW + 9, curY + 4);
  doc.setTextColor(C_TEXT[0], C_TEXT[1], C_TEXT[2]);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.text(
    "Rigorous cross-verification matching the approved Purchase\nOrder (PO) against physical Goods Received Notes (GRN) from site\nand the vendor's submitted Invoice. System automatically halts\npayment on price or quantity discrepancies.",
    margin + colW + 9,
    curY + 9.5
  );

  // Tenet 3: 10% Statutory Retention
  curY = 153;
  drawBrutalBox(margin, curY, colW, colH, C_WHITE, C_NAVY, 1.8, 0.5);
  doc.setFillColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.rect(margin, curY, colW, 5.5, "F");
  doc.setTextColor(C_MUSTARD[0], C_MUSTARD[1], C_MUSTARD[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("TENET 3: 10% STATUTORY RETENTION FUND", margin + 3, curY + 4);
  doc.setTextColor(C_TEXT[0], C_TEXT[1], C_TEXT[2]);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.text(
    "Standard Nigerian building contract clause (JCT/FIDIC) enforced\nautomatically. 10% is withheld from every subcontractor interim\ncertificate, maintaining a secure defect guarantee fund until\nPractical Completion and final snag sign-off.",
    margin + 3,
    curY + 9.5
  );

  // Tenet 4: Dual-Signoff Governance
  drawBrutalBox(margin + colW + 6, curY, colW, colH, C_WHITE, C_NAVY, 1.8, 0.5);
  doc.setFillColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.rect(margin + colW + 6, curY, colW, 5.5, "F");
  doc.setTextColor(C_MUSTARD[0], C_MUSTARD[1], C_MUSTARD[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("TENET 4: DUAL-SIGNOFF GOVERNANCE", margin + colW + 9, curY + 4);
  doc.setTextColor(C_TEXT[0], C_TEXT[1], C_TEXT[2]);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.text(
    "Separation of duties protects project funds. Site supervisors record\nphysical facts (deliveries, attendance, snags), while Quantity\nSurveyors and Project Managers certify valuations and approve\nchange orders before finance issues disbursements.",
    margin + colW + 9,
    curY + 9.5
  );

  // VISUAL DIAGRAM: END-TO-END DATA FLOW ARCHITECTURE
  curY = 192;
  const flowH = 88;
  drawBrutalBox(margin, curY, contentWidth, flowH, C_WHITE, C_NAVY, 2.5, 0.6);

  // Header of diagram box
  doc.setFillColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.rect(margin, curY, contentWidth, 7, "F");
  doc.setTextColor(C_MUSTARD[0], C_MUSTARD[1], C_MUSTARD[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("VISUAL PROCESS GUIDE: END-TO-END SYSTEM DATA FLOW IN COSTVIEW 360", margin + 4, curY + 5);

  // Subtitle in diagram
  doc.setTextColor(C_MUTED[0], C_MUTED[1], C_MUTED[2]);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.text(
    "How operational field facts translate into commercial certification and executive financial intelligence:",
    margin + 4,
    curY + 11.5
  );

  // 3 Horizontal Swimlanes / Layers
  // Lane 1: Field Site Operations & Storekeeper
  const laneY1 = curY + 14;
  const laneH = 20;
  drawBrutalBox(margin + 2, laneY1, contentWidth - 4, laneH, C_CREAM_MUTED, C_NAVY, 1, 0.4);
  doc.setFillColor(C_MUSTARD[0], C_MUSTARD[1], C_MUSTARD[2]);
  doc.rect(margin + 2, laneY1, 28, laneH, "FD");
  doc.setTextColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.text("TIER 1: FIELD OPS\n& SITE STORE", margin + 4, laneY1 + 8);

  // Blocks inside Lane 1
  const b1X = margin + 33;
  const bW = 44;
  const bH = 14;

  // Box 1A: Daily Diary & Muster
  drawBrutalBox(b1X, laneY1 + 3, bW, bH, C_WHITE, C_NAVY, 1, 0.3);
  doc.setTextColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.text("1. Daily Diary & Muster", b1X + 2, laneY1 + 7);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.8);
  doc.text("Weather, headcount, shift log,\nartisan attendance & overtime", b1X + 2, laneY1 + 11);

  // Box 1B: Materials & GRN
  const b2X = b1X + bW + 4;
  drawBrutalBox(b2X, laneY1 + 3, bW, bH, C_WHITE, C_NAVY, 1, 0.3);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.text("2. Deliveries & Site GRN", b2X + 2, laneY1 + 7);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.8);
  doc.text("Storekeeper counts physical goods,\nlogs GRN, updates stock gauges", b2X + 2, laneY1 + 11);

  // Box 1C: QA/QC & Snags
  const b3X = b2X + bW + 4;
  drawBrutalBox(b3X, laneY1 + 3, bW, bH, C_WHITE, C_NAVY, 1, 0.3);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.text("3. Element Inspections", b3X + 2, laneY1 + 7);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.8);
  doc.text("Structural QA signoff; failed checks\nauto-generate subcontractor snags", b3X + 2, laneY1 + 11);

  // Flow Arrow Down from Tier 1 to Tier 2
  drawArrow(margin + 55, laneY1 + laneH, margin + 55, laneY1 + laneH + 4, C_BLUE, 0.6);
  drawArrow(margin + 103, laneY1 + laneH, margin + 103, laneY1 + laneH + 4, C_BLUE, 0.6);
  drawArrow(margin + 151, laneY1 + laneH, margin + 151, laneY1 + laneH + 4, C_BLUE, 0.6);

  // Lane 2: Commercial & Procurement Engine
  const laneY2 = laneY1 + laneH + 4;
  drawBrutalBox(margin + 2, laneY2, contentWidth - 4, laneH, C_CREAM_MUTED, C_NAVY, 1, 0.4);
  doc.setFillColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.rect(margin + 2, laneY2, 28, laneH, "FD");
  doc.setTextColor(C_MUSTARD[0], C_MUSTARD[1], C_MUSTARD[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.text("TIER 2: COMMERCIAL\n& PROCUREMENT", margin + 3.5, laneY2 + 8);

  // Box 2A: BOQ Baseline & Cost Codes
  drawBrutalBox(b1X, laneY2 + 3, bW, bH, C_WHITE, C_NAVY, 1, 0.3);
  doc.setTextColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.text("4. BOQ Baseline Budget", b1X + 2, laneY2 + 7);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.8);
  doc.text("Approved bill quantities, unit rates,\ncost codes, & contingency reserve", b1X + 2, laneY2 + 11);

  // Box 2B: 3-Way Match Verification
  drawBrutalBox(b2X, laneY2 + 3, bW, bH, C_WHITE, C_NAVY, 1, 0.3);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.text("5. 3-Way Invoice Match", b2X + 2, laneY2 + 7);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.8);
  doc.text("PO vs Site GRN vs Vendor Invoice;\nzero-tolerance variance validation", b2X + 2, laneY2 + 11);

  // Box 2C: Subcontractor Ledger & 10%
  drawBrutalBox(b3X, laneY2 + 3, bW, bH, C_WHITE, C_NAVY, 1, 0.3);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.text("6. Valuations & Retention", b3X + 2, laneY2 + 7);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.8);
  doc.text("Interim progress claims, auto 10%\nretention withholding, 4-factor grading", b3X + 2, laneY2 + 11);

  // Flow Arrow Down from Tier 2 to Tier 3
  drawArrow(margin + 55, laneY2 + laneH, margin + 55, laneY2 + laneH + 4, C_EMERALD, 0.6);
  drawArrow(margin + 103, laneY2 + laneH, margin + 103, laneY2 + laneH + 4, C_EMERALD, 0.6);
  drawArrow(margin + 151, laneY2 + laneH, margin + 151, laneY2 + laneH + 4, C_EMERALD, 0.6);

  // Lane 3: Executive & Financial Command Center
  const laneY3 = laneY2 + laneH + 4;
  drawBrutalBox(margin + 2, laneY3, contentWidth - 4, laneH, C_CREAM_MUTED, C_NAVY, 1, 0.4);
  doc.setFillColor(C_EMERALD[0], C_EMERALD[1], C_EMERALD[2]);
  doc.rect(margin + 2, laneY3, 28, laneH, "FD");
  doc.setTextColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.text("TIER 3: EXECUTIVE\nCOMMAND CENTER", margin + 3.5, laneY3 + 8);

  // Box 3A: Financial Health & KPIs
  drawBrutalBox(b1X, laneY3 + 3, bW, bH, C_WHITE, C_NAVY, 1, 0.3);
  doc.setTextColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.text("7. Project Cost Health", b1X + 2, laneY3 + 7);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.8);
  doc.text("Live CPI/SPI performance, committed\ncosts vs certified vs actual paid", b1X + 2, laneY3 + 11);

  // Box 3B: Variations & Change Control
  drawBrutalBox(b2X, laneY3 + 3, bW, bH, C_WHITE, C_NAVY, 1, 0.3);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.text("8. 4-Stage Variations", b2X + 2, laneY3 + 7);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.8);
  doc.text("SI logged → QS costed → PM review\n→ Client signoff uplifts baseline", b2X + 2, laneY3 + 11);

  // Box 3C: Reports & Audit Journal
  drawBrutalBox(b3X, laneY3 + 3, bW, bH, C_WHITE, C_NAVY, 1.8, 0.3);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.text("9. PDF Reports & Audit", b3X + 2, laneY3 + 7);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.8);
  doc.text("Executive cost-to-complete exports,\nbank valuation sheets, audit trail", b3X + 2, laneY3 + 11);

  drawPageFooter(1, 5);

  // ==========================================
  // PAGE 2: THE 10 CORE FUNCTIONAL MODULES
  // ==========================================
  doc.addPage();
  doc.setFillColor(C_CREAM[0], C_CREAM[1], C_CREAM[2]);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  drawPageHeader(2, "Core Functional Modules & System Capabilities");

  curY = 25;
  drawBrutalBox(margin, curY, contentWidth, 13, C_WHITE, C_NAVY, 1.5, 0.5);
  doc.setTextColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("COMPREHENSIVE EXPLANATION OF THE 10 COSTVIEW 360 CORE SUBSYSTEMS", margin + 4, curY + 4.8);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.text(
    "CostView 360 provides 10 purpose-built modules. Each is designed for specific project personnel to ensure complete commercial control.",
    margin + 4,
    curY + 9.5
  );

  // Table of the 10 Modules
  autoTable(doc, {
    startY: curY + 16,
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
      0: { cellWidth: 34, fontStyle: "bold" },
      1: { cellWidth: 26 },
      2: { cellWidth: 62 },
      3: { cellWidth: 60 }
    },
    head: [["Module Name & Path", "Primary Users", "What To Do: Step-by-Step Actions", "System Governance & Value Delivered"]],
    body: [
      [
        "1. Commercial Command Center\nPath: / (Dashboard)",
        "Project Director,\nCommercial Manager,\nContract Administrator",
        "1. Review Top KPIs: Total Budget, Committed Cost, Paid to Date, and Contingency Burn.\n2. Monitor Project Health Badge (On Track, At Risk, Over Budget).\n3. Check CPI (Cost Performance Index) and SPI (Schedule Performance Index).\n4. Review recent site alerts and cash velocity chart.",
        "Delivers instant executive visibility. Detects cost code overruns before funds are committed, giving directors early warning on budget risk."
      ],
      [
        "2. BOQ & Baseline Budget\nPath: /budget",
        "Senior Quantity Surveyor,\nCost Planner",
        "1. Click 'Import Excel / CSV' to upload approved Bill of Quantities.\n2. Assign NRM2/CESMM4 cost codes (Substructure, Concrete, MEP, Finishes).\n3. Set project contingency reserve (e.g. 5.0%).\n4. Review unit rates and total values; click 'Lock Baseline' to establish master control.",
        "Prevents unapproved budget tampering. Once locked, bill items cannot be altered without a formal Variation Order or Revision Notice."
      ],
      [
        "3. Procurement & POs\nPath: /procurement",
        "Procurement Lead,\nQuantity Surveyor",
        "1. Review purchase requisitions raised by site supervisors.\n2. Obtain and compare 3 competitive supplier RFQ quotes.\n3. Issue formal Purchase Order (PO) with binding unit rates and delivery schedules.\n4. Route PO for commercial manager financial authorization.",
        "Eliminates rogue purchasing and off-contract pricing. Enforces supplier accountability and pre-approves commercial commitments."
      ],
      [
        "4. Three-Way Invoice Match\nPath: /procurement (Match Tab)",
        "Financial Controller,\nAccounts Payable Officer",
        "1. When vendor invoice arrives, open 3-Way Match screen.\n2. System links Purchase Order, Site Goods Received Note (GRN), and Invoice.\n3. Inspect automated variance calculations (unit price and quantity).\n4. If 100% matched, click 'Approve for Payment'. If discrepancy, click 'Raise Dispute'.",
        "Guarantees that finance only pays for items physically verified on site at agreed contract rates. Eliminates phantom invoicing and double-billing."
      ],
      [
        "5. Materials & Stock Control\nPath: /materials",
        "Site Storekeeper,\nMaterials Engineer",
        "1. Log incoming material trucks; generate Goods Received Note (GRN).\n2. Record physical counts (e.g. 500 bags Dangote 42.5R Cement, 12 tonnes rebar).\n3. Record daily material issues to artisan crews by BOQ zone/grid.\n4. Monitor live stock gauge meters; place reorder requests when thresholds hit yellow.",
        "Reconciles theoretical BOQ quantities against actual physical usage. Prevents site shrinkage, theft, and jobsite material stockouts."
      ],
      [
        "6. Labour Muster & Attendance\nPath: /labour",
        "Site Supervisor,\nHR Officer, Site Agent",
        "1. Conduct 07:30 AM morning muster roll.\n2. Check in skilled artisans (masons, carpenters, iron benders, plumbers) and daily helpers.\n3. Log overtime hours with supervisory sign-off.\n4. Reconcile weekly muster records against subcontractor workforce claims.",
        "Eliminates ghost worker payroll fraud. Ensures daily labor expenditure matches certified physical site progress."
      ],
      [
        "7. Site Operations & Diary\nPath: /site-ops",
        "Resident Engineer,\nQA/QC Inspector",
        "1. Log daily shift records: weather conditions, delays, and critical work progress.\n2. Upload timestamped milestone progress photographs.\n3. Conduct element inspections (rebar fixing, formwork, MEP conduit embedment).\n4. If inspection fails, system auto-generates a Snag/NCR assigned to the trade contractor.",
        "Provides legally defensible daily site records. Cloud synchronization ensures daily diaries cannot be lost or retrospectively altered."
      ],
      [
        "8. Subcontractor Packages\nPath: /subcontractors",
        "Quantity Surveyor,\nProject Manager",
        "1. Award trade packages with contracted scopes and values.\n2. When contractor submits monthly valuation, verify progress on site.\n3. Enter certified sum; system automatically deducts 10% statutory retention.\n4. Generate Interim Payment Certificate and record 4-factor performance grade.",
        "Enforces the 10% statutory retention fund on every claim. Protects the client against subcontractor default and non-performing trades."
      ],
      [
        "9. Variations & Instructions\nPath: /site-ops (Tabs 7.1 & 7.2)",
        "Architect, Resident Eng,\nQuantity Surveyor",
        "1. Consultant issues formal Site Instruction (SI) with sketch/drawings.\n2. QS links SI to a Variation Order (VO) and computes cost/time delta.\n3. Route through 4-stage approval: Draft → QS Valuation → PM Review → Approved.\n4. Upon final sign-off, system automatically adjusts master budget baseline.",
        "Eliminates verbal instruction disputes. Ensures all change orders are valued, approved, and tracked before contractor carries out extra work."
      ],
      [
        "10. Reports Studio & Exports\nPath: /reports",
        "Commercial Director,\nClient Representative",
        "1. Select project and required reporting period.\n2. Choose report type: Executive Cost Summary, Subcontractor Ledger, or Audit Log.\n3. Generate high-resolution, branded PDF documents with one click.\n4. Distribute to banks, joint-venture partners, and executive board members.",
        "Transforms complex project figures into boardroom-ready visual reports with transparent cost-to-complete forecasts and audit backing."
      ]
    ]
  });

  drawPageFooter(2, 5);

  // ==========================================
  // PAGE 3: STEP-BY-STEP FIELD & PROJECT SETUP
  // ==========================================
  doc.addPage();
  doc.setFillColor(C_CREAM[0], C_CREAM[1], C_CREAM[2]);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  drawPageHeader(3, "Step-by-Step User Guide: Project Setup & Daily Field Ops");

  curY = 25;
  drawBrutalBox(margin, curY, contentWidth, 11, C_MUSTARD, C_NAVY, 1.5, 0.5);
  doc.setTextColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("STANDARD OPERATING PROCEDURES (SOP): SETUP, FIELD ROUTINES & QUALITY", margin + 4, curY + 7);

  // Guide Section 1: Baseline Setup
  curY = 40;
  drawBrutalBox(margin, curY, contentWidth, 50, C_WHITE, C_NAVY, 1.8, 0.5);
  doc.setFillColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.rect(margin, curY, contentWidth, 6, "F");
  doc.setTextColor(C_WHITE[0], C_WHITE[1], C_WHITE[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("WORKFLOW 1: INITIAL PROJECT SETUP & BOQ BASELINE LOCKING (DAY 1)", margin + 4, curY + 4.2);

  doc.setTextColor(C_TEXT[0], C_TEXT[1], C_TEXT[2]);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  const setupSteps = [
    "Step 1: Access the Platform — Log in with your Quantity Surveyor (QS) or Commercial Manager account.",
    "Step 2: Navigate to BOQ & Baseline — Open the 'BOQ & Budget' screen from the main sidebar navigation.",
    "Step 3: Import Bill of Quantities — Click 'Import Excel / CSV BOQ'. Select your standard bill spreadsheet (supports NRM2,",
    "        CESMM4, or custom contractor formats with item description, unit, quantity, and contract rate in Naira).",
    "Step 4: Verify Cost Code Mapping — Confirm items are categorized under major cost codes (e.g. SUB Substructure, CON Concrete",
    "        Frame, BLK Masonry & Blockwork, FIN Finishes, MEP Mechanical & Electrical, EXT External Works).",
    "Step 5: Set Contingency Reserve — Establish the project contingency fund (standard 5.0% recommended for price escalation).",
    "Step 6: Lock Commercial Baseline — Click 'Lock Baseline'. Once locked, initial contract sums are frozen. Any future changes",
    "        must flow through formal Variation Orders or Revision Notices, establishing an immutable benchmark for cost tracking."
  ];
  setupSteps.forEach((s, i) => doc.text(s, margin + 4, curY + 11 + i * 4.6));

  // Guide Section 2: Daily Site Routine
  curY = 94;
  drawBrutalBox(margin, curY, contentWidth, 54, C_WHITE, C_NAVY, 1.8, 0.5);
  doc.setFillColor(C_EMERALD[0], C_EMERALD[1], C_EMERALD[2]);
  doc.rect(margin, curY, contentWidth, 6, "F");
  doc.setTextColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("WORKFLOW 2: DAILY SITE OPERATIONS & INSPECTION ROUTINE (CHRONOLOGICAL)", margin + 4, curY + 4.2);

  doc.setTextColor(C_TEXT[0], C_TEXT[1], C_TEXT[2]);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  const dailySteps = [
    "07:30 AM — Morning Labour Muster: Site Supervisor opens 'Labour Muster'. Call roll for direct artisan crews and",
    "           subcontractor gangs. Mark attendance and verify any authorized night overtime hours.",
    "09:30 AM — Daily Diary Shift Initiation: Site Engineer opens 'Site Diary'. The system auto-stamps current local weather.",
    "           Record scheduled activities (e.g., 'Casting second-floor suspended slab columns with 40m³ ReadyMix').",
    "12:00 PM — Material Deliveries & Store GRN: Storekeeper inspects arriving trucks at site gate. Verify waybills, count bags,",
    "           rebar bundles, or aggregates. Log Goods Received Note (GRN) in 'Materials & Stock' against the active PO.",
    "03:30 PM — Element QA/QC Inspections: Resident Engineer conducts quality checklists (e.g., rebar spacing, cover blocks,",
    "           formwork plumbness). If any check fails, the system automatically logs a defect Snag assigned to the trade.",
    "05:30 PM — Shift Closeout & Sync: Complete daily shift report, attach milestone progress photos, record any weather delay",
    "           hours (vital for contractual extension of time claims), and submit for Resident Engineer verification."
  ];
  dailySteps.forEach((s, i) => doc.text(s, margin + 4, curY + 11 + i * 5.2));

  // VISUAL DIAGRAM: FIELD EXECUTION & QUALITY FLOWCHART
  curY = 152;
  const diagH = 120;
  drawBrutalBox(margin, curY, contentWidth, diagH, C_WHITE, C_NAVY, 2.5, 0.6);

  // Diagram Header
  doc.setFillColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.rect(margin, curY, contentWidth, 7, "F");
  doc.setTextColor(C_MUSTARD[0], C_MUSTARD[1], C_MUSTARD[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("VISUAL PROCESS FLOW: DAILY FIELD SITE ROUTINE & QUALITY SNAG MANAGEMENT", margin + 4, curY + 5);

  doc.setTextColor(C_MUTED[0], C_MUTED[1], C_MUTED[2]);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.text(
    "Visual execution sequence from morning workforce muster through delivery receipts, quality checks, and defect tracking:",
    margin + 4,
    curY + 11.5
  );

  // Flowchart Nodes Layout
  // Row 1: Morning Shift & Site Diary
  const fRow1Y = curY + 15;
  const fBoxW = 40;
  const fBoxH = 18;

  // Node 1: Morning Muster
  const n1X = margin + 6;
  drawBrutalBox(n1X, fRow1Y, fBoxW, fBoxH, C_CREAM_MUTED, C_NAVY, 1.5, 0.4);
  doc.setFillColor(C_MUSTARD[0], C_MUSTARD[1], C_MUSTARD[2]);
  doc.rect(n1X, fRow1Y, fBoxW, 4, "F");
  doc.setTextColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.2);
  doc.text("07:30 · Labour Muster", n1X + 2, fRow1Y + 3);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.8);
  doc.text("Mark daily artisan roll\nRecord overtime & trades\nBlock phantom workers", n1X + 2, fRow1Y + 7.5);

  // Arrow 1 -> 2
  drawArrow(n1X + fBoxW + 2, fRow1Y + 9, n1X + fBoxW + 7, fRow1Y + 9, C_NAVY, 0.6);

  // Node 2: Site Diary Log
  const n2X = n1X + fBoxW + 8;
  drawBrutalBox(n2X, fRow1Y, fBoxW, fBoxH, C_CREAM_MUTED, C_NAVY, 1.5, 0.4);
  doc.setFillColor(C_BLUE[0], C_BLUE[1], C_BLUE[2]);
  doc.rect(n2X, fRow1Y, fBoxW, 4, "F");
  doc.setTextColor(C_WHITE[0], C_WHITE[1], C_WHITE[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.2);
  doc.text("09:30 · Shift Diary", n2X + 2, fRow1Y + 3);
  doc.setTextColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.8);
  doc.text("Auto-record weather\nLog planned activities\nNote rain/utility delays", n2X + 2, fRow1Y + 7.5);

  // Arrow 2 -> 3
  drawArrow(n2X + fBoxW + 2, fRow1Y + 9, n2X + fBoxW + 7, fRow1Y + 9, C_NAVY, 0.6);

  // Node 3: Deliveries & GRN
  const n3X = n2X + fBoxW + 8;
  drawBrutalBox(n3X, fRow1Y, fBoxW, fBoxH, C_CREAM_MUTED, C_NAVY, 1.5, 0.4);
  doc.setFillColor(C_AMBER[0], C_AMBER[1], C_AMBER[2]);
  doc.rect(n3X, fRow1Y, fBoxW, 4, "F");
  doc.setTextColor(C_WHITE[0], C_WHITE[1], C_WHITE[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.2);
  doc.text("12:00 · Material GRN", n3X + 2, fRow1Y + 3);
  doc.setTextColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.8);
  doc.text("Inspect supplier trucks\nCount items against PO\nLog GRN in store ledger", n3X + 2, fRow1Y + 7.5);

  // Arrow Down from Node 3 to Row 2
  drawArrow(n3X + fBoxW / 2, fRow1Y + fBoxH + 2, n3X + fBoxW / 2, fRow1Y + fBoxH + 9, C_NAVY, 0.6);

  // Row 2: Quality Inspection & Decision
  const fRow2Y = fRow1Y + fBoxH + 10;

  // Node 4: QA/QC Inspection
  drawBrutalBox(n3X, fRow2Y, fBoxW, fBoxH, C_WHITE, C_NAVY, 1.5, 0.4);
  doc.setFillColor(C_PURPLE[0], C_PURPLE[1], C_PURPLE[2]);
  doc.rect(n3X, fRow2Y, fBoxW, 4, "F");
  doc.setTextColor(C_WHITE[0], C_WHITE[1], C_WHITE[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.2);
  doc.text("15:30 · QA/QC Check", n3X + 2, fRow2Y + 3);
  doc.setTextColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.8);
  doc.text("Test elements on site\nCheck rebar, formwork\nEvaluate against specs", n3X + 2, fRow2Y + 7.5);

  // Arrow Left from Node 4 to Decision Node
  drawArrow(n3X - 2, fRow2Y + 9, n2X + fBoxW + 2, fRow2Y + 9, C_NAVY, 0.6);

  // Decision Box: Inspection Result
  drawBrutalBox(n2X, fRow2Y, fBoxW, fBoxH, C_MUSTARD, C_NAVY, 1.5, 0.4);
  doc.setTextColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.text("Inspection Result?", n2X + 6, fRow2Y + 6);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(5.8);
  doc.setTextColor(C_EMERALD[0], C_EMERALD[1], C_EMERALD[2]);
  doc.text("✔ PASS: Sign-off", n2X + 6, fRow2Y + 11);
  doc.setTextColor(C_RED[0], C_RED[1], C_RED[2]);
  doc.text("✖ FAIL: Raise Snag", n2X + 6, fRow2Y + 15);

  // Arrow from Decision to Pass (Row 3 Left)
  drawArrow(n2X + 10, fRow2Y + fBoxH + 2, n1X + fBoxW / 2, fRow2Y + fBoxH + 9, C_EMERALD, 0.6);
  // Arrow from Decision to Fail (Row 3 Right)
  drawArrow(n2X + 30, fRow2Y + fBoxH + 2, n2X + fBoxW / 2, fRow2Y + fBoxH + 9, C_RED, 0.6);

  // Row 3: Outcomes
  const fRow3Y = fRow2Y + fBoxH + 10;

  // Outcome A: Work Approved
  drawBrutalBox(n1X, fRow3Y, fBoxW, fBoxH + 2, C_WHITE, C_NAVY, 1.5, 0.4);
  doc.setFillColor(C_EMERALD[0], C_EMERALD[1], C_EMERALD[2]);
  doc.rect(n1X, fRow3Y, fBoxW, 4, "F");
  doc.setTextColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.2);
  doc.text("Outcome A: Approved", n1X + 2, fRow3Y + 3);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.8);
  doc.text("Element passed inspection\nPour / next activity authorized\nProgress credited to BOQ", n1X + 2, fRow3Y + 7.5);

  // Outcome B: Auto-Snag Raised
  drawBrutalBox(n2X, fRow3Y, fBoxW, fBoxH + 2, C_WHITE, C_NAVY, 1.5, 0.4);
  doc.setFillColor(C_RED[0], C_RED[1], C_RED[2]);
  doc.rect(n2X, fRow3Y, fBoxW, 4, "F");
  doc.setTextColor(C_WHITE[0], C_WHITE[1], C_WHITE[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.2);
  doc.text("Outcome B: Defect Snag", n2X + 2, fRow3Y + 3);
  doc.setTextColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.8);
  doc.text("Defect logged with photo\nAssigned to trade contractor\nBlocks payment until closed", n2X + 2, fRow3Y + 7.5);

  // Outcome C: Final Shift Signoff
  drawBrutalBox(n3X, fRow3Y, fBoxW, fBoxH + 2, C_WHITE, C_NAVY, 1.5, 0.4);
  doc.setFillColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.rect(n3X, fRow3Y, fBoxW, 4, "F");
  doc.setTextColor(C_MUSTARD[0], C_MUSTARD[1], C_MUSTARD[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.2);
  doc.text("17:30 · Shift Verified", n3X + 2, fRow3Y + 3);
  doc.setTextColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.8);
  doc.text("Resident Engineer signs log\nSyncs to commercial ledger\nAudit timestamp locked", n3X + 2, fRow3Y + 7.5);

  // Connect Outcome A & B to Final Shift Signoff
  drawArrow(n2X + fBoxW + 2, fRow3Y + 10, n3X - 2, fRow3Y + 10, C_NAVY, 0.6);

  drawPageFooter(3, 5);

  // ==========================================
  // PAGE 4: PROCUREMENT, 3-WAY MATCH & VALUATION
  // ==========================================
  doc.addPage();
  doc.setFillColor(C_CREAM[0], C_CREAM[1], C_CREAM[2]);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  drawPageHeader(4, "Step-by-Step User Guide: Procurement & Subcontractors");

  curY = 25;
  drawBrutalBox(margin, curY, contentWidth, 11, C_MUSTARD, C_NAVY, 1.5, 0.5);
  doc.setTextColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("COMMERCIAL WORKFLOWS: 3-WAY MATCHING & 10% RETENTION VALUATION", margin + 4, curY + 7);

  // Guide Section 3: Procurement & 3-Way Match
  curY = 40;
  drawBrutalBox(margin, curY, contentWidth, 48, C_WHITE, C_NAVY, 1.8, 0.5);
  doc.setFillColor(C_BLUE[0], C_BLUE[1], C_BLUE[2]);
  doc.rect(margin, curY, contentWidth, 6, "F");
  doc.setTextColor(C_WHITE[0], C_WHITE[1], C_WHITE[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("WORKFLOW 3: PROCUREMENT & 3-WAY INVOICE MATCHING (ZERO OVERPAYMENT)", margin + 4, curY + 4.2);

  doc.setTextColor(C_TEXT[0], C_TEXT[1], C_TEXT[2]);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  const procureSteps = [
    "Step 1: Requisition Creation — Site supervisor raises material request referencing the exact BOQ line item.",
    "Step 2: RFQ Solicitation & PO Issuance — Procurement compares 3 supplier quotes. Commercial manager authorizes the",
    "        Purchase Order (PO) locking unit price (e.g., ₦8,500/bag) and quantity (e.g., 500 bags).",
    "Step 3: Physical Delivery & Site GRN — When goods arrive on site, the Storekeeper inspects the physical shipment, counts",
    "        bags, and issues a Goods Received Note (GRN) (e.g., actual verified count: 480 bags).",
    "Step 4: Invoice Entry & 3-Way Match — Vendor submits invoice (e.g., billing 500 bags at ₦8,800/bag). The accountant",
    "        opens '3-Way Match'. The system automatically compares: PO (500 @ ₦8,500) vs GRN (480) vs Invoice (500 @ ₦8,800).",
    "Step 5: Automated Variance Resolution — The system detects a quantity delta (20 bags short) and rate delta (₦300 over).",
    "        CostView 360 immediately locks the invoice, blocking payment release until the vendor issues an amended credit note."
  ];
  procureSteps.forEach((s, i) => doc.text(s, margin + 4, curY + 10.5 + i * 4.6));

  // VISUAL DIAGRAM: 3-WAY MATCH DECISION TREE
  curY = 92;
  const matchDiagH = 50;
  drawBrutalBox(margin, curY, contentWidth, matchDiagH, C_WHITE, C_NAVY, 2, 0.5);

  doc.setFillColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.rect(margin, curY, contentWidth, 5.5, "F");
  doc.setTextColor(C_MUSTARD[0], C_MUSTARD[1], C_MUSTARD[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.2);
  doc.text("VISUAL DATA FLOW: AUTOMATED 3-WAY INVOICE RECONCILIATION GATE", margin + 4, curY + 4);

  // 3 Source Document Nodes
  const docW = 38;
  const docH = 14;
  const docY = curY + 8;

  // Source 1: PO
  drawBrutalBox(margin + 4, docY, docW, docH, C_CREAM_MUTED, C_NAVY, 1, 0.3);
  doc.setTextColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.2);
  doc.text("Document 1: Purchase Order", margin + 6, docY + 4.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.5);
  doc.text("Agreed Unit Price & Qty\nLocked commercial contract", margin + 6, docY + 8.5);

  // Source 2: GRN
  drawBrutalBox(margin + 46, docY, docW, docH, C_CREAM_MUTED, C_NAVY, 1, 0.3);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.2);
  doc.text("Document 2: Goods Rec. Note", margin + 48, docY + 4.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.5);
  doc.text("Physical on-site count\nSigned by site storekeeper", margin + 48, docY + 8.5);

  // Source 3: Invoice
  drawBrutalBox(margin + 88, docY, docW, docH, C_CREAM_MUTED, C_NAVY, 1, 0.3);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.2);
  doc.text("Document 3: Vendor Invoice", margin + 90, docY + 4.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.5);
  doc.text("Billed sum from supplier\nSubmitted for payment", margin + 90, docY + 8.5);

  // Reconciliation Engine Center
  const engX = margin + 132;
  const engW = 44;
  drawBrutalBox(engX, docY, engW, docH, C_NAVY, C_NAVY, 1.5, 0.4);
  doc.setTextColor(C_MUSTARD[0], C_MUSTARD[1], C_MUSTARD[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.text("3-WAY MATCH ENGINE", engX + 3, docY + 5.5);
  doc.setTextColor(C_WHITE[0], C_WHITE[1], C_WHITE[2]);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.5);
  doc.text("Price Check (PO vs Inv)\nQty Check (GRN vs Inv)", engX + 3, docY + 9.5);

  // Arrows from Docs to Engine
  drawArrow(margin + 42, docY + 7, margin + 45, docY + 7, C_NAVY, 0.5);
  drawArrow(margin + 84, docY + 7, margin + 87, docY + 7, C_NAVY, 0.5);
  drawArrow(margin + 126, docY + 7, engX - 1, docY + 7, C_NAVY, 0.5);

  // Decision Branches Below Engine
  const branchY = curY + 27;
  const outW = 84;
  const outH = 16;

  // Branch A: Match Success (Green)
  drawBrutalBox(margin + 4, branchY, outW, outH, C_WHITE, C_NAVY, 1.5, 0.4);
  doc.setFillColor(C_EMERALD[0], C_EMERALD[1], C_EMERALD[2]);
  doc.rect(margin + 4, branchY, outW, 4, "F");
  doc.setTextColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.text("✔ PERFECT MATCH: Quantities and Unit Prices Equal", margin + 6, branchY + 3);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.8);
  doc.text(
    "Finance unlocks disbursement. Payment certificate issued. Stock inventory committed\nand actual expenditure posted to the Commercial Command Center ledger.",
    margin + 6,
    branchY + 8
  );

  // Branch B: Discrepancy Halt (Red)
  drawBrutalBox(margin + 94, branchY, outW, outH, C_WHITE, C_NAVY, 1.5, 0.4);
  doc.setFillColor(C_RED[0], C_RED[1], C_RED[2]);
  doc.rect(margin + 94, branchY, outW, 4, "F");
  doc.setTextColor(C_WHITE[0], C_WHITE[1], C_WHITE[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.text("✖ DISCREPANCY DETECTED: Price / Qty Variance Exceeds 0%", margin + 96, branchY + 3);
  doc.setTextColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.8);
  doc.text(
    "System halts payment release. Discrepancy notice issued to vendor. Account blocked\nuntil credit note uploaded or commercial variation explicitly approved by PM.",
    margin + 96,
    branchY + 8
  );

  // Arrows from Engine to Branches
  drawArrow(engX + 10, docY + docH + 1, margin + 50, branchY - 1, C_EMERALD, 0.6);
  drawArrow(engX + 30, docY + docH + 1, margin + 135, branchY - 1, C_RED, 0.6);

  // Guide Section 4: Subcontractors & Retention
  curY = 146;
  drawBrutalBox(margin, curY, contentWidth, 54, C_WHITE, C_NAVY, 1.8, 0.5);
  doc.setFillColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.rect(margin, curY, contentWidth, 6, "F");
  doc.setTextColor(C_MUSTARD[0], C_MUSTARD[1], C_MUSTARD[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("WORKFLOW 4: SUBCONTRACTOR INTERIM VALUATIONS & 10% RETENTION LIFECYCLE", margin + 4, curY + 4.2);

  doc.setTextColor(C_TEXT[0], C_TEXT[1], C_TEXT[2]);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  const subSteps = [
    "Step 1: Subcontractor Milestone Claim — Trade contractor submits monthly application (e.g. Zenith Piling: ₦18,500,000).",
    "Step 2: Physical Site Measurement — Quantity Surveyor visits site, verifies borehole depths and piles cast against drawings.",
    "Step 3: Certification & Automatic 10% Deduction — QS enters certified sum in 'Subcontractor Packages' and clicks",
    "        'Certify & Apply 10%'. CostView 360 immediately isolates ₦1,850,000 into the cumulative retention escrow ledger,",
    "        and approves the net ₦16,650,000 for financial payment.",
    "Step 4: Four-Factor Contractor Grading — QS submits monthly performance rating across 4 factors: Schedule Punctuality,",
    "        Quality Compliance, Site Safety, and Commercial Cooperation. Maintains an objective historical scorecard.",
    "Step 5: Handover & Retention Release — At Practical Completion, 5% (first half) is released upon snag list clearance.",
    "        The remaining 5% is released following the 6-month Defects Liability Period signoff by the Resident Engineer."
  ];
  subSteps.forEach((s, i) => doc.text(s, margin + 4, curY + 11 + i * 5.2));

  // VISUAL DIAGRAM: RETENTION ESCROW PIPELINE
  curY = 204;
  const retH = 68;
  drawBrutalBox(margin, curY, contentWidth, retH, C_WHITE, C_NAVY, 2, 0.5);

  doc.setFillColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.rect(margin, curY, contentWidth, 5.5, "F");
  doc.setTextColor(C_WHITE[0], C_WHITE[1], C_WHITE[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.2);
  doc.text("VISUAL PROCESS MAP: 10% RETENTION DEDUCTION & DEFECT RELEASE CYCLE", margin + 4, curY + 4);

  // 4 Sequential Stages
  const sW = 40;
  const sH = 22;
  const sY = curY + 9;

  // Stage 1
  drawBrutalBox(margin + 4, sY, sW, sH, C_CREAM_MUTED, C_NAVY, 1, 0.3);
  doc.setFillColor(C_MUSTARD[0], C_MUSTARD[1], C_MUSTARD[2]);
  doc.rect(margin + 4, sY, sW, 4, "F");
  doc.setTextColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.2);
  doc.text("STAGE 1: CLAIM", margin + 6, sY + 3);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.5);
  doc.text("Subcontractor files interim\npayment application for\ncompleted site work package.", margin + 6, sY + 7.5);

  // Arrow 1 -> 2
  drawArrow(margin + 44, sY + 11, margin + 48, sY + 11, C_NAVY, 0.6);

  // Stage 2
  drawBrutalBox(margin + 49, sY, sW, sH, C_CREAM_MUTED, C_NAVY, 1, 0.3);
  doc.setFillColor(C_BLUE[0], C_BLUE[1], C_BLUE[2]);
  doc.rect(margin + 49, sY, sW, 4, "F");
  doc.setTextColor(C_WHITE[0], C_WHITE[1], C_WHITE[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.2);
  doc.text("STAGE 2: QS VALUATION", margin + 51, sY + 3);
  doc.setTextColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.5);
  doc.text("QS conducts physical site\nmeasurement and certifies\nvalid progress quantity.", margin + 51, sY + 7.5);

  // Arrow 2 -> 3
  drawArrow(margin + 89, sY + 11, margin + 93, sY + 11, C_NAVY, 0.6);

  // Stage 3
  drawBrutalBox(margin + 94, sY, sW, sH, C_CREAM_MUTED, C_NAVY, 1, 0.3);
  doc.setFillColor(C_PURPLE[0], C_PURPLE[1], C_PURPLE[2]);
  doc.rect(margin + 94, sY, sW, 4, "F");
  doc.setTextColor(C_WHITE[0], C_WHITE[1], C_WHITE[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.2);
  doc.text("STAGE 3: 10% RETENTION", margin + 96, sY + 3);
  doc.setTextColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.5);
  doc.text("System auto-deducts 10%\ninto escrow ledger; 90% net\ncertified for payment.", margin + 96, sY + 7.5);

  // Arrow 3 -> 4
  drawArrow(margin + 134, sY + 11, margin + 138, sY + 11, C_NAVY, 0.6);

  // Stage 4
  drawBrutalBox(margin + 139, sY, sW, sH, C_CREAM_MUTED, C_NAVY, 1, 0.3);
  doc.setFillColor(C_EMERALD[0], C_EMERALD[1], C_EMERALD[2]);
  doc.rect(margin + 139, sY, sW, 4, "F");
  doc.setTextColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.2);
  doc.text("STAGE 4: DEFECT RELEASE", margin + 141, sY + 3);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.5);
  doc.text("5% released at Handover;\n5% released after 6-month\nDefects Liability Period.", margin + 141, sY + 7.5);

  // Lower explanatory callout inside box
  const callY = sY + sH + 4;
  drawBrutalBox(margin + 4, callY, contentWidth - 8, 22, C_CREAM, C_NAVY, 1, 0.3);
  doc.setTextColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.text("KEY RULE: HOW THE RETENTION FUND SAFEGUARDS PROJECT CASHFLOW", margin + 7, callY + 4.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.text(
    "1. Contractor Default Protection: If a subcontractor abandons the site, retained funds pay for substitute completion.\n" +
    "2. Quality Enforcement: Outstanding snag tickets block the release of retention funds until physical repair sign-off.\n" +
    "3. Automated Tracking: The system maintains cumulative balances per package, eliminating manual spreadsheet mistakes.",
    margin + 7,
    callY + 9
  );

  drawPageFooter(4, 5);

  // ==========================================
  // PAGE 5: VARIATIONS, STATUS & TROUBLESHOOTING
  // ==========================================
  doc.addPage();
  doc.setFillColor(C_CREAM[0], C_CREAM[1], C_CREAM[2]);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  drawPageHeader(5, "Variations, Status Badges & Field Troubleshooting");

  curY = 25;
  drawBrutalBox(margin, curY, contentWidth, 11, C_MUSTARD, C_NAVY, 1.5, 0.5);
  doc.setTextColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("CHANGE MANAGEMENT GOVERNANCE & FIELD TROUBLESHOOTING MATRIX", margin + 4, curY + 7);

  // Workflow 5: 4-Stage Variations
  curY = 39;
  drawBrutalBox(margin, curY, contentWidth, 42, C_WHITE, C_NAVY, 1.8, 0.5);
  doc.setFillColor(C_PURPLE[0], C_PURPLE[1], C_PURPLE[2]);
  doc.rect(margin, curY, contentWidth, 6, "F");
  doc.setTextColor(C_WHITE[0], C_WHITE[1], C_WHITE[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("WORKFLOW 5: 4-STAGE VARIATION ORDER APPROVAL PIPELINE", margin + 4, curY + 4.2);

  doc.setTextColor(C_TEXT[0], C_TEXT[1], C_TEXT[2]);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  const voSteps = [
    "Stage 1: Site Instruction (SI) Issued — Architect or Resident Engineer logs formal SI in '7.1 Site Instructions'.",
    "Stage 2: QS Cost & Delay Valuation — Quantity Surveyor estimates price delta (₦) and time extension impact (days).",
    "Stage 3: Project Manager Review — PM evaluates commercial impact against the 5.0% contingency reserve fund.",
    "Stage 4: Formal Client Approval & Baseline Uplift — Client gives formal approval. CostView 360 immediately updates the master",
    "         budget baseline, commits funds, and authorizes the site team to execute the additional work package."
  ];
  voSteps.forEach((s, i) => doc.text(s, margin + 4, curY + 11 + i * 5.8));

  // Status Badges Reference Table
  curY = 85;
  drawBrutalBox(margin, curY, contentWidth, 74, C_WHITE, C_NAVY, 2, 0.5);
  doc.setFillColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.rect(margin, curY, contentWidth, 6, "F");
  doc.setTextColor(C_MUSTARD[0], C_MUSTARD[1], C_MUSTARD[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("STANDARD IN-APP STATUS BADGES & MEANINGS", margin + 4, curY + 4.2);

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
    head: [["Badge Name", "Visual Color", "Meaning & Trigger Condition", "Required User Action"]],
    body: [
      ["ON TRACK", "Green (#10B981)", "Expenditure is within approved BOQ baseline and contingency buffer.", "Continue standard execution; no commercial intervention needed."],
      ["AT RISK", "Amber (#D97706)", "Cost code has exceeded 85% of budget or variance delta exceeds 5%.", "QS must review upcoming commitments and inspect material wastage."],
      ["OVER BUDGET", "Red (#DC2626)", "Committed costs exceed 100% of approved baseline allocation.", "Requires formal Variation Order or contingency draw-down approval."],
      ["MATCHED", "Green (#10B981)", "PO unit rate, GRN physical count, and vendor invoice agree 100%.", "Finance authorizes invoice for payment disbursement."],
      ["DISCREPANCY", "Red (#DC2626)", "Unit price is higher than PO, or billed quantity exceeds physical GRN.", "System halts payment. Procurement contacts vendor for credit note."],
      ["RETAINED (10%)", "Purple (#9333EA)", "Statutory 10% withheld from interim certificate into escrow ledger.", "Held securely until Practical Completion and defect snag clearance."],
      ["SNAG OPEN", "Amber (#D97706)", "Defect ticket logged from failed site inspection or supervisor check.", "Contractor must rectify defect; blocks final milestone certification."],
      ["SNAG CLOSED", "Green (#10B981)", "Resident Engineer re-inspected physical repair and verified quality.", "Rectification recorded in diary; releases trade milestone payment."]
    ]
  });

  // Troubleshooting Matrix Table
  curY = 163;
  drawBrutalBox(margin, curY, contentWidth, 108, C_CREAM_MUTED, C_NAVY, 2, 0.5);
  doc.setFillColor(C_NAVY[0], C_NAVY[1], C_NAVY[2]);
  doc.rect(margin, curY, contentWidth, 6, "F");
  doc.setTextColor(C_WHITE[0], C_WHITE[1], C_WHITE[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("FIELD TROUBLESHOOTING MATRIX: WHAT TO DO IN REAL SITE SITUATIONS", margin + 4, curY + 4.2);

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
      fillColor: C_NAVY,
      textColor: C_MUSTARD,
      fontStyle: "bold"
    },
    columnStyles: {
      0: { cellWidth: 50, fontStyle: "bold" },
      1: { cellWidth: 70 },
      2: { cellWidth: 58 }
    },
    head: [["Operational Site Scenario", "Immediate In-App Action Required", "Commercial Protection Delivered"]],
    body: [
      [
        "Supplier delivers partial order\n(e.g., 80 bags delivered vs 100 on PO)",
        "Storekeeper enters exact physical count (80) on the Goods Received Note (GRN). Do not enter 100.",
        "3-Way Match locks invoice if vendor bills for 100. Eliminates paying for 20 undelivered bags."
      ],
      [
        "Vendor invoice unit price is higher than agreed Purchase Order rate",
        "Open 3-Way Match, review red price variance flag, and click 'Raise Dispute' with note.",
        "Halts payment disbursement until supplier reissues invoice with contracted rate."
      ],
      [
        "Subcontractor objects to 10% statutory retention deduction",
        "Refer contractor to contract retention terms. Show cumulative retention escrow ledger balance.",
        "Maintains mandatory client defect guarantee fund per Nigerian construction industry standards."
      ],
      [
        "Torrential rain halts concrete pour or earthworks on site",
        "Open 'Site Diary', record exact rain duration and delay hours, and attach site photos.",
        "Provides contemporaneous legal documentation required to evaluate Extension of Time (EOT) claims."
      ],
      [
        "Material stock level indicator turns yellow or red",
        "Open 'Materials & Stock' and click 'Create Reorder Request' before stock runs out.",
        "Prevents costly site shutdowns and emergency spot-buying at inflated retail prices."
      ],
      [
        "Structural inspection fails\n(e.g., honeycombing on column)",
        "Resident Engineer marks inspection 'Failed' and uploads photo. System auto-generates Snag ticket.",
        "Blocks trade milestone payment certification until contractor performs approved structural repair."
      ]
    ]
  });

  drawPageFooter(5, 5);

  // Return generated PDF buffer
  return doc.output("arraybuffer");
}

async function main() {
  console.log("Generating CostView 360 User Manual (End-User Focus & Visual Data Flow)...");
  const pdfBuffer = Buffer.from(createCostViewGuide());

  const publicDocsDir = path.join(__dirname, "../apps/web/public/docs");
  if (!fs.existsSync(publicDocsDir)) {
    fs.mkdirSync(publicDocsDir, { recursive: true });
  }

  const publicPdfPath = path.join(publicDocsDir, "CostView-360-User-Guide.pdf");
  fs.writeFileSync(publicPdfPath, pdfBuffer);
  console.log(`Saved public manual to: ${publicPdfPath} (${pdfBuffer.length} bytes)`);

  const repoRootPdfPath = path.join(__dirname, "../../CostView-360-User-Guide.pdf");
  fs.writeFileSync(repoRootPdfPath, pdfBuffer);
  console.log(`Saved root copy to: ${repoRootPdfPath} (${pdfBuffer.length} bytes)`);

  console.log("PDF User Guide generation completed successfully!");
}

main().catch((err) => {
  console.error("Failed to generate PDF manual:", err);
  process.exit(1);
});
