# CostView Enterprise Data Migration Templates

This directory contains standardized CSV data templates for migrating existing enterprise data into CostView.

## Templates Directory
1. `01_boq_items_template.csv`: Baseline Contractual Bill of Quantities (BOQ) with cost codes, units, quantities, rates, and approved budget amounts.
2. `02_suppliers_template.csv`: Verified vendor and material supplier registers with bank account and Tax Identification Numbers (TIN).
3. `03_purchase_orders_template.csv`: Active and committed purchase orders with item descriptions, agreed rates, and status.
4. `04_subcontractors_template.csv`: Subcontract trade packages with contract sums and 10% statutory retention escrow provisions.
5. `05_stock_ledger_template.csv`: On-site and central warehouse material inventories with re-order buffer thresholds.

## How to Run the Migration Pipeline
```bash
# Dry run: validates syntax, schemas, and referential integrity without committing to database
npm run migrate:enterprise:dry-run

# Production ingestion: validates and upserts records into Supabase with full audit logging
npm run migrate:enterprise
```
