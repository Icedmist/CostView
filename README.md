# CostView — Construction Cost Intelligence

**Navy #0A1931 + Cream #FFFDF0 + Mustard #FFD23F · Smoothed Brutalism · Next.js 14 + Supabase**

Unified system of record for **budget (BOQ), procurement (3-way match), site progress, and project margins** — from BOQ Master to Final Account for Nigerian contractors, developers and QS teams.

- **Live (Vercel):** https://costview-peach.vercel.app (also https://costview-iced-mist-s-projects.vercel.app)
- **Landing:** `/` — explanatory hero, problem, features, personas, comparison, FAQ, pricing
- **App:** `/dashboard` — Site Ops / Commercial modes, BOQ, procurement, materials, labour, diary, subcontractors, reports
- **Auth:** `/login`, `/register` — Supabase Auth, 8 seeded demo roles

## Stack

- **Web:** Next.js 14 (`costview360/apps/web`), TypeScript, Tailwind, `supabase/ssr`, `@tanstack/*`
- **DB:** Supabase `wtrxamprkfjbatrsszep` (eu-central-1), Postgres, 25 tables, RLS, `supabase/seed.sql`
- **Design:** `Space Grotesk` / `Archivo Black` / `JetBrains Mono`, softened brutalism (`border-2` `4px` shadow in app, `border-[3px]` `6px` on landing)

## Structure

```
CostView/
├── AGENTS.md                          # Agent workflow (read first)
├── .github/WORKFLOW.md                # Issue → Branch → PR
├── costview360/
│   ├── apps/web/                      # Next.js app (landing + /dashboard)
│   │   ├── app/(page, dashboard, login, register)
│   │   ├── components/(layout, dashboard, budget, procurement, materials, labour, site-ops, commercial, reports)
│   │   └── lib/supabase/
│   ├── supabase/
│   │   ├── migrations/20260907_initial_schema.sql
│   │   └── seed.sql
│   └── scripts/seed-users.ts
└── CostView360-PRD.md
```

See `costview360/README.md` for scaffold details and `MEMORY.md` for live infra.

## Quick Start

```bash
git clone https://github.com/Icedmist/CostView.git
cd CostView/costview360
npm install
cp apps/web/.env.local.example apps/web/.env.local  # or copy from Vercel
npm run build --workspace=apps/web   # verify
npm run dev --workspace=apps/web     # http://localhost:3000
# prod preview (avoids dev cache 404):
npm run build --workspace=apps/web && npm run start --workspace=apps/web
```

## Env

Local: `costview360/apps/web/.env.local` (gitignored)

```
NEXT_PUBLIC_SUPABASE_URL=https://wtrxamprkfjbatrsszep.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_…
SUPABASE_SERVICE_ROLE_KEY=sb_secret_…
DATABASE_URL=postgresql://postgres…@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # prod: https://costview-peach.vercel.app
```

Vercel: `vercel env ls` (linked `iced-mist-s-projects/costview`) — prod/preview/development. After `vercel env add`, `vercel --prod --yes`.

## Roles & Permissions

CostView supports 8 operational RBAC roles:
- **Admin**: Full workspace configuration, user governance & audit trail.
- **Project Manager**: Budgets, PO certifications, variation reviews & telemetry.
- **Quantity Surveyor**: Contractual BOQs, rate revisions, valuations & claims.
- **Site Engineer**: Site diaries, labour muster, material receipts & snags.
- **Procurement Officer**: Requisitions, trade directory RFQs, PO authoring & 3-way match.
- **Accountant**: Three-way match payment gate, invoice sign-off & disbursement.
- **Storekeeper**: Warehouse inventory, material issues & gate-pass balances.
- **Architect**: Drawing revisions, design assurance & variation authoring.

Testing role views can be performed via the in-app **Simulate Role** switcher in the sidebar.

## Workflow

> **Every change = Issue → Branch → PR → Merge** — see `AGENTS.md`.

```bash
gh issue create --title "feat: …" --label enhancement
git checkout -b feat/issue-<n>-slug
# commit feat: … (#<n>) + Closes #<n>
git push -u origin feat/issue-<n>-slug
gh pr create --title "feat: … (#<n>)" --body "Closes #<n>" --base main --reviewer Icedmist
gh pr merge --squash --delete-branch  # after 1 review + Vercel checks
```

Docs: `.github/WORKFLOW.md`, `.github/CONTRIBUTING.md`, PR/issue templates.

## Deployment

- **Vercel:** auto on push to `main` → https://costview-peach.vercel.app (linked `costview`)
- **Build:** `npm run build --workspace=apps/web` `✓ 10.7kB /` `37.6kB /dashboard`

## License

Private — Iced Mist.
