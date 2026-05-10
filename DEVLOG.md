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

## Day 4 — 2026-05-10

Hours worked: 2

What I did:
- Built the `AuditResults` component to display total monthly savings and annual savings.
- Implemented logic to map over the engine's recommendations and display them with distinct visual badges.
- Conditionally rendered a "Credex CTA" for savings > $500/month, and an honest "Perfect Score" or "Doing great" message for minimal savings.
- Updated `SpendForm.tsx` to actually execute `runAudit()` on submit and conditionally render the `AuditResults`.
- Added a reset button to allow users to audit another stack.

What I learned:
- Using dynamic styling based on action types (Keep, Downgrade, Consolidate) creates a very clear, scannable UI.

Blockers / what I'm stuck on:
- We don't have database persistence yet, so results are ephemeral. We need Supabase.

Plan for tomorrow:
- Set up Supabase and `audits` / `leads` tables.
- Add an API route to save audit results.
- Create lead capture form.

## Day 5 — 2026-05-10

Hours worked: 2.5

What I did:
- Installed `@supabase/supabase-js`.
- Created `src/lib/supabase.ts` for database connections.
- Designed `schema.sql` to track the schemas for `audits` and `leads` along with Row Level Security policies.
- Built `POST /api/audit` to run the engine server-side, save to Supabase, and return a unique `publicId`.
- Built `POST /api/lead` with an IP-based rate limiter and honeypot field for basic spam protection.
- Created `LeadCapture.tsx` and integrated it into `AuditResults.tsx`.
- Updated `SpendForm.tsx` to call the `/api/audit` route.

What I learned:
- Building a simple memory-based rate limiter map in a Next.js App Router API route.
- Integrating invisible honeypots (`tabIndex={-1}`) to filter bots without annoying users with CAPTCHAs.

Blockers / what I'm stuck on:
- Lead capture API works but doesn't send the Resend email yet.

Plan for tomorrow:
- Create the public shareable audit URL (`/audit/[id]`).
- Implement the Anthropic/OpenAI summary generation using `api/summary` or directly in the audit API.
- Set up Open Graph tags for shareability.

## Day 6 — 2026-05-10

Hours worked: 2

What I did:
- Created the public audit page `/audit/[id]/page.tsx` that fetches the `publicId` from Supabase and strips private data.
- Built a fallback UI for the public page in case Supabase is not configured yet.
- Developed `src/app/api/summary/route.ts` to connect to OpenAI's API for the personalized 100-word summary, with a robust fallback.
- Added dynamic Open Graph tags and an `opengraph-image.tsx` using `next/og` for beautiful Twitter/X shares.
- Finalized the LLM prompts in `PROMPTS.md` and `src/lib/summaryPrompt.ts`.

What I learned:
- `next/og` makes programmatic social card generation incredibly fast. It is perfect for viral loops where every audit generates a unique image.

Blockers / what I'm stuck on:
- Vercel deployment and Resend email are the last remaining steps.

Plan for tomorrow:
- Complete all remaining markdown files (GTM, ECONOMICS, etc.).
- Deploy on Vercel.
- Verify Lighthouse scores and final testing.
