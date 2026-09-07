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
  - [CostView 360 - Comprehensive PRD - Google Docs.pdf](file:///home/snow/projects/CostView/CostView%20360%20-%20Comprehensive%20PRD%20-%20Google%20Docs.pdf): v2.0 Approved for Development, detailing 10X feature expansion (3-way match, predictive forecasting, live stock gauges, snag Kanban, crew productivity, commercial modules, Supabase DB & RLS).
  - [costview360/README.md](file:///home/snow/projects/CostView/costview360/README.md): Current monorepo status (`apps/api`, `apps/web`).

## Completed Implementation & Git Log
1. **Git Initialization**: Initial commit `1a6ef64`.
2. **Next.js Full-Stack & Supabase Tooling**: Commit `ff80133`.
3. **Database Schema & Full-Stack Core UI (Phase 1)**: Commit `0db7717`.

## Vulnerability & Gap Audit (September 2026)
- **Security / NPM**: 9 vulnerabilities detected via `npm audit` (mostly originating from redundant `apps/api` Fastify/Drizzle packages and Next.js minor patch level).
- **Database / RLS**: Missing RLS on secondary tables (`suppliers`, `supplier_invoices`, `material_transfers`, etc.).
- **Functionality**: Auth pages (`/login`, `/register`), Supabase live persistence / fallback bridge, server-side RBAC enforcement, and CSV/Excel BOQ file parser.
- **Awaiting**: User direction on which fixes and implementations to proceed with.
