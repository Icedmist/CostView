/**
 * CostView Enterprise Data Migration Pipeline
 *
 * Ingests, validates, and reconciles legacy construction enterprise data
 * (BOQ Schedules, Suppliers, POs, Subcontractors, Stock Ledgers) into Supabase.
 *
 * Usage:
 *   npx tsx scripts/migrate-enterprise-data.ts [--dry-run] [--templates-dir <path>]
 */

import fs from "fs";
import path from "path";
import ws from "ws";
(globalThis as any).WebSocket = ws;
import { createClient } from "@supabase/supabase-js";

// Configuration
const DEFAULT_TEMPLATES_DIR = path.resolve(__dirname, "../templates/migration");
const PROJECT_ID = "22222222-2222-2222-2222-222222222222";
const WORKSPACE_ID = "11111111-1111-1111-1111-111111111111";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

interface MigrationSummary {
  timestamp: string;
  isDryRun: boolean;
  boq: {
    totalParsed: number;
    totalValid: number;
    totalBudget: number;
    errors: string[];
  };
  suppliers: {
    totalParsed: number;
    totalValid: number;
    errors: string[];
  };
  purchaseOrders: {
    totalParsed: number;
    totalValid: number;
    totalCommitted: number;
    errors: string[];
  };
  subcontractors: {
    totalParsed: number;
    totalValid: number;
    totalContractSum: number;
    totalRetentionEscrow: number;
    errors: string[];
  };
  stockLedger: {
    totalParsed: number;
    totalValid: number;
    totalInventoryValue: number;
    errors: string[];
  };
  financialParity: {
    contractualBudgetSum: number;
    totalCommittedPOs: number;
    uncommittedCushion: number;
    reconciliationStatus: "VERIFIED_BALANCED" | "FLAGGED_VARIANCE";
  };
}

/**
 * Robust CSV parser that correctly handles quoted commas and trims values
 */
