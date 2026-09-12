# CostView - Project Memory & Context

## User Constraints & Global Rules
- **Rule 1**: Always store chat memories.
- **Rule 2**: Stick strictly to user requirements.
- **Rule 3**: Do not make major modifications without user knowledge/approval.
- **Rule 4**: Use user's GitHub credentials for commits and work:
  - Username: `icedmist`
  - Email: `talk2icedmist@gmail.com`
- **Rule 5**: Never run browser agent.

## Project Context & Live Infrastructure
- **Product**: CostView — Construction cost intelligence and cost-management platform for contractors, developers, and consultants.
- **Architecture**: Option 1 (Unified Next.js 14 Full Stack with Supabase).
- **Core Currency**: Nigerian Naira (₦ / NGN) default, multi-currency configurable per workspace.
- **Live Supabase Environment**:
  - Project Ref: `wtrxamprkfjbatrsszep`
  - URL: `https://wtrxamprkfjbatrsszep.supabase.co`
  - Region: `eu-central-1` (Frankfurt)
  - Connection Pooler (IPv4): `aws-0-eu-central-1.pooler.supabase.com:5432/postgres`
  - Status: Schema migration applied (25 tables, 11 enums, RLS policies enabled, triggers active, seed data inserted).

## Completed Implementation & Git Log
1. **Commit `1a6ef64`**: Initial commit of baseline scaffold & PRD.
2. **Commit `ff80133`**: Tooling, Supabase SSR client, and middleware.
3. **Commit `0db7717`**: Initial schema, BOQ table, 3-Way Match, Commercial Command Center.
4. **Commit `c9fdf62`**: Security hardening, removing `apps/api`, Next.js/PostCSS upgrades, tracking new PRDs.
5. **Commit `2ba259c`**: Supabase Auth, login/register portals, session routes, and server actions.
6. **Commit `00b90ec`**: Materials stock gauges, labour muster, subcontractor ledger, reports studio, audit log, CSV BOQ import.
7. **Commit `253992f`**: Complete database schema and seed data applied to live Supabase cloud database.
8. **Commit `daa89ee`**: Synchronize MEMORY.md with live Supabase database configuration.
9. **Commit `f6aa4cf`**: Wire live Supabase boq_items queries, item edit/delete, risk-handled toggle, and variance notes (PRD items #1, #2, #3, #4).
10. **Commit `2b70288`**: Implement requisition form, RFQ quotes, invoice modal, payment processing, and delivery rating (PRD items #5, #6, #7, #8, #9, #10, #11).
11. **Commit `27f94e3`**: Add daily entry modal, photo attachments, inspections with auto-snags, and safety observation logging (PRD items #15, #16, #17, #18).
12. **Commit `9b171d3`**: Implement interim claims register with 10% retention calculation, 4-factor grading modal, and site instructions register (PRD items #19, #20, #21, #22, #23, #24).
13. **Issue #23 (`feat/issue-23-straighten-edges-and-onboarding-guide`)**: Straighten all in-app component edges to sharp neo-brutalist styling, generate branded 5-page Neo-Brutalism PDF guide (`CostView-360-User-Guide.pdf`), and add interactive in-app onboarding modal hub accessible from Header & Sidebar.
14. **Issue #25 (`feat/issue-25-user-guide-and-data-flow`)**: Remove tech stack and developer references from user documentation, expand step-by-step user operational guides across all 10 modules, add visual data flow process diagrams (3-tier system architecture, 3-way match gate, 10% retention escrow lifecycle, 4-stage variation orders) with MermaidJS support and interactive visual maps.
15. **Issue #33 (`fix/issue-33-demo-account-auth`)**: Fix auth bug in demo account login flow — resolve stale session inactivity logout loop by initializing and resetting `costview_last_active` and `costview_tab_active`, synchronize `activeRole` in Providers from `costview_demo_role` and Supabase user metadata, allow `costview_demo_role` cookie in middleware for sandbox preview access, dynamically render demo user profiles and initials in the sidebar, and provide visual feedback for active demo account login cards.
16. **Issue #35 (`feat/issue-35-navy-subnav-admin-roles`)**: Implement deep navy blue theme (`#0A1931`) with warm amber accents, scale up component typography and button heights (`min-h-[42px]`), restructure navigation into 6 unified modules with collapsible expanding sub-navigation trees for 1-click access, contextual header breadcrumbs, and build dedicated Admin User & Role Management Hub (`UserRoleManager` and `/api/admin/users`) with user provisioning, dynamic role re-assignment, and interactive 8-role × 9-permission matrix customization.
17. **Issue #37 (`feat/issue-37-landing-scale-account-section`)**: Upgrade landing page (`/`) sizing and visual hierarchy with signature deep navy (`#0A1931`) and warm amber (`#D4A017`) color palette, scale typography (headline `text-[48px] md:text-[76px]`, body `text-lg`/`text-xl`, buttons `min-h-[52px]`), eliminate micro-fonts, and create a comprehensive 4-tab Account Center (`/account`) for personal profile management, security & session telemetry with 2-hour/tab-close inactivity policies, live RBAC permissions matrix with interactive 8-role simulator, and granular notification preferences; linked seamlessly from sidebar and header.
18. **Issue #39 (`feat/issue-39-supabase-nav-bright-navy-scale`)**: Rebrand product strictly to CostView (purged all '360' branding and completely removed commercial section and mode). Implemented Supabase-style dual-rail navigation architecture (narrow primary rail `w-[68px]` in bright navy `#0A2540` with domain icons + adjacent secondary sub-nav panel `w-64` in milk `#FAF9F5` with 44px sub-section items, numbered codes, and active pill states). Upgraded theme palette strictly to bright navy blue (`#0A2540` / `#003366`) and white/milk (`#FAF9F5` / `#FFFFFF`), eliminating legacy amber and deep navy #0A1931. Scaled up components across all sub-pages: typography, row padding, buttons (`min-h-[44px]`), inputs (`h-11`/`h-12`), metric cards, and modals. Regenerated branded PDF guide to `CostView-User-Guide.pdf` and verified all 19 Next.js routes compile cleanly.
19. **Issue #41 (`feat/issue-41-simplified-mobile-nav-colored-subnav`)**: Simplified mobile navigation by replacing cramped 2-column sidebar on mobile with a single-panel drill-down drawer (`mobileNavView === "main"` vs `"sub"`). When sub-navigation appears, main navigation items are completely removed from the view to eliminate clutter. Built a dedicated top section (`← Open Original Navigation`) allowing instant return to all 6 modules. Added distinctive color-coding across all 6 sub-nav domains (Blue for Command Center, Emerald for Budget & BOQ, Amber for Procurement, Orange for Site Ops, Purple for Contracts & Subcontractors, Teal for Admin) across headers, icons, active pills, badges, and header breadcrumbs.
20. **Issue #43 (`fix/issue-43-subnav-icon-colors-remove-tabs`)**: Wire sub-nav switching across all 6 modules, replace text button with an icon button (`ArrowLeft` in bright navy `#0A2540`) to return to original navigation in web view and mobile view, assign individual app signature colors to each sub-nav item (emerald for match/packages/boq, amber for requisitions/claims/stock, blue for enquiries/instructions/labour, purple for invoices/variations/inspections, teal for payments/settings), and eliminate duplicate in-page horizontal sub-tab strips across `three-way-match.tsx`, `subcontractor-view.tsx`, `site-diary-view.tsx`, `boq-table.tsx`, and `user-role-manager.tsx`.
21. **Issue #45 (`feat/issue-45-enterprise-migration-cli`)**: Enterprise data migration pipeline, standardized CSV templates (BOQ items, suppliers, purchase orders, subcontractor packages & 10% retention, materials stock ledger), robust CLI ingestion script (`npm run migrate:enterprise` and `--dry-run`), mathematical integrity validation, idempotent Supabase batch upserting, and automated financial reconciliation report generation (`migration_reconciliation_report.json`).
22. **Issue #47 (`feat/issue-47-migration-hub-mobile-bottom-nav`)**: Implemented Medium A In-App Smart Migration Hub (`DataMigrationHub` component in `components/admin/data-migration-hub.tsx`) with visual CSV column mapper, sample dataset loader, integrity checks, live Supabase upserts, and reconciliation certificate; replaced confusing "new nav" desktop sub-panel swapping with direct return to the existing Command Center navigation; updated mobile drawer header from "Original Navigation" to "Main Navigation"; and added a mobile bottom navigation bar (`mobile-bottom-nav.tsx`) with 1-tap thumb navigation for Command Center, BOQ, Procurement, Site Ops, Contracts, and Menu drawer.
23. **Issue #49 (`feat/issue-49-scale-fonts-components-subpages`)**: Scaled up typography, inputs, buttons, and card containers across marketing sub-pages (`about`, `features`, `how-it-works`, `pricing`, `contact`, `marketing/nav.tsx`, and `page.tsx`). Replaced micro-text (`text-xs`/`text-[11px]`) with highly readable body copy (`text-base`/`text-lg`), enlarged headings (`text-xl`/`text-2xl`/`text-3xl`), upgraded icons from `w-4 h-4` to `w-6 h-6`/`w-7 h-7` with `w-14 h-14` containers, reinforced card borders to 2px neo-brutalist styling (`border-2 border-[#E5E5DE]`), enlarged form inputs to `h-12` and textareas to generous padding, and ensured all primary/secondary CTA buttons meet minimum `min-h-[50px]`/`min-h-[52px]` ergonomics.

## Workflow (since 2026-09-09)
- Every change = Issue → Branch `feat/issue-<n>-slug` (or `fix/`) → PR `Closes #<n>` → squash-merge. See `AGENTS.md`, `.github/WORKFLOW.md`, `.github/CONTRIBUTING.md`. Enforced for humans and AI agents.

## Verification Status
- `npm run build --workspace=apps/web`: Production build verified with all 19 static/dynamic routes compiled cleanly (0 errors, 0 warnings).
- Theme Palette: Strictly bright navy (`#0A2540` / `#003366`) and white/milk (`#FAF9F5` / `#FFFFFF`) with domain-specific color accents for clear module identification.
- Navigation: Dual-rail desktop navigation enhanced with domain color indicator dots and colored sub-nav panels; mobile drawer simplified with 1-click "Open Original Navigation" drill-down.
- Product Branding: Purged all "360" branding across codebase, marketing pages, docs, and metadata.
- Branded User Guide PDF generated at `costview360/apps/web/public/docs/CostView-User-Guide.pdf` (CostView branded).
