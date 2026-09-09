# CostView 360

> **Workflow:** Every change = Issue → Branch → PR → Merge. See `../AGENTS.md` and `../.github/WORKFLOW.md` (also `../.github/CONTRIBUTING.md`). Do not push to `main`.

Scaffold for Phase 1 (Site Operations MVP) per `CostView360-PRD.md`.

## Structure
- `apps/api` — Fastify + TypeScript + Drizzle ORM (Postgres). Core Phase 1 schema:
  workspaces, users, projects, project_members, role_access, boq_items,
  budget_revisions, suppliers, purchase_orders, grns, audit_log.
- `apps/web` — Next.js app shell with the Site Operations / Commercial mode toggle
  and Phase 1 nav.

## Getting started
```bash
npm install
# apps/api
cp apps/api/.env.example apps/api/.env   # set DATABASE_URL
npm run db:generate
npm run db:migrate
npm run dev:api      # http://localhost:4000
npm run dev:web      # http://localhost:3000
```

## What's implemented
- Drizzle schema for the core Phase 1 entities, with an editable `role_access`
  table (not hardcoded, per PRD Section 4).
- `requirePermission()` middleware — server-side RBAC re-check, since the
  original prototype's `canAccess()` only hid nav items client-side.
- BOQ routes: list/create BOQ items, create a budget revision with a reason
  (approval trail groundwork).
- Web shell with the two-mode nav toggle.

## Not yet implemented (see PRD Section 9 for phasing)
- Auth (login/session) — routes assume `req.userId` is already set.
- Procurement, Materials, Labour, Progress, Subcontractors, Variations, Reports UI.
- Commercial mode (Phase 3) — 18 modules, currently prototype placeholders.
- Audit log writers on every mutating route (table exists, not yet wired up).
