# Contributing — CostView

## Quick start
1. Read `AGENTS.md` and `.github/WORKFLOW.md`.
2. `gh issue create --title "feat: …" --body "Closes via PR"`.
3. Branch `feat/issue-<n>-slug`, commit `feat: … (#<n>)`, `git push -u origin …`.
4. `gh pr create --title "feat: … (#<n>)" --body "Closes #<n>" --base main`.

## Dev
```bash
npm install
npm run build --workspace=apps/web
npm run dev --workspace=apps/web   # http://localhost:3000  (landing at /, app at /dashboard)
# prod preview (avoids dev cache 404):
npm run build --workspace=apps/web && npm run start --workspace=apps/web
```

## Design
- Palette: navy `#0A1931`, cream `#FFFDF0`, mustard `#FFD23F`
- Brutalism smoothed: `border-2` (2px), `shadow: 4px 4px 0 #0A1931`, `Space Grotesk`/`Archivo Black`

## User Accounts & Role Simulation
- User accounts are managed via the Administration module (`/settings` or `/dashboard` Oversight flow) or Supabase Auth.
- For local interface testing across permissions, use the in-app **Simulate Role** switcher in the sidebar.

## Do not
- Push to `main`, force-push, skip issue, edit workflow docs without an issue.

## Recommendations tracked in #1
- Branch protection, CODEOWNERS, labels, Vercel alias `costview-peach.vercel.app`.
