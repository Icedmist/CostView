# CostView 360 - Project Memory & Context

## User Constraints & Global Rules
- **Rule 1**: Always store chat memories.
- **Rule 2**: Stick strictly to user requirements.
- **Rule 3**: Do not make major modifications without user knowledge/approval.
- **Rule 4**: Use user's GitHub credentials for commits and work:
  - Username: `icedmist`
  - Email: `talk2icedmist@gmail.com`
- **Rule 5**: Never run browser agent.

## Project Context & Live Infrastructure
- **Product**: CostView 360 — Construction cost-management platform for contractors, developers, and consultants.
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

## Workflow (since 2026-09-09)
- Every change = Issue → Branch `feat/issue-<n>-slug` (or `fix/`) → PR `Closes #<n>` → squash-merge. See `AGENTS.md`, `.github/WORKFLOW.md`, `.github/CONTRIBUTING.md`. Enforced for humans and AI agents.

## Verification Status
- `npm run build --workspace=apps/web`: Production build verified with all 19 static/dynamic routes compiled cleanly (0 errors, 0 warnings).
- Edge styling audit: 0 unintended `rounded` classes remaining across web components (only pulsating LED status indicator lights).
- Branded User Guide PDF generated at `CostView-360-User-Guide.pdf` (root) and `costview360/apps/web/public/docs/CostView-360-User-Guide.pdf` (98 KB, 5 pages, 100% end-user focus with visual data flows).
- Dedicated Markdown User Operations Manual created at `USER_GUIDE.md` with complete MermaidJS diagram suites.
- Auth verification: All 8 demo accounts verified in Supabase Auth and sandbox fallback verified with role synchronization.

