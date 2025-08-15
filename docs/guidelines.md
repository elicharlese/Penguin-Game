# Penguin Surf Game - Development Guidelines

## 1. Code Style (tag: CS)

- ✅ All code must be written in **TypeScript** (never use `.js` unless auto‑generated).
- UI must use **React + Tailwind CSS**, with atomic component design and **PascalCase filenames**.
- Use **named exports** only; barrel files are allowed *only* as `index.ts` within a folder.
- Apply **Zod** (or equivalent) for runtime validation; keep types in `src/types/` for reuse.

## 2. Project Structure & App Generation (tag: PS)

```
apps/            # Nx-managed platforms (React web + Expo mobile/desktop)
libs/            # Shared TS code, UI libs, hooks, test utilities
tools/           # Generators, CLI helpers, scripts
docs/
├─ guidelines.md
├─ END_GOAL.md
├─ architecture/   # Mermaid C4 diagrams (context, containers, components)
├─ patches/
└─ batches/
public/
scripts/
README.md
```

## 3. CLI Flag Enforcement (tag: CS/BR)

All CLI scaffolding commands must include explicit, non-interactive flags:

```bash
npx create-nx-workspace @penguin-surf-game/penguin-surf-game \
  --preset=react-ts \
  --appName=web \
  --style=css \
  --defaultBase=main \
  --no-interactive
```

```bash
nx g @nx/expo:app mobile --no-interactive
```

## 4. Dev Flow: Patches & Batches (tag: DF)

1. Use patch/batch cycles:
 • Patch folders at /docs/patches/patch-N/: with PATCHN_CHECKLIST.md and PATCHN_SUMMARY.md
 • Batch folders at /docs/batches/batch-N/: with BATCHN_CHECKLIST.md and BATCHN_SUMMARY.md
2. Patch-level sequence should be:
 /plan-feature-set → develop → AI auto-check (lint, typecheck, test, build) → commit & tag → DemoMode
 • On failure, AI writes PATCHN_ISSUES.md, and waits.
3. Once all patch checklists are done, update the batch summary and close the batch.

## 5. Documentation & End Goal (tag: DS)

 • The file docs/guidelines.md is the source of truth for naming, checklist structure, CLI flags (Section 5 in guidelines), and architecture folder policy.
 • All patch and batch files must match the formatting in guidelines.md.
 • END_GOAL.md (located at repo root) contains final product criteria. AI may read but never modify it.
 • Each feature in patches must map back to items in END_GOAL.md.

## 6. AI Autonomy & Self‑Check (tag: AI)

Before concluding a patch:
 • AI must verify all code compiles and avoids any.
 • Ensure UI uses React + Tailwind (no inline styles, atomic pattern).
 • Validate test coverage ≥90% for modifications.
 • Confirm all CLI commands used match default flags policy.
 • If not, AI stops and populates PATCHN_ISSUES.md with a table of failed checks.

## 7. Branching for Stack Deviations (tag: BR)

For unusual tech decisions (e.g. Flutter, custom RN, backend stack):

1. Create proposed-tech/<name> branch with:

- Minimal working CLI-generated POC

- Markdown rationale (pros/cons, maintenance)

2. Await human review before further development.
3. If approved, merge into patch branch, update patch summary, and revise global_rules.md if necessary.

## 8. Versioning & Semantic Tags (tag: TG)

- Commit messages must include tags like: CS, PS, DF, AI, DS, BR
- feat[patch-3](CS, DF): scaffold Expo mobile+web app using Nx and default flags
- Versions must follow semantic-release (e.g., v0.1.0 for patch/batch milestones), generated on merge to main.

## 9. Architecture Documentation

All architecture decisions must be documented in Mermaid C4 diagrams in the /docs/architecture/ directory.

## 10. Patch and Batch Structure

Each patch and batch must follow the structure defined in this document with proper checklist and summary files.
