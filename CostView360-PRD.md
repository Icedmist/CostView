# CostView 360 — Product Requirements Document
**Version 0.1 (Draft)** · Prepared September 2026

## 1. Vision
CostView 360 is a construction cost-management platform for developers, contractors and consultants. It gives every stakeholder on a build — from Site Engineer to Developer — one system of record for budget, procurement, site progress, subcontractors, commercial valuation, and project margin, in Naira (₦) by default, so cost overruns are caught before they happen instead of at final account.

Tagline: *Analyse · Plan · Build Smarter*

## 2. Problem Statement
Nigerian (and broader African) construction firms typically run cost control across disconnected spreadsheets, WhatsApp threads and paper site diaries. BOQ variance, procurement status, and subcontractor valuations live in silos, so:
- Budget overruns surface only at final account.
- Site progress and commercial data disagree (units delivered vs. units paid for).
- Multi-role approval chains (PM → QS → Accountant) are manual and unauditable.

## 3. Product Modes
The prototype defines two toggled modes in the left nav, sharing the same workspace/project/user model:

| Mode | Audience | Focus |
|---|---|---|
| **Site Operations** | Contractor / site delivery teams | Day-to-day execution: budget vs. actual, procurement, materials, labour, progress, subcontractors, variations |
| **Commercial** | Developer / investor side | Deal economics: feasibility, development cost/structure, tender, contract, sales & receivables, project margin, handover |

## 4. Roles & Permissions
Roles (from prototype `ADMIN_ROLES`), each scoped per project/workspace:

`Admin · Project Manager · Quantity Surveyor · Architect · Site Engineer · Procurement Officer · Accountant · Storekeeper`

Access matrix (1 = access) across permission groups `Budget, Procurement, Materials, Labour, Progress, Subcontractors, Variations, Reports, Admin`:

| Role | Budget | Procurement | Materials | Labour | Progress | Subcontractors | Variations | Reports | Admin |
|---|---|---|---|---|---|---|---|---|---|
| Admin | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Project Manager | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | |
| Quantity Surveyor | ✓ | ✓ | | | | ✓ | ✓ | ✓ | |
| Architect | | | | | ✓ | | ✓ | ✓ | |
| Site Engineer | | | ✓ | ✓ | ✓ | | | | |
| Procurement Officer | | ✓ | ✓ | | | ✓ | | ✓ | |
| Accountant | ✓ | | | ✓ | | ✓ | | ✓ | |
| Storekeeper | | | ✓ | | | | | | |

This matrix must be **editable by an Admin** in-app (Admin → Roles), not hardcoded, since real firms will want custom roles.

## 5. Feature Modules

### 5.1 Site Operations mode
- **Home** — role-aware dashboard: attention items (overdue POs, pending approvals), project snapshot cards.
- **Budget** — BOQ import, line-item budget vs. actual vs. forecast, revision history (e.g. rate revisions with approval trail), variance reporting.
- **Procurement** — purchase requisition → PO → supplier → delivery pipeline with stage tracking (Draft → Sent to Suppliers → Goods Received), filterable by project/BOQ item/supplier/status.
- **Materials** — GRN (goods received note) matching ordered vs. delivered with discrepancy flags, stock/inventory, store-to-store transfer requests with approval + in-transit tracking, material issue-to-site log tied to BOQ item and location.
- **Labour** — crew/trade roster, daily attendance (present/absent/off).
- **Progress** — site progress capture tied to budget/BOQ items, feeding forecast.
- **Subcontractors** — subcontractor claims: Submitted → Verified → Certified → Approved → Paid, each stage timestamped and attributed to a role.
- **Variations** — variation orders (additions/omissions) with cost impact, status (Draft/Pending/Approved), stage (Draft → QS Valuation → PM Review → Client Approval), linkage to instructions and BOQ items.
- **Reports** — Report Studio: generate/preview/export standard reports.
- **Admin** — Users, Roles (permission matrix), workspace settings.
- **Settings** — profile, currency/date/timezone/language, notifications, appearance, security (2FA), data export, audit history export.
- **Help** — searchable help center + FAQ.

### 5.2 Commercial mode
Full developer-side lifecycle, one page per stage:
`Feasibility & Acquisition → Development Structure → Development Costs → Tender & Estimating → Contract → Design Approvals → Programme & Time → Valuation & Certification → Claims & Entitlements → Extension of Time → Defects & Retention → Commercial Correspondence → Sales & Units → Receivables → Contractor Management → Project Margin → Handover & Close-out → Final Account`