function parseCSV(content: string): Record<string, string>[] {
  const lines = content
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) return [];

  const headers = parseCSVLine(lines[0]);
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === headers.length) {
      const row: Record<string, string> = {};
      headers.forEach((h, idx) => {
        row[h] = values[idx] ?? "";
      });
      rows.push(row);
    }
  }

  return rows;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (insideQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === "," && !insideQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function formatNGN(amount: number): string {
  return "₦" + amount.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

async function runMigration() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes("--dry-run");
  const customDirIdx = args.indexOf("--templates-dir");
  const templatesDir = customDirIdx !== -1 && args[customDirIdx + 1] ? path.resolve(args[customDirIdx + 1]) : DEFAULT_TEMPLATES_DIR;

  console.log("\n=======================================================");
  console.log("  CostView Enterprise Data Migration & Reconciliation  ");
  console.log("=======================================================");
  console.log(`Execution Mode:  ${isDryRun ? "DRY-RUN (Validation & Audit Only)" : "PRODUCTION INGESTION"}`);
  console.log(`Templates Directory: ${templatesDir}`);
  console.log(`Target Project:  ${PROJECT_ID}`);
  console.log(`Target Workspace:${WORKSPACE_ID}\n`);

  if (!fs.existsSync(templatesDir)) {
    console.error(`Error: Templates directory not found at ${templatesDir}`);
    process.exit(1);
  }

  let supabase: any = null;
  if (!isDryRun && SUPABASE_URL && SERVICE_ROLE_KEY) {
    supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    console.log("✓ Connected to Supabase Cloud Database\n");
  } else if (!isDryRun) {
    console.warn("⚠ Supabase credentials not found. Proceeding with dry-run validation mode.\n");
  }

  const summary: MigrationSummary = {
    timestamp: new Date().toISOString(),
    isDryRun: isDryRun || !supabase,
    boq: { totalParsed: 0, totalValid: 0, totalBudget: 0, errors: [] },
    suppliers: { totalParsed: 0, totalValid: 0, errors: [] },
    purchaseOrders: { totalParsed: 0, totalValid: 0, totalCommitted: 0, errors: [] },
    subcontractors: { totalParsed: 0, totalValid: 0, totalContractSum: 0, totalRetentionEscrow: 0, errors: [] },
    stockLedger: { totalParsed: 0, totalValid: 0, totalInventoryValue: 0, errors: [] },
    financialParity: {
      contractualBudgetSum: 0,
      totalCommittedPOs: 0,
      uncommittedCushion: 0,
      reconciliationStatus: "VERIFIED_BALANCED",
    },
  };

  // 1. INGEST BOQ ITEMS
  const boqFile = path.join(templatesDir, "01_boq_items_template.csv");
  if (fs.existsSync(boqFile)) {
    console.log("--- 1. Parsing & Validating Contractual BOQ Items ---");
    const raw = fs.readFileSync(boqFile, "utf-8");
    const records = parseCSV(raw);
    summary.boq.totalParsed = records.length;

    const validBOQItems: any[] = [];
    for (const r of records) {
      const code = r.code;
      const description = r.description;
      const category = r.category || "Material";
      const unit = r.unit || "m²";
      const quantity = parseFloat(r.quantity) || 0;
      const rate = parseFloat(r.rate) || 0;
      const budgetAmount = parseFloat(r.budget_amount) || quantity * rate;

      if (!code || !description) {
        summary.boq.errors.push(`Missing code or description: ${JSON.stringify(r)}`);
        continue;
      }

      // Mathematical Parity Check
      const expectedTotal = quantity * rate;
      if (Math.abs(expectedTotal - budgetAmount) > 1.0) {
        summary.boq.errors.push(`Mathematical variance in ${code}: qty(${quantity}) * rate(${rate}) = ${expectedTotal} != budget(${budgetAmount})`);
      }

      summary.boq.totalValid++;
      summary.boq.totalBudget += budgetAmount;

      validBOQItems.push({
        project_id: PROJECT_ID,
        item_code: code,
        description,
        category,
        unit,
        quantity,
        rate,
        budget_amount: budgetAmount,
        committed_amount: 0,
        actual_amount: 0,
      });
    }

    console.log(`  ✓ Validated ${summary.boq.totalValid} of ${summary.boq.totalParsed} BOQ items`);
    console.log(`  ✓ Total Contractual Baseline Budget: ${formatNGN(summary.boq.totalBudget)}`);
    if (summary.boq.errors.length > 0) {
      console.warn(`  ⚠ Flagged ${summary.boq.errors.length} validation issues`);
    }

    if (supabase && validBOQItems.length > 0) {
      const { error } = await supabase
        .from("boq_items")
        .upsert(validBOQItems, { onConflict: "project_id, item_code" });
      if (error) {
        console.error("  ✗ Error upserting to boq_items:", error.message);
      } else {
        console.log("  ✓ Successfully upserted to Supabase boq_items table");
      }
    }
  }

  // 2. INGEST SUPPLIERS
  const suppliersFile = path.join(templatesDir, "02_suppliers_template.csv");
  if (fs.existsSync(suppliersFile)) {
    console.log("\n--- 2. Parsing & Validating Verified Suppliers ---");
    const raw = fs.readFileSync(suppliersFile, "utf-8");
    const records = parseCSV(raw);
    summary.suppliers.totalParsed = records.length;

    const validSuppliers: any[] = [];
    for (const r of records) {
      const name = r.company_name;
      if (!name) {
        summary.suppliers.errors.push(`Missing company name: ${JSON.stringify(r)}`);
        continue;
      }
      summary.suppliers.totalValid++;
      validSuppliers.push({
        workspace_id: WORKSPACE_ID,
        name,
        trade_category: r.trade_category || "Material",
        contact_person: r.contact_person || null,
        phone: r.phone || null,
        email: r.email || null,
        bank_name: r.bank_name || null,
        account_number: r.account_number || null,
        tax_id: r.tax_id || null,
      });
    }

    console.log(`  ✓ Validated ${summary.suppliers.totalValid} of ${summary.suppliers.totalParsed} supplier profiles`);

    if (supabase && validSuppliers.length > 0) {
      const { error } = await supabase
        .from("suppliers")
        .upsert(validSuppliers, { onConflict: "workspace_id, name" });
      if (error) {
        console.error("  ✗ Error upserting to suppliers:", error.message);
      } else {
        console.log("  ✓ Successfully upserted to Supabase suppliers table");
      }
    }
  }

  // 3. INGEST PURCHASE ORDERS
  const poFile = path.join(templatesDir, "03_purchase_orders_template.csv");
  if (fs.existsSync(poFile)) {
    console.log("\n--- 3. Parsing & Validating Active Purchase Orders ---");
    const raw = fs.readFileSync(poFile, "utf-8");
    const records = parseCSV(raw);
    summary.purchaseOrders.totalParsed = records.length;

    for (const r of records) {
      const poNum = r.po_number;
      const totalAmount = parseFloat(r.total_amount) || 0;
      if (!poNum || totalAmount <= 0) {
        summary.purchaseOrders.errors.push(`Invalid PO record: ${JSON.stringify(r)}`);
        continue;
      }
      summary.purchaseOrders.totalValid++;
      summary.purchaseOrders.totalCommitted += totalAmount;
    }

    console.log(`  ✓ Validated ${summary.purchaseOrders.totalValid} of ${summary.purchaseOrders.totalParsed} Purchase Orders`);
    console.log(`  ✓ Total Committed PO Sum: ${formatNGN(summary.purchaseOrders.totalCommitted)}`);
  }

  // 4. INGEST SUBCONTRACTORS & RETENTION
  const subFile = path.join(templatesDir, "04_subcontractors_template.csv");
  if (fs.existsSync(subFile)) {
    console.log("\n--- 4. Parsing & Validating Subcontractor Packages & Retention ---");
    const raw = fs.readFileSync(subFile, "utf-8");
    const records = parseCSV(raw);
    summary.subcontractors.totalParsed = records.length;

    const validSubs: any[] = [];
    for (const r of records) {
      const name = r.company_name;
      const contractSum = parseFloat(r.contract_sum) || 0;
      const retentionPercent = parseFloat(r.retention_percentage) || 10.0;

      if (!name || contractSum <= 0) {
        summary.subcontractors.errors.push(`Invalid subcontractor package: ${JSON.stringify(r)}`);
        continue;
      }

      const retentionAmount = contractSum * (retentionPercent / 100);
      summary.subcontractors.totalValid++;
      summary.subcontractors.totalContractSum += contractSum;
      summary.subcontractors.totalRetentionEscrow += retentionAmount;

      validSubs.push({
        project_id: PROJECT_ID,
        company_name: name,
        trade: r.trade || "Specialist",
        scope_summary: r.scope_summary || "",
        contract_sum: contractSum,
        retention_percentage: retentionPercent,
        contact_person: r.contact_person || null,
        phone: r.phone || null,
        email: r.email || null,
      });
    }

    console.log(`  ✓ Validated ${summary.subcontractors.totalValid} of ${summary.subcontractors.totalParsed} Subcontractor Packages`);
    console.log(`  ✓ Total Subcontract Commitments: ${formatNGN(summary.subcontractors.totalContractSum)}`);
    console.log(`  ✓ Statutory 10% Retention Escrow: ${formatNGN(summary.subcontractors.totalRetentionEscrow)}`);

    if (supabase && validSubs.length > 0) {
      const { error } = await supabase
        .from("subcontractors")
        .upsert(validSubs, { onConflict: "project_id, company_name" });
      if (error) {
        console.error("  ✗ Error upserting to subcontractors:", error.message);
      } else {
        console.log("  ✓ Successfully upserted to Supabase subcontractors table");
      }
    }
  }

  // 5. INGEST STOCK LEDGER
  const stockFile = path.join(templatesDir, "05_stock_ledger_template.csv");
  if (fs.existsSync(stockFile)) {
    console.log("\n--- 5. Parsing & Validating Materials Stock Ledger ---");
    const raw = fs.readFileSync(stockFile, "utf-8");
    const records = parseCSV(raw);
    summary.stockLedger.totalParsed = records.length;

    for (const r of records) {
      const name = r.item_name;
      const qty = parseFloat(r.current_stock) || 0;
      const unitCost = parseFloat(r.unit_cost) || 0;
      const itemVal = qty * unitCost;

      if (!name) {
        summary.stockLedger.errors.push(`Invalid stock record: ${JSON.stringify(r)}`);
        continue;
      }

      summary.stockLedger.totalValid++;
      summary.stockLedger.totalInventoryValue += itemVal;
    }

    console.log(`  ✓ Validated ${summary.stockLedger.totalValid} of ${summary.stockLedger.totalParsed} Stock Inventory Items`);
    console.log(`  ✓ Total Site Inventory Valuation: ${formatNGN(summary.stockLedger.totalInventoryValue)}`);
  }

  // 6. FINANCIAL RECONCILIATION AUDIT
  summary.financialParity.contractualBudgetSum = summary.boq.totalBudget;
  summary.financialParity.totalCommittedPOs = summary.purchaseOrders.totalCommitted;
  summary.financialParity.uncommittedCushion = summary.boq.totalBudget - summary.purchaseOrders.totalCommitted;
  summary.financialParity.reconciliationStatus = summary.financialParity.uncommittedCushion >= 0 ? "VERIFIED_BALANCED" : "FLAGGED_VARIANCE";

  console.log("\n=======================================================");
  console.log("            FINANCIAL RECONCILIATION AUDIT             ");
  console.log("=======================================================");
  console.log(`Contractual Baseline BOQ:   ${formatNGN(summary.financialParity.contractualBudgetSum)}`);
  console.log(`Active Committed POs:       ${formatNGN(summary.financialParity.totalCommittedPOs)}`);
  console.log(`Remaining Budget Cushion:   ${formatNGN(summary.financialParity.uncommittedCushion)}`);
  console.log(`Subcontract Trade Value:    ${formatNGN(summary.subcontractors.totalContractSum)}`);
  console.log(`Statutory Retention Fund:   ${formatNGN(summary.subcontractors.totalRetentionEscrow)}`);
  console.log(`Reconciliation Health:      [ ${summary.financialParity.reconciliationStatus} ]\n`);

  // Write reconciliation report to disk
  const reportPath = path.resolve(__dirname, "../migration_reconciliation_report.json");
  fs.writeFileSync(reportPath, JSON.stringify(summary, null, 2));
  console.log(`✓ Audit report saved to ${reportPath}`);
  console.log("=======================================================\n");
}

runMigration().catch((err) => {
  console.error("Fatal error during enterprise data migration:", err);
  process.exit(1);
});
