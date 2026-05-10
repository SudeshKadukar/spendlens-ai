# DEVLOG

## Day 1 — 2026-05-10

Hours worked: 1

What I did:
- Initialized Next.js project with TypeScript, Tailwind, and ESLint.
- Set up project structure and required markdown files.
- Created implementation plan and task list.
- Initialized local Git repository.

What I learned:
- Next.js naming restrictions for project initialization (must be lowercase and no spaces).

Blockers / what I'm stuck on:
- None currently.

Plan for tomorrow:
- Build the spend input form with localStorage persistence.

## Day 2 — 2026-05-10

Hours worked: 2

What I did:
- Built the `SpendForm` component with tool selection, plans, seats, and monthly spend inputs.
- Implemented `localStorage` persistence to save the user's form state.
- Updated the landing page (`page.tsx`) to include the form and a "How it works" section.
- Defined core types in `src/lib/types.ts`.
- Installed `uuid` for generating unique IDs for tool rows.

What I learned:
- Integrating dynamic form rows in React with local state and persisting to `localStorage` using `useEffect`.

Blockers / what I'm stuck on:
- The actual audit logic is a placeholder alerting the user. Need to implement the deterministic engine tomorrow.

Plan for tomorrow:
- Create the deterministic audit engine.
- Write tests for the engine.
- Set up the initial `pricing.ts` data source.

## Day 3 — 2026-05-10

Hours worked: 3

What I did:
- Created `src/lib/pricing.ts` with hardcoded pricing data sourced from `PRICING_DATA.md`.
- Implemented the deterministic audit engine (`src/lib/auditEngine.ts`) with logic for overspend, small team downgrade, tool consolidation, and high API spend.
- Set up `vitest` and wrote 6 tests covering all major rules of the audit engine. All tests passed.

What I learned:
- Writing a deterministic, rule-based engine in pure TypeScript without relying on external APIs keeps tests extremely fast and logic highly transparent.

Blockers / what I'm stuck on:
- The UI currently does not display the audit results. It just alerts that it is not implemented.

Plan for tomorrow:
- Build the `AuditResults` component to display total savings and individual recommendations.
- Integrate the audit engine into `SpendForm.tsx` to handle the submit action.
