# AGENTS — CostView Workflow (READ FIRST)

**Rule: No direct pushes to `main`. Every change = Issue → Branch → PR → Merge.**

## 1. Before any fix/feature
```bash
gh issue create --title "<scope>: <short>" --body "Closes via PR" --label enhancement
# note issue number #<n>
git checkout main && git pull
git checkout -b feat/issue-<n>-<slug>   # or fix/
```

## 2. Commit
- Conventional: `feat(scope): … (#<n>)`, `fix(scope): … (#<n>)`, `chore: … (#<n>)`
- Reference issue in commit body: `Closes #<n>`

## 3. Push + PR
```bash
git push -u origin feat/issue-<n>-<slug>
gh pr create --title "feat: … (#<n>)" --body "Closes #<n>

- What, why, how tested
- Vercel preview URL" --base main
```

## 4. Merge
- Require 1 review + Vercel/build checks (branch protection on `main`)
- Squash-merge, delete branch: `gh pr merge --squash --delete-branch`
- Auto-deploy to https://costview-peach.vercel.app

## 5. Env & Deploy
- Env lives in Vercel: `vercel env ls` (linked `iced-mist-s-projects/costview`)
- Local: `costview360/apps/web/.env.local` (gitignored)
- `DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_*`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL`
- After `vercel env add`, redeploy: `vercel --prod --yes`

## 6. Stack Context
- Next.js 14 at `costview360/apps/web` (`npm run build --workspace=apps/web`)
- Supabase `wtrxamprkfjbatrsszep` (eu-central-1), 25 tables, RLS on
- Design: navy `#0A1931` + cream `#FFFDF0` + mustard `#FFD23F`, smoothed brutalism (2px, 4px shadow)

## 7. Never
- Push to `main`, force-push, skip issue, or edit `AGENTS.md`/`.github/WORKFLOW.md` without a new issue.

See `.github/WORKFLOW.md` and `.github/CONTRIBUTING.md` for full detail.
