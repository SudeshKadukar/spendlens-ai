# ARCHITECTURE

## System Diagram
(Add mermaid diagram here)

## Data Flow
1. **Input**: User enters tool spend data via `SpendForm`.
2. **Audit**: `auditEngine.ts` processes data against `pricing.ts` rules.
3. **Storage**: Audit result is saved to Supabase `audits` table.
4. **Summary**: `api/summary` calls Anthropic/OpenAI to generate a personalized audit summary.
5. **Lead Capture**: User provides email, saved to Supabase `leads` table; confirmation sent via Resend.
6. **Public View**: Shareable URL fetches audit data (sanitized) from Supabase.

## Technology Choices
- **Next.js**: Unified frontend and backend, server-side rendering for OG previews.
- **Supabase**: Rapid database setup with built-in auth and real-time capabilities.
- **Tailwind CSS**: Modern styling with utility-first approach.
- **Vitest**: Fast unit testing.

## Scalability
To scale to 10k audits/day:
- **Rate Limiting**: Implement Redis-based rate limiting on API routes.
- **Database Indexing**: Optimize Supabase queries on `public_id`.
- **Edge Functions**: Move audit calculations to Next.js Edge Runtime where possible.
- **Caching**: Cache pricing data and AI summaries.
