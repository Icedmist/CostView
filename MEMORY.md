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
