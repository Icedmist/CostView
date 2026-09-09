# Workflow — CostView

## Source of truth
`AGENTS.md` (root). This file expands it.

## Issue → Branch → PR
1. **Issue**: `gh issue create --title "feat: …" --label enhancement` (or `bug`/`chore`). Include acceptance checkbox list.
2. **Branch**: `git checkout main && git pull && git checkout -b <type>/issue-<n>-<slug>` e.g. `feat/issue-12-landing-faq`
3. **Commit**: Conventional + `(#<n>)` in subject; body `Closes #<n>`
4. **Push**: `git push -u origin <branch>`
5. **PR**: `gh pr create --title "feat: … (#<n>)" --body "Closes #<n>" --base main` — fill What/Why/Test/Preview.
6. **Merge**: squash, delete branch. Do **not** merge if checks fail.

## Branch protection (to be enabled)
```
main:
  required_pull_request_reviews: 1
  dismiss_stale_reviews: true
  required_status_checks: [Vercel, build]
  enforce_admins: false
  allow_force_pushes: false
```
Set via: `gh api repos/Icedmist/CostView/branches/main/protection -X PUT --input protection.json`

## Commit types
`feat`, `fix`, `chore`, `docs`, `refactor`, `test`

## Env
- Vercel is link: `iced-mist-s-projects/costview`
- `vercel env ls` / `vercel env add KEY env --value "…" --yes [--sensitive|--no-sensitive]`
- After env change, `vercel --prod --yes` (also auto on push to main)

## Agents checklist before edit
- [ ] Read `AGENTS.md`
- [ ] Issue exists?
- [ ] On correct branch?
- [ ] `npm run build` passes?

## Design
- Landing: heavy brutalism `border-[3px]` `shadow 6px 6px`
- App: softened `border-2` `shadow 4px 4px`, `p-6`, `text-sm/base`, mobile cards, larger tap targets
