# CostView 360 - Project Memory & Context

## User Constraints & Global Rules
- **Rule 1**: Always store chat memories.
- **Rule 2**: Stick strictly to user requirements.
- **Rule 3**: Do not make major modifications without user knowledge/approval.
- **Rule 4**: Use user's GitHub credentials for commits and work:
  - Username: `icedmist`
  - Email: `talk2icedmist@gmail.com`
- **Rule 5**: Never run browser agent.

## Project Context
- **Product**: CostView 360 — Construction cost-management platform for contractors, developers, and consultants.
- **Architecture Selected**: Option 1 (Unified Next.js 14 Full Stack with Supabase).
- **Core Currency**: Nigerian Naira (₦ / NGN) default, multi-currency configurable per workspace.
- **Key Documents**:
  - [CostView360-PRD.md](file:///home/snow/projects/CostView/CostView360-PRD.md): v0.1 Draft covering dual-mode toggle (Site Operations vs Commercial), initial 8 roles, Phase 1-4 roadmap.
  - [CostView 360 - Comprehensive PRD - Google Docs.pdf](file:///home/snow/projects/CostView/CostView%20360%20-%20Comprehensive%20PRD%20-%20Google%20Docs.pdf): v2.0 Approved for Development (10X expansion).
  - [CostView MVP Flow PRD.pdf](file:///home/snow/projects/CostView/CostView%20MVP%20Flow%20PRD.pdf): Fast, Efficient, Secure principles and the single connected flow (Budget → Procurement → Materials → Labour → Progress → Subcontractors → Variations).
  - [CostView Site Operations PRD.pdf](file:///home/snow/projects/CostView/CostView%20Site%20Operations%20PRD.pdf): Detailed screen-by-screen operations PRD with the 26-item "Full List of What's Missing".

## Completed Implementation & Git Log
1. **Commit `1a6ef64`**: `chore: initial commit of CostView 360 repository, PRD, and baseline scaffold`
2. **Commit `ff80133`**: `feat: configure Next.js full-stack tooling, Supabase SSR client, and middleware`
3. **Commit `0db7717`**: `feat: implement Supabase schema, RLS policies, BOQ table, 3-Way Match, and Commercial Command Center`
4. **Commit `c9fdf62`**: `fix(security): resolve vulnerabilities, remove redundant api app, complete RLS policies, and track new PRDs`
   - Removed deprecated `apps/api` (eliminated 7 high/moderate vulnerabilities).
   - Patched Next.js to `14.2.35` and PostCSS to `8.5.28` with overrides.
   - Completed multi-tenant RLS policies on all 20+ Supabase tables.
   - Modernized Edge runtime cookie handling in Supabase middleware (`getAll()` / `setAll()`).
5. **Commit `2ba259c`**: `feat(auth): implement Supabase authentication, session handling, login/register views, and server actions`
   - Added `/login` with 1-click reviewer sandbox credentials.
   - Added `/register` with workspace organization setup.
   - Added `/auth/callback` route handler and Server Actions (`lib/actions/auth.ts`).
6. **Commit `00b90ec`**: `feat(modules): implement materials stock gauges, labour muster, subcontractor ledger, reports studio, audit log, and CSV BOQ import`
   - Added BOQ CSV/Excel import modal with review-before-saving step.
   - Added Materials & Stock Gauges view with live stock level gauges, consumption recording, and inter-site transfer modal.
   - Added Labour & Muster view with worker registration, weekly attendance grid, and automated payroll calculation.
   - Added Subcontractor Ledger (contract sums, certified to date, 10% retention fund) and 4-stage Variation Orders workflow.
   - Added Searchable Compliance Audit Journal table.
   - Added Reports Studio with project portfolio picker and financial statements export.
   - Verified clean typecheck (`npx tsc --noEmit`), production build (`npm run build`), and HTTP 200 responses on all routes (`/`, `/login`, `/register`).