*(In the current prototype these are placeholder pages — this is the largest bucket of net-new build work and should be phased; see §9.)*

## 6. Core Data Model (initial entities)
- `Workspace` (tenant/company) — 1:N `Project`
- `User` — belongs to Workspace, has a `Role` per Project (roles can differ across projects)
- `Role` / `RoleAccess` — permission matrix, editable
- `Project` — currency, dates, status
- `BOQItem` — code, description, unit, qty, rate, budget amount, links to Budget/Variation/Procurement
- `BudgetRevision` — item, delta, reason, approver, status, timestamp
- `PurchaseRequisition` → `PurchaseOrder` → `Supplier` → `GRN` (Goods Received Note)
- `MaterialTransfer`, `MaterialIssue` — store, BOQ item, location, quantity
- `AttendanceRecord` — worker, trade, date, status
- `SubcontractorClaim` — subcontractor, stages, amounts
- `VariationOrder` — BOQ item, cost, type, status, stage, raised-by
- `AuditLogEntry` — actor, action, entity, timestamp (needed for the "Download Audit History" feature and general trust)

## 7. Non-Functional Requirements
- **Multi-tenant**: one workspace = one company; projects nested under it.
- **Currency-first**: ₦ default, but currency field must be configurable per workspace (region-agnostic from day one).
- **Auditability**: every approval-chain action (budget revision, PO approval, claim certification, variation approval) is logged with actor + timestamp — this is the product's core trust mechanism, not an afterthought.
- **Role-based access control** enforced server-side, not just hidden in the UI (the prototype's `canAccess()` is client-only — a real backend must re-check every request).
- **Offline tolerance**: site-side data entry (materials, attendance) should degrade gracefully on poor connectivity — queue-and-sync rather than hard-fail.
- **Exportability**: PDF/Excel export for reports and audit history.

## 8. Recommended Tech Stack
Chosen to match your existing stack and reduce ramp-up time:

| Layer | Choice | Why |
|---|---|---|
| Frontend | **Next.js (App Router) + TypeScript**, TanStack Query for data fetching, TanStack Table for the many data-grid pages | You already use this; SSR helps the dashboard-heavy pages |
| UI | Tailwind CSS + shadcn/ui | Matches the prototype's clean/segmented-control aesthetic without reinventing components |
| API | **Fastify + TypeScript**, REST (or tRPC if you want end-to-end type safety with Next.js) | Matches your current backend choice; fast, low overhead |
| ORM / DB | **Drizzle ORM + PostgreSQL** | You already use Drizzle; Postgres suits the relational, audit-heavy data model far better than a document DB |
| Auth | Firebase Auth (session cookies verified in Fastify) *or* self-rolled JWT + refresh tokens if you want full control over the multi-project role model | Firebase is fastest to ship; custom auth gives cleaner per-project RBAC — recommend custom if RBAC complexity grows |
| File storage | DigitalOcean Spaces (S3-compatible) | For BOQ imports, GRN photos, exported reports |
| Background jobs | BullMQ + Redis | Report generation, audit export, notification digests |
| Hosting | Vercel (frontend) + DigitalOcean App Platform/Droplet (API + Postgres + Redis) | Matches your current deployment pattern |
| Realtime (optional, later) | WebSockets or Pusher for live approval notifications | Not needed for MVP |

## 9. Phased Roadmap
**Phase 1 — Site Operations MVP** (highest leverage, matches prototype's most-built pages)
Auth + Workspace/Project setup → Admin & Roles → Budget (BOQ + variance) → Procurement → Materials → Reports (basic export)

**Phase 2 — Operational depth**
Labour/attendance, Subcontractor claims workflow, Variations workflow, Audit log/export, Notifications

**Phase 3 — Commercial mode**
Feasibility & Acquisition → Development Costs/Structure → Tender & Estimating → Contract → Valuation & Certification → Project Margin (the "developer's ultimate dashboard") → the remaining commercial pages

**Phase 4 — Polish**
2FA, active sessions, theming, offline-first materials/attendance entry, mobile web pass.

## 10. Success Metrics
- Time from PO raised → GRN reconciled (procurement cycle time)
- % of budget lines with a live forecast vs. static budget
- Number of variations requiring rework due to missing approval trail (target: 0)
- Adoption: % of site data entered same-day vs. backfilled later
